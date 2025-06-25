// app/api/ai/generate-insights/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Interaction from '@/models/Interaction';
import { kv } from '@vercel/kv';
import mongoose from 'mongoose';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// --- NEW: Google Gemini Setup ---
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
}
const genAI = new GoogleGenerativeAI(apiKey);
// Use a model that supports JSON output well, like gemini-1.5-flash
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    generationConfig: {
      responseMimeType: "application/json", // This is crucial for structured output
    },
});

// Zod schema for a single recommendation (from the AI)
const StudyRecommendationSchema = z.object({
  title: z.string(),
  description: z.string().describe("A one-sentence description of the recommended activity."),
  reasoning: z.string().describe("The AI's reasoning for this recommendation based on user data."),
  actionText: z.string().describe("Short, actionable button text, e.g., 'Review Topic', 'Start Quiz'"),
  contentId: z.string().optional().describe("The MongoDB _id of the content to link to."), 
});

// Zod schema for the entire AI response object
const AIInsightsSchema = z.object({
  strengths: z.array(z.string()).describe("A list of 2-3 key strengths based on the user's performance."),
  weaknesses: z.array(z.string()).describe("A list of 2-3 key weaknesses or areas needing focus."),
  aiRecommendations: z.array(StudyRecommendationSchema),
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const requestUrl = new URL(request.url);

  // --- Caching Logic (Unchanged) ---
  const cacheKey = `ai-insights:${userId}`;
  try {
    const cachedData = await kv.get<z.infer<typeof AIInsightsSchema>>(cacheKey);
    if (cachedData) {
      console.log(`CACHE HIT for AI insights: user ${userId}`);
      return NextResponse.json(cachedData);
    }
  } catch (kvError) {
    console.error("Vercel KV error on GET:", kvError);
  }
  console.log(`CACHE MISS for AI insights: user ${userId}`);


  try {
    await connectDB();

    // --- Data Aggregation Phase (Unchanged) ---
    const recommendationsResponse = await fetch(`${requestUrl.origin}/api/recommendations`, {
        headers: { 'Cookie': request.headers.get('cookie') || '' }
    });
    if (!recommendationsResponse.ok) throw new Error('Failed to fetch algorithmic recommendations');
    const topRankedContent = await recommendationsResponse.json();

    const interactionStats = await Interaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalStudyDuration: { $sum: "$durationSeconds" }, totalSessions: { $sum: { $cond: [{ $eq: ["$eventType", "start"] }, 1, 0] } } } }
    ]);
    const stats = interactionStats[0] || { totalStudyDuration: 0, totalSessions: 0 };

    // --- Prompt Engineering Phase for Gemini ---
    const userDataSummary = `
      User's Overall Stats:
      - Total study time: ${Math.round(stats.totalStudyDuration / 60)} minutes.
      - Total study sessions started: ${stats.totalSessions}.

      Top 5 Algorithmically-Ranked Content Recommendations:
      These are items the user should focus on next, based on their detailed engagement (struggle, progress, etc.).
      ${topRankedContent.slice(0, 5).map((item: any, index: number) => 
        `${index + 1}. Title: "${item.title}" (Content ID: ${item._id}). Reason: This content was identified as high-priority.`
      ).join('\n')}
    `;

    const prompt = `
      You are an expert, encouraging learning coach named LumoAI. Your task is to analyze a student's learning data and generate a structured JSON object containing personalized insights.
      Your tone should be positive and motivating.
      Based on the provided data summary, generate a JSON response that strictly adheres to the following JSON schema. Do not include any other text or markdown formatting like \`\`\`json.
      
      JSON Schema:
      ${JSON.stringify(zodToJsonSchema(AIInsightsSchema))}

      User Data Summary:
      ${userDataSummary}
    `;

    // --- Google Gemini API Call ---
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    
    if (!responseText) {
      throw new Error("Gemini AI did not return a valid response text.");
    }
    
    // --- Parse, Validate, and Cache ---
    // The responseText should already be a stringified JSON object because of the responseMimeType config.
    const insights = AIInsightsSchema.parse(JSON.parse(responseText));

    try {
        await kv.set(cacheKey, insights, { ex: 3600 });
    } catch (kvError) {
        console.error("Vercel KV error on SET:", kvError);
    }

    return NextResponse.json(insights);

  } catch (error) {
    console.error('[AI_INSIGHTS_ERROR]', error);
    // Check for specific Gemini errors if needed
    return NextResponse.json({ error: 'Internal Server Error generating AI insights' }, { status: 500 });
  }
}

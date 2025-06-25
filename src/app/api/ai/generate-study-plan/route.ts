// app/api/ai/generate-study-plan/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { kv } from '@vercel/kv';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// --- Google Gemini Setup ---
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    generationConfig: {
      responseMimeType: "application/json",
    },
});

// --- Zod Schema for the AI's output ---
// This must match the `StudySession` interface in the frontend component.
const StudySessionSchema = z.object({
  id: z.string().describe("The unique contentId from the recommendation list."),
  subject: z.string().describe("The main subject of the content, inferred from tags or title."),
  topic: z.string().describe("The specific title of the content."),
  duration: z.number().min(5).max(90).describe("The recommended study duration in minutes (e.g., 25, 45, 60)."),
  type: z.enum(["focus", "review", "practice", "break"]).describe("The type of study session."),
  difficulty: z.enum(["easy", "medium", "hard"]).describe("The difficulty level of the content."),
  aiReasoning: z.string().describe("A brief, encouraging reason for why this session is recommended now."),
});

// The final plan is an array of these sessions
const StudyPlanSchema = z.array(StudySessionSchema);

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const requestUrl = new URL(request.url);

  // --- Caching Logic ---
  // A daily study plan should be cached for a longer period, e.g., 8 hours.
  const cacheKey = `study-plan:${userId}:${new Date().toISOString().split('T')[0]}`; // Daily cache key
  try {
    const cachedData = await kv.get<z.infer<typeof StudyPlanSchema>>(cacheKey);
    if (cachedData) {
      console.log(`CACHE HIT for study plan: user ${userId}`);
      return NextResponse.json(cachedData);
    }
  } catch (kvError) {
    console.error("Vercel KV error on GET:", kvError);
  }
  console.log(`CACHE MISS for study plan: user ${userId}`);

  try {
    // --- Data Aggregation ---
    // Fetch the top-ranked content for the user from our powerful recommendations API
    const recommendationsResponse = await fetch(`${requestUrl.origin}/api/recommendations`, {
        headers: { 'Cookie': request.headers.get('cookie') || '' }
    });
    if (!recommendationsResponse.ok) throw new Error('Failed to fetch algorithmic recommendations');
    const topRankedContent = await recommendationsResponse.json();

    if (!topRankedContent || topRankedContent.length < 2) {
        return NextResponse.json([], { status: 200 }); // Return empty plan if not enough data
    }

    // --- Prompt Engineering for Gemini ---
    const contentForPrompt = topRankedContent.slice(0, 3).map((item: any) => ({
      id: item._id,
      title: item.title,
      difficulty: item.difficulty,
      subject: item.tags?.[0] || 'General', // Use the first tag as the subject
    }));

    const prompt = `
      You are an expert learning scheduler. Your task is to create a structured and effective study plan for a student for today.
      
      Here are the top 3 recommended topics for the student, based on their learning patterns. Each topic has an id, title, difficulty, and subject:
      ${JSON.stringify(contentForPrompt)}

      Please generate a study plan consisting of 4 total sessions. This plan should include the 3 provided topics and one 15-minute "break" session.
      Arrange the sessions in a logical order. For example, place harder topics when a user is likely fresh, and schedule a break after an intense session.
      Assign a session type ('focus' for new/hard topics, 'review' or 'practice' for others).
      Assign a reasonable duration in minutes for each session (e.g., 25, 30, 45, 60).
      
      You MUST return your response as a valid JSON array that strictly adheres to the following JSON schema. Do not include any other text or markdown formatting.

      JSON Schema for the array elements:
      ${JSON.stringify(zodToJsonSchema(StudySessionSchema))}
    `;

    // --- Google Gemini API Call ---
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    
    if (!responseText) {
      throw new Error("Gemini AI did not return a valid study plan.");
    }

    // --- Parse, Validate, and Cache ---
    const studyPlan = StudyPlanSchema.parse(JSON.parse(responseText));

    try {
        await kv.set(cacheKey, studyPlan, { ex: 28800 }); // Cache for 8 hours
    } catch (kvError) {
        console.error("Vercel KV error on SET:", kvError);
    }

    return NextResponse.json(studyPlan);

  } catch (error) {
    console.error('[STUDY_PLAN_API_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error generating study plan' }, { status: 500 });
  }
}

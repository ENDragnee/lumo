// app/api/ai/generate-insights/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Interaction from '@/models/Interaction';
import mongoose from 'mongoose';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { GoogleGenerativeAI } from "@google/generative-ai";
import redis from '@/lib/redis'; // Import our Redis client

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: { responseMimeType: "application/json" },
});

const StudyRecommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  reasoning: z.string(),
  actionText: z.string(),
  contentId: z.string().optional(), 
});

const AIInsightsSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  aiRecommendations: z.array(StudyRecommendationSchema),
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const requestUrl = new URL(request.url);

  const aiCacheKey = `ai-insights:${userId}`;
  try {
    const cachedData = await redis.get(aiCacheKey);
    if (cachedData) {
      console.log(`CACHE HIT (L2): Returning AI insights for user ${userId} from Redis.`);
      return NextResponse.json(JSON.parse(cachedData));
    }
  } catch (redisError) { console.error("Redis L2 GET error:", redisError); }
  console.log(`CACHE MISS (L2): AI insights for user ${userId}`);

  try {
    let topRankedContent: any[];
    const recommendationsCacheKey = `recommendations:${userId}`;
    try {
        const cachedRecs = await redis.get(recommendationsCacheKey);
        if (cachedRecs) {
            console.log(`CACHE HIT (L1): Using cached recommendations for user ${userId}`);
            topRankedContent = JSON.parse(cachedRecs);
        } else {
            console.log(`CACHE MISS (L1): Fetching fresh recommendations for user ${userId}`);
            const recommendationsResponse = await fetch(`${requestUrl.origin}/api/recommendations`, {
                headers: { 'Cookie': request.headers.get('cookie') || '' }
            });
            if (!recommendationsResponse.ok) throw new Error('Failed to fetch algorithmic recommendations');
            topRankedContent = await recommendationsResponse.json();
            // No need to set cache here, the recommendations API does it itself.
        }
    } catch (redisError) {
        console.error("Redis L1 GET error, fetching fresh recommendations as fallback.", redisError);
        const recommendationsResponse = await fetch(`${requestUrl.origin}/api/recommendations`, {
            headers: { 'Cookie': request.headers.get('cookie') || '' }
        });
        if (!recommendationsResponse.ok) throw new Error('Fallback fetch failed for algorithmic recommendations');
        topRankedContent = await recommendationsResponse.json();
    }

    await connectDB();
    const interactionStats = await Interaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalStudyDuration: { $sum: "$durationSeconds" }, totalSessions: { $sum: { $cond: [{ $eq: ["$eventType", "start"] }, 1, 0] } } } }
    ]);
    const stats = interactionStats[0] || { totalStudyDuration: 0, totalSessions: 0 };

    const userDataSummary = `
      User's Overall Stats:
      - Total study time: ${Math.round(stats.totalStudyDuration / 60)} minutes.
      - Total study sessions started: ${stats.totalSessions}.
      Top 5 Algorithmically-Ranked Content Recommendations:
      ${topRankedContent.slice(0, 5).map((item: any, index: number) => 
        `${index + 1}. Title: "${item.title}" (Content ID: ${item._id}).`
      ).join('\n')}
    `;

    const prompt = `
      You are an expert learning coach. Generate a JSON object with personalized insights based on the user data. Your tone must be positive. Strictly adhere to the following JSON schema, without any markdown.
      JSON Schema: ${JSON.stringify(zodToJsonSchema(AIInsightsSchema))}
      User Data: ${userDataSummary}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    if (!responseText) throw new Error("Gemini AI did not return a valid response text.");
    
    const insights = AIInsightsSchema.parse(JSON.parse(responseText));
    
    await redis.set(aiCacheKey, JSON.stringify(insights), 'EX', 3600);

    return NextResponse.json(insights);

  } catch (error) {
    console.error('[AI_INSIGHTS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error generating AI insights' }, { status: 500 });
  }
}

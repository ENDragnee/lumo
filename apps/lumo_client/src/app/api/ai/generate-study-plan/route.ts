// app/api/ai/generate-study-plan/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
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

const StudySessionSchema = z.object({
  id: z.string(),
  subject: z.string(),
  topic: z.string(),
  duration: z.number(),
  type: z.enum(["focus", "review", "practice", "break"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  aiReasoning: z.string(),
});

const StudyPlanSchema = z.array(StudySessionSchema);

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const requestUrl = new URL(request.url);

  const planCacheKey = `study-plan:${userId}:${new Date().toISOString().split('T')[0]}`;
  try {
    const cachedData = await redis.get(planCacheKey);
    if (cachedData) {
        console.log(`CACHE HIT (L2): Returning study plan for user ${userId} from Redis.`);
        return NextResponse.json(JSON.parse(cachedData));
    }
  } catch (redisError) { console.error("Redis L2 GET error:", redisError); }
  console.log(`CACHE MISS (L2): Daily study plan for user ${userId}`);

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
        }
    } catch (redisError) {
        console.error("Redis L1 GET error, fetching fresh as fallback.", redisError);
        const recommendationsResponse = await fetch(`${requestUrl.origin}/api/recommendations`, {
            headers: { 'Cookie': request.headers.get('cookie') || '' }
        });
        if (!recommendationsResponse.ok) throw new Error('Fallback fetch failed');
        topRankedContent = await recommendationsResponse.json();
    }
    
    if (!topRankedContent || topRankedContent.length < 2) {
        return NextResponse.json([], { status: 200 });
    }

    const contentForPrompt = topRankedContent.slice(0, 3).map((item: any) => ({
      id: item._id,
      title: item.title,
      difficulty: item.difficulty,
      subject: item.tags?.[0] || 'General',
    }));

    const prompt = `
      You are an expert learning scheduler. Create a 4-session study plan for today. Include the 3 provided topics and one 15-minute "break" session. Arrange sessions logically. Assign types ('focus', 'review') and durations (25-60 mins).
      Respond as a valid JSON array that strictly adheres to this schema, with no markdown:
      ${JSON.stringify(zodToJsonSchema(StudyPlanSchema))}
      Top 3 Recommended Topics:
      ${JSON.stringify(contentForPrompt)}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    if (!responseText) throw new Error("Gemini AI did not return a valid study plan.");

    const studyPlan = StudyPlanSchema.parse(JSON.parse(responseText));

    await redis.set(planCacheKey, JSON.stringify(studyPlan), 'EX', 28800);

    return NextResponse.json(studyPlan);

  } catch (error) {
    console.error('[STUDY_PLAN_API_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error generating study plan' }, { status: 500 });
  }
}

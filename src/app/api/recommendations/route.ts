// app/api/recommendations/route.ts

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content, { IContent } from '@/models/Content';
import User, { IUser } from '@/models/User';
import Interaction from '@/models/Interaction';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import redis from '@/lib/redis'; // Import our new Redis client

// --- TYPE DEFINITIONS for clarity and type safety ---
interface EngagementData {
  totalDuration: number;
  maxProgress: number;
  sessionCount: number;
  lastAccessedAt: Date;
}

interface AggregatedContentResult extends IContent {
    relevance: number;
    progress: number;
    lastAccessedAt?: Date;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !mongoose.Types.ObjectId.isValid(session.user.id)) {
      return NextResponse.json({ error: 'Unauthorized or invalid user ID' }, { status: 401 });
  }
  const userId = session.user.id;
  const userIdObject = new mongoose.Types.ObjectId(userId);

  // --- Caching Logic ---
  const cacheKey = `recommendations:${userId}`;
  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`CACHE HIT: Returning recommendations for user ${userId} from Redis.`);
      return NextResponse.json(JSON.parse(cachedData));
    }
  } catch (redisError) {
    console.error("Redis GET error in /recommendations:", redisError);
    // If Redis fails, we'll proceed to generate fresh data.
  }

  console.log(`CACHE MISS: Generating fresh recommendations for user ${userId}.`);

  try {
    await connectDB();

    // ===================================================================================
    // PHASE 1: PRE-CALCULATE USER-SPECIFIC DATA & ENGAGEMENT SCORES
    // ===================================================================================
    let userInterestTags: string[] = [];
    const userEngagementScores = new Map<string, EngagementData>();
    let isUserStruggling = false;

    if (userIdObject) {
      const user = await User.findById(userIdObject).select('dynamicInterests');
      if (user?.dynamicInterests) {
        userInterestTags = Array.from(user.dynamicInterests.keys());
      }
      
      const engagementPipeline: mongoose.PipelineStage[] = [
        { $match: { userId: userIdObject } },
        {
          $group: {
            _id: "$contentId",
            totalDuration: { $sum: { $ifNull: ["$durationSeconds", 0] } },
            maxProgress: { $max: { $ifNull: ["$endProgress", 0] } },
            sessionCount: { $sum: { $cond: [{ $eq: ["$eventType", "start"] }, 1, 0] } },
            lastAccessedAt: { $max: "$timestamp" }
          }
        }
      ];
      const engagementResults: ({ _id: mongoose.Types.ObjectId } & EngagementData)[] = await Interaction.aggregate(engagementPipeline).exec();
      
      for (const item of engagementResults) {
        userEngagementScores.set(item._id.toString(), {
          totalDuration: item.totalDuration,
          maxProgress: item.maxProgress,
          sessionCount: item.sessionCount,
          lastAccessedAt: item.lastAccessedAt,
        });
        if (item.totalDuration > 300 && item.maxProgress < 50) {
            isUserStruggling = true;
        }
      }
    }

    // ===================================================================================
    // PHASE 2: MAIN RECOMMENDATION PIPELINE
    // ===================================================================================
    const mainPipeline: mongoose.PipelineStage[] = [
      { $match: { isDraft: { $ne: true }, isTrash: { $ne: true } } },
      {
        $addFields: {
          safeTags: { $ifNull: ["$tags", []] },
          safeViews: { $ifNull: ["$views", 0] },
          safePassRate: { $ifNull: ["$passRate", 0] },
          safeSaves: { $ifNull: ["$userEngagement.saves", 0] },
          safeShares: { $ifNull: ["$userEngagement.shares", 0] },
          safeCreatedAt: { $ifNull: ["$createdAt", new Date(0)] },
          matchScore: { $size: { $ifNull: [{ $setIntersection: ["$tags", userInterestTags] }, []] } },
          difficultyScore: { $switch: { branches: [ { case: { $eq: ["$difficulty", "hard"] }, then: 3 }, { case: { $eq: ["$difficulty", "medium"] }, then: 2 }, { case: { $eq: ["$difficulty", "easy"] }, then: 1 } ], default: 2 } }
        }
      },
      {
        $addFields: {
          baseRelevance: {
            $add: [
              { $multiply: ["$matchScore", 0.40] },
              { $multiply: ["$safePassRate", 0.15] },
              { $multiply: [ { $max: [0, { $subtract: [1, { $divide: [{ $subtract: [new Date(), "$safeCreatedAt"] }, (60 * 24 * 60 * 60 * 1000)] }] }] }, 0.20 ] },
              { $multiply: ["$safeViews", 0.10] },
              { $multiply: [{$add: ["$safeSaves", "$safeShares"]}, 0.15] },
            ]
          }
        }
      },
      { $sort: { baseRelevance: -1 } },
      { $limit: 100 }, 
      ...(userIdObject ? [{
        $lookup: {
          from: "progresses", // Use the actual collection name
          let: { contentId: "$_id" },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ["$contentId", "$$contentId"] }, { $eq: ["$userId", userIdObject] }] } } },
            { $limit: 1 },
            { $project: { _id: 0, progress: 1 } }
          ],
          as: "userProgressData"
        }
      }] : []),
      {
        $project: {
          _id: 1, title: 1, thumbnail: 1, tags: "$safeTags", description: 1,
          difficulty: 1,
          relevance: "$baseRelevance",
          progress: { $ifNull: [{ $arrayElemAt: ["$userProgressData.progress", 0] }, 0] }
        }
      }
    ];
    let candidateResults: AggregatedContentResult[] = await Content.aggregate(mainPipeline).exec();

    // ===================================================================================
    // PHASE 3: RE-RANK RESULTS WITH DYNAMIC ENGAGEMENT & SPACED REPETITION
    // ===================================================================================
    if (userIdObject) {
      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      candidateResults.forEach(item => {
        const engagement = userEngagementScores.get((item._id as mongoose.Types.ObjectId).toString());
        let engagementBonus = 0;
        if (item.progress >= 95) {
          engagementBonus -= 100.0;
        } else if (isUserStruggling) {
            if (item.difficulty === 'easy') { engagementBonus += 2.0; } 
            else if (item.difficulty === 'hard') { engagementBonus -= 1.5; }
        }
        if (engagement) {
          item.lastAccessedAt = engagement.lastAccessedAt;
          if (engagement.totalDuration > 300 && item.progress < 50) { engagementBonus += 5.0; } 
          else if (engagement.totalDuration > 120 && item.progress < 85) { engagementBonus += 1.5; }
          if (engagement.lastAccessedAt) {
            const daysSinceAccess = (now - engagement.lastAccessedAt.getTime()) / oneDay;
            if (daysSinceAccess > 7 && daysSinceAccess <= 21) { engagementBonus += 2.5; } 
            else if (daysSinceAccess > 3) { engagementBonus += 1.0; }
          }
        }
        item.relevance = (item.relevance || 0) + engagementBonus;
      });
    }

    candidateResults.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
    const finalResults = candidateResults.slice(0, 20);

    // --- Cache the final result in Redis before returning ---
    try {
      await redis.set(cacheKey, JSON.stringify(finalResults), 'EX', 900);
    } catch (redisError) {
      console.error("Redis SET error in /recommendations:", redisError);
    }

    return NextResponse.json(finalResults);

  } catch (error: any) {
    console.error('API Recommendation Route Error:', error);
    return NextResponse.json({ message: 'Internal server error fetching recommendations.' }, { status: 500 });
  }
}

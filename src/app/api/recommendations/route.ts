// app/api/recommendations/route.ts

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content, { IContent } from '@/models/Content';
import User, { IUser } from '@/models/User';
import Progress from '@/models/Progress';
import Interaction from '@/models/Interaction';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// --- TYPE DEFINITIONS for clarity and type safety ---
interface EngagementData {
  totalDuration: number;
  maxProgress: number;
  sessionCount: number;
}

interface AggregatedContentResult extends IContent {
    relevance: number;
    progress: number;
}

export async function GET(request: Request) {
  try {
    await connectDB();

    let userIdObject: mongoose.Types.ObjectId | null = null;
    const session = await getServerSession(authOptions);

    if (session?.user?.id && mongoose.Types.ObjectId.isValid(session.user.id)) {
      userIdObject = new mongoose.Types.ObjectId(session.user.id);
    }

    // ===================================================================================
    // PHASE 1: PRE-CALCULATE USER-SPECIFIC DATA & ENGAGEMENT SCORES
    // ===================================================================================

    let userInterestTags: string[] = [];
    const userEngagementScores = new Map<string, EngagementData>();
    let isUserStruggling = false;

    if (userIdObject) {
      // FIX: Remove the .lean() call here.
      // This ensures `user.dynamicInterests` is a true Mongoose Map with a .keys() method.
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
          }
        }
      ];
      const engagementResults: ({ _id: mongoose.Types.ObjectId } & EngagementData)[] = await Interaction.aggregate(engagementPipeline).exec();
      
      for (const item of engagementResults) {
        userEngagementScores.set(item._id.toString(), {
          totalDuration: item.totalDuration,
          maxProgress: item.maxProgress,
          sessionCount: item.sessionCount,
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
          matchScore: {
            $size: { $ifNull: [{ $setIntersection: ["$tags", userInterestTags] }, []] }
          },
          difficultyScore: {
            $switch: {
              branches: [
                { case: { $eq: ["$difficulty", "hard"] }, then: 3 },
                { case: { $eq: ["$difficulty", "medium"] }, then: 2 },
                { case: { $eq: ["$difficulty", "easy"] }, then: 1 }
              ],
              default: 2
            }
          }
        }
      },
      {
        $addFields: {
          baseRelevance: {
            $add: [
              { $multiply: ["$matchScore", 0.40] },
              { $multiply: ["$safePassRate", 0.15] },
              {
                $multiply: [
                  { $max: [0, { $subtract: [1, { $divide: [{ $subtract: [new Date(), "$safeCreatedAt"] }, (60 * 24 * 60 * 60 * 1000)] }] }] },
                  0.20
                ]
              },
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
          from: Progress.collection.name,
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
    // PHASE 3: RE-RANK RESULTS WITH DYNAMIC ENGAGEMENT & CONTEXT (in JavaScript)
    // ===================================================================================
    if (userIdObject) {
      candidateResults.forEach(item => {
        const engagement = userEngagementScores.get(
          (item._id as string | mongoose.Types.ObjectId).toString()
        );
        let engagementBonus = 0;

        if (item.progress >= 95) {
          engagementBonus -= 100.0;
        } 
        else if (isUserStruggling) {
            if (item.difficulty === 'easy') {
                engagementBonus += 2.0;
            } else if (item.difficulty === 'hard') {
                engagementBonus -= 1.5;
            }
        }

        if (engagement) {
          if (engagement.totalDuration > 300 && item.progress < 50) {
            engagementBonus += 5.0;
          }
          else if (engagement.totalDuration > 120 && item.progress < 85) {
            engagementBonus += 1.5;
          }
        }
        
        item.relevance = (item.relevance || 0) + engagementBonus;
      });
    }

    candidateResults.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

    const finalResults = candidateResults.slice(0, 20);

    return NextResponse.json(finalResults);

  } catch (error: any) {
    console.error('API Recommendation Route Error:', error);
    if (error instanceof mongoose.mongo.MongoServerError) {
      console.error("MongoDB Aggregation Error Details:", error.errInfo, "Code:", error.codeName);
      return NextResponse.json(
        { message: `Database error during recommendation aggregation: ${error.codeName || 'Unknown Code'}`, details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'Internal server error fetching recommendations.', details: error.message },
      { status: 500 }
    );
  }
}

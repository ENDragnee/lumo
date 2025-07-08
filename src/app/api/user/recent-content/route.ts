// src/app/api/user/recent-content/route.ts

import { NextResponse, NextRequest } from 'next/server';
import mongoose, { Types } from 'mongoose';
import { getServerSession } from "next-auth/next";

// Libs & Helpers
import connectDB from '@/lib/mongodb';
import redis from '@/lib/redis'; // Import the configured Redis client
import { authOptions } from "@/lib/auth";

// Models
import Interaction from '@/models/Interaction';
import Content from '@/models/Content';
import Performance from '@/models/Performance';
import User from '@/models/User';

// ===================================================================================
// CONFIGURATION
// ===================================================================================
// How long the "recent content" data should be cached in seconds. 5 minutes is a good default.
const CACHE_TTL_SECONDS = 300; 

// ===================================================================================
// API Handler
// ===================================================================================

export async function GET(request: NextRequest) {
    // --- 1. AUTHENTICATION ---
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !mongoose.Types.ObjectId.isValid(session.user.id)) {
        return NextResponse.json({ error: 'Unauthorized or invalid user ID' }, { status: 401 });
    }
    const userId = session.user.id;
    const userIdObject = new mongoose.Types.ObjectId(userId);

    // --- PAGINATION & LIMITING PARAMS ---
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    // --- 2. REDIS CACHING (GET) ---
    const cacheKey = `user:recent-content:${userId}:${limit}`;
    try {
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            console.log(`CACHE HIT for recent content: ${cacheKey}`);
            // Data in Redis is a string, so we parse it back to JSON
            return NextResponse.json(JSON.parse(cachedData));
        }
    } catch (redisError) {
        // If Redis fails, we log the error but proceed to the database.
        // The caching layer should be resilient and not crash the application.
        console.error("Redis GET error in /user/recent-content:", redisError);
    }

    console.log(`CACHE MISS for recent content: ${cacheKey}. Fetching from DB.`);

    try {
        await connectDB();

        // --- 3. AGGREGATION PIPELINE (This now only runs on a cache miss) ---
        const recentContentPipeline: mongoose.PipelineStage[] = [
            { $match: { userId: userIdObject } },
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: '$contentId',
                    lastAccessedAt: { $first: '$timestamp' },
                }
            },
            { $sort: { lastAccessedAt: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: Content.collection.name,
                    localField: '_id',
                    foreignField: '_id',
                    as: 'contentDetails'
                }
            },
            { $unwind: '$contentDetails' },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ['$contentDetails', { lastAccessedAt: '$lastAccessedAt' }]
                    }
                }
            },
            { $match: { isDraft: false, isTrash: false } },
            {
                $lookup: {
                    from: User.collection.name,
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'creatorInfo'
                }
            },
            {
                $lookup: {
                    from: Performance.collection.name,
                    let: { contentId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $and: [{ $eq: ['$contentId', '$$contentId'] }, { $eq: ['$userId', userIdObject] }] } } },
                        { $limit: 1 }
                    ],
                    as: 'performanceData'
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    thumbnail: 1,
                    tags: 1,
                    lastAccessedAt: 1,
                    createdBy: {
                        _id: { $arrayElemAt: ['$creatorInfo._id', 0] },
                        name: { $arrayElemAt: ['$creatorInfo.name', 0] }
                    },
                    performance: {
                        understandingLevel: { $arrayElemAt: ['$performanceData.understandingLevel', 0] }
                    }
                }
            }
        ];
        
        const recentContent = await Interaction.aggregate(recentContentPipeline);
        
        // --- 4. REDIS CACHING (SET) ---
        // After fetching fresh data, store it in the cache for subsequent requests.
        try {
            // We stringify the JSON array to store it in Redis.
            // 'EX' sets the expiration time in seconds (Time-To-Live).
            await redis.set(cacheKey, JSON.stringify(recentContent), 'EX', CACHE_TTL_SECONDS);
        } catch (redisError) {
            // Again, log the error but don't prevent the response from being sent.
            console.error("Redis SET error in /user/recent-content:", redisError);
        }

        return NextResponse.json(recentContent);

    } catch (error: any) {
        console.error('API Recent Content Route Error:', error);
        return NextResponse.json({ message: 'Internal server error fetching recent content.' }, { status: 500 });
    }
}

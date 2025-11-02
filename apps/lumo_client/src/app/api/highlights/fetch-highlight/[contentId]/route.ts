// app/api/highlights/[contentId]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Highlight } from "@/models/Highlight";
import redis from '@/lib/redis';
import mongoose from 'mongoose';

type HightlightParams = {
  params: Promise<{
    contentId: string;
  }>
}

// Set a cache duration for highlights. 1 hour is a reasonable default.
const CACHE_EXPIRATION_SECONDS = 3600; // 1 hour

export async function GET(
    request: Request,
    { params }:  HightlightParams
) {
    const session = await getServerSession(authOptions);
    // Note: For public content, you might remove this check, but for user-specific
    // highlights, it's essential.
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contentId } = await params;
    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
        return NextResponse.json({ error: 'A valid Content ID is required' }, { status: 400 });
    }

    // Define a unique key for this content's highlights in Redis.
    const cacheKey = `highlights:${contentId}`;

    try {
        // 1. Check Redis Cache First
        const cachedHighlights = await redis.get(cacheKey);
        if (cachedHighlights) {
            console.log(`⚡️ Serving highlights from Redis cache for key: ${cacheKey}`);
            // The data is stored as a string, so we need to parse it back to JSON
            return NextResponse.json(JSON.parse(cachedHighlights));
        }

        // 2. If Cache Miss, Fetch from MongoDB
        console.log(`💿 Cache miss for key: ${cacheKey}. Fetching from MongoDB.`);
        await connectDB();

        const highlights = await Highlight.find({ 
            content_id: new mongoose.Types.ObjectId(contentId),
            // You might want to filter by user_id if highlights are private to each user
            // user_id: new mongoose.Types.ObjectId(session.user.id)
        })
        .sort({ start_offset: 'asc' }) // Sorting is good practice
        .lean(); // .lean() returns plain JS objects, which is faster

        // 3. Store the result in Redis for future requests
        // The 'EX' option sets an expiration time in seconds.
        await redis.set(cacheKey, JSON.stringify(highlights), 'EX', CACHE_EXPIRATION_SECONDS);
        console.log(`✅ Stored highlights in Redis cache for key: ${cacheKey}`);

        return NextResponse.json(highlights);

    } catch (error) {
        console.error('❌ Error fetching highlights:', error);
        return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
    }
}

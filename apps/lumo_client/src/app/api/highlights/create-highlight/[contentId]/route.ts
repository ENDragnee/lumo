// app/api/highlights/create-highlight/[contentId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Ensure you have your NextAuth options here
import connectDB from "@/lib/mongodb";
import { Highlight, IHighlight } from "@/models/Highlight"; // Import your Mongoose model
import redis from '@/lib/redis';
import mongoose from 'mongoose';

type HightlightParams = {
  params: Promise<{
    contentId: string;
  }>
}

export async function POST(
    request: NextRequest,
    { params }: HightlightParams
) {
    // 1. Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate parameters
    const { contentId } = await params;
    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
        return NextResponse.json({ error: 'A valid Content ID is required' }, { status: 400 });
    }

    try {
        // 3. Connect to the database
        await connectDB();
        
        // 4. Parse and validate the request body
        const body = await request.json();
        const { text, color, startOffset, endOffset } = body;

        if (!text || !color || typeof startOffset !== 'number' || typeof endOffset !== 'number') {
            return NextResponse.json({ error: 'Missing required fields: text, color, startOffset, endOffset' }, { status: 400 });
        }
        if (startOffset >= endOffset) {
            return NextResponse.json({ error: 'startOffset must be less than endOffset' }, { status: 400 });
        }

        // 5. Create the new highlight document
        const newHighlightData = {
            user_id: new mongoose.Types.ObjectId(session.user.id),
            content_id: new mongoose.Types.ObjectId(contentId),
            highlighted_text: text,
            color,
            start_offset: startOffset,
            end_offset: endOffset,
        };

        const newHighlight = await Highlight.create(newHighlightData);

        // 6. Invalidate the Redis cache for this content
        const cacheKey = `highlights:${contentId}`;
        await redis.del(cacheKey);
        console.log(`✅ Redis cache invalidated for key: ${cacheKey}`);

        // 7. Return the newly created highlight object
        return NextResponse.json(newHighlight, { status: 201 });

    } catch (error) {
        console.error('❌ Error creating highlight:', error);
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
    }
}

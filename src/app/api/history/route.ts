// app/api/history/route.ts

import { authOptions } from '@/lib/auth';
import mongoose from "mongoose";
import { getServerSession } from 'next-auth';
import History from "@/models/History";
import Progress from "@/models/Progress"; // Import the Progress model
import Content from "@/models/Content";   // Import the Content model for collection name
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// --- POST function remains unchanged ---
// It correctly handles recording a new view event.
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) { // Check for user.id for consistency
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectDB();

        const { searchParams } = request.nextUrl;
        const content_id = searchParams.get('id');

        if (!content_id || !mongoose.Types.ObjectId.isValid(content_id)) {
            return NextResponse.json({ error: 'Invalid content ID' }, { status: 400 });
        }
        
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const lastHistory = await History.findOne({
            user_id: session.user.id,
            content_id,
        }).sort({ viewed_at: -1 });

        const starredStatus = lastHistory?.starred_status || false;
        const starredAt = lastHistory?.starred_at || null;

        const history = await History.findOneAndUpdate(
            {
                user_id: session?.user?.id,
                content_id,
                viewed_at: { $gte: startOfDay, $lt: endOfDay },
            },
            {
                user_id: session?.user?.id,
                content_id,
                viewed_at: now,
                starred_status: starredStatus,
                starred_at: starredAt,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        return NextResponse.json(history, { status: 200 });
    } catch (error) {
        console.error("Error updating history:", error);
        const message = error instanceof Error ? error.message : 'Failed to record history';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}


// --- Updated GET function with Aggregation Pipeline ---
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !mongoose.Types.ObjectId.isValid(session.user.id)) {
        return NextResponse.json({ error: 'Unauthorized or invalid user ID' }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(session.user.id);

    try {
        await connectDB();

        const { searchParams } = request.nextUrl;
        const limitParam = searchParams.get('limit');
        let queryLimit = 50; // Default limit

        if (limitParam !== null) {
            const parsedLimit = parseInt(limitParam, 10);
            if (!isNaN(parsedLimit) && parsedLimit >= 0) {
                queryLimit = parsedLimit;
            }
        }

        console.log(`Fetching history for user ${userId} with limit: ${queryLimit === 0 ? 'None (all)' : queryLimit}`);

        // --- THE AGGREGATION PIPELINE ---
        const pipeline: mongoose.PipelineStage[] = [
            // 1. Find history records for the current user
            { $match: { user_id: userId } },
            // 2. Sort by most recently viewed
            { $sort: { viewed_at: -1 } },
            // 3. Apply the limit EARLY for performance
            { $limit: queryLimit },
            // 4. Join with the Content collection to get title, thumbnail, etc.
            {
                $lookup: {
                    from: Content.collection.name, // Use the actual collection name
                    localField: "content_id",
                    foreignField: "_id",
                    as: "contentDetails"
                }
            },
            // 5. Deconstruct the contentDetails array to make it an object
            { $unwind: "$contentDetails" },
            // 6. Join with the Progress collection to get the user's progress for this specific content
            {
                $lookup: {
                    from: Progress.collection.name,
                    let: { contentId: "$content_id" }, // Variables for the pipeline match
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$contentId", "$$contentId"] }, // Match content
                                        { $eq: ["$userId", userId] }         // Match current user
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 0, progress: 1 } } // We only need the progress field
                    ],
                    as: "progressDetails"
                }
            },
            // 7. Deconstruct the progressDetails array. If no progress exists, this will still keep the record.
            { $unwind: { path: "$progressDetails", preserveNullAndEmptyArrays: true } },
            // 8. Reshape the final output for the frontend
            {
                $project: {
                    _id: 1, // The history record's ID
                    viewed_at: 1,
                    starred_status: 1,
                    starred_at: 1,
                    // Nest the populated content details under a 'content' key
                    content: {
                        _id: "$contentDetails._id",
                        title: "$contentDetails.title",
                        thumbnail: "$contentDetails.thumbnail"
                        // Add any other fields from Content model you need here
                    },
                    // Add the progress field, defaulting to 0 if no progress record was found
                    progress: { $ifNull: ["$progressDetails.progress", 0] }
                }
            }
        ];

        // Execute the aggregation pipeline
        const historiesWithProgress = await History.aggregate(pipeline);

        return NextResponse.json(historiesWithProgress, { status: 200 });

    } catch (error) {
        console.error('Error fetching histories:', error);
        const message = error instanceof Error ? error.message : 'Failed to fetch history';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

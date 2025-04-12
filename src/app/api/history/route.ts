import { authOptions } from '@/lib/auth';
import mongoose from "mongoose";
import { getServerSession } from 'next-auth';
import History from "@/models/History";
import connectDB from '@/lib/mongodb';
// Import NextRequest for easier query param handling
import { NextRequest, NextResponse } from 'next/server';

// POST function remains the same
export async function POST(request: NextRequest) { // Use NextRequest type
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectDB();

        // Use request.nextUrl for searchParams with NextRequest
        const { searchParams } = request.nextUrl;
        const content_id = searchParams.get('id');

        // Validate content_id
        if (!content_id || !mongoose.Types.ObjectId.isValid(content_id)) {
            return NextResponse.json(
                { error: 'Invalid content ID' },
                { status: 400 }
            );
        }
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setUTCHours(23, 59, 59, 999);

        // Fetch the most recent entry for this content by the user
        const lastHistory = await History.findOne({
            user_id: session.user.id,
            content_id,
        }).sort({ viewed_at: -1 });

        // If there's a previous history, preserve starred status
        const starredStatus = lastHistory?.starred_status || false;
        const starredAt = lastHistory?.starred_at || null;

        const history = await History.findOneAndUpdate(
            {
                user_id: session?.user?.id,
                content_id,
                // Only update if viewed within the same day, otherwise create new
                viewed_at: { $gte: startOfDay, $lt: endOfDay },
            },
            {
                // Set these fields regardless of update or insert
                user_id: session?.user?.id,
                content_id,
                viewed_at: now, // Always update viewed_at
                starred_status: starredStatus, // Preserve from last known state
                starred_at: starredAt,         // Preserve from last known state
            },
            { upsert: true, new: true, setDefaultsOnInsert: true } // Ensure model defaults are set on upsert
        );
        return NextResponse.json(history, { status: 200 });
    } catch (error) {
        console.error("Error updating history:", error);
        // Provide more specific error details if possible/safe
        const message = error instanceof Error ? error.message : 'Failed to record history';
        return NextResponse.json({ error: message }, { status: 500 })
    }
}


// --- Updated GET function ---
export async function GET(request: NextRequest) { // Add request parameter
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectDB();

        // Get search parameters from the request URL
        const { searchParams } = request.nextUrl;
        const limitParam = searchParams.get('limit');

        let queryLimit = 50; // Default limit if parameter is not provided or invalid

        if (limitParam !== null) {
            const parsedLimit = parseInt(limitParam, 10);
            // Validate: use the parsed limit only if it's a non-negative integer
            // parsedLimit = 0 will mean fetch all (Mongoose .limit(0))
            if (!isNaN(parsedLimit) && parsedLimit >= 0) {
                queryLimit = parsedLimit;
            }
            // If limitParam is present but invalid (e.g., "abc", "-5"), stick to the default
        }

        console.log(`Fetching history for user ${session.user.id} with limit: ${queryLimit === 0 ? 'None (all)' : queryLimit}`);

        // Build the Mongoose query
        let query = History.find({ user_id: session?.user?.id })
            .sort({ viewed_at: -1 })
             // IMPORTANT: Populate ALL fields needed by your frontend component
             // Example: include imageUrl and subtitle if they exist on Content model
            .populate({
                path: "content_id",
                select: "title imageUrl subtitle" // Adjust fields as needed
            });

        // Apply the limit using the determined value (0 means no limit)
        query = query.limit(queryLimit);

        // Execute the query
        const histories = await query.exec();

        return NextResponse.json(histories, { status: 200 });

    } catch (error) {
        console.error('Error fetching histories:', error); // Log error with more context
        const message = error instanceof Error ? error.message : 'Failed to fetch history';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
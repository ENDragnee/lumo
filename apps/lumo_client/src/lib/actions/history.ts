"use server";

import { authOptions } from "@/lib/auth"; // Example: using Clerk for auth
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb"; // Ensure this imports your MongoDB connection
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import History from "@/models/History"; // Import your History model

export async function updateHistory(contentId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) { // Check for user.id for consistency
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectDB();

        if (!contentId || !Types.ObjectId.isValid(contentId)) {
            return NextResponse.json({ error: 'Invalid content ID' }, { status: 400 });
        }
        
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const lastHistory = await History.findOne({
            user_id: session.user.id,
            content_id: contentId,
        }).sort({ viewed_at: -1 });

        const starredStatus = lastHistory?.starred_status || false;
        const starredAt = lastHistory?.starred_at || null;

        const history = await History.findOneAndUpdate(
            {
                user_id: session?.user?.id,
                content_id: contentId,
                viewed_at: { $gte: startOfDay, $lt: endOfDay },
            },
            {
                user_id: session?.user?.id,
                content_id: contentId,
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



// app/api/analytics/weekly-activity/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Interaction from '@/models/Interaction';
import Content from '@/models/Content';
import mongoose from 'mongoose';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !mongoose.Types.ObjectId.isValid(session.user.id)) {
        return NextResponse.json({ error: 'Unauthorized or invalid user ID' }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(session.user.id);

    try {
        await connectDB();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const pipeline: mongoose.PipelineStage[] = [
            // 1. Filter for relevant interactions for the user in the last 7 days
            {
                $match: {
                    userId: userId,
                    eventType: 'end', // Only count sessions that have ended
                    timestamp: { $gte: sevenDaysAgo }
                }
            },
            // 2. Lookup content details to get the topic title
            {
                $lookup: {
                    from: Content.collection.name,
                    localField: "contentId",
                    foreignField: "_id",
                    as: "contentInfo"
                }
            },
            { $unwind: "$contentInfo" },
            // 3. Group by the date (YYYY-MM-DD format)
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
                    },
                    totalSeconds: { $sum: "$durationSeconds" },
                    // Collect a unique set of topics studied on that day
                    topics: { $addToSet: "$contentInfo.title" } 
                }
            },
            // 4. Sort by date to ensure chronological order
            { $sort: { "_id": 1 } }
        ];

        const results = await Interaction.aggregate(pipeline);

        // --- Post-processing to ensure all 7 days are present ---
        // The aggregation only returns days with activity. We need to fill in the gaps.
        const activityMap = new Map(results.map(r => [r._id, r]));
        const finalActivity = [];
        const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

        for (let i = 6; i >= 0; i--) {
            const day = new Date();
            day.setDate(day.getDate() - i);
            const dateString = day.toISOString().split('T')[0];
            const dayOfWeek = day.getDay();
            
            const activityForDay = activityMap.get(dateString);

            finalActivity.push({
                date: dateString,
                dayLabel: dayLabels[dayOfWeek],
                totalHours: activityForDay ? Math.round((activityForDay.totalSeconds / 3600) * 10) / 10 : 0, // Hours rounded to 1 decimal
                topics: activityForDay ? activityForDay.topics : []
            });
        }
        
        return NextResponse.json(finalActivity);

    } catch (error) {
        console.error('Weekly Activity API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch weekly activity' }, { status: 500 });
    }
}

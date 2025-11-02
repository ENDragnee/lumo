// app/api/analytics/charts/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
// Progress model is no longer needed for this endpoint
// import Progress from '@/models/Progress';
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

        // --- 1. Knowledge Constellation Data Aggregation (Updated to use Interactions) ---
        const knowledgePipeline: mongoose.PipelineStage[] = [
            // 1. Filter for the user's completed interactions that have a progress score
            {
                $match: {
                    userId: userId,
                    eventType: 'end',
                    endProgress: { $exists: true, $ne: null }
                }
            },
            // 2. Sort by timestamp to find the latest interaction for each content item
            { $sort: { timestamp: -1 } },
            // 3. Group by contentId to isolate the latest interaction for each piece of content
            {
                $group: {
                    _id: "$contentId",
                    latestInteraction: { $first: "$$ROOT" }
                }
            },
            // 4. Promote the nested 'latestInteraction' object to the root level
            { $replaceRoot: { newRoot: "$latestInteraction" } },
            // 5. Join with the Content collection to get content details, like tags
            {
                $lookup: {
                    from: Content.collection.name,
                    localField: "contentId",
                    foreignField: "_id",
                    as: "contentDetails"
                }
            },
            // 6. Deconstruct the contentDetails array created by $lookup
            { $unwind: "$contentDetails" },
            // 7. Deconstruct the tags array to process each tag individually
            { $unwind: "$contentDetails.tags" },
            // 8. Group by tag and calculate the average mastery from the latest interactions
            {
                $group: {
                    _id: "$contentDetails.tags",
                    mastery: { $avg: "$endProgress" }
                }
            },
            // 9. Sort by mastery score in descending order to find the top subjects
            { $sort: { mastery: -1 } },
            // 10. Limit to the top 6 subjects for the chart
            { $limit: 6 },
            // 11. Format the final output for the frontend component
            {
                $project: {
                    _id: 0,
                    subject: "$_id",
                    mastery: { $round: ["$mastery", 0] },
                    // This is a placeholder; color can be assigned on the frontend
                    color: "bg-blue-500"
                }
            }
        ];
        const knowledgeConstellationData = await Interaction.aggregate(knowledgePipeline);

        // --- 2. Learning Momentum Data Aggregation ---
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

        // FIX: Explicitly type the pipeline array as mongoose.PipelineStage[]
        const momentumPipeline: mongoose.PipelineStage[] = [
            {
                $match: {
                    userId: userId,
                    eventType: 'end',
                    timestamp: { $gte: fourWeeksAgo }
                }
            },
            {
                $group: {
                    _id: { $isoWeek: "$timestamp" }, // Use $isoWeek for consistency
                    studySeconds: { $sum: "$durationSeconds" },
                    averageMastery: { $avg: "$endProgress" },
                    weekStartDate: { $min: "$timestamp" }
                }
            },
            { $sort: { weekStartDate: 1 } },
            {
                $project: {
                    _id: 0,
                    date: {
                        $concat: ["Week ", { $toString: "$_id" }]
                    },
                    studyHours: { $round: [{ $divide: ["$studySeconds", 3600] }, 1] },
                    averageMastery: { $round: ["$averageMastery", 0] }
                }
            }
        ];
        const momentumData = await Interaction.aggregate(momentumPipeline);

        return NextResponse.json({
            knowledgeConstellation: knowledgeConstellationData,
            momentum: momentumData
        });

    } catch (error) {
        console.error('Chart Data Aggregation Error:', error);
        return NextResponse.json({ error: 'Failed to aggregate chart data' }, { status: 500 });
    }
}

// app/api/analytics/charts/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Progress from '@/models/Progress';
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

        // --- 1. Knowledge Constellation Data Aggregation ---
        // FIX: Explicitly type the pipeline array as mongoose.PipelineStage[]
        const knowledgePipeline: mongoose.PipelineStage[] = [
            { $match: { userId: userId } },
            {
                $lookup: {
                    from: Content.collection.name,
                    localField: "contentId",
                    foreignField: "_id",
                    as: "contentDetails"
                }
            },
            { $unwind: "$contentDetails" },
            { $unwind: "$contentDetails.tags" },
            {
                $group: {
                    _id: "$contentDetails.tags",
                    mastery: { $avg: "$progress" }
                }
            },
            { $sort: { mastery: -1 } },
            { $limit: 6 },
            {
                $project: {
                    _id: 0,
                    subject: "$_id",
                    mastery: { $round: ["$mastery", 0] },
                    // Assign a color dynamically if your component needs it
                    // This is a placeholder; you might do this on the frontend
                    color: "bg-blue-500" 
                }
            }
        ];
        const knowledgeConstellationData = await Progress.aggregate(knowledgePipeline);

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
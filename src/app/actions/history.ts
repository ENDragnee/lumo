// /lib/actions/history.ts
'use server';

import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Interaction, { IInteraction } from '@/models/Interaction';
import Content from '@/models/Content';
import Challenge, { IChallenge } from '@/models/Challenge'; // FIX: Import IChallenge type
import Score, { IScore } from '@/models/Score'; // FIX: Import IScore type

// Define the shape of the data the action will return for each history item
export interface HistoryItem {
    _id: string; // The Content ID
    title: string;
    thumbnail: string;
    latestInteractionTime: Date;
    progress: number; // A calculated progress/score percentage (0-100)
}

/**
 * Fetches the user's interaction history.
 * It finds the most recent interaction for each unique piece of content,
 * then enriches it with content details and calculates the current progress or score.
 *
 * @param {object} options - The options for fetching history.
 * @param {number} options.limit - The maximum number of history items to return.
 * @returns {Promise<HistoryItem[]>} A promise that resolves to an array of history items.
 */
export async function getHistory(options: { limit: number }): Promise<HistoryItem[]> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const { limit = 50 } = options;

    try {
        await connectDB();

        // Step 1: Get the list of recently interacted-with content
        const recentInteractionsPipeline: mongoose.PipelineStage[] = [
            { $match: { userId: userId } },
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: "$contentId",
                    latestTimestamp: { $first: "$timestamp" }
                }
            },
            { $sort: { latestTimestamp: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: Content.collection.name,
                    localField: "_id",
                    foreignField: "_id",
                    as: "contentDetails"
                }
            },
            { $match: { "contentDetails": { $ne: [] } } },
            { $unwind: "$contentDetails" },
            {
                $project: {
                    _id: 0,
                    contentId: "$_id",
                    title: "$contentDetails.title",
                    thumbnail: "$contentDetails.thumbnail",
                    latestInteractionTime: "$latestTimestamp"
                }
            }
        ];

        const recentContentList = await Interaction.aggregate(recentInteractionsPipeline);
        
        if (recentContentList.length === 0) {
            return [];
        }

        // Step 2: Enrich each item with its specific progress.
        const historyWithProgress = await Promise.all(
            recentContentList.map(async (item) => {
                let progress = 0;

                // FIX: Explicitly type the result of findOne.lean() to be IChallenge or null
                const challenge: IChallenge | null = await Challenge.findOne({
                    userId,
                    contentId: item.contentId
                }).lean<IChallenge>();
                
                if (challenge) {
                    // FIX: 'challenge.status' is now correctly typed and accessible.
                    if (challenge.status === 'completed') {
                        // FIX: Explicitly type the result of this findOne as well
                        const latestScore: IScore | null = await Score.findOne({ challengeId: challenge._id })
                            .sort({ createdAt: -1 })
                            .lean<IScore>();
                        if (latestScore) {
                            progress = latestScore.score;
                        }
                    }
                } else {
                    // FIX: Explicitly type this result for consistency and safety
                    const lastProgressInteraction: IInteraction | null = await Interaction.findOne({
                        userId,
                        contentId: item.contentId,
                        endProgress: { $exists: true, $ne: null }
                    })
                    .sort({ timestamp: -1 })
                    .lean<IInteraction>();

                    if (lastProgressInteraction?.endProgress) {
                        progress = lastProgressInteraction.endProgress;
                    }
                }
                
                return {
                    _id: item.contentId.toString(),
                    title: item.title,
                    thumbnail: item.thumbnail,
                    latestInteractionTime: item.latestInteractionTime,
                    progress: Math.round(progress)
                };
            })
        );
        
        return historyWithProgress;

    } catch (error: any) {
        console.error("getHistory Action Failed:", error.message);
        throw new Error("Failed to fetch history.");
    }
}

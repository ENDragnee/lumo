// /app/actions/history.ts
'use server';

import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Interaction, { IInteraction } from '@/models/Interaction';
import Content from '@/models/Content';
import Challenge, { IChallenge } from '@/models/Challenge';
import Score, { IScore } from '@/models/Score';

// Define the shape of the data the action will return for each history item
export interface HistoryItem {
    _id: string; // The Content ID
    title: string;
    thumbnail: string | null; // Thumbnail can be optional
    latestInteractionTime: Date;
    progress: number; // A calculated progress/score percentage (0-100)
}

/**
 * Fetches the user's interaction history with support for pagination and searching.
 *
 * @param {object} options - The options for fetching history.
 * @param {number} options.limit - The maximum number of history items to return.
 * @param {number} options.offset - The number of items to skip (for pagination).
 * @param {string} [options.searchTerm] - An optional term to search for in content titles.
 * @returns {Promise<HistoryItem[]>} A promise that resolves to an array of history items.
 */
export async function getHistory(options: {
    limit: number;
    offset: number;
    searchTerm?: string;
}): Promise<HistoryItem[]> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        // Return empty array for unauthenticated users instead of throwing
        // This is often better for UI components.
        return [];
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const { limit = 20, offset = 0, searchTerm } = options;

    try {
        await connectDB();

        // Step 1: Build the aggregation pipeline to get the paginated list of recently interacted-with content
        const pipeline: mongoose.PipelineStage[] = [
            // Find all interactions for the current user
            { $match: { userId: userId } },
            // Sort by timestamp to easily find the most recent one
            { $sort: { timestamp: -1 } },
            // Group by contentId to get only the latest interaction for each piece of content
            {
                $group: {
                    _id: "$contentId",
                    latestTimestamp: { $first: "$timestamp" }
                }
            },
            // Join with the Content collection to get details like title and thumbnail
            {
                $lookup: {
                    from: Content.collection.name,
                    localField: "_id",
                    foreignField: "_id",
                    as: "contentDetails"
                }
            },
            // Deconstruct the contentDetails array field from the input documents to output a document for each element
            { $unwind: "$contentDetails" },
        ];

        // Conditionally add a search stage if a searchTerm is provided
        if (searchTerm && searchTerm.trim() !== '') {
            pipeline.push({
                $match: {
                    "contentDetails.title": { $regex: searchTerm, $options: 'i' }
                }
            });
        }

        // Add final sorting, pagination, and projection stages
        pipeline.push(
            // Sort the final list by the most recent interaction time
            { $sort: { latestTimestamp: -1 } },
            // Skip documents for pagination
            { $skip: offset },
            // Limit the number of results for the current page
            { $limit: limit },
            // Shape the final output for this stage
            {
                $project: {
                    _id: 0,
                    contentId: "$_id",
                    title: "$contentDetails.title",
                    thumbnail: "$contentDetails.imageUrl", // Assuming the model has `imageUrl`
                    latestInteractionTime: "$latestTimestamp"
                }
            }
        );

        const recentContentList = await Interaction.aggregate(pipeline);

        if (recentContentList.length === 0) {
            return [];
        }

        // Step 2: Enrich each item with its specific progress
        const historyWithProgress = await Promise.all(
            recentContentList.map(async (item) => {
                let progress = 0;

                // Cast the result to IChallenge | null to fix the type mismatch
                const challenge = await Challenge.findOne({
                    userId,
                    contentId: item.contentId
                }).lean() as unknown as IChallenge | null;

                if (challenge?.status === 'completed') {
                    // Cast the result to IScore | null for consistency
                    const latestScore = await Score.findOne({ challengeId: challenge._id })
                        .sort({ createdAt: -1 })
                        .lean() as unknown as IScore | null;
                    if (latestScore) {
                        progress = latestScore.score;
                    }
                } else {
                    // Cast the result to IInteraction | null for consistency
                    const lastProgressInteraction = await Interaction.findOne({
                        userId,
                        contentId: item.contentId,
                        endProgress: { $exists: true, $ne: null }
                    }).sort({ timestamp: -1 }).lean() as unknown as IInteraction | null;

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
        console.error("getHistory Action Failed:", error);
        // Throwing the error allows the client component's catch block to handle it
        throw new Error("Failed to fetch history.");
    }
}

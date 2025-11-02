'use server';

import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Subscribtion from '@/models/Subscribtion';
import User from '@/models/User'; // Import the User model

/**
 * Defines the shape of the data returned for each subscribed creator.
 * This is the object you'll work with in your React components.
 */
export interface SubscribedCreator {
    _id: string; // The Creator's User ID
    name: string | null;
    profileImage: string | null;
    subscribedAt: string; // The date the user subscribed (as an ISO string)
}

/**
 * Fetches the most recent creators the current user is subscribed to.
 *
 * @param {object} options - The options for fetching subscriptions.
 * @param {number} [options.limit=10] - The maximum number of creators to return.
 * @returns {Promise<SubscribedCreator[]>} A promise that resolves to an array of subscribed creator objects.
 */
export async function getRecentSubscriptions(
    { limit = 10 }: { limit?: number }
): Promise<SubscribedCreator[]> {
    // 1. Ensure user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        console.log("getRecentSubscriptions: Unauthenticated user.");
        return []; // Return empty array for guests
    }

    try {
        await connectDB();
        const userId = new mongoose.Types.ObjectId(session.user.id);

        // 2. Use an aggregation pipeline for an efficient query
        const pipeline: mongoose.PipelineStage[] = [
            // Stage 1: Find all active subscriptions for the current user
            {
                $match: {
                    userId: userId,
                    isSubscribed: true,
                },
            },
            // Stage 2: Sort by the most recent subscription date
            {
                $sort: {
                    updatedAt: -1, // `updatedAt` reflects the most recent action (sub/re-sub)
                },
            },
            // Stage 3: Limit the number of results
            {
                $limit: limit,
            },
            // Stage 4: Join with the 'users' collection to get creator details
            {
                $lookup: {
                    from: User.collection.name, // 'users'
                    localField: 'creatorId',
                    foreignField: '_id',
                    as: 'creatorDetails',
                },
            },
            // Stage 5: Deconstruct the creatorDetails array
            {
                $unwind: '$creatorDetails',
            },
            // Stage 6: Project the final shape of the output data
            {
                $project: {
                    _id: '$creatorDetails._id', // Return the creator's ID
                    name: '$creatorDetails.name',
                    profileImage: '$creatorDetails.profileImage',
                    subscribedAt: '$updatedAt', // The date of the subscription event
                },
            },
        ];

        // The result from aggregate will have Mongoose/BSON types (ObjectId, Date)
        const rawSubscriptions = await Subscribtion.aggregate(pipeline);

        // FIX: Manually serialize the data to make it safe for the client boundary
        const subscriptions: SubscribedCreator[] = rawSubscriptions.map((sub) => ({
            _id: sub._id.toString(),
            name: sub.name,
            profileImage: sub.profileImage,
            subscribedAt: sub.subscribedAt.toISOString(), // Convert Date to a string
        }));

        return subscriptions;

    } catch (error) {
        console.error("Failed to fetch recent subscriptions:", error);
        // In a real app, you might log this to a service like Sentry
        throw new Error("Could not load your subscriptions. Please try again later.");
    }
}

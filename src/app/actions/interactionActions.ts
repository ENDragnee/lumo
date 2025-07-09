// @/app/actions/interactionActions.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Interaction from "@/models/Interaction";
import redis from "@/lib/redis";
import mongoose from "mongoose";

/**
 * Checks which of a given list of content IDs have been interacted with by the current user.
 * It first attempts to fetch this information from a Redis cache for performance.
 * If not in the cache, it queries MongoDB and then caches the result.
 *
 * @param {string[]} contentIds - An array of content IDs (as strings) to check.
 * @returns {Promise<string[]>} A promise that resolves to an array of content IDs that the user has interacted with.
 */
export async function getInteractedContentIds(contentIds: string[]): Promise<string[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || contentIds.length === 0) {
    return [];
  }

  const userId = session.user.id;
  const cacheKey = `user:${userId}:interacted_ids`;
  let interactedIds: string[] = [];

  try {
    // 1. Try to get the full list of interacted IDs from cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      const allInteractedIds = JSON.parse(cachedData) as string[];
      // Filter the result to only include IDs from the requested list
      return contentIds.filter(id => allInteractedIds.includes(id));
    }

    // 2. If cache miss, query the database
    await connectDB();

    const interactionRecords = await Interaction.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).distinct('contentId');
    
    // Convert ObjectId[] to string[]
    interactedIds = interactionRecords.map(id => id.toString());

    // 3. Cache the full list of interacted IDs for future requests
    // Cache for 1 hour (3600 seconds). Adjust as needed.
    if (interactedIds.length > 0) {
      await redis.set(cacheKey, JSON.stringify(interactedIds), 'EX', 3600);
    }
    
    // Filter the result to only include IDs from the requested list
    return contentIds.filter(id => interactedIds.includes(id));

  } catch (error) {
    console.error("Error in getInteractedContentIds:", error);
    // Fallback to a direct DB query without caching on error
    try {
        await connectDB();
        const records = await Interaction.find({
            userId: new mongoose.Types.ObjectId(userId),
            contentId: { $in: contentIds.map(id => new mongoose.Types.ObjectId(id)) }
        }).distinct('contentId');
        return records.map(id => id.toString());
    } catch (dbError) {
        console.error("Fallback DB query failed in getInteractedContentIds:", dbError);
        return [];
    }
  }
}

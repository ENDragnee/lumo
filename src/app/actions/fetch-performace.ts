// app/actions/fetch-performance.ts
"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Performance, { IPerformance, UnderstandingLevel } from "@/models/Performance";
import mongoose, { Types } from "mongoose";

// Define the shape of the data we'll return for type safety on the client
type PerformanceMap = {
    [key: string]: {
        understandingLevel: UnderstandingLevel;
        lastAccessedAt: Date;
    }
};

// Define a structured return type for the action
type ActionResult = {
    success: true;
    performances: PerformanceMap;
} | {
    success: false;
    error: string;
};

/**
 * A Server Action to fetch performance records for a given user and a list of content IDs.
 * @param contentIds An array of content IDs (as strings) to fetch performance for.
 * @returns An object containing a success flag and either the performance data or an error message.
 */
export async function getPerformanceForContent(contentIds: string[]): Promise<ActionResult> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return { success: false, error: "Authentication required" };
    }

    if (!Array.isArray(contentIds) || contentIds.length === 0) {
        // No need to query if there are no IDs, just return success with empty data
        return { success: true, performances: {} };
    }

    try {
        await connectDB();
        
        const validContentIds = contentIds
            .filter(id => Types.ObjectId.isValid(id))
            .map(id => new Types.ObjectId(id));
            
        const userId = new Types.ObjectId(session.user.id);

        // Fetch all performance records for the current user and the provided content IDs
        const performances = await Performance.find({
            userId: userId,
            contentId: { $in: validContentIds }
        }).select('contentId understandingLevel lastCalculatedAt').lean<IPerformance[]>();
        
        // Transform the array into a map for efficient O(1) lookup on the client
        const performanceMap: PerformanceMap = {};
        performances.forEach(perf => {
            performanceMap[perf.contentId.toString()] = {
                understandingLevel: perf.understandingLevel,
                lastAccessedAt: perf.lastCalculatedAt,
            };
        });

        return { success: true, performances: performanceMap };

    } catch (error) {
        console.error("Server Action Error (getPerformanceForContent):", error);
        return { success: false, error: "An internal server error occurred while fetching performance data." };
    }
}

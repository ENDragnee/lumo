// lib/actions/performance.ts (Corrected)
'use server';

import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Interaction from '@/models/Interaction';
import Score from '@/models/Score';
import Challenge, { IChallenge } from '@/models/Challenge'; // Import the IChallenge interface
import Performance, { UnderstandingLevel } from '@/models/Performance';

// --- Configuration Constants ---
const TIME_WEIGHT = 0.3; // 30% of the score is based on time spent
const SCORE_WEIGHT = 0.7; // 70% of the score is based on quiz results
const TARGET_TIME_SECONDS = 600; // 10 minutes is the "ideal" time for 100% time score

/**
 * Calculates a user's performance for a specific piece of content and saves it.
 * This should be called when a user completes a significant action, like finishing a quiz.
 * @param contentId The ID of the content to calculate performance for.
 */
export async function calculateAndStorePerformance(contentId: string): Promise<void> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !mongoose.Types.ObjectId.isValid(contentId)) {
        console.error("Performance Calculation: Unauthorized or invalid content ID.");
        return;
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const contentObjectId = new mongoose.Types.ObjectId(contentId);

    try {
        await connectDB();

        // --- 1. GATHER DATA ---

        // a) Get total interaction time
        const timeAggregation = await Interaction.aggregate([
            { $match: { userId, contentId: contentObjectId, durationSeconds: { $exists: true } } },
            { $group: { _id: null, totalTime: { $sum: "$durationSeconds" } } }
        ]);
        const totalTimeSeconds = timeAggregation[0]?.totalTime || 0;

        // b) Get all quiz scores for this content
        // FIX: Add explicit type hint to the findOne query
        const challenge: IChallenge | null = await Challenge.findOne({ userId, contentId: contentObjectId }).lean<IChallenge>();
        
        let allScores: number[] = [];
        if (challenge) {
            // FIX: Now `challenge._id` is accessible and correctly typed
            const scoreDocs = await Score.find({ challengeId: challenge._id }).select('score').lean();
            allScores = scoreDocs.map(s => s.score);
        }
        const averageQuizScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : null;

        // --- 2. CALCULATE PERFORMANCE METRICS ---

        const timeScore = Math.min(100, (totalTimeSeconds / TARGET_TIME_SECONDS) * 100);

        let understandingScore: number;
        if (averageQuizScore !== null) {
            understandingScore = (timeScore * TIME_WEIGHT) + (averageQuizScore * SCORE_WEIGHT);
        } else {
            understandingScore = timeScore;
        }
        understandingScore = Math.round(understandingScore);

        let understandingLevel: UnderstandingLevel;
        if (understandingScore >= 90) understandingLevel = 'mastered';
        else if (understandingScore >= 75) understandingLevel = 'good';
        else if (understandingScore >= 50) understandingLevel = 'foundational';
        else understandingLevel = 'needs-work';

        // --- 3. SAVE TO DATABASE ---
        
        await Performance.findOneAndUpdate(
            { userId, contentId: contentObjectId },
            {
                userId,
                contentId: contentObjectId,
                understandingScore,
                understandingLevel,
                totalTimeSeconds,
                averageQuizScore,
                lastCalculatedAt: new Date(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log(`Performance updated for user ${userId} on content ${contentId}. Score: ${understandingScore}`);

    } catch (error) {
        console.error("Failed to calculate and store performance:", error);
    }
}

// /app/actions/interaction.ts
'use server';

import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Interaction, { IInteraction } from '@/models/Interaction';

// This is the function we will call from our page server component
export async function getLastPosition(contentId: string): Promise<number> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
        return 0; // Default to the top for guests or invalid data
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    try {
        await connectDB();

        // Find the most recent interaction (start or end) for this user/content
        const lastInteraction = await Interaction.findOne({
            userId,
            contentId: new mongoose.Types.ObjectId(contentId),
        })
        .sort({ timestamp: -1 }) // Get the absolute most recent one
        .lean<IInteraction>();

        // Return the endPosition if it exists, otherwise the startPosition, otherwise 0
        if (lastInteraction) {
            return lastInteraction.endPosition ?? lastInteraction.startPosition ?? 0;
        }

        return 0; // No interactions found, start at the top
    } catch (error) {
        console.error("Error fetching last position:", error);
        return 0; // Fail gracefully
    }
}

// app/api/subscription/subscribe/[creatorId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from '@/lib/mongodb';
import Subscribtion from '@/models/Subscribtion';
import User from '@/models/User';
import mongoose, { Types } from 'mongoose';
import redis from '@/lib/redis'; // NEW: Import the Redis client

type SubscribtionProps = {
  params: Promise<{
    creatorId: string;
  }>;
}

export async function PUT(request: NextRequest, { params }: SubscribtionProps) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const currentUserId = new Types.ObjectId(session.user.id);

    try {
        await connectDB();
        const { creatorId } = await params;
        const { subscribe } = await request.json();

        if (!creatorId || typeof subscribe !== 'boolean') {
            return NextResponse.json({ message: 'Missing creatorId or subscribe status' }, { status: 400 });
        }
        if (!Types.ObjectId.isValid(creatorId)) {
             return NextResponse.json({ message: 'Invalid creatorId format' }, { status: 400 });
        }
        const creatorObjectId = new Types.ObjectId(creatorId);
        if (currentUserId.equals(creatorObjectId)) {
             return NextResponse.json({ message: 'Cannot subscribe to yourself' }, { status: 400 });
        }

         const existingSubscription = await Subscribtion.findOne({ userId: currentUserId, creatorId: creatorObjectId });
         let previousState = existingSubscription?.isSubscribed ?? false;

         const updatedSubscription = await Subscribtion.findOneAndUpdate(
            { userId: currentUserId, creatorId: creatorObjectId },
            { $set: { isSubscribed: subscribe } },
            { new: true, upsert: true, runValidators: true }
         );

         let countChange = 0;
         if (subscribe && !previousState) { countChange = 1; }
         else if (!subscribe && previousState) { countChange = -1; }

         if (countChange !== 0) {
            // Update creator's subscriber count
            await User.findByIdAndUpdate(creatorObjectId, { $inc: { subscribersCount: countChange } });
            console.log(`Updated subscriber count for ${creatorId} by ${countChange}`);

            // ======================================================================
            // NEW: Invalidate the recommendation cache for the current user
            // ======================================================================
            try {
                // The cache key must exactly match the one in the recommendations API
                const cacheKey = `recommendations:${session.user.id}`;
                await redis.del(cacheKey);
                console.log(`CACHE INVALIDATED: Cleared recommendations cache for user ${session.user.id}.`);
            } catch (redisError) {
                // Log the error but don't fail the entire request.
                // The main action (subscription) succeeded.
                console.error('Failed to invalidate recommendation cache:', redisError);
            }
         }

        return NextResponse.json({ success: true, subscription: updatedSubscription }, { status: 200 });

    } catch (error) {
        console.error('Subscription PUT error:', error);
         if (error instanceof mongoose.Error.ValidationError) {
             return NextResponse.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
         }
         if (error instanceof SyntaxError) {
            return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
         }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

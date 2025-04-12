// app/api/subscriptions/status/[creatorId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Import options
import connectDB from '@/lib/mongodb';
import { Subscribtion } from '@/models/Subscribtion';
import mongoose, { Types } from 'mongoose';

interface RouteContext { params: { creatorId: string; } }

export async function GET(request: NextRequest, context: RouteContext) {
    const session = await getServerSession(authOptions); // Get session

    // If user is not logged in, they cannot be subscribed
    if (!session || !session.user?.id) {
        return NextResponse.json({ success: true, isSubscribed: false, message: 'User not authenticated' }, { status: 200 });
    }

    const currentUserId = new Types.ObjectId(session.user.id); // Convert to ObjectId

    try {
        await connectDB();
        const { creatorId } = await context.params;

        if (!creatorId || !Types.ObjectId.isValid(creatorId)) {
            return NextResponse.json({ message: 'Invalid or missing creatorId parameter' }, { status: 400 });
        }

        const creatorObjectId = new Types.ObjectId(creatorId);

        // Add check: User cannot be subscribed to themselves
        if (currentUserId.equals(creatorObjectId)) {
            return NextResponse.json({ success: true, isSubscribed: false, message: 'Cannot subscribe to self' }, { status: 200 });
        }

        const subscription = await Subscribtion.findOne({
            userId: currentUserId,
            creatorId: creatorObjectId,
            isSubscribed: true
        }).lean();

        const subscriberCount = await Subscribtion.countDocuments({
            creatorId: creatorObjectId,
            isSubscribed: true
        });

        return NextResponse.json({ success: true, isSubscribed: !!subscription, subscriberCount }, { status: 200 });

    } catch (error) {
        console.error(`Error fetching subscription status for ${context?.params?.creatorId}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
// app/api/subscriptions/subscribed-to/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from '@/lib/mongodb';
import Subscribtion, { ISubscribtion } from '@/models/Subscribtion';
import User, { IUser } from '@/models/User'; // Ensure IUser is imported
import mongoose, { Types } from 'mongoose';

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    let currentUserId: Types.ObjectId;
    try {
        currentUserId = new Types.ObjectId(session.user.id);
    } catch (error) {
        console.error("Invalid user ID format in session:", session.user.id);
        return NextResponse.json({ message: 'Invalid user ID format' }, { status: 400 });
    }

    try {
        await connectDB();

        // Define the expected shape after populate and lean for better type safety (optional but recommended)
        // Note: Adjust fields based on your 'select' and IUser definition
        interface PopulatedSubscription extends Omit<ISubscribtion, 'creatorId' | 'userId'> {
             _id: Types.ObjectId; // lean() keeps ObjectId by default
             userId: Types.ObjectId; // Kept from original Subscription
             creatorId: Pick<IUser, 'name' | 'userTag' | 'profileImage' | '_id'> & { _id: Types.ObjectId }; // Populated fields + _id
             // Include other fields kept by lean() like timestamps if needed
             isSubscribed: boolean;
             createdAt: Date;
             updatedAt: Date;
        }


        const subscriptions = await Subscribtion.find({
            userId: currentUserId,
            isSubscribed: true
        })
        .populate<{ creatorId: IUser }>({ // <--- *** CORRECTED TYPE HERE ***
            path: 'creatorId',
            model: User, // Populate using the User model
            select: 'name userTag profileImage _id' // Select fields you need
        })
        .lean<PopulatedSubscription[]>(); // Use lean and optionally provide the explicit type

        // Now TypeScript knows that `sub.creatorId` exists and is related to IUser
        const subscribedCreators = subscriptions
            .map(sub => sub.creatorId) // Access the populated creatorId object
            .filter(creator => creator != null); // Filter out potential nulls if a creator was deleted

        return NextResponse.json({ success: true, data: subscribedCreators }, { status: 200 });

    } catch (error) {
        console.error('Error fetching subscribed-to list:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

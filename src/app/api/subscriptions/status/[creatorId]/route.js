// // app/api/subscriptions/status/[creatorId]/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth"; // Import options
// import connectDB from '@/lib/mongodb';
// import { Subscribtion } from '@/models/Subscribtion';
// import mongoose, { Types } from 'mongoose';

// // Remove this interface definition:
// // interface RouteContext { params: { creatorId: string; } }

// export async function GET(
//     request: NextRequest,
//     // Use an inline type definition for the context parameter:
//     context: { params: { creatorId: string } }
// ) {
//     const session = await getServerSession(authOptions); // Get session

//     // If user is not logged in, they cannot be subscribed
//     if (!session || !session.user?.id) {
//         return NextResponse.json({ success: true, isSubscribed: false, message: 'User not authenticated' }, { status: 200 });
//     }

//     const currentUserId = new Types.ObjectId(session.user.id); // Convert to ObjectId

//     try {
//         await connectDB();
//         // Remove 'await' here, context.params is not a promise
//         const { creatorId } = context.params;

//         if (!creatorId || !Types.ObjectId.isValid(creatorId)) {
//             return NextResponse.json({ message: 'Invalid or missing creatorId parameter' }, { status: 400 });
//         }

//         const creatorObjectId = new Types.ObjectId(creatorId);

//         // Add check: User cannot be subscribed to themselves
//         if (currentUserId.equals(creatorObjectId)) {
//             return NextResponse.json({ success: true, isSubscribed: false, message: 'Cannot subscribe to self' }, { status: 200 });
//         }

//         const subscription = await Subscribtion.findOne({
//             userId: currentUserId,
//             creatorId: creatorObjectId,
//             isSubscribed: true
//         }).lean();

//         const subscriberCount = await Subscribtion.countDocuments({
//             creatorId: creatorObjectId,
//             isSubscribed: true
//         });

//         return NextResponse.json({ success: true, isSubscribed: !!subscription, subscriberCount }, { status: 200 });

//     } catch (error) {
//         // Use context.params.creatorId here for consistency if needed in logging
//         console.error(`Error fetching subscription status for ${context.params?.creatorId}:`, error);
//         return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//     }
// }


// src/app/api/subscriptions/status/[creatorId]/route.js
import { NextResponse } from 'next/server'; // NextRequest type annotation removed
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Import options
import connectDB from '@/lib/mongodb';
import { Subscribtion } from '@/models/Subscribtion';
import mongoose from 'mongoose'; // Removed named import { Types }

// Note: No type annotations for request and context parameters needed in JS
export async function GET(request, context) {
    const session = await getServerSession(authOptions); // Get session

    // If user is not logged in, they cannot be subscribed
    if (!session || !session.user?.id) {
        // Using status 200 for consistency with original code, though 401 might be more semantically correct
        return NextResponse.json({ success: true, isSubscribed: false, message: 'User not authenticated' }, { status: 200 });
    }

    // Access ObjectId via mongoose.Types
    const currentUserId = new mongoose.Types.ObjectId(session.user.id);

    try {
        await connectDB();
        const { creatorId } = context.params; // Destructure params from context

        // Access ObjectId.isValid via mongoose.Types
        if (!creatorId || !mongoose.Types.ObjectId.isValid(creatorId)) {
            return NextResponse.json({ message: 'Invalid or missing creatorId parameter' }, { status: 400 });
        }

        // Access ObjectId via mongoose.Types
        const creatorObjectId = new mongoose.Types.ObjectId(creatorId);

        // Add check: User cannot be subscribed to themselves
        // .equals() is the correct way to compare Mongoose ObjectIds
        if (currentUserId.equals(creatorObjectId)) {
            return NextResponse.json({ success: true, isSubscribed: false, message: 'Cannot subscribe to self' }, { status: 200 });
        }

        const subscription = await Subscribtion.findOne({
            userId: currentUserId,
            creatorId: creatorObjectId,
            isSubscribed: true
        }).lean(); // .lean() returns a plain JS object, good for read-only operations

        const subscriberCount = await Subscribtion.countDocuments({
            creatorId: creatorObjectId,
            isSubscribed: true
        });

        // Return success status, whether the user is subscribed, and the total count
        return NextResponse.json({ success: true, isSubscribed: !!subscription, subscriberCount }, { status: 200 });

    } catch (error) {
        console.error(`Error fetching subscription status for ${context.params?.creatorId}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
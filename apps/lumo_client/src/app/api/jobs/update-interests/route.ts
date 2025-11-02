// app/api/jobs/update-interests/route.ts

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { updateUserInterestsForUser } from '@/utils/calculateInterests'; // Import our new function
import User from '@/models/User';

// This is the secret token that Vercel Cron will send.
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
    // 1. Authorize the request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectDB();
        
        // 2. Find users who have been active in the last 24 hours.
        // We don't need to update interests for users who haven't done anything.
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const activeUsers = (await User.find({
            // Assuming your User schema has an `updatedAt` field from `timestamps: true`
            // which is updated on login or other activities.
            updatedAt: { $gte: oneDayAgo }
        }).select('_id').lean()).map((user: any) => ({ _id: user._id.toString() })) as { _id: string }[];

        if (activeUsers.length === 0) {
            console.log("CRON JOB: No active users to update.");
            return NextResponse.json({ success: true, message: "No active users to update." });
        }
        
        console.log(`CRON JOB: Found ${activeUsers.length} active users. Starting interest calculation...`);

        // 3. Loop through each active user and run the update function.
        // We run them in sequence to avoid overwhelming the database.
        for (const user of activeUsers) {
            try {
                await updateUserInterestsForUser(user._id.toString());
            } catch (userError) {
                console.error(`CRON JOB: Failed to update interests for user ${user._id.toString()}:`, userError);
                // Continue to the next user even if one fails.
            }
        }
        
        return NextResponse.json({ success: true, message: `Updated interests for ${activeUsers.length} users.` });

    } catch (error) {
        console.error('CRON JOB /update-interests ERROR:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
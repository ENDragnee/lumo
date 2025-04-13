// /app/api/progress/route.ts

import { NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjust path as needed
import mongoose, { Types } from 'mongoose';
import connectDB from '@/lib/mongodb'; // Adjust path as needed
import Progress, { IProgress } from '@/models/Progress'; // Adjust path and ensure IProgress is exported

// --- Type Definitions ---

// Adjust based on your actual NextAuth session structure
interface SessionUser {
    id?: string;
    _id?: string;
    // Add other user properties if needed
}

interface UpdateProgressRequestBody {
    contentId: string;
    contentType: 'lesson' | 'quiz'; // Or your specific types
    progress: number; // Percentage 0-100
    status?: 'not-started' | 'in-progress' | 'completed'; // Optional status update
}

// --- GET Handler: Fetch User Progress ---

export async function GET(request: Request) {
    try {
        // 1. Authentication
        const session: Session | null = await getServerSession(authOptions);
        const sessionUser = session?.user as SessionUser | undefined;
        const userIdString = sessionUser?.id ?? sessionUser?._id;

        if (!userIdString) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = new Types.ObjectId(userIdString);

        // 2. Get and Validate Query Parameters
        const { searchParams } = new URL(request.url);
        const contentIdParam = searchParams.get('contentId');
        const contentTypeParam = searchParams.get('contentType') as IProgress['contentType'] | null; // Explicitly type

        if (!contentIdParam || !mongoose.Types.ObjectId.isValid(contentIdParam)) {
            return NextResponse.json({ error: 'Invalid or missing content ID parameter' }, { status: 400 });
        }
        const contentId = new Types.ObjectId(contentIdParam);

        // Optional: Validate contentType if provided
        if (contentTypeParam && !['lesson', 'quiz'].includes(contentTypeParam)) { // Adjust allowed types
             return NextResponse.json({ error: 'Invalid contentType parameter' }, { status: 400 });
        }

        // 3. Database Connection
        await connectDB();

        // 4. Find Progress Record
        const findCriteria: mongoose.FilterQuery<IProgress> = { userId, contentId };
        if (contentTypeParam) {
            findCriteria.contentType = contentTypeParam;
        }

        // Use lean() for read-only operations
        const progressRecord = await Progress.findOne(findCriteria).lean();

        if (!progressRecord) {
            // It's okay if progress doesn't exist yet, return a specific status or default object
            // Option 1: Return 404
            // return NextResponse.json({ error: 'Progress not found' }, { status: 404 });
            // Option 2: Return a default "not started" state
            return NextResponse.json({
                progress: {
                    _id: null, // Indicate it's not a real record
                    userId,
                    contentId,
                    contentType: contentTypeParam || 'unknown', // Or handle differently
                    progress: 0,
                    status: 'not-started',
                }
            }, { status: 200 }); // Still 200 OK, just indicates no progress made yet
        }

        // 5. Return Found Progress
        return NextResponse.json({ progress: progressRecord }, { status: 200 });

    } catch (error: any) {
        console.error('Error in GET /api/progress:', error);
        return NextResponse.json({
            error: 'Failed to fetch progress',
            details: process.env.NODE_ENV !== 'production' ? error.message : undefined
        }, { status: 500 });
    }
}


// --- POST Handler: Create or Update User Progress ---

export async function POST(request: Request) {
    try {
        // 1. Authentication
        const session: Session | null = await getServerSession(authOptions);
        const sessionUser = session?.user as SessionUser | undefined;
        const userIdString = sessionUser?.id ?? sessionUser?._id;

        if (!userIdString) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = new Types.ObjectId(userIdString);

        // 2. Parse and Validate Request Body
        let body: UpdateProgressRequestBody;
        try {
            body = await request.json();
        } catch (e) {
            return NextResponse.json({ error: 'Invalid request body: Failed to parse JSON.' }, { status: 400 });
        }

        const { contentId: contentIdParam, contentType, progress, status: explicitStatus } = body;

        // Basic validation
        if (!contentIdParam || !contentType || progress === undefined || progress === null) {
            return NextResponse.json({ error: 'Missing required fields: contentId, contentType, progress' }, { status: 400 });
        }
        if (!mongoose.Types.ObjectId.isValid(contentIdParam)) {
            return NextResponse.json({ error: 'Invalid contentId format' }, { status: 400 });
        }
        const contentId = new Types.ObjectId(contentIdParam);

        if (!['lesson', 'quiz'].includes(contentType)) { // Adjust allowed types
             return NextResponse.json({ error: 'Invalid contentType' }, { status: 400 });
        }
        if (typeof progress !== 'number' || progress < 0 || progress > 100) {
            return NextResponse.json({ error: 'Invalid progress value: Must be a number between 0 and 100' }, { status: 400 });
        }

        // Determine the status based on progress, unless explicitly provided and valid
        let finalStatus: IProgress['status'] = 'in-progress'; // Default if > 0 and < 100
        if (progress >= 100) {
            finalStatus = 'completed';
        } else if (progress <= 0) {
            finalStatus = 'not-started';
        }

        // Override with explicit status if provided and valid
        if (explicitStatus) {
            if (!['not-started', 'in-progress', 'completed'].includes(explicitStatus)) {
                return NextResponse.json({ error: 'Invalid status value provided' }, { status: 400 });
            }
            finalStatus = explicitStatus;
        }

        // 3. Database Connection
        await connectDB();

        // 4. Update or Create Progress Record (Upsert)
        const filter = { userId, contentId, contentType };
        const update = {
            $set: {
                progress: progress,
                status: finalStatus,
                // Add any other fields you might want to update on every POST
            },
            $setOnInsert: { // Fields only set when the document is first created
                userId,
                contentId,
                contentType,
                createdAt: new Date() // Manually set if not using timestamps: true in schema for this field
            }
        };
        const options = {
            upsert: true, // Create the document if it doesn't exist
            new: true,    // Return the modified document (or the new one if created)
            setDefaultsOnInsert: true // Apply schema defaults on insert
        };

        const updatedProgress = await Progress.findOneAndUpdate(filter, update, options).lean();

        console.log(`Progress record upserted for ${contentType} content ${contentId}, user ${userId}. New progress: ${progress}%, Status: ${finalStatus}`);

        // 5. Return Updated/Created Progress
        return NextResponse.json({ progress: updatedProgress }, { status: 200 }); // Use 200 for upsert success

    } catch (error: any) {
        console.error('Error in POST /api/progress:', error);
         // Handle potential duplicate key errors if unique index exists and upsert races (less likely with lean+findOneAndUpdate but possible)
        if (error.code === 11000) {
             return NextResponse.json({ error: 'Duplicate progress record conflict.', details: error.message }, { status: 409 }); // Conflict
        }
        return NextResponse.json({
            error: 'Failed to update progress',
            details: process.env.NODE_ENV !== 'production' ? error.message : undefined
        }, { status: 500 });
    }
}
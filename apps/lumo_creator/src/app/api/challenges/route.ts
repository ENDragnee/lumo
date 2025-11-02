// /src/app/api/challenges/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Challenge from '@/models/Challenge';
import { Types } from 'mongoose';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { contentId, challengeType } = await req.json();

        if (!contentId || !challengeType) {
            return NextResponse.json({ success: false, message: 'contentId and challengeType are required' }, { status: 400 });
        }

        const userId = new Types.ObjectId(session.user.id);

        const newChallenge = new Challenge({
            createdBy: userId,
            contentId: new Types.ObjectId(contentId),
            challengeType,
            status: 'not-started',
            quizData: [], 
        });

        await newChallenge.save();

        return NextResponse.json({ success: true, data: newChallenge }, { status: 201 });

    } catch (error) {
        console.error('Error creating challenge:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ success: false, message: 'Internal Server Error', error: errorMessage }, { status: 500 });
    }
}

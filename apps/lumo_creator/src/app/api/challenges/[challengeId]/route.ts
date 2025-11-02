// /src/app/api/challenges/[challengeId]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Challenge from '@/models/Challenge';
import { Types } from 'mongoose';

type RouteParams = {
    params: Promise<{
        challengeId: string;
    }>
}

export async function PATCH(req: Request, { params }: RouteParams) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { challengeId } = await params;
    if (!Types.ObjectId.isValid(challengeId)) {
        return NextResponse.json({ success: false, message: 'Invalid Challenge ID' }, { status: 400 });
    }

    try {
        await dbConnect();
        const body = await req.json();

        const challenge = await Challenge.findById(challengeId);

        if (!challenge) {
            return NextResponse.json({ success: false, message: 'Challenge not found' }, { status: 404 });
        }

        // Authorization: Only the creator can update the challenge
        if (challenge.createdBy?.toString() !== session.user.id) {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }

        // Update allowed fields
        if (body.challengeType) challenge.challengeType = body.challengeType;
        if (body.status) challenge.status = body.status;
        // Add other updatable fields as needed

        const updatedChallenge = await challenge.save();

        return NextResponse.json({ success: true, data: updatedChallenge }, { status: 200 });

    } catch (error) {
        console.error(`Error updating challenge ${challengeId}:`, error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}


// --- DELETE /api/challenges/:challengeId ---
export async function DELETE(req: Request, { params }: RouteParams) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { challengeId } = await params;
    if (!Types.ObjectId.isValid(challengeId)) {
        return NextResponse.json({ success: false, message: 'Invalid Challenge ID' }, { status: 400 });
    }

    try {
        await dbConnect();

        const challenge = await Challenge.findById(challengeId);

        if (!challenge) {
            // It might have been deleted already, so we can return success.
            return NextResponse.json({ success: true, message: 'Challenge not found or already deleted' }, { status: 200 });
        }

        // Authorization: Only the creator can delete the challenge
        if (challenge.createdBy?.toString() !== session.user.id) {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }

        await Challenge.findByIdAndDelete(challengeId);

        return NextResponse.json({ success: true, message: 'Challenge deleted successfully' }, { status: 200 });
        
    } catch (error) {
        console.error(`Error deleting challenge ${challengeId}:`, error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

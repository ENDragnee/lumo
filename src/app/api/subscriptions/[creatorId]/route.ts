// app/api/subscriptions/[creatorId]/route.ts
import { NextRequest ,NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Subscribtion from '@/models/Subscribtion';
import mongoose from 'mongoose';

// --- DELETE: To handle unsubscribing from a creator ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ creatorId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { creatorId } = await params;
  if (!mongoose.Types.ObjectId.isValid(creatorId)) {
    return NextResponse.json({ error: 'Invalid Creator ID' }, { status: 400 });
  }

  try {
    await connectDB();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const creatorObjectId = new mongoose.Types.ObjectId(creatorId);

    // Find the subscription and set isSubscribed to false
    // This is better than deleting because it preserves history.
    const result = await Subscribtion.findOneAndUpdate(
      { userId, creatorId: creatorObjectId },
      { $set: { isSubscribed: false } }
    );

    if (!result) {
        return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Successfully unsubscribed' });

  } catch (error) {
    console.error('Unsubscribe API Error:', error);
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}

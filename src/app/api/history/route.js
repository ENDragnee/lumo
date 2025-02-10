import { authOptions } from '@/lib/auth';
import mongoose from "mongoose";
import { getServerSession } from 'next-auth';
import History from "@/models/History";
import connectDB from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import SerializedData from '@/models/SerializedData';

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if(!session?.user)
    {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await connectDB();

      const { searchParams } = new URL(request.url);
      const content_id = searchParams.get('id');
    
      // Validate content_id
      if (!content_id || !mongoose.Types.ObjectId.isValid(content_id)) {
        return NextResponse.json(
          { error: 'Invalid content ID' }, 
          { status: 400 }
        );
      }
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setUTCHours(23, 59, 59, 999);
  
        const history = await History.findOneAndUpdate(
          {
            user_id: session?.user?.id,
            content_id,
            viewed_at: { $gte: startOfDay, $lt: endOfDay },
          },
          { viewed_at: now },
          { upsert: true, new: true }
        );
        return NextResponse.json(history, {status: 200});
      } catch (error) {
        console.error("Error updating history:", error);
        return NextResponse.json( {error: 'Failed to record history'}, {status: 500})
      }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const histories = await History.find({ user_id: session?.user?.id })
        .sort({ viewed_at: -1 })
        .limit(10)
        .populate("content_id", "name")
        .exec();
    return NextResponse.json(histories, {status: 200});
  } catch (error) {
    console.log('Error fetching histories', error);
    return NextResponse.json( {error: 'Failed to fecth history'}, {status: 500});
  }
}
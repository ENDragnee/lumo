import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import History from "@/models/History";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { authOptions } from '@/lib/auth';


export async function POST(request) {
    const session = await getServerSession(authOptions);
    if(!session?.user)
    {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content_id } = await request.json();
    console.log(content_id);
    if (!content_id || !mongoose.Types.ObjectId.isValid(content_id)) {
        return NextResponse.json(
          { error: 'Invalid content ID' }, 
          { status: 400 }
        );
    }

    try {
        await connectDB();
        const latestEntry = await History.findOne({
            user_id: session.user.id,
            content_id: content_id,
          }).sort({ viewed_at: -1 });
      
          if (!latestEntry) {
            return res.status(404).json({ message: "History entry not found" });
          }
      
          // Toggle the starred status
          latestEntry.starred_status = !latestEntry.starred_status;
          latestEntry.starred_at = latestEntry.starred_status ? new Date() : null;
          
          await latestEntry.save();

          return NextResponse.json(latestEntry, {status: 200});
    } catch (error) {
        console.error("Error updating starred:", error);
        return NextResponse.json( {error: 'Failed to record favorite'}, {status: 500})
    }
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if(!session?.user)
    {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    try {
        await connectDB();

        const starred = await History.find({ user_id: session?.user?.id, starred_status: true })
        .sort({ starred_at: -1 })
        .populate("content_id", "name")
        .exec();
        return NextResponse.json(starred, {status: 200});
    } catch (error) {
        console.error("Error fetching stared:", error);
        return NextResponse.json( {error: 'Failed to fetch favorites'}, {status: 500})
    }
}
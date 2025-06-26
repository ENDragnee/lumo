// app/api/offline/check-versions/route.ts

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    const { contentVersions } = await request.json() as { contentVersions: Record<string, number> };

    const contentIds = Object.keys(contentVersions);
    if (!Array.isArray(contentIds) || contentIds.length === 0) {
      return NextResponse.json({});
    }

    const validObjectIds = contentIds.filter(id => mongoose.Types.ObjectId.isValid(id))
                                     .map(id => new mongoose.Types.ObjectId(id));

    await connectDB();
    
    const latestContents = await Content.find({
      _id: { $in: validObjectIds }
    }).select('_id version').lean();

    const updatesNeeded: string[] = [];
    latestContents.forEach(serverContent => {
      const serverVersion = serverContent.version;
      const clientVersion = contentVersions[serverContent._id.toString()];
      if (serverVersion > clientVersion) {
        updatesNeeded.push(serverContent._id.toString());
      }
    });

    return NextResponse.json({ updatesNeeded });

  } catch (error) {
    console.error('Check Versions API Error:', error);
    return NextResponse.json({ error: 'Failed to check content versions' }, { status: 500 });
  }
}

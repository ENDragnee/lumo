// app/api/offline/package/[contentId]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';
import { Highlight, IHighlight } from '@/models/Highlight';
import mongoose from 'mongoose';

// Define the type for the selected highlight fields
type SelectedHighlight = {
  color: string;
  highlighted_text: string;
  start_offset: number;
  end_offset: number;
};

type offlinePackageProps = {
  params: Promise<{
    contentId: string;
  }>;
}

export async function GET( _request: NextRequest, { params }: offlinePackageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { contentId } = await params;
  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    return NextResponse.json({ error: 'Invalid Content ID' }, { status: 400 });
  }

  const userId = new mongoose.Types.ObjectId(session.user.id);
  const contentObjectId = new mongoose.Types.ObjectId(contentId);

  try {
    await connectDB();

    const [contentData, highlightsData] = await Promise.all([
      Content.findById(contentObjectId).select('title data tags difficulty version').lean(),
      Highlight.find({ user_id: userId, content_id: contentObjectId })
        .select('color highlighted_text start_offset end_offset')
        .lean() as unknown as SelectedHighlight[]
    ]);

    if (!contentData) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const offlinePackage = {
      contentId: contentData._id.toString(),
      version: contentData.version,
      content: {
        title: contentData.title,
        data: contentData.data,
        tags: contentData.tags,
        difficulty: contentData.difficulty,
      },
      highlights: highlightsData.map(h => ({
        color: h.color,
        highlighted_text: h.highlighted_text,
        start_offset: h.start_offset,
        end_offset: h.end_offset,
      }))
    };

    return NextResponse.json(offlinePackage);

  } catch (error) {
    console.error('Offline Package API Error:', error);
    return NextResponse.json({ error: 'Failed to create offline package' }, { status: 500 });
  }
}

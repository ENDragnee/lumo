// api/highlights/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Highlight } from '@/models/Highlight';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    
    // Get content_id from URL query parameters
    const { searchParams } = new URL(request.url);
    const content_id = searchParams.get('id');
    
    // Validate content_id
    if (!content_id || !mongoose.Types.ObjectId.isValid(content_id)) {
      return NextResponse.json(
        { error: 'Invalid content ID' }, 
        { status: 400 }
      );
    }

    // Parse request body
    const { text, color, startOffset, endOffset } = await request.json();
    
    // Validate required fields
    if (!text || !color || startOffset === undefined || endOffset === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new highlight
    const newHighlight = await Highlight.create({
      user_id: session.user.id,
      content_id,
      color,
      highlighted_text: text,
      start_offset: startOffset,
      end_offset: endOffset
    });

    return NextResponse.json(newHighlight, { status: 201 });
  } catch (error) {
    console.error('Error creating highlight:', error);
    return NextResponse.json(
      { error: 'Failed to create highlight' },
      { status: 500 }
    );
  }
}

// GET endpoint for fetching highlights
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const content_id = searchParams.get('id');

    if (!content_id || !mongoose.Types.ObjectId.isValid(content_id)) {
      return NextResponse.json(
        { error: 'Invalid content ID' }, 
        { status: 400 }
      );
    }

    const highlights = await Highlight.find({
      user_id: session.user.id,
      content_id
    })
    .select('-__v -createdAt')
    .lean();

    return NextResponse.json(highlights);
  } catch (error) {
    console.error('Error fetching highlights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch highlights' },
      { status: 500 }
    );
  }
}
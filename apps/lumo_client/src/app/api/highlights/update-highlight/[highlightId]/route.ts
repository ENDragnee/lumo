import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Highlight } from '@/models/Highlight';
import { Types } from 'mongoose';

type HightlightParams = {
  params: Promise<{
    highlightId: string;
  }>
}
// PATCH /api/highlights/[highlightId]
export async function PATCH(request:NextRequest, { params }: HightlightParams) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const { highlightId } = await params;
    if( !highlightId || Types.ObjectId.isValid(highlightId) === false) {
      return NextResponse.json({ error: 'Invalid highlight ID' }, { status: 400 });
    }
    const { color } = await request.json();

    if (!color || typeof color !== 'string') {
      return NextResponse.json({ error: 'Color is required' }, { status: 400 });
    }

    const updateHighlightQuery = await Highlight.findOneAndUpdate(
      { _id: highlightId, user_id: userId },
      { color }
    ).exec();

    return NextResponse.json({ message: 'Highlight updated successfully', highlight: updateHighlightQuery }, { status: 200 });
  } catch (error) {
    console.error('Error updating highlight:', error);
    return NextResponse.json(
      { error: 'Failed to update highlight' },
      { status: 500 }
    );
  }
}

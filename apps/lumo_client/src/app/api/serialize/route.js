// Updated API route (api/serialize/route.ts)
import connectDB from '@/lib/mongodb';
import SerializedData from '@/models/SerializedData';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, tags } = await req.json();
    
    if (!data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const newContent = new SerializedData({
      data, // Directly use the string without JSON.stringify
      tags: tags || [],
      createdBy: session.user.id
    });

    const savedContent = await newContent.save();

    return NextResponse.json({
      id: savedContent._id,
      message: 'Content saved successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Serialization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
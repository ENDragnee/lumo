// app/api/track-interaction/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Interaction from '@/models/Interaction';

export async function POST(request: Request) {
  try {
    // Connect to the database if not already connected
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    // Parse the incoming JSON body
    const { userId, contentId } = await request.json();

    // Create the interaction record
    await Interaction.create({
      userId,
      contentId,
      type: 'view'
    });

    return NextResponse.json({ message: 'Interaction tracked' });
  } catch (error) {
    console.error('Error tracking interaction:', error);
    return NextResponse.error();
  }
}

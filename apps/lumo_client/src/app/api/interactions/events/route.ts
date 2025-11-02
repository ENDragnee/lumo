// app/api/interactions/events/route.ts
import { NextResponse } from 'next/server'
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import connectDB from '@/lib/mongodb';
import Interaction, { IInteraction } from '@/models/Interaction'; // Import IInteraction
import mongoose from 'mongoose';
import { z } from 'zod';

// Updated Zod schema to include new position fields
const InteractionEventSchema = z.object({
  eventType: z.enum(['start', 'end']),
  contentId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
  sessionId: z.string().min(10),
  // Position is sent with both start and end events
  position: z.number().min(0).max(100).optional(),
});

type InteractionEventBody = z.infer<typeof InteractionEventSchema>;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userId = new mongoose.Types.ObjectId(session.user.id);

  try {
    const body: InteractionEventBody = await request.json();
    const validation = InteractionEventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body', details: validation.error.flatten() }, { status: 400 });
    }
    
    const { eventType, contentId, sessionId, position } = validation.data;

    await connectDB();

    if (eventType === 'start') {
        // Create or update the 'start' event with the initial position
        await Interaction.findOneAndUpdate(
            { userId, sessionId, eventType: 'start' },
            { 
                $setOnInsert: { 
                    userId, 
                    contentId: new mongoose.Types.ObjectId(contentId), 
                    sessionId, 
                    eventType: 'start',
                    timestamp: new Date(),
                    startPosition: position // Save the starting position
                } 
            },
            { upsert: true }
        );
        return NextResponse.json({ message: 'Session started' }, { status: 201 });

    } else if (eventType === 'end') {
        const startEvent: IInteraction | null = await Interaction.findOne({ userId, sessionId, eventType: 'start' }).lean<IInteraction>();
        
        if (!startEvent) {
            return NextResponse.json({ message: 'Acknowledged, start event not found' }, { status: 202 });
        }
        
        const now = new Date();
        // Calculate duration in seconds
        const durationSeconds = Math.round((now.getTime() - startEvent.timestamp.getTime()) / 1000);
        
        // Use findOneAndUpdate to create the 'end' event. This prevents duplicates.
        await Interaction.findOneAndUpdate(
          { userId, sessionId, eventType: 'end' },
          {
            $setOnInsert: {
                userId,
                contentId: startEvent.contentId,
                sessionId,
                eventType: 'end',
                timestamp: now,
                durationSeconds, // Save the calculated duration
                startPosition: startEvent.startPosition, // Carry over from start event
                endPosition: position // Save the final position
            }
          },
          { upsert: true }
        );
        
        return NextResponse.json({ message: 'Session ended and data saved' });
    }

    return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });

  } catch (error) {
    console.error('[API /events] CRITICAL ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// app/api/interactions/events/route.ts
import { NextResponse } from 'next/server';
import { authOptions } from "@/lib/auth"; // Your auth config
import { getServerSession } from "next-auth/next";
import connectDB from '@/lib/mongodb';
import Interaction from '@/models/Interaction';
import Progress from '@/models/Progress';
import mongoose from 'mongoose';
import { z } from 'zod';

// Define a schema for validating the incoming request body
const InteractionEventSchema = z.object({
  eventType: z.enum(['start', 'end']),
  contentId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid contentId format",
  }),
  sessionId: z.string().min(10, { message: "SessionId is required and must be a valid string" }),
  // progress fields are optional
  startProgress: z.number().min(0).max(100).optional(),
  endProgress: z.number().min(0).max(100).optional(),
});

export async function POST(request: Request) {
  // 1. Get Session & Authenticate User
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // All subsequent operations will use this validated user ID
  const userId = new mongoose.Types.ObjectId(session.user.id);

  try {
    // 2. Parse and Validate Request Body
    const body = await request.json();
    const validation = InteractionEventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body', details: validation.error.flatten() }, { status: 400 });
    }
    
    const { eventType, contentId, sessionId, startProgress, endProgress } = validation.data;

    // 3. Connect to Database
    await connectDB();

    // 4. Handle Event Logic
    switch (eventType) {
      case 'start':
        // Use findOneAndUpdate with upsert to prevent creating duplicate 'start' events for the same session
        // This makes the endpoint idempotent and more robust against client-side glitches (e.g., double clicks)
        await Interaction.findOneAndUpdate(
          { userId, contentId, sessionId, eventType: 'start' },
          { 
            $setOnInsert: { // Only set these fields when a NEW document is created (upsert: true)
              userId,
              contentId: new mongoose.Types.ObjectId(contentId),
              sessionId,
              eventType: 'start',
              startProgress: startProgress || 0,
              timestamp: new Date(),
            }
          },
          { upsert: true }
        );
        return NextResponse.json({ message: 'Session started' }, { status: 201 });

      case 'end':
        // First, check if a 'start' event exists. This prevents orphaned 'end' events.
        const startEvent = await Interaction.findOne({ userId, sessionId, eventType: 'start' }).lean();
        
        if (!startEvent) {
          // It's possible the 'start' event hasn't been processed yet.
          // This isn't necessarily an error, but we can't process the 'end' event without it.
          // We can log this for debugging and return a success-like response to the client.
          console.warn(`'end' event received for session '${sessionId}' but no 'start' event found. Ignoring.`);
          return NextResponse.json({ message: 'Acknowledged, start event not found' }, { status: 202 });
        }

        const durationSeconds = (new Date().getTime() - new Date(startEvent.timestamp).getTime()) / 1000;
        
        // Use findOneAndUpdate with upsert for idempotency here as well.
        await Interaction.findOneAndUpdate(
          { userId, contentId, sessionId, eventType: 'end' },
          { 
            $setOnInsert: {
              userId,
              contentId: new mongoose.Types.ObjectId(contentId),
              sessionId,
              eventType: 'end',
              durationSeconds: Math.round(durationSeconds),
              // Use the endProgress from the request, fallback to the startProgress if unavailable
              endProgress: endProgress ?? startEvent.startProgress,
              timestamp: new Date(),
            }
          },
          { upsert: true }
        );

        // Update the master Progress model with the latest progress
        if (typeof endProgress === 'number') {
          await Progress.updateOne(
            { userId, contentId: new mongoose.Types.ObjectId(contentId) },
            { 
              $set: { 
                progress: endProgress, 
                status: endProgress >= 95 ? 'completed' : 'in-progress',
                userId // Ensure userId is set on upsert
              },
            },
            { upsert: true }
          );
        }

        return NextResponse.json({ message: 'Session ended and progress updated' });

      default:
        // This case should not be reachable due to Zod validation, but it's good practice
        return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
    }

  } catch (error) {
    console.error('[INTERACTION_EVENT_API_ERROR]', error);
    if (error instanceof z.ZodError) {
       return NextResponse.json({ error: 'Zod validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

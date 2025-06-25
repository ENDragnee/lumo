// app/api/interactions/events/route.ts
import { NextResponse } from 'next/server';
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import connectDB from '@/lib/mongodb';
import Interaction from '@/models/Interaction';
import Progress from '@/models/Progress';
import mongoose from 'mongoose';
import { z } from 'zod';

const InteractionEventSchema = z.object({
  eventType: z.enum(['start', 'end']),
  contentId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
  sessionId: z.string().min(10),
  startProgress: z.number().min(0).max(100).optional(),
  endProgress: z.number().min(0).max(100).optional(),
});

export async function POST(request: Request) {
  // --- DEBUG LOG 1 ---
  console.log('[API /events] POST request received.');

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // --- DEBUG LOG 2 ---
    console.error('[API /events] Unauthorized: No session or user ID found.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // --- DEBUG LOG 3 ---
  console.log(`[API /events] User authenticated: ${session.user.id}`);
  const userId = new mongoose.Types.ObjectId(session.user.id);

  try {
    const body = await request.json();
    // --- DEBUG LOG 4 ---
    console.log('[API /events] Request body parsed:', body);

    const validation = InteractionEventSchema.safeParse(body);
    if (!validation.success) {
      // --- DEBUG LOG 5 ---
      console.error('[API /events] Zod validation failed:', validation.error.flatten());
      return NextResponse.json({ error: 'Invalid request body', details: validation.error.flatten() }, { status: 400 });
    }
    
    const { eventType, contentId, sessionId, endProgress } = validation.data;

    await connectDB();
    // --- DEBUG LOG 6 ---
    console.log('[API /events] Database connection confirmed.');

    switch (eventType) {
      case 'start':
        // --- DEBUG LOG 7a ---
        console.log(`[API /events] Processing START event for session: ${sessionId}`);
        await Interaction.findOneAndUpdate(
          { userId, contentId: new mongoose.Types.ObjectId(contentId), sessionId, eventType: 'start' },
          { $setOnInsert: { /* ... as before ... */ } },
          { upsert: true }
        );
        console.log(`[API /events] START event processed successfully.`);
        return NextResponse.json({ message: 'Session started' }, { status: 201 });

      case 'end':
        // --- DEBUG LOG 7b ---
        console.log(`[API /events] Processing END event for session: ${sessionId}`);
        const startEvent = await Interaction.findOne({ userId, sessionId, eventType: 'start' }).lean();
        
        if (!startEvent) {
          console.warn(`[API /events] 'end' event received for session '${sessionId}' but no 'start' event found. Ignoring.`);
          return NextResponse.json({ message: 'Acknowledged, start event not found' }, { status: 202 });
        }
        
        // ... (rest of the 'end' logic)
        
        console.log(`[API /events] END event processed successfully. Progress updated.`);
        return NextResponse.json({ message: 'Session ended and progress updated' });
    }

  } catch (error) {
    // --- DEBUG LOG 8 (CRITICAL) ---
    console.error('[API /events] CRITICAL ERROR in try-catch block:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

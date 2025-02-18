// app/api/cron/update-interests/route.ts
import { NextResponse, NextRequest } from 'next/server';
import User from '@/models/User';
import Interaction from '@/models/Interaction';
import Content from '@/models/SerializedData';
import connectDB from '@/lib/mongodb';

export async function GET(req: NextRequest) {

  // Use a custom header instead of getToken for simplicity
  const cronSecret = req.headers.get('x-cron-secret');
  if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    
    // Batch processing with cursor
    const usersCursor = User.find().cursor();
    let processed = 0;
    
    for await (const user of usersCursor) {
      try {
        // Get recent interactions
        const interactions = await Interaction.find({ userId: user._id })
          .sort('-timestamp')
          .limit(100)
          .lean();

        // Get content tags from interactions
        const contentIds = interactions.map(i => i.contentId);
        const contents = await Content.find(
          { _id: { $in: contentIds } }, 
          { tags: 1 }
        ).lean();

        // Calculate tag weights (example logic)
        const tagWeights = new Map<string, number>();
        // ... (insert your tag weight calculation logic here)

        // Update user's interests
        await User.findByIdAndUpdate(user._id, {
          interests: Array.from(tagWeights.keys()).slice(0, 15)
        });

        processed++;
      } catch (error) {
        console.error(`Error processing user ${user._id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      processed
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

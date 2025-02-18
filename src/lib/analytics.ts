// lib/analytics.ts
import Interaction from '@/models/Interaction';
import connectDB from '@/lib/mongodb';

export async function trackInteraction(params: {
  userId: string;
  contentId: string;
  type: 'view' | 'save' | 'share' | 'completion';
}) {
  try {
    await connectDB();
    await Interaction.create(params);
  } catch (error) {
    console.error('Interaction tracking failed:', error);
  }
}
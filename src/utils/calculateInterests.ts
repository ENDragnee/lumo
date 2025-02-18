// utils/calculateInterests.ts
import User from '@/models/User';
import Interaction from '@/models/Interaction';
import SerializedData from '@/models/SerializedData';
import { IInteraction } from '@/models/Interaction'

const DECAY_FACTOR = 0.9; // 10% decay per calculation
const MAX_INTERESTS = 15;

export async function updateUserInterests(userId: string) {
  // Get recent interactions with content IDs
  const interactions = await Interaction.find<IInteraction>({ userId })
    .sort('-timestamp')
    .limit(100)
    .select('contentId type timestamp');

  // Get associated content tags in single query
  const contentIds = interactions.map(i => i.contentId);
  const contents = await SerializedData.find(
    { _id: { $in: contentIds } },
    { tags: 1 }
  ).lean();

  // Create contentId -> tags map
  const contentTags = new Map<string, string[]>(
    contents.map(c => [c._id.toString(), c.tags])
  );

  // Calculate tag weights
  const tagWeights = new Map<string, number>();
  
  interactions.forEach(interaction => {
    const tags = contentTags.get(interaction.contentId.toString()) || [];
    const timeDecay = Math.pow(DECAY_FACTOR, 
      (Date.now() - interaction.timestamp.getTime()) / 86400000
    );

    tags.forEach(tag => {
      const current = tagWeights.get(tag) || 0;
      const actionWeight = {
        view: 0.3,
        save: 0.5,
        share: 0.4,
        completion: 0.7
      }[interaction.type];
      
      tagWeights.set(tag, current + (actionWeight * timeDecay));
    });
  });

  // Update user document
  await User.findByIdAndUpdate(userId, {
    $set: {
      interests: Array.from(tagWeights.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, MAX_INTERESTS)
        .map(([tag]) => tag) // Store only tag names
    }
  });
}
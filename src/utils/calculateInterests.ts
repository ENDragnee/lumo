// lib/jobs/calculateInterests.ts

import User from '@/models/User';
import Interaction, { IInteraction } from '@/models/Interaction';
import Content from '@/models/Content'; // Use the correct Content model
import mongoose from 'mongoose';

// How much the score of an old interaction decays per day. 0.98 means 2% decay daily.
const TIME_DECAY_FACTOR = 0.98; 
const MAX_INTERESTS_TO_STORE = 20;

export async function updateUserInterestsForUser(userId: string) {
  // 1. Get all recent 'end' interactions for the user.
  // We only care about sessions that have a duration and progress.
  const recentInteractions = await Interaction.find({ 
    userId: new mongoose.Types.ObjectId(userId),
    eventType: 'end',
  })
    .sort({ timestamp: -1 })
    .limit(200) // Look at the last 200 completed sessions
    .select('contentId durationSeconds startProgress endProgress timestamp')
    .lean();

  if (recentInteractions.length === 0) {
    console.log(`No new interactions for user ${userId}. Skipping interest calculation.`);
    return;
  }
  
  // 2. Get the tags for all associated content in a single, efficient query.
  const contentIds = [...new Set(recentInteractions.map(i => i.contentId))]; // Get unique content IDs
  const contentsWithTags = await Content.find(
    { _id: { $in: contentIds } },
    { tags: 1 } // Select only the 'tags' field
  ).lean();

  // 3. Create a fast lookup map for contentId -> tags.
  const contentIdToTagsMap = new Map<string, string[]>();
  contentsWithTags.forEach(c => {
    if (c.tags && c.tags.length > 0) {
        contentIdToTagsMap.set(c._id.toString(), c.tags);
    }
  });
  
  // 4. Calculate new interest weights based on rich interaction data.
  const tagWeights = new Map<string, number>();

  for (const interaction of recentInteractions) {
    const tags = contentIdToTagsMap.get(interaction.contentId.toString());
    if (!tags) continue; // Skip if the content has no tags

    // Calculate how many days have passed since the interaction
    const daysSinceInteraction = (Date.now() - new Date(interaction.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    const timeDecay = Math.pow(TIME_DECAY_FACTOR, daysSinceInteraction);

    // --- NEW SCORING LOGIC ---
    let interactionScore = 0;
    // Add score for duration (1 point per 5 minutes)
    interactionScore += (interaction.durationSeconds || 0) / 300; 

    // Add score for progress made during the session
    const progressMade = (interaction.endProgress || 0) - (interaction.startProgress || 0);
    if (progressMade > 10) {
      interactionScore += 2; // Significant bonus for making progress
    }

    if (interactionScore > 0) {
        const weightedScore = interactionScore * timeDecay;
        
        tags.forEach(tag => {
          const currentWeight = tagWeights.get(tag) || 0;
          tagWeights.set(tag, currentWeight + weightedScore);
        });
    }
  }

  // 5. Get the user's existing interests to apply decay.
  const user = await User.findById(userId).select('dynamicInterests');
  if (!user) return;
  
  const existingInterests = user.dynamicInterests || new Map<string, number>();

  // Decay existing interests and merge with new weights
  existingInterests.forEach((value: any, key: any) => {
    const newWeight = (tagWeights.get(key) || 0) + (value * TIME_DECAY_FACTOR);
    tagWeights.set(key, newWeight);
  });

  // 6. Sort, slice, and prepare the final Map for the database.
  const sortedInterests = Array.from(tagWeights.entries())
    .sort((a, b) => b[1] - a[1]) // Sort by weight, descending
    .slice(0, MAX_INTERESTS_TO_STORE); // Keep only the top N interests

  const finalInterestsMap = new Map(sortedInterests);

  // 7. Update the user document in the database.
  await User.findByIdAndUpdate(userId, {
    $set: {
      dynamicInterests: finalInterestsMap,
    }
  });

  console.log(`Successfully updated dynamicInterests for user ${userId}.`);
}
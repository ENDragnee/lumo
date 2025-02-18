// models/Interaction.ts
import mongoose, { Document } from 'mongoose';

export interface IInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  contentId: mongoose.Types.ObjectId | { tags: string[] }; // Populated case
  type: 'view' | 'save' | 'share' | 'completion';
  timestamp: Date;
  expiresAt?: Date;
}

const InteractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
  type: {
    type: String,
    enum: ['view', 'save', 'share', 'completion'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  // TTL index for automatic cleanup (6 months)
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 15552000000), // 6 months
    index: { expires: 0 }
  }
});

InteractionSchema.index({ userId: 1, timestamp: -1 }); // Fast user history lookup
InteractionSchema.index({ contentId: 1, type: 1 }); // Content analytics

const Interaction = mongoose.models.Interaction || mongoose.model<IInteraction>('Interaction', InteractionSchema);

export default Interaction;
// models/Interaction.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IInteraction extends Document {
  _id: Schema.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  contentId: mongoose.Types.ObjectId;
  sessionId: string;
  eventType: 'start' | 'update' | 'end'; // Removed 'completion_event' for simplicity
  timestamp: Date;
  
  // --- NEW & UPDATED FIELDS ---
  durationSeconds?: number; // Total duration, calculated and saved on the 'end' event
  startPosition?: number;   // Position (e.g., scroll %) when the session started
  endPosition?: number;     // Position (e.g., scroll %) when the session ended
  
  // These fields are now less critical but can be kept for other uses
  startProgress?: number;
  endProgress?: number;
  performanceMetric?: number;
}

const InteractionSchema = new Schema<IInteraction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true, index: true },
  sessionId: { type: String, required: true, index: true },
  eventType: { type: String, enum: ['start', 'update', 'end'], required: true },
  timestamp: { type: Date, default: Date.now },

  // --- NEW & UPDATED FIELDS IN SCHEMA ---
  durationSeconds: { type: Number },
  startPosition: { type: Number, min: 0, max: 100 },
  endPosition: { type: Number, min: 0, max: 100 },
  
  startProgress: { type: Number, min: 0, max: 100 },
  endProgress: { type: Number, min: 0, max: 100 },
  performanceMetric: { type: Number },
}, {
  timestamps: true
});

InteractionSchema.index({ userId: 1, contentId: 1, sessionId: 1 });

const Interaction: Model<IInteraction> = mongoose.models.Interaction || mongoose.model<IInteraction>('Interaction', InteractionSchema);

export default Interaction;

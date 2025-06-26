// src/models/Progress.ts
import mongoose, { Schema, Document, Model } from 'mongoose'; // Import Model type

// Assume IProgress interface is defined above this line
export interface IProgress extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    contentId: mongoose.Schema.Types.ObjectId;
    contentType: 'lesson' | 'quiz'; // Example, adjust as needed
    progress: number;
    status: 'not-started' | 'in-progress' | 'completed';
    createdAt?: Date; // Included by timestamps: true
    updatedAt?: Date; // Included by timestamps: true
    // Add other fields as needed
}

const progressSchema = new Schema<IProgress>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    contentId: { type: Schema.Types.ObjectId, ref: 'SerializedData', required: true, index: true }, // Adjust ref if needed
    contentType: { type: String, enum: ['lesson', 'quiz'], required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started',
        required: true,
    },
    // Add other fields as needed
}, { timestamps: true });

// Ensure index for common queries
progressSchema.index({ userId: 1, contentId: 1, contentType: 1 }, { unique: true }); // Example compound unique index

// --- THE FIX ---
// Check if the model already exists in Mongoose's registry.
// If it does, use the existing model. Otherwise, create a new one.
const Progress: Model<IProgress> = mongoose.models.Progress || mongoose.model<IProgress>("Progress", progressSchema);
// ---------------

export default Progress;

// models/Performance.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type UnderstandingLevel = 'needs-work' | 'foundational' | 'good' | 'mastered';

export interface IPerformance extends Document {
    userId: Types.ObjectId;
    contentId: Types.ObjectId;
    understandingScore: number; // A score from 0-100 combining time and quiz scores
    understandingLevel: UnderstandingLevel;
    totalTimeSeconds: number; // Sum of all interaction durations
    averageQuizScore: number | null; // Average of all quiz attempts for this content
    lastCalculatedAt: Date;
}

const PerformanceSchema = new Schema<IPerformance>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
    understandingScore: { type: Number, required: true, min: 0, max: 100 },
    understandingLevel: { 
        type: String, 
        enum: ['needs-work', 'foundational', 'good', 'mastered'], 
        required: true 
    },
    totalTimeSeconds: { type: Number, required: true, default: 0 },
    averageQuizScore: { type: Number, min: 0, max: 100, default: null }, // Can be null if no quiz
    lastCalculatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// A user can only have one performance record per content item.
PerformanceSchema.index({ userId: 1, contentId: 1 }, { unique: true });

const Performance: Model<IPerformance> = mongoose.models.Performance || mongoose.model<IPerformance>("Performance", PerformanceSchema);

export default Performance;

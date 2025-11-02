// models/Score.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// This interface describes a user's answer for a single question
export interface IUserAnswer {
    question: string;
    userAnswer: string;
    isCorrect: boolean;
}

export interface IScore extends Document {
    userId: Types.ObjectId;
    challengeId: Types.ObjectId; // Direct link to the Challenge document
    score: number; // The final score, e.g., 80 for 80%
    answers: IUserAnswer[]; // Stores the user's submitted answers and if they were correct
    createdAt: Date;
    updatedAt: Date;
}

const UserAnswerSchema = new Schema<IUserAnswer>({
    question: { type: String, required: true },
    userAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
}, { _id: false });

const ScoreSchema = new Schema<IScore>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    answers: { type: [UserAnswerSchema], required: true }
}, { timestamps: true });

// Index for efficiently finding all scores for a specific challenge
ScoreSchema.index({ challengeId: 1, createdAt: -1 });

const Score: Model<IScore> = mongoose.models.Score || mongoose.model<IScore>("Score", ScoreSchema);

export default Score;

// models/Challenge.ts
import mongoose, { Types, Document } from "mongoose";

export type ChallengeType = 'certification' | 'quiz' | 'test';

export interface IChallengeQuestion extends Document {
    question: string;
    answer: string;
}

export interface IChallenge extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    contentId: Types.ObjectId;
    challengeType: ChallengeType;
    status: 'not-started' | 'in-progress' | 'completed';
    quizData: IChallengeQuestion[];
    createdAt: Date;
    updatedAt: Date;
}

const challengeQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
}, { _id: false });

const challengeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true },
    challengeType: { type: String, enum: ['certification', 'quiz', 'test'], required: true, default: 'quiz' }, // Renamed from contentType for clarity
    status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started',
        required: true,
    },
    quizData: { type: [challengeQuestionSchema], required: true },
}, { timestamps: true });

// Ensure a user can only have one challenge per content item
challengeSchema.index({ userId: 1, contentId: 1 }, { unique: true });

// CORRECTED: Use "Challenge" for both the check and the model name.
const Challenge = mongoose.models.Challenge || mongoose.model<IChallenge>("Challenge", challengeSchema);
export default Challenge;

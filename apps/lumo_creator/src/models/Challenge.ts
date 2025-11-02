import mongoose, { Types, Document } from "mongoose";

export type ChallengeType = 'certification' | 'quiz' | 'practice';
export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';

// This interface remains useful but isn't a separate model
export interface IChallengeQuestion {
    type: QuestionType;
    question: string;
    answer: string;
}

export interface IChallenge extends Document {
    _id: Types.ObjectId;
    contentId: Types.ObjectId;
    challengeType: ChallengeType;
    // Note: status and quizData are removed as they belong to the user's interaction, not the definition.
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const challengeSchema = new mongoose.Schema({
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true },
    challengeType: { type: String, enum: ['certification', 'quiz', 'practice'], required: true, default: 'quiz' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Challenge = mongoose.models.Challenge || mongoose.model<IChallenge>("Challenge", challengeSchema);
export default Challenge;

import mongoose, { Types, Document } from "mongoose";

export interface IUserAnswer {
    questionNodeId: string;
    userAnswer: any;
    isCorrect: boolean;
}

export interface IChallengeInteraction extends Document {
    _id: Types.ObjectId;
    challengeId: Types.ObjectId;
    userId: Types.ObjectId;
    contentId: Types.ObjectId;
    status: 'in-progress' | 'completed';
    score: number;
    answers: IUserAnswer[];
    startedAt: Date;
    completedAt?: Date;
}

const userAnswerSchema = new mongoose.Schema({
    questionNodeId: { type: String, required: true },
    userAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
    isCorrect: { type: Boolean, required: true },
}, { _id: false });

const challengeInteractionSchema = new mongoose.Schema({
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true },
    status: {
        type: String,
        enum: ['in-progress', 'completed'],
        required: true,
        default: 'in-progress'
    },
    score: { type: Number, default: 0 },
    answers: { type: [userAnswerSchema], default: [] },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
}, { timestamps: true });

challengeInteractionSchema.index({ userId: 1, challengeId: 1, status: 1 });

const ChallengeInteraction = mongoose.models.ChallengeInteraction || mongoose.model<IChallengeInteraction>("ChallengeInteraction", challengeInteractionSchema);
export default ChallengeInteraction;

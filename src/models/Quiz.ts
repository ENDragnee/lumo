// models/Quiz.ts (Recommended Update)
import mongoose, { Types, Document } from "mongoose";

export interface IQuizQuestion extends Document {
    question: string;
    answer: string;
    // Add options if you plan multiple choice later
    // options?: string[];
}

interface IQuiz extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId; // Added userId based on schema definition
    contentId: Types.ObjectId;
    quizData: IQuizQuestion[]; // Changed to array of structured objects
    createdAt: Date;
    updatedAt: Date; // Added by timestamps: true
}

// Define the sub-document schema
const quizQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    // options: [String] // Uncomment if using multiple choice
}, { _id: false }); // Don't create separate IDs for sub-documents unless needed

const quizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SerializedData", // Make sure you have a SerializedData model or adjust ref
        required: true,
    },
    quizData: {
        type: [quizQuestionSchema], // Use the sub-document schema
        required: true,
    },
}, {
    timestamps: true, // This adds createdAt and updatedAt automatically
});

// Check if the model already exists before defining it
const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", quizSchema);
export default Quiz;

// Ensure Progress model is also exported correctly
// (Assuming your Progress model file exports it similarly)
// Example: export const Progress = mongoose.models.Progress || mongoose.model<IProgress>("Progress", progressSchema);
// export default Progress; // Or named export if preferred
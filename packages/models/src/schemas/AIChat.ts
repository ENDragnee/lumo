import mongoose, { Schema } from "mongoose";
import { AIChatInterface } from "../interfaces/AIChatInterface";

const AIChatSchema = new Schema<AIChatInterface>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  content_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const AIChat =
  mongoose.models.AIChat ||
  mongoose.model<AIChatInterface>("AIChat", AIChatSchema);

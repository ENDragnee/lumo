import { Document, Schema } from "mongoose";

export interface AIChatInterface extends Document {
  user_id: Schema.Types.ObjectId;
  content_id: Schema.Types.ObjectId;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt?: Date;
}

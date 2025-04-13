import mongoose, { Document, Schema} from 'mongoose';

export interface AIDocument extends Document{
  user_id: Schema.Types.ObjectId;
  content_id: Schema.Types.ObjectId;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt?: Date;
}

const AIChatSchema = new Schema<AIDocument>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  content_id:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const AIChat = mongoose.models.AIChat || mongoose.model<AIDocument>('AIChat', AIChatSchema);

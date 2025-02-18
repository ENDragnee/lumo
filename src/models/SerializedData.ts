// models/Content.ts
import mongoose, { Document, Model, Types } from 'mongoose';

export interface IContent extends Document {
  title: string;
  views: number;
  passRate: number;
  thumbnail: string;
  rating?: number;
  data: string;
  createdAt: Date;
  createdBy: Types.ObjectId;
  tags: string[];
  institution?: string;
  subject?: string;
  userEngagement: {
    saves: number;
    shares: number;
    completions: number;
  };
}

const ContentSchema = new mongoose.Schema<IContent>({
  title: { type: String, required: true },
  views: { type: Number, default: 0 },
  passRate: { type: Number, default: 0 },
  thumbnail: { type: String, required: true },
  rating: Number,
  data: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  institution: { type: String },
  subject: { type: String },
  userEngagement: {
    saves: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    completions: { type: Number, default: 0 }
  }
});

// Indexes
ContentSchema.index({ tags: 1, createdAt: -1 }); // For recommendation queries
ContentSchema.index({ 'userEngagement.saves': -1 }); // For popular content

const Content: Model<IContent> = 
  mongoose.models.Content || 
  mongoose.model('Content', ContentSchema);

export default Content;
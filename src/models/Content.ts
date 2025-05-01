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
  lastModifiedAt?: Date;
  createdBy: Types.ObjectId;
  tags: string[];
  institution?: string;
  subject?: string;
  userEngagement: {
    saves: number;
    shares: number;
    completions: number;
  };
  parentId: Types.ObjectId | null;
  isDraft: boolean;
  isTrash: boolean;
}

const ContentSchema = new mongoose.Schema<IContent>({
  title: { type: String, required: true },
  views: { type: Number, default: 0 },
  passRate: { type: Number, default: 0 },
  thumbnail: { type: String, required: true },
  rating: Number,
  data: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // Points to the parent Book document
    default: null // null means it's in the root directory for the user
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
  },
  isDraft: { type: Boolean, default: true },
  isTrash: { type: Boolean, default: false },
});

const Content: Model<IContent> = 
  mongoose.models.Content || 
  mongoose.model('Content', ContentSchema);

export default Content;
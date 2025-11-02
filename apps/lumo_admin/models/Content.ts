// models/Content.ts
import mongoose, { Document, Model, Types } from 'mongoose';

export type ContentType = 'static' | 'dynamic';

export interface IContent extends Document {
  _id: string;
  title: string;
  views: number;
  thumbnail: Types.ObjectId;
  contentType: ContentType;
  data: string;
  createdAt: Date;
  lastModifiedAt?: Date;
  createdBy: Types.ObjectId;
  tags: string[];
  difficulty?: "easy" | "medium" | "hard";
  description?: string;
  estimatedTime?: number;
  userEngagement: {
    rating?: number;
    views?: number;
    saves?: number;
    shares?: number;
    completions?: number;
  };
  parentId: Types.ObjectId | null;
  isDraft: boolean;
  isTrash: boolean;
  version: number;
  institutionId?: Types.ObjectId;
  order: number; 
}

const defaultData = `'{\"ROOT\":{\"type\":{\"resolvedName\":\"renderCanvas\"},\"isCanvas\":true,\"props\":{\"gap\":8,\"padding\":16},\"displayName\":\"Canvas\",\"custom\":{},\"hidden\":false,\"nodes\":[],\"linkedNodes\":{}}}'`;

const ContentSchema = new mongoose.Schema<IContent>({
  title: { type: String, required: true },
  views: { type: Number, default: 0 },
  thumbnail: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Media",
    required: false // Note: Changed to false as sample data may not have it. Set to true if always required.
  },
  contentType: {
    type: String,
    enum: ['static', 'dynamic'],
    required: true,
    default: 'dynamic'
  },
  data: {
    type: String,
    required: true,
    default: defaultData
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
    ref: 'User', // ✨ ADDED: Add ref for population
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default: null
  },
  tags: {
    type: [String],
    default: []
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy"
  },
  description: { type: String },
  estimatedTime: { type: Number, default: 0 },
  userEngagement: {
    rating: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    completions: { type: Number, default: 0 }
  },
  isDraft: { type: Boolean, default: true },
  isTrash: { type: Boolean, default: false },
  version: {
    type: Number,
    default: 1
  },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: false
  },
  // ✨ CHANGED: Simple numeric order field.
  order: {
    type: Number,
    default: 0
  }
});

const Content: Model<IContent> = 
  mongoose.models.Content || 
  mongoose.model('Content', ContentSchema);

export default Content;

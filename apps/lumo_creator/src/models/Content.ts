// models/Content.ts
import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type ContentType = 'static' | 'dynamic';

export interface IContent extends Document {
  _id: string;
  title: string;
  thumbnail: Types.ObjectId;
  contentType: ContentType;
  data: any; 
  createdAt: Date;
  lastModifiedAt?: Date;
  createdBy: Types.ObjectId;
  institutionId?: Types.ObjectId; 
  parentId: Types.ObjectId | null; 
  tags: string[];
  difficulty?: "easy" | "medium" | "hard";
  description?: string;
  estimatedTime?: number;
  userEngagement: {
    rating: number;
    views: number;
    saves: number;
    shares: number;
    completions: number;
  };
  prerequisites?: Types.ObjectId[];
  isDraft: boolean;
  isTrash: boolean;
  version: number; 
}

const defaultData = {
  ROOT: {
    type: { resolvedName: "RenderCanvas" },
    isCanvas: true,
    props: { gap: 8, padding: 16 },
    displayName: "Canvas",
    custom: {},
    hidden: false,
    nodes: [],
    linkedNodes: {},
  }
};

const ContentSchema = new mongoose.Schema<IContent>({
  title: { type: String, required: true },
  thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: "Media", required: true },
  contentType: { type: String, enum: ['static', 'dynamic'], required: true, default: 'dynamic' },
  data: { 
    type: Schema.Types.Mixed,
    required: true,
    default: () => defaultData,
  },
  createdAt: { type: Date, default: Date.now },
  lastModifiedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection', 
    default: null,
    index: true // Good to index parentId
  },
  tags: { type: [String], default: [] },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
  description: { type: String },
  estimatedTime: { type: Number, default: 0 },
  userEngagement: { // Consolidated views here
    rating: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    completions: { type: Number, default: 0 }
  },
  prerequisites: [{ // An array of prerequisites
    type: Schema.Types.ObjectId,
    ref: 'Content',
  }],
  isDraft: { type: Boolean, default: true },
  isTrash: { type: Boolean, default: false },
  version: { type: Number, default: 1 },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: false
  },
});

const Content: Model<IContent> = 
  mongoose.models.Content || mongoose.model('Content', ContentSchema);

export default Content;

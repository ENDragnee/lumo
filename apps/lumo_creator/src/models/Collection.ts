// models/Collection.ts (renamed from Book)
import mongoose, { Document, Model, Types } from 'mongoose';

// I've renamed IBook to ICollection for clarity
export interface ICollection extends Document {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: Types.ObjectId; 
  parentId: Types.ObjectId | null;
  childCollections: Types.ObjectId[];
  childContent: Types.ObjectId[];
  isDraft: boolean;
  isTrash: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: Types.ObjectId;
  institutionId?: Types.ObjectId; 
  tags: string[];
  genre?: string;
  publishedAt?: Date;
  userEngagement: {
    rating: number;
    views: number;
    saves: number;
    shares: number;
    completions: number;
    favorites: number; // Moved favorites inside
  };
  prerequisites?: Types.ObjectId[];
}

const CollectionSchema = new mongoose.Schema<ICollection>({
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: "Media", required: false },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection', // Points to another collection
    default: null,
    index: true // Good to index parentId
  },
  childCollections: [{ // Stores ordered list of child collections
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection'
  }],
  childContent: [{ // Stores ordered list of child content
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  }],
  isDraft: { type: Boolean, default: true },
  isTrash: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: { type: [String], default: [] },
  genre: { type: String },
  publishedAt: { type: Date },
  userEngagement: {
    rating: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 } // Consolidated
  },
  prerequisites: [{ // An array of prerequisites
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection'
  }],
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: false
  },
});

const Collection: Model<ICollection> =
  mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);

export default Collection;

import { Document, Types } from "mongoose";

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
    favorites: number;
  };
  prerequisites?: Types.ObjectId[];
}

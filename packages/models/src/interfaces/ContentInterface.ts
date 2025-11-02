import { Document, Types } from "mongoose";

export type ContentType = "static" | "dynamic";

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

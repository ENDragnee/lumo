// @/models/Media.ts
import mongoose, { Document, Model, Types } from 'mongoose';
export interface IMediaData {
  _id: string;
  tag?: string;
  uploadedBy: string; // ObjectId is serialized to a string
  mediaType: 'image' | 'video' | 'thumbnail';
  mediaSize: number;
  filename: string;
  path: string;
  createdAt: string; // Date is serialized to an ISO string
}

export interface IMedia extends Document {
  _id: Types.ObjectId;
  tag?: string;
  uploadedBy: Types.ObjectId;
  mediaType: 'image' | 'video' | 'thumbnail';
  mediaSize: number;
  filename: string;
  path: string;
  createdAt: Date;
}

const MediaSchema = new mongoose.Schema<IMedia>({
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  tag: {
    type: String,
    required: false,
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'thumbnail'],
    required: true,
  },
  mediaSize: {
    type: Number,
    required: true
  },
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);

export default Media;

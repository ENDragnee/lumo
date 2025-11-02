// models/Media.ts
import mongoose, { Document, Model, Types } from 'mongoose';

export interface IMedia extends Document {
  _id: string;
  uploadedBy: Types.ObjectId;
  mediaType: 'image' | 'video' | 'thumbnail';
  filename: string;
  path: string;
  createdAt: Date;
}

const MediaSchema = new mongoose.Schema<IMedia>({
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Adjust reference if your user model is named differently
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'thumbnail'],
    required: true,
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

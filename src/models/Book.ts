import mongoose, { Document, Model, Types } from 'mongoose';

export interface IBook extends Document {
  title: string;
  description?: string;
  thumbnail: string;
  parentId: Types.ObjectId | null;
  isDraft: boolean;
  isTrash: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: Types.ObjectId;
  tags: string[];
  genre?: string;
  publishedAt?: Date;
  views: number;
  favorites: number;
  ratings: {
    average: number;
    count: number;
  };
}

const BookSchema = new mongoose.Schema<IBook>({
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String, required: false },
  isDraft: { type: Boolean, default: true },
  isTrash: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User",required: true },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // Points to the parent Book document
    default: null // null means it's in the root directory for the user
  },
  tags: { type: [String], default: [] },
  genre: { type: String },
  publishedAt: { type: Date },
  views: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
});

const Book: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default Book;

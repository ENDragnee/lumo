// models/Collection.ts
import mongoose, { Model } from "mongoose";
import { ICollection } from "../interfaces/CollectionInterface";

const CollectionSchema = new mongoose.Schema<ICollection>({
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    required: false,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
    default: null,
    index: true,
  },
  childCollections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },
  ],
  childContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
    },
  ],
  isDraft: { type: Boolean, default: true },
  isTrash: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tags: { type: [String], default: [] },
  genre: { type: String },
  publishedAt: { type: Date },
  userEngagement: {
    rating: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
  },
  prerequisites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },
  ],
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
    required: false,
  },
});

const Collection: Model<ICollection> =
  mongoose.models.Collection ||
  mongoose.model<ICollection>("Collection", CollectionSchema);

export default Collection;

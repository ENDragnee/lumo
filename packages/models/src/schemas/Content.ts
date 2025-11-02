// Content.ts
import mongoose, { Model, Schema } from "mongoose";
import { IContent } from "../interfaces/ContentInterface";

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
  },
};

const ContentSchema = new mongoose.Schema<IContent>({
  title: { type: String, required: true },
  thumbnail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    required: true,
  },
  contentType: {
    type: String,
    enum: ["static", "dynamic"],
    required: true,
    default: "dynamic",
  },
  data: {
    type: Schema.Types.Mixed,
    required: true,
    default: () => defaultData,
  },
  createdAt: { type: Date, default: Date.now },
  lastModifiedAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
    default: null,
    index: true, // Good to index parentId
  },
  tags: { type: [String], default: [] },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
  description: { type: String },
  estimatedTime: { type: Number, default: 0 },
  userEngagement: {
    // Consolidated views here
    rating: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
  },
  prerequisites: [
    {
      // An array of prerequisites
      type: Schema.Types.ObjectId,
      ref: "Content",
    },
  ],
  isDraft: { type: Boolean, default: true },
  isTrash: { type: Boolean, default: false },
  version: { type: Number, default: 1 },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
    required: false,
  },
});

const Content: Model<IContent> =
  mongoose.models.Content || mongoose.model("Content", ContentSchema);

export default Content;

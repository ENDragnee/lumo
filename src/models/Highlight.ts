// models/Highlight.ts
import mongoose, { Schema, Document, model} from "mongoose";

export interface IHighlight extends Document {
  _id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  content_id: Schema.Types.ObjectId;
  color: string;
  highlighted_text: string;
  start_offset: number;
  end_offset: number;
  contextPrefix: string;
  contextSuffix: string;
  createdAt: Date;
}

const highlightSchema = new Schema<IHighlight>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  content_id:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  highlighted_text: {
    type: String,
    required: true
  },
  start_offset: {
    type: Number,
    required: true
  },
  end_offset: {
    type: Number,
    required: true
  },
  contextPrefix: {
    type: String,
    required: false,
  },
  contextSuffix: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Highlight = mongoose.models.Highlight || mongoose.model('Highlight', highlightSchema);

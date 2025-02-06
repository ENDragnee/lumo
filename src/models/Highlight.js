// models/Highlight.js
import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Highlight = mongoose.models.Highlight || mongoose.model('Highlight', highlightSchema);
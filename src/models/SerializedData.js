import mongoose from 'mongoose';

const SerializedDataSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
});

// Create index for tags
SerializedDataSchema.index({ tags: 1 });

// Use existing model or create new one
const SerializedData = 
  mongoose.models.Content || 
  mongoose.model('Content', SerializedDataSchema);

export default SerializedData;
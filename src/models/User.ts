import mongoose from 'mongoose';
import { unique } from 'next/dist/build/utils';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  password_hash: {
    type: String,
    required: true
  },
  user_type: {
    type: String,
    default: 'student'
  },
  name: {
    type: String,
    required: true
  },
  userTag: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
     type: Date, 
     default: Date.now 
  },
  bio: String,
  profileImage: String,
  bannerImage: String,
  tags: [String],
  credentials: [String],
  subscribersCount: { type: Number, default: 0 },
  totalViews: { type: Number, default: 0 },
  featuredContent: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content' 
  }]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
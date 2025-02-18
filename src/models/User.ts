import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password_hash: string;
  user_type: string;
  name: string;
  userTag: string;
  createdAt: Date;
  gender: string;
  bio?: string;
  profileImage?: string;
  bannerImage?: string;
  tags: string[];
  credentials: string[];
  subscribersCount: number;
  totalViews: number;
  featuredContent: mongoose.Types.ObjectId[];
  dynamicInterests: Map<string, number>;
  interactionHistory: mongoose.Types.ObjectId[];
}

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
  gender: { type: String, required: true},
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
  }],
  dynamicInterests: {
    type: Map,
    of: Number, // Format: {"calculus": 0.85, "physics": 0.72}
    default: new Map()
  },
  interactionHistory: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Interaction',
    default: []
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
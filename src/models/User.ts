import mongoose, { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId; // Explicit _id
  email: string;
  password_hash?: string; // Make password optional for OAuth users
  user_type: string;
  name: string;
  userTag: string;
  createdAt: Date;
  gender?: string; // Make gender optional as it might not come from OAuth
  bio?: string;
  profileImage?: string; // Can be populated from Google
  bannerImage?: string;
  tags: string[];
  credentials: string[];
  subscribersCount: number;
  totalViews: number;
  featuredContent: mongoose.Types.ObjectId[];
  dynamicInterests: Map<string, number>;
  interactionHistory: mongoose.Types.ObjectId[];
  provider?: 'credentials' | 'google'; // Track the login provider
  providerAccountId?: string; // Store Google's unique user ID
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  // Password is NOT required at the schema level for OAuth users
  password_hash: {
    type: String,
    required: false // Changed from true
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
    // Consider adding logic to auto-generate this on creation if missing
  },
  createdAt: {
     type: Date,
     default: Date.now
  },
  // Make gender optional or handle default value
  gender: {
    type: String,
    required: false // Changed from true
  },
  bio: String,
  profileImage: String, // Google might provide this
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
    of: Number,
    default: new Map()
  },
  interactionHistory: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Interaction',
    default: []
  },
  // Add fields for OAuth tracking
  provider: {
    type: String,
    enum: ['credentials', 'google'], // Limit possible values
  },
  providerAccountId: { // Unique ID from the OAuth provider (e.g., Google sub)
    type: String,
  }
},{
  timestamps: true // Optional: Adds createdAt and updatedAt automatically if you remove the default
});

// Optional: Add a compound index for faster OAuth lookup
userSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true, sparse: true });
// Optional: Index on userTag if not already default _id behavior
// userSchema.index({ userTag: 1 }, { unique: true });

// Use existing model if available, otherwise create it
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
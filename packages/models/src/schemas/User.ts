// models/User
import mongoose from "mongoose";
import { IUser } from "../interfaces/UserInterface";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      default: "standard",
    },
    userTag: {
      type: String,
      required: true,
      unique: true,
      // Consider adding logic to auto-generate this on creation if missing
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    gender: {
      type: String,
      required: true,
    },
    bio: String,
    profileImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      required: false,
    },
    tags: [String],
    credentials: [String],
    subscribersCount: { type: Number, default: 0 },
    provider: {
      type: String,
      enum: ["credentials", "google"],
    },
    providerAccountId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Optional: Add a compound index for faster OAuth lookup
userSchema.index(
  { provider: 1, providerAccountId: 1 },
  { unique: true, sparse: true },
);

// Use existing model if available, otherwise create it
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;

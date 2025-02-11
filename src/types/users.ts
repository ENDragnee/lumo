import mongoose from "mongoose";

export interface Creator {
  _id: mongoose.Types.ObjectId,
  user_type: String,
  name: String,
  bio: String,
  profileImage: String;
  bannerImage: String;
  tags: [String];
  credentials: [String];
  subscribersCount: Number;
  totalViews: Number
}
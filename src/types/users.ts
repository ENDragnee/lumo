import mongoose from "mongoose";

export interface Creator {
  _id: mongoose.Types.ObjectId,
  user_type: string,
  name: string,
  userTag: string,
  bio: string,
  profileImage: string;
  bannerImage: string;
  tags: [string];
  credentials: [string];
  subscribersCount: number;
  totalViews: number
}
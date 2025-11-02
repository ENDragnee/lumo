import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  passwordHash: string;
  userType: "standard" | "admin" | "premium";
  userTag: string;
  createdAt: Date;
  gender: string;
  bio?: string;
  profileImage?: Types.ObjectId;
  tags?: string[];
  credentials?: string[];
  subscribersCount: number;
  provider: "credentials" | "google";
  providerAccountId?: string;
}

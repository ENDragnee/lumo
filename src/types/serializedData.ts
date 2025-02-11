import mongoose from "mongoose";
export interface SerializedData {
    _id: string;
    title: string;
    views: Number;
    passRate: Number;
    rating: Number;
    thumbnail: String;
    data: string;
    tags: string[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
  }
  
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
  }
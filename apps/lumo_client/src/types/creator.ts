import mongoose from 'mongoose';

export interface Creator {
  _id: mongoose.Types.ObjectId | string;
  id?: string; // Add id if _id is not always a string or easily usable as key
  user_type: string;
  name: string;
  avatarUrl?: string;
  tagline?: string;
  bio?: string;
  credentials?: string[];
  socialLinks?: { platform: string; url: string }[];
}

// Make sure this matches the definition used in HeroContent
export interface ContentItem {
  _id: mongoose.Types.ObjectId | string;
  id?: string; // Add id if _id is not always a string or easily usable as key
  title: string;
  thumbnail: string;
  type: 'lesson' | 'book' | 'playlist' | 'other';
  description?: string;
  views?: number;
  // Indicate if it's featured or popular (optional, depends on API)
  isFeatured?: boolean;
  popularityScore?: number; // Another example
}

export interface Stats {
  subscriberCount?: number;
  totalViews?: number;
  rating?: number;
  ratingCount?: number;
  contentCount?: number;
}

export interface FooterProps {
  name?: string;
  tagline?: string;
  socialLinks?: { platform: string; url: string }[];
}
// @/app/api/creator/[creatorId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import Content from "@/models/Content";
import Book from "@/models/Book";
import mongoose from "mongoose";
import { Creator } from "@/types/creator";

type CreatorProps = {
  params: Promise<{
    creatorId: string;
  }>
}

export async function GET(_request: NextRequest, { params }: CreatorProps) {
  try {
    await connectDB();
    const { creatorId } = await params;

    if (!creatorId || !mongoose.Types.ObjectId.isValid(creatorId)) {
      return NextResponse.json(
        { message: "A valid Creator ID is required." },
        { status: 400 }
      );
    }

    // Fetch creator, their content, and their books in parallel
    const [creator, content, books] = await Promise.all([
      User.findById(creatorId).select("-password_hash -email").lean<IUser>(),
      // UPDATED: Populate the 'createdBy' field to include the creator's name and ID on each content item
      Content.find({ createdBy: creatorId, isDraft: false, isTrash: false })
        .sort({ createdAt: -1 })
        .populate('createdBy', 'name _id') // <-- ADDED THIS
        .lean(),
      Book.find({ createdBy: creatorId, isDraft: false, isTrash: false })
        .sort({ createdAt: -1 })
        .populate('createdBy', 'name _id') // <-- AND ADDED THIS
        .lean(),
    ]);

    if (!creator) {
      return NextResponse.json({ message: "Creator not found" }, { status: 404 });
    }

    const allPublishedItems = [...content, ...books];

    const stats = {
      totalViews: allPublishedItems.reduce((sum, item) => sum + (item.views || 0), 0),
      rating: content.length > 0 ? content.reduce((sum, c) => sum + (c.userEngagement.rating || 0), 0) / content.length : 0,
      ratingCount: content.length,
      subscriberCount: creator.subscribersCount || 0,
    };

    return NextResponse.json({ creator, content, books, stats }, { status: 200 });

  } catch (error) {
    console.error("Error fetching creator data:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

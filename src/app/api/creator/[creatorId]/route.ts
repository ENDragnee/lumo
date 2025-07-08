// @/app/api/creator/[creatorId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User, { IUser } from "@/models/User"; // Keep IUser for type safety
import Content from "@/models/Content";
import Book from "@/models/Book";
import mongoose from "mongoose";

// The 'request' parameter is required by Next.js, but if you don't use it,
// prefixing it with an underscore is a common convention to avoid linting errors.
export async function GET(_request: NextRequest, { params }: { params: { creatorId: string } }) {
  try {
    await connectDB();
    const { creatorId } = params;

    if (!creatorId || !mongoose.Types.ObjectId.isValid(creatorId)) {
      return NextResponse.json(
        { message: "A valid Creator ID is required." },
        { status: 400 }
      );
    }

    // Fetch creator, their content, and their books in parallel
    const [creator, content, books] = await Promise.all([
      // FIX: Provide a generic type to .lean() to tell TypeScript the shape of the plain object.
      User.findById(creatorId).select("-password_hash -email").lean<IUser>(),
      Content.find({ createdBy: creatorId, isDraft: false, isTrash: false }).sort({ createdAt: -1 }).lean(),
      Book.find({ createdBy: creatorId, isDraft: false, isTrash: false }).sort({ createdAt: -1 }).lean(),
    ]);

    if (!creator) {
      return NextResponse.json({ message: "Creator not found" }, { status: 404 });
    }

    const allPublishedItems = [...content, ...books];

    const stats = {
      totalViews: allPublishedItems.reduce((sum, item) => sum + (item.views || 0), 0),
      rating:
        content.length > 0
          ? content.reduce((sum, c) => sum + (c.rating || 0), 0) / content.length
          : 0,
      ratingCount: content.length,
      // FIX: The 'as IUser' assertion is no longer needed because 'creator' is now correctly typed.
      subscriberCount: creator.subscribersCount || 0,
    };

    return NextResponse.json({ creator, content, books, stats }, { status: 200 });

  } catch (error) {
    console.error("Error fetching creator data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

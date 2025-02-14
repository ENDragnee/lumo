import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Content from "@/models/SerializedData";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // Get id from URL search params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate id
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (Array.isArray(id)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const [creator, content] = await Promise.all([
      User.findById(id).select("-password_hash -email").lean(),
      Content.find({ createdBy: id })
        .populate("createdBy", "name profileImage")
        .lean(),
    ]);

    if (!creator) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    const stats = {
      totalViews: content.reduce((sum, c) => sum + (c.views || 0), 0),
      averageRating:
        content.length > 0
          ? content.reduce((sum, c) => sum + (c.averageRating || 0), 0) / content.length
          : 0,
      totalContent: content.length,
    };

    return NextResponse.json({ creator, content, stats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching creator data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Content from "@/models/SerializedData";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await connectDB();
    const { userId } = await params;

    const [creator, content] = await Promise.all([
      User.findById(userId).select('-password_hash -email').lean(),
      Content.find({ createdBy: userId }).populate('createdBy', 'name profileImage').lean()
    ]);

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    // Calculate aggregated stats
    const stats = {
      totalViews: content.reduce((sum, c) => sum + (c.views || 0), 0),
      averageRating: content.length > 0
        ? content.reduce((sum, c) => sum + (c.averageRating || 0), 0) / content.length
        : 0,
      totalContent: content.length
    };

    return NextResponse.json({ creator, content, stats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching creator data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

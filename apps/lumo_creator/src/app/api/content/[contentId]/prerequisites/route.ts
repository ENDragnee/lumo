//@/app/api/content/[contentId]/prerequisites/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Content from "@/models/Content";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{ contentId: string }>;
}

// PUT (Update) a content item's prerequisites
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const userId = new mongoose.Types.ObjectId(session.user.id);
  const { contentId } = await params;

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    return NextResponse.json({ success: false, message: "Invalid Content ID" }, { status: 400 });
  }

  try {
    const { prerequisites } = await request.json();

    // Validate that prerequisites is an array of valid ObjectIDs
    if (!Array.isArray(prerequisites) || !prerequisites.every(id => mongoose.Types.ObjectId.isValid(id))) {
        return NextResponse.json({ success: false, message: "Invalid prerequisites format." }, { status: 400 });
    }

    const updatedContent = await Content.findOneAndUpdate(
      { _id: contentId, createdBy: userId },
      { $set: { prerequisites: prerequisites.map(id => new mongoose.Types.ObjectId(id)) } },
      { new: true }
    );

    if (!updatedContent) {
        return NextResponse.json({ success: false, message: "Content not found or update failed." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedContent.prerequisites });
  } catch (error) {
    console.error("Error updating prerequisites:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

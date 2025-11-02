import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Content from "@/models/Content"; // Assuming this is your updated model
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

type ContentRouteParams = {
  params: Promise<{ // The 'await' in your original code was unnecessary here
    contentId: string;
  }>;
};

// --- GET a single Content item by ID ---
export async function GET(
  request: NextRequest,
  { params }: ContentRouteParams
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const userId = session.user.id;
  const { contentId } = await params;

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    return NextResponse.json({ success: false, message: "Invalid Content ID" }, { status: 400 });
  }

  const content = await Content.findOne({
    _id: contentId,
    createdBy: new mongoose.Types.ObjectId(userId),
  })
    .populate<{ thumbnail: { path: string } }>("thumbnail", "path")
    .lean();

  if (!content) {
    return NextResponse.json({ success: false, message: "Content not found or permission denied." }, { status: 404 });
  }

  // --- FIX: Return the `data` field as a native JSON object ---
  // Mongoose will provide it as an object because the schema type is Mixed.
  const transformedContent = {
    ...content,
    thumbnail: content.thumbnail?.path || null,
    data: content.data, // No parsing or stringification needed
  };

  return NextResponse.json({ success: true, data: transformedContent });
}

// --- PUT (Update) a Content item ---
export async function PUT(
  request: NextRequest,
  { params }: ContentRouteParams
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const userId = session.user.id;
  const { contentId } = await params;
  const body = await request.json();

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    return NextResponse.json({ success: false, message: "Invalid Content ID" }, { status: 400 });
  }

  const { createdBy, isTrash, _id, version, ...updateData } = body;
  
  // --- FIX: The `data` field in `updateData` is now a JSON object. ---
  // Mongoose's `Mixed` schema type will handle storing this object correctly.
  const updatePayload = {
    $set: { ...updateData, lastModifiedAt: new Date() },
    $inc: { version: 1 },
  };

  const updatedContentDoc = await Content.findOneAndUpdate(
    { _id: contentId, createdBy: new mongoose.Types.ObjectId(userId) },
    updatePayload,
    { new: true } // Return the updated document
  )
    .populate<{ thumbnail: { path: string } }>("thumbnail", "path")
    .lean();

  if (!updatedContentDoc) {
    return NextResponse.json({ success: false, message: "Content not found or update failed." }, { status: 404 });
  }
  
  const transformedUpdatedContent = {
    ...updatedContentDoc,
    thumbnail: updatedContentDoc.thumbnail?.path || null,
    data: updatedContentDoc.data, // Return the object directly
  };

  return NextResponse.json({ success: true, data: transformedUpdatedContent });
}

// --- DELETE (Soft Delete) a Content item ---
export async function DELETE(
  request: NextRequest,
  { params }: ContentRouteParams
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const userId = session.user.id;
  const { contentId } = await params;

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    return NextResponse.json({ success: false, message: "Invalid Content ID" }, { status: 400 });
  }

  const result = await Content.updateOne(
    { _id: contentId, createdBy: new mongoose.Types.ObjectId(userId) },
    { $set: { isTrash: true, lastModifiedAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ success: false, message: "Content not found or permission denied." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Content moved to trash." });
}

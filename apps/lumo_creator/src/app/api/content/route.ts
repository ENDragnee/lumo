// @/app/api/content/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Content from "@/models/Content";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Collection from "@/models/Collection";

// --- GET all Content for the authenticated user (for Drive/List view) ---
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const userId = session.user.id;

  const { searchParams } = new URL(request.url);
  const parentId = searchParams.get("parentId");

  const query: any = {
    createdBy: new mongoose.Types.ObjectId(userId),
    isTrash: false,
  };

  if (parentId) {
    query.parentId = parentId === "null" ? null : new mongoose.Types.ObjectId(parentId);
  }

  const contents = await Content.find(query)
    .populate<{ thumbnail: { path: string } }>("thumbnail", "path")
    .select("-data") // Exclude the 'data' field
    .sort({ lastModifiedAt: -1 })
    .lean();

  const transformedContents = contents.map((content) => ({
    ...content,
    thumbnail: content.thumbnail?.path || "/default-thumbnail.png",
  }));

  return NextResponse.json({ success: true, data: transformedContents });
}

// --- POST (Create) a new Content item ---
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  await connectDB();
  const body = await request.json();
  const { title, thumbnail, contentType, parentId } = body;

  if (!title || !thumbnail || !contentType) {
    return NextResponse.json(
      { success: false, message: "Title, thumbnail, and contentType are required." },
      { status: 400 }
    );
  }

  // --- REFACTOR: More flexible creation ---
  // Use the spread operator on the body to allow passing other fields
  // like 'description', 'tags', etc., upon creation.
  const newContent = new Content({
    ...body, // Pass all valid fields from the request
    createdBy: new mongoose.Types.ObjectId(userId),
    parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
    // The default `data` from the model schema will be used here.
  });

  await newContent.save();

  if (parentId) {
    // The `$push` operator must be the top-level key.
    const updateParentCollection = Collection.findByIdAndUpdate(
      parentId,
      { 
        $push: { childContent: newContent._id } 
      },
      { new: true } // Optional: but good practice
    );

    // This will now execute without a CastError.
    await updateParentCollection;
  }

  // Re-fetch to populate the thumbnail for the response
  const populatedNewContent = await Content.findById(newContent._id)
    .populate<{ thumbnail: { path: string } }>("thumbnail", "path")
    .lean();

  if (!populatedNewContent) {
    return NextResponse.json(
      { success: false, message: "Failed to retrieve newly created content." },
      { status: 500 }
    );
  }

  const transformedNewContent = {
    ...populatedNewContent,
    thumbnail: populatedNewContent.thumbnail?.path || "/default-thumbnail.png",
  };

  return NextResponse.json({ success: true, data: transformedNewContent }, { status: 201 });
}

// @/app/api/collections/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Collection from "@/models/Collection";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

// --- GET all Collections for the authenticated user ---
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
    // Handle the root level (null) or a specific parent
    parentId: parentId === "null" || !parentId ? null : new mongoose.Types.ObjectId(parentId),
  };

  // Find all collections matching the query
  const collections = await Collection.find(query)
    .populate<{ thumbnail: { path: string } }>("thumbnail", "path")
    .sort({ updatedAt: -1 }) // You might want to sort by an explicit order field in the future
    .lean();

  // Map the results to include counts from the arrays, which is more efficient
  const collectionsWithDetails = collections.map((collection) => ({
    ...collection,
    thumbnail: collection.thumbnail?.path || null,
    // Get counts directly from the array lengths. No extra DB queries needed!
    contentCount: collection.childContent?.length || 0,
    collectionCount: collection.childCollections?.length || 0,
  }));

  return NextResponse.json({ success: true, data: collectionsWithDetails });
}

// --- POST (Create) a new Collection ---
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const userId = new mongoose.Types.ObjectId(session.user.id);
  
  const body = await request.json();
  const { title, description, parentId } = body;

  if (!title) {
    return NextResponse.json({ success: false, message: "Title is required." }, { status: 400 });
  }
  
  // Use a database session for a transaction to ensure atomicity
  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();

  try {
    // 1. Create the new collection
    const newCollection = new Collection({
      title,
      description,
      createdBy: userId,
      parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
    });
    await newCollection.save({ session: dbSession });

    // 2. If it has a parent, update the parent's childCollections array
    if (parentId) {
      await Collection.updateOne(
        { _id: new mongoose.Types.ObjectId(parentId), createdBy: userId },
        { $push: { childCollections: newCollection._id } },
        { session: dbSession }
      );
    }
    
    await dbSession.commitTransaction();

    const responseData = {
      ...newCollection.toObject(),
      thumbnail: null, // Manually add null thumbnail for frontend consistency
    };

    return NextResponse.json({ success: true, data: responseData }, { status: 201 });
  } catch (error) {
    await dbSession.abortTransaction();
    console.error("Failed to create collection:", error);
    return NextResponse.json({ success: false, message: "Failed to create collection." }, { status: 500 });
  } finally {
    dbSession.endSession();
  }
}

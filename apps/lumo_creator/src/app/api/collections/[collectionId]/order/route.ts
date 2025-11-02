import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Collection from "@/models/Collection";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{ collectionId: string }>;
}

// PUT handler to update the order of child content and collections
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const userId = new mongoose.Types.ObjectId(session.user.id);
  const { collectionId } = await params;

  if (!mongoose.Types.ObjectId.isValid(collectionId)) {
    return NextResponse.json({ success: false, message: "Invalid Collection ID" }, { status: 400 });
  }

  try {
    const { childContent, childCollections } = await request.json();

    // Basic validation
    if (!Array.isArray(childContent) || !Array.isArray(childCollections)) {
      return NextResponse.json({ success: false, message: "Invalid data format." }, { status: 400 });
    }

    // Find the collection and verify ownership before updating
    const updatedCollection = await Collection.findOneAndUpdate(
      { _id: collectionId, createdBy: userId },
      { 
        $set: { 
          childContent: childContent.map(id => new mongoose.Types.ObjectId(id)),
          childCollections: childCollections.map(id => new mongoose.Types.ObjectId(id)),
          updatedAt: new Date(),
        } 
      },
      { new: true }
    );

    if (!updatedCollection) {
      return NextResponse.json({ success: false, message: "Collection not found or update failed." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Order updated successfully." });
  } catch (error) {
    console.error("Error updating collection order:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

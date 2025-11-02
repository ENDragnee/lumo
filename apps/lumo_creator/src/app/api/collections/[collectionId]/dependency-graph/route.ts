//@/app/api/collections/[collectionId]/dependency-graph/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Collection from "@/models/Collection";
import Content from "@/models/Content";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{ collectionId: string }>;
}

// GET all items within a collection for the dependency graph view
export async function GET(request: NextRequest, { params }: RouteParams) {
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

  const parentCollection = await Collection.findOne({ _id: collectionId, createdBy: userId });
  if (!parentCollection) {
    return NextResponse.json({ success: false, message: "Collection not found or permission denied." }, { status: 404 });
  }
  
  // --- UPDATED: Fetch both child collections and content in parallel ---
  const [childCollections, childContent] = await Promise.all([
    Collection.find({ parentId: collectionId, createdBy: userId, isTrash: false })
      .select('_id title prerequisites thumbnail')
      .populate<{ thumbnail: { path: string } }>("thumbnail", "path")
      .lean(),
    Content.find({ parentId: collectionId, createdBy: userId, isTrash: false })
      .select('_id title prerequisites thumbnail')
      .populate<{ thumbnail: { path: string } }>("thumbnail", "path")
      .lean()
  ]);

  // Format and combine into a single array with a 'type' property
  const formattedCollections = childCollections.map(item => ({
    ...item,
    type: 'collection' as const,
    thumbnail: item.thumbnail?.path || null,
  }));
  
  const formattedContent = childContent.map(item => ({
    ...item,
    type: 'content' as const,
    thumbnail: item.thumbnail?.path || null,
  }));

  const allItems = [...formattedCollections, ...formattedContent];

  return NextResponse.json({ success: true, data: allItems });
}

// @/app/api/collections/[collectionId]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Collection, { ICollection } from "@/models/Collection"; // <-- Import ICollection type
import Content from "@/models/Content";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

type CollectionProp = {
  params: Promise<{ // Note: The params are not a Promise here
    collectionId: string;
  }>;
};

// --- UPDATED: GET a single Collection with its children AND ancestor path ---
export async function GET(request: NextRequest, { params }: CollectionProp) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const userId = new mongoose.Types.ObjectId(session.user.id);
  const { collectionId } = await params;

  if (!mongoose.Types.ObjectId.isValid(collectionId)) {
    return NextResponse.json({ success: false, message: "Invalid Collection ID." }, { status: 400 });
  }

  // Use an aggregation pipeline to efficiently fetch the collection and its entire ancestor path.
  const aggregationPipeline = [
    // Stage 1: Match the requested collection
    {
      $match: {
        _id: new mongoose.Types.ObjectId(collectionId),
        createdBy: userId,
        isTrash: false, // Ensure we don't fetch trashed items
      }
    },
    // Stage 2: Use $graphLookup to recursively find all ancestors
    {
      $graphLookup: {
        from: 'collections', // The collection to search in
        startWith: '$parentId', // Start the search from the parentId of the matched doc
        connectFromField: 'parentId', // Field in the current doc to follow
        connectToField: '_id', // Field in the 'from' collection to connect to
        as: 'path' // Name of the new array field containing the ancestors
      }
    }
  ];

  const results = await Collection.aggregate(aggregationPipeline);

  if (results.length === 0) {
    return NextResponse.json({ success: false, message: "Collection not found." }, { status: 404 });
  }

  // The aggregation result is a plain object; we still need to populate its children
  let collectionData = results[0];

  // Manually populate the children. This is cleaner than complex nested $lookups.
  await Collection.populate(collectionData, [
    { path: 'thumbnail', select: 'path' },
    {
      path: 'childContent',
      model: Content,
      match: { isTrash: false }, // Only populate non-trashed content
      populate: { path: 'thumbnail', select: 'path' }
    },
    {
      path: 'childCollections',
      model: Collection,
      match: { isTrash: false }, // Only populate non-trashed collections
      populate: { path: 'thumbnail', select: 'path' }
    }
  ]);
  
  // The 'path' from $graphLookup is an unordered array of all ancestors.
  // We need to manually order it from the immediate parent up to the root.
  const ancestors: ICollection[] = collectionData.path;
  const pathMap = new Map(ancestors.map(p => [p._id.toString(), p]));
  const orderedPath = [];
  let currentParentId = collectionData.parentId;

  while (currentParentId) {
    const parentDoc = pathMap.get(currentParentId.toString());
    if (parentDoc) {
      // We only need the ID and title for the breadcrumb
      orderedPath.push({
        _id: parentDoc._id,
        title: parentDoc.title,
      });
      currentParentId = parentDoc.parentId;
    } else {
      // This can happen if a parent is deleted or inaccessible; break the loop.
      break;
    }
  }

  // Replace the large, unordered path with our slim, ordered path.
  // The front-end expects this to be [parent, grandparent, ...], which it will reverse.
  collectionData.path = orderedPath;

  return NextResponse.json({ success: true, data: collectionData });
}


// --- PUT (Update) a Collection --- (NO CHANGES NEEDED)
export async function PUT(request: NextRequest, { params }: CollectionProp) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const userId = new mongoose.Types.ObjectId(session.user.id);
  const { collectionId } = await params;
  const body = await request.json();

  const { createdBy, isTrash, parentId, childCollections, childContent, ...updateData } = body;
  updateData.updatedAt = new Date();

  if (updateData.thumbnail && !mongoose.Types.ObjectId.isValid(updateData.thumbnail)) {
    delete updateData.thumbnail;
  }
  
  const updatedCollectionDoc = await Collection.findOneAndUpdate(
    { _id: collectionId, createdBy: userId },
    { $set: updateData },
    { new: true }
  )
    .populate<{ thumbnail: { path: string } }>("thumbnail", "path")
    .lean();

  if (!updatedCollectionDoc) {
    return NextResponse.json({ success: false, message: "Collection not found or update failed." }, { status: 404 });
  }

  const transformedCollection = {
    ...updatedCollectionDoc,
    thumbnail: updatedCollectionDoc.thumbnail?.path || null,
  };

  return NextResponse.json({ success: true, data: transformedCollection });
}

// --- DELETE (Soft Delete) a Collection and its contents --- (NO CHANGES NEEDED)
export async function DELETE(request: NextRequest, { params }: CollectionProp) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const userId = new mongoose.Types.ObjectId(session.user.id);
  const { collectionId } = await params;

  const dbSession = await mongoose.startSession();
  
  try {
    await dbSession.withTransaction(async () => {
      const collectionToDelete = await Collection.findOne(
        { _id: collectionId, createdBy: userId },
        { parentId: 1 }
      ).session(dbSession);

      if (!collectionToDelete) {
        throw new Error("Collection not found or you lack permission.");
      }

      if (collectionToDelete.parentId) {
        await Collection.updateOne(
          { _id: collectionToDelete.parentId, createdBy: userId },
          { $pull: { childCollections: collectionId } },
          { session: dbSession }
        );
      }

      await Collection.updateOne(
        { _id: collectionId, createdBy: userId },
        { $set: { isTrash: true, updatedAt: new Date() } },
        { session: dbSession }
      );
      
      await Content.updateMany(
        { parentId: collectionId, createdBy: userId },
        { $set: { isTrash: true, lastModifiedAt: new Date() } },
        { session: dbSession }
      );
      
      await Collection.updateMany(
        { parentId: collectionId, createdBy: userId },
        { $set: { isTrash: true, updatedAt: new Date() } },
        { session: dbSession }
      );
    });

    return NextResponse.json({ success: true, message: "Collection and its contents moved to trash." });
  } catch (error: any) {
    console.error("Transaction failed during collection deletion:", error);
    const message =
      error.message === "Collection not found or you lack permission."
        ? error.message
        : "Failed to delete collection due to a server error.";
    const status = error.message.includes("permission") ? 404 : 500;
    return NextResponse.json({ success: false, message }, { status });
  } finally {
    dbSession.endSession();
  }
}

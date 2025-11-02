// @/app/api/media/[mediaId]/route.ts
import { NextResponse, NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Standard path for NextAuth options
import Media from "@/models/Media";
import connectDB from "@/lib/mongodb"; // Helper to connect to the database

// Define the type for the dynamic route parameters, following the requested structure
type MediaRouteParams = {
  params: Promise<{
    mediaId: string;
  }>;
};

// --- GET a Single Media Item ---
export async function GET(
  request: NextRequest,
  { params }: MediaRouteParams
) {
  // Handle authentication directly
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const userId = session.user.id;
  const { mediaId } = await params;

  // Find the media item ensuring it belongs to the authenticated user
  const media = await Media.findOne({ _id: mediaId, uploadedBy: userId });

  if (!media) {
    return NextResponse.json(
      { success: false, message: "Media not found or you do not have permission to view it." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: media });
}

// --- PUT (Update) a Media Item ---
export async function PUT(
  request: NextRequest,
  { params }: MediaRouteParams
) {
  // Handle authentication directly
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const userId = session.user.id;
  const { mediaId } = await params;
  const body = await request.json();

  const { filename } = body;

  if (!filename) {
    return NextResponse.json(
      { success: false, message: "No updateable fields provided." },
      { status: 400 }
    );
  }

  const updatedMedia = await Media.findOneAndUpdate(
    { _id: mediaId, uploadedBy: userId },
    { $set: { filename: filename } },
    { new: true }
  );

  if (!updatedMedia) {
    return NextResponse.json(
      { success: false, message: "Update failed or media not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: updatedMedia });
}

// --- DELETE a Media Item ---
export async function DELETE(
  request: NextRequest,
  { params }: MediaRouteParams
) {
  // Handle authentication directly
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const userId = session.user.id;
  const { mediaId } = await params;

  try {
    const mediaItem = await Media.findOne({ _id: mediaId, uploadedBy: userId });

    if (!mediaItem) {
      return NextResponse.json(
        { success: false, message: "Media not found or you do not have permission to delete it." },
        { status: 404 }
      );
    }

    const publicDir = path.join(process.cwd(), "public");
    const filePath = path.join(publicDir, mediaItem.path);

    try {
      await fs.unlink(filePath);
    } catch (fileError: any) {
      console.warn(`Could not delete file ${filePath}: ${fileError.message}`);
    }

    await Media.deleteOne({ _id: mediaId });

    return NextResponse.json({ success: true, message: "Media deleted successfully." });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

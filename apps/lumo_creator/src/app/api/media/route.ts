import { NextResponse, NextRequest } from "next/server";
import fs, { mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Media from "@/models/Media";
import mongoose from "mongoose";

// 20 GB in bytes (20 * 1024 * 1024 * 1024)
const MAX_STORAGE_PER_USER = 21474836480; 

// --- GET All Media with Filtering, Searching, and Pagination ---
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || '';
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const query: { uploadedBy: mongoose.Types.ObjectId; $or?: any[] } = {
        uploadedBy: userId
    };

    if (searchQuery) {
        const regex = { $regex: searchQuery, $options: 'i' };
        query.$or = [
            { filename: regex },
            { tag: regex }
        ];
    }

    try {
        // --- UPDATED: Run three queries in parallel for full stats ---
        const [mediaItems, totalItems, storageAggregation] = await Promise.all([
            // Query for the paginated data
            Media.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            // Query for the total count of documents (for pagination)
            Media.countDocuments({ uploadedBy: userId }), // Total count for stats
            // --- NEW: Query for the total storage used by the user ---
            Media.aggregate([
                { $match: { uploadedBy: userId } },
                { $group: { _id: null, totalSize: { $sum: "$mediaSize" } } }
            ])
        ]);

        const totalPages = Math.ceil(totalItems / limit);
        const totalStorageUsed = storageAggregation[0]?.totalSize || 0;

        return NextResponse.json({ 
            success: true, 
            data: {
                media: mediaItems,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    limit,
                    totalStorageUsed, // <-- Send total storage to the client
                }
            } 
        });

    } catch (error) {
        console.error("Error fetching media:", error);
        return NextResponse.json({ success: false, message: "Server error while fetching media." }, { status: 500 });
    }
}

// --- POST (Upload) New Media with Storage Quota Enforcement ---
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const tag: string | null = data.get("tag") as string;

    if (!file) {
        return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    // --- NEW: STORAGE QUOTA ENFORCEMENT ---
    try {
        // Use a more efficient aggregation pipeline to sum the sizes
        const storageUsageResult = await Media.aggregate([
            { $match: { uploadedBy: userId } },
            { $group: { _id: null, totalSize: { $sum: "$mediaSize" } } }
        ]);

        const currentUsage = storageUsageResult.length > 0 ? storageUsageResult[0].totalSize : 0;
        const incomingFileSize = file.size;

        if (currentUsage + incomingFileSize > MAX_STORAGE_PER_USER) {
            return NextResponse.json({ 
                success: false, 
                message: "Storage quota exceeded. Cannot upload new file." 
            }, { status: 413 }); // 413 Payload Too Large is a fitting status code
        }

    } catch (error) {
        console.error("Error checking storage quota:", error);
        return NextResponse.json({ success: false, message: "Server error during storage quota check." }, { status: 500 });
    }
    // -------------------------------------

    const contentType = file.type;
    let mediaType: 'image' | 'video' | 'thumbnail';
    let fileExtension: string;
    
    // For now, only images are supported. You can extend this logic for video.
    if (contentType.startsWith("image/")) {
        mediaType = 'image';
        fileExtension = '.webp';
    } else {
        return NextResponse.json({ success: false, message: "Unsupported file type. Only images are allowed." }, { status: 415 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueId = new mongoose.Types.ObjectId();
    const filename = `${userId}_${uniqueId}${fileExtension}`;
    
    const targetDir = path.join(process.cwd(), "public", "LumoCreators", session.user.id, "images");
    await mkdir(targetDir, { recursive: true });
    const filepath = path.join(targetDir, filename);
    const publicUrl = `/LumoCreators/${session.user.id}/images/${filename}`;

    try {
        // Process the image with sharp
        const processedImageBuffer = await sharp(buffer)
            .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        // Write the processed buffer to the file
        await fs.writeFile(filepath, processedImageBuffer);

        // Get the size of the *final, processed* file for accurate storage calculation
        const finalMediaSize = processedImageBuffer.length;

        const newMedia = await Media.create({
            _id: uniqueId,
            uploadedBy: userId,
            mediaType,
            mediaSize: finalMediaSize, // <-- SAVE THE FILE SIZE
            filename,
            path: publicUrl,
            tag: tag || undefined,
        });

        return NextResponse.json({ success: true, data: newMedia }, { status: 201 });

    } catch (error) {
        console.error("Error processing or saving media:", error);
        return NextResponse.json({ success: false, message: "Server error while processing the file." }, { status: 500 });
    }
}

// app/api/trash/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from '@/lib/mongodb';
// --- REFACTOR: Import Collection model instead of Book ---
import Collection, { ICollection } from '@/models/Collection';
import Content, { IContent } from '@/models/Content';
import { IMedia } from '@/models/Media';
import mongoose, { Model } from 'mongoose';

// --- GET Trashed Items ---
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(session.user.id);

    await connectDB();

    try {
        const findQuery = { createdBy: userId, isTrash: true };
        const populateThumbnail = { path: 'thumbnail', select: 'path' };

        // --- REFACTOR: Fetch trashed collections instead of books ---
        const trashedCollectionsPromise = Collection.find(findQuery)
            .populate<{ thumbnail: IMedia | null }>(populateThumbnail)
            .select('_id title thumbnail updatedAt createdAt parentId')
            .sort({ updatedAt: -1 })
            .lean();

        const trashedContentPromise = Content.find(findQuery)
            .populate<{ thumbnail: IMedia | null }>(populateThumbnail)
            .select('_id title thumbnail lastModifiedAt createdAt parentId')
            .sort({ lastModifiedAt: -1 })
            .lean();

        const [trashedCollections, trashedContent] = await Promise.all([trashedCollectionsPromise, trashedContentPromise]);

        // Combine and map to a consistent format for the frontend
        const allTrashedItems = [
            // --- REFACTOR: Map collections and set type to 'collection' ---
            ...trashedCollections.map(item => ({
                _id: item._id.toString(),
                type: 'collection' as const,
                title: item.title,
                thumbnail: item.thumbnail ? item.thumbnail.path : null, // Use null for consistency
                updatedAt: item.updatedAt.toISOString(),
                createdAt: item.createdAt.toISOString(),
                parentId: item.parentId ? item.parentId.toString() : null,
            })),
            ...trashedContent.map(item => ({
                _id: item._id.toString(),
                type: 'content' as const,
                title: item.title,
                thumbnail: item.thumbnail ? item.thumbnail.path : null, // Use null for consistency
                createdAt: item.createdAt.toISOString(),
                updatedAt: (item.lastModifiedAt || item.createdAt).toISOString(),
                parentId: item.parentId ? item.parentId.toString() : null,
            }))
        ];

        // Sort combined list by the mapped 'updatedAt' field
        allTrashedItems.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        return NextResponse.json({ items: allTrashedItems }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching trash:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error fetching trash' }, { status: 500 });
    }
}

// --- PUT Restore Item ---
export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(session.user.id);

    await connectDB();

    try {
        const { id, type } = await req.json();

        // --- REFACTOR: Validate 'collection' type instead of 'book' ---
        if (!id || !type || !['collection', 'content'].includes(type)) {
            return NextResponse.json({ error: 'Missing or invalid parameters (id, type)' }, { status: 400 });
        }
        
        // --- REFACTOR: Use Collection model for 'collection' type ---
        const ModelToUse: Model<ICollection> | Model<IContent> = type === 'collection' ? Collection : Content;
        const objectId = new mongoose.Types.ObjectId(id);

        const itemToRestore = await (ModelToUse as Model<any>).findOne({
             _id: objectId,
             createdBy: userId,
             isTrash: true
        });

        if (!itemToRestore) {
            return NextResponse.json({ error: `${type} not found in trash or access denied` }, { status: 404 });
        }
        
        // --- REFACTOR: Correctly check for 'collection' type for update payload ---
        const updatePayload = type === 'collection' 
            ? { isTrash: false, updatedAt: new Date() } 
            : { isTrash: false, lastModifiedAt: new Date() };

        await (ModelToUse as Model<any>).updateOne(
            { _id: objectId, createdBy: userId },
            { $set: updatePayload }
        );

        console.log(`${type} ${id} restored from trash`);
        return NextResponse.json({ message: `${type} restored` }, { status: 200 });

    } catch (error: any) {
        console.error('Error restoring item from trash:', error);
        if (error instanceof mongoose.Error.CastError) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Internal Server Error restoring item' }, { status: 500 });
    }
}


// --- DELETE Permanently Delete Item ---
export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(session.user.id);

    await connectDB();

    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        const type = url.searchParams.get('type');
        
        // --- REFACTOR: Validate 'collection' type ---
        if (!id || !type || !['collection', 'content'].includes(type)) {
            return NextResponse.json({ error: 'Missing or invalid query parameters (id, type)' }, { status: 400 });
        }
        
        // --- REFACTOR: Use Collection model for 'collection' type ---
        const ModelToUse: Model<ICollection> | Model<IContent> = type === 'collection' ? Collection : Content;
        const objectId = new mongoose.Types.ObjectId(id);

        const itemToDelete = await (ModelToUse as Model<any>).findOne({
            _id: objectId,
            createdBy: userId,
            isTrash: true
        });

        if (!itemToDelete) {
            return NextResponse.json({ error: `${type} not found in trash or access denied` }, { status: 404 });
        }

        const deleteResult = await (ModelToUse as Model<any>).deleteOne({ _id: objectId, createdBy: userId });

        if (deleteResult.deletedCount === 0) {
            return NextResponse.json({ error: `Failed to permanently delete ${type}` }, { status: 500 });
        }
        
        // --- REFACTOR: Update recursive deletion logic for collections ---
        if (type === 'collection') {
            console.log(`Permanently deleting contents of collection ${id}`);
             const [deletedCollectionsResult, deletedContentResult] = await Promise.all([
                Collection.deleteMany({ parentId: objectId, createdBy: userId }),
                Content.deleteMany({ parentId: objectId, createdBy: userId })
             ]);
             console.log(`Permanently deleted ${deletedCollectionsResult.deletedCount} sub-collections and ${deletedContentResult.deletedCount} contents.`);
        }

        console.log(`${type} ${id} permanently deleted from trash`);
        return NextResponse.json({ message: `${type} permanently deleted` }, { status: 200 });

    } catch (error: any)
    {
        console.error('Error permanently deleting item from trash:', error);
        if (error instanceof mongoose.Error.CastError) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Internal Server Error deleting item' }, { status: 500 });
    }
}

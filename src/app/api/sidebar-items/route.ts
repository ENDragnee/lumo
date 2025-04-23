// app/api/sidebar-items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Adjust path
import connectDB from '@/lib/mongodb';       // Adjust path
import Book, { IBook } from '@/models/Book';       // Adjust path
import Content, { IContent } from '@/models/Content'; // Adjust path
import mongoose, { Model } from 'mongoose';

// Define the structure of items returned for the sidebar
export interface SidebarDriveItem {
    _id: string;
    title: string;
    type: 'book' | 'content';
    parentId: string | null;
    hasChildren?: boolean; // Optimization: Indicate if a book has children
}

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const { searchParams } = new URL(request.url);
    const parentIdParam = searchParams.get('parentId'); // Get parentId from query param

    let parentId: mongoose.Types.ObjectId | null = null;
    try {
        // Use null for root, or convert valid ID string to ObjectId
        parentId = parentIdParam === 'null' || !parentIdParam
            ? null
            : new mongoose.Types.ObjectId(parentIdParam);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid parent ID format.' }, { status: 400 });
    }

    try {
        await connectDB();

        // Base query conditions: owned by user, correct parent, not in trash
        const queryConditions = {
            createdBy: userId,
            parentId: parentId,
            isTrash: false,
        };

        // Fetch books matching the criteria
        const booksPromise = Book.find(queryConditions)
            .select('_id title parentId') // Select minimal fields
            .sort({ title: 1 })
            .lean()
            .exec();

        // Fetch content matching the criteria
        const contentsPromise = Content.find(queryConditions)
            .select('_id title parentId') // Select minimal fields
            .sort({ title: 1 })
            .lean()
            .exec();

        const [books, contents] = await Promise.all([booksPromise, contentsPromise]);

        // Optimization: Check if each fetched book has children
        const itemsWithChildrenCheck: SidebarDriveItem[] = await Promise.all(
            books.map(async (book) => {
                const bookId = book._id;
                // Check for sub-books
                const subBookCount = await Book.countDocuments({ parentId: bookId, createdBy: userId, isTrash: false });
                // Check for content within the book
                const contentCount = await Content.countDocuments({ parentId: bookId, createdBy: userId, isTrash: false });

                return {
                    _id: book._id.toString(),
                    title: book.title,
                    type: 'book' as const,
                    parentId: book.parentId ? book.parentId.toString() : null,
                    hasChildren: (subBookCount + contentCount) > 0, // Set flag
                };
            })
        );

        // Map content items
        const contentItems: SidebarDriveItem[] = contents.map(content => ({
            _id: content._id.toString(),
            title: content.title,
            type: 'content' as const,
            parentId: content.parentId ? content.parentId.toString() : null,
            // hasChildren is not applicable to content
        }));

        // Combine and return (books first, then content)
        const combinedItems = [...itemsWithChildrenCheck, ...contentItems];

        return NextResponse.json({ items: combinedItems });

    } catch (error: any) {
        console.error("API Sidebar Items GET Error:", error);
        if (error instanceof mongoose.Error.CastError) {
             return NextResponse.json({ error: 'Invalid ID format.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to fetch sidebar items', details: error.message }, { status: 500 });
    }
}
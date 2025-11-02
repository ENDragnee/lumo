// app/api/sidebar-items/route.ts (Create this file if it doesn't exist)
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Adjust path
import connectDB from '@/lib/mongodb'; // Adjust path
import Book, { IBook } from '@/models/Book'; // Adjust path
import Content, { IContent } from '@/models/Content'; // Adjust path
import mongoose from 'mongoose';

// Define the structure for items returned by this API
export interface SidebarDriveItem {
  _id: string; // String ID for frontend use
  title: string;
  type: 'book' | 'content';
  hasChildren?: boolean; // Only for books: indicates if sub-items exist
}

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    // Allow unauthenticated access for browsing public sections? Adjust as needed.
    // if (!session?.user?.id) {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const userId = new mongoose.Types.ObjectId(session.user.id);

    // --- Allow fetching without user for now, ADD AUTH LATER ---
     const userId = new mongoose.Types.ObjectId("667d589e31a9971f6956676c"); // Use a placeholder or remove user filtering for now
     // TODO: Reinstate proper user filtering based on session

    const { searchParams } = new URL(request.url);
    const parentIdParam = searchParams.get('parentId');

    let parentId: mongoose.Types.ObjectId | null = null;
    try {
        parentId = parentIdParam === 'null' || !parentIdParam ? null : new mongoose.Types.ObjectId(parentIdParam);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid parent ID format.' }, { status: 400 });
    }

    try {
        await connectDB();

        // Query conditions: owned by user (or remove filter), not in trash, matching parentId
        const queryConditions = {
            // createdBy: userId, // TODO: Uncomment when auth is ready
            parentId: parentId,
            isTrash: false,
        };

        // Fetch books and content concurrently
        const booksPromise = Book.find(queryConditions)
            .select('_id title') // Only need ID and title for sidebar list
            .sort({ title: 1 })
            .lean()
            .exec();

        const contentsPromise = Content.find(queryConditions)
            .select('_id title') // Only need ID and title
            .sort({ title: 1 })
            .lean()
            .exec();

        const [books, contents] = await Promise.all([booksPromise, contentsPromise]);

        // --- Check if each book has children ---
        const booksWithChildrenStatus = await Promise.all(
            books.map(async (book) => {
                const bookId = book._id;
                const childBookCount = await Book.countDocuments({ parentId: bookId, isTrash: false /*, createdBy: userId */ }); // TODO: Add user filter
                if (childBookCount > 0) {
                    return { ...book, hasChildren: true };
                }
                const childContentCount = await Content.countDocuments({ parentId: bookId, isTrash: false /*, createdBy: userId */ }); // TODO: Add user filter
                return { ...book, hasChildren: childContentCount > 0 };
            })
        );
        // --- End check ---

        // Format results into SidebarDriveItem structure
        const items: SidebarDriveItem[] = [
            ...booksWithChildrenStatus.map(book => ({
                _id: book._id.toString(),
                title: book.title,
                type: 'book' as const,
                hasChildren: book.hasChildren, // Include the flag
            })),
            ...contents.map(content => ({
                _id: content._id.toString(),
                title: content.title,
                type: 'content' as const,
                 // hasChildren is not applicable to content
            }))
        ];

        return NextResponse.json({ items });

    } catch (error: any) {
        console.error("API Sidebar Items GET Error:", error);
        if (error instanceof mongoose.Error.CastError) {
             return NextResponse.json({ error: 'Invalid ID format provided.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to fetch sidebar items', details: error.message }, { status: 500 });
    }
}
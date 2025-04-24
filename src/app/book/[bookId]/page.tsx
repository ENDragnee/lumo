// app/book/[bookId]/page.tsx (or appropriate path based on your routing)
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Use next/navigation hooks
import { ArrowLeft, Folder, FileText, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/cards/BookCard'; // Reuse BookCard for sub-books
// import { ContentCard } from '@/components/cards/ContentCard'; // Create or adapt a ContentCard if needed
import { Card } from '@/components/ui/card'; // Use base card for content items for now
import Image from 'next/image';
import { motion } from 'framer-motion';

// Interfaces (align with API response)
interface BookDetails { // Specific details for the current book
    _id: string;
    title: string;
    description?: string;
    thumbnail?: string; // Banner image?
    // Add other book fields if needed
}

interface DriveItem { // Items within the book
    _id: string;
    type: "book" | "content";
    title: string;
    thumbnail: string; // Thumbnail for card
    description?: string; // For sub-books potentially
    // Add other fields relevant for display
}

// --- Loading Skeleton for Book Page ---
const BookPageSkeleton = () => (
    <div className="p-4 md:p-8 animate-pulse">
        {/* Skeleton for Header */}
        <div className="mb-8">
             <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div> {/* Back button */}
             <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3"></div> {/* Title */}
             <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div> {/* Description Line 1 */}
             <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>      {/* Description Line 2 */}
        </div>
         {/* Skeleton for Items Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={`item-skel-${index}`} className="rounded-lg overflow-hidden">
                   <div className="aspect-[16/10] bg-gray-300 dark:bg-gray-700 mb-3"></div>
                   <div className="px-1 space-y-2">
                       <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                       <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                   </div>
                </div>
            ))}
        </div>
    </div>
);


// --- Book Page Component ---
export default function BookPage() {
    const router = useRouter();
    const params = useParams(); // Get dynamic route parameters
    const bookId = params?.bookId as string; // Extract bookId

    const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
    const [items, setItems] = useState<DriveItem[]>([]); // Sub-books and content
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBookData = useCallback(async () => {
        if (!bookId) {
            setError("Book ID is missing.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            // Fetch book details (could be a separate endpoint or part of drive API if needed)
            // For now, we'll primarily fetch contents using the drive API
             const res = await fetch(`/api/drive?parentId=${bookId}&typeFilter=all`); // Fetch both types
             if (!res.ok) {
                 const errorData = await res.json();
                 // Try to get book title from breadcrumbs if items fail
                 const bookTitle = errorData.breadcrumbs?.slice(-1)[0]?.title || `Book ${bookId}`;
                 setBookDetails({ _id: bookId, title: bookTitle }); // Set title even on error
                 throw new Error(errorData.error || "Failed to fetch book contents");
             }
             const data = await res.json();

             // Extract book title from breadcrumbs (last element before 'Home')
             // API should return breadcrumbs including the current book
             let currentBookTitle = `Book ${bookId}`; // Default
             if (data.breadcrumbs && data.breadcrumbs.length > 1) {
                  // The last element is the current book if the API includes it
                  currentBookTitle = data.breadcrumbs[data.breadcrumbs.length - 1].title;
             }

             // Set Book Details (minimal for now, enhance if needed)
             setBookDetails({
                _id: bookId,
                title: currentBookTitle,
                // description: data.book?.description, // Fetch description separately if needed
                // thumbnail: data.book?.thumbnail, // Fetch thumbnail separately if needed
             });

             // Set Items (sub-books and content)
             setItems(data.items || []);

        } catch (err: any) {
            console.error("Error fetching book data:", err);
            setError(err.message || "An unknown error occurred.");
             // Attempt to set a title even if fetching contents fails, if possible
             if (!bookDetails) setBookDetails({ _id: bookId, title: `Book ${bookId}` });
        } finally {
            setIsLoading(false);
        }
    }, [bookId]); // Depend on bookId

    useEffect(() => {
        fetchBookData();
    }, [fetchBookData, bookId]); // Rerun fetch when bookId changes


    const handleItemClick = (item: DriveItem) => {
        if (item.type === 'book') {
            // Navigate to the sub-book's page
            router.push(`/book/${item._id}`);
        } else {
            // Navigate to the content viewer/editor
            router.push(`/create?contentId=${item._id}`); // Adjust as needed
        }
    };

    if (isLoading) return <BookPageSkeleton />;
    // if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    // if (!bookDetails) return <div className="p-8 text-center text-gray-500">Book not found.</div>; // Should be covered by error state

    return (
        <div className="flex flex-col flex-auto p-4 md:p-8 pb-16 overflow-y-auto dark:bg-gradient-to-b dark:from-slate-900 dark:to-gray-900 bg-gradient-to-b from-white to-gray-100">

            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4 self-start text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-800"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>

            {/* Book Header */}
             <div className="mb-8 md:mb-10 px-2 md:px-0">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 dark:text-gray-100 break-words" // Allow long titles to wrap
                >
                    {bookDetails?.title || "Loading Book..."}
                </motion.h1>
                {bookDetails?.description && (
                     <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="text-md text-gray-600 dark:text-gray-400 max-w-3xl"
                    >
                        {bookDetails.description}
                    </motion.p>
                )}
                {error && !isLoading && ( // Display error prominently if loading finished
                     <p className="mt-4 text-red-500 dark:text-red-400 flex items-center gap-2">
                         <Info className="h-5 w-5" /> Could not load all book contents: {error}
                     </p>
                 )}
            </div>

            {/* Items Grid */}
            {items.length > 0 ? (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.07 } }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                >
                    {items.map((item, index) => {
                        // Individual item animation variant
                        const itemVariants = {
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                        };

                        if (item.type === 'book') {
                            // Render BookCard for sub-books
                            return (
                                <motion.div key={item._id} variants={itemVariants}>
                                    <BookCard
                                        book={{ ...item, thumbnail: item.thumbnail || '/icons/folder-thumbnail.svg' }} // Ensure thumbnail fallback
                                        onClick={() => handleItemClick(item)}
                                        // index={index} // Use variants instead of direct index delay
                                    />
                                </motion.div>
                            );
                        } else {
                            // Render Content Card (using basic Card for now, adapt/create ContentCard if needed)
                            const MotionCard = motion(Card);
                            return (
                                <MotionCard
                                    key={item._id}
                                    variants={itemVariants}
                                    whileHover={{ y: -4, boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.1)" }}
                                    className="cursor-pointer overflow-hidden group relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg flex flex-col h-full shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600"
                                    onClick={() => handleItemClick(item)}
                                >
                                    <div className="relative aspect-[16/10] bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden rounded-t-lg">
                                         <Image
                                            src={item.thumbnail.startsWith('http') ? item.thumbnail : `${process.env.NEXT_PUBLIC_CREATOR_URL || ''}${item.thumbnail}`}
                                            alt={`${item.title} thumbnail`}
                                            fill
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            // Fix: Add onError handler with loop prevention
                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.svg'; }}
                                          />
                                           <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h4 className="font-semibold text-sm md:text-base line-clamp-2 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 dark:text-gray-100">
                                            {item.title}
                                        </h4>
                                         <div className="mt-auto pt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                             <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                             Content
                                         </div>
                                    </div>
                                </MotionCard>
                            );
                        }
                    })}
                </motion.div>
            ) : (
                // Show message only if not loading and no error related to fetching
                !isLoading && (!error || items.length === 0) && (
                     <div className="text-center py-16 text-gray-500 dark:text-gray-400 border border-dashed dark:border-gray-700 border-gray-300 rounded-lg">
                        <Folder className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                        This book is empty.
                    </div>
                )
            )}
        </div>
    );
}
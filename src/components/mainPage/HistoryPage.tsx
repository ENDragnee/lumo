// app/history/page.tsx (or relevant path)
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HistoryItem } from '@/types/history'; // Adjust path if needed
import { format, isToday, isYesterday } from 'date-fns';
import { useRouter } from "next/navigation"; // Corrected import


// --- Skeleton Component ---
const HistoryItemSkeleton = () => (
    <li className="flex items-center space-x-4 p-3">
        <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        <div className="flex-grow min-w-0 space-y-2">
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
    </li>
);

// --- Helper Functions (Keep as before) ---
const formatHistoryTime = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Invalid Date"; // Handle potential invalid date strings
        }
        if (isToday(date)) {
            return format(date, 'p'); // e.g., 2:05 PM
        }
        if (isYesterday(date)) {
            return 'Yesterday ' + format(date, 'p'); // e.g., Yesterday 4:15 PM
        }
        return format(date, 'MMM d, yyyy'); // e.g., Oct 28, 2023
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return "Date Error";
    }
};

const groupHistoriesByDate = (histories: HistoryItem[]) => {
    // ... (grouping logic remains the same as previous version)
    const groups: { [key: string]: HistoryItem[] } = {
        Today: [],
        Yesterday: [],
        'Last 7 Days': [],
        'Last 30 Days': [],
        Older: [],
    };

    const now = new Date();
    const startOfToday = new Date(new Date(now).setHours(0, 0, 0, 0)); // Ensure clean date object
    const startOfYesterday = new Date(new Date(startOfToday).setDate(startOfToday.getDate() - 1));
    const startOfLast7Days = new Date(new Date(startOfToday).setDate(startOfToday.getDate() - 7));
    const startOfLast30Days = new Date(new Date(startOfToday).setDate(startOfToday.getDate() - 30));


    histories.forEach((item) => {
        // Add safety check for viewed_at
        if (!item?.viewed_at) return;
        try {
            const viewedAt = new Date(item.viewed_at);
             if (isNaN(viewedAt.getTime())) return; // Skip if date is invalid

            if (viewedAt >= startOfToday) {
                groups.Today.push(item);
            } else if (viewedAt >= startOfYesterday) {
                groups.Yesterday.push(item);
            } else if (viewedAt >= startOfLast7Days) {
                groups['Last 7 Days'].push(item);
            } else if (viewedAt >= startOfLast30Days) {
                groups['Last 30 Days'].push(item);
            } else {
                groups.Older.push(item);
            }
        } catch (e) {
            console.error("Error processing history item for grouping:", item, e);
        }
    });

    return Object.entries(groups)
        .filter(([key, value]) => value.length > 0)
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {} as { [key: string]: HistoryItem[] });
};


export default function HistoryPage() {
    const [allHistories, setAllHistories] = useState<HistoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch all histories on mount
    useEffect(() => {
        const fetchHistories = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch ALL history - API now supports limit=0 for all,
                // or omit limit for default. Fetching all for client-side search.
                const response = await fetch("/api/history?limit=0"); // Fetch all for client-side search
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({})); // Try to get error details
                    throw new Error(`Failed to fetch history: ${response.status} ${response.statusText} - ${errorData.error || ''}`);
                }
                const data: HistoryItem[] = await response.json();

                // Optional: Client-side sort just in case API doesn't guarantee it
                data.sort((a, b) => {
                    // Handle potential null dates during sort
                    const dateA = a.viewed_at ? new Date(a.viewed_at).getTime() : 0;
                    const dateB = b.viewed_at ? new Date(b.viewed_at).getTime() : 0;
                    return dateB - dateA;
                 });

                setAllHistories(data);

            } catch (err) {
                console.error("Failed to fetch histories:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred while fetching history.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistories();
    }, []); // Runs once on mount

    // Filter histories based on search term
    const filteredHistories = useMemo(() => {
        if (!searchTerm) {
            return allHistories;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return allHistories.filter(item =>
            item.content_id?.title?.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.content_id?.subtitle?.toLowerCase().includes(lowerCaseSearchTerm)
            // Add more fields to search if needed
        );
    }, [allHistories, searchTerm]);

    // Group the filtered histories
    const groupedHistories = useMemo(() => {
        return groupHistoriesByDate(filteredHistories);
    }, [filteredHistories]);

    return (
        <div className="p-4 md:p-8 text-gray-800 dark:text-gray-200 w-full max-w-4xl mx-auto"> {/* Added max-width and centering */}
            <h1 className="text-2xl font-semibold mb-4">Activity History</h1>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="search"
                    placeholder="Search history by title or source..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
            </div>

            {/* Loading State */}
            {isLoading && (
                 <ul className="space-y-4">
                    {/* Show several skeleton items */}
                    {Array.from({ length: 5 }).map((_, index) => (
                       <HistoryItemSkeleton key={index} />
                    ))}
                </ul>
            )}

            {/* Error State */}
            {!isLoading && error && (
                 <div className="text-center text-red-500 dark:text-red-400 p-4 border border-red-500/50 rounded-md bg-red-50 dark:bg-red-900/20">
                    <p>Could not load history:</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

             {/* Empty State (after loading and potential filtering) */}
             {!isLoading && !error && filteredHistories.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                    {searchTerm ? (
                        <p>No history items match your search "{searchTerm}".</p>
                    ) : (
                        <>
                            <p>No activity history found.</p>
                            <p className="text-sm">Start exploring some content!</p>
                        </>
                    )}
                </div>
            )}


            {/* History List */}
            {!isLoading && !error && filteredHistories.length > 0 && (
                 <div className="space-y-8">
                    {Object.entries(groupedHistories).map(([groupName, items]) => (
                        <section key={groupName}>
                            <h2 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                {groupName}
                            </h2>
                            <ul className="space-y-4">
                                {items.map((item) => {
                                    // *** ERROR FIX: Check if content_id exists ***
                                    if (!item.content_id) {
                                        // Render a placeholder for items with missing content data
                                        return (
                                            <li key={item._id} className="flex items-center space-x-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg opacity-70">
                                                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gray-300 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">?</div>
                                                <div className="flex-grow min-w-0">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                                                        {formatHistoryTime(item.viewed_at)}
                                                    </span>
                                                    <p className="text-sm font-semibold text-red-600 dark:text-red-300 italic">Content data unavailable</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">History ID: {item._id}</p>
                                                </div>
                                            </li>
                                        );
                                    }

                                    // Render normally if content_id exists
                                    return (
                                        <li key={item._id} className="flex items-center space-x-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-150 ease-in-out">
                                            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 relative bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                                                {item.content_id.imageUrl ? (
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_CREATOR_URL}${item.content_id.imageUrl}`}
                                                        alt={`Image for ${item.content_id.title}`}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                        sizes="(max-width: 768px) 64px, 80px"
                                                        onError={(e) => { e.currentTarget.style.display = 'none'; /* Hide image on error */ }} // Optional: Hide broken images
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={() => router.push(`/content?id=${item.content_id._id}`)}
                                                className={`group block ${!item.content_id._id ? 'pointer-events-none' : ''}`} // Disable link if ID missing
                                                aria-disabled={!item.content_id._id}>
                                                <div className="flex-grow min-w-0">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                                                        {formatHistoryTime(item.viewed_at)}
                                                    </span>
                                                    {/* Ensure content_id._id exists before creating link */}
                                                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                            {item.content_id.title || 'Untitled Content'}
                                                        </h3>
                                                        {item.content_id.subtitle && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                                {item.content_id.subtitle}
                                                            </p>
                                                        )}
                                                </div>
                                            </button>
                                            {item.starred_status && (
                                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                 </svg>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}
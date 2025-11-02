// /Component/mainPage/HistoryPage.tsx (or relevant path)
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import { format, isToday, isYesterday } from 'date-fns';
import { useRouter } from "next/navigation";
import { getHistory } from '@/app/actions/history';
import type { HistoryItem as ActionHistoryItem } from '@/app/actions/history';

// --- Custom Hook for Debouncing (Unchanged) ---
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

// --- Skeleton Component (Unchanged) ---
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

// --- Helper Functions (Unchanged) ---
const formatHistoryTime = (dateInput: Date | string): string => {
    try {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return "Invalid Date";
        if (isToday(date)) return format(date, 'p');
        if (isYesterday(date)) return 'Yesterday ' + format(date, 'p');
        return format(date, 'MMM d, yyyy');
    } catch (e) {
        console.error("Error formatting date:", dateInput, e);
        return "Date Error";
    }
};

const groupHistoriesByDate = (histories: ActionHistoryItem[]) => {
    const groups: { [key: string]: ActionHistoryItem[] } = {
        Today: [], Yesterday: [], 'Last 7 Days': [], 'Last 30 Days': [], Older: [],
    };
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfYesterday = new Date(new Date().setDate(startOfToday.getDate() - 1));
    const startOfLast7Days = new Date(new Date().setDate(startOfToday.getDate() - 7));
    const startOfLast30Days = new Date(new Date().setDate(startOfToday.getDate() - 30));

    histories.forEach((item) => {
        if (!item?.latestInteractionTime) return;
        try {
            const viewedAt = new Date(item.latestInteractionTime);
            if (isNaN(viewedAt.getTime())) return;
            if (viewedAt >= startOfToday) groups.Today.push(item);
            else if (viewedAt >= startOfYesterday) groups.Yesterday.push(item);
            else if (viewedAt >= startOfLast7Days) groups['Last 7 Days'].push(item);
            else if (viewedAt >= startOfLast30Days) groups['Last 30 Days'].push(item);
            else groups.Older.push(item);
        } catch (e) {
            console.error("Error processing history item for grouping:", item, e);
        }
    });

    return Object.fromEntries(Object.entries(groups).filter(([, value]) => value.length > 0));
};

// --- Main Component ---
export default function HistoryPage() {
    const [histories, setHistories] = useState<ActionHistoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // FIX 1: Initialize isLoading to false.
    // The component will now attempt the initial fetch instead of getting stuck.
    // The `showInitialLoading` logic correctly handles showing skeletons when the fetch begins.
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const PAGE_SIZE = 20;

    const observer = useRef<IntersectionObserver>();
    const lastItemRef = useCallback((node: HTMLLIElement | null) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setOffset(prevOffset => prevOffset + PAGE_SIZE);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    useEffect(() => {
        setHistories([]);
        setOffset(0);
        setHasMore(true);
    }, [debouncedSearchTerm]);

    // Main data fetching effect
    useEffect(() => {
        // This guard is now only for preventing fetches when we know there's no more data.
        if (!hasMore) return;

        const fetchItems = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const newItems = await getHistory({
                    limit: PAGE_SIZE,
                    offset: offset,
                    searchTerm: debouncedSearchTerm
                });

                setHistories(prev => [...prev, ...newItems]);
                setHasMore(newItems.length === PAGE_SIZE);

            } catch (err) {
                console.error("Failed to fetch histories:", err);
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
                setError(errorMessage);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    // FIX 2: Remove `hasMore` from the dependency array.
    // The effect should only re-run when the API call's inputs (`offset`, `debouncedSearchTerm`) change.
    // This breaks the infinite loop.
    }, [offset, debouncedSearchTerm]);

    const groupedHistories = useMemo(() => groupHistoriesByDate(histories), [histories]);
    
    // This logic now works correctly because isLoading starts as `false`, then becomes `true`
    // during the first fetch, triggering the skeletons at the right time.
    const showInitialLoading = isLoading && histories.length === 0;
    const showEmptyState = !isLoading && !error && histories.length === 0;

    return (
        <div className="p-4 md:p-8 text-gray-800 dark:text-gray-200 w-full max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Activity History</h1>

            <div className="mb-6">
                <input
                    type="search"
                    placeholder="Search history by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
            </div>

            {showInitialLoading && (
                <ul className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => <HistoryItemSkeleton key={index} />)}
                </ul>
            )}

            {error && (
                <div className="text-center text-red-500 dark:text-red-400 p-4 border border-red-500/50 rounded-md bg-red-50 dark:bg-red-900/20">
                    <p>Could not load history:</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {showEmptyState && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                    {debouncedSearchTerm ? (
                        <p>No history items match your search "{debouncedSearchTerm}".</p>
                    ) : (
                        <>
                            <p>No activity history found.</p>
                            <p className="text-sm">Start exploring some content!</p>
                        </>
                    )}
                </div>
            )}

            {!showInitialLoading && !error && histories.length > 0 && (
                <div className="space-y-8">
                    {Object.entries(groupedHistories).map(([groupName, items]) => (
                        <section key={groupName}>
                            <h2 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                {groupName}
                            </h2>
                            <ul className="space-y-4">
                                {items.map((item, index) => (
                                    <li
                                        // The last item in the *overall* list is the trigger
                                        key={item._id}
                                        ref={index === items.length - 1 && histories[histories.length - 1]._id === item._id ? lastItemRef : null}
                                        className="flex items-center space-x-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-150 ease-in-out"
                                    >
                                        <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 relative bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                                            {item.thumbnail ? (
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_CREATOR_URL}${item.thumbnail}`}
                                                    alt={`Image for ${item.title}`}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    sizes="(max-width: 768px) 64px, 80px"
                                                />
                                            ) : ( /* Placeholder SVG */ "..." )}
                                        </div>
                                        <button onClick={() => router.push(`/content/${item._id}`)} className="group block flex-grow min-w-0 text-left">
                                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                                                {formatHistoryTime(item.latestInteractionTime)}
                                            </span>
                                            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {item.title || 'Untitled Content'}
                                            </h3>
                                            {item.progress > 0 && (
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-2">
                                                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
                                                </div>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                    {isLoading && <HistoryItemSkeleton />}
                </div>
            )}
        </div>
    );
}

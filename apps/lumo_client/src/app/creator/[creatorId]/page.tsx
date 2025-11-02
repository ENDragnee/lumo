// @/creator/[creatorId]/page.tsx
"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams } from 'next/navigation';
import { Types } from 'mongoose';

// Component Imports
import NewHeader from "@/components/channel/Header";
import HeroContent from "@/components/channel/HeroContent";
import ContentGrid from "@/components/channel/ContentGrid";
import AboutCard from "@/components/channel/AboutCard";
import Footer from "@/components/channel/Footer";

// NEW: Import the Server Action
import { getPerformanceForContent } from "@/app/actions/fetch-performace";

// --- Type Definitions for this Page ---

// Describes the creator's public profile
interface UserProfile {
  _id: string | Types.ObjectId;
  name: string;
  profileImage?: string;
  tagline?: string;
  bio?: string;
  credentials?: string[];
  socialLinks?: { type: string; url: string }[];
}

// *** FIXED ***
// Describes public content/book data from the API.
// `createdBy` is now correctly typed as a string to match the API response.
interface PublicContent {
  _id: string | Types.ObjectId;
  title: string;
  thumbnail?: string;
  views?: number;
  tags?: string[];
  description?: string;
  createdBy: string; // The API sends the creator's ID as a string here
}

// Describes the personalized performance data for a user
interface PerformanceData {
    understandingLevel: 'needs-work' | 'foundational' | 'good' | 'mastered';
    lastAccessedAt: string | Date;
}

// The final, merged data structure passed to the ContentGrid component.
// `createdBy` is an object, as expected by the ContentCard component.
interface MergedContentItem {
    _id: string;
    title: string;
    thumbnail: string;
    tags?: string[];
    performance?: PerformanceData;
    createdBy: { _id: string; name: string };
    lastAccessedAt?: string | Date;
}

// Describes the creator's channel statistics
interface Stats {
    rating: number;
    ratingCount: number;
    subscriberCount: number;
    totalViews: number;
}

// Describes the structure of the initial public API response
interface ApiCreatorResponse {
    creator: UserProfile;
    content: PublicContent[];
    books: PublicContent[];
    stats: Stats;
}

type TabName = 'Home' | 'Contents' | 'Books' | 'Workspaces';

// --- Main Page Component ---
export default function CreatorPage() {
    const { data: session, status: sessionStatus } = useSession();
    const params = useParams();
    const creatorId = params.creatorId as string;

    // --- State Management ---
    const [creator, setCreator] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [checkingSubscription, setCheckingSubscription] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabName>('Home');
    const [mergedContent, setMergedContent] = useState<MergedContentItem[]>([]);
    const [mergedBooks, setMergedBooks] = useState<MergedContentItem[]>([]);

    // --- Data Fetching Logic ---
    useEffect(() => {
        if (!creatorId) {
            setError("Creator ID not found.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // 1. Fetch public creator and content data
                const publicRes = await fetch(`/api/creator/${creatorId}`);
                if (!publicRes.ok) {
                    throw new Error((await publicRes.json()).message || "Failed to load creator data");
                }
                
                const publicData: ApiCreatorResponse = await publicRes.json();
                setCreator(publicData.creator);
                setStats(publicData.stats);

                const allItems = [...(publicData.content || []), ...(publicData.books || [])];
                const itemIds = allItems.map(item => item._id.toString());
                let performanceMap: { [key: string]: PerformanceData } = {};

                // 2. If logged in, call the Server Action for performance data
                if (sessionStatus === 'authenticated' && itemIds.length > 0) {
                    const result = await getPerformanceForContent(itemIds);
                    if (result.success) {
                        performanceMap = result.performances;
                    } else {
                        console.warn("Could not fetch user performance data:", result.error);
                    }
                }

                // 3. Merge public data with private performance data
                // *** THIS IS THE CORRECTED LOGIC ***
                const mergeData = (items: PublicContent[]): MergedContentItem[] => {
                    return items.map(item => {
                        const performance = performanceMap[item._id.toString()];
                        return {
                            _id: item._id.toString(),
                            title: item.title,
                            thumbnail: item.thumbnail || '/placeholder.svg',
                            tags: item.tags,
                            // FIX: We construct the 'createdBy' object here using the creator's
                            // profile data fetched in the same API call.
                            createdBy: {
                                _id: publicData.creator._id.toString(),
                                name: publicData.creator.name
                            },
                            performance: performance,
                            lastAccessedAt: performance?.lastAccessedAt,
                        };
                    });
                };

                setMergedContent(mergeData(publicData.content || []));
                setMergedBooks(mergeData(publicData.books || []));

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [creatorId, sessionStatus]); // Re-fetch if user logs in/out

    // --- Subscription Status ---
    useEffect(() => {
        if (!creator?._id || sessionStatus !== 'authenticated' || !session?.user?.id) {
            setCheckingSubscription(false);
            setIsSubscribed(false);
            return;
        }
        if (session.user.id === creator._id.toString()) {
             setCheckingSubscription(false);
             setIsSubscribed(false);
             return;
        }
        const fetchSubscriptionStatus = async () => {
            setCheckingSubscription(true);
            try {
                const res = await fetch(`/api/subscriptions/status/${creator._id}`);
                if (!res.ok) throw new Error("Failed to check subscription status");
                const data = await res.json();
                if (data.success) {
                     setIsSubscribed(data.isSubscribed);
                     setStats((prev: Stats | null) => prev ? { ...prev, subscriberCount: data.subscriberCount ?? prev.subscriberCount } : null);
                }
            } catch (err) {
                console.error("Error fetching subscription status:", err);
            } finally {
                setCheckingSubscription(false);
            }
        };
        fetchSubscriptionStatus();
    }, [creator, sessionStatus, session?.user?.id]);

    // --- Subscription Action Handler ---
    const handleSubscriptionChange = useCallback(async (subscribe: boolean) => {
        if (!creator?._id || sessionStatus !== 'authenticated' || !session.user?.id) {
            throw new Error("Authentication required or creator data missing.");
        }
        if (session.user.id === creator._id.toString()) {
            throw new Error("You cannot subscribe to yourself.");
        }

        const previousSubscribedState = isSubscribed;
        setIsSubscribed(subscribe);
        setStats((prev) => {
            if (!prev) return null;
            const change = subscribe ? 1 : -1;
            return { ...prev, subscriberCount: Math.max(0, prev.subscriberCount + change) };
        });

        try {
            const response = await fetch(`/api/subscriptions/subscribe/${creator._id}`, {
                 method: 'PUT',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ subscribe }),
            });
            if (!response.ok) {
                throw new Error((await response.json()).message || 'Subscription update failed');
            }
        } catch (error) {
            console.error("Failed to update subscription:", error);
            // Revert on failure
            setIsSubscribed(previousSubscribedState);
            setStats((prev) => {
                if (!prev) return null;
                const change = subscribe ? -1 : 1;
                return { ...prev, subscriberCount: Math.max(0, prev.subscriberCount + change) };
            });
            throw error;
        }
    }, [creator, isSubscribed, sessionStatus, session?.user?.id]);

    // --- Render Logic ---
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-[#F5F7FA]"><p className="text-xl">Loading Creator...</p></div>;
    }
    if (error) {
        return <div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-red-500"><p className="text-xl text-center p-4">{error}</p></div>;
    }
    if (!creator) {
        return <div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-[#F5F7FA]"><p>Creator not found.</p></div>;
    }

    const creatorForHeader = { id: creator._id.toString(), avatarUrl: creator.profileImage || '/default-avatar.png', name: creator.name, tagline: creator.tagline };
    const creatorForAboutCard = { name: creator.name, bio: creator.bio, credentials: creator.credentials, socialLinks: creator.socialLinks };
    const statsForAboutCard = stats ? { ...stats, contentCount: mergedContent.length + mergedBooks.length } : null;
    const heroContentItems = mergedContent.slice(0, 5).map(item => ({ id: item._id, title: item.title, thumbnail: item.thumbnail, description: '' }));

    return (
      <Suspense fallback={<div className="min-h-screen dark:bg-[#1E1E24]">Loading...</div>}>
        <main className="min-h-screen bg-white dark:bg-[#1E1E24] text-black dark:text-[#F5F7FA] font-sans">
            <NewHeader
                creator={creatorForHeader}
                stats={stats}
                creatorId={creator._id.toString()}
                initialIsSubscribed={isSubscribed}
                isCheckingSubscription={checkingSubscription}
                onSubscriptionChange={handleSubscriptionChange}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <div className="container mx-auto px-4 py-8 space-y-12">
                {activeTab === 'Home' && (
                    <>
                        {heroContentItems.length > 0 && <HeroContent popularVideos={heroContentItems} />}
                        
                        {mergedContent.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold mb-4">Latest Content</h2>
                                <ContentGrid content={mergedContent} />
                            </div>
                        )}

                        <AboutCard creator={creatorForAboutCard} stats={statsForAboutCard} />
                    </>
                )}

                {activeTab === 'Contents' && (
                    <>
                        <h2 className="text-2xl font-bold mb-4">All Content</h2>
                        <ContentGrid content={mergedContent} />
                    </>
                )}

                {activeTab === 'Books' && (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Books</h2>
                        <ContentGrid content={mergedBooks} />
                    </>
                )}

                {activeTab === 'Workspaces' && (
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-bold mb-4">Workspaces</h2>
                        <p className="text-gray-400">Workspaces feature coming soon!</p>
                    </div>
                )}
            </div>

            <Footer name={creator.name} />
        </main>
      </Suspense>
    );
}

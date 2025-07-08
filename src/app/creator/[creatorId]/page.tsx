// @/creator/[creatorId]/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useParams } from 'next/navigation';
import { Types } from 'mongoose';

// Component Imports
import NewHeader from "@/components/channel/Header";
import HeroContent from "@/components/channel/HeroContent";
import ContentGrid from "@/components/channel/ContentGrid";
import AboutCard from "@/components/channel/AboutCard";
import Footer from "@/components/channel/Footer";

// --- Model-based Interfaces ---
interface UserProfile {
  _id: string | Types.ObjectId;
  name: string;
  profileImage?: string;
  tagline?: string;
  bio?: string;
  credentials?: string[];
  socialLinks?: { type: string; url: string }[];
  subscribersCount?: number;
}

interface CreatorContent {
  _id: string | Types.ObjectId;
  title: string;
  thumbnail?: string;
  views?: number;
  tags?: string[];
  description?: string;
}

interface CreatorBook {
  _id: string | Types.ObjectId;
  title: string;
  thumbnail?: string;
  views?: number;
  tags?: string[];
  description?: string;
}

interface Stats {
    rating: number;
    ratingCount: number;
    subscriberCount: number;
    totalViews: number;
}

interface ApiCreatorResponse {
    creator: UserProfile;
    content: CreatorContent[];
    books: CreatorBook[];
    stats: Stats;
}

// --- Available Tabs ---
type TabName = 'Home' | 'Contents' | 'Books' | 'Workspaces';

// --- Main Content Component ---
export default function CreatorPage() {
    const { data: session, status: sessionStatus } = useSession();
    const params = useParams();
    const creatorId = params.creatorId as string;

    const [creator, setCreator] = useState<UserProfile | null>(null);
    const [content, setContent] = useState<CreatorContent[]>([]);
    const [books, setBooks] = useState<CreatorBook[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [checkingSubscription, setCheckingSubscription] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabName>('Home');

    // --- Data Fetching ---
    useEffect(() => {
        if (!creatorId) {
            setError("Creator ID not found in URL.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/creator/${creatorId}`);
                if (!res.ok) {
                    const errData = await res.json().catch(() => ({ message: "Failed to load creator data" }));
                    throw new Error(errData.message || `HTTP error! status: ${res.status}`);
                }
                const data: ApiCreatorResponse = await res.json();
                setCreator(data.creator);
                setContent(data.content || []);
                setBooks(data.books || []);
                setStats(data.stats);
            } catch (err: any) {
                setError(err.message || "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [creatorId]);

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
                     setStats(prev => prev ? { ...prev, subscriberCount: data.subscriberCount ?? prev.subscriberCount } : null);
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
    const handleSubscriptionChange = async (subscribe: boolean): Promise<void> => {
        if (!creator?._id || sessionStatus !== 'authenticated' || !session.user?.id) throw new Error("Authentication required or creator data missing.");
        if (session.user.id === creator._id.toString()) throw new Error("You cannot subscribe to yourself.");

        const previousSubscribedState = isSubscribed;
        setIsSubscribed(subscribe);
        setStats(prev => {
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
            if (!response.ok) throw new Error((await response.json()).message || 'Subscription update failed');
        } catch (error) {
            console.error("Failed to update subscription:", error);
            setIsSubscribed(previousSubscribedState);
            setStats(prev => {
                if (!prev) return null;
                const change = subscribe ? -1 : 1;
                return { ...prev, subscriberCount: Math.max(0, prev.subscriberCount + change) };
            });
            throw error;
        }
    };

    // --- Loading and Error States ---
    if (loading) return <div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-[#F5F7FA]"><p className="text-xl">Loading Creator...</p></div>;
    if (error) return <div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-red-500"><p className="text-xl text-center p-4">{error}</p></div>;
    if (!creator) return <div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-[#F5F7FA]"><p>Creator not found.</p></div>;

    // --- Prepare Props for Child Components ---
    const creatorForHeader = {
        id: creator._id.toString(),
        avatarUrl: creator.profileImage || '/default-avatar.png',
        name: creator.name || 'Unnamed Creator',
        tagline: creator.tagline,
    };

    const creatorForAboutCard = {
        name: creator.name,
        bio: creator.bio,
        credentials: creator.credentials,
        socialLinks: creator.socialLinks,
    };
    
    // ** FIX: Changed `id` to `_id` to match the GridItem/ContentCard type **
    const mapToGridItem = (item: CreatorContent | CreatorBook) => ({
      _id: item._id.toString(),
      title: item.title,
      thumbnail: item.thumbnail || '/placeholder.svg',
      tags: item.tags || [],
    });

    // ** FIX: Renamed 'id' to 'id' for HeroContent and added description **
    const mapToHeroItem = (item: CreatorContent | CreatorBook) => ({
      id: item._id.toString(), // HeroContent expects `id` not `_id`
      title: item.title,
      thumbnail: item.thumbnail || '/placeholder.svg',
      description: item.description || '', // Add description for hero display
    });

    const allContentForGrid = content.map(mapToGridItem);
    const allBooksForGrid = books.map(mapToGridItem);
    const heroContentItems = content.slice(0, 5).map(mapToHeroItem); // Use original content for hero, then map

    const statsForAboutCard = stats ? { ...stats, contentCount: content.length + books.length } : null;

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
                        {allContentForGrid.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold mb-4">Latest Content</h2>
                                <ContentGrid content={allContentForGrid} />
                            </div>
                        )}
                        <AboutCard creator={creatorForAboutCard} stats={statsForAboutCard} />
                    </>
                )}
                {activeTab === 'Contents' && (
                     <>
                        <h2 className="text-2xl font-bold mb-4">All Content</h2>
                        <ContentGrid content={allContentForGrid} />
                     </>
                )}
                {activeTab === 'Books' && (
                     <>
                        <h2 className="text-2xl font-bold mb-4">Books</h2>
                        <ContentGrid content={allBooksForGrid} />
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

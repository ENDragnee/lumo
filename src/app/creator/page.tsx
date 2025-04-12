"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation';

// Component Imports
import NewHeader from "@/components/channel/Header"; // Assuming Header is updated to accept tabs
import HeroContent from "@/components/channel/HeroContent";
import ContentGrid from "@/components/channel/ContentGrid";
import AboutCard from "@/components/channel/AboutCard";
import Footer from "@/components/channel/Footer";
import { Creator, ContentItem, Stats } from "@/types/creator";

// Define the expected shape of the API response
interface ApiCreatorResponse {
    creator: Creator & { _id?: string | import('mongoose').Types.ObjectId };
    content: ContentItem[];
    stats: Stats;
}

// --- Available Tabs ---
type TabName = 'Home' | 'Contents' | 'Books' | 'Workspaces'; // Define possible tab names

// --- Main Content Component ---
function CreatorPageContent() {
    const { data: session, status: sessionStatus } = useSession();
    const searchParams = useSearchParams();
    const creatorIdFromQuery = searchParams.get('id');

    // --- State Variables ---
    const [creator, setCreator] = useState<Creator | null>(null);
    const [content, setContent] = useState<ContentItem[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [checkingSubscription, setCheckingSubscription] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabName>('Home'); // <-- State for active tab

    // --- Fetch Creator Data Effect ---
    useEffect(() => {
        // ... (rest of the useEffect remains the same - fetching creator, content, stats) ...
        setCreator(null);
        setContent([]);
        setStats(null);
        setIsSubscribed(false);
        setCheckingSubscription(true);
        setLoading(true);
        setError(null);
        setActiveTab('Home'); // Reset tab on ID change

        if (!creatorIdFromQuery) {
            setError("Creator ID not found in URL query parameters.");
            setLoading(false);
            setCheckingSubscription(false);
            return;
        }

        const fetchData = async () => {
            console.log(`Fetching data for creator ID: ${creatorIdFromQuery}`);
            try {
                const res = await fetch(`/api/creator?id=${creatorIdFromQuery}`);
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({ message: "Failed to load creator data" }));
                    throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
                }

                const data: ApiCreatorResponse = await res.json();

                if (!data.creator) {
                     throw new Error("Creator data not found in API response.");
                }

                // Format Creator
                const formattedCreator: Creator = {
                    ...data.creator,
                    id: data.creator._id?.toString() || data.creator.id || creatorIdFromQuery,
                    avatarUrl: data.creator.avatarUrl || '/default-avatar.png',
                    tagline: data.creator.tagline || 'Inspiring the next generation',
                    bio: data.creator.bio || `I am ${data.creator.name}. Learning and sharing knowledge!`,
                    credentials: data.creator.credentials || ['PhD', 'Educator'],
                    socialLinks: data.creator.socialLinks || [],
                    name: data.creator.name || "Unnamed Creator",
                };

                // Format Content
                const formattedContent: ContentItem[] = (data.content || []).map((item: any, index: number) => ({
                    ...item,
                    id: item._id?.toString() || item.id || `content-${index}-${Date.now()}`,
                    type: item.type || 'lesson',
                    thumbnail: item.thumbnail || '/default-thumbnail.jpg',
                    // Ensure all required fields for ContentCard are present
                    title: item.title || 'Untitled Content',
                    duration: item.duration || 0, // Example: Add default duration if missing
                    views: item.views || 0, // Example: Add default views if missing
                    publishedDate: item.publishedDate || new Date().toISOString(), // Example
                }));

                // Format Stats
                const formattedStats: Stats = {
                    rating: data.stats?.rating ?? 0,
                    ratingCount: data.stats?.ratingCount ?? 0,
                    subscriberCount: data.stats?.subscriberCount ?? 0, // Initial count
                    totalViews: data.stats?.totalViews ?? 0,
                };

                setCreator(formattedCreator);
                setContent(formattedContent); // Store all content
                setStats(formattedStats);

            } catch (err: any) {
                console.error("Fetch creator data error:", err);
                setError(err.message || "Error loading data");
                setCheckingSubscription(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [creatorIdFromQuery]);

    // --- Fetch Subscription Status Effect ---
    useEffect(() => {
        // ... (rest of the useEffect remains the same - checking subscription status) ...
        if (!creator || !creator.id || sessionStatus !== 'authenticated' || !session?.user?.id) {
            setCheckingSubscription(false);
            setIsSubscribed(false);
            return;
        }

        if (session.user.id === creator.id) {
             console.log("Viewing own channel, skipping subscription check.");
             setCheckingSubscription(false);
             setIsSubscribed(false);
             // Fetch the count anyway if needed for display, but don't allow subscribe action
             // Let's assume the initial fetch in fetchData might get the count correctly
             // OR add a specific endpoint fetch here if needed for self-view count
             return;
        }

        const fetchSubscriptionStatus = async () => {
            console.log(`Checking subscription status for creator ID: ${creator.id} (User: ${session?.user?.id})`);
            setCheckingSubscription(true);
            try {
                const res = await fetch(`/api/subscriptions/status/${creator.id}`);
                if (!res.ok) {
                    // ... (error handling as before)
                    setIsSubscribed(false);
                    return;
                }
                const data = await res.json();
                if (data.success) {
                     console.log(`Subscription status received: ${data.isSubscribed}, Count: ${data.subscriberCount}`);
                     setIsSubscribed(data.isSubscribed);
                     setStats(prevStats => {
                         if (!prevStats) return null; // Should have stats if creator exists
                         return {
                             ...prevStats,
                             subscriberCount: data.subscriberCount ?? prevStats.subscriberCount
                         };
                     });
                } else {
                    // ... (handle API unsuccessful case as before)
                     setIsSubscribed(false);
                }

            } catch (err) {
                 // ... (error handling as before)
                setIsSubscribed(false);
            } finally {
                setCheckingSubscription(false);
            }
        };

        fetchSubscriptionStatus();
    }, [creator, sessionStatus, session?.user?.id]);

    // --- Handle Subscription Change ---
    const handleSubscriptionChange = async (subscribe: boolean): Promise<void> => {
        // ... (function remains the same) ...
        if (!creator || !creator.id || sessionStatus !== 'authenticated' || !session?.user?.id) {
            console.error("Cannot subscribe: Missing creator data or user not authenticated.");
            throw new Error("Authentication required or creator data missing.");
        }
        if (session.user.id === creator.id) {
            console.warn("Attempted to subscribe to self.");
            throw new Error("Cannot subscribe to yourself");
        }
        console.log(`Attempting to ${subscribe ? 'subscribe' : 'unsubscribe'} to creator: ${creator.id}`);
        const previousSubscribedState = isSubscribed;
        try {
            const response = await fetch('/api/subscribe', { /* ... request details ... */
                 method: 'PUT',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ creatorId: creator.id, subscribe }),
            });
            if (!response.ok) { /* ... error handling ... */
                const errorData = await response.json().catch(() => ({ message: 'Subscription update failed' }));
                throw new Error(errorData.message || `Failed to update subscription: ${response.status}`);
            }
            const result = await response.json();
            console.log("Subscription API response:", result);
            setIsSubscribed(subscribe);
            setStats(prevStats => {
                 if (!prevStats) return null;
                 const change = subscribe && !previousSubscribedState ? 1 : (!subscribe && previousSubscribedState ? -1 : 0);
                 const newCount = Math.max(0, (prevStats.subscriberCount ?? 0) + change);
                 console.log(`Updating subscriber count: ${prevStats.subscriberCount ?? 0} + ${change} = ${newCount}`);
                 return { ...prevStats, subscriberCount: newCount };
            });
        } catch (error) {
            console.error("Failed to update subscription:", error);
            throw error;
        }
    };

    // --- Loading and Error States ---
    if (loading) return <div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-[#F5F7FA]"><p className="text-xl">Loading Creator...</p></div>;
    if (error) return <div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-red-500"><p className="text-xl text-center p-4">{error}</p></div>;
    if (!creator) return <div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-[#F5F7FA]"><p>Creator data not available.</p></div>;

    // --- Determine content for Hero section (always first few items) ---
    const heroContentItems = content.slice(0, 5); // Keep using first 5 for hero

    // --- Render UI ---
    return (
        <main className="min-h-screen dark:bg-[#1E1E24] text-[#F5F7FA] font-sans ml-2 p-2">

            {/* Pass tab state and handler to Header */}
            <NewHeader
                creator={creator}
                stats={stats}
                creatorId={creator.id || ""}
                initialIsSubscribed={isSubscribed}
                isCheckingSubscription={checkingSubscription}
                onSubscriptionChange={handleSubscriptionChange}
                activeTab={activeTab} // <-- Pass current active tab
                onTabChange={(tab) => setActiveTab(tab)} // <-- Pass handler to update tab
            />

            {/* Conditionally render content based on activeTab */}
            <div className="container mx-auto px-4 py-8 space-y-12">
                {activeTab === 'Home' && (
                    <>
                        {heroContentItems.length > 0 && (
                            <HeroContent popularVideos={heroContentItems} autoScrollInterval={7000} />
                        )}
                        {content.length > 0 && (
                            <div className="mt-12"> {/* Add margin-top */}
                                <h2 className="text-2xl font-bold mb-4 text-[#F5F7FA]">
                                    {heroContentItems.length > 0 ? "All Content" : "Content"} {/* Adjust title */}
                                </h2>
                                <ContentGrid content={content} /> {/* Show ALL content in the grid */}
                            </div>
                        )}
                         {/* Keep AboutCard on Home for now */}
                        <AboutCard creator={creator} stats={stats} />
                    </>
                )}

                {activeTab === 'Contents' && (
                     <>
                        <h2 className="text-2xl font-bold mb-4 text-[#F5F7FA]">All Content</h2>
                        {content.length > 0 ? (
                            <ContentGrid content={content} /> /* Show ONLY the grid with ALL content */
                        ) : (
                            <p className="text-gray-400">This creator hasn't uploaded any content yet.</p>
                        )}
                    </>
                )}

                {activeTab === 'Books' && (
                     <div className="text-center py-10">
                        <h2 className="text-2xl font-bold mb-4 text-[#F5F7FA]">Books</h2>
                        <p className="text-gray-400">Books section coming soon!</p>
                        {/* You could potentially fetch and display book-related content here later */}
                     </div>
                )}

                 {activeTab === 'Workspaces' && (
                     <div className="text-center py-10">
                        <h2 className="text-2xl font-bold mb-4 text-[#F5F7FA]">Workspaces</h2>
                        <p className="text-gray-400">Workspaces feature coming soon!</p>
                        {/* You could potentially fetch and display workspace-related content here later */}
                     </div>
                )}
            </div>

            <Footer name={creator.name} />
        </main>
    );
}


// --- Parent Component to handle Suspense ---
export default function CreatorPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-[#F5F7FA]"><p className="text-xl">Loading Page...</p></div>}>
            <CreatorPageContent />
        </Suspense>
    );
}
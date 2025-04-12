"use client";

import { useEffect, useState, Suspense } from "react"; // Import Suspense
import { useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation'; // <--- Import useSearchParams

// Component Imports
import NewHeader from "@/components/channel/Header";
import HeroContent from "@/components/channel/HeroContent";
import ContentCarousel from "@/components/channel/ContentCarousel";
import ContentGrid from "@/components/channel/ContentGrid";
import AboutCard from "@/components/channel/AboutCard";
import Footer from "@/components/channel/Footer";
import { Creator, ContentItem, Stats } from "@/types/creator"; // Make sure Creator type includes 'id' or '_id'
// import { set } from "mongoose"; // Removed unused import

// Define the expected shape of the API response (adjust if needed)
interface ApiCreatorResponse {
    creator: Creator & { _id?: string | import('mongoose').Types.ObjectId }; // Ensure _id is potentially there from API
    content: ContentItem[];
    stats: Stats; // Ensure this includes subscriberCount if available from this endpoint
}

// --- Main Component ---
function CreatorPageContent() { // Wrap the main logic in a separate component
    const { data: session, status: sessionStatus } = useSession();
    const searchParams = useSearchParams(); // <-- Get search params object
    const creatorIdFromQuery = searchParams.get('id'); // <-- Extract the 'id' parameter

    // --- State Variables ---
    const [creator, setCreator] = useState<Creator | null>(null);
    const [content, setContent] = useState<ContentItem[]>([]);
    const [stats, setStats] = useState<Stats | null>(null); // Stores all stats, including subscriberCount
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [checkingSubscription, setCheckingSubscription] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Removed redundant subscriberCount state: const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

    // --- Fetch Creator Data Effect ---
    useEffect(() => {
        // Reset states when ID changes or is initially absent
        setCreator(null);
        setContent([]);
        setStats(null); // Reset stats
        setIsSubscribed(false);
        setCheckingSubscription(true);
        setLoading(true);
        setError(null);

        if (!creatorIdFromQuery) {
            setError("Creator ID not found in URL query parameters.");
            setLoading(false);
            setCheckingSubscription(false);
            return;
        }

        const fetchData = async () => {
            console.log(`Fetching data for creator ID: ${creatorIdFromQuery}`);
            try {
                const res = await fetch(`/api/creator?id=${creatorIdFromQuery}`); // Use the ID from query
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({ message: "Failed to load creator data" }));
                    throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
                }

                const data: ApiCreatorResponse = await res.json();

                if (!data.creator) {
                     throw new Error("Creator data not found in API response.");
                }

                // Format Creator - IMPORTANT: Ensure 'id' is correctly assigned
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
                    id: item._id?.toString() || item.id || `content-${index}-${Date.now()}`, // Robust ID generation
                    type: item.type || 'lesson',
                    thumbnail: item.thumbnail || '/default-thumbnail.jpg',
                }));

                // Format Stats - Initialize with data from the main creator fetch if available
                const formattedStats: Stats = {
                    rating: data.stats?.rating ?? 0,
                    ratingCount: data.stats?.ratingCount ?? 0,
                    // Use subscriberCount from initial fetch if present, otherwise default (e.g., 0).
                    // This might be overwritten later by the subscription status check.
                    subscriberCount: data.stats?.subscriberCount ?? 0,
                    totalViews: data.stats?.totalViews ?? 0,
                    // Include other stats fields if they exist in your type/API
                };

                setCreator(formattedCreator);
                setContent(formattedContent);
                setStats(formattedStats); // Set initial stats

            } catch (err: any) {
                console.error("Fetch creator data error:", err);
                setError(err.message || "Error loading data");
                setCheckingSubscription(false); // Stop subscription check if creator fetch fails
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Dependency: Run effect when the ID from the query parameter changes
    }, [creatorIdFromQuery]);

    // --- Fetch Subscription Status Effect ---
    useEffect(() => {
        // Exit conditions: No creator loaded, session loading/unauthenticated, or checking self
        if (!creator || !creator.id || sessionStatus !== 'authenticated' || !session?.user?.id) {
            setCheckingSubscription(false);
            setIsSubscribed(false); // Default to false if not applicable
            return;
        }

        // Prevent checking subscription status for oneself
        if (session.user.id === creator.id) {
             console.log("Viewing own channel, skipping subscription check.");
             setCheckingSubscription(false);
             setIsSubscribed(false); // Cannot be subscribed to self
             // Optionally, fetch the count even for self, but don't set isSubscribed
             // For now, we skip the entire fetch for self-view
             return;
        }


        const fetchSubscriptionStatus = async () => {
            console.log(`Checking subscription status for creator ID: ${creator.id} (User: ${session?.user?.id})`);
            setCheckingSubscription(true);
            try {
                // Use the creator.id obtained from the fetched creator data
                const res = await fetch(`/api/subscriptions/status/${creator.id}`);
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error(`Failed to fetch subscription status (${res.status}): ${errorText}`);
                    setIsSubscribed(false); // Assume not subscribed on API error
                    // Don't update count on error, keep the initial one or previous state
                    return; // Don't proceed further
                }
                const data = await res.json();
                if (data.success) {
                     console.log(`Subscription status received: ${data.isSubscribed}, Count: ${data.subscriberCount}`);
                     setIsSubscribed(data.isSubscribed);
                     // --- UPDATE STATS WITH SUBSCRIBER COUNT ---
                     setStats(prevStats => {
                         if (!prevStats) {
                             // Should ideally not happen if creator fetch was successful
                             console.warn("Stats object is null while trying to update subscriber count.");
                             // Initialize stats partially if needed, though it's better if the first effect handles it.
                             return {
                                 rating: 0,
                                 ratingCount: 0,
                                 subscriberCount: data.subscriberCount ?? 0, // Use count from API
                                 totalViews: 0,
                             };
                         }
                         // Update only the subscriber count in the existing stats object
                         return {
                             ...prevStats,
                             subscriberCount: data.subscriberCount ?? prevStats.subscriberCount // Use API count, fallback to previous
                         };
                     });
                     // Removed: setSubscriberCount(data.subscriberCount);
                } else {
                     console.warn("Subscription status API call unsuccessful:", data.message);
                     setIsSubscribed(false); // Assume false if API indicates failure
                     // Optionally update count even on failure if the API provides it?
                     // For now, we only update count on success.
                }

            } catch (err) {
                console.error("Error fetching subscription status:", err);
                setIsSubscribed(false); // Assume not subscribed on network/fetch error
                // Don't update count on error
            } finally {
                setCheckingSubscription(false);
            }
        };

        fetchSubscriptionStatus();

    // Dependencies: Run when creator data is available, session status changes, or user ID changes
    }, [creator, sessionStatus, session?.user?.id]); // Keep creator dependency

    // --- Handle Subscription Change ---
    const handleSubscriptionChange = async (subscribe: boolean): Promise<void> => {
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

        // Optimistic UI update for responsiveness (optional, can uncomment)
        /*
        setIsSubscribed(subscribe);
        setStats(prevStats => {
            if (!prevStats) return null;
            const change = subscribe ? 1 : (previousSubscribedState ? -1 : 0);
            const currentCount = prevStats.subscriberCount ?? 0;
            return { ...prevStats, subscriberCount: Math.max(0, currentCount + change) };
        });
        */

        try {
            const response = await fetch('/api/subscribe', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ creatorId: creator.id, subscribe }), // Use creator.id
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Subscription update failed' }));
                throw new Error(errorData.message || `Failed to update subscription: ${response.status}`);
            }

            const result = await response.json();
             console.log("Subscription API response:", result);

            // --- Update State AFTER Successful API Call ---
            // (If not using optimistic update, do it here)
             setIsSubscribed(subscribe); // Update subscription status based on API success
             setStats(prevStats => { // Update subscriber count based on action
                 if (!prevStats) return null; // Should have stats if creator exists
                 // Calculate change based on the actual previous state vs the new state
                 const change = subscribe && !previousSubscribedState ? 1 : (!subscribe && previousSubscribedState ? -1 : 0);
                 const newCount = Math.max(0, (prevStats.subscriberCount ?? 0) + change); // Ensure count doesn't go below 0
                 console.log(`Updating subscriber count: ${prevStats.subscriberCount ?? 0} + ${change} = ${newCount}`);
                 return {
                     ...prevStats,
                     subscriberCount: newCount,
                 };
             });
            // ------------------------------------------------------------------------------

        } catch (error) {
            console.error("Failed to update subscription:", error);

            // --- Rollback Optimistic UI Update on Error ---
            /*
            if (/* optimistic update was used *\/) {
                setIsSubscribed(previousSubscribedState);
                setStats(prevStats => {
                    if (!prevStats) return null;
                    // Reverse the change based on the intended action
                    const change = subscribe ? -1 : (previousSubscribedState ? 1 : 0);
                    const currentCount = prevStats.subscriberCount ?? 0;
                    return { ...prevStats, subscriberCount: Math.max(0, currentCount + change) };
                });
            }
            */
            // -------------------------------------------------
            throw error; // Re-throw error for the Header component to potentially handle
        }
    };


    // --- Loading and Error States ---
    if (loading) return <div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-[#F5F7FA]"><p className="text-xl">Loading Creator...</p></div>;
    if (error) return <div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-red-500"><p className="text-xl text-center p-4">{error}</p></div>;
    if (!creator) return <div className="flex justify-center items-center min-h-screen dark:bg-[#1E1E24] text-[#F5F7FA]"><p>Creator data not available or still loading for the provided ID.</p></div>;


    // --- Determine content for different sections ---
    const heroItemCount = Math.min(5, content.length);
    const heroContentItems = content.slice(0, heroItemCount);
    const carouselItemCount = Math.min(5, content.length - heroItemCount);
    const carouselContent = content.slice(heroItemCount, heroItemCount + carouselItemCount);
    const gridContent = content.slice(heroItemCount + carouselItemCount);

    // --- Render UI ---
    return (
        <main className="min-h-screen dark:bg-[#1E1E24] text-[#F5F7FA] font-sans ml-2 p-2">

            {/* Pass the whole stats object which now contains the updated subscriber count */}
            <NewHeader
                creator={creator}
                stats={stats} // Pass the entire stats object
                creatorId={creator.id || ""}
                initialIsSubscribed={isSubscribed}
                isCheckingSubscription={checkingSubscription}
                onSubscriptionChange={handleSubscriptionChange}
            />

            <div className="container mx-auto px-4 py-8 space-y-12">
                {heroContentItems.length > 0 && (
                    <HeroContent popularVideos={heroContentItems} autoScrollInterval={7000} />
                )}
                {carouselContent.length > 0 && <ContentCarousel content={carouselContent} />}
                {gridContent.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-[#F5F7FA]">More Content</h2>
                        <ContentGrid content={gridContent} />
                    </div>
                )}
                {/* Pass the stats object here too */}
                <AboutCard creator={creator} stats={stats} />
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
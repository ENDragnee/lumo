// @/components/RecommendedContent.tsx (Updated for Mobile Responsiveness)
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Eye, GraduationCap, Star, X } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// Removed useMediaQuery as direct conditional classes handle responsiveness well

// Extend NextAuth session type to include user ID
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

type RecommendedItem = {
  _id: string;
  title: string;
  thumbnail: string;
  subject: string;
  institution: string;
  views: number;
  passRate: number;
};

interface RecommendedContentProps {
  isOpen?: boolean;
  toggleOpen?: () => void;
}

export default function RecommendedContent({ isOpen = false, toggleOpen }: RecommendedContentProps) { // Default isOpen to false
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState<RecommendedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Only fetch if the component might become visible or is already open,
      // or always fetch depending on desired UX (fetch once vs fetch on open)
      // For simplicity, fetch when component mounts (like before)
      setLoading(true);
      try {
        const userId = session?.user?.id;
        const url = new URL('/api/recommendations', window.location.origin);
        if (userId) url.searchParams.set('userId', userId);

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
        }

        const data = await response.json();
        setRecommendations(data);
        setError("");
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(err instanceof Error ? err.message : 'Failed to load recommendations. Please try again later.');
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [session?.user?.id]); // Refetch if user changes

  const formatViews = (views: number) => {
    if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M views`;
    if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K views`;
    return `${views} views`;
  };

  const formatPassRate = (rate: number) => {
    const numericRate = Number(rate);
    if (isNaN(numericRate)) return "N/A % pass rate";
    return `${Math.round(numericRate * 100)}% pass rate`;
  };

  return (
    <> {/* Use Fragment to contain sidebar and overlay */}
      {/* Overlay (Mobile Only) */}
      {isOpen && toggleOpen && (
         <div
             className={cn(
                 "fixed inset-0 bg-black/40 z-30 transition-opacity duration-300 ease-in-out md:hidden", // Only show overlay on mobile
                 isOpen ? "opacity-100" : "opacity-0 pointer-events-none" // Fade in/out
             )}
             onClick={toggleOpen}
             aria-hidden="true"
         />
      )}

      {/* Sidebar Panel */}
      <aside // Changed div to aside for semantic meaning
        className={cn(
          "fixed right-0 top-0 h-full", // Use top-0 for full height, position relative to header comes from layout
          "bg-gray-50 dark:bg-[#272930]", // Slightly different bg for contrast
          "overflow-y-auto shadow-xl", // Increased shadow for mobile emphasis
          "transition-transform duration-300 ease-in-out z-40", // Ensure it's above overlay
          "w-[85vw] max-w-sm md:w-80 md:max-w-none", // Use viewport width % on mobile, fixed on desktop, add max-width
          "border-l border-gray-200 dark:border-gray-700/50", // Add border back
          isOpen ? "translate-x-0" : "translate-x-full", // Slide in/out from right
          !isOpen && "border-l-0", // Hide border when closed
          "md:top-16 md:h-[calc(100vh-4rem)] md:rounded-l-2xl" // Desktop specific: position below header, adjust height, add rounding
        )}
        aria-labelledby="recommendations-heading"
      >
        <div className={cn(
            "flex flex-col h-full",
            "p-4 md:p-4" // Consistent padding, adjust if needed
        )}>
          {/* Header Section */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0 pb-3 border-b border-gray-200 dark:border-gray-700/50">
            <h2 id="recommendations-heading" className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Recommended
            </h2>
            {/* Close Button - Always available when open */}
            {toggleOpen && (
              <button
                onClick={toggleOpen}
                className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Close recommendations"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto space-y-4 -mr-2 pr-2 custom-scrollbar"> {/* Add custom-scrollbar if defined in globals.css */}
            {loading ? (
              // Consistent Skeleton Layout
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton height={110} className="rounded-lg" baseColor="var(--skeleton-base)" highlightColor="var(--skeleton-highlight)" />
                  <Skeleton count={1} width="80%" baseColor="var(--skeleton-base)" highlightColor="var(--skeleton-highlight)" />
                  <Skeleton count={1} width="60%" baseColor="var(--skeleton-base)" highlightColor="var(--skeleton-highlight)" />
                </div>
              ))
            ) : error ? (
              <div className="p-4 text-red-600 dark:text-red-400 text-center flex flex-col items-center justify-center h-full">
                <p className="font-medium">Oops!</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400 text-center pt-16 flex flex-col items-center justify-center h-full">
                 <Eye className="w-10 h-10 mb-2 text-gray-400 dark:text-gray-500" />
                 <p className="font-medium">Nothing Here Yet</p>
                 <p className="text-sm">Check back later for recommendations.</p>
              </div>
            ) : (
              recommendations.map((item) => (
                // Improved Card Styling
                <div onClick={() => {router.push(`/content?id=${item._id}`); toggleOpen}} key={item._id} className="w-full cursor-pointer">
                  {/* <Link
                    key={item._id}
                    href={`/content?id=${item._id}`}
                    className="group block bg-white dark:bg-[#31333c] border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md dark:hover:bg-[#3b3e48] rounded-lg p-2.5 transition-all duration-200"
                    onClick={toggleOpen} // Optional: Close sidebar when clicking a link
                  > */}
                    <div className="relative aspect-[16/10] rounded-md overflow-hidden mb-2.5">
                      {item.thumbnail ? (
                        <img
                            src={`${process.env.NEXT_PUBLIC_CREATOR_URL}${item.thumbnail}`}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Preview N/A</span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 line-clamp-2 mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {item.title}
                    </h3>

                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                      <GraduationCap className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                      <span className="line-clamp-1" title={item.institution}>{item.institution || 'Unknown Institution'}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center" title={`${item.views > 0 || item.views != undefined ? item.views : 0} views`}>
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        {formatViews(item.views)}
                      </div>
                      <div className="flex items-center" title={`${formatPassRate(item.passRate)}`}>
                        <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                        {formatPassRate(item.passRate)}
                      </div>
                    </div>

                    {item.subject && (
                      <div className="mt-2">
                          <span className="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded-full">
                            {item.subject}
                          </span>
                      </div>
                    )}
                  {/* </Link> */}
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
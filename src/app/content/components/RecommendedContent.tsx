"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Eye, GraduationCap, Star, X } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { cn } from "@/lib/utils";

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

export default function RecommendedContent({ isOpen = true, toggleOpen }: RecommendedContentProps) {
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState<RecommendedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const userId = session?.user?.id;
        const url = new URL('/api/recommendations', window.location.origin);
        if (userId) url.searchParams.set('userId', userId);

        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [session?.user?.id]);

  const formatViews = (views: number) => {
    if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M views`;
    if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K views`;
    return `${views} views`;
  };

  const formatPassRate = (rate: number) => {
    return `${Math.round(rate * 100)}% pass rate`;
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className={cn(
      "fixed right-0 top-0 h-full border-l dark:border-gray-700 bg-white dark:bg-[#2b2d36] overflow-y-auto transition-all duration-300",
      isOpen ? "w-80" : "w-0 overflow-hidden"
    )}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">
            Recommended Content
          </h2>
          {toggleOpen && (
            <button onClick={toggleOpen} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton height={100} />
                <Skeleton count={2} />
              </div>
            ))
          ) : recommendations.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400">
              No recommendations available
            </div>
          ) : (
            recommendations.map((item) => (
              <Link
                key={item._id}
                href={`/content?id=${item._id}`}
                className="group block border-[1px] border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                  {item.title}
                </h3>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <span className="line-clamp-1">{item.institution}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {formatViews(item.views)}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    {formatPassRate(item.passRate)}
                  </div>
                </div>

                <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                  {item.subject}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
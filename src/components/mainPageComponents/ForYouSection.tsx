// src/components/dashboard/ForYouSection.tsx
"use client"

import { useEffect, useState } from "react"
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ContentCardList } from "@/components/cards/ContentCardList" // Import the correct card
import { ArrowUpRight, ChevronRight, Lightbulb as LightBulb, Trophy } from "lucide-react"
import { OfflineManager } from "@/components/offline/OfflineManager"
import { Skeleton } from "@/components/ui/skeleton"

// Define the type for the content we expect from our new API
// This should match the props for ContentCardList
type RecentContent = {
  _id: string;
  title: string;
  thumbnail: string;
  tags?: string[];
  performance?: {
    understandingLevel: 'needs-work' | 'foundational' | 'good' | 'mastered';
  };
  lastAccessedAt?: string | Date;
  createdBy?: {
    _id: string;
    name: string;
  };
};

const PlaceholderCard = ({ title, message }: { title: string; message: string }) => (
  <Card className="bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700">
    <CardContent className="p-4 md:p-6 h-full flex flex-col justify-center">
      <h3 className="font-semibold text-base md:text-lg text-shadow mb-2 dark:text-gray-100">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>
    </CardContent>
  </Card>
);

// Skeleton loader for the content list
const ContentListSkeleton = () => (
    <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 w-full">
                <Skeleton className="h-16 w-28 flex-shrink-0 rounded-md" />
                <div className="flex-grow space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
        ))}
    </div>
);

export function ForYouSection({ name, upNext, focusArea, weeklyGoal }: any) {
  const [content, setContent] = useState<RecentContent[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentContent = async () => {
      setLoading(true);
      try {
        // Call the new API endpoint
        const res = await fetch("/api/user/recent-content?limit=5") 
        if (!res.ok) throw new Error("Failed to fetch recent content")
        const data = await res.json()
        setContent(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching recent content:", error)
        setContent([]) // Set to empty array on error
      } finally {
        setLoading(false);
      }
    }
    fetchRecentContent()
  }, [])

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-shadow tracking-tight mb-4 dark:text-white">
        For You, {name ? name.split(" ")[0] : "Student"}
      </h2>
      {/* Main grid layout, stacks on smaller screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Contextual Cards (takes full width on mobile) */}
        <div className="space-y-6">
          {upNext ? (
            <Card className="bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  <h3 className="font-semibold text-base md:text-lg text-shadow dark:text-gray-100">Up Next</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">{upNext.subject}</p>
                <p className="text-gray-800 dark:text-white font-semibold mb-3">{upNext.title}</p>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${upNext.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{upNext.progress}% complete</p>
              </CardContent>
            </Card>
          ) : (
            <PlaceholderCard title="Up Next" message="No tasks in progress. Start a new course to see it here!" />
          )}

          {focusArea ? (
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 shadow-sm border border-yellow-200 dark:border-yellow-500/30">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <LightBulb className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                  <h3 className="font-semibold text-base md:text-lg text-yellow-900 dark:text-yellow-200">Focus Area</h3>
                </div>
                <p className="text-yellow-800 dark:text-yellow-300 text-sm">{focusArea.reason}</p>
              </CardContent>
            </Card>
          ) : (
            <PlaceholderCard title="Focus Area" message="Great job! No specific areas need focus right now." />
          )}

          <Card className="bg-green-50 dark:bg-green-900/20 shadow-sm border border-green-200 dark:border-green-500/30">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Trophy className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                <h3 className="font-semibold text-base md:text-lg text-green-900 dark:text-green-200">Weekly Goal</h3>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xl md:text-2xl font-bold text-green-800 dark:text-green-200">
                  {weeklyGoal.completed}/{weeklyGoal.total}
                </span>
                <span className="text-green-700 dark:text-green-300 text-sm">{weeklyGoal.description}</span>
              </div>
              <div className="w-full bg-green-200 dark:bg-green-800/50 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(weeklyGoal.completed / weeklyGoal.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <OfflineManager compact />
        </div>

        {/* Right Column: Continue Learning List (takes full width on mobile) */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-base md:text-lg text-shadow dark:text-gray-100">Continue Learning</h3>
                <Link href="/materials" passHref>
                  <Button variant="ghost" className="text-primary hover:bg-primary/10 font-semibold h-8 px-3">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-1">
                {loading ? (
                    <ContentListSkeleton />
                ) : content.length > 0 ? (
                    // Use ContentCardList here, passing the correct props
                    content.map((item, index) => (
                        <ContentCardList key={item._id} item={item} index={index} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
                      You haven't started any courses yet. Explore the library to begin!
                    </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

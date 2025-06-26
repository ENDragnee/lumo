// components/dashboard/ForYouSection.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IContent } from "@/models/Content"
import { LearningTrackCard } from "@/components/mainPageComponents/LearningTrackCard"
import { ArrowUpRight, ChevronRight, Lightbulb as LightBulb, Trophy } from "lucide-react"
import { OfflineManager } from "@/components/offline/OfflineManager"

const PlaceholderCard = ({ title, message }: { title: string; message: string }) => (
  <Card className="bg-white shadow-apple-sm border border-gray-200">
    <CardContent className="p-6 h-full flex flex-col justify-center">
      <h3 className="font-semibold text-lg text-shadow mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{message}</p>
    </CardContent>
  </Card>
)

export function ForYouSection({ name, upNext, focusArea, weeklyGoal }: any) {
  const [content, setContent] = useState<IContent[]>([])

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const res = await fetch("/api/recommendations") // Assuming you have this API
        if (!res.ok) throw new Error("Failed to fetch recommendations")
        const data = await res.json()
        setContent(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error(error)
        setContent([])
      }
    }
    fetchRecommendation()
  }, [])

  return (
    <div>
      <h2 className="text-3xl font-bold text-shadow tracking-tight mb-4">
        For You, {name ? name.split(" ")[0] : "Student"}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Contextual Cards */}
        <div className="space-y-6">
          {/* Up Next Card */}
          {upNext ? (
            <Card className="bg-white shadow-apple-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <ArrowUpRight className="w-6 h-6 text-pacific" />
                  <h3 className="font-semibold text-lg text-shadow">Up Next</h3>
                </div>
                <p className="text-gray-600 mb-1 text-sm font-medium">{upNext.subject}</p>
                <p className="text-gray-800 font-semibold mb-3">{upNext.title}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-pacific h-2 rounded-full transition-all duration-500"
                    style={{ width: `${upNext.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{upNext.progress}% complete</p>
              </CardContent>
            </Card>
          ) : (
            <PlaceholderCard title="Up Next" message="No tasks in progress. Start a new course to see it here!" />
          )}

          {/* Focus Area Card */}
          {focusArea ? (
            <Card className="bg-yellow-50 shadow-apple-sm border border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <LightBulb className="w-6 h-6 text-yellow-500" />
                  <h3 className="font-semibold text-lg text-yellow-900">Focus Area</h3>
                </div>
                <p className="text-yellow-800 text-sm">{focusArea.reason}</p>
              </CardContent>
            </Card>
          ) : (
            <PlaceholderCard title="Focus Area" message="Great job! No specific areas need focus right now." />
          )}

          {/* Weekly Goal Card */}
          <Card className="bg-green-50 shadow-apple-sm border border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Trophy className="w-6 h-6 text-green-500" />
                <h3 className="font-semibold text-lg text-green-900">Weekly Goal</h3>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl font-bold text-green-800">
                  {weeklyGoal.completed}/{weeklyGoal.total}
                </span>
                <span className="text-green-700 text-sm">{weeklyGoal.description}</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(weeklyGoal.completed / weeklyGoal.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Offline Access Card */}
          <OfflineManager compact />
        </div>

        {/* Right Column: Continue Learning Tracks */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-apple-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-shadow">Continue Learning</h3>
                <Button variant="ghost" className="text-pacific hover:bg-pacific/10 font-semibold">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
              
                {content.length > 0 ? (
                    content.map((contents: any) => (
                        <LearningTrackCard key={contents._id} track={contents} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-4">No other recommended courses are available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

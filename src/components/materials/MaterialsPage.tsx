// components/materials/MaterialsPage.tsx
"use client"

import { useState, useEffect } from "react"
import { IContent } from "@/models/Content"
import { FilterControls } from "./FilterControls"
import { FeaturedCollectionCard } from "@/components/materials/FeaturedCollectionCard"
import { LearningTrackCard } from "@/components/mainPageComponents/LearningTrackCard"
import { GraduationCap } from "lucide-react"

const institutionData = [
  {
    id: "aastu",
    title: "AASTU Curriculum",
    description: "Your primary learning hub for all official university courses and materials.",
    courseCount: 12,
    enrolledCount: 350,
    estimatedTime: "20 hours",
    difficulty: "medium" as "medium",
    gradient: "from-sage to-green-600",
    icon: <GraduationCap className="w-6 h-6" />,
  },
  {
    id: "moe",
    title: "Ministry of Education Resources",
    description: "Official supplementary resources provided by the Ministry for a broader educational scope.",
    courseCount: 25,
    enrolledCount: 500,
    estimatedTime: "40 hours",
    difficulty: "hard" as "hard",
    gradient: "from-butter to-yellow-500",
    icon: <GraduationCap className="w-6 h-6" />,
  },
]

export function MaterialsPage() {
  const [view, setView] = useState<"list" | "grid">("grid")
  const [filters, setFilters] = useState({})
  const [content, setContent] = useState<IContent[]>([])

  // This would ideally be a more sophisticated fetch that uses the filters
  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        const res = await fetch("/api/recommendations")
        if (!res.ok) {
          throw new Error("Failed to fetch content")
        }
        const data = await res.json()
        setContent(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error(error)
      }
    }
    fetchAllContent()
  }, [])

  // A real implementation would filter on the backend,
  // but for now we can filter on the client side as an example.
  const filteredContent = content.filter(item => {
    const { subject, difficulty, progress } = filters as any;
    if (subject && item.tags && !item.tags.includes(subject)) return false;
    if (difficulty && item.difficulty !== difficulty.toLowerCase()) return false;
    // 'progress' filtering logic would be more complex and require user progress data per item
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-shadow tracking-tight">Courses</h1>

      <FilterControls
        onViewChange={setView}
        currentView={view}
        onFilterChange={setFilters}
        activeFilters={filters}
      />

      {/* Featured Collections */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {institutionData.map((collection) => (
            <FeaturedCollectionCard
              key={collection.id}
              id={collection.id}
              title={collection.title}
              description={collection.description}
              courseCount={collection.courseCount}
              enrolledCount={collection.enrolledCount}
              estimatedTime={collection.estimatedTime}
              difficulty={collection.difficulty}
              gradient={collection.gradient}
              icon={collection.icon}
            />
          ))}
        </div>
      </div>

      {/* All Materials */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">All Courses</h2>
        {filteredContent.length > 0 ? (
          <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-3"}>
            {filteredContent.map((track) => (
              <LearningTrackCard key={(track as any)._id} track={track} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No courses match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

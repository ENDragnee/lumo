"use client"

import { useState, useEffect } from "react"
import { IContent } from "@/models/Content"
import { FilterControls } from "./FilterControls"
import { InstitutionCard } from "../cards/InstitutionCard" // Corrected import path
import { ContentCard } from "@/components/cards/ContentCard"
import { ContentCardList } from "@/components/cards/ContentCardList"

// NEW: This type now correctly matches the API's output
type RecommendedInstitutionData = {
  id: string;
  title: string;
  description: string;
  courseCount: number;
  enrolledCount: number;
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gradient: string;
};

export function MaterialsPage() {
  const [view, setView] = useState<"list" | "grid">("grid");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<IContent[]>([]);
  const [institutions, setInstitutions] = useState<RecommendedInstitutionData[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [coursesRes, institutionsRes] = await Promise.all([
          fetch("/api/recommendations"),
          fetch("/api/recommendations/institutions")
        ]);

        if (!coursesRes.ok || !institutionsRes.ok) {
          throw new Error("Failed to fetch required data");
        }

        const coursesData = await coursesRes.json();
        const institutionsData = await institutionsRes.json();
        
        setContent(Array.isArray(coursesData) ? coursesData : []);
        setInstitutions(Array.isArray(institutionsData) ? institutionsData : []);

      } catch (err) {
        console.error("Error fetching materials page data:", err);
        setError("Could not load materials. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const filteredContent = content.filter(item => {
    const { subject, difficulty } = filters as any;
    if (subject && item.tags && !item.tags.includes(subject)) return false;
    if (difficulty && item.difficulty !== difficulty.toLowerCase()) return false;
    return true;
  });
  

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-shadow tracking-tight">Courses</h1>

      <FilterControls
        onViewChange={setView}
        currentView={view}
        onFilterChange={setFilters}
        activeFilters={filters}
      />

      {institutions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {institutions.map((collection) => (
              <InstitutionCard
                key={collection.id}
                id={collection.id}
                title={collection.title}
                description={collection.description}
                courseCount={collection.courseCount}
                enrolledCount={collection.enrolledCount}
                estimatedTime={collection.estimatedTime}
                // FIXED: Pass the correct 'difficulty' string prop
                difficulty={collection.difficulty} 
                gradient={collection.gradient}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">All Courses</h2>
        {filteredContent.length > 0 ? (
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" : "space-y-2"}>
            {filteredContent.map((item, index) =>
                view === "grid" ? (
                  <ContentCard key={item._id} item={item} index={index} />
                ) : (
                  <ContentCardList key={item._id} item={item} index={index} />
                )
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>No courses match your current filters, or you may not be subscribed to any creators.</p>
          </div>
        )}
      </div>
    </div>
  )
}

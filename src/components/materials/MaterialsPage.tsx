"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import { FilterControls } from "./FilterControls";
import { InstitutionCard } from "../cards/InstitutionCard";
import { ContentCard } from "@/components/cards/ContentCard";
import { ContentCardList } from "@/components/cards/ContentCardList";

// This type now matches the enriched API response
type RecommendedContent = {
  _id: string;
  title: string;
  thumbnail: string;
  tags?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  performance?: {
    understandingLevel: 'needs-work' | 'foundational' | 'good' | 'mastered';
  };
  lastAccessedAt?: string | Date;
  createdBy: { // Changed to non-optional to match API
    _id: string;
    name: string;
  };
};

type RecommendedInstitutionData = {
  id: string;
  title: string;
  description: string;
  courseCount: number;
  enrolledCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  gradient: string;
};

const PAGE_SIZE = 20;

export function MaterialsPage() {
  const [view, setView] = useState<"list" | "grid">("grid");
  const [filters, setFilters] = useState({});
  
  // State for infinite scroll
  const [content, setContent] = useState<RecommendedContent[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true); // For initial page load
  const [loadingMore, setLoadingMore] = useState(false); // For subsequent page loads
  const [error, setError] = useState<string | null>(null);
  
  const [institutions, setInstitutions] = useState<RecommendedInstitutionData[]>([]);

  // Observer for infinite scroll
  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  // Function to fetch recommendations
  const fetchRecommendations = useCallback(async (pageNum: number) => {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      try {
          const res = await fetch(`/api/recommendations?page=${pageNum}&limit=${PAGE_SIZE}`);
          if (!res.ok) {
              throw new Error("Failed to fetch courses");
          }
          const newData = await res.json();
          
          setContent(prevContent => pageNum === 1 ? newData : [...prevContent, ...newData]);
          setHasMore(newData.length === PAGE_SIZE);

      } catch (err) {
          console.error("Error fetching recommendations:", err);
          setError("Could not load courses. Please try again.");
      } finally {
          if (pageNum === 1) setLoading(false);
          else setLoadingMore(false);
      }
  }, []);

  // Effect for initial data load (institutions + first page of content)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch institutions and first page of content in parallel
        const [institutionsRes] = await Promise.all([
          fetch("/api/recommendations/institutions"),
          fetchRecommendations(1) // This function handles its own state
        ]);

        if (!institutionsRes.ok) throw new Error("Failed to fetch institutions");
        const institutionsData = await institutionsRes.json();
        setInstitutions(Array.isArray(institutionsData) ? institutionsData : []);

      } catch (err) {
        console.error("Error fetching initial materials page data:", err);
        setError("Could not load all materials. Please try refreshing.");
      } finally {
        // The fetchRecommendations function sets its loading to false
      }
    };
    fetchInitialData();
  }, [fetchRecommendations]); // Only depends on the memoized fetch function

  // Effect for fetching subsequent pages
  useEffect(() => {
      if (page > 1) {
          fetchRecommendations(page);
      }
  }, [page, fetchRecommendations]);

  // Client-side filtering
  const filteredContent = content.filter(item => {
    const { subject, difficulty } = filters as any;
    if (subject && item.tags && !item.tags.includes(subject)) return false;
    if (difficulty && item.difficulty !== difficulty.toLowerCase()) return false;
    return true;
  });

  if (loading && page === 1) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        <p>Loading your personalized courses...</p>
      </div>
    );
  }

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
            {filteredContent.map((item, index) => {
                const card = view === "grid" 
                  ? <ContentCard key={item._id} item={item} index={index} />
                  : <ContentCardList key={item._id} item={item} index={index} />

                // If this is the last item, attach the ref to its container
                if (filteredContent.length === index + 1) {
                    return <div ref={lastElementRef} key={item._id}>{card}</div>
                } else {
                    return card;
                }
            })}
          </div>
        ) : (
          !loading && <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>No courses match your current filters, or you may not be subscribed to any creators.</p>
          </div>
        )}
      </div>

      {loadingMore && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <p>Loading more courses...</p>
        </div>
      )}

      {!hasMore && content.length > 0 && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <p>You've reached the end!</p>
        </div>
      )}
    </div>
  )
}

"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ContentRenderer } from "@/components/contentRender";
import { restoreHighlights } from "@/utils/restoreHighlight";
import { cn } from "@/lib/utils";

function ContentRendererWrapper() {
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const updateHistory = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/history?id=${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to update history");
        }
      } catch (error) {
        console.error("Error updating history:", error);
      }
    };

    if (isContentLoaded) {
      updateHistory();
    }
  }, [id, isContentLoaded]);

  useEffect(() => {
    if (id && isContentLoaded) {
      const applyHighlights = async () => {
        try {
          await restoreHighlights(id);
        } catch (error) {
          console.error("Error applying highlights:", error);
        }
      };

      const timer = setTimeout(() => {
        applyHighlights();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [id, isContentLoaded]);

  return (
    <ContentRenderer
      id={id || ""}
      onContentLoaded={() => setIsContentLoaded(true)}
    />
  );
}

export default function ContentPage() {
  const router = useRouter();
  // We'll get these values from a context provider in a real implementation
  // or pass them down as props from the parent component
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(true);

  // Monitor screen size and adjust sidebar states
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsSidebarOpen(!e.matches);
      setIsRecommendationOpen(!e.matches);
    };
    
    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col h-screen">
        {/* Main Content Area */}
        <div
          className={cn(
            "flex flex-1 min-h-0 transition-all duration-300",
            isSidebarOpen ? "md:ml-64" : "ml-0",
            isRecommendationOpen ? "md:mr-80" : "mr-0"
          )}
        >
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-4xl">
              <ContentRendererWrapper />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
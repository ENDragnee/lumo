"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ContentRenderer } from "@/components/contentRender";
import { restoreHighlights } from "@/utils/restoreHighlight";
import RecommendedContent from "./components/RecommendedContent";

function ContentRendererWrapper() {
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const updateHistory = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/history?id=${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to update history');
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
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col h-screen">
        {/* Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="p-4 border-b dark:border-gray-700 bg-white dark:bg-[#2b2d36]"
        >
          <div className="max-w-4xl mx-auto w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content..."
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </form>

        {/* Main Content Area */}
        <div className="flex flex-1 min-h-0"> {/* Add min-h-0 for proper flex child sizing */}
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 w-full">
            <div className="mx-auto max-w-4xl w-full"> {/* Wrap content in width-constrained div */}
              <ContentRendererWrapper />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 border-l dark:border-gray-700 overflow-y-auto bg-white dark:bg-[#2b2d36]">
            <RecommendedContent />
          </div>
        </div>
      </div>
    </Suspense>
  );
}

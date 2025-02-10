"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ContentRenderer } from "@/components/contentRender";
import { restoreHighlights } from "@/utils/restoreHighlight";

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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="px-6 sm:px-6 sm:text-xs md:text-base py-6 max-w-4xl mx-auto text-justify">
        <header className="p-4">
            <ContentRendererWrapper/>
        </header>
      </div>
    </Suspense>
  );
}

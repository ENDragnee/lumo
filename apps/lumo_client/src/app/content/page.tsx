"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ContentRenderer } from "@/components/contentRender";
import { restoreHighlights } from "@/utils/restoreHighlight";
import { QuizDisplay } from "@/components/QuizDisplay"; // Import the new component
import { Loader2 } from "lucide-react";
import { useInteractionTracker } from "@/app/hooks/useInteractionTracker";

// Helper component to manage contentId state from searchParams
function ContentPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // This is the contentId
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  useEffect(() => {
    // Reset content loaded state when ID changes
    setIsContentLoaded(false);
  }, [id]);

  // Effect for updating history
  useEffect(() => {
    const updateHistory = async () => {
      if (!id) return;
      console.log("Updating history for content ID:", id); // Debug log
      try {
        const response = await fetch(`/api/history?id=${id}`, { // Ensure this API exists and works
          method: "POST",
  headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to update history");
      } catch (error) {
        console.error("Error updating history:", error);
      }
    };

    if (isContentLoaded) {
      updateHistory();
    }
  }, [id, isContentLoaded]);

   // Effect for applying highlights
  useEffect(() => {
    if (id && isContentLoaded) {
      const applyHighlights = async () => {
        console.log("Applying highlights for content ID:", id); // Debug log
        try {
          await restoreHighlights(id);
        } catch (error) {
          console.error("Error applying highlights:", error);
        }
      };
      // Increased delay slightly to ensure content is fully rendered
      const timer = setTimeout(applyHighlights, 700);
      return () => clearTimeout(timer);
    }
  }, [id, isContentLoaded]);

  const handleContentLoaded = () => {
     console.log("Content loaded signal received for ID:", id); // Debug log
     setIsContentLoaded(true);
  }
  useInteractionTracker(id, isContentLoaded);

  return (
    <>
      <ContentRenderer
        id={id || ""}
        onContentLoaded={handleContentLoaded} // Pass the handler
      />
      {/* Conditionally render QuizDisplay only when content is loaded */}
      {isContentLoaded && id && (
          <div className="mt-6 md:mt-10"> {/* Add some spacing */}
              <QuizDisplay contentId={id} />
          </div>
      )}
      {!id && <div className="p-4 text-center text-muted-foreground">No content selected.</div>}
    </>
  );
}

export default function ContentPage() {
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <div className="mx-auto max-w-4xl h-full"> {/* Ensure content stays centered */}
        <ContentPageContent />
      </div>
    </Suspense>
  );
}

function PageLoadingSkeleton() {
    return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );
}

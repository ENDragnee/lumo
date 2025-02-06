"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ContentRenderer } from "@/components/contentRender";
import { restoreHighlights } from "@/utils/restoreHighlight";
import { string } from "slate";

function ContentRendererWrapper() {
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

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
        <header className="p-4 bg-white shadow-sm">
            <ContentRendererWrapper/>
        </header>
      </div>
    </Suspense>
  );
}

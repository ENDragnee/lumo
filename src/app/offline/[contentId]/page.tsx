// app/offline/[contentId]/page.tsx
import { Suspense } from "react";
import { OfflineContentViewer } from "@/components/offline/OfflineContentViewer"; // Adjust path if needed
import { Loader2 } from "lucide-react";

// A simple skeleton for the page itself while it loads
function PageSkeleton() {
    return (
        <div className="flex justify-center items-center h-full p-10">
            <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
        </div>
    );
}

// This is the main page component.
// It wraps the viewer in a Suspense boundary, which is good practice.
export default async function OfflineContentPage({ params }: { params: Promise<{contentId:string}>}) {
  const { contentId } = await params;

  return (
    // The Suspense boundary is useful for client components that might have their own data fetching
    // or lazy loading in the future.
    <Suspense fallback={<PageSkeleton />}>
      <div className="mx-auto max-w-4xl h-full py-8">
        {/* We pass the contentId from the URL directly to our viewer component */}
        <OfflineContentViewer contentId={contentId} />
      </div>
    </Suspense>
  );
}

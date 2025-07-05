// /app/learn/[contentId]/page.tsx (or wherever your page is)
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import mongoose from "mongoose";

// --- New Imports ---
import Content, { IContent } from "@/models/Content";
import connectDB from "@/lib/mongodb";
import { loadStaticComponent } from "@/lib/staticContentLoader";
import { ContentHeader } from "@/components/cards/ContentHeader"; // Reusable header
import { DynamicContentViewer } from "@/components/viewers/DynamicContentViewer"; // Refactored dynamic viewer

// --- Existing Imports ---
import { QuizDisplay } from "@/components/QuizDisplay";
import { ContentEffects } from "@/components/ContentEffects";
import { updateHistory } from "@/lib/actions/history";

type ContentPageProps = {
  params: Promise<{
    contentId: string;
  }>;
};

// --- DATA FETCHER ---
// It's a good practice to separate data fetching logic.
async function getContent(id: string): Promise<IContent | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  await connectDB();
  // Using .lean() is more performant for read-only operations
  const content = await Content.findById(id).lean();
  if (!content) {
    return null;
  }
  // Mongoose .lean() returns plain JS objects, need to stringify/parse for serialization
  return JSON.parse(JSON.stringify(content));
}


// The main page is now a smart router for content types.
export default async function ContentPage({ params }: ContentPageProps) {
  const { contentId } = await params;

  if (!contentId) {
    return <div className="p-4 text-center text-muted-foreground">No content selected.</div>;
  }

  // --- Server-Side Logic ---
  const content = await getContent(contentId);
  
  if (!content) {
    return <div className="p-4 text-center text-destructive">Content not found.</div>;
  }

  // We can update history regardless of content type
  try {
    await updateHistory(contentId);
  } catch (error) {
    console.error("Failed to update history:", error);
  }

  // --- Conditional Rendering Logic ---
  let ContentBody: React.ReactNode;

  if (content.contentType === 'static') {
    const StaticComponent = loadStaticComponent(content.data);
    ContentBody = StaticComponent 
      ? <StaticComponent /> 
      : <div className="p-4 text-center text-destructive">Static content component '{content.data}' not found. Please check the registry.</div>;
  } else {
    // For 'dynamic' content, pass the data to the CraftJsViewer
    ContentBody = <DynamicContentViewer data={content.data} />;
  }

  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <div className="space-y-6">
        {/* The Header is now common for both types */}
        <ContentHeader content={content} />
        <div id = "content" className="h-full w-full space-y-6">
          {ContentBody}
        </div>
        <div className="mt-6 md:mt-10">
          <QuizDisplay contentId={contentId} />
        </div>
      </div>
      
      <ContentEffects contentId={contentId} />
    </Suspense>
  );
}

function PageLoadingSkeleton() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
    </div>
  );
}

// /app/content/[contentId]/page.tsx
import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import mongoose from "mongoose";

import Content, { IContent } from "@/models/Content";
import connectDB from "@/lib/mongodb";
import { loadStaticComponent } from "@/lib/staticContentLoader";
import { ContentHeader } from "@/components/cards/ContentHeader";
import { DynamicContentViewer } from "@/components/viewers/DynamicContentViewer";
import { QuizDisplay } from "@/components/QuizDisplay";
import { getLastPosition } from "@/app/actions/interaction";
import { ContentClientWrapper } from "@/components/ContentClientWrapper"; // Import the new wrapper

type ContentPageProps = {
  params: Promise<{
    contentId: string;
  }>;
};

async function getContent(id: string): Promise<IContent | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const content = await Content.findById(id).lean();
  if (!content) return null;
  return JSON.parse(JSON.stringify(content));
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { contentId } = await params;

  if (!contentId) {
    return <div className="p-4 text-center">No content selected.</div>;
  }

  // --- 1. DATA FETCHING (on the server) ---
  const [content, lastKnownPosition] = await Promise.all([
    getContent(contentId),
    getLastPosition(contentId)
  ]);
  
  if (!content) {
    return <div className="p-4 text-center text-destructive">Content not found.</div>;
  }

  // --- 2. SERVER-SIDE RENDERING OF HEAVY CONTENT ---
  const ContentBody = content.contentType === 'static'
    ? loadStaticComponent(content.data) ? React.createElement(loadStaticComponent(content.data)!) : <div>Static content component not found.</div>
    : <DynamicContentViewer data={content.data} />;

  // --- 3. DELEGATING TO THE CLIENT WRAPPER ---
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
        <ContentClientWrapper contentId={contentId} lastKnownPosition={lastKnownPosition}>
            {/* Everything inside the wrapper is its `children` prop, rendered on the server */}
            <div id="content-container" className="h-[calc(100vh-4rem-6px)] overflow-y-auto px-4 md:px-6 lg:px-8">
                <div className="mx-auto max-w-full py-8 space-y-6">
                    <ContentHeader content={content} />
                    <div>{ContentBody}</div>
                    {
                      content.contentType === 'dynamic' && (
                      <div className="mt-10">
                          <QuizDisplay contentId={contentId} />
                      </div>
                      )
                    }
                </div>
            </div>
        </ContentClientWrapper>
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

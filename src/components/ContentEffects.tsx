"use client";

import { useEffect } from "react";
import { useInteractionTracker } from "@/app/hooks/useInteractionTracker";
import { restoreHighlights } from "@/utils/restoreHighlight";
import { ContextMenu } from "./context-menu";

/**
 * A client component responsible for running browser-only side effects
 * for the content page. It does not render any UI itself.
 *
 * @param {string} contentId - The ID of the currently viewed content.
 */
export function ContentEffects({ contentId }: { contentId: string }) {
  // This hook tracks user interactions (scrolling, etc.) and must run on the client.
  // The `isContentLoaded` state is no longer needed because this component only
  // mounts after the server has already rendered the content.
  useInteractionTracker(contentId, true);
  
  useEffect(() => {
    // We check for contentId to ensure we don't run this without a valid target.
    // This prevents API calls on pages where contentId might be undefined.
    if (contentId) {
      console.log(`Client Effects: Triggering highlight restoration for contentId: ${contentId}`);
      
      // The `restoreHighlights` function is async, but we don't need to `await` it
      // inside a useEffect hook. It can run in the background. React does not
      // expect the useEffect callback to return a Promise.
      restoreHighlights(contentId);
    }
  }, [contentId]);

  return <ContextMenu contentId={contentId} />;
}

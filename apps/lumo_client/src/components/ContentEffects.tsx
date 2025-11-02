// /components/ContentEffects.tsx
"use client";

import { useEffect, useRef } from "react";
import { restoreHighlights } from "@/utils/restoreHighlight";
import { ContextMenu } from "./context-menu";

interface ContentEffectsProps {
    contentId: string;
    currentPosition: number; // Receive the live position as a prop
}

export function ContentEffects({ contentId, currentPosition }: ContentEffectsProps) {
  const sessionIdRef = useRef<string | null>(null);
  // This ref stores the latest position without causing the main effect to re-run.
  const positionRef = useRef(currentPosition);

  // This lightweight effect keeps the ref synchronized with the prop from the parent.
  useEffect(() => {
      positionRef.current = currentPosition;
  }, [currentPosition]);

  // This main effect runs only ONCE per contentId to set up/tear down listeners.
  useEffect(() => {
    if (!contentId) return;

    sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // The 'start' event correctly uses the initial position.
    const startPayload = {
        eventType: 'start' as const,
        sessionId: sessionIdRef.current,
        contentId: contentId,
        position: positionRef.current,
    };

    fetch('/api/interactions/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(startPayload),
      keepalive: true,
    }).catch(err => console.error("[Effects] 'start' event failed:", err));

    const handleEndEvent = () => {
      if (!sessionIdRef.current) return;
      
      const endPayload = {
        eventType: 'end' as const,
        sessionId: sessionIdRef.current,
        contentId: contentId,
        // The 'end' event correctly uses the ref to get the LATEST position.
        position: positionRef.current, 
      };
      
      const blob = new Blob([JSON.stringify(endPayload)], { type: 'application/json' });
      navigator.sendBeacon('/api/interactions/events', blob);
      
      sessionIdRef.current = null;
    };
    
    const visibilityChangeHandler = () => {
        if (document.visibilityState === 'hidden') {
            handleEndEvent();
        }
    };
    window.addEventListener('visibilitychange', visibilityChangeHandler);

    // Cleanup function ensures the 'end' event is sent when navigating away.
    return () => {
      handleEndEvent();
      window.removeEventListener('visibilitychange', visibilityChangeHandler);
    };
  }, [contentId]);

  // Unrelated effect for highlights.
  useEffect(() => {
    if (contentId) {
      restoreHighlights(contentId);
    }
  }, [contentId]);

  // This component renders UI for the context menu, but not for tracking.
  return <ContextMenu contentId={contentId} />;
}

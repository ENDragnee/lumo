// hooks/useInteractionTracker.ts
"use client";

import { useEffect, useRef } from 'react';

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export function useInteractionTracker(contentId: string | null, isReady: boolean) {
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    // --- DEBUG LOG 1 ---
    console.log(`[Tracker] Hook evaluated. contentId: ${contentId}, isReady: ${isReady}`);

    if (!contentId || !isReady) {
      return;
    }

    sessionIdRef.current = generateSessionId();
    const payload = {
        eventType: 'start' as const, // Use 'as const' for type safety
        sessionId: sessionIdRef.current,
        contentId: contentId,
    };
    
    // --- DEBUG LOG 2 ---
    console.log(`[Tracker] START event triggered. Sending payload:`, payload);

    fetch('/api/interactions/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(err => console.error("[Tracker] 'start' event fetch failed:", err));

    const handleEndEvent = () => {
      if (!sessionIdRef.current) return;
      
      const endPayload = {
        eventType: 'end' as const,
        sessionId: sessionIdRef.current,
        contentId: contentId,
      };

      // --- DEBUG LOG 3 ---
      console.log(`[Tracker] END event triggered. Sending payload with Beacon:`, endPayload);
      
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

    return () => {
      // --- DEBUG LOG 4 ---
      console.log(`[Tracker] Cleanup function running for contentId: ${contentId}`);
      handleEndEvent();
      window.removeEventListener('visibilitychange', visibilityChangeHandler);
    };

  }, [contentId, isReady]);
}

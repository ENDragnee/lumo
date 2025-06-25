// hooks/useInteractionTracker.ts
"use client";

import { useEffect, useRef } from 'react';

// A simple utility to generate a unique ID for the session
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

/**
 * A custom hook to track user interaction time on a specific piece of content.
 * It sends 'start' and 'end' events to the interaction tracking API.
 * @param contentId The ID of the content being viewed.
 * @param isReady A boolean flag to indicate if tracking should start (e.g., after content has loaded).
 */
export function useInteractionTracker(contentId: string | null, isReady: boolean) {
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Only start tracking if we have a contentId and the component is ready
    if (!contentId || !isReady) {
      return;
    }

    // 1. Generate a unique ID for this viewing session
    sessionIdRef.current = generateSessionId();
    console.log(`Tracking START for content: ${contentId}, session: ${sessionIdRef.current}`);

    // 2. Send the 'start' event to our API
    fetch('/api/interactions/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'start',
        sessionId: sessionIdRef.current,
        contentId: contentId,
        // You could add startProgress here if you have that data
      }),
      keepalive: true, // Important for reliability on page changes
    }).catch(err => console.error("Failed to send 'start' event:", err));


    // 3. Define the 'end' event handler for when the component unmounts
    const handleEndEvent = () => {
      if (!sessionIdRef.current) return;
      
      console.log(`Tracking END for content: ${contentId}, session: ${sessionIdRef.current}`);
      
      // Use navigator.sendBeacon for maximum reliability when a page is closing.
      // It's a fire-and-forget request that the browser guarantees it will try to send.
      const payload = {
        eventType: 'end',
        sessionId: sessionIdRef.current,
        contentId: contentId,
        // You could get the final progress from a state management library (like Zustand or Redux)
        // and include it here as 'endProgress'.
      };
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/interactions/events', blob);
      
      // Clear the ref after sending
      sessionIdRef.current = null;
    };
    
    // 4. Attach the 'end' event handler to the page visibility change event.
    // This is more reliable than just the component unmount, as it catches browser tab closing.
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            handleEndEvent();
        }
    });

    // The return function from useEffect is the cleanup function.
    // It runs when the component unmounts (e.g., the user navigates to a different contentId).
    return () => {
      handleEndEvent();
    };

  }, [contentId, isReady]); // The effect re-runs if the contentId or ready state changes.
}

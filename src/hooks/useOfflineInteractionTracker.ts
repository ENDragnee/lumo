"use client";

import { useEffect, useRef } from "react";
import { useOfflineSync } from "./useOfflineSync";
import { IOfflinePackage } from "@/types/offline-package";

// The minimum duration in seconds for an interaction to be considered "trackable"
const MINIMUM_TRACKING_DURATION_SEC = 10;

/**
 * A custom hook to track viewing duration for offline content.
 * When the component unmounts, it calculates the duration and queues
 * the interaction for syncing with the server when back online.
 * 
 * @param pkg The offline content package being viewed. The hook is only active when this is not null.
 */
export function useOfflineInteractionTracker(pkg: IOfflinePackage | null) {
  // Get the function we need to queue our data from the main sync hook
  const { addToSyncQueue } = useOfflineSync();

  // useRef is used to store the start time. It persists across re-renders
  // without triggering the effect again, which is exactly what we want.
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // --- GATEKEEPER ---
    // The hook's logic only runs if we have a valid package and the queuing function is available.
    if (!pkg || !addToSyncQueue) {
      return;
    }

    // --- SESSION START ---
    // When the effect runs for a new package, record the start time.
    startTimeRef.current = Date.now();
    console.log(`[OfflineTracker] START tracking for content: "${pkg.content.title}"`);

    // The cleanup function is the core of this hook.
    // It runs when the component unmounts (e.g., the user navigates away).
    return () => {
      // Ensure we have a start time to compare against.
      if (!startTimeRef.current) {
        console.log("[OfflineTracker] END event, but no start time was recorded. Skipping.");
        return;
      }

      // --- SESSION END & DATA CAPTURE ---
      const endTime = Date.now();
      const durationSeconds = Math.round((endTime - startTimeRef.current) / 1000);

      console.log(`[OfflineTracker] END tracking for content: "${pkg.content.title}". Duration: ${durationSeconds}s`);

      // Only queue meaningful interactions.
      if (durationSeconds < MINIMUM_TRACKING_DURATION_SEC) {
        console.log(`[OfflineTracker] Session too short. Discarding interaction.`);
        return;
      }

      // Create a unique session ID for this specific viewing instance.
      const sessionId = `offline_${pkg.contentId}_${startTimeRef.current}`;
      
      console.log(`[OfflineTracker] Queuing interaction for sync with session ID: ${sessionId}`);

      // Add the captured data to the sync queue via the main hook's function.
      addToSyncQueue({
        type: "interaction",
        payload: {
          contentId: pkg.contentId,
          sessionId: sessionId,
          durationSeconds: durationSeconds,
        },
      });

      // Reset the start time ref for safety.
      startTimeRef.current = null;
    };
  }, [pkg, addToSyncQueue]); // The effect re-runs only if the package or the function changes.
}

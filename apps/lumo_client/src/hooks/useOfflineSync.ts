"use client"

import { useState, useEffect, useCallback } from "react";
import { openDB, type IDBPDatabase } from 'idb';
import { IOfflineManifest, IOfflinePackage } from "@/types/offline-package"; // Adjust path to your types

// --- TYPE DEFINITIONS ---
export interface ISyncQueueItem {
  id: string; 
  type: "interaction"; // For now, we only sync interactions
  payload: {
    contentId: string;
    sessionId: string;
    durationSeconds: number;
    // We can add start/end progress later if needed
  };
  timestamp: string;
  retryCount: number;
}

export interface IOfflineStats {
  storageUsed: number;
  totalDownloaded: number;
  storageLimit: number;
  lastSyncTime: string | null;
}

// --- CONSTANTS ---
const DB_NAME = 'LumoOfflineDB';
const DB_VERSION = 1; // Increment this if you change the DB schema
const MANIFEST_KEY = 'main_manifest';
const STORAGE_LIMIT = 5 * 1024 * 1024 * 1024; // 5GB

// --- HOOK IMPLEMENTATION ---
export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [db, setDb] = useState<IDBPDatabase | null>(null);
  const [manifest, setManifest] = useState<IOfflineManifest | null>(null);
  const [syncQueue, setSyncQueue] = useState<ISyncQueueItem[]>([]);
  const [stats, setStats] = useState<IOfflineStats>({
    storageUsed: 0,
    totalDownloaded: 0,
    storageLimit: STORAGE_LIMIT,
    lastSyncTime: null,
  });
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [updatesAvailable, setUpdatesAvailable] = useState<Map<string, boolean>>(new Map());

  // --- INITIALIZATION ---
  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await openDB(DB_NAME, DB_VERSION, {
          upgrade(db) {
            if (!db.objectStoreNames.contains('manifest')) {
              db.createObjectStore('manifest');
            }
            if (!db.objectStoreNames.contains('packages')) {
              db.createObjectStore('packages', { keyPath: 'contentId' });
            }
            if (!db.objectStoreNames.contains('sync-queue')) {
              db.createObjectStore('sync-queue', { keyPath: 'id' });
            }
          },
        });
        setDb(database);
      } catch (error) {
        console.error("Failed to initialize IndexedDB:", error);
      }
    };
    initDB();

    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // --- DATA LOADING & SYNCING ---
  const loadDataFromDB = useCallback(async () => {
    if (!db) return;
    try {
      const manifestData = await db.get('manifest', MANIFEST_KEY);
      const queueData = await db.getAll('sync-queue');
      
      const loadedManifest: IOfflineManifest = manifestData || { version: 1, downloaded: {} };
      setManifest(loadedManifest);
      setSyncQueue(queueData);
      
      // FIX: Correctly type the 'meta' object during the reduce operation.
      const totalSize = Object.values(loadedManifest.downloaded).reduce((sum, meta) => {
        // We assert the type of meta here so TypeScript knows it has a sizeInBytes property.
        const itemMeta = meta as IOfflineManifest['downloaded'][string];
        return sum + (itemMeta.sizeInBytes || 0);
      }, 0);

      // Now that totalSize is guaranteed to be a number, this setState call is valid.
      setStats(prev => ({ ...prev, storageUsed: totalSize }));
      
    } catch (error) {
      console.error("Failed to load data from IndexedDB:", error);
    }
  }, [db]);

  useEffect(() => {
    if (db) {
      loadDataFromDB();
    }
  }, [db, loadDataFromDB]);

  // This logic is now handled by the other useEffect
  // useEffect(() => {
  //   if (isOnline && syncQueue.length > 0) {
  //     syncPendingChanges();
  //   }
  // }, [isOnline, syncQueue.length, syncPendingChanges]); // Added syncPendingChanges to dependency array

  // --- CORE FUNCTIONS ---

  const downloadContent = useCallback(async (contentId: string) => {
    if (!db || !isOnline) return;

    try {
      setDownloadProgress(prev => ({ ...prev, [contentId]: 0 }));
      
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => ({ ...prev, [contentId]: Math.min((prev[contentId] || 0) + 10, 90)}));
      }, 100);

      const response = await fetch(`/api/offline/package/${contentId}`);
      if (!response.ok) throw new Error("Failed to fetch content package from server.");
      const pkg: IOfflinePackage = await response.json();
      const pkgString = JSON.stringify(pkg);
      const sizeInBytes = new Blob([pkgString]).size;

      clearInterval(progressInterval);
      setDownloadProgress(prev => ({ ...prev, [contentId]: 100 }));
      
      const tx = db.transaction(['packages', 'manifest'], 'readwrite');
      await tx.objectStore('packages').put(pkg);
      
      const currentManifest: IOfflineManifest = (await tx.objectStore('manifest').get(MANIFEST_KEY)) || { version: 1, downloaded: {} };
      
      // If we are re-downloading/updating, subtract the old size first.
      const oldSize = currentManifest.downloaded[contentId]?.sizeInBytes || 0;

      currentManifest.downloaded[contentId] = {
        version: pkg.version,
        downloadedAt: new Date().toISOString(),
        title: pkg.content.title,
        subject: pkg.content.tags?.[0],
        sizeInBytes: sizeInBytes,
      };

      await tx.objectStore('manifest').put(currentManifest, MANIFEST_KEY);
      await tx.done;

      setManifest(currentManifest);
      setUpdatesAvailable(prev => {
          const newMap = new Map(prev);
          newMap.set(contentId, false);
          return newMap;
      });
      setStats(prev => ({ ...prev, storageUsed: prev.storageUsed - oldSize + sizeInBytes }));

    } catch (error) {
      console.error(`Download failed for ${contentId}:`, error);
    } finally {
      setTimeout(() => {
        setDownloadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[contentId];
          return newProgress;
        });
      }, 1000);
    }
  }, [db, isOnline]);

  const removeContent = useCallback(async (contentId: string) => {
    if (!db) return;
    try {
        const tx = db.transaction(['packages', 'manifest'], 'readwrite');
        await tx.objectStore('packages').delete(contentId);

        const currentManifest: IOfflineManifest = (await tx.objectStore('manifest').get(MANIFEST_KEY));
        if (currentManifest && currentManifest.downloaded[contentId]) {
            const removedSize = currentManifest.downloaded[contentId].sizeInBytes;
            delete currentManifest.downloaded[contentId];
            await tx.objectStore('manifest').put(currentManifest, MANIFEST_KEY);
            setManifest(currentManifest);
            setStats(prev => ({...prev, storageUsed: Math.max(0, prev.storageUsed - removedSize)}));
        }
        await tx.done;
    } catch (error) {
        console.error(`Failed to remove content ${contentId}:`, error);
    }
  }, [db]);
  
  const checkForUpdates = useCallback(async () => {
    if (!db || !isOnline || !manifest || Object.keys(manifest.downloaded).length === 0) return;
    
    setIsCheckingForUpdates(true);
    try {
        const versionsToCheck = Object.entries(manifest.downloaded).reduce((acc, [id, meta]) => {
            acc[id] = meta.version;
            return acc;
        }, {} as Record<string, number>);

        const response = await fetch('/api/offline/check-versions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contentVersions: versionsToCheck }),
        });
        if (!response.ok) throw new Error("Failed to check versions.");
        
        const { updatesNeeded } = await response.json() as { updatesNeeded: string[] };

        const newUpdates = new Map<string, boolean>();
        Object.keys(manifest.downloaded).forEach(id => {
            newUpdates.set(id, updatesNeeded.includes(id));
        });
        setUpdatesAvailable(newUpdates);
        
    } catch (error) {
        console.error("Failed to check for updates:", error);
    } finally {
        setIsCheckingForUpdates(false);
    }
  }, [db, isOnline, manifest]);

  const getContent = useCallback(async (contentId: string): Promise<IOfflinePackage | null> => {
    if (!db || !contentId) return null;
    try {
        return await db.get('packages', contentId) || null;
    } catch (error) {
        console.error(`Failed to get content ${contentId} from DB:`, error);
        return null;
    }
  }, [db]);
  
  const addToSyncQueue = useCallback(async (item: Omit<ISyncQueueItem, 'id' | 'timestamp' | 'retryCount'>) => {
    if (!db) return;
    
    const syncItem: ISyncQueueItem = {
      ...item,
      id: `${item.type}_${item.payload.sessionId}`,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };

    try {
        await db.put('sync-queue', syncItem);
        // Update state to reflect the new queue item immediately
        setSyncQueue(prev => [...prev, syncItem]);
    } catch (error) {
        console.error("Failed to add item to sync queue:", error);
    }
  }, [db]);

  const syncPendingChanges = useCallback(async () => {
    // This function now re-downloads all content saved in the local database.
    if (!db || !isOnline || !manifest || isSyncing) {
      return;
    }

    const contentIds = Object.keys(manifest.downloaded);
    if (contentIds.length === 0) {
      console.log("No downloaded content to sync/re-download.");
      return;
    }

    setIsSyncing(true);
    try {
      console.log(`Starting re-download of all ${contentIds.length} items.`);
      
      // Sequentially call downloadContent for each item.
      // This function already handles fetching, saving, and progress updates.
      for (const contentId of contentIds) {
        await downloadContent(contentId);
      }
      
      console.log("Finished re-downloading all items.");
      setStats(prev => ({ ...prev, lastSyncTime: new Date().toISOString() }));
    } catch (error) {
      console.error("An error occurred during bulk re-download:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [db, isOnline, manifest, isSyncing, downloadContent]);

  return {
    isOnline,
    manifest,
    syncQueue,
    isSyncing,
    downloadProgress,
    stats,
    downloadContent,
    removeContent,
    checkForUpdates,
    isCheckingForUpdates,
    updatesAvailable,
    syncPendingChanges,
    getContent,
    addToSyncQueue,
  };
}

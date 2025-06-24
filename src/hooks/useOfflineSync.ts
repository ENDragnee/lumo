"use client"

import { useState, useEffect, useCallback } from "react"

export interface OfflineContent {
  id: string
  type: "course" | "material" | "video" | "quiz" | "assignment"
  title: string
  subject: string
  size: number // in bytes
  downloadedAt: Date
  lastAccessed: Date
  expiresAt?: Date
  metadata: {
    duration?: number
    pages?: number
    questions?: number
    difficulty?: string
  }
  content: any // The actual content data
  progress?: {
    completed: boolean
    percentage: number
    timeSpent: number
    lastPosition?: number
  }
}

export interface SyncQueueItem {
  id: string
  type: "progress" | "completion" | "note" | "bookmark" | "quiz_result"
  action: "create" | "update" | "delete"
  data: any
  timestamp: Date
  retryCount: number
}

export interface OfflineStats {
  totalDownloaded: number
  totalSize: number
  lastSyncTime: Date | null
  pendingSyncItems: number
  storageUsed: number
  storageLimit: number
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [downloadedContent, setDownloadedContent] = useState<OfflineContent[]>([])
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({})
  const [stats, setStats] = useState<OfflineStats>({
    totalDownloaded: 0,
    totalSize: 0,
    lastSyncTime: null,
    pendingSyncItems: 0,
    storageUsed: 0,
    storageLimit: 5 * 1024 * 1024 * 1024, // 5GB default
  })

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Auto-sync when coming back online
      syncPendingChanges()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Load offline data from IndexedDB on mount
  useEffect(() => {
    loadOfflineData()
    loadSyncQueue()
    calculateStats()
  }, [])

  // Simulate IndexedDB operations
  const loadOfflineData = useCallback(async () => {
    try {
      // In a real app, this would load from IndexedDB
      const stored = localStorage.getItem("offline_content")
      if (stored) {
        const content = JSON.parse(stored).map((item: any) => ({
          ...item,
          downloadedAt: new Date(item.downloadedAt),
          lastAccessed: new Date(item.lastAccessed),
          expiresAt: item.expiresAt ? new Date(item.expiresAt) : undefined,
        }))
        setDownloadedContent(content)
      }
    } catch (error) {
      console.error("Failed to load offline data:", error)
    }
  }, [])

  const loadSyncQueue = useCallback(async () => {
    try {
      const stored = localStorage.getItem("sync_queue")
      if (stored) {
        const queue = JSON.parse(stored).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
        setSyncQueue(queue)
      }
    } catch (error) {
      console.error("Failed to load sync queue:", error)
    }
  }, [])

  const saveOfflineData = useCallback(async (content: OfflineContent[]) => {
    try {
      localStorage.setItem("offline_content", JSON.stringify(content))
      setDownloadedContent(content)
      calculateStats()
    } catch (error) {
      console.error("Failed to save offline data:", error)
    }
  }, [])

  const saveSyncQueue = useCallback(async (queue: SyncQueueItem[]) => {
    try {
      localStorage.setItem("sync_queue", JSON.stringify(queue))
      setSyncQueue(queue)
    } catch (error) {
      console.error("Failed to save sync queue:", error)
    }
  }, [])

  // Download content for offline access
  const downloadContent = useCallback(
    async (contentId: string, contentType: "course" | "material" | "video" | "quiz" | "assignment") => {
      try {
        setDownloadProgress((prev) => ({ ...prev, [contentId]: 0 }))

        // Simulate download progress
        const simulateDownload = () => {
          return new Promise<OfflineContent>((resolve) => {
            let progress = 0
            const interval = setInterval(() => {
              progress += Math.random() * 20
              if (progress >= 100) {
                progress = 100
                clearInterval(interval)

                // Mock content data
                const mockContent: OfflineContent = {
                  id: contentId,
                  type: contentType,
                  title: `${contentType === "course" ? "Course" : "Material"}: ${contentId}`,
                  subject: "Physics",
                  size: Math.floor(Math.random() * 100000000) + 10000000, // 10-110MB
                  downloadedAt: new Date(),
                  lastAccessed: new Date(),
                  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                  metadata: {
                    duration: contentType === "video" ? Math.floor(Math.random() * 3600) + 600 : undefined,
                    pages: contentType === "material" ? Math.floor(Math.random() * 50) + 10 : undefined,
                    questions: contentType === "quiz" ? Math.floor(Math.random() * 20) + 5 : undefined,
                    difficulty: ["easy", "medium", "hard"][Math.floor(Math.random() * 3)],
                  },
                  content: {
                    // Mock content structure
                    chapters:
                      contentType === "course" ? Array.from({ length: 5 }, (_, i) => `Chapter ${i + 1}`) : undefined,
                    videoUrl: contentType === "video" ? `offline://video_${contentId}` : undefined,
                    text: contentType === "material" ? `Offline content for ${contentId}` : undefined,
                  },
                  progress: {
                    completed: false,
                    percentage: 0,
                    timeSpent: 0,
                  },
                }

                resolve(mockContent)
              }
              setDownloadProgress((prev) => ({ ...prev, [contentId]: Math.min(progress, 100) }))
            }, 100)
          })
        }

        const content = await simulateDownload()
        const updatedContent = [...downloadedContent, content]
        await saveOfflineData(updatedContent)

        setDownloadProgress((prev) => {
          const newProgress = { ...prev }
          delete newProgress[contentId]
          return newProgress
        })

        return content
      } catch (error) {
        console.error("Download failed:", error)
        setDownloadProgress((prev) => {
          const newProgress = { ...prev }
          delete newProgress[contentId]
          return newProgress
        })
        throw error
      }
    },
    [downloadedContent, saveOfflineData],
  )

  // Remove downloaded content
  const removeContent = useCallback(
    async (contentId: string) => {
      const updatedContent = downloadedContent.filter((item) => item.id !== contentId)
      await saveOfflineData(updatedContent)
    },
    [downloadedContent, saveOfflineData],
  )

  // Update progress offline
  const updateProgress = useCallback(
    async (contentId: string, progress: Partial<OfflineContent["progress"]>) => {
      // Update local content
      const updatedContent = downloadedContent.map((item) =>
        // Ensure we only update the correct item AND that it has a progress object to update
        item.id === contentId && item.progress
          ? {
              ...item,
              // The spread of a Partial type causes TS to infer a wider type (e.g., `boolean | undefined`).
              // We assert the correct type because we've guarded against `item.progress` being null
              // and know the base object provides all required properties.
              progress: {
                ...item.progress,
                ...progress,
              } as NonNullable<OfflineContent["progress"]>,
              lastAccessed: new Date(),
            }
          : item,
      )
      await saveOfflineData(updatedContent)

      // Add to sync queue
      const syncItem: SyncQueueItem = {
        id: `progress_${contentId}_${Date.now()}`,
        type: "progress",
        action: "update",
        data: { contentId, progress },
        timestamp: new Date(),
        retryCount: 0,
      }

      const updatedQueue = [...syncQueue, syncItem]
      await saveSyncQueue(updatedQueue)
    },
    [downloadedContent, syncQueue, saveOfflineData, saveSyncQueue],
  )

  // Add item to sync queue
  const addToSyncQueue = useCallback(
    async (item: Omit<SyncQueueItem, "id" | "timestamp" | "retryCount">) => {
      const syncItem: SyncQueueItem = {
        ...item,
        id: `${item.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        retryCount: 0,
      }

      const updatedQueue = [...syncQueue, syncItem]
      await saveSyncQueue(updatedQueue)
    },
    [syncQueue, saveSyncQueue],
  )

  // Sync pending changes when online
  const syncPendingChanges = useCallback(async () => {
    if (!isOnline || isSyncing || syncQueue.length === 0) return

    setIsSyncing(true)
    try {
      // Process sync queue
      const successfulSyncs: string[] = []

      for (const item of syncQueue) {
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500))

          console.log(`Synced ${item.type}:`, item.data)
          successfulSyncs.push(item.id)
        } catch (error) {
          console.error(`Failed to sync ${item.type}:`, error)
          // Increment retry count
          item.retryCount++
        }
      }

      // Remove successfully synced items
      const remainingQueue = syncQueue.filter((item) => !successfulSyncs.includes(item.id))
      await saveSyncQueue(remainingQueue)

      // Update last sync time
      setStats((prev) => ({
        ...prev,
        lastSyncTime: new Date(),
        pendingSyncItems: remainingQueue.length,
      }))
    } catch (error) {
      console.error("Sync failed:", error)
    } finally {
      setIsSyncing(false)
    }
  }, [isOnline, isSyncing, syncQueue, saveSyncQueue])

  // Calculate storage stats
  const calculateStats = useCallback(() => {
    const totalSize = downloadedContent.reduce((sum, item) => sum + item.size, 0)
    const storageUsed = totalSize
    const storageLimit = 5 * 1024 * 1024 * 1024 // 5GB

    setStats((prev) => ({
      ...prev,
      totalDownloaded: downloadedContent.length,
      totalSize,
      storageUsed,
      storageLimit,
      pendingSyncItems: syncQueue.length,
    }))
  }, [downloadedContent, syncQueue])

  // Get content by ID
  const getContent = useCallback(
    (contentId: string) => {
      return downloadedContent.find((item) => item.id === contentId)
    },
    [downloadedContent],
  )

  // Check if content is available offline
  const isContentAvailable = useCallback(
    (contentId: string) => {
      return downloadedContent.some((item) => item.id === contentId)
    },
    [downloadedContent],
  )

  // Clean up expired content
  const cleanupExpiredContent = useCallback(async () => {
    const now = new Date()
    const validContent = downloadedContent.filter((item) => !item.expiresAt || item.expiresAt > now)

    if (validContent.length !== downloadedContent.length) {
      await saveOfflineData(validContent)
    }
  }, [downloadedContent, saveOfflineData])

  // Auto-cleanup on mount and periodically
  useEffect(() => {
    cleanupExpiredContent()
    const interval = setInterval(cleanupExpiredContent, 60 * 60 * 1000) // Every hour
    return () => clearInterval(interval)
  }, [cleanupExpiredContent])

  return {
    isOnline,
    downloadedContent,
    syncQueue,
    isSyncing,
    downloadProgress,
    stats,
    downloadContent,
    removeContent,
    updateProgress,
    addToSyncQueue,
    syncPendingChanges,
    getContent,
    isContentAvailable,
    cleanupExpiredContent,
  }
}

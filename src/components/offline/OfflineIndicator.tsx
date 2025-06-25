"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, FolderSyncIcon as Sync, AlertCircle } from "lucide-react"
import { useOfflineSync } from "../../hooks/useOfflineSync"

export function OfflineIndicator() {
  const [isMounted, setIsMounted] = useState(false)
  const { isOnline, syncQueue, isSyncing, syncPendingChanges } = useOfflineSync()
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      {/* Connection Status */}
      <Badge
        variant={isOnline ? "default" : "destructive"}
        className={`flex items-center gap-1 ${isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
        {isOnline ? "Online" : "Offline"}
      </Badge>

      {/* Sync Status */}
      {syncQueue.length > 0 && (
        <Badge
          variant="outline"
          className="flex items-center gap-1 bg-yellow-50 text-yellow-800 border-yellow-200 cursor-pointer"
          onClick={() => setShowDetails(!showDetails)}
        >
          <Sync className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
          {syncQueue.length} pending
        </Badge>
      )}

      {/* Quick Sync Button */}
      {isOnline && syncQueue.length > 0 && (
        <Button
          size="sm"
          variant="ghost"
          onClick={syncPendingChanges}
          disabled={isSyncing}
          className="h-6 px-2 text-xs"
        >
          <Sync className={`w-3 h-3 mr-1 ${isSyncing ? "animate-spin" : ""}`} />
          Sync
        </Button>
      )}

      {/* Offline Warning */}
      {!isOnline && (
        <div className="flex items-center gap-1 text-xs text-amber-600">
          <AlertCircle className="w-3 h-3" />
          Limited functionality
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Download,
  Wifi,
  WifiOff,
  Trash2,
  RefreshCw,
  HardDrive,
  Clock,
  MoreHorizontal,
  CloudUpload,
  CloudOff,
  FolderSync as Sync,
} from "lucide-react"
import { IOfflineManifest } from "@/types/offline-package";
import { useOfflineSync, type ISyncQueueItem } from "@/hooks/useOfflineSync"

interface OfflineManagerProps {
  compact?: boolean
}

export function OfflineManager({ compact = false }: OfflineManagerProps) {
  const router = useRouter();
  const {
    isOnline,
    // FIX: Use 'manifest' as the primary data source
    manifest,
    syncQueue,
    isSyncing,
    downloadProgress,
    stats,
    downloadContent,
    removeContent,
    syncPendingChanges,
    // FIX: Add the new versioning functions from the hook
    checkForUpdates,
    isCheckingForUpdates,
    updatesAvailable,
  } = useOfflineSync()

  const [selectedContent, setSelectedContent] = useState<string[]>([])

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // FIX: Update helper to handle ISO strings from the manifest
  const formatTimeAgo = (dateString: string | Date | null) => {
    if (!dateString) return "Never";
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  }

  const handleBulkDelete = async () => {
    await Promise.all(selectedContent.map(contentId => removeContent(contentId)));
    setSelectedContent([]);
  }

  // FIX: This sub-component is completely rewritten to use manifest metadata
  const ContentItem = ({ contentId, meta }: { contentId: string, meta: IOfflineManifest['downloaded'][string] }) => {
    const isDownloading = downloadProgress[contentId] !== undefined;
    const progress = downloadProgress[contentId] || 0;
    const hasUpdate = updatesAvailable.get(contentId) || false;

    return (
      <div className={`flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-lg border hover:shadow-apple-sm transition-all ${hasUpdate ? 'border-blue-300 ring-2 ring-blue-100' : 'border-cloud'}`}>
        <div className="flex items-center gap-4 flex-1">
          <input
            type="checkbox"
            checked={selectedContent.includes(contentId)}
            onChange={(e) => {
              setSelectedContent(
                e.target.checked
                  ? [...selectedContent, contentId]
                  : selectedContent.filter((id) => id !== contentId)
              );
            }}
            className="w-4 h-4 text-pacific border-cloud rounded focus:ring-pacific"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-shadow text-sm truncate" title={meta.title}>{meta.title}</h4>
            <div className="flex items-center gap-2 text-xs text-graphite mt-1">
              <Badge variant="outline">{meta.subject || 'General'}</Badge>
              <Badge variant="secondary">v{meta.version}</Badge>
              <span>{formatFileSize(meta.sizeInBytes)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDownloading && (
            <div className="flex items-center gap-2">
              <Progress value={progress} className="w-16" />
              <span className="text-xs text-graphite">{Math.round(progress)}%</span>
            </div>
          )}
          {hasUpdate && !isDownloading && (
            <Button size="sm" onClick={() => downloadContent(contentId)} className="bg-blue-500 hover:bg-blue-600 text-white">
              <CloudUpload className="w-4 h-4 mr-2" />
              Update
            </Button>
          )}
          {!hasUpdate && !isDownloading && (
            <Button size="sm" variant="ghost" onClick={() => router.push(`/offline/${contentId}`)}>
              Open
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/offline/${contentId}`)}>Open Offline</DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadContent(contentId)} disabled={isDownloading}>
                <RefreshCw className="w-3 h-3 mr-2" />
                Force Re-download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => removeContent(contentId)} className="text-red-600">
                <Trash2 className="w-3 h-3 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };
  
  // FIX: This is now the source of truth for the list
  const downloadedItems = manifest ? Object.entries(manifest.downloaded) : [];

  if (compact) {
    return (
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h4">
            {isOnline ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-red-500" />}
            Offline Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg">
              {/* FIX: Get total from manifest length */}
              <div className="text-lg font-bold text-pacific">{downloadedItems.length}</div>
              <div className="text-xs text-graphite">Downloaded</div>
            </div>
            <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg">
              {/* FIX: Get size from stats object */}
              <div className="text-lg font-bold text-sage">{formatFileSize(stats.storageUsed)}</div>
              <div className="text-xs text-graphite">Storage Used</div>
            </div>
          </div>
          {isOnline && syncQueue.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-yellow-50 border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Sync className={`w-4 h-4 text-yellow-600 ${isSyncing ? "animate-spin" : ""}`} />
                <span className="text-sm text-yellow-800">{syncQueue.length} items to sync</span>
              </div>
              <Button size="sm" variant="outline" onClick={syncPendingChanges} disabled={isSyncing}>
                Sync
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className={`shadow-apple-md ${!isOnline ? "bg-red-50 border-red-200" : ""}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isOnline ? "bg-green-100" : "bg-red-100"}`}>
                {isOnline ? <Wifi className="w-6 h-6 text-green-600" /> : <CloudOff className="w-6 h-6 text-red-600" />}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-shadow">{isOnline ? "You are Online" : "Offline Mode"}</h3>
                <p className="text-sm text-graphite">{isOnline ? "All features are available." : "Using downloaded content only."}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={checkForUpdates} disabled={!isOnline || isCheckingForUpdates}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isCheckingForUpdates ? 'animate-spin' : ''}`} />
                Check for Updates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-apple-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pacific mb-1">{downloadedItems.length}</div>
            <div className="text-sm text-graphite">Items Downloaded</div>
          </CardContent>
        </Card>
        <Card className="shadow-apple-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-sage mb-1">{formatFileSize(stats.storageUsed)}</div>
            <div className="text-sm text-graphite">Storage Used</div>
          </CardContent>
        </Card>
        <Card className="shadow-apple-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-coral mb-1">{formatTimeAgo(stats.lastSyncTime)}</div>
            <div className="text-sm text-graphite">Last Sync</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h3">
            <HardDrive className="w-5 h-5 text-pacific" />
            Downloaded Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-graphite">{downloadedItems.length} items</p>
            {selectedContent.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedContent.length})
              </Button>
            )}
          </div>
          {downloadedItems.length === 0 ? (
            <div className="text-center py-8 text-graphite border-2 border-dashed border-gray-200 rounded-lg">
              <Download className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <h3 className="font-semibold mb-2">No offline content yet</h3>
              <p className="text-sm">Download materials from the library to get started.</p>
            </div>
          ) : (
            <ScrollArea className="h-96 pr-4">
              <div className="space-y-3">
                {downloadedItems.map(([contentId, meta]) => (
                  <ContentItem key={contentId} contentId={contentId} meta={meta} />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

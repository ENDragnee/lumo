"use client"

import { useState } from "react"
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
  CheckCircle,
  AlertCircle,
  Play,
  BookOpen,
  FileText,
  Video,
  ClipboardList,
  MoreHorizontal,
  FolderSyncIcon as Sync,
  CloudOff,
} from "lucide-react"
import { useOfflineSync, type OfflineContent } from "../../hooks/useOfflineSync"

interface OfflineManagerProps {
  compact?: boolean
}

export function OfflineManager({ compact = false }: OfflineManagerProps) {
  const {
    isOnline,
    downloadedContent,
    syncQueue,
    isSyncing,
    downloadProgress,
    stats,
    downloadContent,
    removeContent,
    syncPendingChanges,
    cleanupExpiredContent,
  } = useOfflineSync()

  const [selectedContent, setSelectedContent] = useState<string[]>([])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen className="w-4 h-4" />
      case "video":
        return <Video className="w-4 h-4" />
      case "material":
        return <FileText className="w-4 h-4" />
      case "quiz":
        return <ClipboardList className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getStatusColor = (content: OfflineContent) => {
    if (content.expiresAt && content.expiresAt < new Date()) {
      return "text-red-500"
    }
    if (content.progress?.completed) {
      return "text-green-500"
    }
    return "text-blue-500"
  }

  const handleDownloadDemo = async () => {
    const contentTypes = ["course", "video", "material", "quiz"] as const
    const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)]
    const contentId = `demo_${randomType}_${Date.now()}`

    try {
      await downloadContent(contentId, randomType)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const handleBulkDelete = async () => {
    for (const contentId of selectedContent) {
      await removeContent(contentId)
    }
    setSelectedContent([])
  }

  const ContentItem = ({ content }: { content: OfflineContent }) => {
    const isDownloading = downloadProgress[content.id] !== undefined
    const progress = downloadProgress[content.id] || 0
    const isExpired = content.expiresAt && content.expiresAt < new Date()

    return (
      <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-cloud hover:shadow-apple-sm transition-all">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedContent.includes(content.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedContent([...selectedContent, content.id])
                } else {
                  setSelectedContent(selectedContent.filter((id) => id !== content.id))
                }
              }}
              className="w-4 h-4 text-pacific border-cloud rounded focus:ring-pacific"
            />
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm ${getStatusColor(content)}`}
            >
              {getContentIcon(content.type)}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-shadow text-sm truncate">{content.title}</h4>
              <Badge variant="outline" className="text-xs capitalize">
                {content.type}
              </Badge>
              {isExpired && (
                <Badge variant="destructive" className="text-xs">
                  Expired
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-graphite">
              <span>{content.subject}</span>
              <span>{formatFileSize(content.size)}</span>
              <span>Downloaded {formatTimeAgo(content.downloadedAt)}</span>
              {content.progress && (
                <span className="flex items-center gap-1">
                  <div className="w-12 bg-gray-200 rounded-full h-1">
                    <div className="bg-pacific h-1 rounded-full" style={{ width: `${content.progress.percentage}%` }} />
                  </div>
                  {content.progress.percentage}%
                </span>
              )}
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Play className="w-3 h-3 mr-2" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="w-3 h-3 mr-2" />
                Re-download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => removeContent(content.id)} className="text-red-600">
                <Trash2 className="w-3 h-3 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  if (compact) {
    return (
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h4">
            {isOnline ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-red-500" />}
            Offline Access
            {!isOnline && <Badge className="bg-red-100 text-red-800">Offline Mode</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg">
              <div className="text-lg font-bold text-pacific">{stats.totalDownloaded}</div>
              <div className="text-xs text-graphite">Downloaded</div>
            </div>
            <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg">
              <div className="text-lg font-bold text-sage">{formatFileSize(stats.totalSize)}</div>
              <div className="text-xs text-graphite">Storage Used</div>
            </div>
          </div>

          {/* Sync Status */}
          {syncQueue.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Sync className={`w-4 h-4 text-yellow-600 ${isSyncing ? "animate-spin" : ""}`} />
                <span className="text-sm text-yellow-800">{syncQueue.length} items pending sync</span>
              </div>
              {isOnline && (
                <Button size="sm" variant="outline" onClick={syncPendingChanges} disabled={isSyncing}>
                  Sync Now
                </Button>
              )}
            </div>
          )}

          {/* Recent Downloads */}
          <div className="space-y-2">
            <h4 className="font-semibold text-shadow text-sm">Recent Downloads</h4>
            {downloadedContent.slice(0, 3).map((content) => (
              <ContentItem key={content.id} content={content} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <Card className={`shadow-apple-md ${!isOnline ? "bg-red-50 border-red-200" : ""}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isOnline ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {isOnline ? <Wifi className="w-6 h-6 text-green-600" /> : <CloudOff className="w-6 h-6 text-red-600" />}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-shadow">{isOnline ? "Online" : "Offline Mode"}</h3>
                <p className="text-sm text-graphite">
                  {isOnline ? "All features available" : "Using downloaded content only"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleDownloadDemo} disabled={!isOnline}>
                <Download className="w-4 h-4 mr-2" />
                Download Demo Content
              </Button>
              {isOnline && syncQueue.length > 0 && (
                <Button onClick={syncPendingChanges} disabled={isSyncing} variant="outline">
                  <Sync className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                  Sync Changes ({syncQueue.length})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-apple-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pacific mb-1">{stats.totalDownloaded}</div>
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
            <div className="text-2xl font-bold text-butter mb-1">{syncQueue.length}</div>
            <div className="text-sm text-graphite">Pending Sync</div>
          </CardContent>
        </Card>
        <Card className="shadow-apple-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-coral mb-1">
              {stats.lastSyncTime ? formatTimeAgo(stats.lastSyncTime) : "Never"}
            </div>
            <div className="text-sm text-graphite">Last Sync</div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Usage */}
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h3">
            <HardDrive className="w-5 h-5 text-pacific" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-shadow">
                {formatFileSize(stats.storageUsed)} of {formatFileSize(stats.storageLimit)} used
              </span>
              <span className="text-sm text-graphite">
                {Math.round((stats.storageUsed / stats.storageLimit) * 100)}%
              </span>
            </div>
            <Progress value={(stats.storageUsed / stats.storageLimit) * 100} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={cleanupExpiredContent}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clean Up Expired
            </Button>
            {selectedContent.length > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedContent.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Downloaded Content */}
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h3">
            <Download className="w-5 h-5 text-pacific" />
            Downloaded Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          {downloadedContent.length === 0 ? (
            <div className="text-center py-8 text-graphite">
              <Download className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold mb-2">No offline content yet</h3>
              <p className="text-sm">Download courses and materials to access them offline</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {downloadedContent.map((content) => (
                  <ContentItem key={content.id} content={content} />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Sync Queue */}
      {syncQueue.length > 0 && (
        <Card className="shadow-apple-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-responsive-h3">
              <Clock className="w-5 h-5 text-pacific" />
              Pending Sync
              <Badge className="bg-yellow-100 text-yellow-800">{syncQueue.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {syncQueue.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center">
                      {item.retryCount > 0 ? (
                        <AlertCircle className="w-3 h-3 text-yellow-600" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-shadow text-sm capitalize">
                        {item.type.replace("_", " ")} {item.action}
                      </h4>
                      <p className="text-xs text-graphite">
                        {formatTimeAgo(item.timestamp)}
                        {item.retryCount > 0 && ` • ${item.retryCount} retries`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {syncQueue.length > 5 && (
                <p className="text-sm text-graphite text-center">And {syncQueue.length - 5} more items...</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

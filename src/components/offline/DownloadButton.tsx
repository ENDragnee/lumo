"use client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Download, Check, Trash2 } from "lucide-react"
import { useOfflineSync } from "../../hooks/useOfflineSync"

interface DownloadButtonProps {
  contentId: string
  contentType: "course" | "material" | "video" | "quiz" | "assignment"
  title: string
  size?: number
  className?: string
}

export function DownloadButton({ contentId, contentType, size, className }: DownloadButtonProps) {
  const { isOnline, downloadContent, removeContent, isContentAvailable, downloadProgress } = useOfflineSync()

  const isDownloaded = isContentAvailable(contentId)
  const isDownloading = downloadProgress[contentId] !== undefined
  const progress = downloadProgress[contentId] || 0

  const handleDownload = async () => {
    if (!isOnline) return

    try {
      await downloadContent(contentId, contentType)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const handleRemove = async () => {
    await removeContent(contentId)
  }

  if (isDownloading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Progress value={progress} className="flex-1 h-2" />
        <span className="text-xs text-graphite">{Math.round(progress)}%</span>
      </div>
    )
  }

  if (isDownloaded) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <Check className="w-3 h-3" />
          Downloaded
        </Badge>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRemove}
          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleDownload}
      disabled={!isOnline}
      className={`flex items-center gap-2 ${className}`}
    >
      <Download className="w-3 h-3" />
      Download
      {size && <span className="text-xs text-graphite">({Math.round(size / 1024 / 1024)}MB)</span>}
    </Button>
  )
}

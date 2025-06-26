"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Download, Check, Trash2, CloudUpload, Loader2 } from "lucide-react"
import { useOfflineSync } from "@/hooks/useOfflineSync" // Make sure path is correct

// --- The props are now much simpler ---
interface DownloadButtonProps {
  contentId: string;
  className?: string;
}

export function DownloadButton({ contentId, className }: DownloadButtonProps) {
  const { 
    isOnline, 
    manifest,
    downloadContent, 
    removeContent, 
    downloadProgress,
    updatesAvailable,
  } = useOfflineSync();

  // --- DERIVED STATE ---
  // The component's state is now derived directly from the hook's manifest and progress objects.

  // Is this specific content listed in our offline manifest?
  const isDownloaded = !!manifest?.downloaded[contentId];

  // Is there an active download in progress for this content?
  const isDownloading = downloadProgress[contentId] !== undefined;
  const progress = downloadProgress[contentId] || 0;

  // Is there an update available for this downloaded content?
  const hasUpdate = isDownloaded && (updatesAvailable.get(contentId) || false);


  // --- HANDLER FUNCTIONS ---

  const handleDownload = async () => {
    // Guard clause: Don't allow download attempts if offline or already downloading.
    if (!isOnline || isDownloading) return;

    try {
      // The hook's function now only needs the contentId.
      // It handles fetching the package and updating the manifest.
      await downloadContent(contentId);
    } catch (error) {
      console.error(`Download failed for contentId ${contentId}:`, error);
      // Optional: Add user-facing error feedback here (e.g., using a toast notification)
    }
  };

  const handleRemove = async () => {
    // No change needed here.
    await removeContent(contentId);
  };


  // --- RENDER LOGIC ---
  // The render logic now checks for all possible states in order of priority.

  // State 1: Currently downloading (highest priority)
  if (isDownloading) {
    return (
      <div className={`flex items-center gap-2 w-32 ${className}`}>
        <Progress value={progress} className="flex-1 h-2" />
        <span className="text-xs text-graphite font-mono">{Math.round(progress)}%</span>
      </div>
    );
  }

  // State 2: Already downloaded
  if (isDownloaded) {
    // Sub-state 2a: An update is available
    if (hasUpdate) {
        return (
            <Button
                size="sm"
                onClick={handleDownload} // The same download function handles updates
                disabled={!isOnline}
                className={`bg-blue-500 hover:bg-blue-600 text-white ${className}`}
            >
                <CloudUpload className="w-4 h-4 mr-2" />
                Update Available
            </Button>
        );
    }

    // Sub-state 2b: Downloaded and up-to-date
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1 border border-green-200">
          <Check className="w-3 h-3" />
          Downloaded
        </Badge>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleRemove}
          className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-700"
          aria-label="Remove from offline"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  // State 3: Not downloaded (the default state)
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleDownload}
      disabled={!isOnline}
      className={`flex items-center gap-2 ${className}`}
    >
      {isOnline ? (
          <>
            <Download className="w-4 h-4" />
            Download
          </>
      ) : (
          <>
            <Download className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Unavailable Offline</span>
          </>
      )}
    </Button>
  );
}

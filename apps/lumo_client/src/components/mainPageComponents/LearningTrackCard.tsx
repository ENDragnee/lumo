
import { Play, CheckCircle, Lock } from 'lucide-react'
import { DownloadButton } from "@/components/offline/DownloadButton"
import { formatRelativeDate } from '@/lib/format-date'; // Import your new helper
// Learning Track Card Component with Download Button
export function LearningTrackCard({ track }: any) {
  const getStateIcon = (state: string) => {
    switch (state) {
      case "in-progress":
        return <Play className="w-5 h-5 text-white" />
      case "completed":
        return <CheckCircle className="w-5 h-5 text-white" />
      case "locked":
        return <Lock className="w-5 h-5 text-gray-500" />
      default:
        return <Play className="w-5 h-5 text-white" />
    }
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case "in-progress":
        return "bg-pacific"
      case "completed":
        return "bg-success"
      case "locked":
        return "bg-gray-200"
      default:
        return "bg-pacific"
    }
  }

  const isLocked = track.state === "locked"

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl transition-all ${
        isLocked ? "bg-gray-50" : "hover:bg-gray-100 cursor-pointer"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStateColor(track.state)}`}>
          {getStateIcon(track.state)}
        </div>
        <div className={isLocked ? "text-gray-400" : ""}>
          <p className="font-semibold text-gray-800">{track.title}</p>
          <p className="text-sm text-gray-500">
            {track.subject} • Last accessed: {formatRelativeDate(track.lastAccessedAt) || "N/A"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {!isLocked && (
          <>
            <p className="text-sm font-medium text-gray-600">{track.progress}%</p>
            <div className="w-24 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-pacific h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${track.progress}%` }}
              />
            </div>
            <DownloadButton
              contentId={track._id}
              // FIX: Replaced Math.random() with a deterministic calculation
            />
          </>
        )}
      </div>
    </div>
  )
}

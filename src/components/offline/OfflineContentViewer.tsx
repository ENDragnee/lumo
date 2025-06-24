"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, SkipBack, SkipForward, BookOpen, Clock, CheckCircle } from "lucide-react"
import { useOfflineSync, type OfflineContent } from "../../hooks/useOfflineSync"

interface OfflineContentViewerProps {
  contentId: string
  onProgressUpdate?: (progress: number) => void
}

export function OfflineContentViewer({ contentId, onProgressUpdate }: OfflineContentViewerProps) {
  const { getContent, updateProgress, isOnline } = useOfflineSync()
  const [content, setContent] = useState<OfflineContent | null>(null)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    const foundContent = getContent(contentId)
    if (foundContent) {
      setContent(foundContent)
      setCurrentPosition(foundContent.progress?.lastPosition || 0)
      setTimeSpent(foundContent.progress?.timeSpent || 0)
    }
  }, [contentId, getContent])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1)
        if (content?.type === "video" && content.metadata.duration) {
          setCurrentPosition((prev) => {
            const newPosition = Math.min(prev + 1, content.metadata.duration!)
            const percentage = (newPosition / content.metadata.duration!) * 100

            // Update progress every 10 seconds
            if (newPosition % 10 === 0) {
              updateProgress(contentId, {
                percentage,
                lastPosition: newPosition,
                timeSpent: timeSpent + 1,
                completed: percentage >= 95,
              })
              onProgressUpdate?.(percentage)
            }

            return newPosition
          })
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, content, contentId, updateProgress, timeSpent, onProgressUpdate])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (direction: "forward" | "backward") => {
    const seekAmount = 10 // seconds
    setCurrentPosition((prev) => {
      const newPosition =
        direction === "forward"
          ? Math.min(prev + seekAmount, content?.metadata.duration || prev)
          : Math.max(prev - seekAmount, 0)
      return newPosition
    })
  }

  const handleMarkComplete = async () => {
    if (content) {
      await updateProgress(contentId, {
        completed: true,
        percentage: 100,
        timeSpent,
        lastPosition: content.metadata.duration || currentPosition,
      })
      onProgressUpdate?.(100)
    }
  }

  if (!content) {
    return (
      <Card className="shadow-apple-md">
        <CardContent className="p-8 text-center">
          <p className="text-graphite">Content not found or not downloaded</p>
        </CardContent>
      </Card>
    )
  }

  const progressPercentage = content.metadata.duration
    ? (currentPosition / content.metadata.duration) * 100
    : content.progress?.percentage || 0

  return (
    <div className="space-y-6">
      {/* Content Header */}
      <Card className="shadow-apple-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-responsive-h3">{content.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="capitalize">
                  {content.type}
                </Badge>
                <Badge variant="secondary">{content.subject}</Badge>
                {!isOnline && <Badge className="bg-blue-100 text-blue-800">Offline Mode</Badge>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-graphite">Progress: {Math.round(progressPercentage)}%</div>
              <div className="text-xs text-graphite">Time spent: {formatTime(timeSpent)}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Video Player (for video content) */}
      {content.type === "video" && (
        <Card className="shadow-apple-md">
          <CardContent className="p-6">
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
              <div className="text-white text-center">
                <Play className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-75">Offline Video Player</p>
                <p className="text-xs opacity-50">Simulated video content</p>
              </div>
            </div>

            {/* Video Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-graphite">{formatTime(currentPosition)}</span>
                <Progress value={progressPercentage} className="flex-1" />
                <span className="text-sm text-graphite">{formatTime(content.metadata.duration || 0)}</span>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="sm" onClick={() => handleSeek("backward")}>
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button onClick={handlePlayPause} className="bg-pacific hover:bg-midnight">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleSeek("forward")}>
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Content (for materials, courses) */}
      {(content.type === "material" || content.type === "course") && (
        <Card className="shadow-apple-md">
          <CardContent className="p-6">
            <div className="prose max-w-none">
              <h3>Chapter 1: Introduction</h3>
              <p>
                This is simulated offline content for <strong>{content.title}</strong>. In a real implementation, this
                would contain the actual course material, formatted text, images, and interactive elements.
              </p>

              <h4>Key Concepts</h4>
              <ul>
                <li>Fundamental principles of {content.subject}</li>
                <li>Practical applications and examples</li>
                <li>Problem-solving techniques</li>
                <li>Real-world case studies</li>
              </ul>

              <h4>Learning Objectives</h4>
              <p>
                By the end of this section, you will be able to understand and apply the core concepts of{" "}
                {content.subject} in various scenarios.
              </p>

              {content.type === "course" && content.content.chapters && (
                <div className="mt-6">
                  <h4>Course Chapters</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {content.content.chapters.map((chapter: string, index: number) => (
                      <div key={index} className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-cloud">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-pacific" />
                          <span className="font-medium">{chapter}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Content */}
      {content.type === "quiz" && (
        <Card className="shadow-apple-md">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-shadow mb-2">{content.subject} Quiz</h3>
                <p className="text-sm text-graphite">{content.metadata.questions} questions • Offline mode</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Question 1 of {content.metadata.questions}</h4>
                <p className="text-blue-800 mb-4">What is the fundamental principle behind {content.subject}?</p>

                <div className="space-y-2">
                  {["Option A", "Option B", "Option C", "Option D"].map((option, index) => (
                    <label key={index} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="question1" className="text-pacific" />
                      <span className="text-sm">
                        {option}: Sample answer for {content.subject}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline">Previous</Button>
                <span className="text-sm text-graphite">1 of {content.metadata.questions}</span>
                <Button className="bg-pacific hover:bg-midnight">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Actions */}
      <Card className="shadow-apple-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-graphite" />
                <span className="text-sm text-graphite">{formatTime(timeSpent)} studied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-pacific h-2 rounded-full" style={{ width: `${progressPercentage}%` }} />
                </div>
                <span className="text-sm text-graphite">{Math.round(progressPercentage)}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {progressPercentage < 95 && (
                <Button onClick={handleMarkComplete} variant="outline">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              )}
              {content.progress?.completed && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

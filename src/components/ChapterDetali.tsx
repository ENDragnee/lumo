"use client"

import { useState } from "react"
import { ArrowLeft, BookOpen, CheckCircle, Clock, Download, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface ChapterDetailProps {
  chapterId: string
  courseId: string
  onBack: () => void
}

export default function ChapterDetail({ chapterId, courseId, onBack }: ChapterDetailProps) {
  const [activeTab, setActiveTab] = useState("content")
  const [progress, setProgress] = useState(0)

  // In a real app, you would fetch this data based on the chapterId
  const chapterData = {
    id: chapterId,
    title: getChapterTitle(chapterId),
    description:
      "This chapter covers the fundamental concepts and principles that form the foundation of the course. You'll learn key terminology, historical context, and the basic framework that will be used throughout the course.",
    duration: "1 week",
    progress: 0,
    sections: [
      {
        id: "section1",
        title: "Introduction to Key Concepts",
        type: "video",
        duration: "15 minutes",
        completed: false,
      },
      {
        id: "section2",
        title: "Historical Background",
        type: "reading",
        duration: "20 minutes",
        completed: false,
      },
      {
        id: "section3",
        title: "Core Principles and Framework",
        type: "video",
        duration: "25 minutes",
        completed: false,
      },
      {
        id: "section4",
        title: "Practical Applications",
        type: "interactive",
        duration: "30 minutes",
        completed: false,
      },
      {
        id: "section5",
        title: "Chapter Quiz",
        type: "quiz",
        duration: "15 minutes",
        completed: false,
      },
    ],
    resources: [
      {
        id: "resource1",
        title: "Chapter Slides",
        type: "pdf",
        size: "2.4 MB",
      },
      {
        id: "resource2",
        title: "Supplementary Reading",
        type: "pdf",
        size: "1.8 MB",
      },
      {
        id: "resource3",
        title: "Practice Exercises",
        type: "doc",
        size: "1.2 MB",
      },
    ],
    nextChapter: getNextChapterId(chapterId),
    prevChapter: getPrevChapterId(chapterId),
  }

  function getChapterTitle(id: string): string {
    const chapters: Record<string, string> = {
      ch1: "Introduction to the Course",
      ch2: "Theoretical Foundations",
      ch3: "Applied Methodologies",
      ch4: "Advanced Concepts",
      ch5: "Project Development",
      ch6: "Final Assessment",
    }
    return chapters[id] || "Chapter"
  }

  function getNextChapterId(id: string): string | null {
    const chapters = ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6"]
    const currentIndex = chapters.indexOf(id)
    return currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null
  }

  function getPrevChapterId(id: string): string | null {
    const chapters = ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6"]
    const currentIndex = chapters.indexOf(id)
    return currentIndex > 0 ? chapters[currentIndex - 1] : null
  }

  const markSectionComplete = (sectionId: string) => {
    // In a real app, you would update this in a database
    console.log(`Marked section ${sectionId} as complete`)

    // Update progress
    const newProgress = Math.min(100, progress + 20)
    setProgress(newProgress)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Chapter Header */}
      <div className="bg-[#c69323] text-white py-6 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <Button variant="ghost" className="text-blue-100 hover:text-white p-0 mb-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{chapterData.title}</h1>
          <p className="text-blue-100 max-w-3xl">{chapterData.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-[#c69323]" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>{chapterData.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="flex-1 py-8 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <div className="space-y-6">
                {chapterData.sections.map((section, index) => (
                  <Card key={section.id} className="overflow-hidden">
                    <div className="flex items-center p-4 border-b">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-[#c69323] font-medium mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{section.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {section.type === "video" && <Video className="h-3.5 w-3.5" />}
                          {section.type === "reading" && <BookOpen className="h-3.5 w-3.5" />}
                          {section.type === "quiz" && <CheckCircle className="h-3.5 w-3.5" />}
                          <span>
                            {section.type.charAt(0).toUpperCase() + section.type.slice(1)} • {section.duration}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant={section.completed ? "outline" : "default"}
                        size="sm"
                        onClick={() => markSectionComplete(section.id)}
                      >
                        {section.completed ? "Completed" : "Start"}
                      </Button>
                    </div>
                    {section.type === "video" && (
                      <div className="aspect-video bg-gray-900 flex items-center justify-center">
                        <div className="text-white text-center">
                          <Video className="h-12 w-12 mx-auto mb-2 opacity-70" />
                          <p>Video content would appear here</p>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}

                <div className="flex justify-between mt-8">
                  {chapterData.prevChapter ? (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() =>
                        (window.location.href = `/courses/${courseId}/chapters/${chapterData.prevChapter}`)
                      }
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous Chapter
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {chapterData.nextChapter && (
                    <Button
                      className="flex items-center gap-2"
                      onClick={() =>
                        (window.location.href = `/courses/${courseId}/chapters/${chapterData.nextChapter}`)
                      }
                    >
                      Next Chapter
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Chapter Resources</CardTitle>
                  <CardDescription>Download these resources to supplement your learning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chapterData.resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-blue-100 text-[#c69323] flex items-center justify-center">
                            {resource.type === "pdf" && <FileIcon />}
                            {resource.type === "doc" && <DocIcon />}
                          </div>
                          <div>
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-sm text-gray-500">
                              {resource.type.toUpperCase()} • {resource.size}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussion">
              <Card>
                <CardHeader>
                  <CardTitle>Chapter Discussion</CardTitle>
                  <CardDescription>Engage with your instructor and peers about this chapter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Discussion forum would appear here</p>
                    <Button variant="outline">Join Discussion</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Simple file type icons
function FileIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg> 
  )
}

function DocIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

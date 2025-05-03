"use client"

import type React from "react"

import { useState } from "react"
import CourseNavigatorSidebar from "./CourseNavigatorSidebar"
import CourseDetail from "./CourseDetail"
import ChapterDetail from "./ChapterDetali"
import { Menu, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface CourseNavigatorLayoutProps {
  children: React.ReactNode
}

export default function CourseNavigatorLayout({ children }: CourseNavigatorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<{
    course: string
    department?: string
    year?: string
    semester?: string
    stream?: string
  } | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)

  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  const handleCourseSelect = (course: string, department: string, year: string, semester: string, stream?: string) => {
    setSelectedCourse({
      course,
      department,
      year,
      semester,
      stream,
    })
    setSelectedChapter(null)
    setSidebarOpen(false)
  }

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapter(chapterId)

    // In a real Next.js app, you would use router.push here
    // This simulates changing the URL
    if (selectedCourse) {
      const courseId = selectedCourse.course.replace(/\s+/g, "-").toLowerCase()
      window.history.pushState({}, "", `/courses/${courseId}/chapters/${chapterId}`)
    }
  }

  const handleBackToCourse = () => {
    setSelectedChapter(null)

    // In a real Next.js app, you would use router.push here
    if (selectedCourse) {
      const courseId = selectedCourse.course.replace(/\s+/g, "-").toLowerCase()
      window.history.pushState({}, "", `/courses/${courseId}`)
    }
  }

  // Determine what content to show
  const renderContent = () => {
    if (selectedChapter && selectedCourse) {
      return (
        <ChapterDetail
          chapterId={selectedChapter}
          courseId={selectedCourse.course.replace(/\s+/g, "-").toLowerCase()}
          onBack={handleBackToCourse}
        />
      )
    } else if (selectedCourse) {
      return (
        <CourseDetail
          course={selectedCourse.course}
          department={selectedCourse.department}
          year={selectedCourse.year}
          semester={selectedCourse.semester}
          stream={selectedCourse.stream}
          onChapterSelect={handleChapterSelect}
        />
      )
    } else {
      return children
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:block border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-80",
        )}
      >
        <div className="flex justify-end p-2">
          <Button variant="ghost" size="sm" onClick={toggleCollapse} className="h-8 w-8 p-0">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <CourseNavigatorSidebar collapsed={collapsed} onSelect={handleCourseSelect} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-10">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
          <CourseNavigatorSidebar onSelect={handleCourseSelect} collapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  )
}

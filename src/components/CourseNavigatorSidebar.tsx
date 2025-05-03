"use client"

import { useState, useMemo } from "react"
import { courseData } from "../app/hooks/courseData" // Assuming data is in this file
import { GraduationCap, School } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CourseNavigatorSidebarProps {
  onSelect?: (course: string, department: string, year: string, semester: string, stream?: string) => void
  collapsed?: boolean
}

export default function CourseNavigatorSidebar({ onSelect, collapsed = false }: CourseNavigatorSidebarProps) {
  const [selectedCollegeIndex, setSelectedCollegeIndex] = useState<number | null>(null)
  const [selectedDeptIndex, setSelectedDeptIndex] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedSemester, setSelectedSemester] = useState<string>("")
  const [selectedStream, setSelectedStream] = useState<string>("")

  // --- Memoized Derived State ---
  const colleges = useMemo(() => courseData.colleges, [])

  const departments = useMemo(() => {
    if (selectedCollegeIndex === null) return []
    return colleges[selectedCollegeIndex].departments
  }, [colleges, selectedCollegeIndex])

  const years = useMemo(() => {
    if (selectedDeptIndex === null || !departments[selectedDeptIndex]?.coursesByYearSemester) return []
    return Object.keys(departments[selectedDeptIndex].coursesByYearSemester)
  }, [departments, selectedDeptIndex])

  const semestersAndStreams = useMemo(() => {
    if (
      selectedDeptIndex === null ||
      !selectedYear ||
      !departments[selectedDeptIndex]?.coursesByYearSemester?.[selectedYear]
    )
      return {}
    return departments[selectedDeptIndex].coursesByYearSemester[selectedYear]
  }, [departments, selectedDeptIndex, selectedYear])

  const semesters = useMemo(() => Object.keys(semestersAndStreams), [semestersAndStreams])

  const streams = useMemo(() => {
    if (
      !selectedSemester ||
      typeof semestersAndStreams[selectedSemester] !== "object" ||
      Array.isArray(semestersAndStreams[selectedSemester])
    ) {
      return []
    }
    return Object.keys(semestersAndStreams[selectedSemester])
  }, [semestersAndStreams, selectedSemester])

  const courses = useMemo(() => {
    if (!selectedSemester || !semestersAndStreams[selectedSemester]) return []

    const semesterData = semestersAndStreams[selectedSemester]

    if (streams.length > 0) {
      if (!selectedStream || !semesterData[selectedStream]) return ["Please select a stream."]
      return semesterData[selectedStream]
    } else if (Array.isArray(semesterData)) {
      return semesterData
    }
    return []
  }, [semestersAndStreams, selectedSemester, streams, selectedStream])

  // --- Event Handlers ---
  const handleCollegeChange = (value: string) => {
    const index = value ? Number.parseInt(value, 10) : null
    setSelectedCollegeIndex(index)
    setSelectedDeptIndex(null)
    setSelectedYear("")
    setSelectedSemester("")
    setSelectedStream("")
  }

  const handleDeptChange = (value: string) => {
    const index = value ? Number.parseInt(value, 10) : null
    setSelectedDeptIndex(index)
    setSelectedYear("")
    setSelectedSemester("")
    setSelectedStream("")
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    setSelectedSemester("")
    setSelectedStream("")
  }

  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester)
    if (
      !semestersAndStreams[semester] ||
      typeof semestersAndStreams[semester] !== "object" ||
      Array.isArray(semestersAndStreams[semester])
    ) {
      setSelectedStream("")
    } else if (streams.length === 0) {
      setSelectedStream("")
    }
  }

  const handleStreamChange = (value: string) => {
    setSelectedStream(value)
  }

  const handleCourseSelect = (course: string) => {
    if (onSelect && selectedDeptIndex !== null) {
      onSelect(course, departments[selectedDeptIndex]?.name || "", selectedYear, selectedSemester, selectedStream)
    }
  }

  if (collapsed) {
    return (
      <div className="flex flex-col h-full items-center">
        <div className="p-4 border-b border-gray-200 w-full flex justify-center">
          <School className="h-6 w-6 text-[#c69323]" />
        </div>
        <ScrollArea className="flex-1 w-full">
          <div className="p-2 flex flex-col items-center space-y-4">
            {selectedCollegeIndex !== null && (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-blue-50 text-[#c69323]"
                title="College"
              >
                <School className="h-5 w-5" />
              </Button>
            )}
            {selectedDeptIndex !== null && years.length > 0 && (
              <div className="space-y-2">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    className={cn("h-8 w-8 p-0 text-xs", selectedYear === year ? "bg-[#c69323] hover:bg-[#8c6512]" : "")}
                    onClick={() => handleYearChange(year)}
                    title={`Year ${year}`}
                  >               
                    {year.replace("Year ", "")}
                  </Button>
                ))}
              </div>
            )}
            {selectedYear && semesters.length > 0 && (
              <div className="space-y-2">
                {semesters.map((semester) => (
                  <Button
                    key={semester}
                    variant={selectedSemester === semester ? "default" : "outline"}
                    className={cn(
                      "h-8 w-8 p-0 text-xs",
                      selectedSemester === semester ? "bg-[#c69323] hover:bg-[#926a15]" : "",
                    )}
                    onClick={() => handleSemesterChange(semester)}
                    title={semester}
                  >
                    {semester.replace("Semester ", "S")}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <School className="h-5 w-5 text-[#c69323]" />
          <h2 className="text-lg font-semibold text-[#c69323]">AASTU Course Navigator</h2>
        </div>
        <p className="text-sm text-gray-500">Find and explore available courses</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* College Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">College</label>
            <Select value={selectedCollegeIndex?.toString() || ""} onValueChange={handleCollegeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select College" />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((college, index) => (
                  <SelectItem key={college.name} value={index.toString()}>
                    {college.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Department Selector */}
          {selectedCollegeIndex !== null && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Department</label>
              <Select value={selectedDeptIndex?.toString() || ""} onValueChange={handleDeptChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept, index) => (
                    <SelectItem key={dept.name} value={index.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Year Selector */}
          {selectedDeptIndex !== null && years.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Year</label>
              <div className="grid grid-cols-2 gap-2">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    className={cn("text-sm h-9", selectedYear === year ? "bg-[#c69323] hover:bg-[#7c5b13]" : "")}
                    onClick={() => handleYearChange(year)}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Semester Selector */}
          {selectedYear && semesters.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Semester</label>
              <div className="grid grid-cols-2 gap-2">
                {semesters.map((semester) => (
                  <Button
                    key={semester}
                    variant={selectedSemester === semester ? "default" : "outline"}
                    className={cn("text-sm h-9", selectedSemester === semester ? "bg-[#c69323] hover:bg-[#7c5b14]" : "")}
                    onClick={() => handleSemesterChange(semester)}
                  >
                    {semester.replace("Semester ", "Sem ")}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Stream Selector */}
          {streams.length > 0 && selectedSemester && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Stream</label>
              <Select value={selectedStream} onValueChange={handleStreamChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Stream" />
                </SelectTrigger>
                <SelectContent>
                  {streams.map((stream) => (
                    <SelectItem key={stream} value={stream}>
                      {stream}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Course List */}
          {selectedSemester && courses.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-[#c69323]" />
                <h3 className="text-sm font-medium text-gray-900">Available Courses</h3>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {courses.map((course, index) => (
                  <AccordionItem key={`${course}-${index}`} value={`item-${index}`}>
                    <AccordionTrigger className="text-sm py-2 hover:no-underline hover:bg-gray-50 px-2 rounded-md">
                      {course}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-2 py-1 text-sm text-gray-600">
                        <p className="mb-2">Course details will appear here.</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-[#c69323] border-[#c69323] hover:bg-blue-50"
                          onClick={() => handleCourseSelect(course)}
                        >
                          View Course
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* Empty State */}
          {(!selectedSemester || courses.length === 0) && selectedDeptIndex !== null && (
            <div className="mt-4 p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-md">
              {selectedCollegeIndex === null
                ? "Select a college to begin."
                : selectedDeptIndex === null
                  ? "Select a department."
                  : !selectedYear
                    ? "Select a year."
                    : !selectedSemester
                      ? "Select a semester."
                      : streams.length > 0 && !selectedStream
                        ? "Select a stream."
                        : "No courses found for this selection."}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

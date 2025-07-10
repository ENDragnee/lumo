"use client"

import React, { useState, useMemo } from "react"

import { GraduationCap, School, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CourseData, YearData, StreamData, CoursesArray, CourseObject } from "@/app/hooks/courseData"
import { useRouter } from "next/navigation"

interface CourseNavigatorSidebarProps {
  courseData: CourseData // Optional prop for course data, if needed
  onSelect?: (courseData: CourseObject) => void
  collapsed?: boolean
}

export default function CourseNavigatorSidebar({ courseData, onSelect, collapsed = false }: CourseNavigatorSidebarProps) {
  const [selectedCollegeIndex, setSelectedCollegeIndex] = useState<number | null>(null)
  const [selectedDeptIndex, setSelectedDeptIndex] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedSemester, setSelectedSemester] = useState<string>("")
  const [selectedStream, setSelectedStream] = useState<string>("")
  const router = useRouter()

  // --- Memoized Derived State ---
  const colleges = useMemo(() => courseData.colleges, [])

  const departments = useMemo(() => {
    if (selectedCollegeIndex === null || !colleges[selectedCollegeIndex]) return []
    return colleges[selectedCollegeIndex].departments
  }, [colleges, selectedCollegeIndex])

  const years = useMemo(() => {
    if (selectedDeptIndex === null || !departments[selectedDeptIndex]?.coursesByYearSemester) return []
    return Object.keys(departments[selectedDeptIndex].coursesByYearSemester)
  }, [departments, selectedDeptIndex])

  // FIX: Explicit check for selectedYear as key
  const semestersAndStreams = useMemo((): YearData | {} => {
     if (selectedDeptIndex === null || !departments[selectedDeptIndex]?.coursesByYearSemester) {
       return {};
     }
     const coursesByYearSemester = departments[selectedDeptIndex].coursesByYearSemester;

     // Explicitly check if selectedYear is a valid key BEFORE accessing
     if (!selectedYear || !(selectedYear in coursesByYearSemester)) {
        return {};
     }
     // Now TypeScript knows selectedYear is a valid key here
     return coursesByYearSemester[selectedYear] ?? {}; // Return year data or empty object
  }, [departments, selectedDeptIndex, selectedYear])

  const semesters = useMemo(() => Object.keys(semestersAndStreams), [semestersAndStreams])

  const streams = useMemo(() => {
     // Ensure semester is selected and exists as a key
     if (!selectedSemester || !(selectedSemester in semestersAndStreams)) {
       return [];
     }
     // Assert type after check
     const semesterData = semestersAndStreams[selectedSemester as keyof typeof semestersAndStreams];

     // Check if it's an object (streams) and not an array (direct courses)
     if (typeof semesterData === "object" && semesterData !== null && !Array.isArray(semesterData)) {
        // Assert semesterData is StreamData if it's an object (based on our types)
       return Object.keys(semesterData as StreamData);
     }
     return []; // Not stream-based
  }, [semestersAndStreams, selectedSemester])

  // Return type depends on CoursesArray definition
  const courses = useMemo((): CoursesArray | string[] => {
    if (!selectedSemester || !(selectedSemester in semestersAndStreams)) {
        return [];
    }
    // Assert semester key
    const semesterData = semestersAndStreams[selectedSemester as keyof typeof semestersAndStreams];

    if (streams.length > 0) {
        // Data must be an object if streams exist
        if (typeof semesterData === 'object' && semesterData !== null && !Array.isArray(semesterData)) {
            if (!selectedStream || !(selectedStream in semesterData)) {
                return ["Please select a stream."]; // Placeholder message
            }
            // Assert stream key
            const streamCourses = semesterData[selectedStream as keyof typeof semesterData];
            // Ensure the result is an array (CoursesArray)
             return Array.isArray(streamCourses) ? streamCourses : ["Invalid stream data."];
        }
        return ["Data structure error."]; // Should not happen if streams.length > 0
    } else if (Array.isArray(semesterData)) {
        // Handle non-streamed semesters (direct array of courses)
        return semesterData;
    }
    return []; // Default empty
  }, [semestersAndStreams, selectedSemester, streams, selectedStream])

  // --- Event Handlers ---
  const handleCollegeChange = (value: string) => { // Shadcn Select provides value directly
    const index = value ? Number.parseInt(value, 10) : null
    setSelectedCollegeIndex(index)
    setSelectedDeptIndex(null)
    setSelectedYear("")
    setSelectedSemester("")
    setSelectedStream("")
  }

  const handleDeptChange = (value: string) => { // Shadcn Select provides value directly
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
    // Reset stream only if new semester doesn't have streams
    if (!(semester in semestersAndStreams)) {
        setSelectedStream("");
        return;
    }
    const semesterData = semestersAndStreams[semester as keyof typeof semestersAndStreams];
    if (typeof semesterData !== 'object' || semesterData === null || Array.isArray(semesterData)) {
        setSelectedStream(""); // Not stream-based
    }
    // If stream-based, don't reset here. Let stream selector handle it.
  }

  const handleStreamChange = (value: string) => { // Shadcn Select provides value directly
    setSelectedStream(value)
  }

  // Adjust 'course' type based on CoursesArray definition
  const handleCourseSelect = (courseObject: CourseObject) => {
    if (onSelect && selectedDeptIndex !== null && departments[selectedDeptIndex]) {
      onSelect(
        courseObject
      )
    }
  }

  // --- Rendering Logic ---

  if (collapsed) {
    // Collapsed view rendering (no changes needed based on errors)
    return (
        <div className="flex flex-col h-full items-center border-r border-gray-200 bg-white">
            <div className="p-4 border-b border-gray-200 w-full flex justify-center">
              <Button onClick={() => router.push("/dashboard")} variant="ghost" className="w-full justify-center">
                <School className="h-6 w-6 text-[#c69323]" />
              </Button>
            </div>
            <ScrollArea className="flex-1 w-full">
            <div className="p-2 flex flex-col items-center space-y-4">
                {/* Simplified indicators for collapsed view */}
                {selectedCollegeIndex !== null && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-blue-50 text-[#c69323] hover:bg-blue-100"
                    title={colleges[selectedCollegeIndex]?.name || "Selected College"}
                >
                    <School className="h-5 w-5" />
                </Button>
                )}
                 {selectedDeptIndex !== null && departments[selectedDeptIndex] && (
                     <Button
                         variant="ghost"
                         size="icon"
                         className="h-10 w-10 rounded-full bg-green-50 text-green-700 hover:bg-green-100"
                         title={departments[selectedDeptIndex]?.name || "Selected Department"}
                     >
                         <GraduationCap className="h-5 w-5" />
                     </Button>
                 )}

                {/* Year buttons */}
                {selectedDeptIndex !== null && years.length > 0 && (
                <div className="space-y-2 flex flex-col items-center">
                    {years.map((year) => (
                    <Button
                        key={year}
                        variant={selectedYear === year ? "default" : "outline"}
                        className={cn(
                            "h-8 w-8 p-0 text-xs rounded-full", // Make them round
                            selectedYear === year
                            ? "bg-[#c69323] text-white hover:bg-[#8c6512]"
                            : "text-gray-600 border-gray-300"
                        )}
                        onClick={() => handleYearChange(year)}
                        title={year} // Keep full title
                    >
                        {year.replace("Year ", "Y")} {/* Keep short label */}
                    </Button>
                    ))}
                </div>
                )}

                {/* Semester buttons */}
                {selectedYear && semesters.length > 0 && (
                <div className="space-y-2 flex flex-col items-center">
                    {semesters.map((semester) => (
                    <Button
                        key={semester}
                        variant={selectedSemester === semester ? "default" : "outline"}
                        className={cn(
                         "h-8 w-8 p-0 text-xs rounded-full",
                         selectedSemester === semester
                            ? "bg-[#c69323] text-white hover:bg-[#926a15]"
                            : "text-gray-600 border-gray-300",
                        )}
                        onClick={() => handleSemesterChange(semester)}
                        title={semester}
                    >
                        {semester.match(/\d+/)?.[0] || semester.charAt(0)} {/* Extract number or first letter */}
                    </Button>
                    ))}
                </div>
                )}

                 {/* Stream indicator (optional) */}
                 {streams.length > 0 && selectedSemester && (
                      <div className="mt-2 text-xs text-gray-500" title="Stream selection available in expanded view">
                         Str
                      </div>
                 )}
            </div>
            </ScrollArea>
        </div>
    )
  }

  // Expanded view rendering
  return (
    <div className="flex flex-col h-full border-r border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-200">
          <a href="/dashboard">
            <h2 className="text-lg font-semibold text-[#c69323]">{process.env.NEXT_PUBLIC_PROJECT_NAME}</h2>
            <p className="text-xs text-gray-600 dark:text-gray-300">Go back to home</p>
          </a>          
      </div>
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
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 block mb-1">College</label>
            <Select value={selectedCollegeIndex?.toString() ?? ""} onValueChange={handleCollegeChange}>
              <SelectTrigger className="w-full h-9 text-sm">
                <SelectValue placeholder="Select College" />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((college, index) => (
                  <SelectItem key={`${college.name}-${index}`} value={index.toString()} className="text-sm">
                    {college.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Department Selector */}
          {selectedCollegeIndex !== null && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">Department</label>
              <Select
                value={selectedDeptIndex?.toString() ?? ""}
                onValueChange={handleDeptChange}
                disabled={departments.length === 0}
              >
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept, index) => (
                    <SelectItem key={`${dept.name}-${index}`} value={index.toString()} className="text-sm">
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Year Selector */}
          {selectedDeptIndex !== null && years.length > 0 && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">Year</label>
              <div className="grid grid-cols-2 gap-2">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    className={cn(
                        "text-sm h-9 justify-start px-3 font-normal", // Left align text
                        selectedYear === year
                        ? "bg-[#c69323] text-white hover:bg-[#7c5b13]"
                        : "text-gray-800 border-gray-300 hover:bg-gray-50"
                    )}
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
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">Semester</label>
              <div className="grid grid-cols-2 gap-2">
                {semesters.map((semester) => (
                  <Button
                    key={semester}
                    variant={selectedSemester === semester ? "default" : "outline"}
                     className={cn(
                        "text-sm h-9 justify-start px-3 font-normal",
                         selectedSemester === semester
                         ? "bg-[#c69323] text-white hover:bg-[#7c5b14]"
                         : "text-gray-800 border-gray-300 hover:bg-gray-50"
                     )}
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
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">Stream</label>
              <Select value={selectedStream} onValueChange={handleStreamChange}>
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="Select Stream" />
                </SelectTrigger>
                <SelectContent>
                  {streams.map((stream) => (
                    <SelectItem key={stream} value={stream} className="text-sm">
                      {stream}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Course List */}
          {selectedSemester && courses.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="h-4 w-4 text-[#c69323]" />
                <h3 className="text-sm font-medium text-gray-800">Available Courses</h3>
              </div>
              <Accordion type="single" collapsible className="w-full space-y-1">
                {/* Handle both string[] and CourseObject[] */}
                {(courses as Array<any>).map((courseItem, index) => {
                  // If courseItem is a string, treat as a message or course name
                  if (typeof courseItem === "string") {
                    return (
                      <AccordionItem key={`string-${index}`} value={`item-${index}`} className="border-none">
                        <AccordionTrigger className="text-sm py-1.5 px-2 hover:no-underline hover:bg-gray-100 rounded-md text-left font-normal leading-snug">
                          {courseItem}
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <div className="px-2 pt-1 pb-2 text-xs text-gray-600 bg-gray-50 rounded-b-md">
                            <p className="mb-2 italic">
                              No additional details provided.
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  }
                  // Otherwise, assume courseItem is a CourseObject
                  const courseName = courseItem.name;
                  const courseKey = courseItem.code;
                  return (
                    <AccordionItem key={`${courseKey}-${index}`} value={`item-${index}`} className="border-none">
                      <AccordionTrigger className="text-sm py-1.5 px-2 hover:no-underline hover:bg-gray-100 rounded-md text-left font-normal leading-snug">
                        {courseName}
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <div className="px-2 pt-1 pb-2 text-xs text-gray-600 bg-gray-50 rounded-b-md">
                          <p className="mb-1 text-gray-500">Code: {courseItem.code}</p>
                          <p className="mb-2 italic">
                            Further details can be shown here.
                          </p>
                          {onSelect && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-[#c69323] border-[#c69323] hover:bg-blue-50 hover:text-[#ac7a10]"
                              onClick={() => handleCourseSelect(courseItem)}
                            >
                              View Course Details
                            </Button>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          )}

          {/* Empty State / Prompt */}
          {/* Show prompt only if a college is selected but subsequent selections are missing */}
           {(selectedCollegeIndex !== null && (!selectedSemester || courses.length === 0 || (streams.length > 0 && !selectedStream))) && (
            <div className="mt-6 p-3 text-center text-xs text-gray-500 bg-gray-50 rounded-md border border-dashed border-gray-300">
              {selectedDeptIndex === null
                ? "Please select a department."
                : !selectedYear
                  ? "Please select a year."
                  : !selectedSemester
                    ? "Please select a semester."
                    : streams.length > 0 && !selectedStream
                      ? "Please select a stream."
                      : courses.length === 0 && selectedSemester // Only show "no courses" if semester is selected
                       ? "No courses found for this selection."
                       : "Continue selecting options above." /* Fallback */}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

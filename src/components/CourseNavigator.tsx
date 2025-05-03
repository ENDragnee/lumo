"use client"

import { useState, useMemo } from "react"
import { courseData } from "../app/hooks/courseData" // Assuming data is in this file

function CourseNavigator() {
  const [selectedCollegeIndex, setSelectedCollegeIndex] = useState(null)
  const [selectedDeptIndex, setSelectedDeptIndex] = useState(null)
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedStream, setSelectedStream] = useState("") // For streams

  // --- Memoized Derived State ---
  // Avoid recalculating these on every render
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
      !departments[selectedDeptIndex]?.coursesByYearSemester?.[selectedYear as keyof typeof departments[selectedDeptIndex]["coursesByYearSemester"]]
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
      return [] // Not a stream-based semester or no semester selected
    }
    return Object.keys(semestersAndStreams[selectedSemester])
  }, [semestersAndStreams, selectedSemester])

  const courses = useMemo(() => {
    if (!selectedSemester || !semestersAndStreams[selectedSemester]) return []

    const semesterData = semestersAndStreams[selectedSemester]

    if (streams.length > 0) {
      // Handle streams
      if (!selectedStream || !semesterData[selectedStream]) return ["Please select a stream."]
      return semesterData[selectedStream]
    } else if (Array.isArray(semesterData)) {
      // Handle non-streamed semesters (direct array of courses)
      return semesterData
    }
    return [] // Should not happen with correct data structure
  }, [semestersAndStreams, selectedSemester, streams, selectedStream])

  // --- Event Handlers ---
  const handleCollegeChange = (event) => {
    const index = event.target.value ? Number.parseInt(event.target.value, 10) : null
    setSelectedCollegeIndex(index)
    setSelectedDeptIndex(null) // Reset subsequent selections
    setSelectedYear("")
    setSelectedSemester("")
    setSelectedStream("")
  }

  const handleDeptChange = (event) => {
    const index = event.target.value ? Number.parseInt(event.target.value, 10) : null
    setSelectedDeptIndex(index)
    setSelectedYear("") // Reset subsequent selections
    setSelectedSemester("")
    setSelectedStream("")
  }

  const handleYearChange = (year) => {
    setSelectedYear(year)
    setSelectedSemester("") // Reset semester and stream
    setSelectedStream("")
  }

  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester)
    // Reset stream only if the new semester doesn't have streams or is different
    if (
      !semestersAndStreams[semester] ||
      typeof semestersAndStreams[semester] !== "object" ||
      Array.isArray(semestersAndStreams[semester])
    ) {
      setSelectedStream("")
    } else if (streams.length > 0 && !selectedStream) {
      // If streams exist but none selected yet, don't auto-clear (let user pick)
    } else if (streams.length === 0) {
      setSelectedStream("") // Clear stream if new semester has no streams
    }
  }

  const handleStreamChange = (event) => {
    setSelectedStream(event.target.value)
  }

  // --- Rendering Logic ---
  return (
    <div className="font-sans text-base leading-normal text-gray-800 bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center text-blue-700">AASTU Course Navigator</h1>

      {/* --- Selection Controls --- */}
      <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-gray-300">
        {/* College Selector */}
        <div className="flex-1 basis-[180px] min-w-[150px]">
          <label htmlFor="college-select" className="block font-medium mb-1 text-sm text-gray-600">
            College:
          </label>
          <select
            id="college-select"
            value={selectedCollegeIndex ?? ""}
            onChange={handleCollegeChange}
            className="w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-[0.95rem] text-gray-800 cursor-pointer transition-all focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">-- Select College --</option>
            {colleges.map((college, index) => (
              <option key={college.name} value={index}>
                {college.name}
              </option>
            ))}
          </select>
        </div>

        {/* Department Selector */}
        {selectedCollegeIndex !== null && (
          <div className="flex-1 basis-[180px] min-w-[150px]">
            <label htmlFor="dept-select" className="block font-medium mb-1 text-sm text-gray-600">
              Department:
            </label>
            <select
              id="dept-select"
              value={selectedDeptIndex ?? ""}
              onChange={handleDeptChange}
              disabled={selectedCollegeIndex === null}
              className="w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-[0.95rem] text-gray-800 cursor-pointer transition-all focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept, index) => (
                <option key={dept.name} value={index}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Year Selector (Using Tabs/Buttons for better UX) */}
        {selectedDeptIndex !== null && years.length > 0 && (
          <div className="basis-full mt-2">
            <span className="block font-medium mb-1 text-sm text-gray-600">Year:</span>
            <div className="flex flex-wrap gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`py-2 px-3 border rounded-md text-center flex-grow text-[0.95rem] transition-colors ${
                    selectedYear === year
                      ? "bg-blue-700 text-white border-blue-700 font-medium"
                      : "bg-gray-200 border-transparent hover:bg-gray-300"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Semester Selector (Using Tabs/Buttons) */}
        {selectedYear && semesters.length > 0 && (
          <div className="basis-full mt-2">
            <span className="block font-medium mb-1 text-sm text-gray-600">Semester:</span>
            <div className="flex flex-wrap gap-2">
              {semesters.map((semester) => (
                <button
                  key={semester}
                  onClick={() => handleSemesterChange(semester)}
                  className={`py-2 px-3 border rounded-md text-center flex-grow text-[0.95rem] transition-colors ${
                    selectedSemester === semester
                      ? "bg-blue-700 text-white border-blue-700 font-medium"
                      : "bg-gray-200 border-transparent hover:bg-gray-300"
                  }`}
                >
                  {semester.replace("Semester ", "Sem ")} {/* Shorten label */}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stream Selector (Conditional) */}
        {streams.length > 0 && selectedSemester && (
          <div className="flex-1 basis-[180px] min-w-[150px]">
            <label htmlFor="stream-select" className="block font-medium mb-1 text-sm text-gray-600">
              Stream:
            </label>
            <select
              id="stream-select"
              value={selectedStream}
              onChange={handleStreamChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-[0.95rem] text-gray-800 cursor-pointer transition-all focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">-- Select Stream --</option>
              {streams.map((stream) => (
                <option key={stream} value={stream}>
                  {stream}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* --- Course Display Area --- */}
      <div className="mt-4 p-4 bg-white rounded-md border border-gray-300 min-h-[150px]">
        {selectedSemester && courses.length > 0 ? (
          <>
            <h2 className="text-xl font-medium mb-2 text-gray-800 border-b border-gray-300 pb-2">
              Courses for {departments[selectedDeptIndex]?.name} - {selectedYear} - {selectedSemester}
              {selectedStream ? ` (${selectedStream})` : ""}
            </h2>
            <ul className="list-none p-0 m-0">
              {courses.map((course, index) => (
                <li
                  key={`${course}-${index}`}
                  className="py-1.5 border-b border-dotted border-gray-300 leading-relaxed text-[0.95rem] last:border-b-0"
                >
                  {course}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-gray-600 italic text-center py-8">
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
                      : "No courses found for this selection or selection incomplete."}
          </p>
        )}
      </div>
    </div>
  )
}

export default CourseNavigator

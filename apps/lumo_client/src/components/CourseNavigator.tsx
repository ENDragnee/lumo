"use client"

import React, { useState, useMemo } from "react"
// Assuming data is in this file and has the structure defined below
// import { courseData } from "../app/hooks/courseData"

// --- Define Interfaces/Types for Course Data Structure ---
// This helps TypeScript understand your data and catch errors

// Assuming courses are represented as simple strings in the final list
type CoursesArray = string[];

// A semester can either have streams (object mapping stream name to courses)
// or just be an array of courses directly.
type StreamData = { [streamName: string]: CoursesArray };
type SemesterData = CoursesArray | StreamData;

// A year maps semester names to semester data
type YearData = { [semesterName: string]: SemesterData };

// A department has a name and course structure by year/semester
type Department = {
  name: string;
  // Using Record<string, YearData> for better type safety on keys
  coursesByYearSemester: Record<string, YearData>;
};

// A college has a name and a list of departments
type College = {
  name: string;
  departments: Department[];
};

// The overall course data structure
type CourseData = {
  colleges: College[];
};

// --- Placeholder Course Data (Replace with your actual import) ---
// You MUST replace this with your actual data from "../app/hooks/courseData"
const courseData: CourseData = {
  colleges: [
    {
      name: "College of Engineering",
      departments: [
        {
          name: "Software Engineering",
          coursesByYearSemester: {
            "Year 2": {
              "Semester I": ["Data Structures", "Algorithms", "Discrete Maths"],
              "Semester II": ["OOP", "Computer Architecture", "Statistics"],
            },
            "Year 3": {
              "Semester I": ["Database Systems", "Operating Systems", "Networks"],
              "Semester II": { // Example with Streams
                 "Software Stream": ["Advanced SWE", "Software Testing"],
                 "AI Stream": ["Intro to AI", "Machine Learning Basics"],
                 "Network Stream": ["Network Security", "Wireless Comms"]
              }
            },
            // ... other years
          },
        },
        {
          name: "Electrical Engineering",
          coursesByYearSemester: {
             "Year 1": {
                 "Semester I": ["Physics I", "Calculus I", "Intro to EE"],
                 "Semester II": ["Physics II", "Calculus II", "Programming Basics"]
             },
             // ... other years
          },
        },
      ],
    },
    {
       name: "College of Natural Sciences",
       departments: [
          {
             name: "Computer Science",
              coursesByYearSemester: {
                 "Year 1": {
                    "Semester I": ["Intro to CS", "Calculus I"],
                    "Semester II": ["Programming I", "Linear Algebra"]
                 }
              }
          }
       ]
    }
    // ... other colleges
  ],
};
// --- End of Placeholder Data ---


function CourseNavigator() {
  // Use explicit types for useState where null is a possible value
  const [selectedCollegeIndex, setSelectedCollegeIndex] = useState<number | null>(null)
  const [selectedDeptIndex, setSelectedDeptIndex] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>("") // Year is a string key
  const [selectedSemester, setSelectedSemester] = useState<string>("") // Semester is a string key
  const [selectedStream, setSelectedStream] = useState<string>("") // Stream is a string key

  // --- Memoized Derived State ---
  const colleges = useMemo(() => courseData.colleges, [])

  const departments = useMemo(() => {
    if (selectedCollegeIndex === null || !colleges[selectedCollegeIndex]) return []
    return colleges[selectedCollegeIndex].departments
  }, [colleges, selectedCollegeIndex])

  const years = useMemo(() => {
    if (selectedDeptIndex === null || !departments[selectedDeptIndex]?.coursesByYearSemester) return []
    // Object.keys returns string[]
    return Object.keys(departments[selectedDeptIndex].coursesByYearSemester)
  }, [departments, selectedDeptIndex])

  // Data for the selected year (contains semesters and their courses/streams)
  const semestersAndStreams = useMemo((): YearData | {} => {
    if (selectedDeptIndex === null || !departments[selectedDeptIndex]?.coursesByYearSemester) {
      return {};
    }
    const coursesByYearSemester = departments[selectedDeptIndex].coursesByYearSemester;

    // Ensure selectedYear is a valid key before accessing
    if (!selectedYear || !(selectedYear in coursesByYearSemester)) {
       return {};
    }
    // Now TS knows selectedYear is a valid key here
    return coursesByYearSemester[selectedYear] ?? {}; // Return the year's data or empty obj
  }, [departments, selectedDeptIndex, selectedYear])

  // Get semester names (keys) from the selected year's data
  const semesters = useMemo(() => Object.keys(semestersAndStreams), [semestersAndStreams])

  // Get stream names if the selected semester has streams
  const streams = useMemo(() => {
    // Ensure semester is selected and its data exists in semestersAndStreams
    if (!selectedSemester || !(selectedSemester in semestersAndStreams)) {
      return [];
    }
     // Assert selectedSemester is a key after the check
    const semesterData = semestersAndStreams[selectedSemester as keyof typeof semestersAndStreams];

    // Check if it's an object (potential streams) and NOT an array (direct courses)
    if (typeof semesterData === "object" && semesterData !== null && !Array.isArray(semesterData)) {
      return Object.keys(semesterData); // These are the stream names
    }
    return []; // Not a stream-based semester
  }, [semestersAndStreams, selectedSemester])

  // Get the final list of courses to display
  const courses = useMemo((): CoursesArray | string[] => { // Can return string array like ["Please select..."]
    // Ensure semester is selected and its data exists
    if (!selectedSemester || !(selectedSemester in semestersAndStreams)) {
      return [];
    }
     // Assert selectedSemester is a key
    const semesterData = semestersAndStreams[selectedSemester as keyof typeof semestersAndStreams];

    if (streams.length > 0) {
      // Handle streams: It must be an object (checked in streams memo)
      // Check if the semesterData is indeed an object (should be if streams.length > 0)
      if (typeof semesterData === 'object' && semesterData !== null && !Array.isArray(semesterData)) {
          // Ensure a stream is selected and is a valid key
          if (!selectedStream || !(selectedStream in semesterData)) {
              return ["Please select a stream."]; // Placeholder message
          }
          // Assert selectedStream is a key
          const streamCourses = semesterData[selectedStream as keyof typeof semesterData];
          // Ensure the result under the stream is actually an array of courses
          return Array.isArray(streamCourses) ? streamCourses : ["Invalid stream data."];
      }
       // This case should ideally not be reached if streams.length > 0
       return ["Data structure error."];
    } else if (Array.isArray(semesterData)) {
      // Handle non-streamed semesters (direct array of courses)
      return semesterData;
    }
    return []; // Default empty case if data structure is unexpected
  }, [semestersAndStreams, selectedSemester, streams, selectedStream])

  // --- Event Handlers (with explicit types) ---
  const handleCollegeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    const index = value ? Number.parseInt(value, 10) : null
    setSelectedCollegeIndex(index)
    setSelectedDeptIndex(null) // Reset subsequent selections
    setSelectedYear("")
    setSelectedSemester("")
    setSelectedStream("")
  }

  const handleDeptChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    const index = value ? Number.parseInt(value, 10) : null
    setSelectedDeptIndex(index)
    setSelectedYear("") // Reset subsequent selections
    setSelectedSemester("")
    setSelectedStream("")
  }

  // Year comes from button click, value is the year string
  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    setSelectedSemester("") // Reset semester and stream
    setSelectedStream("")
  }

   // Semester comes from button click, value is the semester string
  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester)
    // Reset stream *only* if the newly selected semester doesn't have streams
    // or if the semester data is not structured as expected for streams.
    if (!(semester in semestersAndStreams)) {
        setSelectedStream("");
        return;
    }

    const semesterData = semestersAndStreams[semester as keyof typeof semestersAndStreams];
    if (typeof semesterData !== 'object' || semesterData === null || Array.isArray(semesterData)) {
         setSelectedStream(""); // Not stream-based, reset stream
    }
    // If it IS stream based, don't reset the stream yet - let the user pick or keep the old one if valid.
    // The 'streams' memo will update, and the stream selector will show/hide accordingly.
  }

  const handleStreamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
            value={selectedCollegeIndex ?? ""} // Use ?? "" for empty option value
            onChange={handleCollegeChange}
            className="w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-[0.95rem] text-gray-800 cursor-pointer transition-all focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">-- Select College --</option>
            {colleges.map((college, index) => (
              <option key={`${college.name}-${index}`} value={index}> {/* Add index to key for safety if names aren't unique */}
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
              disabled={selectedCollegeIndex === null} // Keep disabled check
              className="w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-[0.95rem] text-gray-800 cursor-pointer transition-all focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept, index) => (
                <option key={`${dept.name}-${index}`} value={index}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Year Selector (Using Tabs/Buttons) */}
        {selectedDeptIndex !== null && years.length > 0 && (
          <div className="basis-full mt-2">
            <span className="block font-medium mb-1 text-sm text-gray-600">Year:</span>
            <div className="flex flex-wrap gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)} // Pass the year string
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
                  onClick={() => handleSemesterChange(semester)} // Pass the semester string
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
        {/* Show if streams exist for the selected semester */}
        {streams.length > 0 && selectedSemester && (
          <div className="flex-1 basis-[180px] min-w-[150px] mt-2"> {/* Added mt-2 for spacing */}
            <label htmlFor="stream-select" className="block font-medium mb-1 text-sm text-gray-600">
              Stream:
            </label>
            <select
              id="stream-select"
              value={selectedStream} // Directly use selectedStream state
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
        {/* Check selectedDeptIndex is not null before accessing department name */}
        {selectedSemester && courses.length > 0 && selectedDeptIndex !== null ? (
          <>
            <h2 className="text-xl font-medium mb-2 text-gray-800 border-b border-gray-300 pb-2">
               {/* Use optional chaining safely */}
              Courses for {departments[selectedDeptIndex]?.name ?? 'Unknown Dept.'} - {selectedYear} - {selectedSemester}
              {selectedStream ? ` (${selectedStream})` : ""}
            </h2>
            <ul className="list-none p-0 m-0">
              {/* Add types for map parameters */}
              {courses.map((course: string, index: number) => (
                <li
                  // Use a more robust key if courses aren't unique strings
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
             {/* Improved placeholder messages */}
            {selectedCollegeIndex === null
              ? "Select a college to begin."
              : selectedDeptIndex === null
                ? "Select a department."
                : !selectedYear
                  ? "Select a year."
                  : !selectedSemester
                    ? "Select a semester."
                    : streams.length > 0 && !selectedStream && selectedSemester // Check semester is selected too
                      ? "Select a stream for the chosen semester."
                      : "No courses found for this selection or selection incomplete."}
          </p>
        )}
      </div>
    </div>
  )
}

export default CourseNavigator
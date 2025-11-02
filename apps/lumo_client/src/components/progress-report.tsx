"use client"

import { useState, useEffect } from "react"

export function ProgressReport() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulating progress increase over time
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1
        return newProgress > 100 ? 100 : newProgress
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-4 left-4 z-50 w-48">
      <div className="bg-white dark:bg-[#4b5162] rounded-full h-2 overflow-hidden">
        <div
          className="bg-[#5294e2] h-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-xs mt-1 text-center dark:text-[#7c818c]">{progress}% Complete</div>
    </div>
  )
}


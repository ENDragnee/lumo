"use client"

import { useState, useEffect } from 'react'

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = `${scrollPx / winHeightPx * 100}%`
      setScrollProgress(parseFloat(scrolled))
    }

    window.addEventListener('scroll', updateScrollProgress)

    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-[#4b5162] z-50">
      <div 
        className="h-full bg-[#5294e2] transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}


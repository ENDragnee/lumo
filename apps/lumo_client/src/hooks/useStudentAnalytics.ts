"use client"

import { useState, useEffect } from "react"

export interface StudentAnalytics {
  totalHours: number
  dailyAverage: number
  streak: number
  weeklyFocus: Record<string, number>
  strugglingTopics: string[]
  subjects: Array<{
    name: string
    proficiency: number
    timeSpent: number
    color: string
  }>
  studyPattern: Array<{
    date: Date
    hours: number
    subjects: string[]
  }>
}

export function useStudentAnalytics(studentId?: string) {
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    const fetchAnalytics = async () => {
      try {
        setLoading(true)

        // Mock API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data - in real app, this would come from your API
        const mockData: StudentAnalytics = {
          totalHours: 127,
          dailyAverage: 2.3,
          streak: 14,
          weeklyFocus: {
            physics: 8.2,
            biotech: 6.5,
            mathematics: 7.1,
            chemistry: 5.8,
          },
          strugglingTopics: ["Rotational Dynamics", "EM Fields", "Organic Synthesis"],
          subjects: [
            { name: "Mathematics", proficiency: 85, timeSpent: 45, color: "bg-blue-500" },
            { name: "Physics", proficiency: 72, timeSpent: 38, color: "bg-green-500" },
            { name: "Chemistry", proficiency: 91, timeSpent: 32, color: "bg-purple-500" },
            { name: "Biology", proficiency: 68, timeSpent: 28, color: "bg-orange-500" },
          ],
          studyPattern: generateStudyPattern(),
        }

        setAnalytics(mockData)
      } catch (err) {
        setError("Failed to fetch analytics data")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [studentId])

  return { analytics, loading, error }
}

function generateStudyPattern() {
  const pattern = []
  const today = new Date()

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    pattern.push({
      date,
      hours: Math.floor(Math.random() * 6),
      subjects: ["Mathematics", "Physics", "Chemistry"].slice(0, Math.floor(Math.random() * 3) + 1),
    })
  }

  return pattern
}

// Data transformation utilities
export function transformAnalyticsForChart(analytics: StudentAnalytics) {
  return {
    subjectMastery: analytics.subjects.map((subject) => ({
      subject: subject.name,
      proficiency: subject.proficiency,
      timeSpent: subject.timeSpent,
    })),
    weeklyTrends: Object.entries(analytics.weeklyFocus).map(([subject, hours]) => ({
      subject,
      hours,
    })),
    studyHeatmap: analytics.studyPattern.map((day) => ({
      date: day.date.toISOString().split("T")[0],
      value: day.hours,
      subjects: day.subjects,
    })),
  }
}

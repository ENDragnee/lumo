"use client"

import { useState, useEffect, useCallback } from "react"
import { useNotificationSystem } from "./useNotificationSystem"

export interface Task {
  id: string
  title: string
  description?: string
  course: string
  courseId: string
  type: "assignment" | "quiz" | "exam" | "study-session" | "project" | "reading" | "lab" | "presentation"
  priority: "low" | "medium" | "high" | "urgent"
  status: "todo" | "in-progress" | "completed" | "overdue"
  dueDate: Date
  startDate?: Date
  estimatedTime: number // in minutes
  progress: number // 0-100
  tags: string[]
  location?: string
  notes?: string
  difficulty: "easy" | "medium" | "hard"
  completed: boolean
  subtasks: Subtask[]
  attachments: Attachment[]
  reminders: Reminder[]
  createdAt: Date
  updatedAt: Date
  createdBy: "user" | "ai"
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface Reminder {
  id: string
  type: "notification" | "email"
  time: Date
  message: string
  sent: boolean
}

export interface TaskFilter {
  course?: string[]
  type?: string[]
  priority?: string[]
  status?: string[]
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  search?: string
}

export interface TaskStats {
  total: number
  completed: number
  inProgress: number
  overdue: number
  completionRate: number
  averageTimePerTask: number
  totalTimeSpent: number
}

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<TaskFilter>({})
  const { addNotification } = useNotificationSystem()

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Quantum Mechanics Problem Set 3",
        description: "Complete problems 1-15 from chapter 4",
        course: "Physics",
        courseId: "physics-101",
        type: "assignment",
        priority: "high",
        status: "todo",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        estimatedTime: 180,
        progress: 0,
        tags: ["quantum", "homework"],
        difficulty: "hard",
        completed: false,
        subtasks: [
          { id: "s1", title: "Read chapter 4", completed: true },
          { id: "s2", title: "Solve problems 1-5", completed: false },
          { id: "s3", title: "Solve problems 6-10", completed: false },
          { id: "s4", title: "Solve problems 11-15", completed: false },
        ],
        attachments: [],
        reminders: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "user",
      },
      {
        id: "2",
        title: "Organic Chemistry Quiz",
        description: "Quiz on alkenes and alkynes",
        course: "Chemistry",
        courseId: "chemistry-101",
        type: "quiz",
        priority: "high",
        status: "todo",
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        estimatedTime: 60,
        progress: 25,
        tags: ["organic", "quiz"],
        difficulty: "medium",
        completed: false,
        subtasks: [],
        attachments: [],
        reminders: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "user",
      },
      {
        id: "3",
        title: "Vector Calculus Review",
        description: "Review for upcoming exam",
        course: "Mathematics",
        courseId: "math-101",
        type: "study-session",
        priority: "medium",
        status: "in-progress",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        estimatedTime: 120,
        progress: 60,
        tags: ["calculus", "review"],
        difficulty: "medium",
        completed: false,
        subtasks: [],
        attachments: [],
        reminders: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "user",
      },
    ]

    setTimeout(() => {
      setTasks(mockTasks)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter.course && !filter.course.includes(task.courseId)) return false
    if (filter.type && !filter.type.includes(task.type)) return false
    if (filter.priority && !filter.priority.includes(task.priority)) return false
    if (filter.status && !filter.status.includes(task.status)) return false
    if (filter.tags && !filter.tags.some((tag) => task.tags.includes(tag))) return false
    if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) return false
    if (filter.dateRange) {
      const taskDate = new Date(task.dueDate)
      if (taskDate < filter.dateRange.start || taskDate > filter.dateRange.end) return false
    }
    return true
  })

  // Calculate stats
  const stats: TaskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
    completionRate: tasks.length > 0 ? (tasks.filter((t) => t.completed).length / tasks.length) * 100 : 0,
    averageTimePerTask: tasks.length > 0 ? tasks.reduce((sum, t) => sum + t.estimatedTime, 0) / tasks.length : 0,
    totalTimeSpent: tasks.reduce((sum, t) => sum + (t.estimatedTime * t.progress) / 100, 0),
  }

  const addTask = useCallback(
    (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "progress">) => {
      const newTask: Task = {
        ...taskData,
        id: `task_${Date.now()}`,
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setTasks((prev) => [...prev, newTask])

      // Add notification
      // --- FIX START ---
      addNotification({
        type: "system",
        priority: "medium",
        title: "Task Created",
        message: `"${newTask.title}" has been added to your plan`,
        icon: "📝",
        actionable: true,
        actions: [
          {
            label: "View Task",
            action: `/tasks/${newTask.id}`,
            style: "primary",
          },
        ],
      })
      // --- FIX END ---
    },
    [addNotification],
  )

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...updates,
                updatedAt: new Date(),
              }
            : task,
        ),
      )

      // Add notification for important updates
      if (updates.status === "completed") {
        const task = tasks.find((t) => t.id === taskId)
        if (task) {
          // --- FIX START ---
          addNotification({
            type: "achievement",
            priority: "high",
            title: "Task Completed! 🎉",
            message: `Great job completing "${task.title}"`,
            icon: "🎉",
            actionable: false,
          })
          // --- FIX END ---
        }
      }
    },
    [tasks, addNotification],
  )

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }, [])

  const toggleTaskCompletion = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId)
      if (task) {
        updateTask(taskId, {
          completed: !task.completed,
          status: !task.completed ? "completed" : "todo",
          progress: !task.completed ? 100 : 0,
        })
      }
    },
    [tasks, updateTask],
  )

  const updateTaskProgress = useCallback(
    (taskId: string, progress: number) => {
      const task = tasks.find((t) => t.id === taskId)
      if (task) {
        let newStatus = task.status
        if (progress === 100) {
          newStatus = "completed"
        } else if (progress > 0) {
          newStatus = "in-progress"
        } else {
          newStatus = "todo"
        }

        updateTask(taskId, {
          progress,
          status: newStatus,
          completed: progress === 100,
        })
      }
    },
    [tasks, updateTask],
  )

  const getTasksByDate = useCallback(
    (date: Date) => {
      return tasks.filter((task) => {
        const taskDate = new Date(task.dueDate)
        return (
          taskDate.getDate() === date.getDate() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getFullYear() === date.getFullYear()
        )
      })
    },
    [tasks],
  )

  const getUpcomingTasks = useCallback(
    (days: number) => {
      const now = new Date()
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
      return tasks.filter((task) => {
        const taskDate = new Date(task.dueDate)
        return taskDate >= now && taskDate <= futureDate && !task.completed
      })
    },
    [tasks],
  )

  // Auto-update overdue tasks
  useEffect(() => {
    const updateOverdueTasks = () => {
      const now = new Date()
      setTasks((prev) =>
        prev.map((task) => {
          if (new Date(task.dueDate) < now && task.status !== "completed" && task.status !== "overdue") {
            return { ...task, status: "overdue" as const, updatedAt: new Date() }
          }
          return task
        }),
      )
    }

    const interval = setInterval(updateOverdueTasks, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  return {
    tasks: filteredTasks,
    loading,
    stats,
    filter,
    setFilter,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    updateTaskProgress,
    getTasksByDate,
    getUpcomingTasks,
  }
}

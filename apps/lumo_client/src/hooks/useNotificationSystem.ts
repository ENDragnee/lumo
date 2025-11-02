"use client"

import { useState, useEffect, useCallback } from "react"

export interface Notification {
  id: string
  type: "reminder" | "achievement" | "motivation" | "deadline" | "streak" | "social" | "system"
  priority: "low" | "medium" | "high" | "urgent"
  title: string
  message: string
  icon: string
  timestamp: Date
  read: boolean
  actionable: boolean
  actions?: Array<{
    label: string
    action: string
    style: "primary" | "secondary" | "danger"
  }>
  metadata?: {
    subject?: string
    courseId?: string
    achievementId?: string
    streakCount?: number
    deadline?: Date
  }
  scheduledFor?: Date
  expiresAt?: Date
}

export interface NotificationPreferences {
  studyReminders: boolean
  achievements: boolean
  deadlines: boolean
  streaks: boolean
  social: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  frequency: "immediate" | "batched" | "daily"
}

export function useNotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    studyReminders: true,
    achievements: true,
    deadlines: true,
    streaks: true,
    social: true,
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00",
    },
    frequency: "immediate",
  })
  const [unreadCount, setUnreadCount] = useState(0)
  const [permission, setPermission] = useState<NotificationPermission>("default")

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === "granted"
    }
    return false
  }, [])

  // Check if we're in quiet hours
  const isQuietHours = useCallback(() => {
    if (!preferences.quietHours.enabled) return false

    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const startTime =
      Number.parseInt(preferences.quietHours.start.split(":")[0]) * 60 +
      Number.parseInt(preferences.quietHours.start.split(":")[1])
    const endTime =
      Number.parseInt(preferences.quietHours.end.split(":")[0]) * 60 +
      Number.parseInt(preferences.quietHours.end.split(":")[1])

    if (startTime > endTime) {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime
    } else {
      return currentTime >= startTime && currentTime <= endTime
    }
  }, [preferences.quietHours])

  // Send browser notification
  const sendBrowserNotification = useCallback(
    (notification: Notification) => {
      if (permission === "granted" && !isQuietHours()) {
        const browserNotification = new Notification(notification.title, {
          body: notification.message,
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          tag: notification.id,
          requireInteraction: notification.priority === "urgent",
          silent: notification.priority === "low",
        })

        browserNotification.onclick = () => {
          window.focus()
          browserNotification.close()
        }

        // Auto-close after 5 seconds for non-urgent notifications
        if (notification.priority !== "urgent") {
          setTimeout(() => browserNotification.close(), 5000)
        }
      }
    },
    [permission, isQuietHours],
  )

  // Add notification
  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        read: false,
      }

      setNotifications((prev) => [newNotification, ...prev])

      // Send browser notification if enabled
      if (preferences[notification.type as keyof NotificationPreferences] !== false) {
        sendBrowserNotification(newNotification)
      }

      return newNotification.id
    },
    [preferences, sendBrowserNotification],
  )

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }, [])

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }, [])

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Update unread count
  useEffect(() => {
    const count = notifications.filter((notif) => !notif.read).length
    setUnreadCount(count)
  }, [notifications])

  // Initialize with mock notifications and set up periodic checks
  useEffect(() => {
    // Request permission on first load
    requestPermission()

    // Mock initial notifications
    const initialNotifications: Notification[] = [
      {
        id: "welcome",
        type: "system",
        priority: "medium",
        title: "Welcome to Smart Notifications!",
        message: "We'll help you stay on track with your studies",
        icon: "🎉",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        actionable: false,
      },
      {
        id: "streak_7",
        type: "streak",
        priority: "high",
        title: "7-Day Study Streak! 🔥",
        message: "You're on fire! Keep up the amazing consistency.",
        icon: "🔥",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        actionable: true,
        actions: [
          { label: "Share Achievement", action: "share", style: "primary" },
          { label: "View Stats", action: "view_stats", style: "secondary" },
        ],
        metadata: { streakCount: 7 },
      },
    ]

    setNotifications(initialNotifications)

    // Set up periodic notification checks
    const checkInterval = setInterval(() => {
      generateContextualNotifications()
    }, 30000) // Check every 30 seconds

    return () => clearInterval(checkInterval)
  }, [])

  // Generate contextual notifications based on current time and user behavior
  const generateContextualNotifications = useCallback(() => {
    const now = new Date()
    const hour = now.getHours()
    const dayOfWeek = now.getDay()

    // Study reminder notifications
    if (preferences.studyReminders && !isQuietHours()) {
      // Morning motivation (8-10 AM)
      if (hour >= 8 && hour <= 10 && Math.random() < 0.1) {
        addNotification({
          type: "motivation",
          priority: "medium",
          title: "Good Morning! Ready to Learn?",
          message: "Your peak focus time is approaching. Physics awaits!",
          icon: "☀️",
          actionable: true,
          actions: [
            { label: "Start Study Session", action: "start_session", style: "primary" },
            { label: "View Schedule", action: "view_schedule", style: "secondary" },
          ],
          metadata: { subject: "Physics" },
        })
      }

      // Afternoon reminder (2-4 PM)
      if (hour >= 14 && hour <= 16 && Math.random() < 0.1) {
        addNotification({
          type: "reminder",
          priority: "medium",
          title: "Perfect Time for Chemistry Review",
          message: "Your afternoon focus window is ideal for memorization tasks",
          icon: "🧪",
          actionable: true,
          actions: [
            { label: "Start Review", action: "start_review", style: "primary" },
            { label: "Snooze 30min", action: "snooze", style: "secondary" },
          ],
          metadata: { subject: "Chemistry" },
        })
      }

      // Evening wrap-up (7-9 PM)
      if (hour >= 19 && hour <= 21 && Math.random() < 0.1) {
        addNotification({
          type: "reminder",
          priority: "low",
          title: "Time to Review Today's Learning",
          message: "Quick review sessions improve retention by 67%",
          icon: "📚",
          actionable: true,
          actions: [
            { label: "Quick Review", action: "quick_review", style: "primary" },
            { label: "Skip Today", action: "skip", style: "secondary" },
          ],
        })
      }
    }

    // Weekend motivation
    if ((dayOfWeek === 0 || dayOfWeek === 6) && hour >= 10 && hour <= 12 && Math.random() < 0.05) {
      addNotification({
        type: "motivation",
        priority: "low",
        title: "Weekend Learning Opportunity",
        message: "Even 30 minutes today keeps you ahead of the curve",
        icon: "🌟",
        actionable: true,
        actions: [
          { label: "Quick Session", action: "weekend_session", style: "primary" },
          { label: "Plan Monday", action: "plan_week", style: "secondary" },
        ],
      })
    }
  }, [preferences, isQuietHours, addNotification])

  // Trigger specific notification types
  const triggerAchievement = useCallback(
    (achievement: {
      title: string
      description: string
      icon: string
      type: "streak" | "completion" | "mastery" | "milestone"
      metadata?: any
    }) => {
      addNotification({
        type: "achievement",
        priority: "high",
        title: achievement.title,
        message: achievement.description,
        icon: achievement.icon,
        actionable: true,
        actions: [
          { label: "View Achievement", action: "view_achievement", style: "primary" },
          { label: "Share", action: "share", style: "secondary" },
        ],
        metadata: achievement.metadata,
      })
    },
    [addNotification],
  )

  const triggerDeadlineReminder = useCallback(
    (deadline: {
      title: string
      subject: string
      dueDate: Date
      priority: "low" | "medium" | "high" | "urgent"
    }) => {
      const timeUntil = deadline.dueDate.getTime() - Date.now()
      const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60))

      let message = ""
      if (hoursUntil <= 2) {
        message = `Due in ${hoursUntil} hours! Time to focus.`
      } else if (hoursUntil <= 24) {
        message = `Due tomorrow. Make sure you're prepared.`
      } else {
        message = `Due in ${Math.floor(hoursUntil / 24)} days. Stay on track.`
      }

      addNotification({
        type: "deadline",
        priority: deadline.priority,
        title: `${deadline.subject}: ${deadline.title}`,
        message,
        icon: "⏰",
        actionable: true,
        actions: [
          { label: "Start Working", action: "start_assignment", style: "primary" },
          { label: "Set Reminder", action: "set_reminder", style: "secondary" },
        ],
        metadata: {
          subject: deadline.subject,
          deadline: deadline.dueDate,
        },
      })
    },
    [addNotification],
  )

  const triggerStreakNotification = useCallback(
    (streakCount: number) => {
      const milestones = [3, 7, 14, 30, 50, 100]
      const isMilestone = milestones.includes(streakCount)

      if (isMilestone || streakCount % 10 === 0) {
        addNotification({
          type: "streak",
          priority: isMilestone ? "high" : "medium",
          title: `${streakCount}-Day Study Streak! 🔥`,
          message: isMilestone
            ? "Amazing milestone! You're building incredible habits."
            : "Keep the momentum going! Consistency is key to success.",
          icon: "🔥",
          actionable: true,
          actions: [
            { label: "Share Achievement", action: "share_streak", style: "primary" },
            { label: "View Progress", action: "view_progress", style: "secondary" },
          ],
          metadata: { streakCount },
        })
      }
    },
    [addNotification],
  )

  return {
    notifications,
    unreadCount,
    permission,
    preferences,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    requestPermission,
    setPreferences,
    triggerAchievement,
    triggerDeadlineReminder,
    triggerStreakNotification,
  }
}

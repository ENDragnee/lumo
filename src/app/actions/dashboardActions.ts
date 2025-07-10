// app/actions/dashboardActions.ts
"use server"

import { isValidObjectId } from "mongoose"
import connectDB from "@/lib/mongodb" // Assuming mongo.ts is in lib
import Task, { ITask } from "@/models/Task"

// Helper to get the start of a given day (00:00:00)
function getStartOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Fetches and processes all necessary data for the user's dashboard.
 * @param userId - The MongoDB ObjectId of the user as a string.
 * @returns An object containing data for the 'For You' and 'Weekly Activity' sections.
 */
export async function getDashboardData(userId: string) {
  try {
    if (!userId || !isValidObjectId(userId)) {
      throw new Error("A valid User ID is required.")
    }

    await connectDB()

    // 1. Fetch all 'in-progress' tasks to determine Focus Area and Up Next
    const inProgressTasks: ITask[] = await Task.find({
      userId,
      status: "in-progress",
    })
      .sort({ progress: "desc" }) // Sort by progress: highest first
      .lean<ITask[]>() // Use .lean() for performance; returns plain JS objects

    // 2. Determine "Up Next" (second highest progress) and "Focus Area" (lowest progress)
    let upNext = null
    // If there are 2 or more tasks, "Up Next" is the one with the second-highest progress.
    if (inProgressTasks.length > 1) {
      const task = inProgressTasks[1]
      upNext = {
        subject: task.course || "General",
        title: task.title,
        progress: task.progress,
        timeRemaining: "N/A", // This would require more complex data in the Task model
      }
    } else if (inProgressTasks.length === 1) {
      // If there's only one task, it becomes the "Up Next" as a fallback.
      const task = inProgressTasks[0]
      upNext = {
        subject: task.course || "General",
        title: task.title,
        progress: task.progress,
        timeRemaining: "N/A",
      }
    }

    let focusArea = null
    // The "Focus Area" is the task with the lowest progress.
    if (inProgressTasks.length > 0) {
      // Since it's sorted descending, the last item has the lowest progress.
      const task = inProgressTasks[inProgressTasks.length - 1]
      focusArea = {
        subject: task.course || "General",
        reason: `Low progress in "${task.title}". We've gathered materials to help.`,
        confidence: task.progress,
      }
    }

    // 3. Calculate Weekly Goal
    const startOfWeek = getStartOfDay(new Date())
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()) // Set to last Sunday

    const completedThisWeek = await Task.countDocuments({
      userId,
      status: "completed",
      updatedAt: { $gte: startOfWeek },
    })

    // A simple goal: count all non-completed tasks as part of the total goal
    const totalGoalTasks = await Task.countDocuments({
      userId,
      status: { $ne: "completed" },
    })
    
    const weeklyGoal = {
      completed: completedThisWeek,
      total: totalGoalTasks > 0 ? totalGoalTasks : 5, // Default to 5 if no tasks exist
      description: "Tasks this week",
    }

    // 4. Calculate Weekly Activity (tasks completed per day for the last 7 days)
    const sevenDaysAgo = getStartOfDay(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))

    const completedLast7Days: ITask[] = await Task.find({
      userId,
      status: 'completed',
      updatedAt: { $gte: sevenDaysAgo }
    }).lean<ITask[]>()

    const activity = Array(7).fill(0)
    const today = getStartOfDay(new Date())

    completedLast7Days.forEach(task => {
      const taskCompletionDate = getStartOfDay(task.updatedAt)
      const diffDays = Math.floor((today.getTime() - taskCompletionDate.getTime()) / (1000 * 3600 * 24))
      if (diffDays >= 0 && diffDays < 7) {
        // index 6 is today, 5 is yesterday, etc.
        const activityIndex = 6 - diffDays
        activity[activityIndex]++ // Increment the count of tasks for that day
      }
    })

    // Safely return a serializable object
    return JSON.parse(JSON.stringify({
      upNext,
      focusArea,
      weeklyGoal,
      activity,
      totalTasksCompleted: activity.reduce((a, b) => a + b, 0),
    }))

  } catch (error) {
    console.error("Error in getDashboardData:", error)
    // Return a default, empty state on error to prevent the page from crashing.
    return {
      upNext: null,
      focusArea: null,
      weeklyGoal: { completed: 0, total: 5, description: "Tasks this week" },
      activity: [0, 0, 0, 0, 0, 0, 0],
      totalTasksCompleted: 0,
    }
  }
}

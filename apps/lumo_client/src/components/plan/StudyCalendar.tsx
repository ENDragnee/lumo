// components/plan/StudyCalendar.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfWeek, endOfWeek, eachWeekOfInterval, getDay } from "date-fns"
import type { Task } from "./PlanPage" // Adjust import path

interface StudyCalendarProps {
  tasks: Task[]
  onDateSelect: (date: Date) => void
  onTaskClick: (task: Task) => void
  onAddTask: (date: Date) => void
  selectedDate: Date
}

export function StudyCalendar({ tasks, onDateSelect, onTaskClick, onAddTask, selectedDate }: StudyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getTasksForDate = (date: Date) => {
    // CHANGED: Use new Date() to parse the string date from the API
    return tasks.filter((task) => isSameDay(new Date(task.dueDate), date))
  }

  const firstDayOfMonth = startOfMonth(currentMonth);
  // Get the first day of the week for the first day of the month (e.g., Sunday)
  const firstDayOfCalendar = startOfWeek(firstDayOfMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  // Get the last day of the week for the last day of the month (e.g., Saturday)
  const lastDayOfCalendar = endOfWeek(lastDayOfMonth);

  const days = eachDayOfInterval({ start: firstDayOfCalendar, end: lastDayOfCalendar });

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + (direction === 'next' ? 1 : -1), 1));
  }

  return (
    <div className="p-4 space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}><ChevronLeft className="w-4 h-4" /></Button>
           <h2 className="text-xl font-bold text-shadow">{format(currentMonth, "MMMM yyyy")}</h2>
           <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}><ChevronRight className="w-4 h-4" /></Button>
        </div>
        <Button onClick={() => onAddTask(selectedDate)} className="bg-pacific hover:bg-midnight text-frost">
          <Plus className="w-4 h-4 mr-2" /> Add Task
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card className="bg-frost border-cloud">
        <CardContent className="p-2">
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-graphite">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <div key={day} className="py-2">{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((date) => {
              const dayTasks = getTasksForDate(date);
              const isSelected = isSameDay(date, selectedDate);
              const isCurrentDay = isToday(date);
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

              return (
                <div key={date.toISOString()}
                  className={`relative p-2 h-28 border rounded-lg cursor-pointer transition-colors ${
                    isCurrentMonth ? 'bg-frost' : 'bg-cloud/50 text-graphite'
                  } ${isSelected ? 'border-pacific bg-pacific/10' : 'border-cloud'} ${isCurrentDay ? 'ring-2 ring-pacific' : ''}`}
                  onClick={() => onDateSelect(date)}
                >
                  <span className={`text-sm ${isSelected ? 'font-bold text-pacific' : ''}`}>{format(date, "d")}</span>
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
                    {dayTasks.map(task => (
                      <div key={task._id} onClick={(e) => { e.stopPropagation(); onTaskClick(task); }}
                        className={`text-xs p-1 rounded truncate text-shadow ${
                          task.priority === 'urgent' ? 'bg-red-200' :
                          task.priority === 'high' ? 'bg-coral/30' :
                          task.priority === 'medium' ? 'bg-butter/30' : 'bg-sage/30'
                        }`}>
                        {task.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
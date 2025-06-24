// components/plan/TaskList.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  AlertTriangle,
  BookOpen,
} from "lucide-react"
import { format, isToday, isTomorrow, formatDistanceToNowStrict } from "date-fns"
import type { Task } from "./PlanPage" // Adjust import path

interface TaskListProps {
  tasks: Task[]
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
  onTaskDelete: (taskId: string) => void
  onTaskEdit: (task: Task) => void
  onToggleCompletion: (task: Task) => void
  onUpdateProgress: (taskId: string, progress: number) => void
  groupBy: "none" | "course" | "priority" | "status" | "dueDate"
}

export function TaskList({
  tasks,
  onTaskDelete,
  onTaskEdit,
  onToggleCompletion,
  // groupBy prop is available if you wish to re-implement grouping logic
}: TaskListProps) {

  // Helper function to format the due date in a user-friendly way
  const formatDueDate = (dueDateStr: string, status: string) => {
    if (status === 'completed') {
      return `Completed on ${format(new Date(dueDateStr), "MMM d")}`;
    }
    const dueDate = new Date(dueDateStr);
    if (isToday(dueDate)) return "Due today";
    if (isTomorrow(dueDate)) return "Due tomorrow";
    
    const distance = formatDistanceToNowStrict(dueDate, { addSuffix: true });
    
    if (status === 'overdue') {
      return `${formatDistanceToNowStrict(dueDate)} overdue`;
    }
    return `Due ${distance}`;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "border-red-500 bg-red-500/10 text-red-700";
      case "high": return "border-coral bg-coral/10 text-coral";
      case "medium": return "border-butter bg-butter/10 text-amber-700";
      case "low": return "border-sage bg-sage/10 text-sage";
      default: return "border-cloud bg-cloud/50 text-graphite";
    }
  }

  if (tasks.length === 0) {
    return (
      <Card className="bg-frost border-0 shadow-sm">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-pacific/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-pacific" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-shadow">No Tasks Found</h3>
          <p className="text-graphite max-w-md mx-auto">
            Try creating a new task or clearing your filters to see your to-do list.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 p-4">
      {tasks.map((task) => (
        <Card key={task._id} className="bg-frost border border-cloud hover:border-pacific/30 transition-all group">
          <CardContent className="p-4 flex items-start gap-4">
            <Checkbox
              id={`task-${task._id}`}
              checked={task.status === 'completed'}
              onCheckedChange={() => onToggleCompletion(task)}
              className="mt-1 w-5 h-5 border-2 border-cloud data-[state=checked]:bg-success data-[state=checked]:border-success"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <label 
                  htmlFor={`task-${task._id}`} 
                  className={`font-semibold text-shadow cursor-pointer ${task.status === 'completed' ? 'line-through text-graphite/60' : ''}`}
                >
                  {task.title}
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -my-2 -mr-2 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-frost border-cloud">
                    <DropdownMenuItem onClick={() => onTaskEdit(task)} className="focus:bg-cloud">
                      <Edit className="w-4 h-4 mr-2" />Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleCompletion(task)} className="focus:bg-cloud">
                      {task.status === 'completed' ? 
                        <><Circle className="w-4 h-4 mr-2" />Mark Incomplete</> : 
                        <><CheckCircle2 className="w-4 h-4 mr-2" />Mark Complete</>
                      }
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-cloud" />
                    <DropdownMenuItem onClick={() => onTaskDelete(task._id)} className="text-coral focus:text-coral focus:bg-coral/10">
                      <Trash2 className="w-4 h-4 mr-2" />Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {task.description && <p className="text-sm text-graphite mt-1">{task.description}</p>}
              
              <div className="flex items-center gap-4 text-xs text-graphite mt-2 flex-wrap">
                <Badge variant="outline" className={`capitalize ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </Badge>
                {task.course && <Badge variant="secondary" className="bg-cloud text-graphite">{task.course}</Badge>}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3"/>
                  <span className={task.status === "overdue" ? "text-coral font-medium" : ""}>
                     {formatDueDate(
                        typeof task.dueDate === "string"
                          ? task.dueDate
                          : task.dueDate.toISOString(),
                        task.status
                      )}
                  </span>
                </div>
              </div>
              
              {task.status === 'in-progress' && task.progress > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-medium text-graphite">{task.progress}% complete</span>
                  <Progress value={task.progress} className="h-1.5 mt-1" />
                </div>
              )}

              {task.status === 'overdue' && (
                <div className="mt-3 p-2 bg-coral/10 rounded-lg border border-coral/20 flex items-center gap-2 text-sm text-coral">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">This task is overdue!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
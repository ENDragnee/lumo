// app/plan/page.tsx (or your component's location)
"use client"

import { useState, useEffect, useMemo, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  AlertTriangle,
  Plus,
  Search,
  BarChart3,
  List,
  CalendarDays,
  TrendingUp,
  BookOpen,
  Clock,
  Target,
  CheckCircle2,
  Filter,
} from "lucide-react"
import { toast } from "sonner"; // Assuming you have a toast library like sonner
import { TaskForm } from "./TaskForm" 
import { TaskList } from "./TaskList"
import { StudyCalendar } from "./StudyCalendar"

// Type matching the Mongoose Task model and API response.
export type Task = {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  course?: string;
  dueDate: Date; // ISO date string from the backend
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
  createdAt: string;
  updatedAt: string;
};

// Data payload for creating/updating tasks.
export type TaskPayload = Omit<Task, '_id' | 'userId' | 'createdAt' | 'updatedAt' | 'status' | 'progress'>;

// Type for URL query filters
export type TaskFilter = {
  search?: string;
  course?: string;
  priority?: string;
  status?: string;
}

// Wrapper component to use Suspense, which is required for useSearchParams
export function PlanPage() {
  return (
    <Suspense fallback={<PlanPageLoadingSkeleton />}>
      <PlanPageContent />
    </Suspense>
  )
}

// The main component logic
function PlanPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- STATE MANAGEMENT ---
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "kanban">("list")
  const [groupBy, setGroupBy] = useState<"none" | "course" | "priority" | "status" | "dueDate">("none")
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // --- API DATA FETCHING ---
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    
    try {
      const response = await fetch(`/api/tasks?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to load tasks", { description: error.message });
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --- API-BASED CRUD FUNCTIONS ---
  const addTask = async (taskData: TaskPayload) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add task');
      }
      await fetchTasks();
      setIsTaskFormOpen(false);
      toast.success("Task Added", { description: `"${taskData.title}" has been created.` });
    } catch (error: any) {
      console.error(error);
      toast.error("Error Adding Task", { description: error.message });
    }
  };

  const updateTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task');
      }
      await fetchTasks();
      if (editingTask?._id === taskId) {
        setEditingTask(null);
        setIsTaskFormOpen(false);
      }
      toast.success("Task Updated", { description: "Your changes have been saved." });
    } catch (error: any) {
      console.error(error);
      toast.error("Error Updating Task", { description: error.message });
    }
  };
  
  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete task');
      }
      await fetchTasks();
      toast.success("Task Deleted", { description: "The task has been successfully removed." });
    } catch (error: any) {
      console.error(error);
      toast.error("Error Deleting Task", { description: error.message });
    }
  };

  const toggleTaskCompletion = (task: Task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    const newProgress = newStatus === 'completed' ? 100 : 0;
    updateTask(task._id, { status: newStatus, progress: newProgress });
  };
  
  const updateTaskProgress = (taskId: string, progress: number) => {
    updateTask(taskId, { progress });
  };

  // --- DERIVED STATE & HELPERS (using useMemo for performance) ---
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const overdue = tasks.filter((t) => t.status === 'overdue').length;
    return {
      total,
      completed,
      overdue,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [tasks]);

  const { todaysTasks, overdueTasks, upcomingTasks } = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(new Date().setHours(23, 59, 59, 999));
    const weekEnd = new Date(new Date().setDate(todayStart.getDate() + 7));

    const todays = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= todayStart && dueDate <= todayEnd && task.status !== 'completed';
    });
    const overdue = tasks.filter(task => task.status === 'overdue');
    const upcoming = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate > todayEnd && dueDate <= weekEnd && task.status !== 'completed';
    });
    return { todaysTasks: todays, overdueTasks: overdue, upcomingTasks: upcoming };
  }, [tasks]);

  // --- EVENT HANDLERS ---
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };
  
  const handleFormSubmit = (formData: TaskPayload) => {
      if (editingTask) {
        updateTask(editingTask._id, formData);
      } else {
        addTask(formData);
      }
  };

  const handleFilterChange = (key: keyof TaskFilter, value: string | undefined) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Use router.replace for a smoother user experience that doesn't push to browser history
    router.replace(`/plan?${newParams.toString()}`);
  };
  
  const clearFilters = () => {
    router.replace('/plan');
  };

  // --- RENDER LOGIC ---
  if (loading && tasks.length === 0) {
    return <PlanPageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-cloud">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-shadow tracking-tight mb-2">Plan</h1>
            <p className="text-graphite">Organize your tasks and manage your study schedule</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-frost rounded-xl p-1 shadow-sm">
              {[
                { id: "list", icon: List, label: "List" },
                { id: "calendar", icon: CalendarDays, label: "Calendar" },
                { id: "kanban", icon: BarChart3, label: "Board" },
              ].map((mode) => (
                <Button
                  key={mode.id}
                  variant={viewMode === mode.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode.id as any)}
                  className={`h-9 px-4 ${
                    viewMode === mode.id
                      ? "bg-pacific text-frost shadow-sm"
                      : "text-graphite hover:text-shadow hover:bg-cloud"
                  }`}
                >
                  <mode.icon className="w-4 h-4 mr-2" />
                  {mode.label}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => { setEditingTask(null); setIsTaskFormOpen(true); }}
              className="bg-pacific hover:bg-midnight text-frost shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-frost border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-pacific/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-pacific" />
              </div>
              <div className="text-2xl font-bold text-shadow mb-1">{stats.total}</div>
              <div className="text-sm text-graphite">Total Tasks</div>
            </CardContent>
          </Card>
          <Card className="bg-frost border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div className="text-2xl font-bold text-shadow mb-1">{stats.completed}</div>
              <div className="text-sm text-graphite">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-frost border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-coral" />
              </div>
              <div className="text-2xl font-bold text-shadow mb-1">{stats.overdue}</div>
              <div className="text-sm text-graphite">Overdue</div>
            </CardContent>
          </Card>
          <Card className="bg-frost border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-butter/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-shadow mb-1">{Math.round(stats.completionRate)}%</div>
              <div className="text-sm text-graphite">Completion Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-frost border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-graphite" />
                <Input
                  placeholder="Search tasks by title or description..."
                  defaultValue={searchParams.get('search') || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
                  className="pl-10 bg-cloud border-0 focus:bg-frost focus:ring-2 focus:ring-pacific/20"
                />
              </div>
              <Select value={searchParams.get('course') || "all"} onValueChange={(value) => handleFilterChange('course', value)}>
                <SelectTrigger className="w-[150px] bg-cloud border-0 focus:bg-frost focus:ring-2 focus:ring-pacific/20"><SelectValue placeholder="All Courses" /></SelectTrigger>
                <SelectContent className="bg-frost border-0 shadow-lg">
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
              <Select value={searchParams.get('priority') || "all"} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger className="w-[130px] bg-cloud border-0 focus:bg-frost focus:ring-2 focus:ring-pacific/20"><SelectValue placeholder="All Priorities" /></SelectTrigger>
                <SelectContent className="bg-frost border-0 shadow-lg">
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={searchParams.get('status') || "all"} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-[130px] bg-cloud border-0 focus:bg-frost focus:ring-2 focus:ring-pacific/20"><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent className="bg-frost border-0 shadow-lg">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              {viewMode === "list" && (
                <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
                  <SelectTrigger className="w-[130px] bg-cloud border-0 focus:bg-frost focus:ring-2 focus:ring-pacific/20"><SelectValue placeholder="Group By" /></SelectTrigger>
                  <SelectContent className="bg-frost border-0 shadow-lg">
                    <SelectItem value="none">No Grouping</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {searchParams.toString() && (
                <Button variant="outline" onClick={clearFilters} className="bg-cloud border-0 hover:bg-graphite hover:text-frost">
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {(todaysTasks.length > 0 || overdueTasks.length > 0 || upcomingTasks.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {todaysTasks.length > 0 && (
              <Card className="bg-pacific/5 border-0 shadow-sm">
                <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><div className="w-8 h-8 bg-pacific/10 rounded-lg flex items-center justify-center"><Calendar className="w-4 h-4 text-pacific" /></div><span className="text-shadow">Due Today</span><Badge className="bg-pacific/20 text-pacific border-0">{todaysTasks.length}</Badge></CardTitle></CardHeader>
                <CardContent className="pt-0"><div className="space-y-2">
                  {todaysTasks.slice(0, 3).map((task) => (
                    <div key={task._id} className="p-3 bg-frost rounded-lg shadow-sm">
                      <div className="font-medium text-shadow text-sm truncate">{task.title}</div>
                      <div className="text-xs text-graphite mt-1">{task.course}</div>
                    </div>
                  ))}
                  {todaysTasks.length > 3 && <div className="text-xs text-center text-pacific font-medium">+{todaysTasks.length - 3} more</div>}
                </div></CardContent>
              </Card>
            )}
            {overdueTasks.length > 0 && (
              <Card className="bg-coral/5 border-0 shadow-sm">
                <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><div className="w-8 h-8 bg-coral/10 rounded-lg flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-coral" /></div><span className="text-shadow">Overdue</span><Badge className="bg-coral/20 text-coral border-0">{overdueTasks.length}</Badge></CardTitle></CardHeader>
                <CardContent className="pt-0"><div className="space-y-2">
                  {overdueTasks.slice(0, 3).map((task) => (
                    <div key={task._id} className="p-3 bg-frost rounded-lg shadow-sm">
                      <div className="font-medium text-shadow text-sm truncate">{task.title}</div>
                      <div className="text-xs text-graphite mt-1">{task.course}</div>
                    </div>
                  ))}
                  {overdueTasks.length > 3 && <div className="text-xs text-center text-coral font-medium">+{overdueTasks.length - 3} more</div>}
                </div></CardContent>
              </Card>
            )}
            {upcomingTasks.length > 0 && (
              <Card className="bg-sage/5 border-0 shadow-sm">
                <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><div className="w-8 h-8 bg-sage/10 rounded-lg flex items-center justify-center"><Clock className="w-4 h-4 text-sage" /></div><span className="text-shadow">This Week</span><Badge className="bg-sage/20 text-sage border-0">{upcomingTasks.length}</Badge></CardTitle></CardHeader>
                <CardContent className="pt-0"><div className="space-y-2">
                  {upcomingTasks.slice(0, 3).map((task) => (
                    <div key={task._id} className="p-3 bg-frost rounded-lg shadow-sm">
                      <div className="font-medium text-shadow text-sm truncate">{task.title}</div>
                      <div className="text-xs text-graphite mt-1">{task.course}</div>
                    </div>
                  ))}
                  {upcomingTasks.length > 3 && <div className="text-xs text-center text-sage font-medium">+{upcomingTasks.length - 3} more</div>}
                </div></CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-frost rounded-xl shadow-sm">
          {viewMode === "list" && (
            <TaskList
              tasks={tasks}
              onTaskUpdate={updateTask}
              onTaskDelete={deleteTask}
              onTaskEdit={handleEditTask}
              onToggleCompletion={toggleTaskCompletion}
              onUpdateProgress={updateTaskProgress}
              groupBy={groupBy}
            />
          )}
          {viewMode === "calendar" && (
            <StudyCalendar
              tasks={tasks}
              onDateSelect={setSelectedDate}
              onTaskClick={handleEditTask}
              onAddTask={(date) => { setSelectedDate(date); setEditingTask(null); setIsTaskFormOpen(true); }}
              selectedDate={selectedDate}
            />
          )}
          {viewMode === "kanban" && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-pacific/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><BookOpen className="w-8 h-8 text-pacific" /></div>
              <h3 className="text-xl font-semibold mb-2 text-shadow">Kanban Board</h3>
              <p className="text-graphite max-w-md mx-auto">Coming soon - drag and drop task management with customizable columns and workflow automation</p>
            </div>
          )}
        </div>

        {/* Task Form */}
        <TaskForm
          key={editingTask?._id || 'new'} // Re-mounts the form when a new task is edited
          isOpen={isTaskFormOpen}
          onOpenChange={(open) => { if (!open) setEditingTask(null); setIsTaskFormOpen(open); }}
          onSubmit={handleFormSubmit}
          initialData={editingTask ? { ...editingTask, dueDate: new Date(editingTask.dueDate) } : { dueDate: selectedDate }}
        />
      </div>
    </div>
  )
}

// A loading skeleton component for initial load
function PlanPageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-cloud p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="h-12 w-32 bg-frost rounded-lg animate-pulse"></div>
          <div className="h-10 w-24 bg-frost rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-frost rounded-xl animate-pulse"></div>
          ))}
        </div>
         <div className="h-24 bg-frost rounded-xl animate-pulse"></div>
         <div className="h-64 bg-frost rounded-xl animate-pulse"></div>
      </div>
    </div>
  )
}
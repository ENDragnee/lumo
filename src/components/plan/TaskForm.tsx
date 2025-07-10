// components/plan/TaskForm.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, Save, AlertCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { TaskPayload, Task } from "./PlanPage" // Adjust this import path if necessary

interface TaskFormProps {
  onSubmit: (task: TaskPayload) => void
  initialData?: Partial<Task> & { dueDate: Date } // Ensures dueDate is a Date object for the calendar
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskForm({ onSubmit, initialData, isOpen, onOpenChange }: TaskFormProps) {
  // State now directly matches the fields we send to the backend.
  const [formData, setFormData] = useState<TaskPayload>({
    title: '',
    description: '',
    course: '',
    dueDate: new Date(), // Default to current date
    priority: 'medium',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // This effect populates the form with existing data when the 'initialData' prop changes
  // which happens when a user clicks 'Edit'. It also resets the form for new tasks.
  useEffect(() => {
    if (initialData?._id) { // Check for _id to confirm it's an existing task
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        course: initialData.course || '',
        dueDate: initialData.dueDate, // The prop provides a Date object
        priority: initialData.priority || 'medium',
      });
    } else {
      // Reset for a new task, using the selectedDate from the calendar if available
      setFormData({
        title: '',
        description: '',
        course: '',
        dueDate: initialData?.dueDate || new Date(),
        priority: 'medium',
      });
    }
  }, [initialData, isOpen]); // Rerun when the dialog opens or the data changes


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    // The `onSubmit` function is passed from the parent `PlanPage`
    onSubmit(formData);
  }
  
  const courses = ["Physics", "Chemistry", "Mathematics", "Biology", "General"];
  const priorities: Task['priority'][] = ["low", "medium", "high", "urgent"];
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="max-w-lg bg-frost border-0 shadow-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-shadow">
            {initialData?._id ? "Edit Task" : "Add New Task"}
          </DialogTitle>
          <DialogDescription className="text-graphite">
            Fill in the details for your task. Fields with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="title" className="text-shadow font-medium">Task Title *</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={cn("bg-cloud border-cloud focus:border-pacific focus:ring-pacific/20", errors.title && "border-coral focus:border-coral")} 
            />
            {errors.title && <p className="text-sm text-coral mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.title}</p>}
          </div>

          <div>
            <Label htmlFor="description" className="text-shadow font-medium">Description</Label>
            <Textarea 
              id="description" 
              value={formData.description || ''} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              className="bg-cloud border-cloud focus:border-pacific focus:ring-pacific/20"
              placeholder="Add some details about the task..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course" className="text-shadow font-medium">Course</Label>
              <Select value={formData.course} onValueChange={(value) => setFormData({ ...formData, course: value })}>
                <SelectTrigger className="bg-cloud border-cloud"><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent className="bg-frost border-cloud">
                  {courses.map((c) => (<SelectItem key={c} value={c} className="focus:bg-cloud">{c}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority" className="text-shadow font-medium">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: Task['priority']) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger className="bg-cloud border-cloud"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-frost border-cloud">
                  {priorities.map((p) => (<SelectItem key={p} value={p} className="capitalize focus:bg-cloud">{p}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="text-shadow font-medium">Due Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn("w-full justify-start text-left font-normal bg-cloud border-cloud", !formData.dueDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-frost border-cloud">
                <Calendar 
                  mode="single" 
                  selected={formData.dueDate} 
                  onSelect={(date) => date && setFormData({ ...formData, dueDate: date })} 
                  initialFocus 
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <DialogFooter className="pt-4 border-t border-cloud">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-cloud">Cancel</Button>
            <Button type="submit" className="bg-pacific hover:bg-midnight text-frost">
              <Save className="w-4 h-4 mr-2" />
              {initialData?._id ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

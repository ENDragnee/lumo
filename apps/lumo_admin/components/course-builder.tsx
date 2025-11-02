"use client"
import { motion, Reorder } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Plus, Edit, Trash2, Eye, Clock, Users, BookOpen } from "lucide-react"

// The Module type can be defined here or imported from a shared types file.
export interface Module {
  id: string
  title: string
  description?: string
  status: "Published" | "Draft" | "archived" // Allow for more statuses if needed
  order: number
  // These fields can be optional if not always present
  duration?: number
  enrolledUsers?: number
}

interface CourseBuilderProps {
  modules: Module[] // It now directly uses the modules prop
  onReorder: (newOrder: Module[]) => void
  onAddModule: () => void // Kept for future implementation
  onEditModule: (moduleId: string) => void
  onDeleteModule: (moduleId: string) => void
}

export function CourseBuilder({ modules, onReorder, onAddModule, onEditModule, onDeleteModule }: CourseBuilderProps) {

  const getStatusColor = (status: Module["status"]) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-700"
      case "Draft":
        return "bg-yellow-100 text-yellow-700"
      case "archived":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Builder</h2>
          <p className="text-gray-600 mt-1">Drag and drop to reorder modules</p>
        </div>
        {/* The add button functionality is handled by the parent component */}
        <Button onClick={onAddModule}>
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>
      
      {/* 
        ✨ FIX: The Reorder.Group now directly uses the `modules` prop for its `values`
        and calls the `onReorder` prop directly as its event handler.
        There is no more internal state in this component.
      */}
      <Reorder.Group axis="y" values={modules} onReorder={onReorder} className="space-y-3">
        {modules.map((module) => (
          <Reorder.Item
            key={module.id}
            value={module}
            className="cursor-grab active:cursor-grabbing bg-white"
            whileDrag={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
          >
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Drag Handle */}
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-700">
                      {module.order + 1}
                    </div>
                  </div>

                  {/* Module Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">{module.title}</h3>
                      <Badge className={getStatusColor(module.status)}>{module.status}</Badge>
                    </div>

                    {module.description && <p className="text-sm text-gray-600 mb-2">{module.description}</p>}
                    
                    {/* Simplified details for organize view */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>Module ID: {module.id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditModule(module.id)}
                      aria-label={`View ${module.title}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditModule(module.id)}
                      aria-label={`Edit ${module.title}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteModule(module.id)}
                      aria-label={`Delete ${module.title}`}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {modules.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
            <p className="text-gray-600 mb-4">You can add modules from the main content page.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

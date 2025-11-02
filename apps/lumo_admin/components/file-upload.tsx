"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, File, X, CheckCircle } from "lucide-react"

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  onUpload?: (files: File[]) => void
}

interface UploadedFile {
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
  id: string
}

export function FileUpload({ accept, multiple = false, maxSize = 10, onUpload }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const fileArray = Array.from(files)
      const validFiles = fileArray.filter((file) => {
        if (maxSize && file.size > maxSize * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`)
          return false
        }
        return true
      })

      const newFiles: UploadedFile[] = validFiles.map((file) => ({
        file,
        progress: 0,
        status: "uploading",
        id: Math.random().toString(36).substr(2, 9),
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])

      // Simulate upload progress
      newFiles.forEach((uploadFile) => {
        const interval = setInterval(() => {
          setUploadedFiles((prev) =>
            prev.map((f) => {
              if (f.id === uploadFile.id) {
                const newProgress = Math.min(f.progress + Math.random() * 30, 100)
                return {
                  ...f,
                  progress: newProgress,
                  status: newProgress === 100 ? "completed" : "uploading",
                }
              }
              return f
            }),
          )
        }, 200)

        setTimeout(() => {
          clearInterval(interval)
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === uploadFile.id ? { ...f, progress: 100, status: "completed" } : f)),
          )
        }, 2000)
      })

      onUpload?.(validFiles)
    },
    [maxSize, onUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Files</h3>
        <p className="text-gray-600 mb-4">Drag and drop your files here, or click to browse</p>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <Button asChild variant="outline">
          <label htmlFor="file-upload" className="cursor-pointer">
            Choose Files
          </label>
        </Button>
        <p className="text-xs text-gray-500 mt-2">Maximum file size: {maxSize}MB</p>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Uploaded Files</h4>
          {uploadedFiles.map((uploadFile) => (
            <motion.div
              key={uploadFile.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white"
            >
              <File className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{uploadFile.file.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        uploadFile.status === "completed"
                          ? "default"
                          : uploadFile.status === "error"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {uploadFile.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {uploadFile.status}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(uploadFile.id)} className="h-6 w-6 p-0">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={uploadFile.progress} className="flex-1 h-2" />
                  <span className="text-xs text-gray-500">{formatFileSize(uploadFile.file.size)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

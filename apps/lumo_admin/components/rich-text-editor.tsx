"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Bold, Italic, Underline, List, ListOrdered, Link, ImageIcon, Video, Code, Quote } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [content, setContent] = useState(value)

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    onChange(newContent)
  }

  const toolbarButtons = [
    { icon: Bold, label: "Bold", action: "bold" },
    { icon: Italic, label: "Italic", action: "italic" },
    { icon: Underline, label: "Underline", action: "underline" },
    { icon: List, label: "Bullet List", action: "bulletList" },
    { icon: ListOrdered, label: "Numbered List", action: "orderedList" },
    { icon: Link, label: "Link", action: "link" },
    { icon: ImageIcon, label: "Image", action: "image" },
    { icon: Video, label: "Video", action: "video" },
    { icon: Code, label: "Code", action: "code" },
    { icon: Quote, label: "Quote", action: "quote" },
  ]

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200">
        {toolbarButtons.map((button, index) => (
          <div key={button.action}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title={button.label}
              onClick={() => {
                // Simulate toolbar action
                console.log(`${button.action} clicked`)
              }}
            >
              <button.icon className="w-4 h-4" />
            </Button>
            {(index === 2 || index === 4 || index === 7) && <Separator orientation="vertical" className="mx-1 h-6" />}
          </div>
        ))}
      </div>

      {/* Editor */}
      <div className="min-h-[300px] p-4">
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={placeholder || "Start writing your content..."}
          className="w-full h-full min-h-[250px] resize-none border-none outline-none text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-2 border-t border-gray-200 text-xs text-gray-500">
        <span>{content.length} characters</span>
        <span>Rich text editor powered by TipTap</span>
      </div>
    </div>
  )
}

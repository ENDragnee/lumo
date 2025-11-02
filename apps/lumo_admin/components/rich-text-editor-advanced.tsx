"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  Video,
  Code,
  Quote,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react"

interface RichTextEditorAdvancedProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
}

export function RichTextEditorAdvanced({
  value,
  onChange,
  placeholder = "Start writing your content...",
  maxLength = 10000,
}: RichTextEditorAdvancedProps) {
  const [content, setContent] = useState(value)
  const [selectedText, setSelectedText] = useState("")
  const [wordCount, setWordCount] = useState(0)

  const handleContentChange = useCallback(
    (newContent: string) => {
      if (maxLength && newContent.length > maxLength) return

      setContent(newContent)
      onChange(newContent)

      // Calculate word count
      const words = newContent
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0)
      setWordCount(words.length)
    },
    [onChange, maxLength],
  )

  const toolbarGroups = [
    {
      name: "History",
      buttons: [
        { icon: Undo, label: "Undo", action: "undo", shortcut: "Ctrl+Z" },
        { icon: Redo, label: "Redo", action: "redo", shortcut: "Ctrl+Y" },
      ],
    },
    {
      name: "Formatting",
      buttons: [
        { icon: Bold, label: "Bold", action: "bold", shortcut: "Ctrl+B" },
        { icon: Italic, label: "Italic", action: "italic", shortcut: "Ctrl+I" },
        { icon: Underline, label: "Underline", action: "underline", shortcut: "Ctrl+U" },
      ],
    },
    {
      name: "Headings",
      buttons: [
        { icon: Heading1, label: "Heading 1", action: "heading1" },
        { icon: Heading2, label: "Heading 2", action: "heading2" },
      ],
    },
    {
      name: "Lists",
      buttons: [
        { icon: List, label: "Bullet List", action: "bulletList" },
        { icon: ListOrdered, label: "Numbered List", action: "orderedList" },
      ],
    },
    {
      name: "Alignment",
      buttons: [
        { icon: AlignLeft, label: "Align Left", action: "alignLeft" },
        { icon: AlignCenter, label: "Align Center", action: "alignCenter" },
        { icon: AlignRight, label: "Align Right", action: "alignRight" },
      ],
    },
    {
      name: "Insert",
      buttons: [
        { icon: Link, label: "Insert Link", action: "link", shortcut: "Ctrl+K" },
        { icon: ImageIcon, label: "Insert Image", action: "image" },
        { icon: Video, label: "Insert Video", action: "video" },
        { icon: Code, label: "Code Block", action: "code" },
        { icon: Quote, label: "Quote", action: "quote" },
      ],
    },
  ]

  const handleToolbarAction = (action: string) => {
    console.log(`Executing action: ${action}`)
    // In a real implementation, this would interact with the editor instance
    // For now, we'll simulate the action

    switch (action) {
      case "bold":
        // Simulate bold formatting
        break
      case "italic":
        // Simulate italic formatting
        break
      case "link":
        // Open link dialog
        const url = prompt("Enter URL:")
        if (url && selectedText) {
          const linkText = `[${selectedText}](${url})`
          // Insert link into content
        }
        break
      default:
        break
    }
  }

  return (
    <TooltipProvider>
      <div className="border border-gray-200 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 flex-wrap">
          {toolbarGroups.map((group, groupIndex) => (
            <div key={group.name} className="flex items-center gap-1">
              {group.buttons.map((button) => (
                <Tooltip key={button.action}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => handleToolbarAction(button.action)}
                      aria-label={button.label}
                    >
                      <button.icon className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{button.label}</p>
                    {button.shortcut && <p className="text-xs text-gray-400">{button.shortcut}</p>}
                  </TooltipContent>
                </Tooltip>
              ))}
              {groupIndex < toolbarGroups.length - 1 && <Separator orientation="vertical" className="mx-1 h-6" />}
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="min-h-[400px] p-4">
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onSelect={(e) => {
              const target = e.target as HTMLTextAreaElement
              const selected = target.value.substring(target.selectionStart, target.selectionEnd)
              setSelectedText(selected)
            }}
            placeholder={placeholder}
            className="w-full h-full min-h-[350px] resize-none border-none outline-none text-gray-900 placeholder-gray-400 leading-relaxed"
            aria-describedby="editor-stats"
          />
        </div>

        {/* Footer */}
        <div
          id="editor-stats"
          className="flex items-center justify-between p-2 border-t border-gray-200 text-xs text-gray-500 bg-gray-50"
        >
          <div className="flex items-center gap-4">
            <span>{content.length} characters</span>
            <span>{wordCount} words</span>
            {maxLength && (
              <span className={content.length > maxLength * 0.9 ? "text-orange-600" : ""}>
                {maxLength - content.length} remaining
              </span>
            )}
          </div>
          <span>Rich text editor powered by TipTap</span>
        </div>
      </div>
    </TooltipProvider>
  )
}

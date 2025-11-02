"use client"

import { useState } from "react"
import { useEditor } from "@craftjs/core"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from 'react-redux'
import { Undo2, Redo2, Loader2, Save, Send, PanelRightClose, PanelRightOpen, Menu } from "lucide-react"
import { ContentModal } from "@/components/modals/ContentModal"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { AppDispatch, RootState } from "@/app/store/store"
import { toggleRightSidebar, toggleTreeSidebar } from "@/app/store/slices/editorSlice"
import { ThemeToggle } from "@/components/theme-toggle";

type NavbarProps = {
  contentId: string | null
}

export function Navbar({ contentId }: NavbarProps) {
  const router = useRouter()
  const { actions, canUndo, canRedo, query } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }))

  const dispatch = useDispatch<AppDispatch>()
  const isRightSidebarOpen = useSelector((state: RootState) => state.editor.isRightSidebarOpen)
  // Get the state for the Tree (Left) Sidebar
  const isTreeSidebarOpen = useSelector((state: RootState) => state.editor.isTreeSidebarOpen)

  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSave = async () => {
    if (!contentId || isSaving) return
    setIsSaving(true)
    const editorData = query.serialize()

    try {
      await fetch(`/api/content/${contentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: editorData }), // API expects `data` field
      });
      console.log("Content updated successfully");
    } catch (error) {
      console.error("Error updating content:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateSuccess = (newContentId: string) => {
    router.push(`/studio/${newContentId}`)
  }

  return (
    <TooltipProvider delayDuration={100}>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 w-full items-center justify-between px-2 sm:px-4">
          {/* Left Section - Toggles & History */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => dispatch(toggleTreeSidebar())}>
                  <Menu className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isTreeSidebarOpen ? "Close Library" : "Open Library"}</p>
              </TooltipContent>
            </Tooltip>
            
            <div className="flex items-center gap-1 rounded-full bg-muted p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => actions.history.undo()} disabled={!canUndo}>
                    <Undo2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => actions.history.redo()} disabled={!canRedo}>
                    <Redo2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
              </Tooltip>
            </div>
          </div>


          {/* Right Section - Actions & Settings */}
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <div className="flex items-center space-x-2">
              <Label htmlFor="editor-mode" className="cursor-pointer flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => dispatch(toggleRightSidebar())}>
                      {isRightSidebarOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isRightSidebarOpen ? 'Close Panel' : 'Open Panel'}</TooltipContent>
                </Tooltip>
              </Label>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center">
              {contentId ? (
                <Button onClick={handleSave} disabled={isSaving} size="sm">
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline ml-2">
                    {isSaving ? 'Saving...' : 'Save'}
                  </span>
                </Button>
              ) : (
                <Button onClick={() => setIsModalOpen(true)} disabled={isPublishing} size="sm">
                  {isPublishing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline ml-2">
                    {isPublishing ? 'Publishing...' : 'Publish'}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {!contentId && (
        <ContentModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSuccess={handleCreateSuccess}
          parentId={null}
        />
      )}
    </TooltipProvider>
  )
}

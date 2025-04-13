// @/components/ai-sidebar.tsx (Corrected & Refined)
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatSystem } from "./chat-system" // Assuming these exist
import { ResponseTab } from "./response-tab" // Assuming these exist
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface AISidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AISidebar({ isOpen, onClose }: AISidebarProps) {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            opacity: { duration: 0.2 }
          }}
          // Ensure it's below header initially, takes full screen height
          // Use bg-background for better theme integration
          className={cn(
            "fixed top-0 right-0 w-full sm:w-96 bg-background shadow-lg z-40 flex flex-col",
            "h-screen" // Account for header height (h-16 = pt-16)
          )}
        >
          {/* Tabs component manages the structure */}
          {/* Let Tabs handle its own height within the flex container */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden"> {/* Added overflow-hidden */}

            {/* Header Section */}
            <div className="flex items-center justify-between p-3 border-border shrink-0 bg-background sticky top-16 z-10"> {/* Make header sticky within sidebar */}
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg bg-gray-100 dark:bg-gray-600">Chat</TabsTrigger>
                {/* <TabsTrigger value="response" className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg bg-gray-100 dark:bg-gray-600">Response</TabsTrigger> */}
              </TabsList>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="ml-2 text-muted-foreground hover:text-foreground shrink-0"
                aria-label="Close AI Assistant"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Removed outer div, TabsContent handles its role */}
            <TabsContent
              value="chat"
              className="flex-1 overflow-y-auto p-4 md:p-6 mt-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-gray-100 dark:bg-[#1E1E24] rounded-2xl" // Allow scrolling, remove focus ring
              // Remove h-full here, flex-1 handles height
            >
              <ChatSystem /> {/* Ensure this component renders content */}
            </TabsContent>

          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
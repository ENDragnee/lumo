"use client"

import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSearchParams } from 'next/navigation'

interface Message {
  role: "user" | "ai"
  content: string
}

export function ResponseTab() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams();
  const contentId = searchParams.get('id');

  useEffect(() => {

    const fetchChatHistory = async () => {
      try {

        const response = await fetch(`/api/chat-ai?id=${contentId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch chat history')
        }

        const data = await response.json()
        setMessages(data.messages)
      } catch (error) {
        console.error('Error fetching chat history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChatHistory()
  }, [searchParams]) // Re-fetch when URL parameters change

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
      </div>
    )
  }

  return (
    <ScrollArea className="h-full py-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No chat history available
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg w-full ${
                message.role === "user" 
                  ? "bg-gray-200 dark:bg-[#363a45] text-gray-900 dark:text-[#D3DAE3]" 
                  : "bg-gray-100 dark:bg-[#404552] text-gray-800 dark:text-[#D3DAE3]"
              }`}
            >
              {message.content}
            </span>
          </div>
        ))
      )}
    </ScrollArea>
  )
}
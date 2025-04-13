"use client"

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown'; // Import react-markdown
import remarkGfm from 'remark-gfm'; // Import remark-gfm

// --- Define message type consistent with API response (after mapping) ---
interface HistoryMessage {
  // Roles expected *after* fetching and mapping from API (e.g., 'user', 'assistant')
  // Or match the direct API roles ('user', 'model' or 'user', 'ai') depending on your GET endpoint
  role: "user" | "ai" | "model" | "assistant"; // Allow potential roles
  content: string;
}

export function ResponseTab() {
  const [messages, setMessages] = useState<HistoryMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state
  const searchParams = useSearchParams();
  const contentId = searchParams.get('id');

  useEffect(() => {
    if (!contentId) {
      setLoading(false);
      setError("No content ID provided."); // Set error if no ID
      setMessages([]); // Clear messages
      return;
    }

    const fetchChatHistory = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch
      try {
        // Ensure this endpoint matches your GET route, e.g., /api/google-ai?id=...
        const response = await fetch(`/api/google-ai?id=${contentId}`);

        if (!response.ok) {
          // Handle specific errors like Not Found
          if (response.status === 404) {
            setError("No chat history found for this content.");
            setMessages([]);
          } else {
            throw new Error(`Failed to fetch chat history: ${response.statusText} (${response.status})`);
          }
        } else {
          const data = await response.json();
          // Check if the data has the expected 'messages' array
          if (data.messages && Array.isArray(data.messages)) {
             // Map API response structure (role: 'user'/'model', parts: [{text: ...}])
             // to the HistoryMessage structure
             const mappedMessages = data.messages.map((msg: any): HistoryMessage => ({
                // Adjust mapping based on your actual API response structure
                role: msg.role === 'model' ? 'assistant' : 'user', // Example mapping
                content: msg.parts?.[0]?.text || msg.content || '', // Get content safely
             }));
             setMessages(mappedMessages);
          } else {
             // Handle unexpected data format
             console.warn("Received unexpected data format:", data);
             setError("Failed to parse chat history.");
             setMessages([]);
          }
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
        setMessages([]); // Clear messages on error
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [contentId]); // Re-fetch when contentId changes

  // --- Render Loading State ---
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500 dark:border-gray-400 mr-2"></div>
        Loading history...
      </div>
    );
  }

  // --- Render Error State ---
   if (error) {
     return (
       <div className="h-full flex items-center justify-center text-center text-red-600 dark:text-red-400 p-4">
         Error: {error}
       </div>
     );
   }

  // --- Render Messages ---
  return (
    // Added padding to ScrollArea content using px-4 py-4
    <ScrollArea className="h-full bg-gray-50 dark:bg-[#1E1E24] rounded-lg">
       <div className="px-4 py-4 space-y-4"> {/* Wrapper div for padding and spacing */}
         {messages.length === 0 ? (
           <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
             No chat history available for this item.
           </div>
         ) : (
           messages.map((message, index) => (
             <div
               key={index}
               // Use 'assistant' or 'ai'/'model' based on your mapped role
               className={`flex w-full ${
                 message.role === "user" ? "justify-end" : "justify-start"
               }`}
             >
               {/* Apply prose class for markdown styling */}
               <div
                 className={`rounded-lg p-3 max-w-[85%] prose dark:prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 ${ // Adjusted prose margins
                   // Use 'assistant' or 'ai'/'model' based on your mapped role
                   message.role === "user"
                     ? "bg-gray-200 dark:bg-[#363a45] text-gray-900 dark:text-[#D3DAE3]"
                     : "bg-gray-100 dark:bg-[#404552] text-gray-800 dark:text-[#D3DAE3]" // Style prose elements for assistant/ai
                 }`}
               >
                 {/* Use ReactMarkdown */}
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
                   {message.content}
                 </ReactMarkdown>
               </div>
             </div>
           ))
         )}
       </div>
    </ScrollArea>
  );
}
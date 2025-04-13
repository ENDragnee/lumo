"use client"

import { useState, useRef, useEffect, FormEvent } from "react"; // Added FormEvent
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown'; // Import react-markdown
import remarkGfm from 'remark-gfm'; // Import remark-gfm

// --- Define message type ---
interface Message {
  role: "user" | "assistant"; // Removed "sent" as it's implicitly user before response
  content: string;
}

export function ChatSystem() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Ref typing for ScrollArea's viewport element
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const contentId = searchParams.get('id');

  // --- Effect to scroll down ---
  useEffect(() => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTop = scrollAreaViewportRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Effect to fetch initial chat history ---
  useEffect(() => {
    const fetchHistory = async () => {
      if (!contentId) return; // Don't fetch if no contentId
      setIsLoading(true); // Indicate loading history
      try {
        // Assuming the GET endpoint is '/api/google-ai' or adjust as needed
        const response = await fetch(`/api/google-ai?id=${contentId}`);
        if (!response.ok) {
          // Handle case where history might not exist (404) gracefully
          if (response.status === 404) {
             console.log("No chat history found for this content.");
             setMessages([]); // Ensure messages are empty
             return; // Exit function
          }
          throw new Error(`Failed to fetch chat history: ${response.statusText}`);
        }
        const data = await response.json();
        // Ensure the API returns { messages: [...] } as expected by ResponseTab logic
        if (data.messages && Array.isArray(data.messages)) {
            // Map API roles ('user', 'model') to component roles ('user', 'assistant')
            const mappedMessages = data.messages.map((msg: any) => ({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.parts?.[0]?.text || msg.content || '' // Adapt based on API response structure
            }));
           setMessages(mappedMessages);
        } else {
            console.warn("Received unexpected data format for chat history:", data);
            setMessages([]); // Reset messages if format is wrong
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        // Optionally show an error message to the user
        setMessages([{ role: "assistant", content: "Could not load chat history." }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [contentId]); // Re-fetch when contentId changes

  // --- Handle message sending ---
  const handleSend = async (e?: FormEvent) => { // Accept optional event
    if (e) e.preventDefault(); // Prevent form submission if triggered by form
    if (!input.trim() || isLoading || !contentId) return; // Added checks

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput(""); // Clear input immediately
    setIsLoading(true);

    try {
      const response = await fetch('/api/google-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, content_id: contentId }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedJson = '';
      let fullResponseContent = '';

      // Process the stream chunk by chunk
      setMessages(prev => [...prev, { role: "assistant", content: "" }]); // Add placeholder

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulatedJson += decoder.decode(value, { stream: true });

        // Try parsing the accumulated JSON (handle potential partial chunks)
        try {
            // Assuming the stream sends JSON objects like { content: "..." } separated by commas, within []
            // We need robust parsing for potentially incomplete JSON streams.
            // A simple approach for this specific format: find complete objects
            let lastComma = accumulatedJson.lastIndexOf(',');
            let processable = accumulatedJson;
            if (lastComma !== -1) {
                // If it starts with '[', process up to the last comma
                if(accumulatedJson.startsWith('[')) {
                   processable = accumulatedJson.substring(1, lastComma);
                } else {
                   processable = accumulatedJson.substring(0, lastComma);
                }
            } else if (accumulatedJson.startsWith('[')) {
                 processable = accumulatedJson.substring(1); // Remove starting '[' if no comma yet
            }


            // Split into potential JSON objects (crude but works for simple cases)
            const chunks = processable.split('},{').map((chunk, index, arr) => {
                 if (arr.length === 1 && !accumulatedJson.startsWith('[')) return chunk; // Not wrapped yet
                 if (index === 0 && !accumulatedJson.startsWith('[')) return chunk + '}';
                 if (index === arr.length - 1 && !chunk.endsWith('}')) return '{' + chunk;
                 if (index > 0 && index < arr.length - 1) return '{' + chunk + '}';
                 return chunk; // Should be '{...}' already or the first part
            });

            let currentContent = '';
            chunks.forEach(potentialJson => {
                try {
                    const parsed = JSON.parse(potentialJson);
                    if (parsed.content) {
                        currentContent += parsed.content;
                    }
                } catch {
                     // Ignore parsing errors for incomplete JSON parts
                     // console.warn("Could not parse chunk:", potentialJson);
                }
            });

             // Update the last message (assistant's placeholder) with new content
             if (currentContent) {
                 fullResponseContent += currentContent; // Keep track of the full response
                 setMessages(prev => {
                    const updatedMessages = [...prev];
                    if (updatedMessages[updatedMessages.length - 1]?.role === 'assistant') {
                       updatedMessages[updatedMessages.length - 1].content += currentContent;
                    }
                    return updatedMessages;
                 });
                 // Reset the processable part for the next read
                 accumulatedJson = accumulatedJson.substring(lastComma + 1);
             }


        } catch (parseError) {
            console.warn("Error parsing stream:", parseError, "Accumulated:", accumulatedJson);
            // Decide how to handle parse errors - maybe wait for more data
        }
      }

       // Final update potentially needed if the stream ends mid-object
       // or for the very last part after loop finishes.
       // This part needs refinement based on exact stream format.

    } catch (error) {
      console.error('Error sending message or processing stream:', error);
      setMessages(prev => {
          // Replace the placeholder or add an error message
          const lastMsgIndex = prev.length - 1;
          if (prev[lastMsgIndex]?.role === 'assistant' && prev[lastMsgIndex]?.content === '') {
              const updated = [...prev];
              updated[lastMsgIndex].content = "Sorry, I encountered an error.";
              return updated;
          }
          // Add a new error message if placeholder wasn't there
          return [...prev, { role: "assistant", content: "Sorry, I encountered an error." }];
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col h-full w-full rounded-md">
      {/* Pass the viewport ref to ScrollArea */}
      <ScrollArea className="flex-grow w-full mt-4 pt-4">
        <div className="space-y-4 px-4 pb-4"> {/* Added padding */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex w-full ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Apply prose class for markdown styling */}
              <div
                className={`rounded-lg p-3 max-w-[85%] prose dark:prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 ${ // Adjusted prose margins
                  message.role === "user"
                    ? "bg-[#5294e2] text-white prose-strong:text-white prose-code:text-white" // Style prose elements for user
                    : "bg-gray-200 dark:bg-[#404552] text-gray-900 dark:text-[#D3DAE3]" // Style prose elements for assistant
                }`}
              >
                {/* Use ReactMarkdown */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {/* Simplified Loading Indicator */}
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
             <div className="flex justify-start w-full">
                <div className="rounded-lg p-3 bg-gray-200 dark:bg-[#404552] text-gray-900 dark:text-[#D3DAE3]">
                   ...
                </div>
             </div>
          )}
        </div>
      </ScrollArea>
      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 focus:ring-offset-0 focus:ring-2 focus:ring-[#5294e2] text-gray-900 dark:text-[#D3DAE3]"
            disabled={isLoading || !contentId} // Disable when loading or no ID
          />
          <Button
            type="submit"
            className="bg-[#5294e2] text-white hover:bg-[#5294e2]/90 rounded-full p-2 disabled:opacity-50"
            disabled={isLoading || !input.trim() || !contentId} // Disable button states
          >
            <Send className="w-5 h-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
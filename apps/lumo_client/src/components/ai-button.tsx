// @/components/ai-button.tsx (Corrected)
"use client";

import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils"; // Make sure cn is imported

interface AIButtonProps {
  onClick: () => void;
  isOpen: boolean; // Keep isOpen if you want to visually indicate activation, otherwise remove
}

export function AIButton({ onClick, isOpen }: AIButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="ghost" // Use ghost variant for consistency within the pill
      size="icon" // Use size="icon" for a square/circular button
      className={cn(
        "p-2 rounded-full transition-colors duration-200 h-9 w-9", // Standard pill button size/padding
        "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
        // Optional: Add visual feedback when the sidebar is open
        isOpen && "bg-gray-200 dark:bg-gray-700"
      )}
      aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
    >
      <Bot
        className="h-5 w-5" // Adjusted icon size to fit better
        aria-hidden="true"
      />
    </Button>
  );
}
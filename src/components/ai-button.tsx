"use client";

import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface AIButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function AIButton({ onClick, isOpen }: AIButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={`fixed bottom-7 right-6 z-50 transition-all duration-300 bg-slate-800 outline-white dark:bg-white hover:scale-110 ${
        isOpen ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"
      }`}
      aria-label={isOpen ? "Close AI Sidebar" : "Open AI Sidebar"}
      style={{
        width: "50px", // Set a fixed width for the button
        height: "48px", // Set a fixed height for the button
        borderRadius: "55% 45% 59% 41% / 55% 73% 27% 45% ",
      }}
    >
      <Bot
        className="h-6 w-6 dark:text-gray-900 text-white"
        aria-hidden="true"
      />
    </Button>
  );
}
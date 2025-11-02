import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

interface CloseButtonProps {
  onClick: () => void
  className?: string
}

export function CloseButton({ onClick, className = ""  }: CloseButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2"
      aria-label="Close AI Sidebar"
    >
      <X className="h-4 w-4" />
    </Button>
  )
}


import type React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AppleStyleCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "elevated" | "glass"
  interactive?: boolean
}

export function AppleStyleCard({ children, className, variant = "default", interactive = false }: AppleStyleCardProps) {
  const baseStyles = "transition-all duration-300 ease-out"

  const variants = {
    default: "bg-white border border-cloud shadow-sm",
    elevated: "bg-white shadow-lg border-0",
    glass: "bg-white/80 backdrop-blur-md border border-white/20 shadow-lg",
  }

  const interactiveStyles = interactive ? "hover:scale-105 hover:shadow-xl cursor-pointer transform-gpu" : ""

  return <Card className={cn(baseStyles, variants[variant], interactiveStyles, className)}>{children}</Card>
}

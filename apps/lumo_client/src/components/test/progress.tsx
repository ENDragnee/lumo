"use client"

import { cn } from "@/lib/utils"

interface ProgressProps {
  /** 0 – 100 */
  value: number
  className?: string
}

export default function Progress({ value, className }: ProgressProps) {
  return (
    <div
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      role="progressbar"
      className={cn("h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}
    >
      <div
        className="h-full bg-green-600 transition-transform duration-300 ease-out"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  )
}

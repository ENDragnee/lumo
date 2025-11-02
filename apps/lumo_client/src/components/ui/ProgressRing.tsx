import type React from "react"
import { cn } from "@/lib/utils"

interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  className?: string
  children?: React.ReactNode
  showTooltip?: boolean
  label?: string
}

export function ProgressRing({
  percentage,
  size = 80,
  strokeWidth = 4,
  className,
  children,
  showTooltip = true,
  label,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

  return (
    <div className={cn("relative group cursor-pointer", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-cloud"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          className="text-pacific transition-all duration-500 group-hover:drop-shadow-lg"
          strokeLinecap="round"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (
          <>
            <span className="text-sm font-semibold text-shadow">{percentage}%</span>
            {label && <span className="text-xs text-graphite">{label}</span>}
          </>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-shadow text-frost text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {label ? `${label}: ${percentage}%` : `${percentage}%`}
        </div>
      )}
    </div>
  )
}

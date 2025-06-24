"use client"
import { Button } from "@/components/ui/button"

interface TimeRangeSelectorProps {
  onRangeChange: (range: string) => void
  currentRange: string
}

export function TimeRangeSelector({ onRangeChange, currentRange }: TimeRangeSelectorProps) {
  const ranges = [
    { id: "30d", label: "Last 30 Days" },
    { id: "semester", label: "This Semester" },
    { id: "all", label: "All Time" },
  ]

  return (
    <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-lg border border-cloud p-1">
      {ranges.map((range) => (
        <Button
          key={range.id}
          variant={currentRange === range.id ? "default" : "ghost"}
          size="sm"
          onClick={() => onRangeChange(range.id)}
          className="h-8 px-4 text-sm"
        >
          {range.label}
        </Button>
      ))}
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface MomentumChartProps {
  data: Array<{
    date: string
    studyHours: number
    averageMastery: number
  }>
}

export function MomentumChart({ data }: MomentumChartProps) {
  const maxHours = Math.max(...data.map((d) => d.studyHours))
  const maxMastery = Math.max(...data.map((d) => d.averageMastery))

  const chartWidth = 400
  const chartHeight = 200
  const padding = 40

  const createPath = (values: number[], max: number) => {
    const points = values.map((value, index) => {
      const x = padding + (index / (values.length - 1)) * (chartWidth - 2 * padding)
      const y = chartHeight - padding - (value / max) * (chartHeight - 2 * padding)
      return `${x},${y}`
    })
    return `M ${points.join(" L ")}`
  }

  const hoursPath = createPath(
    data.map((d) => d.studyHours),
    maxHours,
  )
  const masteryPath = createPath(
    data.map((d) => d.averageMastery),
    maxMastery,
  )

  return (
    <Card className="shadow-apple-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-responsive-h3">
          <TrendingUp className="w-5 h-5 text-pacific" />
          Learning Momentum
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <svg width={chartWidth} height={chartHeight} className="w-full">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1={padding}
                y1={chartHeight - padding - ratio * (chartHeight - 2 * padding)}
                x2={chartWidth - padding}
                y2={chartHeight - padding - ratio * (chartHeight - 2 * padding)}
                stroke="currentColor"
                strokeWidth="1"
                className="text-cloud"
                opacity={0.3}
              />
            ))}

            {/* Study Hours Line */}
            <path d={hoursPath} fill="none" stroke="currentColor" strokeWidth="3" className="text-pacific" />

            {/* Average Mastery Line */}
            <path
              d={masteryPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="5,5"
              className="text-sage"
            />

            {/* Data points */}
            {data.map((_, index) => {
              const x = padding + (index / (data.length - 1)) * (chartWidth - 2 * padding)
              const hoursY = chartHeight - padding - (data[index].studyHours / maxHours) * (chartHeight - 2 * padding)
              const masteryY =
                chartHeight - padding - (data[index].averageMastery / maxMastery) * (chartHeight - 2 * padding)

              return (
                <g key={index}>
                  <circle cx={x} cy={hoursY} r="4" fill="currentColor" className="text-pacific" />
                  <circle cx={x} cy={masteryY} r="4" fill="currentColor" className="text-sage" />
                </g>
              )
            })}
          </svg>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-pacific"></div>
              <span className="text-graphite">Study Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-sage border-dashed border-t-2 border-sage"></div>
              <span className="text-graphite">Average Mastery</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

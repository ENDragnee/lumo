"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

interface KnowledgeConstellationProps {
  data: Array<{
    subject: string
    mastery: number
    color: string
  }>
}

export function KnowledgeConstellation({ data }: KnowledgeConstellationProps) {
  // Create radar chart points
  const createRadarPoints = () => {
    const centerX = 120
    const centerY = 120
    const radius = 80
    const angleStep = (2 * Math.PI) / data.length

    return data.map((item, index) => {
      const angle = index * angleStep - Math.PI / 2
      const distance = (item.mastery / 100) * radius
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance
      return { x, y, angle, distance, ...item }
    })
  }

  const createGridLines = () => {
    const centerX = 120
    const centerY = 120
    const radius = 80
    const levels = [0.2, 0.4, 0.6, 0.8, 1.0]

    return levels.map((level) => {
      const points = data
        .map((_, index) => {
          const angle = (index * (2 * Math.PI)) / data.length - Math.PI / 2
          const x = centerX + Math.cos(angle) * radius * level
          const y = centerY + Math.sin(angle) * radius * level
          return `${x},${y}`
        })
        .join(" ")

      return (
        <polygon
          key={level}
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-cloud"
          opacity={0.3}
        />
      )
    })
  }

  const createAxisLines = () => {
    const centerX = 120
    const centerY = 120
    const radius = 80

    return data.map((_, index) => {
      const angle = (index * (2 * Math.PI)) / data.length - Math.PI / 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      return (
        <line
          key={index}
          x1={centerX}
          y1={centerY}
          x2={x}
          y2={y}
          stroke="currentColor"
          strokeWidth="1"
          className="text-cloud"
          opacity={0.3}
        />
      )
    })
  }

  const points = createRadarPoints()
  const pathData = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") + " Z"

  return (
    <Card className="shadow-apple-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-responsive-h3">
          <Target className="w-5 h-5 text-pacific" />
          Knowledge Constellation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <svg width="240" height="240" className="mb-6">
            {/* Grid lines */}
            {createGridLines()}
            {/* Axis lines */}
            {createAxisLines()}

            {/* Data area */}
            <path
              d={pathData}
              fill="currentColor"
              fillOpacity={0.2}
              stroke="currentColor"
              strokeWidth="2"
              className="text-pacific"
            />

            {/* Data points */}
            {points.map((point, index) => (
              <circle key={index} cx={point.x} cy={point.y} r="4" fill="currentColor" className="text-pacific" />
            ))}

            {/* Subject labels */}
            {points.map((point, index) => {
              const labelRadius = 100
              const angle = point.angle
              const labelX = 120 + Math.cos(angle) * labelRadius
              const labelY = 120 + Math.sin(angle) * labelRadius

              return (
                <text
                  key={`label-${index}`}
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium fill-graphite"
                >
                  {point.subject}
                </text>
              )
            })}
          </svg>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {data.map((item) => (
              <div key={item.subject} className="flex items-center justify-between">
                <span className="text-sm text-graphite">{item.subject}</span>
                <span className="text-sm font-semibold text-shadow">{item.mastery}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

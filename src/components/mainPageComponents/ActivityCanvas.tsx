import React from "react"
import { Card, CardContent } from "@/components/ui/card"

export function ActivityCanvas({ activity }: any) {
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"]
  const maxActivity = Math.max(...activity, 1)
  const totalHours = activity.reduce((sum: number, val: number) => sum + val, 0)

  return (
    <div>
      <div className="flex justify-between items-baseline mb-6">
        <h2 className="text-3xl font-bold text-shadow tracking-tight">Weekly Activity</h2>
        <p className="font-semibold text-gray-600">
          {totalHours} hours <span className="font-normal text-gray-500">last 7 days</span>
        </p>
      </div>
      <Card className="bg-white shadow-apple-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex justify-around items-end h-40">
            {activity.map((hours: number, index: number) => (
              <div key={index} className="flex flex-col items-center group relative">
                <div
                  className="w-5 bg-gradient-to-t from-pacific to-blue-300 rounded-full transition-all duration-500 ease-out hover:from-midnight hover:to-pacific"
                  style={{ height: `${(hours / maxActivity) * 100}%`, minHeight: "4px" }}
                />
                <span className="text-xs text-gray-500 mt-2">{dayLabels[index]}</span>
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-shadow text-frost text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {hours} hours
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



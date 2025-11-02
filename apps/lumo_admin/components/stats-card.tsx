"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
  }
  icon: LucideIcon
  description?: string
  index: number
  trend?: {
    value: number
    direction: "up" | "down"
  }
}

export function StatsCard({ title, value, change, icon: Icon, description, index, trend }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          <div className="flex items-center gap-2">
            {change && (
              <Badge
                variant={change.type === "increase" ? "default" : "secondary"}
                className={cn(
                  "text-xs",
                  change.type === "increase"
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-red-100 text-red-700 hover:bg-red-100",
                )}
              >
                {change.type === "increase" ? "+" : "-"}
                {Math.abs(change.value)}%
              </Badge>
            )}
            {description && <p className="text-xs text-gray-500">{description}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

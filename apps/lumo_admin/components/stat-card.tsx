"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  number: number | string
  label: string
  color?: string
  trend?: {
    value: number
    direction: "up" | "down"
  }
  index: number
}

export function StatCard({ icon: Icon, number, label, color = "#2563eb", trend, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className="p-4 text-center hover:shadow-lg transition-shadow duration-300"
        aria-label={`${label}: ${number}`}
      >
        <CardContent className="p-0">
          <div
            className="mb-3 mx-auto w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20`, color }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {typeof number === "number" ? number.toLocaleString() : number}
          </h2>
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          {trend && (
            <div
              className={`text-xs flex items-center justify-center gap-1 ${
                trend.direction === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>{trend.direction === "up" ? "↗" : "↘"}</span>
              <span>{Math.abs(trend.value)}% from last month</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

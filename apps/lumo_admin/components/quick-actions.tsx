"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, FileText, BarChart3, Settings, Upload } from "lucide-react"

// Updated array with shorter, more concise titles to act as labels
const quickActions = [
  {
    title: "New Content",
    icon: Plus,
    href: "https://lumo-creator.aasciihub.com",
    color: "bg-blue-600",
  },
  {
    title: "Pending Users",
    icon: Users,
    href: "/dashboard/users?filter=pending",
    color: "bg-green-600",
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/dashboard/reports/new",
    color: "bg-orange-500",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "bg-slate-600",
  },
  {
    title: "Library",
    icon: FileText,
    href: "/dashboard/content",
    color: "bg-indigo-600",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                className="w-full h-28 flex flex-col justify-center items-center gap-2 rounded-xl border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md transition-all"
                asChild
              >
                <a href={action.href}>
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium text-sm text-gray-700">
                    {action.title}
                  </p>
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

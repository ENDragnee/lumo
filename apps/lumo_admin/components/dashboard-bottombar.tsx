"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, BookOpen, Users, BarChart3, Settings } from "lucide-react"

const navigationItems = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Content", href: "/dashboard/content", icon: BookOpen },
  { title: "Users", href: "/dashboard/users", icon: Users },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardBottomBar() {
  const pathname = usePathname();

  return (
    // ✨ This component is a block on small screens and hidden on medium screens and up
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-2 hover:bg-gray-50 dark:hover:bg-gray-800 group",
                isActive ? "text-blue-600 dark:text-blue-500" : "text-gray-500 dark:text-gray-400"
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

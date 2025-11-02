"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Home, BookOpen, Users, BarChart3, Settings, FileText, Send, UserCheck, Hotel } from "lucide-react"
import Link from "next/link"

const navigationItems = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Content", href: "/dashboard/content", icon: BookOpen },
  { 
    title: "Users", 
    href: "/dashboard/users", 
    icon: Users,
    subItems: [
      { title: "Manage Users", href: "/dashboard/users", icon: UserCheck },
      { title: "Manage Invites", href: "/dashboard/users/invites", icon: Send },
    ]
  },
  { title: "Organizations", href: "/dashboard/organizations", icon: Hotel },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Reports", href: "/dashboard/reports", icon: FileText },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800 p-4 space-y-6">
      <div className="px-2">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-gray-50">Lumo Portal</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Ministry of Revenue</p>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1">
        {/* ✨ --- UPDATED RENDER LOGIC --- ✨ */}
        <Accordion type="multiple" className="w-full" defaultValue={navigationItems.filter(item => item.subItems && pathname.startsWith(item.href)).map(item => item.title)}>
          {navigationItems.map((item, index) => (
            item.subItems ? (
              <AccordionItem key={item.href} value={item.title} className="border-b-0">
                <AccordionTrigger className={cn(
                  "flex items-center justify-between w-full gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:no-underline",
                  pathname.startsWith(item.href) ? "text-blue-600 dark:text-blue-500" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                )}>
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    {item.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-6 pb-0">
                  <div className="flex flex-col space-y-1 mt-1">
                    {item.subItems.map((subItem) => {
                      const isSubItemActive = pathname === subItem.href;
                      return (
                        <Link key={subItem.href} href={subItem.href} className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                          isSubItemActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                        )}>
                          <subItem.icon className="w-4 h-4" />
                          {subItem.title}
                        </Link>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ) : (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    pathname === item.href ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </Link>
              </motion.div>
            )
          ))}
        </Accordion>
      </nav>
    </aside>
  )
}

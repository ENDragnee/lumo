import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardNavbar } from "@/components/dashboard-navbar" // ✨ NEW: Import Navbar
import { DashboardBottomBar } from "@/components/dashboard-bottombar" // ✨ NEW: Import BottomBar

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="hidden md:flex">
        <DashboardSidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardNavbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pt-20 md:pt-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      <DashboardBottomBar />
    </div>
  )
}

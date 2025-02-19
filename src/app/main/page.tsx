"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import LeftSidebar from "@/components/mainPage/LeftSidebar"
import CentralWorkspace from "@/components/mainPage/CentralWorkspace"

export default function Home() {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false)
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false)
  const router = useRouter()

  const handleCreateContent = () => {
    router.push("/creator-studio")
  }

  return (
    <main className="flex h-screen">
      <LeftSidebar isCollapsed={isLeftSidebarCollapsed} setIsCollapsed={setIsLeftSidebarCollapsed} />
      <CentralWorkspace />
    </main>
  )
}




"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Home, ChevronLeft, ChevronRight, Star, CornerDownRight, CheckCheck, Layers, Crown } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { formatDistanceToNow } from "date-fns"
import type { ObjectId } from "mongoose"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface LeftSidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}
interface HistoryItem {
  _id: string
  content_id: {
    _id: ObjectId
    title: string
    tags: [string]
  }
  starred_status: boolean
  viewed_at: string
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const [activeWorkspace, setActiveWorkspace] = useState("My Notes")
  const [recentHistories, setRecentHistories] = useState<HistoryItem[]>([])
  const [stars, setStars] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleStarToggle = async (contentId: ObjectId) => {
    try {
      const response = await fetch("/api/history/star", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_id: contentId }),
      })

      if (response.ok) {
        fetchRecentHistories() // Refresh the list after toggle
      }
    } catch (error) {
      console.error("Error toggling star:", error)
    }
  }

  const fetchRecentHistories = async () => {
    try {
      const response = await fetch("/api/history")
      if (response.ok) {
        const data = await response.json()
        setRecentHistories(data)
      }
    } catch (error) {
      console.error("Failed to fetch recent histories:", error)
    }
  }

  const fetchStarred = async () => {
    try {
      const response = await fetch("/api/history/star")
      if (response.ok) {
        const data = await response.json()
        setStars(data)
      }
    } catch (error) {
      console.log("Failed to fetch stars:", error)
    }
  }

  useEffect(() => {
    // Wait for both fetches to complete
    const fetchData = async () => {
      await Promise.all([fetchRecentHistories(), fetchStarred()])
      setIsLoading(false)
    }
    fetchData()
  }, [])

  // Close user menu when clicking outside the avatar or the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSettings = () => {
    // Redirect to the settings page
    window.location.href = "/settings"
  }

  const workspaces = [{ name: "Exam Prep", icon: Star }]

  // Handler to expand sidebar when section icons are clicked in collapsed state
  const handleSectionIconClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false)
    }
  }

  // Render skeleton loading while data is being fetched
  if (isLoading) {
    return (
      <motion.div
        ref={sidebarRef}
        className="flex flex-col p-4 border-r-2 h-full rounded-lg bg-zinc-200 dark:bg-[#16181c] border-gray-200 dark:border-[#383c3a]"
        initial={{ width: isCollapsed ? 80 : 250 }}
        animate={{ width: isCollapsed ? 80 : 250 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="animate-pulse flex flex-col space-y-4">
          <div className={`h-8 w-28 bg-gray-300 dark:bg-gray-700 rounded ${isCollapsed ? "hidden" : "block"}`}></div>
          <div className={`h-8 w-28 bg-gray-300 dark:bg-gray-700 rounded ${isCollapsed ? "hidden" : "block"}`}></div>
          <div className={`h-8 w-28 bg-gray-300 dark:bg-gray-700 rounded ${isCollapsed ? "hidden" : "block"}`}></div>
          <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="flex justify-center mt-auto">
            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={sidebarRef}
      className="flex scrollbar-none flex-col overflow-y-auto max-h-screen border-r-2 rounded-lg bg-zinc-200 dark:bg-[#16181c] border-gray-200 dark:border-[#383c3a]"
      initial={{ width: isCollapsed ? 80 : 250 }}
      animate={{ width: isCollapsed ? 80 : 250 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold dark:text-[#5294e2] ${isCollapsed ? "hidden" : "block"}`}>Lumo</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-gray-600 dark:text-[#5294e2]">
              {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Workspaces Section */}
          <div>
            <div className="flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-[#33475f] rounded-md p-2 hover:scale-105 transition-transform">
              <button onClick={() => router.push('/main')} className="flex items-center gap-2">
                <Home className="w-5 h-5 dark:text-[#5294e2] cursor-pointer" onClick={handleSectionIconClick} />
                <h3 className={`text-base font-semibold dark:text-[#7c818c] ${isCollapsed ? "hidden" : "block"}`}>
                  Home
                </h3>
              </button>
            </div>
          </div>
          {/* Workspaces Section */}
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 dark:text-[#5294e2] cursor-pointer" onClick={handleSectionIconClick} />
              <h3 className={`text-base font-semibold dark:text-[#7c818c] ${isCollapsed ? "hidden" : "block"}`}>
                Workspaces
              </h3>
            </div>

            {/* Only show workspace items when not collapsed */}
            {!isCollapsed &&
              workspaces.map((workspace) => (
                <button
                  key={workspace.name}
                  className={`flex items-center w-full p-2 rounded-md ${
                    activeWorkspace === workspace.name
                      ? "bg-[#383c4a] text-white"
                      : "hover:bg-zinc-300 dark:hover:bg-[#33475f] dark:text-[#5294e2] text-sm hover:scale-105 transition-transform"
                  }`}
                  onClick={() => setActiveWorkspace(workspace.name)}
                >
                  <CornerDownRight className="w-4 h-4 dark:text-[#5294e2] mr-2" />
                  <span>{workspace.name}</span>
                </button>
              ))}
          </div>

          {/* Recent Section */}
          <div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleSectionIconClick}>
              <CheckCheck className="w-5 h-5 dark:text-[#5294e2]" />
              <h3 className={`text-base font-semibold dark:text-[#7c818c] ${isCollapsed ? "hidden" : "block"}`}>
                Recent
              </h3>
            </div>
            {!isCollapsed &&
              recentHistories.map((history) => (
                <a
                  key={history._id}
                  href={`/content?id=${history.content_id?._id}`}
                  className="flex items-center mb-2 dark:text-[#5294e2] dark:hover:bg-[#33475f] hover:bg-zinc-300 rounded-md p-2 hover:scale-105 transition-transform"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleStarToggle(history.content_id?._id)
                    }}
                    className="mr-2 hover:scale-110 transition-transform"
                  >
                    <CornerDownRight className="w-4 h-4 dark:text-[#5294e2] mr-2" />
                  </button>
                  <div className="flex flex-col items-center justify-center">
                    <span className="ml-auto pl-2 text-sm text-gray-700 dark:text-[#8678e5]">
                      {history.content_id?.title}
                    </span>
                    <span className="ml-auto text-xs text-gray-500 dark:text-[#81a9d9]">
                      {formatDistanceToNow(new Date(history.viewed_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </a>
              ))}
          </div>

          {/* Favorites Section */}
          <div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleSectionIconClick}>
              <Crown className="w-5 h-5 dark:text-[#5294e2]" />
              <h3 className={`text-base font-semibold dark:text-[#7c818c] ${isCollapsed ? "hidden" : "block"}`}>
                Favorites
              </h3>
            </div>
            {!isCollapsed &&
              stars.map((item) => (
                <div key={item.content_id?.title} className="flex items-center mb-2 dark:text-dark-text">
                  <Star className="w-5 h-5 mr-2 text-dark-highlight" />
                  <span>{item.content_id.title}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center justify-center">
          <div
            className={`flex flex-col items-center bg-dark-secondary rounded-md ${isCollapsed ? "visible" : "flex"} hover:scale-105 transition-transform`}
          >
            <ThemeToggle />
          </div>
          {/* User Profile Avatar */}
          {session && (
            <div className="mt-4 relative hover:scale-110 transition-transform">
              <div
                ref={avatarRef}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image || "/placeholder.svg"}
                    alt="Profile"
                    className="w-10 h-10 object-cover"
                  />
                ) : (
                  <span className="text-white font-bold">
                    {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </div>
              {isUserMenuOpen && (
                <div
                  ref={userMenuRef}
                  className="absolute bottom-12 left-8 text-center bg-white gap-2 dark:bg-[#383c4a] rounded-lg shadow-lg py-2 w-32 z-10"
                >
                  <button
                    onClick={handleSettings}
                    className="w-full px-4 rounded-xl py-2 hover:bg-gray-100 dark:hover:bg-[#7c818c] text-center"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-center px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#7c818c]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default LeftSidebar

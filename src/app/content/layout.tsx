"use client"

import type React from "react"
import { type ReactNode, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Clock } from "@/components/ui/clock"
import { Toaster, toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScrollProgressBar } from "@/components/scroll-progress-bar"
import ContextMenu2 from "@/components/context-menu"
import { ThemeProvider } from "next-themes"
import "@/app/globals.css"
import { SidebarProvider } from "@/app/hooks/SidebarContext"
import { SessionProvider } from "next-auth/react"
import AIButton from "@/components/ai-feature"
import TabManager from "@/components/Tab"
import NewLeftSidebar from "./components/sideBar"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState("up")
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < lastScrollY) {
        setScrollDirection("up")
      } else {
        setScrollDirection("down")
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return scrollDirection
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)

  const scrollDirection = useScrollDirection()

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsSidebarOpen(!e.matches) // Closed on mobile, open on desktop
    }
    handleChange(mediaQuery)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    setMenuPosition({ x: event.clientX, y: event.clientY })
  }

  const handleCloseMenu = () => {
    setMenuPosition(null)
  }

  const handleSessionEnd = (isStudySession: boolean) => {
    const message = isStudySession ? "Time to focus!" : "Time to take a break!"
    const borderColor = isStudySession ? "red" : "green"

    toast(message, {
      duration: 0,
      position: "top-center",
      className: "custom-toast",
      style: {
        borderLeft: `5px solid ${borderColor}`,
        borderRadius: "8px",
        background: "white",
        marginTop: "15px",
        width: "300px",
      },
    })
  }

  const excludedSidebarPaths = ["/", "/landing", "/signup", "/login", "/auth/signin", "/auth/signup", "/main", "/about"]
  const shouldRenderSidebar = !excludedSidebarPaths.includes(pathname)

  return (
    <html lang="en">
      <body
        className="min-h-screen flex flex-col bg-white dark:bg-[#404552] text-black dark:text-white"
        onContextMenu={handleContextMenu}
      >
        <SessionProvider>
          <ThemeProvider attribute="class" enableSystem={true} defaultTheme="light">
            <SidebarProvider>
              {shouldRenderSidebar && (
                <NewLeftSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              )}
            </SidebarProvider>

            <Toaster position="top-center" expand={false} richColors className="mt-10 " />

            <header className="fixed top-4 right-4 z-40 flex items-center space-x-2">
              {shouldRenderSidebar && !isSidebarOpen && (
                <button onClick={toggleSidebar} className="p-2 mr-auto md:hidden">
                  <Menu className="h-5 w-5" />
                </button>
              )}
              <TabManager
                style={{
                  opacity: scrollDirection === "down" ? 0 : 1,
                  visibility: scrollDirection === "down" ? "hidden" : "visible",
                  transition: "opacity 0.3s ease, visibility 0.3s ease",
                }}
              />
            </header>

            <main className={cn(
              "flex-1",
              shouldRenderSidebar && isSidebarOpen && "ml-64",
              shouldRenderSidebar && !isSidebarOpen && "md:ml-16"
            )}>
              <div id="content" className="flex-1">
                {children}
              </div>
            </main>

            {!excludedSidebarPaths.includes(pathname) && (
              <Clock
                onSessionEnd={handleSessionEnd}
                style={{
                  opacity: scrollDirection === "down" ? 0 : 1,
                  visibility: scrollDirection === "down" ? "hidden" : "visible",
                  transition: "opacity 0.3s ease, visibility 0.3s ease",
                }}
              />
            )}

            {!excludedSidebarPaths.includes(pathname) && (
              <div>
                <AIButton
                  style={{
                    opacity: scrollDirection === "down" ? 0 : 1,
                    visibility: scrollDirection === "down" ? "hidden" : "visible",
                    transition: "opacity 0.3s ease, visibility 0.3s ease",
                  }}
                />
              </div>
            )}

            {!excludedSidebarPaths.includes(pathname) && <ScrollProgressBar />}

            {menuPosition && !excludedSidebarPaths.includes(pathname) && (
              <ContextMenu2 x={menuPosition.x} y={menuPosition.y} onClose={handleCloseMenu} />
            )}

            {excludedSidebarPaths.includes(pathname) && pathname !== "/" && (
              <footer className="pt-4 pb-2 sm:max-h-24 md:max-h-16">
                <div className="container mx-auto px-4">
                  <div className="flex justify-center">
                    <p className="text-sm text-gray-500 dark:text-[#7c818c]">
                      © {new Date().getFullYear()}. All rights reserved.
                    </p>
                  </div>
                </div>
              </footer>
            )}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
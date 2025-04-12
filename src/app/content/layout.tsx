"use client"

import type React from "react"
import { type ReactNode, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Clock } from "@/components/ui/clock"
import { Toaster, toast } from "sonner"
import { ScrollProgressBar } from "@/components/scroll-progress-bar"
import ContextMenu2 from "@/components/context-menu"
import { ThemeProvider } from "next-themes" // Consider moving to root layout if needed globally
import "@/app/globals.css" // Usually imported in root layout
import { SidebarProvider } from "@/app/hooks/SidebarContext" // Consider moving to root layout
import { SessionProvider } from "next-auth/react" // Consider moving to root layout
import AIButton from "@/components/ai-feature"
import TabManager from "@/components/Tab"
import NewLeftSidebar from "./components/sideBar"
import RecommendedContent from "./components/RecommendedContent"
import { Menu, X, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

const useScrollDirection = () => {
  // ... (keep hook as is)
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      } else {
        setScrollDirection("down");
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return scrollDirection;
}

// Rename slightly for clarity (optional, but good practice)
export default function ContentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(true)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)

  const scrollDirection = useScrollDirection()

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  const toggleRecommendation = () => {
    setIsRecommendationOpen((prev) => !prev)
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsSidebarOpen(!e.matches) // Closed on mobile, open on desktop
      setIsRecommendationOpen(!e.matches) // Also close recommendation sidebar on mobile
    }
    handleChange(mediaQuery)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    // Apply context menu logic to a specific element if needed,
    // attaching it to the whole body might be less common here.
    // Maybe attach it to the <main> element instead?
    setMenuPosition({ x: event.clientX, y: event.clientY })
  }

  const handleCloseMenu = () => {
    setMenuPosition(null)
  }

  const handleSessionEnd = (isStudySession: boolean) => {
    // ... (keep function as is)
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

  // --- REMOVED <html> and <body> tags ---

  // Important Note: Providers like SessionProvider, ThemeProvider, SidebarProvider
  // often belong in the ROOT layout (`/app/layout.tsx`) if they need to wrap the
  // *entire* application state. If they are specific ONLY to `/content` routes,
  // leaving them here is okay. Evaluate based on your app's needs.
  // Also, remove global CSS import (`@/app/globals.css`) if it's already in root layout.
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" enableSystem={true} defaultTheme="light">
        <SidebarProvider>
          {/* Use a Fragment or a div if you need a single wrapper */}
          <>
            {shouldRenderSidebar && (
              <div>
                <NewLeftSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <RecommendedContent isOpen={isRecommendationOpen} toggleOpen={toggleRecommendation} />
              </div>
            )}

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

            {shouldRenderSidebar && (
              <button
                onClick={toggleRecommendation}
                className="fixed top-4 right-20 z-40 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md"
                style={{
                  opacity: scrollDirection === "down" ? 0 : 1,
                  visibility: scrollDirection === "down" ? "hidden" : "visible",
                  transition: "opacity 0.3s ease, visibility 0.3s ease",
                }}
              >
                <BookOpen className="h-5 w-5" />
              </button>
            )}

            {/* Apply context menu listener here if desired */}
            <main
              className={cn(
                "flex-1 transition-all duration-300", // Ensure root layout's body handles flex layout if needed
                shouldRenderSidebar && isSidebarOpen && "ml-64",
                shouldRenderSidebar && !isSidebarOpen && "md:ml-16",
                shouldRenderSidebar && isRecommendationOpen && "mr-80"
              )}
              onContextMenu={handleContextMenu} // Attach context menu here instead of body
            >
              {/* Ensure the root layout's <body> tag has necessary base styles (like min-h-screen) */}
              <div id="content" className="flex-1 px-4 py-6">
                {children} {/* This is where the page content will be rendered */}
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

            {/* Footer logic might need adjustment based on overall structure */}
            {excludedSidebarPaths.includes(pathname) && pathname !== "/" && (
              <footer className="pt-4 pb-2 sm:max-h-24 md:max-h-16">
                 {/* This footer might be better placed outside the main content flow depending on design */}
                <div className="container mx-auto px-4">
                  <div className="flex justify-center">
                    <p className="text-sm text-gray-500 dark:text-[#7c818c]">
                      © {new Date().getFullYear()}. All rights reserved.
                    </p>
                  </div>
                </div>
              </footer>
            )}
          </>
        </SidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  )
  // --- REMOVED </body> and </html> tags ---
}
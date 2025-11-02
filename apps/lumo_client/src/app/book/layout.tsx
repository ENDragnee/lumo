// @/app/content/layout.tsx (Corrected)
"use client"

import type React from "react"
import { type ReactNode, useState, useEffect, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"
import { Clock } from "@/components/ui/clock"
import { Toaster, toast } from "sonner"
import { ScrollProgressBar } from "@/components/scroll-progress-bar"
import { ThemeProvider } from "next-themes"
import "@/app/globals.css"
import { SessionProvider } from "next-auth/react"
import NewSidebar from "@/components/sidebar/NewSidebar"
import BottomNavbar from "@/components/mainPage/BottomNavbar"
// Use consistent icons for Recommendation Toggle
import { PanelLeftOpen, PanelLeftClose, PanelRightOpen, PanelRightClose, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils"

// **** USE SCROLL DIRECTION HOOK ****
const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) < 10) return;

      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setScrollDirection("up");
      } else {
        setScrollDirection("down");
      }
      setLastScrollY(currentScrollY < 0 ? 0 : currentScrollY);
    };

    if (typeof window !== 'undefined') {
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    return () => {
        if (typeof window !== 'undefined') {
            window.removeEventListener("scroll", handleScroll);
        }
    }
  }, [lastScrollY]);

  return scrollDirection;
}


export default function ContentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Left sidebar
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false) // Right sidebar
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [isMounted, setIsMounted] = useState(false);
  const [isTabManagerOpen, setIsTabManagerOpen] = useState(false);
  const tabManagerTriggerRef = useRef<HTMLButtonElement>(null);
  const scrollDirection = useScrollDirection()


  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, []);

  const toggleRecommendation = useCallback(() => {
    setIsRecommendationOpen((prev) => !prev)
  }, []);

  const toggleTabManager = useCallback(() => {
    setIsTabManagerOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handleChange = (e: MediaQueryList | MediaQueryListEvent) => {
          if (e.matches) { // Mobile
            // ** Ensure this sets recommendation to false initially on mobile **
            setIsSidebarOpen(false);
            setIsRecommendationOpen(false); // Start closed on mobile
          } else { // Desktop
            setIsSidebarOpen(true);
            setIsRecommendationOpen(true); // Keep desktop defaults
          }
        }
        handleChange(mediaQuery); // Initial check
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }
     return () => { setIsMounted(false); }
  }, []);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    setMenuPosition({ x: event.clientX, y: event.clientY })
  }

  const handleSessionEnd = (isStudySession: boolean) => {
    const message = isStudySession ? "Time to focus!" : "Time to take a break!"
    const borderColor = isStudySession ? "border-red-500" : "border-green-500"

    toast(message, {
      duration: 5000,
      position: "top-center",
      className: cn("custom-toast border-l-4 bg-background text-foreground mt-4 max-w-sm rounded-lg", borderColor),
    })
  }

  const excludedPaths = ["/", "/landing", "/signup", "/login", "/auth/signin", "/auth/signup", "/about"];
  const shouldRenderNav = !excludedPaths.includes(pathname) && isMounted;
  const isMobile = isMounted && typeof window !== 'undefined' && window.innerWidth < 768; // Recalculate based on current width

  if (!isMounted) {
     return null; // Or a loading skeleton
  }


  return (
    <SessionProvider>
      <ThemeProvider attribute="class" enableSystem={true} defaultTheme="light">
          <>
            {shouldRenderNav && (
              <>
                {/* Left Sidebar (Still exists, but toggle button might be elsewhere on mobile) */}
                <NewSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} isMobile={isMobile} />
                 {isMobile && <BottomNavbar />}
              </>
            )}

            <Toaster position="top-center" expand={false} richColors className="mt-10 " />

             {/* Header Area - Contains the Pill */}
             <header className={cn(
                 "fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-16",
                 "bg-white/80 dark:bg-[#2b2d36]/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/50",
                 scrollDirection === "down" && shouldRenderNav && "-translate-y-full",
                 "transition-transform duration-300 ease-in-out", // Use transform instead of -translate
                 shouldRenderNav && isSidebarOpen && !isMobile && "md:left-64", // Apply only on desktop
                 shouldRenderNav && !isSidebarOpen && !isMobile && "md:left-16", // Apply only on desktop
                 // Mobile header should always span full width initially
             )}>
                 {/* Left side: Button (MOBILE ONLY - NOW TOGGLES RECOMMENDATIONS) */}
                 {shouldRenderNav && isMobile && ( // Show only on mobile
                     <button
                         onClick={toggleRecommendation} // <-- CHANGED ACTION
                         className={cn(
                             "p-2 rounded-md transition-colors hover:bg-gray-200 dark:hover:bg-gray-700",
                             "text-gray-700 dark:text-gray-300" // Ensure icon color
                         )}
                         aria-label={isRecommendationOpen ? "Close recommendations" : "Open recommendations"} // <-- CHANGED LABEL
                     >
                         {/* CHANGED ICON based on recommendation state */}
                         {isRecommendationOpen ? <PanelRightClose className="h-5 w-5"/> : <PanelRightOpen className="h-5 w-5"/>}
                     </button>
                 )}
                 {/* Left side: Button (DESKTOP ONLY - Toggles LEFT sidebar) */}
                 {shouldRenderNav && !isMobile && ( // Show only on desktop
                     <button
                         onClick={toggleSidebar}
                         className={cn(
                             "p-2 rounded-md transition-colors hover:bg-gray-200 dark:hover:bg-gray-700",
                             "text-gray-700 dark:text-gray-300",
                             // Only show if sidebar is closed on desktop OR always show if preferred
                             !isSidebarOpen ? "block" : "block" // Or keep md:hidden logic if needed
                         )}
                         aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                     >
                          {/* Use PanelLeft icons for consistency */}
                     </button>
                 )}


                 <div className="flex-1" /> {/* Spacer */}

                 {/* --- The Novel Pill --- */}
                 {shouldRenderNav && (
                     <div className={cn(
                        "flex items-center gap-1 md:gap-1.5", // Adjusted gap slightly
                        "px-2 py-1.5 rounded-full",
                        "bg-white/90 dark:bg-[#31333c]/90",
                        "border border-gray-200/80 dark:border-gray-700/60",
                        "shadow-sm"
                     )}>
                         {/* 1. Tab Manager Trigger */}
                         <button
                             ref={tabManagerTriggerRef}
                             onClick={toggleTabManager}
                             className={cn(
                                 "p-2 rounded-full transition-colors duration-200 h-9 w-9 flex items-center justify-center", // Consistent size/centering
                                 "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
                                 isTabManagerOpen && "bg-gray-200 dark:bg-gray-700"
                             )}
                             aria-label={isTabManagerOpen ? "Close Tabs" : "Open Tabs"}
                         >
                             <LayoutList className="h-5 w-5" />
                         </button>

                         {/* Divider */}
                         <div className="h-5 w-px bg-gray-200 dark:bg-gray-600/80"></div>

                         {/* Divider (Only show if recommendation toggle is also shown - desktop only) */}
                         <div className={cn("h-5 w-px bg-gray-200 dark:bg-gray-600/80", isMobile && "hidden")}></div>

                         {/* 3. Recommendation Sidebar Toggle (Desktop Only) */}
                         {!isMobile && (
                             <button
                                 onClick={toggleRecommendation}
                                 className={cn(
                                     "p-2 rounded-full transition-colors duration-200 h-9 w-9 flex items-center justify-center", // Consistent size/centering
                                     "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
                                     isRecommendationOpen && "bg-gray-200 dark:bg-gray-700"
                                 )}
                                 aria-label={isRecommendationOpen ? "Close recommendations" : "Open recommendations"}
                             >
                                 {isRecommendationOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
                             </button>
                         )}
                     </div>
                 )}
                 {/* Add Spacer if needed, depending on where the user profile/other icons go */}
                 {/* <div className="w-10"></div> */}
             </header>

            {/* Main Content Area */}
            <main
              className={cn(
                "flex-1 transition-all duration-300 ease-in-out", // Added ease-in-out
                "pt-16", // Account for header height
                isMobile ? "pb-16" : "pb-0", // Account for bottom nav on mobile
                shouldRenderNav && isSidebarOpen && !isMobile && "md:ml-64", // Apply margin only on desktop
                shouldRenderNav && !isSidebarOpen && !isMobile && "md:ml-16",// Apply margin only on desktop
                shouldRenderNav && isRecommendationOpen && !isMobile && "md:mr-80", // Apply margin only on desktop
              )}
              onContextMenu={shouldRenderNav ? handleContextMenu : undefined}
            >
              <div id="content-container" className="px-4 py-6 md:px-6 lg:px-8 h-full">
                {children}
              </div>
            </main>

            {/* Floating Widgets */}
            {shouldRenderNav && (
                <>
                  <Clock onSessionEnd={handleSessionEnd} />
                  <ScrollProgressBar />
                </>
            )}
          </>
      </ThemeProvider>
    </SessionProvider>
  )
}

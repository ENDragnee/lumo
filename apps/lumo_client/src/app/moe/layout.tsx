// @/app/content/layout.tsx (Corrected & Updated)
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
import AIFeature from "@/components/ai-feature"
import Sidebar from "@/components/Sidebar";
import BottomNavbar from "@/components/mainPage/BottomNavbar"
import { PanelLeftOpen, PanelLeftClose, PanelRightOpen, PanelRightClose, LayoutList, Menu, X } from "lucide-react"; // Added Menu, X
import { cn } from "@/lib/utils"
import RecommendedContent from "@/app/content/components/RecommendedContent"

// **** USE SCROLL DIRECTION HOOK ****
const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Reduce sensitivity threshold if needed
      if (Math.abs(currentScrollY - lastScrollY) < 5) return;

      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setScrollDirection("up");
      } else {
        setScrollDirection("down");
      }
      setLastScrollY(currentScrollY < 0 ? 0 : currentScrollY);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };


    if (typeof window !== 'undefined') {
        window.addEventListener("scroll", onScroll, { passive: true });
        handleScroll(); // Initial check
    }

    return () => {
        if (typeof window !== 'undefined') {
            window.removeEventListener("scroll", onScroll);
        }
    }
  }, [lastScrollY]);

  return scrollDirection;
}
// **** END OF HOOK DEFINITION ****


export default function ContentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Left sidebar state
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(true) // Right sidebar state
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [isMounted, setIsMounted] = useState(false);
  const [isTabManagerOpen, setIsTabManagerOpen] = useState(false); // Assuming this state is used elsewhere
  const tabManagerTriggerRef = useRef<HTMLButtonElement>(null); // Assuming this ref is used elsewhere
  const scrollDirection = useScrollDirection()
  const [isMobile, setIsMobile] = useState(false); // State for mobile status

  // Memoized toggle functions
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, []);

  const toggleRecommendation = useCallback(() => {
    setIsRecommendationOpen((prev) => !prev)
  }, []);

  const toggleTabManager = useCallback(() => { // Keep if used
    setIsTabManagerOpen((prev) => !prev);
  }, []);

  // Effect for mounting and mobile detection
  useEffect(() => {
    setIsMounted(true);
    let mediaQuery: MediaQueryList | null = null;

    const updateMobileStatus = () => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth < 768); // Use md breakpoint (Tailwind)
        }
    };

    const handleResize = (e?: MediaQueryList | MediaQueryListEvent) => {
        const currentlyMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        setIsMobile(currentlyMobile); // Update mobile status on resize/load

        // Set initial sidebar states based on screen size only once or when mode changes
         if (currentlyMobile) { // Mobile
            setIsSidebarOpen(false); // Start closed on mobile
            setIsRecommendationOpen(false); // Start closed on mobile
         } else { // Desktop
            setIsSidebarOpen(true); // Start open on desktop
            setIsRecommendationOpen(true); // Start open on desktop
         }
    }

    if (typeof window !== 'undefined') {
        mediaQuery = window.matchMedia('(max-width: 767px)'); // md breakpoint
        handleResize(); // Initial check for size and set states
        mediaQuery.addEventListener('change', handleResize); // Listen for breakpoint changes
        window.addEventListener('resize', updateMobileStatus); // Listen for general resize
    }

     return () => {
        setIsMounted(false);
        if (mediaQuery) {
            mediaQuery.removeEventListener('change', handleResize);
        }
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', updateMobileStatus);
        }
     }
  }, []); // Empty dependency array: runs once on mount, cleans up on unmount


  // Context Menu Handler
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    setMenuPosition({ x: event.clientX, y: event.clientY })
  }

  // Close Context Menu Handler
  const handleCloseMenu = () => {
    setMenuPosition(null)
  }

  // Clock Session End Handler
  const handleSessionEnd = (isStudySession: boolean) => {
    const message = isStudySession ? "Time to focus!" : "Time to take a break!"
    const borderColor = isStudySession ? "border-red-500" : "border-green-500"

    toast(message, {
      duration: 5000,
      position: "top-center",
      className: cn("custom-toast border-l-4 bg-background text-foreground mt-4 max-w-sm rounded-lg", borderColor),
    })
  }

  // Determine if navigation elements should render
  const excludedPaths = ["/", "/landing", "/signup", "/login", "/auth/signin", "/auth/signup", "/about"];
  const shouldRenderNav = !excludedPaths.includes(pathname) && isMounted;

  // Loading state until mounted
  if (!isMounted) {
     // You can return a more sophisticated loading skeleton here
     return <div className="h-screen w-screen bg-background flex items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" enableSystem={true} defaultTheme="light">
          <>
            {/* Conditional Rendering for Nav Elements */}
            {shouldRenderNav && (
              <>
                {/* Left Sidebar Component */}
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} isMobile={isMobile} />
                <RecommendedContent isOpen={isRecommendationOpen} toggleOpen={toggleRecommendation} />

                {/* Mobile Bottom Navbar */}
                {isMobile && <BottomNavbar />}
              </>
            )}

            {/* Toast Notifications */}
            <Toaster position="top-center" expand={false} richColors className="mt-10 " />

             {/* Fixed Header */}
             <header className={cn(
                 "fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-2 md:px-4 h-16", // Reduced horizontal padding slightly on mobile
                 "bg-white/80 dark:bg-[#2b2d36]/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/50",
                 // Apply scroll direction hide/show only if nav should be rendered
                 scrollDirection === "down" && shouldRenderNav ? "-translate-y-full" : "translate-y-0",
                 "transition-transform duration-300 ease-in-out",
                 // Adjust left margin based on sidebar state (only on desktop)
                 shouldRenderNav && isSidebarOpen && !isMobile && "md:left-64",
                 shouldRenderNav && !isSidebarOpen && !isMobile && "md:left-16",
                 // Ensure full width on mobile regardless of sidebar state
                 isMobile && "left-0 right-0"
             )}>
                 {/* Left Side: Toggle Button */}
                 {shouldRenderNav && ( // Show button only if nav is active
                     <button
                         onClick={toggleSidebar} // Always toggles the main left sidebar
                         className={cn(
                              "p-2 rounded-md transition-colors hover:bg-gray-200 dark:hover:bg-gray-700",
                              "text-gray-700 dark:text-gray-300",
                              isMobile ? "block" : "md:block ml-1" // Always visible on mobile, visible w/ margin on desktop
                         )}
                         aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                     >
                          {/* Icon depends on mobile/desktop and open state */}
                          {isMobile ? (
                              isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />
                          ) : (
                              isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />
                          )}
                     </button>
                 )}

                 {/* Spacer to push Pill to the right */}
                 <div className="flex-1" />

                 {/* --- The Novel Pill --- */}
                 {shouldRenderNav && (
                     <div className={cn(
                         "flex items-center gap-1 md:gap-1.5",
                         "px-2 py-1.5 rounded-full",
                         "bg-white/90 dark:bg-[#31333c]/90",
                         "border border-gray-200/80 dark:border-gray-700/60",
                         "shadow-sm"
                     )}>
                         {/* 1. Optional: Tab Manager Trigger */}
                         {/* If you implement TabManager, uncomment this */}
                         {/* <button ref={tabManagerTriggerRef} onClick={toggleTabManager} ... > <LayoutList /> </button> */}
                         {/* <div className="h-5 w-px bg-gray-200 dark:bg-gray-600/80"></div> */}

                         {/* 2. AI Feature Button */}
                         <AIFeature />

                         {/* Divider */}
                         <div className={cn("h-5 w-px bg-gray-200 dark:bg-gray-600/80")}></div>

                         {/* 3. Recommendation Sidebar Toggle (Always in Pill) */}
                         <button
                              onClick={toggleRecommendation}
                              className={cn(
                                  "p-2 rounded-full transition-colors duration-200 h-9 w-9 flex items-center justify-center",
                                  "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
                                  isRecommendationOpen && "bg-gray-200 dark:bg-gray-700" // Highlight if open
                              )}
                              aria-label={isRecommendationOpen ? "Close recommendations" : "Open recommendations"}
                          >
                              {isRecommendationOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
                          </button>
                     </div>
                 )}
             </header>

            {/* Main Content Area */}
            <main
              className={cn(
                 "flex-1 transition-all duration-300 ease-in-out",
                 "pt-16", // Account for fixed header height
                 isMobile ? "pb-20" : "pb-4", // Account for bottom nav height + extra padding, less padding on desktop
                 // Adjust left margin based on sidebar state (only on desktop)
                 shouldRenderNav && isSidebarOpen && !isMobile && "md:ml-64",
                 shouldRenderNav && !isSidebarOpen && !isMobile && "md:ml-16",
                 // Adjust right margin based on recommendation state (only on desktop)
                 // Assuming 80 (w-80 = 320px) is width of recommendation panel
                 shouldRenderNav && isRecommendationOpen && !isMobile && "md:mr-80",
              )}
              onContextMenu={shouldRenderNav ? handleContextMenu : undefined} // Enable context menu conditionally
            >
               {/* Content Container */}
               <div id="content-container" className="px-4 py-6 md:px-6 lg:px-8">
                  {children}
               </div>
            </main>

            {/* Right Recommendation Sidebar (Desktop Only) */}
             {shouldRenderNav && !isMobile && (
                 <aside className={cn(
                    "fixed top-0 right-0 h-screen border-l border-gray-200 dark:border-gray-700/50 transition-transform duration-300 ease-in-out z-20", // z-index below header/sidebar overlay
                    "bg-background", // Use background color for consistency
                    "w-80", // Fixed width for the sidebar
                    "pt-16", // Start below header
                    isRecommendationOpen ? "translate-x-0" : "translate-x-full", // Slide in/out animation
                 )}>
                     {/* Recommendation Content Goes Here */}
                     {/* Replace with your actual recommendation component */}
                     <div className="p-4 h-full overflow-y-auto">
                        <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
                        {/* Placeholder Content */}
                        <p>Recommendation items will appear here...</p>
                        <p>Based on your current context.</p>
                     </div>
                 </aside>
             )}
            {/* Consider a Bottom Sheet or Modal for Recommendations on Mobile, triggered from the Header Pill or BottomNavbar */}


            {/* Floating Widgets */}
            {shouldRenderNav && (
                <>
                  {/* Clock Component */}
                  <Clock onSessionEnd={handleSessionEnd} />
                  {/* Scroll Progress Bar */}
                  <ScrollProgressBar />
                </>
            )}
          </>
      </ThemeProvider>
    </SessionProvider>
  )
}

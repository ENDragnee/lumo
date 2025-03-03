"use client";

import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Clock } from "@/components/ui/clock";
import { Toaster, toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollProgressBar } from "@/components/scroll-progress-bar";
import ContextMenu2 from "@/components/context-menu";
import { ThemeProvider } from "next-themes";
import "@/app/globals.css";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/app/hooks/SidebarContext";
import { SessionProvider } from "next-auth/react";
import AIButton from "@/components/ai-feature";
import TabManager from "@/components/Tab";
import NewLeftSidebar from "./components/sideBar"; // Import your new sidebar component

const useScrollDirection = () => {
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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const scrollDirection = useScrollDirection();

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const handleCloseMenu = () => {
    setMenuPosition(null);
  };

  const handleSessionEnd = (isStudySession: boolean) => {
    const message = isStudySession ? "Time to focus!" : "Time to take a break!";
    const borderColor = isStudySession ? "red" : "green";

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
    });
  };

    const excludedSidebarPaths = [
      "/",
      "/landing",
      "/signup",
      "/login",
      "/auth/signin",
      "/auth/signup",
      "/main",
      "/about",
    ];
    const excludedThemePaths = [
      "/",
      "/main"
    ];

  const shouldRenderSidebar = !excludedSidebarPaths.includes(pathname);

  return (
    <html lang="en">
      <body
        className="min-h-screen flex flex-col bg-white dark:bg-[#404552] text-black dark:text-white"
        onContextMenu={handleContextMenu}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            enableSystem={true}
            defaultTheme="light"
          >
            <SidebarProvider>
              {shouldRenderSidebar && (
                // <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <NewLeftSidebar isOpen={isSidebarOpen}/>
              )}
            </SidebarProvider>

            <Toaster
              position="top-center"
              expand={false}
              richColors
              className="mt-10 "
            />
            {excludedSidebarPaths.includes(pathname) ? (
              <header className="fixed top-4 right-4 z-40 flex items-center space-x-2">
                <ThemeToggle />
              </header>
            ) : (
              <header className="fixed top-4 right-4 z-40 flex items-center space-x-2">
                <AIButton
                  style={{
                    opacity: scrollDirection === "down" ? 0 : 1,
                    visibility:
                      scrollDirection === "down" ? "hidden" : "visible",
                    transition: "opacity 0.3s ease, visibility 0.3s ease",
                  }}
                />
                <TabManager
                   style={{
                    opacity: scrollDirection === "down" ? 0 : 1,
                    visibility:
                      scrollDirection === "down" ? "hidden" : "visible",
                    transition: "opacity 0.3s ease, visibility 0.3s ease",
                  }}
                />
              </header>
            )}
            <main>
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

            {!excludedSidebarPaths.includes(pathname) && <ScrollProgressBar />}

            {menuPosition && !excludedSidebarPaths.includes(pathname) && (
              <ContextMenu2
                x={menuPosition.x}
                y={menuPosition.y}
                onClose={handleCloseMenu}
              />
            )}

            {excludedSidebarPaths.includes(pathname) && pathname != "/" && (
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
  );
}

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
import Sidebar from "@/components/aastu/Sidebar";
import { SidebarProvider } from "../hooks/SidebarContext";
import { SessionProvider } from "next-auth/react";
import AIButton from "@/components/ai-feature";
import TabManager from "@/components/Tab";

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

export default function AASTULayout({ children }: { children: ReactNode }) {
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

  const shouldRenderSidebar = !excludedSidebarPaths.includes(pathname);

  return (
    <>
      <SidebarProvider>
        {shouldRenderSidebar && (
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
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
          />
          <TabManager
            isOpen={isAIOpen}
            setIsOpen={setIsAIOpen}
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
              <footer className="border-t border-gray-200 dark:border-[#4b5162] py-8 sm:max-h-48 md:max-h-32">
                <div className="container mx-auto px-4">
                  <div className="flex justify-center">
                    <p className="text-sm text-gray-500 dark:text-[#7c818c]">
                      © 2024 Educational Platform. All rights reserved.
                    </p>
                  </div>
                </div>
              </footer>
            )}
      </>
  );
}

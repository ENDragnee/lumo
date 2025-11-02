// src/app/providers.tsx
"use client";

import { ReactNode, useState } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
//import LeftSidebar from "@/components/mainPage/LeftSidebar";
import BottomNavbar from "@/components/mainPage/BottomNavbar";
import { usePathname } from "next/navigation";

export default function Providers({ children }: { children: ReactNode }) {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const excludedSidebarPaths = [
    "/",
    "/landing",
    "/signup",
    "/login",
    "/auth/signin",
    "/auth/signup",
    "/content",
    "/dashboard"
  ];
  const pathname = usePathname();

  // --- Updated Condition ---
  // Check if pathname is in the exact excluded paths OR starts with /moe/ OR starts with /aastu/
  const shouldExcludeSidebar =
    excludedSidebarPaths.includes(pathname) ||
    pathname.startsWith("/moe") ||
    pathname.startsWith("/aastu");
  // Sidebar is visible if it should *not* be excluded
  const isSidebarVisible = !shouldExcludeSidebar;
  // --- End of Update ---


  // If the current route is excluded, render just the children wrapped in providers
  if (!isSidebarVisible) {
    return (
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Toaster position="top-center" expand={false} richColors className="mt-10" />
          {children}
        </ThemeProvider>
      </SessionProvider>
    );
  }

  // Otherwise, include the layout with the sidebar and bottom navbar.
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" enableSystem defaultTheme="light">
        <Toaster position="top-center" expand={false} richColors className="mt-10" />
        <main className="flex h-screen relative">
          <div className="hidden md:block">
          {/*<LeftSidebar isCollapsed={isLeftSidebarCollapsed} setIsCollapsed={setIsLeftSidebarCollapsed} />*/}
          </div>
          {/* Use flex-1 and overflow-auto on the main content area */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
            <BottomNavbar />
          </div>
        </main>
      </ThemeProvider>
    </SessionProvider>
  );
}

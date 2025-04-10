"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LeftSidebar from "@/components/mainPage/LeftSidebar";
import CentralWorkspace from "@/components/mainPage/CentralWorkspace";
import BottomNavbar from "@/components/mainPage/BottomNavbar";

export default function Home() {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false); // Note: Unused in current code
  const router = useRouter();

  const handleCreateContent = () => {
    router.push("/creator-studio");
  };

  return (
    <main className="flex h-screen relative">
      {/* LeftSidebar hidden on mobile, visible on md and up */}
      <div className="hidden md:block">
        <LeftSidebar
          isCollapsed={isLeftSidebarCollapsed}
          setIsCollapsed={setIsLeftSidebarCollapsed}
        />
      </div>
      <CentralWorkspace />
      {/* BottomNavbar visible on mobile, hidden on md and up */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavbar />
      </div>
    </main>
  );
}
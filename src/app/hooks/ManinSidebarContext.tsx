// Create a file named SidebarContext.tsx in your app/hooks/ directory:

"use client";
import { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface SidebarContextType {
  isSidebarOpen: boolean;
  isRecommendationOpen: boolean;
  toggleSidebar: () => void;
  toggleRecommendation: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleRecommendation = () => {
    setIsRecommendationOpen((prev) => !prev);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsSidebarOpen(!e.matches);
      setIsRecommendationOpen(!e.matches);
    };
    
    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, isRecommendationOpen, toggleSidebar, toggleRecommendation }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
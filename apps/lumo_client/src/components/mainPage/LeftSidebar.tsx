"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  CornerDownRight,
  CheckCheck,
  Layers,
  Crown,
  ArrowRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { formatDistanceToNow } from "date-fns";
import type { ObjectId } from "mongoose";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// --- Compaction Changes Summary ---
// 1. Sidebar Width: Reduced collapsed width (80px -> 60px) and expanded width (260px -> 250px).
// 2. Main Padding: Reduced from p-4 to p-2 for a tighter overall feel.
// 3. Header: Reduced margin-bottom (mb-6 -> mb-4) and font-size (text-xl -> text-lg).
// 4. Section Spacing: Reduced space between sections (space-y-4 -> space-y-2).
// 5. Icon Sizes: Standardized on smaller icons (w-5 h-5 -> w-4 h-4).
// 6. List Item Padding: Reduced vertical padding on items (p-2 -> px-2 py-1.5) for a denser list.
// 7. List Item Indentation: Adjusted left padding (pl-7 -> pl-6) to align with smaller icons.

interface LeftSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}
interface HistoryItem {
  _id: string;
  content_id: {
    _id: ObjectId;
    title: string;
    tags: [string];
  };
  starred_status: boolean;
  viewed_at: string;
}

interface Workspace {
  name: string;
  icon: React.ElementType;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
}) => {
  const [activeWorkspace, setActiveWorkspace] = useState("My Notes");
  const [recentHistories, setRecentHistories] = useState<HistoryItem[]>([]);
  const [stars, setStars] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // State for collapsible sections
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
  const [isRecentOpen, setIsRecentOpen] = useState(true);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(true);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const workspaces: Workspace[] = [{ name: "Exam Prep", icon: Star }];

  // --- Data Fetching ---
  const fetchRecentHistories = async () => {
    try {
      const response = await fetch("/api/history?limit=5");
      if (response.ok) {
        const data = await response.json();
        data.sort(
          (a: HistoryItem, b: HistoryItem) =>
            new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime()
        );
        setRecentHistories(data);
      }
    } catch (error) {
      console.error("Failed to fetch recent histories:", error);
    }
  };

  const fetchStarred = async () => {
    try {
      const response = await fetch("/api/history/star?limit=5");
      if (response.ok) {
        const data = await response.json();
        setStars(data);
      }
    } catch (error) {
      console.log("Failed to fetch stars:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchRecentHistories(), fetchStarred()]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleStarToggle = async (contentId: ObjectId) => {
    console.log("Toggling star for:", contentId);
    // TODO: Implement API call and optimistic update/refetch
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-neutral-900";

  // --- Skeleton Loader ---
  if (isLoading) {
    return (
      <motion.div
        ref={sidebarRef}
        className={`flex flex-col p-2 border-r h-full rounded-lg bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 ${isCollapsed ? 'items-center' : ''}`}
        initial={{ width: isCollapsed ? 60 : 250 }}
        animate={{ width: isCollapsed ? 60 : 250 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="animate-pulse w-full">
          {/* Header Skeleton */}
          <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center mb-4 h-8`}>
             {!isCollapsed && <div className="h-5 w-16 bg-neutral-300 dark:bg-neutral-700 rounded"></div>}
             <div className="h-7 w-7 bg-neutral-300 dark:bg-neutral-700 rounded-full"></div>
          </div>

          {/* Nav Items Skeleton */}
          <div className={`space-y-2 mt-2 ${isCollapsed ? 'space-y-4' : ''}`}>
             {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                 <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center h-8`}>
                   <div className={`flex items-center gap-2 ${isCollapsed ? '' : 'w-full'}`}>
                     <div className="h-4 w-4 bg-neutral-300 dark:bg-neutral-700 rounded flex-shrink-0"></div>
                     {!isCollapsed && <div className="h-4 w-3/5 bg-neutral-300 dark:bg-neutral-700 rounded"></div>}
                   </div>
                 </div>
                 {!isCollapsed && (
                    <div className="pl-6 space-y-1.5">
                      <div className="h-4 w-4/5 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
                      <div className="h-4 w-3/5 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
                    </div>
                 )}
              </div>
             ))}
          </div>

          {/* Footer Skeleton */}
          <div className="mt-auto flex justify-center pt-2">
            <div className="h-8 w-8 bg-neutral-300 dark:bg-neutral-700 rounded-md"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- Main Component ---
  return (
    <motion.div
      ref={sidebarRef}
      className="h-full flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent dark:scrollbar-thumb-neutral-700 border-r rounded-lg bg-gray-200 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
      initial={{ width: isCollapsed ? 60 : 250 }}
      animate={{ width: isCollapsed ? 60 : 250 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ scrollbarGutter: 'stable' }}
    >
      <div className="flex flex-col h-full p-2">
        {/* Header */}
        <div className={`flex items-center mb-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">Lumo</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1 rounded text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:text-neutral-400 ${focusRing}`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-grow space-y-2">
           {/* --- Home Section --- */}
           <div>
             <button
               onClick={() => router.push('/main')}
               className={`flex items-center w-full gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors ${focusRing} ${isCollapsed ? "justify-center" : ""}`}
             >
               <Home className="w-4 h-4 flex-shrink-0 text-neutral-500" />
               {!isCollapsed && (
                 <span className="text-sm font-medium">Home</span>
               )}
             </button>
           </div>
          {/* --- Recent Section --- */}
          <div>
            <button
               className={`flex items-center w-full justify-between px-2 py-1.5 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors ${focusRing} ${isCollapsed ? "justify-center" : ""}`}
               onClick={() => {
                 if (isCollapsed) {
                   setIsCollapsed(false);
                   setIsRecentOpen(true);
                 } else {
                   setIsRecentOpen(!isRecentOpen);
                 }
               }}
               aria-expanded={!isCollapsed && isRecentOpen}
            >
              <div className={`flex items-center gap-2`}>
                <CheckCheck className="w-4 h-4 flex-shrink-0 text-neutral-500" />
                {!isCollapsed && (
                  <h2 className="text-sm font-semibold">Recent</h2>
                )}
              </div>
              {!isCollapsed && (
                 isRecentOpen
                  ? <ChevronUp size={16} className="text-neutral-500" />
                  : <ChevronDown size={16} className="text-neutral-500" />
               )}
            </button>
            {!isCollapsed && isRecentOpen && (
              <div className="pl-6 mt-1 space-y-0.5">
                {recentHistories.length === 0 && (
                     <p className="px-2 py-1 text-xs text-neutral-500 dark:text-neutral-500">No recent items.</p>
                 )}
                {recentHistories.map((history) => (
                  <a
                    key={history._id}
                    href={`/content?id=${history.content_id?._id}`}
                    className={`group flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200 ${focusRing}`}
                  >
                    <div className="flex flex-col overflow-hidden text-left">
                      <span className="truncate font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                        {history.content_id?.title || "Untitled"}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-500 truncate">
                        {formatDistanceToNow(new Date(history.viewed_at), { addSuffix: true })}
                      </span>
                    </div>
                  </a>
                ))}
                {recentHistories.length > 0 && (
                  <button
                    onClick={() => router.push('/histories')}
                    className={`flex items-center gap-1 w-full px-2 py-1.5 mt-1 rounded-md text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors ${focusRing}`}
                  >
                    <span>Show More</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* --- Favorites Section --- */}
          <div>
             <button
               className={`flex items-center w-full justify-between px-2 py-1.5 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors ${focusRing} ${isCollapsed ? "justify-center" : ""}`}
               onClick={() => {
                 if (isCollapsed) {
                   setIsCollapsed(false);
                   setIsFavoritesOpen(true);
                 } else {
                   setIsFavoritesOpen(!isFavoritesOpen);
                 }
               }}
               aria-expanded={!isCollapsed && isFavoritesOpen}
            >
               <div className={`flex items-center gap-2`}>
                 <Crown className="w-4 h-4 flex-shrink-0 text-neutral-500" />
                 {!isCollapsed && (
                   <h2 className="text-sm font-semibold">Favorites</h2>
                 )}
               </div>
               {!isCollapsed && (
                  isFavoritesOpen
                    ? <ChevronUp size={16} className="text-neutral-500" />
                    : <ChevronDown size={16} className="text-neutral-500" />
               )}
             </button>
            {!isCollapsed && isFavoritesOpen && (
              <div className="pl-6 mt-1 space-y-0.5">
                 {stars.length === 0 && (
                     <p className="px-2 py-1 text-xs text-neutral-500 dark:text-neutral-500">No favorited items.</p>
                 )}
                {stars.map((item) => (
                  <a
                    key={item._id}
                    href={`/content?id=${item.content_id?._id}`}
                    className={`group flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200 ${focusRing}`}
                  >
                    <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                    <span className="truncate font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                        {item.content_id?.title || "Untitled"}
                    </span>
                  </a>
                ))}
                {stars.length > 0 && (
                  <button
                     onClick={() => router.push('/favorites')}
                    className={`flex items-center gap-1 w-full px-2 py-1.5 mt-1 rounded-md text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors ${focusRing}`}
                  >
                    <span>Show More</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div> {/* End flex-grow */}

        {/* Footer Items */}
        <div className="mt-auto flex justify-center pt-2">
          <ThemeToggle />
        </div>
      </div>
    </motion.div>
  );
};

export default LeftSidebar;
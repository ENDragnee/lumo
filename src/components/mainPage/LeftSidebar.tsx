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

// --- Design System Constants (Implicitly via Tailwind) ---
// Base spacing unit: 4px (Tailwind default)
// Consistent Padding: p-1 (4px), p-2 (8px), p-4 (16px)
// Consistent Gaps: gap-2 (8px)
// Consistent Vertical Spacing: space-y-1 (4px), space-y-4 (16px)
// Font Sizes: text-xs, text-sm, text-base, text-xl, text-2xl
// Font Weights: font-normal, font-medium, font-semibold, font-bold
// Colors: Using Tailwind's neutral, blue, yellow palettes primarily.

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
  const [activeWorkspace, setActiveWorkspace] = useState("My Notes"); // Example state
  const [recentHistories, setRecentHistories] = useState<HistoryItem[]>([]);
  const [stars, setStars] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession(); // Assuming session might be used later
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Assuming this might be used later

  // State for collapsible sections
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
  const [isRecentOpen, setIsRecentOpen] = useState(true);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(true);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null); // Assuming this might be used later
  const avatarRef = useRef<HTMLDivElement>(null); // Assuming this might be used later
  const router = useRouter();

  // TODO: Replace with dynamic data if necessary
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

  // --- Event Handlers ---
  const handleStarToggle = async (contentId: ObjectId) => {
    // Existing implementation... omitted for brevity
    console.log("Toggling star for:", contentId);
    // TODO: Implement API call and optimistic update/refetch
    // Example refetch:
    // await fetchRecentHistories();
    // await fetchStarred();
  };

  // Close user menu - keep if user menu functionality is added later
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

  // Expand sidebar if collapsed and a section icon is clicked
  // (Now handled within the section button's onClick)

  // --- Focus Ring Utility Class ---
  const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-neutral-900";

  // --- Skeleton Loader ---
  if (isLoading) {
    return (
      <motion.div
        ref={sidebarRef}
        className={`flex flex-col p-4 border-r h-full rounded-lg bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 ${isCollapsed ? 'items-center' : ''}`}
        initial={{ width: isCollapsed ? 80 : 260 }} // Slightly wider expanded width
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="animate-pulse w-full">
          {/* Header Skeleton */}
           <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center mb-6 h-8`}>
             {!isCollapsed && <div className="h-6 w-20 bg-neutral-300 dark:bg-neutral-700 rounded"></div>}
             <div className="h-8 w-8 bg-neutral-300 dark:bg-neutral-700 rounded-full"></div>
           </div>

          {/* Nav Items Skeleton */}
          <div className={`space-y-4 ${isCollapsed ? 'space-y-6' : ''}`}>
             {[...Array(3)].map((_, i) => ( // Representing sections
              <div key={i} className="space-y-2">
                 <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
                   <div className={`flex items-center gap-2 ${isCollapsed ? '' : 'w-full'}`}>
                     <div className="h-5 w-5 bg-neutral-300 dark:bg-neutral-700 rounded flex-shrink-0"></div>
                     {!isCollapsed && <div className="h-5 w-3/5 bg-neutral-300 dark:bg-neutral-700 rounded"></div>}
                   </div>
                 </div>
                 {!isCollapsed && ( // Skeleton items only shown when expanded
                    <div className="pl-7 space-y-1">
                      <div className="h-4 w-4/5 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
                      <div className="h-4 w-3/5 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
                    </div>
                 )}
              </div>
             ))}
          </div>

          {/* Footer Skeleton */}
          <div className="mt-auto flex justify-center pt-4">
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
      className="h-full flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent dark:scrollbar-thumb-neutral-700 border-r rounded-lg bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
      initial={{ width: isCollapsed ? 80 : 260 }} // Consistent width
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ scrollbarGutter: 'stable' }} // Prevent layout shift from scrollbar
    >
      <div className="flex flex-col h-full p-4">
        {/* Header */}
        <div className={`flex items-center mb-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            // Principle 1: Master Typography - Clear brand name, slightly larger, bold
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Lumo</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1 rounded text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:text-neutral-400 ${focusRing}`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-grow space-y-4">
           {/* --- Home Section --- */}
           <div>
             <button
               onClick={() => router.push('/main')}
               className={`flex items-center w-full gap-2 p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors ${focusRing} ${isCollapsed ? "justify-center" : ""}`}
             >
               <Home className="w-5 h-5 flex-shrink-0 text-neutral-500" />
               {!isCollapsed && (
                 // Principle 1: Typography - Section item text
                 <span className="text-sm font-medium">Home</span>
               )}
             </button>
           </div>

          {/* --- Workspaces Section --- */}
          {/* <div>
            <button
              className={`flex items-center w-full justify-between p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors ${focusRing} ${isCollapsed ? "justify-center" : ""}`}
              onClick={() => {
                if (isCollapsed) {
                  setIsCollapsed(false);
                  setIsWorkspaceOpen(true);
                } else {
                  setIsWorkspaceOpen(!isWorkspaceOpen);
                }
              }}
              aria-expanded={!isCollapsed && isWorkspaceOpen}
            >
              <div className={`flex items-center gap-2`}>
                <Layers className="w-5 h-5 flex-shrink-0 text-neutral-500" />
                {!isCollapsed && (
                  // Principle 1: Typography - Section header text
                  <h2 className="text-sm font-semibold">Workspaces</h2>
                )}
              </div>
              {!isCollapsed && (
                // Principle 4: Clarity - Indicate collapsible state
                isWorkspaceOpen
                  ? <ChevronUp size={16} className="text-neutral-500" />
                  : <ChevronDown size={16} className="text-neutral-500" />
              )}
            </button> */}

            {/* Workspace items */}
            {/* {!isCollapsed && isWorkspaceOpen && (
              <div className="pl-7 mt-1 space-y-1">
                {workspaces.map((workspace: Workspace) => (
                  <button
                    key={workspace.name}
                    className={`flex items-center w-full p-2 rounded-md text-sm text-left transition-colors ${focusRing} ${
                      activeWorkspace === workspace.name // Principle 3 & 4: Indicate active state clearly
                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200"
                    }`}
                    onClick={() => setActiveWorkspace(workspace.name)}
                  >
                    <CornerDownRight className="w-4 h-4 mr-2 flex-shrink-0 text-neutral-400" />
                    <span className="truncate">{workspace.name}</span>
                  </button>
                ))}
              </div>
            )} */}
          {/* </div> */}

          {/* --- Recent Section --- */}
          <div>
            <button
               className={`flex items-center w-full justify-between p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors ${focusRing} ${isCollapsed ? "justify-center" : ""}`}
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
                <CheckCheck className="w-5 h-5 flex-shrink-0 text-neutral-500" />
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

            {/* Recent items */}
            {!isCollapsed && isRecentOpen && (
              <div className="pl-7 mt-1 space-y-1">
                {recentHistories.length === 0 && (
                     // Principle 4: Clarity - Clear empty state message
                     <p className="px-2 py-1 text-sm text-neutral-500 dark:text-neutral-500">No recent items.</p>
                 )}
                {recentHistories.map((history) => (
                  <a
                    key={history._id}
                    href={`/content?id=${history.content_id?._id}`}
                    className={`group flex items-center justify-between gap-2 p-2 rounded-md text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200 ${focusRing}`}
                  >
                    <div className="flex flex-col overflow-hidden text-left">
                       {/* Principle 1: Typography - Primary item text */}
                      <span className="truncate font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                        {history.content_id?.title || "Untitled"}
                      </span>
                      {/* Principle 1: Typography - Secondary/metadata text */}
                      <span className="text-xs text-neutral-500 dark:text-neutral-500 truncate">
                        {formatDistanceToNow(new Date(history.viewed_at), { addSuffix: true })}
                      </span>
                    </div>
                    {/* Optional Star Button - Keep UI clean, consider adding on hover only if needed */}
                    {/* <button
                      onClick={(e) => { e.preventDefault(); handleStarToggle(history.content_id?._id); }}
                      className={`p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity ${focusRing}`}
                      aria-label={history.starred_status ? "Unstar item" : "Star item"}
                    >
                      <Star size={16} className={`${history.starred_status ? 'fill-yellow-400 text-yellow-500' : 'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300'}`} />
                    </button> */}
                  </a>
                ))}
                {/* Show More Link */}
                {recentHistories.length > 0 && (
                  <button
                    onClick={() => router.push('/histories')} // Adjust route as needed
                    className={`flex items-center gap-1 w-full p-2 mt-1 rounded-md text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors ${focusRing}`}
                  >
                    <span>Show More</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* --- Favorites Section --- */}
          <div>
             <button
               className={`flex items-center w-full justify-between p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors ${focusRing} ${isCollapsed ? "justify-center" : ""}`}
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
                 <Crown className="w-5 h-5 flex-shrink-0 text-neutral-500" />
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

            {/* Favorites items */}
            {!isCollapsed && isFavoritesOpen && (
              <div className="pl-7 mt-1 space-y-1">
                 {stars.length === 0 && (
                     <p className="px-2 py-1 text-sm text-neutral-500 dark:text-neutral-500">No favorited items.</p>
                 )}
                {stars.map((item) => (
                  <a
                    key={item._id}
                    href={`/content?id=${item.content_id?._id}`}
                    className={`group flex items-center gap-2 p-2 rounded-md text-sm transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200 ${focusRing}`}
                  >
                    <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                    <span className="truncate font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                        {item.content_id?.title || "Untitled"}
                    </span>
                  </a>
                ))}
                 {/* Show More Link */}
                {stars.length > 0 && (
                  <button
                     onClick={() => router.push('/favorites')} // Adjust route as needed
                    className={`flex items-center gap-1 w-full p-2 mt-1 rounded-md text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors ${focusRing}`}
                  >
                    <span>Show More</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div> {/* End flex-grow */}

        {/* Footer Items */}
        <div className="mt-auto flex justify-center pt-4">
           {/* Principle 2: Layout - Pushed to bottom */}
          <ThemeToggle />
          {/* Consider adding User Profile/Logout button here if needed */}
        </div>
      </div>
    </motion.div>
  );
};

export default LeftSidebar;
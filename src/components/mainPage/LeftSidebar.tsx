"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown, // Added for collapse indicator
  ChevronUp,   // Added for collapse indicator
  Star,
  CornerDownRight,
  CheckCheck,
  Layers,
  Crown,
  ArrowRight, // Added for Show More link
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { formatDistanceToNow } from "date-fns";
import type { ObjectId } from "mongoose";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // Corrected import

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
  icon: React.ElementType; // Assuming icon is a component like Lucide icons
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
  const router = useRouter(); // Use the imported hook

  const workspaces: Workspace[] = [{ name: "Exam Prep", icon: Star }];

  const handleStarToggle = async (contentId: ObjectId) => {
    try {
      const response = await fetch("/api/history/star", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_id: contentId }),
      });

      if (response.ok) {
        // Optimistically update UI or refetch
        fetchRecentHistories();
        fetchStarred(); // Also refresh favorites in case starring adds/removes
      }
    } catch (error) {
      console.error("Error toggling star:", error);
    }
  };

  const fetchRecentHistories = async () => {
    try {
      const response = await fetch("/api/history?limit=5"); // Limit initial fetch if desired
      if (response.ok) {
        const data = await response.json();
        // Ensure sorting by viewed_at descending (API should ideally handle this)
        data.sort((a: HistoryItem, b: HistoryItem) => new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime());
        setRecentHistories(data);
      }
    } catch (error) {
      console.error("Failed to fetch recent histories:", error);
    }
  };

  const fetchStarred = async () => {
    try {
      const response = await fetch("/api/history/star?limit=5"); // Limit initial fetch if desired
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
      setIsLoading(true); // Set loading true at the start
      await Promise.all([fetchRecentHistories(), fetchStarred()]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Close user menu when clicking outside
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
  const handleSectionIconClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  // Render skeleton loading state
  if (isLoading) {
    return (
      <motion.div
        ref={sidebarRef}
        className="flex flex-col p-4 border-r-2 h-full rounded-lg bg-zinc-200 dark:bg-[#16181c] border-gray-200 dark:border-[#383c3a]"
        initial={{ width: isCollapsed ? 80 : 250 }}
        animate={{ width: isCollapsed ? 80 : 250 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Simplified Skeleton */}
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-8 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-5/6 bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
          <div className="h-6 w-4/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-5/6 bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
          <div className="h-6 w-4/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-3/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-5/6 bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
          <div className="h-6 w-4/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="mt-auto flex justify-center">
             <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
           </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={sidebarRef}
      className="h-full flex scrollbar-none flex-col overflow-y-auto border-r-2 rounded-lg bg-zinc-200 dark:bg-[#16181c] border-gray-200 dark:border-[#383c3a]"
      initial={{ width: isCollapsed ? 80 : 250 }}
      animate={{ width: isCollapsed ? 80 : 250 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex flex-col h-full p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <h2 className="text-2xl font-bold dark:text-[#5294e2]">Lumo</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-gray-600 dark:text-[#5294e2] p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 ${isCollapsed ? "mx-auto" : ""}`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>

        <div className="space-y-4 flex-grow"> {/* Reduced space-y slightly */}
          {/* Home Section */}
          <div>
             <button
               onClick={() => router.push('/main')}
               className={`flex items-center w-full ${isCollapsed ? "justify-center" : "gap-2"} hover:bg-gray-300 dark:hover:bg-[#33475f] rounded-md p-2 hover:scale-105 transition-transform text-left`}
            >
               <Home className="w-5 h-5 dark:text-[#5294e2] flex-shrink-0" onClick={handleSectionIconClick} />
               {!isCollapsed && (
                 <h3 className="text-base font-semibold dark:text-[#7c818c]">
                   Home
                 </h3>
               )}
             </button>
           </div>

          {/* Workspaces Section */}
          <div>
            <button
              className={`flex items-center w-full justify-between ${isCollapsed ? "justify-center" : ""} hover:bg-gray-300 dark:hover:bg-[#33475f] rounded-md p-2 transition-colors text-left`}
              onClick={() => {
                if (isCollapsed) {
                  setIsCollapsed(false); // Expand sidebar if collapsed
                  setIsWorkspaceOpen(true); // Ensure section is open
                } else {
                  setIsWorkspaceOpen(!isWorkspaceOpen); // Toggle section
                }
              }}
              aria-expanded={isWorkspaceOpen}
            >
              <div className={`flex items-center ${isCollapsed ? "" : "gap-2"}`}>
                <Layers className="w-5 h-5 dark:text-[#5294e2] flex-shrink-0" />
                {!isCollapsed && (
                  <h3 className="text-base font-semibold dark:text-[#7c818c]">
                    Workspaces
                  </h3>
                )}
              </div>
              {!isCollapsed && ( // Show chevron only when expanded
                isWorkspaceOpen ? <ChevronUp size={18} className="text-gray-500 dark:text-gray-400" /> : <ChevronDown size={18} className="text-gray-500 dark:text-gray-400" />
              )}
            </button>

            {/* Workspace items - Conditionally render based on isWorkspaceOpen and !isCollapsed */}
            {!isCollapsed && isWorkspaceOpen && (
              <div className="pl-4 mt-1 space-y-1"> {/* Indent items */}
                {workspaces.map((workspace : Workspace) => (
                  <button
                    key={workspace.name}
                    className={`flex items-center w-full p-2 rounded-md text-sm ${
                      activeWorkspace === workspace.name
                        ? "bg-blue-100 dark:bg-[#383c4a] text-blue-800 dark:text-white font-medium" // Adjusted active style
                        : "hover:bg-zinc-300 dark:hover:bg-[#33475f] dark:text-[#a0a5af] hover:scale-105 transition-transform"
                    }`}
                    onClick={() => setActiveWorkspace(workspace.name)}
                  >
                    <CornerDownRight className="w-4 h-4 dark:text-[#5294e2] mr-2 flex-shrink-0" />
                    {/* Optional: Add workspace specific icon if available */}
                    <span className="truncate"> {workspace.name}</span>
                  </button>
                ))}
                 {/* No "Show More" needed for workspaces based on current structure */}
              </div>
            )}
          </div>

          {/* Recent Section */}
          <div>
            <button
               className={`flex items-center w-full justify-between ${isCollapsed ? "justify-center" : ""} hover:bg-gray-300 dark:hover:bg-[#33475f] rounded-md p-2 transition-colors text-left`}
               onClick={() => {
                 if (isCollapsed) {
                   setIsCollapsed(false); // Expand sidebar if collapsed
                   setIsRecentOpen(true); // Ensure section is open
                 } else {
                   setIsRecentOpen(!isRecentOpen); // Toggle section
                 }
               }}
               aria-expanded={isRecentOpen}
            >
              <div className={`flex items-center ${isCollapsed ? "" : "gap-2"}`}>
                <CheckCheck className="w-5 h-5 dark:text-[#5294e2] flex-shrink-0" />
                {!isCollapsed && (
                  <h3 className="text-base font-semibold dark:text-[#7c818c]">
                    Recent
                  </h3>
                )}
              </div>
              {!isCollapsed && ( // Show chevron only when expanded
                 isRecentOpen ? <ChevronUp size={18} className="text-gray-500 dark:text-gray-400" /> : <ChevronDown size={18} className="text-gray-500 dark:text-gray-400" />
               )}
            </button>

            {/* Recent items - Conditionally render */}
            {!isCollapsed && isRecentOpen && (
              <div className="pl-4 mt-1 space-y-1"> {/* Indent items */}
                {recentHistories.length === 0 && (
                     <p className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1">No recent items.</p>
                 )}
                {recentHistories.map((history, index) => (
                  <a
                    key={history._id}
                    href={`/content?id=${history.content_id?._id}`}
                    className={`flex items-center justify-between group rounded-md p-2 hover:bg-zinc-300 dark:hover:bg-[#33475f] transition-all duration-150 ease-in-out
                      ${index === 0 ? 'bg-[#C1A466] dark:bg-blue-900/30 hover:bg-orange-500 dark:hover:bg-blue-900/50 h-14 w-52' : ''} // Highlight first item
                    `}
                  >
                    <div className="flex items-center overflow-hidden mr-2">
                      <CornerDownRight className="w-4 h-4 dark:text-[#5294e2] mr-2 flex-shrink-0" />
                      <div className="flex flex-col text-left overflow-hidden">
                        <span className={`truncate text-sm dark:text-[#a0a5af] group-hover:dark:text-[#cdd1d7]
                         ${index === 0 ? 'font-semibold dark:text-blue-300 text-lg' : ''} // Larger/bold title for first item
                        `}>
                          {history.content_id?.title || "Untitled"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-[#81a9d9] truncate">
                          {formatDistanceToNow(new Date(history.viewed_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                     {/* Star Button - Consider placement/styling */}
                     {/* <button
                       onClick={(e) => {
                         e.preventDefault(); // Prevent link navigation
                         e.stopPropagation(); // Prevent container hover effects if needed
                         handleStarToggle(history.content_id?._id);
                       }}
                       className="p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-yellow-200 dark:hover:bg-yellow-700 transition-opacity"
                       aria-label={history.starred_status ? "Unstar item" : "Star item"}
                     >
                       <Star size={16} className={` ${history.starred_status ? 'fill-current text-yellow-500' : 'text-gray-400 dark:text-gray-500'}`} />
                     </button> */}
                  </a>
                ))}
                {/* Show More Link */}
                {recentHistories.length > 0 && ( // Only show if there are items
                  <button
                    onClick={() => router.push('/histories')} // Adjust route as needed
                    className="flex items-center gap-2 w-full p-2 mt-1 rounded-md text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <span>Show More</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Favorites Section */}
          <div>
             <button
               className={`flex items-center w-full justify-between ${isCollapsed ? "justify-center" : ""} hover:bg-gray-300 dark:hover:bg-[#33475f] rounded-md p-2 transition-colors text-left`}
               onClick={() => {
                 if (isCollapsed) {
                   setIsCollapsed(false); // Expand sidebar if collapsed
                   setIsFavoritesOpen(true); // Ensure section is open
                 } else {
                   setIsFavoritesOpen(!isFavoritesOpen); // Toggle section
                 }
               }}
               aria-expanded={isFavoritesOpen}
            >
               <div className={`flex items-center ${isCollapsed ? "" : "gap-2"}`}>
                 <Crown className="w-5 h-5 dark:text-[#5294e2] flex-shrink-0" />
                 {!isCollapsed && (
                   <h3 className="text-base font-semibold dark:text-[#7c818c]">
                     Favorites
                   </h3>
                 )}
               </div>
               {!isCollapsed && ( // Show chevron only when expanded
                 isFavoritesOpen ? <ChevronUp size={18} className="text-gray-500 dark:text-gray-400" /> : <ChevronDown size={18} className="text-gray-500 dark:text-gray-400" />
               )}
             </button>

            {/* Favorites items - Conditionally render */}
            {!isCollapsed && isFavoritesOpen && (
              <div className="pl-4 mt-1 space-y-1"> {/* Indent items */}
                 {stars.length === 0 && (
                     <p className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1">No favorited items.</p>
                 )}
                {stars.map((item) => (
                  <a
                    key={item._id} // Use history item _id as key
                    href={`/content?id=${item.content_id?._id}`}
                    className="flex items-center group gap-2 p-2 rounded-md hover:bg-zinc-300 dark:hover:bg-[#33475f] dark:text-[#a0a5af] hover:scale-105 transition-transform text-sm"
                  >
                    <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                    <span className="truncate">{item.content_id?.title || "Untitled"}</span>
                  </a>
                ))}
                 {/* Show More Link */}
                {stars.length > 0 && ( // Only show if there are items
                  <button
                     onClick={() => router.push('/favorites')} // Adjust route as needed
                    className="flex items-center gap-2 w-full p-2 mt-1 rounded-md text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <span>Show More</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div> {/* End flex-grow */}

        {/* Footer Items */}
        <div className="mt-auto flex flex-col items-center justify-center pt-4">
          {/* <div className="flex flex-col items-center bg-dark-secondary rounded-md hover:scale-105 transition-transform"> */}
            <ThemeToggle />
          {/* </div> */}
          {/* Consider adding User Profile/Logout here if needed */}
        </div>
      </div>
    </motion.div>
  );
};

export default LeftSidebar;
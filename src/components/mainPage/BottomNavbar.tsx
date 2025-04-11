"use client";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import Link from "next/link";
// Alias the imported User icon to avoid naming conflict with UserIcon component
import { Home, Folder, Book, Plus, User as HistoryIcon } from "lucide-react"; // Added Plus
import { ThemeToggle } from "@/components/theme-toggle";
import UserIcon from '@/components/mainPage/UserIcon'; // Import the UserIcon component

const BottomNavbar = () => {
  const pathname = usePathname();
  const router = useRouter(); // Initialize router

  const tabs = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Workspaces", icon: Folder, path: "/workspaces" },
    // Removed Library to make space, adjust as needed
    // { name: "Library", icon: Book, path: "/library" },
  ];

  // Common class names for bottom nav items
  const itemBaseClass = "flex flex-col items-center justify-center flex-1 h-full p-1 cursor-pointer"; // Reduced padding slightly
  const itemTextClass = "text-xs mt-1";
  const itemActiveClass = "text-blue-500 dark:text-blue-400";
  const itemInactiveClass = "text-gray-600 dark:text-gray-400";
  const itemHoverClass = "hover:text-blue-600 dark:hover:text-blue-300 transition-colors";

  return (
    // Add fixed positioning, z-index, and md:hidden to hide on medium screens and up
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-stretch bg-white dark:bg-gray-800 h-16 border-t border-gray-200 dark:border-gray-700 md:hidden">
      {/* Navigation Tabs */}
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.path}
          className={`${itemBaseClass} ${pathname === tab.path ? itemActiveClass : itemInactiveClass} ${itemHoverClass}`}
        >
          <tab.icon size={24} />
          <span className={itemTextClass}>{tab.name}</span>
        </Link>
      ))}

      {/* Create Button */}
      <button
        type="button"
        onClick={() => router.push("/create")}
        title="Create"
        className={`${itemBaseClass} ${itemInactiveClass} ${itemHoverClass}`} // Use inactive and hover styles
        aria-label="Create new content"
      >
        <Plus size={26} /> {/* Slightly larger icon */}
        <span className={itemTextClass}>Create</span>
      </button>

      {/* Theme Toggle */}
      {/* Wrap ThemeToggle in a div that follows the pattern if it doesn't handle clicks/styling itself */}
      <div className={`${itemBaseClass} ${itemInactiveClass}`}> {/* Theme doesn't need hover/active state */}
         <ThemeToggle />
         <span className={itemTextClass}>Theme</span>
      </div>

      {/* UserIcon Container */}
      {/* Ensure this container also uses flex-1 and centers content */}
      <div className={`${itemBaseClass} ${itemInactiveClass}`}>
         {/* UserIcon component now sits inside the centered container */}
         <UserIcon />
         {/* Label is optional, UserIcon component doesn't have one built-in */}
         <span className={itemTextClass}>Account</span>
      </div>
    </nav>
  );
};

export default BottomNavbar;
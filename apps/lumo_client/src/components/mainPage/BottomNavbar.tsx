// @/component/mainPage/BottomNavbar.tsx
"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, History, Library, Plus, User as UserIconLucide } from "lucide-react"; // Use consistent icons
import { ThemeToggle } from "@/components/theme-toggle";
import UserIcon from '@/components/mainPage/UserIcon'; // Keep using your custom UserIcon if needed
import { cn } from "@/lib/utils";

const BottomNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Adjusted tabs to match sidebar more closely, limit to ~5 items
  const tabs = [
    { name: "Home", icon: Home, path: "/main" }, // Match sidebar Home
    { name: "History", icon: History, path: "/histories" }, // Match sidebar History
    { name: "Library", icon: Library, path: "/library" }, // Match sidebar Library
    // Add Create button separately
    // Add Account/Theme separately
  ];

  // Common class names for bottom nav items
  const itemBaseClass = "flex flex-col items-center justify-center flex-1 h-full p-1 cursor-pointer transition-colors duration-150";
  const itemTextClass = "text-[10px] mt-1"; // Slightly smaller text
  const itemActiveClass = "text-blue-600 dark:text-blue-400";
  const itemInactiveClass = "text-gray-500 dark:text-gray-400";
  const itemHoverClass = "hover:text-blue-500 dark:hover:text-blue-300"; // Subtle hover

  const isActive = (path: string) => {
     if (path === '/main') return pathname === '/main';
     return pathname.startsWith(path) && path !== '/main';
  };

  return (
    // Use md:hidden to hide on medium screens and up
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-stretch bg-white dark:bg-gray-800 h-16 border-t border-gray-200 dark:border-gray-700 md:hidden">
      {/* Navigation Tabs */}
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.path}
          className={cn(
            itemBaseClass,
            isActive(tab.path) ? itemActiveClass : itemInactiveClass,
            itemHoverClass
          )}
        >
          <tab.icon size={22} /> {/* Slightly smaller icons */}
          <span className={itemTextClass}>{tab.name}</span>
        </Link>
      ))}

      {/* Create Button */}
      <button
        type="button"
        onClick={() => router.push("https://lumo-creator.aasciihub.com")} // Assuming '/create' is the correct path
        title="Create"
        className={cn(itemBaseClass, itemInactiveClass, itemHoverClass)}
        aria-label="Create new content"
      >
        <Plus size={24} /> {/* Keep create slightly larger */}
        <span className={itemTextClass}>Create</span>
      </button>

      {/* User Account Button */}
      <div className={cn(itemBaseClass, itemInactiveClass)}>
         <UserIcon /> {/* Your existing UserIcon component */}
         {/* Label is optional, UserIcon component likely handles click */}
         <span className={itemTextClass}>Account</span>
      </div>

      {/* Theme Toggle - Removed label for space, icon is indicative */}
      <div className={cn(itemBaseClass, itemInactiveClass)}>
         <ThemeToggle />
         <span className={itemTextClass}>Theme</span>
      </div>
    </nav>
  );
};

export default BottomNavbar;
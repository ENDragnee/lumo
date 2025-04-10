"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Folder, Book, User } from "lucide-react";

const BottomNavbar = () => {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Workspaces", icon: Folder, path: "/workspaces" },
    { name: "Library", icon: Book, path: "/library" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <nav className="flex justify-around items-center bg-white dark:bg-gray-800 h-16 border-t border-gray-200 dark:border-gray-700">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.path}
          className={`flex flex-col items-center p-2 ${
            pathname === tab.path ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <tab.icon size={24} />
          <span className="text-xs mt-1">{tab.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavbar;
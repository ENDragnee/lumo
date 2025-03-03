"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Clock, Bookmark, History, Library } from "lucide-react";
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from '@/lib/utils';

export default function NewLeftSidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: "Home", href: "/main", icon: Home, current: pathname === "/" },
    { name: "History", href: "/history", icon: History, current: pathname === "/history" },
    { name: "Library", href: "/library", icon: Library, current: pathname === "/library" },
    { name: "Bookmarks", href: "/bookmarks", icon: Bookmark, current: pathname === "/bookmarks" },
    { name: "Recent", href: "/recent", icon: Clock, current: pathname === "/recent" },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-64 fixed left-0 top-0 h-full bg-white dark:bg-[#2b2d36] border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4">
        {/* Logo or App Name */}
        <div className="mb-6">
          <h1 className="text-xl font-bold dark:text-white">Lumo</h1>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                item.current
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

        {/* Additional Sections */}
        <div className="space-y-2">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            Categories
          </h3>
          {['Technology', 'Science', 'History', 'Mathematics'].map((category) => (
            <button
              key={category}
              className="w-full flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm font-medium">{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* User Menu & Theme Toggle */}
      <div className="mt-auto p-4 border-t dark:border-gray-700">
        {session?.user && (
          <div className="relative" ref={userMenuRef}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 w-full hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-medium dark:text-white">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session.user.email}
                  </p>
                </div>
              </button>
            </div>
            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 rounded-md shadow-lg bg-white dark:bg-[#404552] border dark:border-gray-600">
                <div className="py-1">
                  <button
                    onClick={() => router.push('/profile')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#4b5162] dark:text-gray-300"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => router.push('/settings')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#4b5162] dark:text-gray-300"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#4b5162] dark:text-gray-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center justify-between mt-4">
            <ThemeToggle />
          </div>
      </div>
    </div>
  );
}
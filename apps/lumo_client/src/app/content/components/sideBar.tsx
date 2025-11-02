// @/app/content/components/sideBar.tsx (Renamed from NewLeftSidebar for clarity)
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Clock, Bookmark, History, Library, Menu, LogOut, Settings, User } from 'lucide-react'; // Adjusted icons
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react'; // Explicitly import SearchIcon

// Removed Session declaration and Recommendation types/component - keep sidebar focused

export default function ContentSidebar({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home }, // Assuming /main is the dashboard/home
    { name: 'History', href: '/histories', icon: History }, // Corrected href based on likely usage
    //{ name: 'Library', href: '/library', icon: Library },
    //{ name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    //{ name: 'Recent', href: '/recent', icon: Clock },
  ];

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      // Optionally close sidebar on mobile after search?
      // if (window.innerWidth < 768 && isOpen) { toggleSidebar(); }
    }
  };

  const isActive = (href: string) => {
    // Handle exact match for home/main, otherwise prefix match
    if (href === '/main') return pathname === '/main';
    return pathname.startsWith(href) && href !== '/main'; // Avoids matching '/' for all routes
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full flex flex-col bg-gray-200 rounded-2xl dark:bg-[#2b2d36] border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40", // Added z-index
        isOpen ? "w-64" : "w-0 md:w-16 overflow-hidden" // Collapsed on mobile, icon-only on desktop
      )}
    >
      {/* Header: Toggle Button and Logo */}
      <div className={cn(
        "flex items-center flex-shrink-0",
         isOpen ? "justify-between p-4 h-16" : "justify-center p-2 h-16"
      )}>
         {/* Toggle button always visible on desktop, repositioned for mobile */}
         <button
            onClick={toggleSidebar}
            className={cn("p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700", !isOpen && "md:block hidden")} // Hide toggle when collapsed on mobile, show on desktop
          >
           <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
         </button>
         {/* Show Logo only when sidebar is open */}
         {isOpen && (
           <Link href="/main" className="text-2xl font-bold dark:text-white">Lumo</Link>
         )}
         {/* Placeholder for alignment when logo is hidden */}
         {!isOpen && <div className="w-6"></div>}
      </div>

      {/* Search Form (only when open) */}
      {isOpen && (
        <form onSubmit={handleSearchSubmit} className="p-4 dark:border-gray-700 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full border bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
        </form>
      )}

      {/* Navigation (Scrollable) */}
      <nav className="flex-1 overflow-y-auto space-y-1 p-2 mt-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            title={item.name} // Add title for collapsed state
            className={cn(
              "flex items-center rounded-lg transition-colors duration-150 text-gray-700 dark:text-gray-300",
              isOpen ? "p-3" : "p-3 justify-center", // Adjust padding for consistency
              isActive(item.href)
                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-medium"
                : "hover:bg-gray-300 dark:hover:bg-gray-700/50"
            )}
          >
            <item.icon className={cn("h-5 w-5 flex-shrink-0", isOpen && "mr-3")} />
            {isOpen && <span className="text-sm font-medium">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer: User Menu & Theme Toggle */}
      <div ref={userMenuRef} className={cn("border-t dark:border-gray-700 flex-shrink-0 relative", isOpen ? "p-4" : "p-2")}>
          {/* User Button / Avatar */}
          {session?.user && (
            <button
              onClick={() => {
                if (isOpen) {
                  setIsUserMenuOpen(prev => !prev); // Toggle menu only if sidebar is open
                } else {
                  // Optionally navigate to profile or open sidebar on icon click when collapsed
                   toggleSidebar(); // Example: Open sidebar on click when collapsed
                   // router.push('/profile'); // Alternative: Navigate directly
                }
              }}
              className={cn(
                "w-full flex items-center text-left rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700/50 transition-colors duration-150",
                 isOpen ? "p-2 space-x-3" : "justify-center p-2"
              )}
              title={session.user.name || "User Menu"}
            >
              {session.user.image ? (
                 <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full flex-shrink-0"/>
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {session.user.name?.charAt(0).toUpperCase() || <User size={18} />}
                </div>
              )}
              {isOpen && (
                 <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {session.user.name || 'Account'}
                 </span>
              )}
            </button>
          )}

          {/* User Popover Menu (only shows if open and toggled) */}
          {isUserMenuOpen && isOpen && (
              <div className="absolute bottom-full left-2 right-2 mb-2 rounded-md shadow-lg bg-white dark:bg-[#313540] border dark:border-gray-600 z-50">
                 <div className="py-1">
                    <button
                       onClick={() => { router.push("/profile"); setIsUserMenuOpen(false); }}
                       className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#4b5162]"
                    >
                       <User size={16} className="mr-2"/> Profile
                    </button>
                    <button
                       onClick={() => { router.push("/settings"); setIsUserMenuOpen(false); }}
                       className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#4b5162]"
                    >
                       <Settings size={16} className="mr-2"/> Settings
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                    <button
                       onClick={() => { signOut(); setIsUserMenuOpen(false); }}
                       className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#4b5162]"
                    >
                       <LogOut size={16} className="mr-2"/> Logout
                    </button>
                 </div>
              </div>
           )}

          {/* Theme Toggle (below user or separate) */}
          <div className={cn("mt-3", !isOpen && "flex justify-center")}>
            <ThemeToggle />
          </div>
      </div>
    </div>
  );
}

// components/navigation/NewSidebar.tsx (adjust path as needed)
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, Menu, X, Folder, FileText, Loader2, Home } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation'; // Use next/navigation
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme-toggle'; // Adjust path
import Link from 'next/link';
import { SidebarDriveItem } from '@/app/api/sidebar-items/route'; // Adjust path


// --- Define SidebarProps ---
interface NewSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

interface SidebarLevelProps {
    parentId: string | null; // ID of the parent book, or null for root
    level: number; // Indentation level
    searchQuery: string;
    onContentClick: () => void; // Function to call when content is clicked (e.g., close mobile sidebar)
}

// --- Main Sidebar Component ---
const NewSidebar: React.FC<NewSidebarProps> = ({ isOpen, setIsOpen, isMobile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const router = useRouter();
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

   // Click outside handler
   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        isMobile &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
          const overlay = document.getElementById('new-sidebar-overlay');
          if (overlay && event.target === overlay) {
              setIsOpen(false);
          }
      }
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isMobile, isUserMenuOpen, setIsOpen]);

  const handleContentClick = () => {
      if (isMobile) {
          setIsOpen(false);
      }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          id="new-sidebar-overlay"
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        ref={sidebarRef}
        className={cn(
          'fixed top-0 left-0 h-screen transition-transform duration-300 ease-in-out z-40 flex flex-col',
          'border-r border-slate-200 dark:border-slate-700',
          'w-64', // Consistent width for now
          // Mobile open/close
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop open/close overrides
          'md:translate-x-0',
          isOpen ? 'md:w-64' : 'md:w-16',
          'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100' // Updated theme colors
        )}
      >
        {/* Header */}
        <div className={cn(
            "flex items-center p-2 h-16 border-b border-slate-200 dark:border-slate-700 flex-shrink-0",
            isOpen ? "justify-between" : "md:justify-center"
            )}>
           {/* Mobile Close Button */}
           {isOpen && isMobile && (
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close sidebar">
                    <X className="w-5 h-5" />
                </Button>
           )}
           {/* Logo/Title */}
           {isOpen && (
                <div className={cn("font-semibold text-lg ml-2", isMobile && "flex-1 text-center mr-10")}>
                    My Studio
                </div>
           )}
          {/* Desktop Open/Close Toggle */}
          {!isOpen && !isMobile && (
             <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} aria-label="Open sidebar">
                <Menu className="w-5 h-5" />
             </Button>
          )}
        </div>

        {/* Navigation Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="sidebar-content"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden flex flex-col" // Allow content to grow and enable scroll
            >
              {/* Search Bar */}
              <div className="p-2 flex-shrink-0">
                 <div className="relative">
                     <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <Input
                       type="text"
                       placeholder="Search books/content..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full h-9 pl-8 pr-2 rounded-md text-sm bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500"
                     />
                 </div>
              </div>

              {/* Scrollable Item List */}
              <ScrollArea className="flex-grow pt-0 pb-2 px-2">
                 {/* Start rendering from the root level */}
                 <SidebarLevel parentId={null} level={0} searchQuery={searchQuery} onContentClick={handleContentClick} />
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed View Icons (Optional - Add if needed) */}
        {!isOpen && !isMobile && (
            <div className="flex flex-col items-center mt-4 space-y-3 flex-shrink-0">
                 {/* Add collapsed icons here */}
                 <Button variant="ghost" size="icon" title="Home (Example)"> <Home className="w-5 h-5" /> </Button>
            </div>
        )}

        {/* Footer (User Menu & Theme) */}
        <div className={cn("mt-auto p-2 border-t border-slate-200 dark:border-slate-700 flex-shrink-0", !isOpen && "md:py-2")}>
           {session?.user?.name && (
             <div className="relative" ref={userMenuRef}>
               <div className={cn("flex items-center", isOpen ? "justify-between" : "md:justify-center")}>
                 {/* User Button/Icon */}
                 <button
                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                   className={cn('flex items-center rounded-md p-1 text-left', 'hover:bg-slate-100 dark:hover:bg-slate-800', isOpen ? "w-full" : "md:w-auto md:justify-center", !isOpen && !isMobile && "w-full justify-center")}
                   aria-label="User menu"
                   disabled={!isOpen && isMobile}
                 >
                   {/* User Avatar Placeholder */}
                   <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold shrink-0 text-sm">
                     {session.user.name.charAt(0).toUpperCase()}
                   </div>
                   {isOpen && <span className="ml-2 text-sm font-medium truncate flex-1">{session.user.name}</span>}
                 </button>
                 {isOpen && <ThemeToggle />}
               </div>
               {/* User Menu Dropdown */}
               {isUserMenuOpen && isOpen && (
                 <div className="absolute bottom-full left-2 right-2 mb-2 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 bg-white dark:bg-slate-800">
                   <div className="py-1">
                     <button onClick={() => { router.push('/progress'); setIsUserMenuOpen(false); handleContentClick(); }} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded">Progress</button>
                     {/* Add Settings link/button */}
                     <button onClick={() => { signOut(); setIsUserMenuOpen(false); handleContentClick(); }} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400">Logout</button>
                   </div>
                 </div>
               )}
             </div>
           )}
           {/* Theme toggle for logged-out or collapsed */}
           {(!session?.user?.name || (!isOpen && !isMobile)) && (
              <div className={cn("flex", isOpen ? "justify-end pr-1" : "justify-center mt-2 md:mt-0")}>
                  <ThemeToggle />
              </div>
           )}
        </div>
      </div>
    </>
  );
};

// --- Recursive Sidebar Level Component ---
const SidebarLevel: React.FC<SidebarLevelProps> = ({ parentId, level, searchQuery, onContentClick }) => {
    const [items, setItems] = useState<SidebarDriveItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set());

    const fetchLevelItems = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        console.log(`Fetching sidebar items for parent: ${parentId ?? 'root'}`);
        try {
            const parentQuery = parentId === null ? 'null' : parentId;
            const res = await fetch(`/api/sidebar-items?parentId=${parentQuery}`);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setItems(data.items || []);
        } catch (err: any) {
            console.error(`Failed to fetch items for parent ${parentId}:`, err);
            setError("Failed to load items.");
            setItems([]); // Clear items on error
        } finally {
            setIsLoading(false);
        }
    }, [parentId]);

    useEffect(() => {
        fetchLevelItems();
    }, [fetchLevelItems]); // Fetch when component mounts or parentId changes

    const toggleBookExpansion = (bookId: string) => {
        setExpandedBooks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(bookId)) {
                newSet.delete(bookId);
            } else {
                newSet.add(bookId);
            }
            return newSet;
        });
    };

    // Filter items based on search query
    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indentStyle = { paddingLeft: `${level * 1.25}rem` }; // Adjust multiplier for desired indent

    if (isLoading && level === 0) { // Show top-level loading indicator
        return (
             <div className="flex items-center justify-center p-4 text-slate-500 dark:text-slate-400" style={indentStyle}>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...
             </div>
        );
    }
     if (isLoading && level > 0) { // Show nested loading indicator
        return (
             <div className="flex items-center p-1 text-xs text-slate-500 dark:text-slate-400" style={indentStyle}>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Loading...
             </div>
        );
    }


    if (error) {
        return <div className="p-2 text-xs text-red-500" style={indentStyle}>{error}</div>;
    }

    if (!isLoading && filteredItems.length === 0 && searchQuery) {
        // No results for search query at this level
        return <div className="p-2 text-xs text-slate-500 dark:text-slate-400" style={indentStyle}>No matches found.</div>;
    }

     if (!isLoading && items.length === 0 && level > 0) {
        // No items found in this sub-book (and not root level)
         return <div className="p-1 text-xs text-slate-500 dark:text-slate-400" style={indentStyle}>Empty folder.</div>;
     }

      if (!isLoading && items.length === 0 && level === 0) {
         // No items found at root
         return <div className="p-2 text-sm text-slate-500 dark:text-slate-400" style={indentStyle}>No books or content found.</div>;
      }


    return (
        <ul className="space-y-0.5">
            {filteredItems.map(item => {
                const isBook = item.type === 'book';
                const isExpanded = isBook && expandedBooks.has(item._id);

                return (
                    <li key={item._id}>
                        {isBook ? (
                            <>
                                <Button
                                    variant="ghost"
                                    className="w-full h-auto justify-start text-left py-1.5 px-2 rounded text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                                    style={indentStyle}
                                    onClick={() => toggleBookExpansion(item._id)}
                                    title={item.title}
                                    // Disable expansion if book has no children (optional optimization)
                                    // disabled={!item.hasChildren}
                                >
                                    <ChevronRight className={cn(
                                        'w-4 h-4 mr-1.5 transition-transform duration-200 flex-shrink-0',
                                        isExpanded && 'transform rotate-90',
                                        !item.hasChildren && 'opacity-0' // Hide chevron if no children
                                    )} />
                                    <Folder className="w-4 h-4 mr-1.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                    <span className="truncate flex-grow">{item.title}</span>
                                </Button>
                                {/* Recursive Render */}
                                <AnimatePresence initial={false}>
                                    {isExpanded && item.hasChildren && (
                                        <motion.div
                                            key={item._id + "-content"}
                                            initial="collapsed"
                                            animate="open"
                                            exit="collapsed"
                                            variants={{
                                                open: { opacity: 1, height: "auto" },
                                                collapsed: { opacity: 0, height: 0 }
                                            }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <SidebarLevel
                                                parentId={item._id}
                                                level={level + 1}
                                                searchQuery={searchQuery}
                                                onContentClick={onContentClick}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            // Content Item as Link
                            <Link
                                href={`/content?id=${item._id}`} // Navigate to content page with ID
                                passHref
                            >
                                <Button
                                    variant="ghost"
                                    className="w-full h-auto justify-start text-left py-1.5 px-2 rounded text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                                    style={indentStyle}
                                    onClick={onContentClick} // Call handler to potentially close mobile sidebar
                                    title={item.title}
                                >
                                    {/* Indentation spacer */}
                                    <span className="w-4 h-4 mr-1.5 flex-shrink-0" />
                                    <FileText className="w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                                    <span className="truncate flex-grow">{item.title}</span>
                                </Button>
                            </Link>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default NewSidebar;
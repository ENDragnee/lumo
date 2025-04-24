// components/navigation/NewSidebar.tsx (or your path)
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, Menu, X, Folder, FileText, Loader2, Home, LogOut, Settings, ActivitySquare } from 'lucide-react'; // Added icons
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
// --- UPDATED: Use usePathname ---
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme-toggle'; // Adjust path
import Link from 'next/link';
// --- UPDATED: Make sure path to type is correct ---
import { SidebarDriveItem } from '@/app/api/sidebar-items/route'; // Adjust path


// --- Define SidebarProps ---
interface NewSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean;
  // Add any other props needed from the parent layout
}

interface SidebarLevelProps {
    parentId: string | null; // ID of the parent book, or null for root
    level: number; // Indentation level
    searchQuery: string;
    onContentClick: () => void; // Function to call when content is clicked (e.g., close mobile sidebar)
     // --- NEW: Pass router for navigation ---
    router: ReturnType<typeof useRouter>;
}

// --- Main Sidebar Component ---
const NewSidebar: React.FC<NewSidebarProps> = ({ isOpen, setIsOpen, isMobile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname(); // Hook to get current URL path
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // --- Determine initial parentId from URL ---
  const getParentIdFromPath = () => {
    const match = pathname?.match(/^\/book\/([a-fA-F0-9]{24})$/); // Regex for /book/<mongoId>
    if (match && match[1]) {
      return match[1]; // Return the extracted bookId
    }
    // Add checks for other relevant paths if needed, e.g., /content/xyz?parentId=abc
    // For root or non-book pages, return null
    return null;
  };
  const initialParentId = getParentIdFromPath();
  // --- End parentId determination ---


   // Click outside handler (no changes needed)
   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ( isOpen && isMobile && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
          const overlay = document.getElementById('new-sidebar-overlay');
          if (overlay && event.target === overlay) setIsOpen(false);
      }
      if ( isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target as Node) ) {
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

  // --- Navigate Home action ---
  const navigateHome = () => {
      router.push('/'); // Navigate to your main workspace route
      handleContentClick(); // Close sidebar on mobile
  }

  return (
    <>
      {/* Mobile Overlay (unchanged) */}
      {isOpen && isMobile && (
        <div id="new-sidebar-overlay" className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar Container (unchanged className logic) */}
      <div
        ref={sidebarRef}
        className={cn(
          'fixed top-0 left-0 h-screen transition-transform duration-300 ease-in-out z-40 flex flex-col',
          'border-r border-slate-200 dark:border-slate-700',
          'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
          isOpen ? 'md:w-64' : 'md:w-16',
          'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
        )}
      >
        {/* Header */}
        <div className={cn("flex items-center p-2 h-16 border-b border-slate-200 dark:border-slate-700 flex-shrink-0", isOpen ? "justify-between" : "md:justify-center")}>
           {isOpen && isMobile && ( <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close sidebar"><X className="w-5 h-5" /></Button> )}
           {isOpen && (<div className={cn("font-semibold text-lg ml-2", isMobile && "flex-1 text-center mr-10")}>My Studio</div>)}
           {!isOpen && !isMobile && ( <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} aria-label="Open sidebar"><Menu className="w-5 h-5" /></Button> )}
        </div>

        {/* Navigation Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="sidebar-content"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden flex flex-col"
            >
              {/* Search Bar (unchanged) */}
              <div className="p-2 flex-shrink-0">
                 <div className="relative">
                     <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <Input type="text" placeholder="Search books/content..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-9 pl-8 pr-2 rounded-md text-sm bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500" />
                 </div>
              </div>

              {/* Scrollable Item List */}
              <ScrollArea className="flex-grow pt-0 pb-2 px-2">
                 {/* --- UPDATED: Pass initialParentId and router --- */}
                 <SidebarLevel
                     parentId={initialParentId} // Start rendering based on URL
                     level={0}
                     searchQuery={searchQuery}
                     onContentClick={handleContentClick}
                     router={router} // Pass router for navigation
                 />
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed View Icons */}
        {!isOpen && !isMobile && (
            <div className="flex flex-col items-center mt-4 space-y-1 flex-shrink-0">
                 {/* Home Button */}
                 <Button variant={pathname === '/' ? 'secondary' : 'ghost'} size="icon" title="Home" onClick={navigateHome} className="w-10 h-10">
                    <Home className="w-5 h-5" />
                 </Button>
                 {/* Add other essential collapsed icons here */}
            </div>
        )}

        {/* Footer (User Menu & Theme) */}
        <div className={cn("mt-auto p-2 border-t border-slate-200 dark:border-slate-700 flex-shrink-0", !isOpen && "md:py-2")}>
           {session?.user?.name && (
             <div className="relative" ref={userMenuRef}>
               <div className={cn("flex items-center", isOpen ? "justify-between" : "md:justify-center")}>
                 <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className={cn('flex items-center rounded-md p-1 text-left', 'hover:bg-slate-100 dark:hover:bg-slate-800', isOpen ? "w-full" : "md:w-auto md:justify-center", !isOpen && !isMobile && "w-full justify-center")} aria-label="User menu" disabled={!isOpen && isMobile}>
                   <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold shrink-0 text-sm"> {session.user.name.charAt(0).toUpperCase()} </div>
                   {isOpen && <span className="ml-2 text-sm font-medium truncate flex-1">{session.user.name}</span>}
                 </button>
                 {isOpen && <ThemeToggle />}
               </div>
               {/* User Menu Dropdown */}
               {isUserMenuOpen && isOpen && (
                 <div className="absolute bottom-full left-2 right-2 mb-2 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 bg-white dark:bg-slate-800">
                   <div className="py-1">
                    {/* Update links/buttons as needed */}
                     <button onClick={() => { router.push('/progress'); setIsUserMenuOpen(false); handleContentClick(); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><ActivitySquare className="w-4 h-4 opacity-70"/>Progress</button>
                     <button onClick={() => { router.push('/settings'); setIsUserMenuOpen(false); handleContentClick(); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Settings className="w-4 h-4 opacity-70"/>Settings</button>
                     <button onClick={() => { signOut(); setIsUserMenuOpen(false); handleContentClick(); }} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400"><LogOut className="w-4 h-4 opacity-70"/>Logout</button>
                   </div>
                 </div>
               )}
             </div>
           )}
           {/* Theme toggle for logged-out or collapsed (unchanged) */}
           {(!session?.user?.name || (!isOpen && !isMobile)) && ( <div className={cn("flex", isOpen ? "justify-end pr-1" : "justify-center mt-2 md:mt-0")}><ThemeToggle /></div> )}
        </div>
      </div>
    </>
  );
};

// --- Recursive Sidebar Level Component ---
const SidebarLevel: React.FC<SidebarLevelProps> = ({ parentId, level, searchQuery, onContentClick, router }) => {
    const [items, setItems] = useState<SidebarDriveItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set());
    const pathname = usePathname(); // Get pathname here too for active link styling

    const fetchLevelItems = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        console.log(`Fetching sidebar items for parent: ${parentId ?? 'root'}`);
        try {
            const parentQuery = parentId === null ? 'null' : parentId;
            // Use the new API endpoint
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
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    }, [parentId]);

    useEffect(() => {
        fetchLevelItems();
    }, [fetchLevelItems]);

    const toggleBookExpansion = (bookId: string) => {
        setExpandedBooks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(bookId)) newSet.delete(bookId);
            else newSet.add(bookId);
            return newSet;
        });
    };

    // Navigate to book page when book row (not just chevron) is clicked
    const handleBookClick = (bookId: string) => {
        router.push(`/book/${bookId}`);
        onContentClick(); // Close sidebar on mobile
    };

    // Filter items based on search query
    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indentStyle = { paddingLeft: `${level * 1.25}rem` };

    // Loading/Error/Empty States (similar to before)
    if (isLoading && level === 0) { return (<div className="flex items-center justify-center p-4 text-slate-500 dark:text-slate-400" style={indentStyle}><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...</div>); }
    if (isLoading && level > 0) { return (<div className="flex items-center p-1 text-xs text-slate-500 dark:text-slate-400" style={indentStyle}><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Loading...</div>); }
    if (error) { return <div className="p-2 text-xs text-red-500" style={indentStyle}>{error}</div>; }
    if (!isLoading && filteredItems.length === 0 && searchQuery) { return <div className="p-2 text-xs text-slate-500 dark:text-slate-400" style={indentStyle}>No matches found.</div>; }
    if (!isLoading && items.length === 0 && level > 0) { return <div className="p-1 text-xs text-slate-500 dark:text-slate-400" style={indentStyle}>Empty folder.</div>; }
    if (!isLoading && items.length === 0 && level === 0 && parentId === null) { return <div className="p-2 text-sm text-slate-500 dark:text-slate-400" style={indentStyle}>No books or content at root.</div>; }
    if (!isLoading && items.length === 0 && level === 0 && parentId !== null) { return <div className="p-2 text-sm text-slate-500 dark:text-slate-400" style={indentStyle}>This book is empty.</div>; }


    return (
        <ul className="space-y-0.5">
            {/* --- Optionally add a "Home" or "Back to Root" link at the top level --- */}
             {level === 0 && parentId !== null && ( // Only show if inside a book
                  <li>
                     <Button
                        variant="ghost"
                        className="w-full h-auto justify-start text-left py-1.5 px-2 rounded text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={() => router.push('/')} // Navigate to root workspace
                        title="Back to Home"
                     >
                        <Home className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span className="truncate flex-grow">Home / All Books</span>
                    </Button>
                 </li>
             )}

            {filteredItems.map(item => {
                const isBook = item.type === 'book';
                const isExpanded = isBook && expandedBooks.has(item._id);
                const hasChildren = isBook && item.hasChildren; // Use the flag from API
                const isActive = pathname === `/book/${item._id}` || pathname === `/content?id=${item._id}`; // Basic active check

                return (
                    <li key={item._id}>
                        {isBook ? (
                            <div className='relative group'>
                                {/* Expand/Collapse Chevron Button (only if has children) */}
                                {hasChildren && (
                                     <Button
                                         variant="ghost"
                                         size="icon"
                                         className="absolute left-0 top-1/2 transform -translate-y-1/2 h-6 w-6 z-10 opacity-60 group-hover:opacity-100"
                                         style={{ marginLeft: `calc(${level * 1.25}rem - 0.25rem)`}} // Position chevron correctly
                                         onClick={(e) => { e.stopPropagation(); toggleBookExpansion(item._id); }}
                                         aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
                                     >
                                         <ChevronRight className={cn(
                                             'w-4 h-4 transition-transform duration-200',
                                             isExpanded && 'transform rotate-90'
                                         )} />
                                     </Button>
                                )}
                                 {/* Book Row Button (navigates to book page) */}
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className="w-full h-auto justify-start text-left py-1.5 px-2 rounded text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                                     // Indent based on level, account for chevron space if applicable
                                    style={{ paddingLeft: `${level * 1.25 + (hasChildren ? 1.5 : 0)}rem` }}
                                    onClick={() => handleBookClick(item._id)}
                                    title={item.title}
                                >
                                    <Folder className={cn(
                                        "w-4 h-4 mr-1.5 flex-shrink-0",
                                        isActive ? "text-indigo-600 dark:text-indigo-400" : "text-blue-500 dark:text-blue-400"
                                    )} />
                                    <span className={cn("truncate flex-grow", isActive && "font-semibold")}>{item.title}</span>
                                </Button>
                                {/* Recursive Render */}
                                <AnimatePresence initial={false}>
                                    {isExpanded && hasChildren && (
                                        <motion.div
                                            key={item._id + "-content"}
                                            initial="collapsed" animate="open" exit="collapsed"
                                            variants={{ open: { opacity: 1, height: "auto" }, collapsed: { opacity: 0, height: 0 } }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            {/* Pass router down */}
                                            <SidebarLevel parentId={item._id} level={level + 1} searchQuery={searchQuery} onContentClick={onContentClick} router={router} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            // Content Item Link
                             <Link href={`/content?contentId=${item._id}`} passHref legacyBehavior>
                                 <a // Use legacyBehavior with <a> tag for full compatibility if needed
                                     className={cn(
                                         "flex items-center w-full h-auto text-left py-1.5 px-2 rounded text-sm hover:bg-slate-100 dark:hover:bg-slate-800",
                                         isActive ? "bg-slate-100 dark:bg-slate-800 font-medium text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                                     )}
                                     style={{ paddingLeft: `${level * 1.25 + 1.5}rem` }} // Indent content items consistently
                                     onClick={onContentClick}
                                     title={item.title}
                                 >
                                     <FileText className="w-4 h-4 mr-1.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                                     <span className="truncate flex-grow">{item.title}</span>
                                 </a>
                             </Link>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default NewSidebar;
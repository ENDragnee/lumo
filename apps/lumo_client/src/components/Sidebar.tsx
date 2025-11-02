'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, Menu, X } from 'lucide-react'; // Added X icon
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useEducationData } from '@/app/hooks/useEducationData';
import Link from 'next/link';

import {
  getGrades,
  getSubjects,
  getFolderStructure,
  Chapter,
} from '@/lib/fileSystem';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

// --- Define SidebarProps ---
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean; // Add isMobile prop
}
// --- End SidebarProps Definition ---

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isMobile }) => { // Destructure isMobile
  const [isGradesOpen, setIsGradesOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, resolvedTheme } = useTheme();
  const [isThemeReady, setIsThemeReady] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [isChaptersOpen, setIsChaptersOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const {
    grade,
    course,
    chapter,
    setGrade,
    setCourse,
    fetchSubchapters,
  } = useEducationData();

  // Click outside handler for mobile overlay
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close sidebar IF it's open AND it's mobile view AND the click is outside the sidebar itself
      if (
        isOpen &&
        isMobile && // Only apply overlay logic on mobile
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
         // Check if the click target is the overlay itself (optional, good practice)
         const overlay = document.getElementById('sidebar-overlay');
         if (overlay && event.target === overlay) {
            setIsOpen(false);
         } else if (!overlay) {
            // Fallback if overlay ID isn't found (less likely but safe)
             // Don't close if click is outside but NOT on overlay (e.g., clicking header buttons)
             // Let the overlay handle the close
         }
      }

      // Handle user menu close (remains the same)
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMobile, isUserMenuOpen, setIsOpen]); // Add isMobile to dependency array

  useEffect(() => {
    if (resolvedTheme) {
      setIsThemeReady(true);
    }
  }, [resolvedTheme]);

  useEffect(() => {
    if (grade && course && chapter) {
      fetchSubchapters(grade, course, chapter);
    }
  }, [grade, course, chapter, fetchSubchapters]);

  const grades = getGrades();
  const subjects = grade ? getSubjects(grade) : [];
  const chapters = grade && course ? getFolderStructure(grade, course) : [];

  const filteredSubjects = subjects.filter((subject) =>
    subject.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredChapters = chapters.filter(
    (chapter) =>
      chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chapter.subChapters.some((subChapter) =>
        subChapter.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  if (!isThemeReady) {
    return null; // Or a loading state
  }

  const handleGradeSelect = (selectedGrade: string) => {
    setGrade(selectedGrade);
    setIsGradesOpen(false);
    setIsSubjectsOpen(true);
    // Reset downstream selections
    setCourse(''); // FIX: Use empty string instead of null
    setIsChaptersOpen(false);
    setSelectedChapter(null); // This state can be null
  };

  const handleSubjectSelect = (selectedSubject: string) => {
    setCourse(selectedSubject);
    setIsSubjectsOpen(false);
    setIsChaptersOpen(true);
     setSelectedChapter(null);
  };

  const handleChapterSelect = (chapterName: string) => {
     // Primarily handled by ChapterList's toggleChapter now
     // This could be used for highlighting if needed later
  };

  const handleSubChapterClick = () => {
      // When a subchapter link is clicked, close the sidebar *only on mobile*
      if (isMobile) {
          setIsOpen(false);
      }
  }

  return (
    <>
      {/* Mobile Overlay - Renders only when sidebar is open on mobile */}
      {isOpen && isMobile && (
        <div
          id="sidebar-overlay"
          className="fixed inset-0 bg-black/50 z-30 md:hidden" // z-index below sidebar (z-40)
          onClick={() => setIsOpen(false)} // Close sidebar on overlay click
        />
      )}

      {/* Sidebar Container */}
      <div
        ref={sidebarRef}
        className={cn(
          'fixed top-0 left-0 h-screen transition-transform duration-300 ease-in-out z-40 flex flex-col', // Higher z-index
          'border-r border-gray-200 dark:border-gray-700/50',
          // Base width for mobile (can be full width or partial)
          'w-64', // Let's keep width consistent for simplicity, adjust if needed (e.g., w-3/4 sm:w-64)
          // Mobile open/close
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop open/close overrides
          'md:translate-x-0', // Always stays on screen on desktop
          isOpen ? 'md:w-64' : 'md:w-16', // Desktop width change
          theme === 'dark'
              ? 'bg-[#2b2d36] text-[#a0a6b1]'
              : 'bg-gray-50 text-gray-800', // Use lighter gray for light theme
        )}
      >
        {/* Header Section */}
        <div className={cn(
            "flex items-center p-2 h-16 border-b border-gray-200 dark:border-gray-700/50 flex-shrink-0",
            // Adjust justification based on open state *on desktop*
            isOpen ? "justify-between" : "md:justify-center"
            )}>

          {/* Toggle Button (Mobile: Close 'X' inside sidebar, Desktop: Hidden when open) */}
           {/* Only show internal 'X' close button on mobile when open */}
           {isOpen && isMobile && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                    aria-label="Close sidebar"
                >
                    <X className="w-5 h-5" />
                </Button>
           )}
           {/* Show Logo/Placeholder when open, or center toggle button when closed on desktop */}
           {isOpen && (
                <div className={cn(
                    "font-semibold text-lg ml-2",
                    isMobile && "flex-1 text-center mr-10" // Center title on mobile, account for X button space
                )}>
                    Logo
                </div>
           )}

          {/* Desktop: Show toggle button only when closed */}
          {!isOpen && !isMobile && (
             <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)} // Action is now explicitly 'open'
                className='text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md'
                aria-label="Open sidebar"
             >
                <Menu className="w-5 h-5" />
             </Button>
          )}

           {/* Search - Only shows when open and on Desktop (optional: enable on mobile too) */}
           {isOpen && !isMobile && ( // Currently hiding search on mobile when sidebar is open
             <div className="flex-1 ml-2 mr-1">
               <div className="relative">
                 <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                 <Input
                   type="text"
                   placeholder="Search..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className={cn(
                     'w-full h-9 pl-8 pr-2 rounded-md text-sm',
                     'bg-gray-200 dark:bg-[#31333c] border-transparent focus:border-blue-500 focus:ring-0',
                     theme === 'dark'
                       ? 'text-gray-200 placeholder-gray-500'
                       : 'text-gray-800 placeholder-gray-400',
                   )}
                 />
               </div>
             </div>
           )}
        </div>

        {/* Navigation Content - Shows fully when open */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="sidebar-content" // Add key for AnimatePresence
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden" // Use overflow-hidden on the motion div
            >
              {/* ScrollArea now inside the motion.div */}
              <ScrollArea className="h-full pt-2">
                {/* Search for Mobile - Placed inside scroll area */}
                {isMobile && (
                   <div className="px-2 pb-2">
                     <div className="relative">
                         <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                         <Input
                           type="text"
                           placeholder="Search..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className={cn(
                             'w-full h-9 pl-8 pr-2 rounded-md text-sm',
                             'bg-gray-200 dark:bg-[#31333c] border-transparent focus:border-blue-500 focus:ring-0',
                             theme === 'dark'
                               ? 'text-gray-200 placeholder-gray-500'
                               : 'text-gray-800 placeholder-gray-400',
                           )}
                         />
                       </div>
                   </div>
                )}

                {/* Dynamic Content */}
                <div className="px-2 pb-4">
                  {/* Grades */}
                  <Collapsible open={isGradesOpen} onOpenChange={setIsGradesOpen} className="mb-1">
                    <CollapsibleTrigger className="flex items-center w-full text-left py-1.5 px-2 rounded hover:bg-gray-200 dark:hover:bg-[#31333c] text-sm font-medium">
                      <ChevronRight
                        className={cn('w-4 h-4 mr-2 transition-transform duration-200', isGradesOpen && 'transform rotate-90')} />
                      Grades
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4">
                       <GradeSelector grades={grades} selectedGrade={grade} onSelectGrade={handleGradeSelect} />
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Subjects */}
                  <AnimatePresence>
                    {grade && (
                      <motion.div key="subjects-section" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mb-1">
                        <SubjectList subjects={filteredSubjects} selectedSubject={course} onSelectSubject={handleSubjectSelect} isSubjectsOpen={isSubjectsOpen} setIsSubjectsOpen={setIsSubjectsOpen} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Chapters */}
                  <AnimatePresence>
                    {course && (
                      <motion.div key="chapters-section" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mb-1">
                        <ChapterList chapters={filteredChapters} selectedGrade={grade} selectedCourse={course} isChaptersOpen={isChaptersOpen} setIsChaptersOpen={setIsChaptersOpen} onSelectChapter={handleChapterSelect} onSubChapterClick={handleSubChapterClick} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Static Links */}
                 <div className="px-2 border-t border-gray-200 dark:border-gray-700/50 pt-2">
                     <Link href="/main" passHref>
                         <Button variant="ghost" className="flex items-center justify-start w-full px-2 py-1.5 text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#31333c] rounded" onClick={() => router.push('/main')}>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                            Home
                         </Button>
                     </Link>
                 </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed View Icons (only visible when closed on desktop) */}
         {!isOpen && !isMobile && ( // Check for !isMobile here
              <div className="flex flex-col items-center mt-4 space-y-3 flex-shrink-0">
                   <Link href="/flashcard" passHref title="Flash Cards">
                         <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                         </Button>
                   </Link>
                   {/* Add other icons */}
              </div>
         )}

        {/* Footer Section (User Profile & Theme Toggle) */}
        <div className={cn(
            "mt-auto p-2 border-t border-gray-200 dark:border-gray-700/50 flex-shrink-0",
            !isOpen && "md:py-2" // Padding when closed on desktop
            )}>
          {session?.user?.name && (
            <div className="relative" ref={userMenuRef}>
              {/* Container for button and theme toggle when open */}
              <div className={cn("flex items-center", isOpen ? "justify-between" : "md:justify-center")}>
                {/* User Button/Icon */}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={cn(
                    'flex items-center rounded-md p-1 text-left', // Ensure text aligns left
                    'hover:bg-gray-200 dark:hover:bg-[#31333c]',
                     isOpen ? "w-full" : "md:w-auto md:justify-center", // Full width open, auto centered closed desktop
                     !isOpen && !isMobile && "w-full justify-center" // Center icon when closed on desktop
                  )}
                   aria-label="User menu"
                   // Disable only if closed AND on mobile (no visual cue needed)
                   disabled={!isOpen && isMobile}
                >
                  <div
                    className={cn(
                      'rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold shrink-0',
                       isOpen ? 'w-7 h-7 text-sm' : 'w-8 h-8', // Adjust size based on open state
                    )}
                    title={isOpen ? session.user.name : "User Menu"}
                  >
                    {session.user.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Show name only when open */}
                  {isOpen && (
                    <span className="ml-2 text-sm font-medium truncate flex-1">
                      {session.user.name}
                    </span>
                  )}
                </button>

                {/* Theme Toggle - Shows next to name when open */}
                {isOpen && <ThemeToggle />}
              </div>

              {/* User Menu Dropdown - Only shows when sidebar and menu are open */}
              {isUserMenuOpen && isOpen && (
                <div
                  className={cn(
                    'absolute bottom-full left-2 right-2 mb-2 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50',
                    theme === 'dark' ? 'bg-[#404552]' : 'bg-white',
                  )}
                >
                  <div className="py-1">
                    <button onClick={() => { router.push('/progress'); setIsUserMenuOpen(false); handleSubChapterClick(); }} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-[#4b5162] rounded">Progress</button>
                    <button onClick={() => { /* Settings */ setIsUserMenuOpen(false); handleSubChapterClick(); }} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-[#4b5162] rounded">Settings</button>
                    <button onClick={() => { signOut(); setIsUserMenuOpen(false); handleSubChapterClick(); }} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-[#4b5162] rounded text-red-600 dark:text-red-400">Logout</button>
                  </div>
                </div>
              )}
            </div>
          )}
           {/* Theme toggle icon for closed state on desktop (only if user exists) */}
           {!isOpen && !isMobile && session?.user?.name && (
               <div className="flex justify-center mt-2">
                   <ThemeToggle />
               </div>
           )}
           {/* Theme toggle for logged-out users */}
           {!session?.user?.name && (
              <div className={cn("flex", isOpen ? "justify-end pr-1" : "justify-center")}>
                  <ThemeToggle />
              </div>
           )}
        </div>
      </div>
    </>
  );
};


// --- Sub Components (GradeSelector, SubjectList, ChapterList) ---
// (No major changes needed here, ensure they look okay with the new theme/layout)
// ... (GradeSelector component remains the same)
const GradeSelector: React.FC<{
  grades: string[];
  selectedGrade: string | null;
  onSelectGrade: (grade: string) => void;
}> = ({ grades, selectedGrade, onSelectGrade }) => {
  return (
    <div className="flex flex-wrap gap-1.5 pt-1 pb-1"> {/* Adjusted gap/padding */}
      {grades.map((grade) => (
        <motion.div
          key={grade}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost" // Use ghost for better theme adaptation
            size="sm" // Slightly smaller buttons
            className={cn(
              'w-9 h-9 rounded-md p-0 text-xs font-medium', // Adjusted size/rounding
              selectedGrade === grade
                ? 'bg-blue-500 text-white hover:bg-blue-600' // Clearer selected state
                : 'bg-gray-200 dark:bg-[#404552] text-gray-700 dark:text-[#a0a6b1] hover:bg-gray-300 dark:hover:bg-[#4b5162]',
            )}
            onClick={() => onSelectGrade(grade)}
          >
            {grade.replace('grade', '').trim()}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

// ... (SubjectList component remains the same)
const SubjectList: React.FC<{
  subjects: string[];
  selectedSubject: string | null;
  onSelectSubject: (subject: string) => void;
  isSubjectsOpen: boolean;
  setIsSubjectsOpen: (isOpen: boolean) => void;
}> = ({ subjects, selectedSubject, onSelectSubject, isSubjectsOpen, setIsSubjectsOpen }) => {
  return (
    <Collapsible open={isSubjectsOpen} onOpenChange={setIsSubjectsOpen}>
      <CollapsibleTrigger className="flex items-center w-full text-left py-1.5 px-2 rounded hover:bg-gray-200 dark:hover:bg-[#31333c] text-sm font-medium">
        <ChevronRight
          className={cn(
            'w-4 h-4 mr-2 transition-transform duration-200',
            isSubjectsOpen && 'transform rotate-90',
          )}
        />
        Subjects
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-1"> {/* Reduce indent slightly */}
        <ul className="ml-4 border-l border-gray-300 dark:border-[#4b5162] pl-3 py-1 space-y-0.5"> {/* Added padding/space */}
          {subjects.map((subject) => (
            <li key={subject} className="relative">
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start text-left h-auto py-1 px-2 rounded text-sm', // Allow height adjust, consistent padding
                  'border-l-2 border-transparent', // Base border
                  selectedSubject === subject
                    ? 'bg-blue-100 dark:bg-[#4b5162] text-blue-700 dark:text-white font-semibold border-l-blue-500' // Clearer selected style
                    : 'text-gray-600 dark:text-[#a0a6b1] hover:bg-gray-200 dark:hover:bg-[#31333c] hover:text-gray-900 dark:hover:text-white',
                )}
                onClick={() => onSelectSubject(subject)}
                 title={subject} // Add tooltip for potentially long names
              >
                 {subject.length > 25 ? `${subject.substring(0, 25)}...` : subject}
              </Button>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};


// ... (ChapterList component remains the same, but ensure Link uses encodeURIComponent)
const ChapterList: React.FC<{
  chapters: Chapter[];
  selectedGrade: string | null;
  selectedCourse: string | null;
  isChaptersOpen: boolean;
  setIsChaptersOpen: (isOpen: boolean) => void;
  onSelectChapter: (chapter: string) => void;
  onSubChapterClick: () => void; // Add handler for mobile close
}> = ({ chapters, selectedGrade, selectedCourse, isChaptersOpen, setIsChaptersOpen, onSelectChapter, onSubChapterClick }) => {
  const [openChapters, setOpenChapters] = useState<string[]>([]);

  const toggleChapter = (chapterName: string) => {
    setOpenChapters(prev =>
      prev.includes(chapterName)
        ? prev.filter(name => name !== chapterName)
        : [chapterName] // Open clicked, close others
    );
     onSelectChapter(chapterName);
  };

  return (
    <Collapsible open={isChaptersOpen} onOpenChange={setIsChaptersOpen}>
      <CollapsibleTrigger className="flex items-start w-full text-left py-1.5 px-2 rounded hover:bg-gray-200 dark:hover:bg-[#31333c] text-sm font-medium">
        <ChevronRight
          className={cn('w-4 h-4 mr-2 transition-transform duration-200 flex-shrink-0 mt-0.5', isChaptersOpen && 'transform rotate-90')} />
        Chapters
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-1">
        <ul className="ml-4 border-l border-gray-300 dark:border-[#4b5162] pl-3 py-1 space-y-0.5">
          {chapters.map((chapter) => (
            <li key={chapter.name}>
              <Collapsible open={openChapters.includes(chapter.name)} onOpenChange={() => toggleChapter(chapter.name)}>
                <CollapsibleTrigger className="flex items-start w-full text-left py-1 px-2 hover:bg-gray-200 dark:hover:bg-[#31333c] rounded text-sm">
                   <ChevronRight className={cn('w-4 h-4 mr-2 transition-transform duration-200 flex-shrink-0 mt-0.5', openChapters.includes(chapter.name) && 'transform rotate-90')} />
                   <span className="flex-1" title={chapter.name}>
                      {chapter.name.length > 23 ? `${chapter.name.substring(0, 23)}...` : chapter.name}
                   </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-1">
                  <ul className="ml-4 border-l border-gray-300 dark:border-[#4b5162] pl-3 py-1 space-y-0.5">
                    {chapter.subChapters.map((subChapter) => (
                      <li key={subChapter} className="relative items-start">
                        {selectedGrade && selectedCourse && (
                          <Link
                            // Ensure URL parts are encoded
                            href={`/moe/${encodeURIComponent(selectedGrade)}/${encodeURIComponent(selectedCourse)}/${encodeURIComponent(chapter.name)}/${encodeURIComponent(subChapter)}`}
                            passHref
                          >
                            <Button
                              variant="ghost"
                              className="w-full text-left justify-start h-auto py-1 px-2 rounded text-sm text-gray-600 dark:text-[#a0a6b1] hover:bg-gray-200 dark:hover:bg-[#31333c] hover:text-gray-900 dark:hover:text-white"
                              onClick={onSubChapterClick} // Close sidebar on mobile
                              title={subChapter}
                            >
                              {subChapter.length > 20 ? `${subChapter.substring(0, 20)}...` : subChapter}
                            </Button>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Sidebar;
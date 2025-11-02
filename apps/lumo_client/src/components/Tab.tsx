// @/components/Tab.tsx (Updated)
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { usePathname, useRouter } from 'next/navigation';
import { IoMdAdd } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { TbLayoutList } from 'react-icons/tb'; // Keep for split view
import Split from 'split.js';
import { cn } from '@/lib/utils'; // Import cn utility

interface Tab {
  id: string;
  path: string;
  title: string;
  params?: {
    grade?: string;
    course?: string;
    chapter?: string;
    subChapter?: string;
  };
}

// Add props for controlling open state from parent
interface TabManagerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  triggerRef?: React.RefObject<HTMLButtonElement>; // Optional: ref of the trigger button for positioning
}

const TabManager = ({ isOpen, setIsOpen, triggerRef }: TabManagerProps) => {
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [isSplitMode, setIsSplitMode] = useState(false);
    const tabManagerRef = useRef<HTMLDivElement>(null);
    const splitInstanceRef = useRef<Split.Instance | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const TAB_HEIGHT = 40; // Adjusted tab height
    const HEADER_HEIGHT = 48; // Adjusted header height for dropdown controls
    const MAX_VISIBLE_TABS = 6; // Max tabs before scrolling within dropdown
    const MAX_TABS = 10; // Absolute max tabs allowed

    // Calculate dropdown max height based on visible tabs
    const calculateContainerMaxHeight = () => {
      const contentHeight = Math.min(tabs.length, MAX_VISIBLE_TABS) * TAB_HEIGHT;
      return `${HEADER_HEIGHT + contentHeight}px`;
    };

    // Initialize first tab
    useEffect(() => {
      if (tabs.length === 0 && pathname !== '/_error') { // Avoid adding tabs on error pages
        const newTab = createNewTab(pathname);
        if (newTab.title !== 'not-found') { // Avoid adding 'not-found' tab initially
            setTabs([newTab]);
            setActiveTab(newTab.id);
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]); // Run only when pathname changes initially if tabs are empty

    // Close dropdown on click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        // Close if click is outside the dropdown and not on the trigger button
        if (
          tabManagerRef.current &&
          !tabManagerRef.current.contains(event.target as Node) &&
          triggerRef?.current && // Check if triggerRef exists
          !triggerRef.current.contains(event.target as Node) // Check if click was on trigger
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, setIsOpen, triggerRef]); // Add triggerRef to dependencies

    // Cleanup split mode
    useEffect(() => {
        if (tabs.length < 2 && isSplitMode) {
          toggleSplitMode(); // Use the toggle function to clean up
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [tabs.length, isSplitMode]); // Dependencies are correct


    // Toggle Split Mode Function (simplified cleanup)
    const toggleSplitMode = useCallback(() => {
        if (tabs.length <= 1 && !isSplitMode) return; // Prevent enabling if not enough tabs

        if (!isSplitMode && tabs.length >= 2) {
            setIsSplitMode(true);
            // Find the main content area to split
            const contentContainer = document.getElementById('content-container'); // Use the ID from ContentLayout
            if (contentContainer) {
                 // Create wrapper for split panes
                const splitWrapper = document.createElement('div');
                splitWrapper.id = 'split-parent';
                splitWrapper.className = 'flex h-full w-full'; // Ensure it takes full space

                const pane1 = document.createElement('div');
                pane1.id = 'split-pane-1';
                pane1.className = 'overflow-auto'; // Add overflow handling
                pane1.style.height = '100%'; // Ensure height

                const pane2 = document.createElement('div');
                pane2.id = 'split-pane-2';
                pane2.className = 'overflow-auto'; // Add overflow handling
                pane2.style.height = '100%'; // Ensure height

                // Move all children of contentContainer to pane1
                while (contentContainer.firstChild) {
                    pane1.appendChild(contentContainer.firstChild);
                }

                // Clone pane1's content for pane2 (simple clone for now)
                // Note: complex components/state might not clone well.
                // A better approach might involve rendering the second component via routing/state.
                pane2.innerHTML = pane1.innerHTML;

                // Append panes to wrapper and wrapper to original container
                splitWrapper.appendChild(pane1);
                splitWrapper.appendChild(pane2);
                contentContainer.appendChild(splitWrapper);


                // Initialize Split.js
                splitInstanceRef.current = Split(['#split-pane-1', '#split-pane-2'], {
                    sizes: [50, 50],
                    minSize: 200, // Adjust min size as needed
                    gutterSize: 8,
                    cursor: 'col-resize',
                    elementStyle: (dimension, size, gutterSize) => ({
                        'flex-basis': `calc(${size}% - ${gutterSize}px)`,
                    }),
                    gutterStyle: (dimension, gutterSize) => ({
                        'flex-basis': `${gutterSize}px`,
                    })
                });
            }
        } else if (isSplitMode) {
            setIsSplitMode(false);
            if (splitInstanceRef.current) {
                splitInstanceRef.current.destroy(true); // Pass true to remove gutter elements
                splitInstanceRef.current = null;
            }
            // Restore content
            const contentContainer = document.getElementById('content-container');
            const splitWrapper = document.getElementById('split-parent');
            const pane1 = document.getElementById('split-pane-1');

            if (contentContainer && splitWrapper && pane1) {
                 // Move content back from pane1 to contentContainer
                while (pane1.firstChild) {
                    contentContainer.appendChild(pane1.firstChild);
                }
                // Remove the split wrapper
                 splitWrapper.remove();
            }
             // Ensure original container styles are restored if needed
            if(contentContainer){
                 contentContainer.style.height = ''; // Reset height if it was set
                 contentContainer.style.display = ''; // Reset display if changed
            }
        }
    }, [isSplitMode, tabs.length]);


    const createNewTab = useCallback((path: string): Tab => {
      const searchParams = new URLSearchParams(window.location.search);
      const grade = searchParams.get('grade') || undefined;
      const course = searchParams.get('course') || undefined;
      const chapter = searchParams.get('chapter') || undefined;
      const subChapter = searchParams.get('subChapter') || undefined;

      // Basic title generation, improve as needed
      let title = "New Tab";
       if (path.startsWith('/content/')) {
           title = path.split('/').pop() || 'Content'; // Get last part of path
       } else if (path === '/home') {
           title = 'Home';
       } else {
           const pathParts = path.split('/').filter(Boolean);
           title = pathParts.pop()?.replace('-', ' ') || 'Page';
           title = title.charAt(0).toUpperCase() + title.slice(1); // Capitalize
       }
       // Add course/chapter info if available for content pages
        if (course) title = `${course.charAt(0).toUpperCase() + course.slice(1)}`;
        if (chapter) title += ` Ch ${chapter}`;
        if (subChapter) title += `.${subChapter}`;


      return {
        id: uuidv4(),
        path: `${path}?${searchParams.toString()}`, // Include query parameters
        title: title,
        params: { grade, course, chapter, subChapter },
      };
    }, []);

    const addNewTab = useCallback(() => {
      if (tabs.length >= MAX_TABS) {
        console.warn("Maximum tab limit reached.");
        return;
      }
      // Use a default path like '/home' or the current active tab's base path
      const basePath = activeTab ? tabs.find(t => t.id === activeTab)?.path.split('?')[0] || '/home' : '/home';
      const newTab = createNewTab(basePath); // Create tab based on a default/current path
      setTabs(prevTabs => [...prevTabs, newTab]);
      setActiveTab(newTab.id);
      router.push(newTab.path); // Navigate to the new tab's path
      setIsOpen(true); // Keep dropdown open
    }, [tabs, activeTab, MAX_TABS, createNewTab, router, setIsOpen]);


    const removeTab = useCallback((tabId: string, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent triggering switchTab
      if (tabs.length === 1) return; // Don't close the last tab

      setTabs(prevTabs => {
          const newTabs = prevTabs.filter(tab => tab.id !== tabId);
          if (activeTab === tabId) {
              // If the active tab is closed, switch to the last tab in the new list
              const lastTab = newTabs[newTabs.length - 1];
              if (lastTab) {
                  setActiveTab(lastTab.id);
                  router.push(lastTab.path);
              } else {
                 setActiveTab(null); // Should not happen if we prevent closing last tab
              }
          }
          return newTabs;
      });
    }, [tabs.length, activeTab, router]);

    const switchTab = useCallback((tab: Tab) => {
      if (activeTab !== tab.id) {
          setActiveTab(tab.id);
          router.push(tab.path);
      }
      setIsOpen(false); // Close dropdown on tab selection
    }, [activeTab, router, setIsOpen]);


    // Update tab title/path if current path changes while tab is active
    useEffect(() => {
        const currentTab = tabs.find(tab => tab.id === activeTab);
        if (currentTab) {
             const searchParams = new URLSearchParams(window.location.search);
             const updatedPath = `${pathname}?${searchParams.toString()}`;
             const newTitle = createNewTab(pathname).title; // Use helper to get consistent title

             // Only update if path or title actually changed
             if (currentTab.path !== updatedPath || currentTab.title !== newTitle) {
                setTabs(prevTabs =>
                    prevTabs.map(tab =>
                      tab.id === activeTab
                        ? { ...tab, path: updatedPath, title: newTitle }
                        : tab
                    )
                );
             }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, activeTab, createNewTab]); // Rerun when path or active tab changes


  // Dynamic positioning based on trigger button
  const getDropdownPosition = () => {
    if (triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Position below the trigger, slightly offset left/right to center it relative to the trigger
      // Or align fully to the right edge of the screen
       return {
           // top: `${rect.bottom + 8}px`, // 8px gap below trigger
           // right: `${window.innerWidth - rect.right}px` // Align right edge with trigger right edge
           // Or Center below pill (approximate)
            top: `68px`, // Below the header (h-16 is 64px + gap)
            left: '50%', // Start at center
            transform: 'translateX(-50%)', // Adjust to actual center
            // Or Align right below pill (approximate)
            // top: `68px`,
            // right: `20px`, // Adjust as needed
      };
    }
    // Default fallback position
    return { top: '68px', left: '50%', transform: 'translateX(-50%)' };
  };


  return (
      // Dropdown Container
      <div
          ref={tabManagerRef}
          className={cn(
              "fixed z-40 w-[90vw] max-w-sm rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-[#2d303a] shadow-xl transition-all duration-300 ease-in-out",
              "flex flex-col overflow-hidden", // Ensure content clips correctly
              // Open/Closed state styles
              isOpen
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-4 pointer-events-none'
          )}
          style={{
              ...getDropdownPosition(), // Apply dynamic positioning
              maxHeight: `calc(${calculateContainerMaxHeight()} + 20px)` // Add padding buffer
           }} // Dynamic max height
      >
          {/* Header Controls */}
          <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700/50 shrink-0">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2">OPEN TABS</span>
              <div className="flex items-center gap-1">
                   <button
                      onClick={toggleSplitMode}
                      className={cn(
                          "p-1.5 rounded transition-colors",
                          tabs.length <= 1
                              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                          isSplitMode ? 'bg-primary/10 text-primary dark:bg-primary/20' : ''
                      )}
                      disabled={tabs.length <= 1}
                      aria-label={isSplitMode ? "Exit Split View" : "Enter Split View"}
                      title={isSplitMode ? "Exit Split View" : "Enter Split View (requires 2+ tabs)"}
                  >
                      <TbLayoutList className="w-4 h-4" />
                  </button>
                  <button
                      onClick={addNewTab}
                      className={cn(
                          "p-1.5 rounded transition-colors",
                           tabs.length >= MAX_TABS
                              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                      disabled={tabs.length >= MAX_TABS}
                      aria-label="Add New Tab"
                      title="Add New Tab"
                  >
                      <IoMdAdd className="w-4 h-4" />
                  </button>
              </div>
          </div>

          {/* Tab List */}
          <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-1">
              {tabs.map(tab => (
                  <div
                      key={tab.id}
                      onClick={() => switchTab(tab)}
                      className={cn(
                          `flex justify-between items-center pl-4 pr-2 py-2 cursor-pointer group`,
                          `hover:bg-gray-100 dark:hover:bg-[#363945]`,
                          activeTab === tab.id ? 'bg-gray-100/80 dark:bg-[#363945]/80 font-medium' : '',
                          `transition-colors duration-150 min-h-[${TAB_HEIGHT}px]`
                      )}
                      title={tab.title} // Show full title on hover
                  >
                      <span className="text-sm truncate flex-1 mr-2">{tab.title}</span>
                      <button
                          onClick={(e) => removeTab(tab.id, e)}
                          className={cn(
                              "p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100", // Show on hover/focus
                              "hover:bg-red-100 dark:hover:bg-red-800/50 hover:text-red-600 dark:hover:text-red-400",
                               "transition-all duration-150",
                               tabs.length === 1 ? "hidden" : "" // Hide close on last tab
                          )}
                          aria-label={`Close tab: ${tab.title}`}
                      >
                          <IoClose className="w-4 h-4" />
                      </button>
                  </div>
              ))}
              {tabs.length === 0 && (
                 <div className="text-center text-sm text-gray-500 py-4 px-4">
                      No open tabs. Add one to get started.
                 </div>
              )}
          </div>
      </div>
  );
};

export default TabManager;
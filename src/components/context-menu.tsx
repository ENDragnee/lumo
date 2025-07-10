"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// This component imports all its functionality from the dedicated actions file.
// This keeps the component clean and focused on UI and state management.
import {
  askAIAction,
  copyAction,
  highlightAction,
  searchAction,
} from '@/app/actions/contextMenuActions';

interface ContextMenuProps {
  contentId: string;
}

export function ContextMenu({ contentId }: ContextMenuProps) {
  // Refs to detect clicks outside the menu and modal
  const menuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // State for the context menu's visibility and position
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  // State to track if text is selected, used to enable/disable menu items
  const [isTextSelected, setIsTextSelected] = useState(false);

  // State for the AI response modal
  const [showModal, setShowModal] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to close the context menu
  const handleCloseMenu = () => {
    setMenuPosition(null);
  };

  // Main effect to listen for right-clicks on the document
  useEffect(() => {
    const handleRightClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't show our custom menu if the user is right-clicking on an input,
      // textarea, or an existing highlight, to allow for browser/other actions.
      if (target.closest('input, textarea, .custom-highlight')) {
        return;
      }

      event.preventDefault(); // Prevent the default browser context menu

      // Check if any text is selected to determine which menu items should be active
      const selection = window.getSelection()?.toString().trim() ?? '';
      setIsTextSelected(selection.length > 0);

      // Set the position for the menu to appear at the cursor's location
      setMenuPosition({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener('contextmenu', handleRightClick);

    // Cleanup: remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('contextmenu', handleRightClick);
    };
  }, []); // The empty dependency array ensures this effect runs only once

  // Effect to handle closing the menu (via left-click outside or Escape key)
  useEffect(() => {
    const handleInteraction = (event: MouseEvent | KeyboardEvent) => {
      // Close everything on Escape key press
      if (event instanceof KeyboardEvent && event.key === 'Escape') {
        handleCloseMenu();
        setShowModal(false);
      }
      // Close menu on left-click outside of it
      if (event instanceof MouseEvent && event.button === 0) {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          handleCloseMenu();
        }
      }
    };

    document.addEventListener('mousedown', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('mousedown', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []); // This effect also runs only once

  // Define the menu items declaratively. The `action` is called from the imported file.
  const menuItems = [
    { label: 'Ask AI', action: () => askAIAction({ contentId, setIsLoading, setShowModal, setAiResponse }), disabled: !isTextSelected },
    { label: 'Copy', action: copyAction, disabled: !isTextSelected },
    { label: 'Highlight', action: () => highlightAction('yellow', contentId), disabled: !isTextSelected },
    { label: 'Search', action: searchAction, disabled: !isTextSelected },
  ];

  return (
    <>
      <AnimatePresence>
        {menuPosition && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className="fixed z-50 bg-white dark:bg-[#383c4a] rounded-lg shadow-xl overflow-hidden w-36 border border-gray-200 dark:border-gray-700"
            style={{ left: menuPosition.x, top: menuPosition.y }}
          >
            <div className="py-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (item.disabled) return;
                    item.action();
                    // When "Ask AI" is clicked, the menu closes and the modal opens.
                    // For other actions, we just close the menu.
                    handleCloseMenu();
                  }}
                  disabled={item.disabled}
                  className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#4b5162] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]"
            onClick={() => setShowModal(false)} // Close modal on overlay click
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white dark:bg-[#383c4a] rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
            >
              <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 className="text-xl font-semibold">AI Response</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200">{aiResponse}</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

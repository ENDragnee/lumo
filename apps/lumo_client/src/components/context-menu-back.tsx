import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Mark from 'mark.js';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export default function ContextMenu({ x, y, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskAI = async () => {
    setIsLoading(true);
    setShowModal(true);
    setAiResponse('');

    const selection = window.getSelection();
    const selectedText = selection?.toString();

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: selectedText }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body?.getReader();
      if (!reader) return;

      let responseText = '';

      // Read the stream and accumulate content
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const parsedChunk = chunk.match(/{"content":"(.*?)"}/g);

        if (parsedChunk) {
          parsedChunk.forEach((jsonStr) => {
            const content = JSON.parse(jsonStr)?.content || '';
            responseText += content;
            setAiResponse(responseText); // Update the state with the content
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setAiResponse('Error getting AI response');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowModal(false);
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close context menu if the click is outside both the menu and the modal
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !showModal
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, showModal]);

  const menuItems = [
    { label: 'Ask AI', action: handleAskAI },
    { label: 'Copy', action: () => document.execCommand('copy') },
    { label: 'Highlight', action: () => highlightText() },
    {
      label: 'Search',
      action: () => {
        const selection = window.getSelection()?.toString();
        if (selection) {
          const query = encodeURIComponent(selection);
          window.open(`https://www.google.com/search?q=${query}`, '_blank');
        } else {
          alert('No text selected to search.');
        }
      },
    },
  ];
  const highlightText = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
  
    const range = selection.getRangeAt(0);
  
    // Check if selection is collapsed (just a cursor)
    if (range.collapsed) return;
  
    // Helper function to check if node is highlighted
    const isHighlighted = (node: Node): boolean => {
      return (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as Element).tagName === 'SPAN' &&
        (node as HTMLElement).style.backgroundColor === 'yellow' // or use another color like 'blue'
      );
    };
    
  
    // Check if selection is entirely within a highlighted span
    const startContainer = range.startContainer.parentElement;
    const endContainer = range.endContainer.parentElement;
    const sameHighlightedSpan = startContainer === endContainer && isHighlighted(startContainer!);
  
    if (sameHighlightedSpan) {
      // Remove highlight
      const span = startContainer as HTMLElement;
      const parent = span.parentNode;
      if (parent) {
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
      }
    } else {
      // Get the current theme
      const isDarkMode = document.documentElement.classList.contains('dark') as boolean;
  
      // First remove any existing highlights in the range
      const fragment = range.cloneContents();
      const highlightedSpans = fragment.querySelectorAll('span[style*="background-color"]');
      highlightedSpans.forEach(span => {
        const parent = span.parentNode;
        if (parent) {
          while (span.firstChild) {
            parent.insertBefore(span.firstChild, span);
          }
          parent.removeChild(span);
        }
      });
  
      // Apply new highlight with blue for dark mode, yellow for light mode
      const span = document.createElement('span');
      span.style.backgroundColor = isDarkMode ? '#5294e2' : 'yellow'; // Use blue in dark mode
      range.deleteContents();
      span.appendChild(fragment);
      range.insertNode(span);
  
      // Normalize to clean up any adjacent text nodes
      span.parentNode?.normalize();
    }
  
    // Clear selection
    selection.removeAllRanges();
  };
  

  return (
    <>
      <AnimatePresence>
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className="fixed z-50 bg-white dark:bg-[#383c4a] rounded-lg shadow-lg overflow-hidden max-w-xs w-32 px-2"
          style={{ left: x, top: y }}
        >
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  if (item.label !== 'Ask AI') onClose(); // Close on click outside Ask AI
                }}
                className="w-full text-center px-4 py-2 rounded-lg text-left text-sm hover:bg-gray-100 dark:hover:bg-[#4b5162] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-[#383c4a] rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">AI Response</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{aiResponse}</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

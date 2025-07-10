// src/utils/highlighting.ts
"use client";
import { Schema } from 'mongoose';

// Assuming your IHighlight interface is defined in the models directory.
// This is a "type-only" import, so it's safe in a client component.
type IHighlight = {
  _id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  content_id: Schema.Types.ObjectId;
  color: string;
  highlighted_text: string;
  start_offset: number;
  end_offset: number;
  createdAt: Date;
}

/**
 * Calculates the character offset of a selection's start and end points
 * relative to a container element's text content. This is a robust way to
 * store a selection's position, as it's independent of the HTML structure.
 *
 * @param {Range} range - The user's selection range from `window.getSelection()`.
 * @param {HTMLElement} container - The root element within which the selection exists (e.g., a div with id="content").
 * @returns {{start: number, end: number}} The start and end character offsets.
 */
export function getCharacterOffsetWithin(range: Range, container: HTMLElement): { start: number; end: number } {
  // Create a temporary range that spans from the beginning of the container
  // to the start of the user's selection. The length of this temporary range's
  // text content is the start offset.
  const preSelectionRange = document.createRange();
  preSelectionRange.selectNodeContents(container);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  const start = preSelectionRange.toString().length;

  return {
    start: start,
    end: start + range.toString().length,
  };
}

/**
 * Recreates a DOM Range object from saved character offsets within a container.
 * This function iterates through all text nodes to find the exact start and end points.
 *
 * @param {HTMLElement} container - The element to search within for restoring the highlight.
 * @param {number} startOffset - The starting character offset of the saved highlight.
 * @param {number} endOffset - The ending character offset of the saved highlight.
 * @returns {Range | null} A DOM Range object that can be used to re-apply the highlight, or null if the offsets are invalid.
 */
export function createRangeFromOffsets(container: HTMLElement, startOffset: number, endOffset: number): Range | null {
  const textNodes: Node[] = [];
  // Use a TreeWalker to efficiently gather all text nodes within the container.
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }

  let charCount = 0;
  let startNode: Node | null = null;
  let endNode: Node | null = null;
  let rangeStartOffset = 0;
  let rangeEndOffset = 0;

  for (const textNode of textNodes) {
    const nodeLength = textNode.textContent?.length ?? 0;
    
    // Find the start node and the offset within that specific node
    if (startNode === null && startOffset >= charCount && startOffset < charCount + nodeLength) {
      startNode = textNode;
      rangeStartOffset = startOffset - charCount;
    }
    
    // Find the end node and the offset within that specific node
    if (endNode === null && endOffset > charCount && endOffset <= charCount + nodeLength) {
      endNode = textNode;
      rangeEndOffset = endOffset - charCount;
    }

    charCount += nodeLength;
    
    // Stop searching once both start and end nodes are found
    if (startNode && endNode) {
        break;
    }
  }
  
  // If we found both nodes, create and return the range
  if (startNode && endNode) {
    const range = document.createRange();
    range.setStart(startNode, rangeStartOffset);
    range.setEnd(endNode, rangeEndOffset);
    return range;
  }
  
  console.warn("Could not create range from offsets. Content may have changed.", { startOffset, endOffset });
  return null;
}

/**
 * Fetches all highlights for a given content ID from the backend API
 * and applies them to the DOM.
 *
 * @param {string} contentId - The ID of the content to fetch highlights for.
 */
export async function restoreHighlights(contentId: string): Promise<void> {
    const contentContainer = document.getElementById('content');
    if (!contentContainer) {
        console.error("Content container #content not found for restoring highlights.");
        return;
    }

    try {
        const response = await fetch(`/api/highlights/${contentId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch highlights: ${response.statusText}`);
        }
        const highlights: IHighlight[] = await response.json();

        // Clear any pre-existing highlights to prevent duplicates on re-render.
        contentContainer.querySelectorAll('mark.custom-highlight').forEach(mark => {
            const parent = mark.parentNode;
            while (mark.firstChild) {
                parent?.insertBefore(mark.firstChild, mark);
            }
            parent?.removeChild(mark);
            // Merges adjacent text nodes that might have been split by the highlight.
            parent?.normalize(); 
        });
        
        for (const highlight of highlights) {
            const range = createRangeFromOffsets(contentContainer, highlight.start_offset, highlight.end_offset);
            if (range) {
                const mark = document.createElement('mark');
                mark.className = 'custom-highlight';
                mark.style.backgroundColor = highlight.color;
                mark.dataset.highlightId = highlight._id.toString();
                
                // Wrap the content of the recreated range in the new <mark> element.
                range.surroundContents(mark);
            }
        }
    } catch (error) {
        console.error("An error occurred while restoring highlights:", error);
    }
}

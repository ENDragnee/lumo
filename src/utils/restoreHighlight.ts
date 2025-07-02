// /utils/restoreHighlight.ts (Corrected and Type-Safe)

import { HighlightInstance } from '@/components/interfaces/highlight';
// We don't need mark.js here anymore, but let's keep robust-highlighting
import { recreateRangeFromOffsets } from './robust-highlighting';

// Define a type for the data we'll be working with internally.
// This solves the "implicit any" error.
type ValidatedHighlight = {
  range: Range;
  data: HighlightInstance;
};

export const restoreHighlights = async (contentId: string) => {
  try {
    if (!contentId) return;

    const response = await fetch(`/api/highlights/fetch-highlight/${contentId}`);
    if (!response.ok) {
      if (response.status !== 404) console.error('Failed to fetch highlights');
      return;
    }

    const highlights: HighlightInstance[] = await response.json();
    const container = document.getElementById('content');

    if (!container || highlights.length === 0) return;

    // Clear any previous marks manually if needed.
    // This is safer than a global unmark if you have other markers.
    container.querySelectorAll('mark.custom-highlight').forEach(mark => {
        // Unwrap the mark element, preserving its text content
        const parent = mark.parentNode;
        if (parent) {
            while (mark.firstChild) {
                parent.insertBefore(mark.firstChild, mark);
            }
            parent.removeChild(mark);
        }
    });
    // Normalizing the container merges adjacent text nodes, which can be beneficial.
    container.normalize();


    // Use our explicit type here to create the array
    const validatedHighlights: ValidatedHighlight[] = [];

    for (const highlight of highlights) {
      // Reconstruct the precise range for each highlight
      const range = recreateRangeFromOffsets(container, highlight.start_offset, highlight.end_offset);

      if (range) {
        // Sanity check: Does the text in the reconstructed range match the saved text?
        if (range.toString().trim() === highlight.highlighted_text) {
          validatedHighlights.push({ range, data: highlight });
        } else {
          console.warn(`Could not restore highlight ID ${highlight._id}. Content may have changed.`, {
            expected: highlight.highlighted_text,
            found: range.toString().trim(),
          });
        }
      }
    }

    // --- REPLACEMENT FOR markRanges ---
    // Instead of using mark.js, we'll manually wrap each valid range.
    // We iterate backwards to prevent ranges from affecting subsequent ones.
    // If we went forwards, wrapping range #1 could change the DOM structure
    // and invalidate the position of range #2.
    for (let i = validatedHighlights.length - 1; i >= 0; i--) {
        const { range, data } = validatedHighlights[i];

        const markElement = document.createElement('mark');
        markElement.className = 'custom-highlight';
        markElement.style.backgroundColor = data.color;
        markElement.dataset.highlightId = data._id;

        try {
            // surroundContents is a robust way to wrap a range.
            range.surroundContents(markElement);
        } catch (e) {
            console.error(`Error applying highlight for ID ${data._id}:`, e);
        }
    }

  } catch (error) {
    console.error('Error during highlight restoration process:', error);
  }
};

import { HighlightInstance } from '@/components/interfaces/highlight';
import Mark from 'mark.js';

// Hooks can't be used outside of React components
export const restoreHighlights = async (contentId: string) => {
    try {
      if (!contentId) {
        throw new Error('No content ID found');
      }
  
      const response = await fetch(`/api/highlights?id=${contentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch highlights');
      }
  
      const highlights: HighlightInstance[] = await response.json();
      const container = document.getElementById('content');
      if (!container) return;
  
      // Mark.js expects a HTMLElement | HTMLElement[] | NodeList | string
      const marker = new Mark(container);
      
      // Clear existing highlights first
      marker.unmark();
  
      // Restore highlights from database
      highlights.forEach((highlight: HighlightInstance) => {
        marker.mark(highlight.highlighted_text, {
          element: 'mark',
          className: 'custom-highlight',
          acrossElements: true,
          separateWordSearch: false,
          done: () => {
            const marks = container.querySelectorAll('mark.custom-highlight');
            marks.forEach((mark) => {
              // Changed highlighted_text to text for consistency
              if (mark.textContent === highlight.highlighted_text) {
                (mark as HTMLElement).dataset.highlightId = highlight._id;
                (mark as HTMLElement).style.backgroundColor = highlight.color;
              }
            });
          },
        });
      });
    } catch (error) {
      console.error('Error restoring highlights:', error);
    }
  };
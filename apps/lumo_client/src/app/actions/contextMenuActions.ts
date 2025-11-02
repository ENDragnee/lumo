// src/actions/contextMenuActions.ts
"use client";

import { getCharacterOffsetWithin } from '@/utils/highlighting';
import { getRobustOffsets } from '@/utils/robust-highlighting';

// Define the shape of the parameters for the askAIAction
interface AskAIActionParams {
  contentId: string;
  setIsLoading: (loading: boolean) => void;
  setShowModal: (show: boolean) => void;
  setAiResponse: (response: string) => void;
}

// THIS FUNCTION IS FROM THE PREVIOUS STEP AND REMAINS UNCHANGED
export const askAIAction = async ({
  contentId,
  setIsLoading,
  setShowModal,
  setAiResponse,
}: AskAIActionParams) => {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();

  if (!selection || !selectedText) {
    console.log('No text selected.');
    return;
  }
  setIsLoading(true);
  setShowModal(true);
  setAiResponse('');
  // For simplicity, we just call the main highlight action here.
  // The color 'red' will be saved to the database.
  await highlightAction('red', contentId);
  try {
    const response = await fetch('/api/ai/right-click-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedText }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    if (!response.body) throw new Error('Response body is null');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedResponse = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const jsonChunks = chunk.match(/{"content":"(.*?)"}/g);
      if (jsonChunks) {
        jsonChunks.forEach((jsonStr) => {
          try {
            const parsed = JSON.parse(jsonStr);
            accumulatedResponse += parsed?.content || '';
            setAiResponse(accumulatedResponse);
          } catch (e) { console.error("Failed to parse JSON chunk:", jsonStr); }
        });
      }
    }
  } catch (error) {
    console.error('Error fetching AI response:', error);
    setAiResponse('Sorry, an error occurred while getting the AI response.');
  } finally {
    setIsLoading(false);
  }
};

// THIS FUNCTION IS FROM THE PREVIOUS STEP AND REMAINS UNCHANGED
export const copyAction = () => {
  const selection = window.getSelection()?.toString();
  if (selection) {
    navigator.clipboard.writeText(selection).catch(err => {
      console.error('Failed to copy text using Clipboard API, falling back to execCommand: ', err);
      document.execCommand('copy');
    });
  }
};

/**
 * UPDATED: Highlights the currently selected text using a robust character-offset method
 * and saves it to the database.
 */

export const highlightAction = async (color: string, contentId: string) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const text = range.toString().trim();
    if (!text) return;

    const container = document.getElementById('content');
    if (!container || !container.contains(range.commonAncestorContainer)) {
      console.error("Selection is outside the '#content' container.");
      return;
    }

    // --- USE THE NEW ROBUST METHOD ---
    const offsets = getRobustOffsets(range, container);
    if (!offsets) {
        alert("Could not save highlight. The selection was not valid.");
        return;
    }
    const { start, end } = offsets;
    // --- END OF CHANGE ---

    try {
      const response = await fetch(`/api/highlights/create-highlight/${contentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text, // The API name is 'text' in your model
          color: color,
          startOffset: start, // Send the new robust offset
          endOffset: end      // Send the new robust offset
        })
      });

      if (!response.ok) throw new Error('Server responded with an error');
      
      const savedHighlight = await response.json();
      const mark = document.createElement('mark');
      mark.className = 'custom-highlight';
      mark.style.backgroundColor = color;
      mark.dataset.highlightId = savedHighlight._id;

      range.surroundContents(mark);
      selection.removeAllRanges();
      
    } catch (error) {
      console.error('Error saving highlight:', error);
    }
};

// THIS FUNCTION IS FROM THE PREVIOUS STEP AND REMAINS UNCHANGED
export const searchAction = () => {
  const selection = window.getSelection()?.toString().trim();
  if (selection) {
    const query = encodeURIComponent(selection);
    window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener,noreferrer');
  }
};

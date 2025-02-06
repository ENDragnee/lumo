export const handleHighlight = async (color = 'yellow', contentId: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const text = range.toString().trim();
    if (!text) return;

    const container = document.getElementById('content');
    if (!container) return;

    try {
      const response = await fetch(`/api/highlights?id=${contentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          color,
          startOffset: range.startOffset,
          endOffset: range.endOffset
        })
      });

      if (!response.ok) throw new Error('Failed to save highlight');
      const data = await response.json();

      // Update DOM with actual ID from database
      const mark = document.createElement('mark');
      mark.className = 'custom-highlight';
      mark.style.backgroundColor = color;
      mark.dataset.highlightId = data._id;
      mark.textContent = text;

      range.deleteContents();
      range.insertNode(mark);
      selection.removeAllRanges();
      
    } catch (error) {
      console.error('Error saving highlight:', error);
    }
  };
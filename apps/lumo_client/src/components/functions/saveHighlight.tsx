import { HighlightInstance } from '@/components/interfaces/highlight'

export const saveHighlightToDatabase = async (highlight: HighlightInstance) => {
    try {
      const response = await fetch('/api/highlights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(highlight),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save highlight');
      }
  
      console.log('Highlight saved:', await response.json());
    } catch (error) {
      console.error('Error saving highlight:', error);
      throw error;
    }
  };
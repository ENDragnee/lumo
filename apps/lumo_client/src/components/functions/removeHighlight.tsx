export const removeHighlightFromDatabase = async (highlightId: string) => {
    try {
      const response = await fetch(`/api/highlights/${highlightId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete highlight');
      }
  
      console.log('Highlight removed:', await response.json());
    } catch (error) {
      console.error('Error deleting highlight:', error);
      throw error;
    }
  };
'use client'

import { useEditor } from '@craftjs/core';
import { useState } from 'react';

interface SaveComponentProps {
  tags?: string[];
}

export const SaveComponent = ({ tags = [] }: SaveComponentProps) => {
  const { query } = useEditor();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const serializedData = query.serialize();

      const response = await fetch('/api/serialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: serializedData,
          tags,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      setSuccess(`Content saved successfully! ID: ${result.id}`);
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-4 py-2 rounded-lg ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-colors`}
        >
          {loading ? 'Saving...' : 'Save Content'}
        </button>
        
        {error && (
          <div className="text-red-600 dark:text-red-400 flex-1">{error}</div>
        )}
        
        {success && (
          <div className="text-green-600 dark:text-green-400 flex-1">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};
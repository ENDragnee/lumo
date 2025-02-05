'use client';

import { useEffect, useState } from 'react';
import { Editor, Frame } from '@craftjs/core';
import { viewerResolver } from '@/types/resolver';

// Component resolver definition
const componentResolver = {
  div: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => <div {...props}>{children}</div>,
  ...viewerResolver,
};

// Separate child component that uses Frame
const EditorContent = ({ data }: any) => {
  return (
    <Frame data={data}>
      {/* Craft.js will automatically render content here */}
    </Frame>
  );
};

export function ContentRenderer() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [content, setContent] = useState(undefined);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/Deserialize');
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        
        const responseData = await response.json();
        
        if (!responseData?.data) {
          throw new Error('Invalid data structure received from API');
        }

        // The data is already a JSON string, so we just need to parse it once
        const parsedContent = JSON.parse(responseData.data);
        
        console.log('Parsed content:', parsedContent);
        setContent(parsedContent);
      } catch (err) {
        console.error('Error loading content:', err);
        if (err instanceof Error) {
          setError(err.message || 'An unknown error occurred');
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!content) return <div className="p-4 text-gray-500">No content available</div>;

  return (
    <Editor
      enabled={false}
      resolver={componentResolver}
      onRender={({ render }) => render}
    >
      <EditorContent data={content} />
    </Editor>
  );
}

export default ContentRenderer;
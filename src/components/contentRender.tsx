'use client'

import { useEffect, useState } from 'react'
import { Editor, Frame } from '@craftjs/core'
import { viewerResolver } from '@/types/resolver'
import { Loader2 } from 'lucide-react' // Import a loader for a better UX

const componentResolver = {
  div: ({
    children,
    ...props
  }: {
    children: React.ReactNode
    [key: string]: any
  }) => <div {...props}>{children}</div>,
  ...viewerResolver,
}

// Wrap the Frame in a container that fills the available height
const EditorContent = ({ data }: any) => {
  return (
    <div className="h-full w-full">
      <Frame data={data} />
    </div>
  )
}

// --- UPDATED PROPS INTERFACE ---
interface ContentRendererProps {
  id: string; // Still needed for context and as a key
  onContentLoaded?: () => void;
  offlineData?: string; // NEW: An optional prop to pass pre-fetched offline data
}

export function ContentRenderer({ id, onContentLoaded, offlineData }: ContentRendererProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [content, setContent] = useState<object | undefined>(undefined) // Type content as an object

  useEffect(() => {
    // This effect now handles both online and offline data loading.
    // It re-runs whenever the `id` or the `offlineData` prop changes.

    const loadContent = async () => {
      // Reset state for any new operation
      setLoading(true)
      setError('')
      setContent(undefined)
      
      // --- OFFLINE PATH ---
      // 1. Prioritize using offlineData if it's provided.
      if (offlineData) {
        console.log(`[ContentRenderer] Offline data detected for id: "${id}". Parsing now.`);
        try {
          const parsedContent = JSON.parse(offlineData);
          setContent(parsedContent);
        } catch (err) {
          console.error("Failed to parse offline content JSON:", err);
          setError("The offline data for this content is corrupted.");
        } finally {
          setLoading(false);
        }
        return; // IMPORTANT: Exit the function to prevent the online fetch.
      }

      // --- ONLINE PATH ---
      // 2. If no offlineData, proceed with the online fetch logic.
      // Guard clause: If there's no valid ID for an online fetch, stop.
      if (!id) {
        setLoading(false);
        setError('No content ID provided for online fetching.');
        return;
      }
      
      console.log(`[ContentRenderer] No offline data. Fetching online content for id: "${id}"`);
      try {
        const response = await fetch(`/api/deserialize?id=${id}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch content (status: ${response.status})`);
        }

        const responseData = await response.json();
        if (!responseData?.data) {
          throw new Error('Invalid data structure received from server.');
        }

        const parsedContent = JSON.parse(responseData.data);
        setContent(parsedContent);

      } catch (err) {
        console.error('Error loading online content:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [id, offlineData]); // The effect depends on both id and offlineData

  // This effect signals the parent component that content is ready to be interacted with.
  // It works for both online and offline paths because it depends on the internal 'loading' and 'content' state.
  useEffect(() => {
    if (!loading && content && onContentLoaded) {
      const timer = setTimeout(() => {
        onContentLoaded();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, content, onContentLoaded]);


  // --- RENDER LOGIC ---

  if (loading) {
    return (
        <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-4 text-center text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold">Error Loading Content</h4>
            <p className="text-sm">{error}</p>
        </div>
    );
  }
  
  if (!content) {
    return (
        <div className="p-4 text-center text-gray-500">
            Content is not available.
        </div>
    );
  }

  return (
    <div id="content" className="h-full w-full">
      <Editor
        enabled={false}
        resolver={componentResolver}
        onRender={({ render }) => render}
      >
        <EditorContent data={content} />
      </Editor>
    </div>
  );
}

export default ContentRenderer;

"use client";

import React, { useEffect, useCallback, useRef, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Editor, Frame, Element, useEditor, SerializedNodes } from "@craftjs/core";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { RenderCanvas } from "@/components/editor-components/RenderCanvas";
import { Navbar } from "@/components/navigation/Navbar";
import { Toolbar } from "@/components/Toolbar";
import { RightSidebar } from "@/components/studio/RightSidebar";
import { StudioTreeSidebar } from "@/components/navigation/StudioTreeSidebar";
import { useRouter } from "next/navigation";
import { editorResolver } from "@/types/resolver";
import { RootState, AppDispatch } from "@/app/store/store";
import { toggleTreeSidebar } from "@/app/store/slices/editorSlice";
import { FontProvider } from "@/contexts/FontProvider";
import { Loader2, ServerCrash } from "lucide-react";

// --- API Interfaces ---
interface ContentItem {
  _id: string;
  title: string;
  data?: SerializedNodes | object; // Can be the full state or just nodes
  thumbnail: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
}
interface ContentApiResponse {
  success: boolean;
  data?: ContentItem;
  message?: string;
}

// --- Component Props ---
interface StudioComponentProps {
  contentId: string;
}

// --- Debounce Hook ---
function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  return useCallback((...args: any[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
}

// --- Memoized Canvas ---
const MemoizedCanvas = memo(({ children }: { children?: React.ReactNode }) => (
  <Frame><Element is={RenderCanvas} canvas>{children}</Element></Frame>
));
MemoizedCanvas.displayName = 'MemoizedCanvas';

// --- React Query API Functions using Axios ---
const fetchContent = async (contentId: string): Promise<ContentApiResponse> => {
  try {
    const { data } = await axios.get<ContentApiResponse>(`/api/content/${contentId}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch content');
    }
    throw new Error('An unexpected error occurred');
  }
};

const updateContent = async ({ contentId, data }: { contentId: string; data: SerializedNodes }): Promise<ContentApiResponse> => {
  try {
    const response = await axios.put<ContentApiResponse>(`/api/content/${contentId}`, { data });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update content');
    }
    throw new Error('An unexpected error occurred');
  }
};

// --- Main Editor Logic Component ---
function EditorCore({ contentId }: StudioComponentProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isTreeSidebarOpen = useSelector((state: RootState) => state.editor.isTreeSidebarOpen);
  const deserializedRef = useRef(false);
  const queryClient = useQueryClient();

  const { data: contentResponse, isLoading, isError, error } = useQuery<ContentApiResponse, Error>({
    queryKey: ['content', contentId],
    queryFn: () => fetchContent(contentId),
    enabled: !!contentId,
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: updateContent,
    onSuccess: (updatedData) => {
      // Optimistically update the cache with the server's response
      queryClient.setQueryData(['content', contentId], updatedData);
      console.log("Save successful.");
    },
    onError: (err) => {
      console.error("Error saving content:", err.message);
      // TODO: Implement user-facing error notification (e.g., a toast)
    },
  });

  const saveContent = (dataObject: SerializedNodes) => {
    if (!contentId || updateMutation.isPending) return;
    updateMutation.mutate({ contentId, data: dataObject });
  };

  const debouncedSave = useDebounce(saveContent, 2000);

  const handleContentSelect = (id: string) => {
    router.push(`/studio/${id}`);
  };

  const handleTreeSidebarClose = () => {
    dispatch(toggleTreeSidebar());
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /> <span className="ml-4 text-lg">Loading Editor...</span></div>;
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-destructive p-4 text-center">
        <ServerCrash className="h-16 w-16 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Error Loading Content</h2>
        <p className="max-w-md">{error.message}</p>
      </div>
    );
  }

  const initialContentData = contentResponse?.success ? contentResponse.data?.data : null;

  return (
    <FontProvider>
      <Editor
        key={contentId} // Ensures editor re-mounts when contentId changes
        resolver={{ ...editorResolver }}
      >
        <EditorInitializer
          initialContent={initialContentData}
          deserializedRef={deserializedRef}
        />
        <EditorAutoSaveHandler
          debouncedSave={debouncedSave}
          deserializedRef={deserializedRef}
        />

        <div className="flex h-screen flex-col bg-background">
          <Navbar contentId={contentId} />
          <div className="flex flex-1 overflow-hidden">
            <StudioTreeSidebar
              isOpen={isTreeSidebarOpen}
              onClose={handleTreeSidebarClose}
              onContentSelect={handleContentSelect}
            />
            <main className="flex-1 relative flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
                <MemoizedCanvas />
              </div>
              <Toolbar />
            </main>
            <RightSidebar />
          </div>
        </div>
      </Editor>
    </FontProvider>
  );
}

// --- Helper Components for Editor ---

// *** THIS IS THE CORE FIX ***
// This helper function strips out non-node properties from the full editor state
// so that `deserialize` only receives what it expects.
const extractNodesFromState = (state: any): SerializedNodes => {
  if (!state || typeof state !== 'object') {
    return {};
  }
  const internalKeys = new Set(['connectors', 'actions', 'query', 'store', 'inContext', 'history']);
  const nodes: SerializedNodes = {};
  for (const key in state) {
    if (!internalKeys.has(key)) {
      nodes[key] = state[key];
    }
  }
  return nodes;
};

function EditorInitializer({ initialContent, deserializedRef }: {
  initialContent: any | null;
  deserializedRef: React.RefObject<boolean>;
}) {
  const { actions } = useEditor();

  useEffect(() => {
    if (initialContent && typeof initialContent === 'object' && !deserializedRef.current) {
      // --- FIX: Extract only the nodes from the full state object before deserializing ---
      const nodesOnly = extractNodesFromState(initialContent);

      // Ensure there's actually something to deserialize
      if (Object.keys(nodesOnly).length > 0) {
        actions.deserialize(nodesOnly);
        deserializedRef.current = true;
      }
    }
  }, [initialContent, actions, deserializedRef]);

  return null;
}

function EditorAutoSaveHandler({ debouncedSave, deserializedRef }: {
  debouncedSave: (data: SerializedNodes) => void,
  deserializedRef: React.RefObject<boolean>
}) {
  const nodes = useEditor((state, query) => query.getSerializedNodes());
  const { enabled } = useEditor(state => ({ enabled: state.options.enabled }));

  // Use a ref to store the previous state as a string for comparison
  const prevNodesJson = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !deserializedRef.current) {
      return;
    }

    const currentNodesJson = JSON.stringify(nodes);

    // Only save if the nodes have actually changed
    if (currentNodesJson !== prevNodesJson.current) {
      debouncedSave(nodes);
      prevNodesJson.current = currentNodesJson; // Update the ref to the new state
    }
  }, [nodes, enabled, debouncedSave, deserializedRef]);

  return null;
}

// --- Main Exported Component with QueryClientProvider ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed queries once
    },
  },
});

export function StudioComponent({ contentId }: StudioComponentProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <EditorCore contentId={contentId} />
    </QueryClientProvider>
  );
}

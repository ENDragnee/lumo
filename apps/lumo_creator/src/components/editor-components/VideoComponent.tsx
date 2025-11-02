
// components/editor-compoents/VideoComponent.tsx
"use client"
import React from "react";
import { useNode, useEditor, Node } from "@craftjs/core";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { VideoSettings } from "@/components/editor-components/settings/VideoSettings"; // Settings component (created below)
import { StackResizableWrapper } from '@/components/StackResizableWrapper';

// Props Interface
export interface VideoComponentProps {
  src: string;
  width?: string | number;
  height?: string | number; // Stored, but often derived from width+aspectRatio
  aspectRatio?: string;
  padding?: string | number;
}

// Craftable Component Interface
interface CraftableVideoComponent extends React.FC<VideoComponentProps> {
  craft?: {
    displayName: string;
    props: Partial<VideoComponentProps>;
    related?: {
      settings: React.ComponentType<any>;
    };
    rules?: {
      canDrag?: (node: Node) => boolean;
    };
  };
}

export const VideoComponent: CraftableVideoComponent = ({
  src = "",
  aspectRatio = "16/9",
  padding = "0px",
  // width/height props are read by useNode/StackResizableWrapper
}) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode((node) => ({
    id: node.id,
  }));

   const { selected, actions: editorActions, enabled: editorEnabled } = useEditor((state, query) => ({
      selected: query.getEvent('selected').contains(id),
      enabled: state.options.enabled,
  }));

  // Helper functions (assuming these are correct from previous step)
  const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      editorActions.delete(id);
  };
  const isLikelyExternal = (url: string) => typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
  const getEmbedUrl = (url: string): string | null => {
      if (!url || typeof url !== 'string') return null;
      try {
          // Youtube
          if (url.includes('youtube.com/watch')) {
              const videoId = new URL(url).searchParams.get('v');
              if (videoId) return `https://www.youtube.com/embed/${videoId}`;
          }
          if (url.includes('youtu.be/')) {
              const videoId = url.split('/').pop()?.split('?')[0]; // Handle query params after ID
              if (videoId) return `https://www.youtube.com/embed/${videoId}`;
          }
          // Vimeo
          if (url.includes('vimeo.com/')) {
               const videoId = url.split('/').pop()?.split('?')[0];
              if (videoId && /^\d+$/.test(videoId)) { // Check if ID is numeric for Vimeo
                  return `https://player.vimeo.com/video/${videoId}`;
              }
          }
          // Already an embed URL
          if (url.includes('/embed/') || url.includes('/player/')) {
              return url;
          }
      } catch (e) { console.error("Error parsing video URL:", e); }
      // Fallback for direct video files or other embeddable URLs if needed
      return isLikelyExternal(url) ? url : null; // Only return likely external URLs or null
  };

  const embedUrl = getEmbedUrl(src);
  const canBeEmbedded = !!embedUrl; // Simplified check based on successful URL generation

  // Styles
  const rootStyle: React.CSSProperties = {
      position: 'relative',
  };

  const contentStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      padding: typeof padding === 'number' ? `${padding}px` : padding,
      backgroundColor: !(src && canBeEmbedded) ? '#e0e0e0' : undefined,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
  };

  const mediaStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block',
  };

  return (
    <div ref={(ref) => { if (ref) connect(drag(ref)); }} style={rootStyle}
         className={`relative ${editorEnabled ? 'cursor-grab' : 'cursor-default'}`}
         title={editorEnabled ? "Drag to reorder" : ""}
    >
      <StackResizableWrapper
          nodeId={id}
          enableWidthResize={true}
          enableHeightResize={!aspectRatio} // Only allow height resize if no aspect ratio
          aspectRatio={aspectRatio || null}
          minWidth={100}
          minHeight={50} // Min height constraint
      >
         {/* Div takes 100% of wrapper */}
         <div style={contentStyle} className="rounded">
            {/* Conditional rendering based on valid src */}
            {src && canBeEmbedded && embedUrl?.includes('youtube.com') && (
              <iframe
                src={embedUrl} style={mediaStyle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen title="YouTube video player"
                className={editorEnabled && !selected ? "pointer-events-none" : ""}
              />
            )}
            {src && canBeEmbedded && embedUrl?.includes('vimeo.com') && (
              <iframe
                src={embedUrl} style={mediaStyle}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen title="Vimeo video player"
                className={editorEnabled && !selected ? "pointer-events-none" : ""}
              />
            )}
            {/* Add other embed types here if needed */}
            {src && !canBeEmbedded && !isLikelyExternal(src) && ( // Handling for potential local file paths (won't work in prod usually)
                 <video src={src} controls style={mediaStyle} title="Local video player"
                   className={editorEnabled && !selected ? "pointer-events-none" : ""}
                 />
            )}
            {(!src || (src && !canBeEmbedded && isLikelyExternal(src))) && editorEnabled && ( // Show placeholder if no src or invalid external src
              <p className="text-muted-foreground text-sm p-4 text-center">Video: Set YouTube/Vimeo URL</p>
            )}
             {!src && !editorEnabled && ( <div className="w-full h-full"></div> )}

            {/* Delete Button */}
            {selected && editorEnabled && (
              <Button
                variant="destructive" size="icon"
                className="absolute top-1 right-1 z-20 h-5 w-5 opacity-80 hover:opacity-100"
                onMouseDown={(e) => e.stopPropagation()} onClick={handleRemove}
                aria-label="Delete Video Element"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
        </div>
      </StackResizableWrapper>
    </div>
  );
};

VideoComponent.craft = {
  displayName: "Video",
  props: {
    src: "",
    width: "560px",
    height: "315px", // Initial height corresponding to 16:9 at 560px width
    aspectRatio: "16/9",
    padding: "0px",
  } satisfies Partial<VideoComponentProps>,
  related: { settings: VideoSettings },
  rules: { canDrag: () => true },
};

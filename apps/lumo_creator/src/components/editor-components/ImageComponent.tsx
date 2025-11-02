// components/editor-components/ImageComponent.tsx
"use client"

import React from "react"
import { useNode, useEditor, Node } from "@craftjs/core"
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ImageSettings } from "@/components/editor-components/settings/ImageSettings";
import { StackResizableWrapper } from '@/components/StackResizableWrapper';

// Props Interface
export interface ImageProps {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  padding?: string | number;
  // New prop to lock aspect ratio from settings panel
  lockAspectRatio?: boolean;
}

// Craftable Component Interface
interface CraftableImageComponent extends React.FC<ImageProps> {
  craft?: {
    displayName: string;
    props: Partial<ImageProps>;
    related?: {
      settings: React.ComponentType<any>;
    };
    rules?: {
      canDrag?: (node: Node) => boolean;
    };
  };
}

export const ImageComponent: CraftableImageComponent = ({
  src = "/placeholder.png",
  alt = "Image placeholder",
  objectFit = 'contain',
  padding = "0px",
  width,   // Read directly for aspect ratio calculation
  height,  // Read directly for aspect ratio calculation
  lockAspectRatio = false,
}) => {
  const {
    connectors: { connect, drag },
    id,
    actions: { setProp }
  } = useNode((node) => ({
    id: node.id,
    width: node.data.props.width,
    height: node.data.props.height,
  }));

  const { selected, actions: editorActions, enabled: editorEnabled } = useEditor((state, query) => ({
      selected: query.getEvent('selected').contains(id),
      enabled: state.options.enabled,
  }));

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    editorActions.delete(id);
  };
  
  // Calculate aspect ratio from the node's current props if locked
  const calculateAspectRatio = (): string | null => {
    if (!lockAspectRatio || !width || !height) return null;
    const w = parseFloat(String(width));
    const h = parseFloat(String(height));
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      // You can simplify to a raw ratio, but returning as string is safer for the prop
      return `${w}/${h}`; 
    }
    return null;
  }
  const aspectRatio = calculateAspectRatio();

  // Styles
  const rootStyle: React.CSSProperties = {
      position: 'relative',
  };

  const contentStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    padding: typeof padding === 'number' ? `${padding}px` : padding,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  };

  // --- CRITICAL CHANGE HERE ---
  // The style of the <img> tag must change based on the objectFit prop.
  const imageStyle: React.CSSProperties = {
    display: 'block',
    objectFit: objectFit,
    // When 'cover' or 'fill', the image MUST expand to the container's bounds.
    // Otherwise, it should scale naturally within the container.
    ...(objectFit === 'cover' || objectFit === 'fill'
      ? { width: '100%', height: '100%' }
      : { width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }
    ),
  };

  return (
    <div ref={(ref) => { if (ref) connect(drag(ref)); }} style={rootStyle}
         className={`relative ${editorEnabled ? 'cursor-grab' : 'cursor-default'}`}
         title={editorEnabled ? "Drag to reorder" : ""}
    >
      <StackResizableWrapper
          nodeId={id}
          enableWidthResize={true}
          enableHeightResize={true}
          aspectRatio={aspectRatio} // Pass the calculated aspect ratio
          minWidth={50}
          minHeight={50}
      >
        <div style={contentStyle} className="rounded">
            <img
              src={src || "/placeholder.svg"}
              alt={alt}
              style={imageStyle}
              draggable={false}
              // Set the initial dimensions of the image itself when it loads
              // This helps the resizer determine an initial aspect ratio if needed
              onLoad={(e) => {
                  if (lockAspectRatio && (!width || !height)) {
                      const img = e.currentTarget;
                      // Set initial props based on image's natural dimensions
                      setProp((props: ImageProps) => {
                          props.width = `${img.naturalWidth}px`;
                          props.height = `${img.naturalHeight}px`;
                      });
                  }
              }}
            />
            {selected && editorEnabled && (
                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 z-20 h-5 w-5 opacity-80 hover:opacity-100"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={handleRemove}
                    aria-label="Delete Image Element"
                >
                <Trash2 size={16} /> 
                </Button>
            )}
        </div>
      </StackResizableWrapper>
    </div>
  )
}

ImageComponent.craft = {
  displayName: "Image",
  props: {
    src: "/placeholder.svg",
    alt: "Placeholder Image",
    width: "300px",
    height: "200px",
    objectFit: 'cover', // Default to cover, a more common use case
    padding: "0px",
    lockAspectRatio: false, // Add new prop to defaults
  } satisfies Partial<ImageProps>,
  related: {
      settings: ImageSettings,
  },
  rules: {
    canDrag: () => true,
  },
};


// components/editor-components/SimulationComponent.tsx
"use client"
import React from "react";
import { useNode, useEditor, Node } from "@craftjs/core";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationSettings } from "@/components/editor-components/settings/SimulationSettings"; // Settings component (created below)
import { StackResizableWrapper } from '@/components/StackResizableWrapper';

// Props Interface
export interface SimulationProps {
  src: string;
  width?: string | number;
  height?: string | number; // Stored, used by wrapper
  aspectRatio?: string;
  padding?: string | number;
}

// Craftable Component Interface
interface CraftableSimulationComponent extends React.FC<SimulationProps> {
   craft?: {
    displayName: string;
    props: Partial<SimulationProps>;
    related?: {
      settings: React.ComponentType<any>;
    };
    rules?: {
      canDrag?: (node: Node) => boolean;
    };
  };
}

export const SimulationComponent: CraftableSimulationComponent = ({
  src = "",
  aspectRatio = "4/3", // Default aspect ratio for simulations?
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

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    editorActions.delete(id);
  };

  // Styles
   const rootStyle: React.CSSProperties = {
      position: 'relative',
   };

   const contentStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      padding: typeof padding === 'number' ? `${padding}px` : padding,
      backgroundColor: !src ? '#e0e0e0' : undefined, // Placeholder background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden', // Important for iframe
      position: 'relative', // For absolute positioning iframe
   };

  const iframeStyle: React.CSSProperties = {
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
          minHeight={75}
      >
         {/* Div takes 100% of wrapper */}
         <div style={contentStyle} className="rounded">
            {src ? (
                <iframe
                  src={src} style={iframeStyle}
                  title="Simulation Content" // Essential for accessibility
                  // Consider adding sandbox attributes if simulation requires specific permissions
                  // sandbox="allow-scripts allow-same-origin allow-forms"
                  className={editorEnabled && !selected ? "pointer-events-none" : ""}
                />
              ) : (
                 // Show placeholder only in editor mode when no src is set
                 editorEnabled && <p className="text-muted-foreground text-sm p-4 text-center">Simulation: Set Source URL</p>
              )
            }
            {/* Render empty div with correct size in view mode if no src */}
            {!src && !editorEnabled && ( <div className="w-full h-full"></div> )}

            {/* Delete Button */}
            {selected && editorEnabled && (
              <Button
                variant="destructive" size="icon"
                className="absolute top-1 right-1 z-20 h-5 w-5 opacity-80 hover:opacity-100"
                onMouseDown={(e) => e.stopPropagation()} onClick={handleRemove}
                aria-label="Delete Simulation Element"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
         </div>
      </StackResizableWrapper>
    </div>
  );
};

SimulationComponent.craft = {
  displayName: "Simulation",
  props: {
    src: "",
    width: "400px", // Default width
    height: "300px", // Default height (corresponding to 4:3 at 400px width)
    aspectRatio: "4/3",
    padding: "0px",
  } satisfies Partial<SimulationProps>,
  related: { settings: SimulationSettings },
  rules: { canDrag: () => true },
};

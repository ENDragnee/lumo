// components/canvas.tsx
"use client"

import React from "react"
import { useNode } from "@craftjs/core"

interface CanvasComponent extends React.FC<{ children?: React.ReactNode; gap?: number; padding?: number }> {
  craft: {
    props: {
        gap: number; // Add gap prop for spacing between elements
    };
    displayName: string; // Ensure displayName is part of craft type if needed
    rules: {
      canMoveIn: () => boolean;
    };
  };
}

// Default props for the canvas itself
const defaultCanvasProps = {
    gap: 8, // Default gap in pixels (adjust as needed, corresponds to tailwind gap-2)
    padding: 16, // Default padding in pixels (adjust as needed, corresponds to tailwind p-4)
    // backgroundColor: '#ffffff', // Example default background
};


export const RenderCanvas: CanvasComponent = ({ children, gap = defaultCanvasProps.gap, padding = defaultCanvasProps.padding }) => {
  const {
    connectors: { connect /*Removed drag connector from canvas itself*/ }, // Usually, you don't drag the canvas root itself
    hasChildren // Check if there are child nodes
  } = useNode((node) => ({
      hasChildren: node.data.nodes && node.data.nodes.length > 0,
  }));

  const gapClass = `gap-${Math.round(gap / 4)}`;       // Approximation: gap-2 for 8px

  return (
    <div
      ref={(ref) => { if (ref) connect(ref); }} // Use a callback ref to handle the connect function
      className="relative w-full min-h-[200px] h-svh overflow-x-hidden"
    >
      {/* Inner container: Stacks elements, grows with content, applies padding/gap */}
      <div
        className={`relative mx-2 items-center my-8 max-w-full flex flex-col ${gapClass} rounded-lg bg-white dark:bg-slate-700 shadow-md items-center`}
        style={{
          padding: `${padding}px`, // Use inline style for precise padding
          minHeight: '100px',
          height: 'auto',
        }}
      >
        {children}
        {!hasChildren && (
          <div className="absolute inset-0 flex justify-center pointer-events-none border-2 border-dashed border-gray-400 rounded-lg dark:bg-slate-700">
            <p className="text-sm text-center text-muted-foreground p-4">
              Drag and drop elements here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

RenderCanvas.displayName = "RenderCanvas";

RenderCanvas.craft = {
  props: defaultCanvasProps,
  displayName: "Render Canvas", // Name shown in Layers panel
  rules: {
    canMoveIn: () => true, // Can drop elements into the canvas
  },
};

"use client";

import React, { useCallback }from 'react';
import { useEditor, useNode, Node as CraftNode } from '@craftjs/core';
import { ContainerSettings } from './settings/ContainerSettings';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

// --- Props Interface ---
export interface ContainerProps {
  layout: 'vertical' | 'stack' | 'grid';
  gap?: number;
  padding?: number;
  backgroundColor?: string;
  borderRadius?: number;
  gridColumns?: number;
  children?: React.ReactNode;
}

// --- Craftable Component Definition ---
interface CraftableComponent extends React.FC<ContainerProps> {
    craft?: {
      displayName: string;
      props: Partial<ContainerProps>;
      related?: {
        settings: React.ComponentType<any>;
      };
      rules?: {
        canDrag?: (node: CraftNode) => boolean;
      };
      isCanvas?: boolean;
    };
}

export const ContainerComponent: CraftableComponent = ({
  layout = 'vertical',
  gap = 8,
  padding = 16,
  backgroundColor = 'transparent',
  borderRadius = 8,
  gridColumns = 2,
  children
}) => {
  const { connectors: { connect, drag }, selected ,actions: { setProp },id} = useNode((node) => ({
    selected: node.events.selected,
  }) );

  const { actions: editorActions, enabled: editorEnabled } = useEditor(state => ({ enabled: state.options.enabled }));

  const containerStyle: React.CSSProperties = {
    display: layout === 'grid' ? 'grid' : 'flex',
    flexDirection: layout === 'vertical' ? 'column' : 'row',
    gap: `${gap}px`,
    padding: `${padding}px`,
    backgroundColor,
    borderRadius: `${borderRadius}px`,
    gridTemplateColumns: layout === 'grid' ? `repeat(${gridColumns}, 1fr)` : undefined,
  };
  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    editorActions.delete(id);
  }, [editorActions, id]);

  const hasChildren = React.Children.count(children) > 0;

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if(ref){
          connect(drag(ref))
        }
      }}
      style={containerStyle}
      className={cn(
        "min-h-[100px] w-full", // Ensure the container has a minimum size
        !hasChildren && editorEnabled && "border-2 border-dashed border-blue-300",
        "transition-all duration-150"
      )}
    >
      {hasChildren ? children : (
        // Placeholder when the container is empty in the editor
        editorEnabled && (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-muted-foreground text-sm">Drag components or layouts here</p>
          </div>
        )
      )}
      {
        selected && editorEnabled && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-0 right-0 z-10 -mt-3 -mr-3 h-6 w-6 opacity-80 hover:opacity-100"
            onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}
            onClick={handleRemove}
            aria-label="Delete Text Element"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        ) 
      }
    </div>
  );
};

ContainerComponent.craft = {
  displayName: "Container",
  isCanvas: true, // This makes it a drop-zone for other components
  props: {
    layout: 'vertical',
    gap: 8,
    padding: 16,
    backgroundColor: 'transparent',
    borderRadius: 8,
    gridColumns: 2,
  },
  related: {
    settings: ContainerSettings,
  },
};

// @/components/editor-components/CarouselSlideComponent.tsx
"use client";

import React, { useCallback } from 'react';
import { useEditor, useNode, UserComponent } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { CarouselSlideSettings } from './settings/CarouselSlideSettings';
import { Rows3 } from 'lucide-react';

export interface CarouselSlideProps {
  padding?: number;
  children?: React.ReactNode;
}

type CraftableCarouselSlideComponent = UserComponent<CarouselSlideProps>;

export const CarouselSlideComponent: CraftableCarouselSlideComponent = ({
  padding = 24,
  children
}) => {
  const { connectors: { connect }, id, parentId } = useNode(node => ({
    parentId: node.data.parent,
    id: node.id,
  }));
  
  // --- FIX: Correctly destructure `actions` from useEditor ---
  const { actions: editorActions, selected, enabled: editorEnabled } = useEditor((state, query) => ({
    selected: query.getEvent('selected').contains(id),
    enabled: state.options.enabled,
  }));

  const hasChildren = useNode(node => node.data.nodes.length > 0);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!editorEnabled) return;
    if (e.target === e.currentTarget && parentId) {
      e.preventDefault();
      e.stopPropagation();
      editorActions.selectNode(parentId);
    }
  }, [editorEnabled, parentId, editorActions]);

  return (
    // --- FIX: Use correct ref callback pattern for Craft.js connectors ---
    <div
      ref={(ref) => { if (ref) connect(ref); }}
      className="relative flex-[0_0_100%] min-w-0"
      title="Carousel Slide (Click background to select parent)"
    >
      <div 
        style={{ padding: `${padding}px` }}
        className={cn(
            "m-1 min-h-[250px] w-full flex flex-col items-center justify-center bg-background rounded-md transition-all",
            !hasChildren && editorEnabled && "border-2 border-dashed border-muted-foreground/30",
            selected && editorEnabled && "ring-2 ring-offset-2 ring-offset-background ring-green-500"
        )}
        onClick={handleClick}
      >
        {hasChildren ? children : (
            <div className="text-center text-muted-foreground pointer-events-none flex flex-col items-center gap-4">
                <div className="p-4 bg-muted/70 rounded-full">
                    <Rows3 className="h-10 w-10" />
                </div>
                <div>
                    <h4 className="font-semibold text-lg">Drop Components Here</h4>
                    <p className="text-sm">This is an empty slide. Drag elements from the toolbar to build it.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

CarouselSlideComponent.craft = {
  displayName: "Carousel Slide",
  isCanvas: true,
  props: { padding: 24 },
  related: { settings: CarouselSlideSettings },
  rules: {
    canMoveIn: (incoming, _self, query) => {
      const forbidden = ['CarouselComponent', 'CarouselSlideComponent'];
      return incoming.every(node => !forbidden.includes(query(node.id).get().data.displayName));
    }
  }
};

"use client";

import React, { useCallback } from 'react';
// Import QueryMethods as a value, because we need 'typeof'
import { useEditor, useNode, Node as CraftNode, QueryMethods } from '@craftjs/core';
import { TabPanelSettings } from './settings/TabPanelSettings';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

// --- Props Interface ---
export interface TabPanelProps {
  title: string;
  isClosable?: boolean;
  padding?: number;
  children?: React.ReactNode;
}

// --- Craftable Component Definition ---
interface CraftableTabPanelComponent extends React.FC<TabPanelProps> {
    craft?: {
      displayName: string;
      props: Partial<TabPanelProps>;
      related?: {
        settings: React.ComponentType<any>;
      };
      rules?: {
        canDrag?: (node: CraftNode) => boolean;
        // FIX: The correct type is the ReturnType of the QueryMethods function
        canMoveIn?: (incoming: CraftNode[], self: CraftNode, query: ReturnType<typeof QueryMethods>) => boolean;
      };
      isCanvas?: boolean;
    };
}

export const TabPanelComponent: CraftableTabPanelComponent = ({
  title = "New Tab",
  padding = 16,
  children
}) => {
  const { connectors: { connect, drag }, selected, id } = useNode((node) => ({
    selected: node.events.selected,
  }));
  
  const { actions: editorActions, enabled: editorEnabled } = useEditor(state => ({ enabled: state.options.enabled }));
  
  const hasChildren = React.Children.count(children) > 0;

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    editorActions.delete(id);
  }, [editorActions, id]);

  const panelStyle: React.CSSProperties = {
    padding: `${padding}px`
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
            connect(drag(ref));
        }
      }}
      style={panelStyle}
      className={cn(
        "min-h-[100px] w-full",
        !hasChildren && editorEnabled && "border-2 border-dashed border-blue-300",
        "transition-all duration-150"
      )}
    >
      {hasChildren ? children : (
        editorEnabled && (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-muted-foreground text-sm">Drag components into this tab panel</p>
          </div>
        )
      )}
      {selected && editorEnabled && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-0 right-0 z-10 -mt-3 -mr-3 h-6 w-6 opacity-80 hover:opacity-100"
          onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
          onClick={handleRemove}
          aria-label="Delete Tab Panel"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

TabPanelComponent.craft = {
  displayName: "Tab Panel",
  isCanvas: true,
  props: {
    title: "New Tab",
    isClosable: false,
    padding: 16,
  },
  related: {
    settings: TabPanelSettings,
  },
  rules: {
    // FIX: The correct type is the ReturnType of the QueryMethods function
    canMoveIn: (incoming: CraftNode[], self: CraftNode, query: ReturnType<typeof QueryMethods>) => {
      return incoming.every((node: CraftNode) => {
          const incomingNodeType = query.node(node.id).get().data.type;
          if (typeof incomingNodeType === 'string') {
            return true;
          }
          return (incomingNodeType as any).craft?.displayName !== 'Tab Panel';
      });
    }
  },
};
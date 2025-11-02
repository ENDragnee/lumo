"use client";

import React, { useState, useCallback } from 'react';
// Import QueryMethods as a value, because we need 'typeof'
import { useEditor, useNode, Node as CraftNode, QueryMethods } from '@craftjs/core';
import { TabsSettings } from './settings/TabsSettings';
import { TabPanelComponent } from './TabPanelComponent';
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import { cn } from '@/lib/utils';

// --- Props Interface ---
export interface TabsProps {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children?: React.ReactNode;
}

// --- Craftable Component Definition ---
interface CraftableTabsComponent extends React.FC<TabsProps> {
    craft?: {
      displayName: string;
      props: Partial<TabsProps>;
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

export const TabsComponent: CraftableTabsComponent = ({
  placement = 'top',
  children
}) => {
  const {
    connectors: { connect, drag },
    id: selfId,
    children: childNodes,
  } = useNode(node => ({ children: node.data.nodes }));
  
  const { actions: editorActions, query, enabled: editorEnabled } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    query: query
  }));

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  if (activeTabIndex >= React.Children.count(children)) {
    if (activeTabIndex > 0) setActiveTabIndex(0);
  }

  const handleRemoveSelf = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    editorActions.delete(selfId);
  }, [editorActions, selfId]);

  const handleCloseTab = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    editorActions.delete(nodeId);
  }

  const isVertical = placement === 'left' || placement === 'right';

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
            connect(drag(ref));
        }
      }}
      className={cn(
        "flex w-full min-h-[200px] bg-muted/20 p-2 rounded-lg gap-4",
        isVertical ? 'flex-row' : 'flex-col'
      )}
    >
      <div className={cn(
        "flex-shrink-0 flex gap-1 p-1 bg-muted/50 rounded-md",
        isVertical ? 'flex-col' : 'flex-row',
        placement === 'bottom' && 'order-last',
        placement === 'right' && 'order-last',
      )}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          
          const childNodeId = childNodes[index];
          if (!childNodeId) return null;
          
          const childProps = query.node(childNodeId).get().data.props;

          return (
            <div 
              key={childNodeId}
              onClick={() => setActiveTabIndex(index)}
              className={cn(
                "relative flex items-center gap-2 text-sm px-4 py-2 rounded-md cursor-pointer transition-colors",
                activeTabIndex === index 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-background/50"
              )}
            >
              {childProps.title || `Tab ${index + 1}`}
              {childProps.isClosable && (
                <button 
                  onClick={(e) => handleCloseTab(e, childNodeId)} 
                  className="ml-2 p-0.5 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                  disabled={!editorEnabled}
                  title={editorEnabled ? "Close Tab" : ""}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )
        })}
        {React.Children.count(children) === 0 && editorEnabled && (
            <p className="text-xs text-muted-foreground p-4 text-center">Add a new tab from the settings panel.</p>
        )}
      </div>
      <div className="flex-grow bg-background rounded-lg border">
        {React.Children.toArray(children)[activeTabIndex]}
      </div>
    </div>
  );
};

TabsComponent.craft = {
  displayName: "Tabs",
  isCanvas: true,
  props: {
    placement: 'top',
  },
  related: {
    settings: TabsSettings,
  },
  rules: {
    // FIX: The correct type is the ReturnType of the QueryMethods function
    canMoveIn: (incoming: CraftNode[], self: CraftNode, query: ReturnType<typeof QueryMethods>) => {
      return incoming.every((node: CraftNode) => query.node(node.id).get().data.type === TabPanelComponent)
    }
  }
};
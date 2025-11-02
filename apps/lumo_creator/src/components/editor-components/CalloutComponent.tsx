"use client";

import React from 'react';
import { useEditor, useNode, UserComponent } from '@craftjs/core';
import { CalloutSettings } from './settings/CalloutSettings';
import { Button as UiButton } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from '@/lib/utils';

// --- Props Interface ---
export interface CalloutProps {
  accentColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  borderWidth?: number;
  children?: React.ReactNode;
}

// --- Craftable Component Definition ---
type CraftableCalloutComponent = UserComponent<CalloutProps>;

export const CalloutComponent: CraftableCalloutComponent = ({
  accentColor = "#ff6b6b", // Default to a reddish color
  backgroundColor = "hsl(var(--muted) / 0.3)",
  borderRadius = 8,
  padding = 24,
  borderWidth = 4,
  children,
}) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();
  
  const { selected, actions: editorActions, enabled: editorEnabled } = useEditor((state, query) => ({
    // FIX: This is the corrected logic to check if the callout itself OR any of its children are selected.
    selected: query.getEvent('selected').contains(id) || query.node(id).descendants().some((nodeId: string) => query.getEvent('selected').contains(nodeId)),
    enabled: state.options.enabled,
  }));

  const hasChildren = React.Children.count(children) > 0;

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    borderRadius: `${borderRadius}px`,
    padding: `${padding}px`,
    borderLeftWidth: `${borderWidth}px`,
    borderLeftStyle: 'solid',
    borderLeftColor: accentColor,
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => { if (ref) connect(drag(ref)); }}
      style={containerStyle}
      className={cn("relative w-full")}
    >
      <div className={cn(
        "flex flex-col gap-2", // Add a gap between children like title and body
        !hasChildren && editorEnabled && "min-h-[80px] items-center justify-center border-2 border-dashed border-blue-300",
      )}>
        {hasChildren ? children : (
          editorEnabled && (
            <p className="text-muted-foreground text-sm text-center">
              Drag components here
              <br/>
              (e.g., a Text for the title and another for the body)
            </p>
          )
        )}
      </div>

      {selected && editorEnabled && (
        <UiButton
          variant="destructive"
          size="icon"
          className="absolute top-0 right-0 z-10 -mt-3 -mr-3 h-6 w-6 opacity-80 hover:opacity-100"
          onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
          onClick={() => editorActions.delete(id)}
          aria-label="Delete Callout Box"
        >
          <Trash2 className="h-3 w-3" />
        </UiButton>
      )}
    </div>
  );
};

CalloutComponent.craft = {
  displayName: "Callout Box",
  isCanvas: true,
  props: {
    accentColor: "#ff6b6b",
    backgroundColor: "hsl(var(--muted) / 0.3)",
    borderRadius: 8,
    padding: 24,
    borderWidth: 4,
  },
  related: {
    settings: CalloutSettings,
  },
};
"use client";

import React, { useState } from 'react';
import { useEditor, useNode, UserComponent } from '@craftjs/core';
import { AccordionSettings, iconMap } from './settings/AccordionSettings'; // Import iconMap from settings
import { Button as UiButton } from "@/components/ui/button";
import { Trash2, ChevronDown } from "lucide-react";
import { cn } from '@/lib/utils';

// --- Props Interface ---
export interface AccordionProps {
  title?: string;
  icon?: string; // Icon name as a string
  defaultOpen?: boolean;
  accentColor?: string;
  backgroundColor?: string;
  padding?: number;
  children?: React.ReactNode;
}

// --- Craftable Component Definition ---
type CraftableAccordionComponent = UserComponent<AccordionProps>;

export const AccordionComponent: CraftableAccordionComponent = ({
  title = "Click to expand",
  icon = "FileText",
  defaultOpen = false,
  accentColor = "#4f46e5", // Indigo
  backgroundColor = "hsl(var(--muted) / 0.2)",
  padding = 16,
  children
}) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();
  
  const { selected, actions: editorActions, enabled: editorEnabled } = useEditor((state, query) => ({
    selected: query.getEvent('selected').contains(id) || query.node(id).descendants().some(nodeId => query.getEvent('selected').contains(nodeId)),
    enabled: state.options.enabled,
  }));
  
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasChildren = React.Children.count(children) > 0;
  
  const handleToggle = () => {
    // Only toggle on click in render mode, otherwise editor selection can be tricky
    if (!editorEnabled) {
      setIsOpen(prev => !prev);
    }
  };
  
  // In the editor, if the accordion is selected, always show the content for easy editing.
  const showContent = editorEnabled ? selected : isOpen;
  
  const IconComponent = iconMap[icon] || iconMap.FileText;

  const headerStyle: React.CSSProperties = {
    backgroundColor: backgroundColor,
    padding: `${padding}px`,
  };
  
  const contentStyle: React.CSSProperties = {
    padding: `${padding}px`,
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => { if (ref) connect(drag(ref)); }}
      className="relative w-full border rounded-lg overflow-hidden"
    >
      {/* Accordion Header/Trigger */}
      <div
        style={headerStyle}
        className="flex items-center justify-between cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-3">
          <IconComponent className="h-5 w-5" style={{ color: accentColor }} />
          <span className="font-medium">{title}</span>
        </div>
        <ChevronDown 
          className={cn("h-5 w-5 text-muted-foreground transition-transform", showContent && "rotate-180")} 
        />
      </div>

      {/* Accordion Content */}
      {showContent && (
        <div 
          style={contentStyle}
          className="border-t"
        >
          <div className={cn(
            "flex flex-col gap-2",
            !hasChildren && editorEnabled && "min-h-[80px] items-center justify-center border-2 border-dashed border-blue-300",
          )}>
            {hasChildren ? children : (
              editorEnabled && (
                <p className="text-muted-foreground text-sm text-center">
                  Drag components into this accordion
                </p>
              )
            )}
          </div>
        </div>
      )}

      {selected && editorEnabled && (
        <UiButton
          variant="destructive"
          size="icon"
          className="absolute top-0 right-0 z-10 -mt-3 -mr-3 h-6 w-6 opacity-80 hover:opacity-100"
          onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
          onClick={() => editorActions.delete(id)}
          aria-label="Delete Accordion"
        >
          <Trash2 className="h-3 w-3" />
        </UiButton>
      )}
    </div>
  );
};

AccordionComponent.craft = {
  displayName: "Accordion",
  isCanvas: true,
  props: {
    title: "Section Title",
    icon: "FileText",
    defaultOpen: false,
    accentColor: "#4f46e5",
    backgroundColor: "hsl(var(--muted) / 0.2)",
    padding: 16,
  },
  related: {
    settings: AccordionSettings,
  },
};
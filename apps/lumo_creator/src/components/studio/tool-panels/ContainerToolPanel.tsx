"use client";

import { useEditor } from "@craftjs/core";
import { ContainerComponent, ContainerProps } from "@/components/editor-components/ContainerComponent";
import { Grid, Columns, Rows, Component } from "lucide-react";
import React from "react"; // Import React for React.ElementType

type PresetProps = Partial<ContainerProps> & Required<Pick<ContainerProps, 'layout'>>;

// Use the new PresetProps type in the array definition.
const containerPresets: { name: string, icon: React.ElementType, props: PresetProps }[] = [
  {
    name: "Vertical Stack",
    icon: Rows,
    props: {
      layout: 'vertical',
      padding: 16,
      gap: 16,
    }
  },
  {
    name: "Horizontal Stack",
    icon: Columns,
    props: {
      layout: 'stack',
      padding: 16,
      gap: 16,
    }
  },
  {
    name: "2-Column Grid",
    icon: Grid,
    props: {
      layout: 'grid',
      gridColumns: 2,
      padding: 16,
      gap: 16,
    }
  },
   {
    name: "3-Column Grid",
    icon: Grid,
    props: {
      layout: 'grid',
      gridColumns: 3,
      padding: 16,
      gap: 16,
    }
  },
  {
    name: "Card",
    icon: Component,
    props: {
        layout: 'vertical',
        padding: 24,
        gap: 12,
        borderRadius: 12,
        backgroundColor: "hsl(var(--card))"
    }
  }
];

export function ContainerToolPanel() {
  const { connectors } = useEditor();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-shrink-0 border-b">
        <h2 className="text-lg font-semibold">Layouts</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-3">
        <p className="text-sm text-muted-foreground mb-4">Drag a layout onto the canvas.</p>
        {containerPresets.map((preset) => (
          <div
            key={preset.name}
            // The ref callback remains the same. The error was in the type, not the logic.
            ref={(ref: HTMLDivElement | null) => {
              if(ref){
                // This now passes without error because TypeScript knows preset.props has a layout.
                connectors.create(ref, <ContainerComponent {...preset.props} />)
              }
            }}
            className="cursor-grab p-4 border rounded-lg bg-card hover:bg-muted transition-colors flex items-center gap-4"
          >
            <preset.icon className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold">{preset.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

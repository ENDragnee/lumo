"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import { AccordionComponent, AccordionProps } from "@/components/editor-components/AccordionComponent";
import { TextComponent } from "@/components/editor-components/TextComponent"; // Import TextComponent
import { PanelTopOpen } from "lucide-react";

export function AccordionToolPanel() {
  const { connectors } = useEditor();

  const preset: { name: string; icon: React.ElementType; props: Partial<AccordionProps> } = {
    name: "Accordion Section",
    icon: PanelTopOpen,
    props: {
      title: "New Section",
      icon: "FileText",
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-shrink-0 border-b">
        <h2 className="text-lg font-semibold">Accordion</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-3">
        <p className="text-sm text-muted-foreground mb-4">Drag an accordion onto the canvas.</p>
        <div
          key={preset.name}
          ref={(ref: HTMLDivElement | null) => {
            if (ref) {
              connectors.create(ref, 
                <AccordionComponent {...preset.props}>
                  {/* Pre-populate with a Text component for better UX */}
                  <TextComponent text="This is the content of the accordion. You can drag any components you want in here." />
                </AccordionComponent>
              );
            }
          }}
          className="cursor-grab p-4 border rounded-lg bg-card hover:bg-muted transition-colors flex items-center gap-4"
        >
          <preset.icon className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold">{preset.name}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
// @/components/studio/tool-panels/TextToolPanel.tsx
"use client";

import { useEditor } from "@craftjs/core";
import { TextComponent } from "@/components/editor-components/TextComponent";
import { Type, GripVertical } from "lucide-react";

const textPresets = [
  {
    name: "Title",
    props: { text: "Title Text", fontSize: "36px", fontWeight: "bold", tagName: "h1" },
    style: { fontSize: "24px", fontWeight: "bold" },
  },
  {
    name: "Subtitle",
    props: { text: "Subtitle or heading", fontSize: "24px", fontWeight: "600", tagName: "h2" },
    style: { fontSize: "18px", fontWeight: "600", color: "#666" },
  },
  {
    name: "Body Paragraph",
    props: { text: "This is a standard paragraph.", fontSize: "16px", fontWeight: "normal", tagName: "p" },
    style: { fontSize: "14px", fontWeight: "normal" },
  },
] as const; 

export function TextToolPanel() {
  const { connectors } = useEditor();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-shrink-0 border-b">
        <h2 className="text-lg font-semibold">Text Blocks</h2>
        <p className="text-sm text-muted-foreground">Drag a preset onto the canvas.</p>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-3">
        {textPresets.map((preset) => (
          // The outer div is now the draggable element
          <div
            key={preset.name}
            ref={(ref: HTMLDivElement | null) => {
              if (ref) {
                // Use the 'drag' connector to make the entire element draggable
                connectors.create(ref, <TextComponent {...preset.props} />);
              }
            }}
            className="cursor-grab p-2 border rounded-lg bg-card hover:bg-muted transition-colors flex items-center gap-2"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <Type className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="flex-grow">
              <h3 className="font-semibold text-sm">{preset.name}</h3>
              <p className="text-xs text-muted-foreground truncate" style={preset.style}>
                {preset.props.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

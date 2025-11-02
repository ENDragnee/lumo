"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import { CalloutComponent, CalloutProps } from "@/components/editor-components/CalloutComponent";
import { TextComponent } from "@/components/editor-components/TextComponent"; // Import TextComponent
import { Lightbulb, Info, AlertTriangle, CheckCircle } from "lucide-react";

// Define presets for the Callout component
const calloutPresets: { 
    name: string; 
    icon: React.ElementType; 
    props: CalloutProps;
    title: string;
    body: string;
}[] = [
  {
    name: "Think About It",
    icon: Lightbulb,
    title: "Think About It:",
    body: "This is a thought-provoking point. Users can edit this text to elaborate on a concept or pose a question.",
    props: {
      accentColor: "#f783ac", // A pink/red color
      backgroundColor: "rgba(247, 131, 172, 0.1)",
    }
  },
  {
    name: "Visualize This",
    icon: Info,
    title: "Visualize This:",
    body: "Use this space to provide a helpful analogy or a way to visualize a complex idea. The text inside is fully editable.",
    props: {
      accentColor: "#facc15", // A yellow color
      backgroundColor: "rgba(250, 204, 21, 0.1)",
    }
  },
  {
    name: "Success Tip",
    icon: CheckCircle,
    title: "Success:",
    body: "Highlight a successful outcome, a best practice, or a positive result here.",
    props: {
      accentColor: "#4ade80", // A green color
      backgroundColor: "rgba(74, 222, 128, 0.1)",
    }
  },
   {
    name: "Warning",
    icon: AlertTriangle,
    title: "Warning:",
    body: "Use this to call attention to potential pitfalls, dangers, or important caveats.",
    props: {
      accentColor: "#fb923c", // An orange color
      backgroundColor: "rgba(251, 146, 60, 0.1)",
    }
  },
];

export function CalloutToolPanel() {
  const { connectors } = useEditor();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-shrink-0 border-b">
        <h2 className="text-lg font-semibold">Callout Boxes</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-3">
        <p className="text-sm text-muted-foreground mb-4">Drag a preset onto the canvas.</p>
        {calloutPresets.map((preset) => (
          <div
            key={preset.name}
            ref={(ref: HTMLDivElement | null) => {
              if (ref) {
                // Pre-populate the callout with a title and body text component
                connectors.create(ref, 
                  <CalloutComponent {...preset.props}>
                    <TextComponent 
                      text={preset.title} 
                      fontSize="18px" 
                      fontWeight="600" 
                      color={preset.props.accentColor} 
                    />
                    <TextComponent text={preset.body} />
                  </CalloutComponent>
                );
              }
            }}
            className="cursor-grab p-4 border rounded-lg bg-card hover:bg-muted transition-colors flex items-center gap-4"
          >
            <preset.icon className="h-6 w-6" style={{ color: preset.props.accentColor }} />
            <div>
              <h3 className="font-semibold">{preset.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
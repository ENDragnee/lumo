"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import { FlashcardComponent, FlashcardProps } from "@/components/editor-components/FlashcardComponent";
import { HelpCircle } from "lucide-react";

const flashcardPresets: { name: string; icon: React.ElementType; props: Partial<FlashcardProps> }[] = [
  {
    name: "Question Card",
    icon: HelpCircle,
    props: {
      titleText: "New Question",
      questionText: "What is the capital of France?",
      answerText: "Paris.",
      buttonText: "Show Answer",
      buttonVariant: 'outline',
    }
  },
  {
    name: "Chemistry Check",
    icon: HelpCircle,
    props: {
      titleText: "Chemistry Check",
      questionText: "What is the chemical formula for water?",
      answerText: "H₂O",
      buttonText: "Reveal Formula",
      buttonVariant: 'default',
    }
  },
];

export function FlashcardToolPanel() {
  const { connectors } = useEditor();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-shrink-0 border-b">
        <h2 className="text-lg font-semibold">Flashcards</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-3">
        <p className="text-sm text-muted-foreground mb-4">Drag a flashcard onto the canvas.</p>
        {flashcardPresets.map((preset) => (
          <div
            key={preset.name}
            ref={(ref: HTMLDivElement | null) => {
              if (ref) {
                connectors.create(ref, <FlashcardComponent {...preset.props} />);
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
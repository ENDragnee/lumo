"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import { MultipleChoiceQuestionComponent } from "@/components/editor-components/MultipleChoiceQuestionComponent";
import { ListChecks } from "lucide-react";

export function MultipleChoiceQuestionToolPanel() {
  const { connectors } = useEditor();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-shrink-0 border-b">
        <h2 className="text-lg font-semibold">Questions</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-3">
        <p className="text-sm text-muted-foreground mb-4">Drag a question onto the canvas.</p>
        <div
          ref={(ref: HTMLDivElement | null) => {
            if(ref){
              connectors.create(ref, <MultipleChoiceQuestionComponent />)
            }
          }}
          className="cursor-grab p-4 border rounded-lg bg-card hover:bg-muted transition-colors flex items-center gap-4"
        >
          <ListChecks className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Multiple Choice Question</h3>
            <p className="text-xs text-muted-foreground">A pre-built quiz component.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { ChallengeType } from "@/models/Challenge";
import { ListChecks, MessageSquare, Binary, HelpCircle } from "lucide-react";

// Import your new components
import { ChallengeComponent } from "@/components/editor-components/ChallengeComponent";
import { MultipleChoiceQuestionComponent } from "@/components/editor-components/MultipleChoiceQuestionComponent";
import { TrueFalseQuestionComponent } from "@/components/editor-components/TrueFalseQuestionComponent";
import { ShortAnswerQuestionComponent } from "@/components/editor-components/ShortAnswerQuestionComponent";

// UI Components
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Reusable Draggable Item
const DraggableItem = ({
  name,
  icon,
  component,
}: {
  name: string;
  icon: React.ReactNode;
  component: React.ReactElement;
}) => {
  const { connectors } = useEditor();
  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) connectors.create(ref, component);
      }}
      className="cursor-grab p-3 border rounded-lg bg-card hover:bg-muted transition-colors flex items-center gap-4"
    >
      {icon}
      <div>
        <h3 className="font-semibold">{name}</h3>
      </div>
    </div>
  );
};

export function ChallengeToolPanel() {
  const [challengeType, setChallengeType] = useState<ChallengeType>('quiz');

  const questionTypes = [
      { name: "Multiple Choice", icon: <ListChecks className="h-6 w-6 text-primary" />, component: <MultipleChoiceQuestionComponent /> },
      { name: "True / False", icon: <Binary className="h-6 w-6 text-primary" />, component: <TrueFalseQuestionComponent /> },
      { name: "Short Answer", icon: <MessageSquare className="h-6 w-6 text-primary" />, component: <ShortAnswerQuestionComponent /> },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-shrink-0 border-b">
        <h2 className="text-lg font-semibold">Challenges</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        
        {/* Step 1: Select Challenge Type */}
        <div>
          <Label htmlFor="challenge-type">Challenge Type</Label>
          <Select
            value={challengeType}
            onValueChange={(value: ChallengeType) => setChallengeType(value)}
          >
            <SelectTrigger id="challenge-type" className="mt-1">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="practice">Practice</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Step 2: Drag Challenge Area */}
        <div>
            <p className="text-sm font-semibold mb-2">1. Drag a Challenge Area</p>
            <p className="text-xs text-muted-foreground mb-3">
              This creates the main container for your questions. A database record will be created automatically.
            </p>
            <DraggableItem
                name="Challenge Area"
                icon={<HelpCircle className="h-6 w-6 text-primary" />}
                // Pass the selected challenge type as a prop!
                component={<ChallengeComponent challengeType={challengeType} />}
            />
        </div>

        <Separator />
        
        {/* Step 3: Add Questions */}
        <div>
            <p className="text-sm font-semibold mb-2">2. Add Questions</p>
            <p className="text-xs text-muted-foreground mb-3">
              Drag these components *inside* the dashed Challenge Area on your canvas.
            </p>
            <div className="space-y-2">
                {questionTypes.map((q) => (
                    <DraggableItem key={q.name} {...q} />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}

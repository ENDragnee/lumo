"use client";

import React, { useState, useEffect } from 'react';
import { useEditor, useNode, UserComponent } from '@craftjs/core';
import { TrueFalseQuestionSettings } from './settings/TrueFalseQuestionSettings';
import { Button as UiButton } from "@/components/ui/button";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

// --- Props Interface ---
export interface TrueFalseQuestionProps {
  questionText?: string;
  correctAnswer?: boolean;
  explanation?: string;
  buttonText?: string;
}

// --- Craftable Component Definition ---
type CraftableTrueFalseQuestionComponent = UserComponent<TrueFalseQuestionProps>;

export const TrueFalseQuestionComponent: CraftableTrueFalseQuestionComponent = ({
  questionText = "The Great Wall of China is visible from space with the naked eye.",
  correctAnswer = false,
  explanation = "This is a common misconception. While long, the Great Wall is not wide enough to be visible from space without aid.",
  buttonText = "Check Answer"
}) => {
  const { id, connectors: { connect, drag } } = useNode();
  const { selected, actions: editorActions, enabled: editorEnabled } = useEditor((state, query) => ({
    selected: query.getEvent('selected').contains(id),
    enabled: state.options.enabled,
  }));

  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [submission, setSubmission] = useState<{ state: 'idle' | 'submitted'; isCorrect?: boolean }>({ state: 'idle' });

  const handleReset = () => {
      setSelectedAnswer(null);
      setSubmission({ state: 'idle' });
  }

  // Effect to reset component state if the correct answer changes in the editor.
  useEffect(() => {
    handleReset();
  }, [correctAnswer]);

  const handleSelection = (answer: boolean) => {
    if (submission.state === 'submitted' || editorEnabled) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (editorEnabled || selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === correctAnswer;
    setSubmission({ state: 'submitted', isCorrect });
  };

  return (
    <div ref={(ref: HTMLDivElement | null) => { if (ref) connect(drag(ref)); }} className="relative w-full p-4 my-2 border rounded-lg bg-card">
      {selected && editorEnabled && (
        <UiButton
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 z-10 h-6 w-6"
          onClick={() => editorActions.delete(id)}
        >
          <Trash2 className="h-3 w-3" />
        </UiButton>
      )}

      <div className="space-y-4">
        <ReactMarkdown className="prose prose-sm sm:prose max-w-none prose-p:my-2">{questionText}</ReactMarkdown>

        <div className="flex gap-4">
            <UiButton
                variant={selectedAnswer === true ? "default" : "outline"}
                onClick={() => handleSelection(true)}
                disabled={submission.state === 'submitted' || editorEnabled}
                className="flex-1"
            >
                True
            </UiButton>
            <UiButton
                variant={selectedAnswer === false ? "default" : "outline"}
                onClick={() => handleSelection(false)}
                disabled={submission.state === 'submitted' || editorEnabled}
                className="flex-1"
            >
                False
            </UiButton>
        </div>

        {submission.state === 'idle' && (
            <UiButton onClick={handleSubmit} disabled={editorEnabled || selectedAnswer === null}>
                {buttonText}
            </UiButton>
        )}
        
        {submission.state === 'submitted' && !editorEnabled && (
             <div className={cn("p-4 rounded-lg space-y-2 border", 
                submission.isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
             )}>
                <div className="flex items-center gap-2 font-semibold">
                    {submission.isCorrect ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                    <span>{submission.isCorrect ? "Correct!" : "Not Quite."}</span>
                </div>
                <p className="text-sm text-muted-foreground pl-7">{explanation}</p>
                <UiButton onClick={handleReset} variant="link" className="pl-7">Try Again</UiButton>
             </div>
        )}
      </div>
    </div>
  );
};

TrueFalseQuestionComponent.craft = {
  displayName: "True / False Question",
  props: {
    questionText: "Green chemistry aims to completely stop all chemical manufacturing.",
    correctAnswer: false,
    explanation: "Green chemistry seeks to make chemical manufacturing more sustainable and less hazardous, not to stop it entirely.",
    buttonText: "Check Answer",
  },
  related: {
    settings: TrueFalseQuestionSettings,
  },
};

"use client";

import React, { useState, useEffect } from 'react';
import { useEditor, useNode, UserComponent } from '@craftjs/core';
import { MultipleChoiceQuestionSettings } from './settings/MultipleChoiceQuestionSettings';
import { Button as UiButton } from "@/components/ui/button";
import { Trash2 } from "lucide-react"; // Import the icon
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import ReactMarkdown from 'react-markdown';

// --- Type for a single answer option ---
export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

// --- Props Interface ---
export interface MultipleChoiceQuestionProps {
  title?: string;
  prompt?: string;
  instruction?: string;
  allowMultipleAnswers?: boolean;
  options?: QuestionOption[];
  feedbackCorrect?: string;
  feedbackIncorrect?: string;
  buttonText?: string;
}

// --- Craftable Component Definition ---
type CraftableMultipleChoiceQuestionComponent = UserComponent<MultipleChoiceQuestionProps>;

export const MultipleChoiceQuestionComponent: CraftableMultipleChoiceQuestionComponent = ({
  title = "Question Title",
  prompt = "This is the question prompt. You can edit it in the settings.",
  instruction = "Select the correct answer(s), then submit.",
  allowMultipleAnswers = true,
  options = [
    { text: "Correct Answer", isCorrect: true },
    { text: "Incorrect Answer", isCorrect: false },
  ],
  feedbackCorrect = "That's right! Well done.",
  feedbackIncorrect = "Not quite. Review the correct answers highlighted above.",
  buttonText = "Submit"
}) => {
  const { id, connectors: { connect, drag } } = useNode();
  const { selected, actions: editorActions, enabled: editorEnabled } = useEditor((state, query) => ({
    selected: query.getEvent('selected').contains(id),
    enabled: state.options.enabled,
  }));

  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [submission, setSubmission] = useState<{ state: 'idle' | 'submitted'; isCorrect?: boolean }>( { state: 'idle' } );

  const handleReset = () => {
      setSelectedIndices(new Set());
      setSubmission({ state: 'idle' });
  }

  // Effect to reset component state if key props change in the editor.
  // This prevents invalid states, e.g., having multiple items selected
  // after switching `allowMultipleAnswers` to false.
  useEffect(() => {
    handleReset();
  }, [allowMultipleAnswers, options]);

  const handleSelectionChange = (index: number) => {
    if (submission.state === 'submitted' || editorEnabled) return;

    setSelectedIndices(prev => {
      const newSelection = new Set(prev);
      if (allowMultipleAnswers) {
        if (newSelection.has(index)) newSelection.delete(index);
        else newSelection.add(index);
      } else {
        newSelection.clear();
        newSelection.add(index);
      }
      return newSelection;
    });
  };

  const handleSubmit = () => {
    if (editorEnabled) return;
    
    const correctIndices = new Set(
      options.map((opt, i) => (opt.isCorrect ? i : -1)).filter(i => i !== -1)
    );

    const isCorrect = selectedIndices.size === correctIndices.size &&
                      [...selectedIndices].every(index => correctIndices.has(index));

    setSubmission({ state: 'submitted', isCorrect });
  };

  const getOptionState = (index: number, option: QuestionOption) => {
    if (submission.state !== 'submitted') return selectedIndices.has(index) ? 'selected' : 'default';
    const isSelected = selectedIndices.has(index);
    if (option.isCorrect) return 'correct';
    if (isSelected && !option.isCorrect) return 'incorrect';
    return 'default';
  }

  return (
    <div ref={(ref: HTMLDivElement | null) => { if (ref) connect(drag(ref)); }} className="relative w-full p-4 my-2 border rounded-lg bg-card">
      {/* ADDED: Delete button for editor mode */}
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
        <ReactMarkdown className="text-xl font-bold">{title}</ReactMarkdown>
        <ReactMarkdown className="prose prose-sm sm:prose max-w-none prose-p:my-2">{prompt}</ReactMarkdown>
        <p className="text-sm text-muted-foreground">{instruction}</p>

        <div className="space-y-3">
          {options.map((option, index) => {
            const optionState = getOptionState(index, option);
            return (
                <Label 
                    key={index} 
                    onClick={() => handleSelectionChange(index)}
                    className={cn(
                        "flex items-start sm:items-center gap-4 p-4 rounded-lg border-2 transition-all",
                        editorEnabled ? "cursor-default" : "cursor-pointer",
                        {
                            "border-primary bg-primary/10": optionState === 'selected',
                            "border-green-500 bg-green-500/10 text-green-800": optionState === 'correct',
                            "border-red-500 bg-red-500/10 text-red-800": optionState === 'incorrect',
                            "border-border bg-background hover:bg-muted": optionState === 'default',
                        }
                    )}
                >
                    <Checkbox checked={selectedIndices.has(index)} className="h-5 w-5 mt-0.5 sm:mt-0" />
                    <span>{option.text}</span>
                </Label>
            )
          })}
        </div>

        {submission.state === 'submitted' && !editorEnabled ? (
             <div className={cn("p-4 rounded-lg text-center space-y-2", 
                submission.isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'
             )}>
                <p>{submission.isCorrect ? feedbackCorrect : feedbackIncorrect}</p>
                <UiButton onClick={handleReset} variant="link">Try Again</UiButton>
             </div>
        ) : (
             <UiButton onClick={handleSubmit} disabled={editorEnabled || selectedIndices.size === 0}>{buttonText}</UiButton>
        )}
      </div>
    </div>
  );
};

MultipleChoiceQuestionComponent.craft = {
  displayName: "Multiple Choice Question",
  props: {
    title: "Question 1 of 2",
    prompt: "You run a local bakery in a small town and are considering taking your business online. How can going digital benefit your business?",
    instruction: "Select the 4 correct answers, then submit.",
    allowMultipleAnswers: true,
    options: [
      { text: "You can communicate with customers more easily", isCorrect: true },
      { text: "You can target ads at local customers", isCorrect: true },
      { text: "You get more insights into customers' online behaviour", isCorrect: true },
      { text: "You can buy a pizza oven", isCorrect: false },
      { text: "You are more visible to customers", isCorrect: true },
      { text: "You would have less need to communicate with customers", isCorrect: false },
    ],
    feedbackCorrect: "Correct! These are all great benefits of a digital presence.",
    feedbackIncorrect: "That's not quite right. Review the correct answers.",
    buttonText: "Submit",
  },
  related: {
    settings: MultipleChoiceQuestionSettings,
  },
};

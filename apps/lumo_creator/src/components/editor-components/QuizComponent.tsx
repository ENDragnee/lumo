"use client";

import React, { useState } from 'react';
import { useEditor, useNode, Node as CraftNode } from '@craftjs/core';
import { QuizSettings } from './settings/QuizSettings';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

// --- Type Definitions ---
export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizProps {
  question?: string;
  options?: QuizOption[];
  feedbackCorrect?: string;
  feedbackIncorrect?: string;
  padding?: string;
}

// --- Craftable Component Definition ---
interface CraftableComponent extends React.FC<QuizProps> {
    craft?: {
      displayName: string;
      props: Partial<QuizProps>;
      related?: {
        settings: React.ComponentType<any>;
      };
      rules?: {
        canDrag?: (node: CraftNode) => boolean;
      };
    };
}

export const QuizComponent: CraftableComponent = ({
  question = "What is 2 + 2?",
  options = [
    { text: "3", isCorrect: false },
    { text: "4", isCorrect: true },
    { text: "5", isCorrect: false },
  ],
  feedbackCorrect = "That's right! Great job.",
  feedbackIncorrect = "Not quite. The correct answer is 4.",
  padding = "16px"
}) => {
  const { connectors: { connect, drag } } = useNode();
  const { enabled: editorEnabled } = useEditor(state => ({ enabled: state.options.enabled }));

  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);

  const handleOptionClick = (option: QuizOption) => {
    if (isAnswered && !editorEnabled) return;
    setSelectedOption(option);
    setIsAnswered(true);
  };
  
  const handleReset = () => {
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const getCorrectAnswerText = () => {
    return options.find(opt => opt.isCorrect)?.text || 'the correct option.';
  }

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      style={{ padding }}
      className="p-6 border rounded-lg shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4">{question}</h3>
      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          const showFeedback = isAnswered && isSelected;
          return (
            <Button
              key={index}
              variant="outline"
              className={cn(
                "w-full justify-start h-auto py-2",
                editorEnabled && "cursor-default",
                showFeedback && option.isCorrect && "bg-green-100 border-green-500 text-green-800 hover:bg-green-200",
                showFeedback && !option.isCorrect && "bg-red-100 border-red-500 text-red-800 hover:bg-red-200"
              )}
              onClick={() => editorEnabled ? null : handleOptionClick(option)}
            >
              {option.text}
            </Button>
          )
        })}
      </div>
      
      {isAnswered && !editorEnabled && (
        <div className="mt-4 p-3 rounded-md bg-muted">
            <div className="flex items-center gap-2">
                {selectedOption?.isCorrect ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                <p className="text-sm">
                    {selectedOption?.isCorrect ? feedbackCorrect : feedbackIncorrect.replace('{correctAnswer}', getCorrectAnswerText())}
                </p>
            </div>
            <Button variant="link" size="sm" onClick={handleReset} className="mt-2">Try Again</Button>
        </div>
      )}
    </div>
  );
};

QuizComponent.craft = {
  displayName: "Quiz",
  props: {
    question: "What is the capital of France?",
    options: [
      { text: "Berlin", isCorrect: false },
      { text: "Paris", isCorrect: true },
      { text: "London", isCorrect: false },
      { text: "Madrid", isCorrect: false },
    ],
    feedbackCorrect: "Correct! C'est magnifique!",
    feedbackIncorrect: "Not quite. The correct answer is {correctAnswer}.",
    padding: '16px',
  },
  related: {
    settings: QuizSettings,
  },
};

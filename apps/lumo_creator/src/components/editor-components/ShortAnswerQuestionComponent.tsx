"use client";

import React, { useState, useEffect } from 'react';
import { useEditor, useNode, UserComponent } from '@craftjs/core';
import { ShortAnswerQuestionSettings } from './settings/ShortAnswerQuestionSettings';
import { Button as UiButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

// --- Props Interface ---
export interface ShortAnswerQuestionProps {
  questionText?: string;
  acceptedAnswers?: string[];
  caseSensitive?: boolean;
  explanation?: string;
  inputPlaceholder?: string;
  buttonText?: string;
}

// --- Craftable Component Definition ---
type CraftableShortAnswerQuestionComponent = UserComponent<ShortAnswerQuestionProps>;

export const ShortAnswerQuestionComponent: CraftableShortAnswerQuestionComponent = ({
  questionText = "What is the chemical symbol for water?",
  acceptedAnswers = ["H2O", "h2o"],
  caseSensitive = false,
  explanation = "The chemical symbol for water is H2O, representing two hydrogen atoms and one oxygen atom.",
  inputPlaceholder = "Type your answer here...",
  buttonText = "Submit Answer"
}) => {
  const { id, connectors: { connect, drag } } = useNode();
  const { selected, actions: editorActions, enabled: editorEnabled } = useEditor((state, query) => ({
    selected: query.getEvent('selected').contains(id),
    enabled: state.options.enabled,
  }));

  const [userAnswer, setUserAnswer] = useState("");
  const [submission, setSubmission] = useState<{ state: 'idle' | 'submitted'; isCorrect?: boolean }>({ state: 'idle' });

  const handleReset = () => {
      setUserAnswer("");
      setSubmission({ state: 'idle' });
  }

  // Effect to reset component state if key settings change in the editor.
  useEffect(() => {
    handleReset();
  }, [acceptedAnswers, caseSensitive]);

  const handleSubmit = () => {
    if (editorEnabled || !userAnswer.trim()) return;
    
    // Prepare the user's answer and the set of correct answers for comparison
    const cleanedUserAnswer = caseSensitive ? userAnswer.trim() : userAnswer.trim().toLowerCase();
    const validAnswers = new Set(
        acceptedAnswers?.map(ans => caseSensitive ? ans.trim() : ans.trim().toLowerCase())
    );

    const isCorrect = validAnswers.has(cleanedUserAnswer);
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

        <Input 
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={inputPlaceholder}
            disabled={submission.state === 'submitted' || editorEnabled}
        />

        {submission.state === 'idle' && (
            <UiButton onClick={handleSubmit} disabled={editorEnabled || !userAnswer.trim()}>
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
                <div className="pl-7">
                    <p className="text-sm text-muted-foreground">{explanation}</p>
                    {!submission.isCorrect && (
                        <p className="text-sm mt-2">
                           <span className="font-semibold">Accepted answer(s):</span> {acceptedAnswers?.join(', ')}
                        </p>
                    )}
                    <UiButton onClick={handleReset} variant="link" className="p-0 h-auto mt-2">Try Again</UiButton>
                </div>
             </div>
        )}
      </div>
    </div>
  );
};

ShortAnswerQuestionComponent.craft = {
  displayName: "Short Answer Question",
  props: {
    questionText: "Which planet is known as the Red Planet?",
    acceptedAnswers: ["Mars", "mars"],
    caseSensitive: false,
    explanation: "Mars is often called the 'Red Planet' because of the iron oxide prevalent on its surface, which gives it a reddish appearance.",
    inputPlaceholder: "Enter a planet name...",
    buttonText: "Submit Answer",
  },
  related: {
    settings: ShortAnswerQuestionSettings,
  },
};

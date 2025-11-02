"use client";

import React, { useState, useCallback } from 'react';
import { useEditor, useNode, UserComponent } from '@craftjs/core';
import { FlashcardSettings } from './settings/FlashcardSettings';
import { Button as UiButton } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from '@/lib/utils';
import ReactMarkdown from "react-markdown";

// --- Props Interface ---
export interface FlashcardProps {
  titleText?: string;
  questionText?: string;
  answerText?: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  backgroundColor?: string;
  cardBackgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  children?: React.ReactNode; // Not used, but good practice to include
}

// --- Craftable Component Definition ---
type CraftableFlashcardComponent = UserComponent<FlashcardProps>;

export const FlashcardComponent: CraftableFlashcardComponent = ({
  titleText = "Question Time",
  questionText = "This is the default question. Edit it in the settings!",
  answerText = "This is the default answer. Edit it in the settings!",
  buttonText = "Check Answer",
  buttonVariant = "default",
  backgroundColor = "hsl(var(--muted) / 0.2)",
  cardBackgroundColor = "hsl(var(--card))",
  borderRadius = 12,
  padding = 24,
}) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();
  
  const { selected, actions: editorActions, enabled: editorEnabled } = useEditor((state, query) => ({
    selected: query.getEvent('selected').contains(id),
    enabled: state.options.enabled,
  }));
  
  const [isRevealed, setIsRevealed] = useState(false);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    editorActions.delete(id);
  }, [editorActions, id]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editorEnabled) { // Only allow toggling in render/preview mode
      setIsRevealed(prev => !prev);
    }
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    borderRadius: `${borderRadius}px`,
    padding: `${padding}px`,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: cardBackgroundColor,
    borderRadius: `${borderRadius}px`,
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => { if(ref) connect(drag(ref)); }}
      style={containerStyle}
      className="relative w-full"
    >
      <h3 className="text-2xl font-bold mb-4 px-2">{titleText}</h3>
      <div 
        style={cardStyle}
        className="p-6 border shadow-sm"
      >
        <div className="prose prose-sm sm:prose-base max-w-none min-h-[5rem]">
          {!isRevealed ? (
            <ReactMarkdown>{questionText}</ReactMarkdown>
          ) : (
            <ReactMarkdown>{answerText}</ReactMarkdown>
          )}
        </div>
        
        <UiButton
          variant={buttonVariant}
          onClick={handleToggle}
          className="mt-6"
        >
          {isRevealed ? "Hide Answer" : buttonText}
        </UiButton>
      </div>

      {selected && editorEnabled && (
        <UiButton
          variant="destructive"
          size="icon"
          className="absolute top-0 right-0 z-10 h-6 w-6 opacity-80 hover:opacity-100"
          onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
          onClick={handleRemove}
          aria-label="Delete Flashcard Element"
        >
          <Trash2 className="h-3 w-3" />
        </UiButton>
      )}
    </div>
  );
};

FlashcardComponent.craft = {
  displayName: "Flashcard",
  isCanvas: false, // This is a content leaf component
  props: {
    titleText: "Daniell Cell Check",
    questionText: "In the Daniell cell (Zn/Cu), why do sulfate ions (SO₄²⁻) move from the copper half-cell towards the zinc half-cell through the salt bridge?",
    answerText: "To balance the positive charge building up in the zinc half-cell due to the oxidation of Zn to Zn²⁺.",
    buttonText: "Check Answer",
    buttonVariant: "default",
    backgroundColor: "hsl(var(--background))",
    cardBackgroundColor: "hsl(var(--card))",
    borderRadius: 12,
    padding: 24,
  },
  related: {
    settings: FlashcardSettings,
  },
};
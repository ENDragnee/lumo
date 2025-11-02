"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface AlphabetNavProps {
  onLetterClick: (letter: string) => void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const SPECIAL_CHARS = ["#"]; // For items not starting with a letter

export function AlphabetNav({ onLetterClick }: AlphabetNavProps) {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 h-full flex items-center justify-center pr-1 z-10">
      <div className="flex flex-col items-center justify-center gap-0.5 bg-background/50 backdrop-blur-sm p-1 rounded-md border">
        {SPECIAL_CHARS.map((char) => (
           <Button
             key={char}
             variant="ghost"
             size="sm"
             className="h-6 w-6 p-0 text-xs text-muted-foreground hover:bg-accent"
             onClick={() => onLetterClick(char)}
           >
             {char}
           </Button>
        ))}
        {ALPHABET.map((letter) => (
          <Button
            key={letter}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-xs text-muted-foreground hover:bg-accent"
            onClick={() => onLetterClick(letter)}
          >
            {letter}
          </Button>
        ))}
      </div>
    </div>
  );
}

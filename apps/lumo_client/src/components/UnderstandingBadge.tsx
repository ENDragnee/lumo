// components/UnderstandingBadge.tsx (Create this new file)
'use client';

import { cn } from "@/lib/utils";
import { Sparkles, CheckCircle, BrainCircuit, BookOpen } from "lucide-react";

type UnderstandingLevel = 'needs-work' | 'foundational' | 'good' | 'mastered';

interface UnderstandingBadgeProps {
  level: UnderstandingLevel | undefined;
}

const levelConfig = {
  mastered: {
    text: "Mastered",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    icon: <Sparkles className="h-3 w-3" />,
  },
  good: {
    text: "Good",
    color: "text-sky-500 bg-sky-500/10 border-sky-500/20",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  foundational: {
    text: "Foundational",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    icon: <BrainCircuit className="h-3 w-3" />,
  },
  'needs-work': {
    text: "Needs Work",
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    icon: <BookOpen className="h-3 w-3" />,
  },
};

export function UnderstandingBadge({ level }: UnderstandingBadgeProps) {
  if (!level || !levelConfig[level]) {
    return null; // Don't render if there's no performance data
  }

  const config = levelConfig[level];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium border",
        config.color
      )}
    >
      {config.icon}
      {config.text}
    </div>
  );
}

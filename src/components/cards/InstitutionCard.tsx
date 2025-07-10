// @/components/cards/InstitutionCard.tsx
"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Clock, ArrowRight, GraduationCap } from "lucide-react"

// Props interface to match the data structure from your API and MaterialsPage
interface InstitutionCardProps {
  id: string;
  title: string;
  description: string;
  courseCount: number;
  enrolledCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  gradient: string;
  icon?: React.ReactNode;
}

export function InstitutionCard({
  id,
  title,
  description,
  courseCount,
  enrolledCount,
  difficulty,
  gradient,
  icon,
}: InstitutionCardProps) {
  const router = useRouter();

  const getDifficultyColor = (level: 'easy' | 'medium' | 'hard') => {
    switch (level) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-700/60";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700/60";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-700/60";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
    }
  };

  const handleClick = () => {
    router.push(`/institution/${id}`);
  };

  return (
    // FIX 1: Make the Card the primary flex container (flex-col)
    <Card 
      onClick={handleClick} 
      className="group flex w-full flex-col cursor-pointer overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:bg-slate-800/50 dark:border-slate-700 dark:hover:border-slate-600"
    >
      {/* HEADER: Added flex-shrink-0 to ensure it keeps its height */}
      <div className={`relative h-32 w-full flex-shrink-0 bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
        <div className="absolute bottom-4 left-4 text-white">
            {icon || <GraduationCap className="h-8 w-8" />}
        </div>
      </div>
      
      {/* FIX 2: CardContent now grows to fill space, instead of a fixed h-full */}
      <CardContent className="flex flex-grow flex-col p-4 md:p-5">
        
        {/* FIX 3: This wrapper grows, pushing the content below it to the bottom */}
        <div className="flex-grow">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary dark:text-gray-100">
              {title}
            </h3>
            <Badge className={`flex-shrink-0 border text-xs font-medium ${getDifficultyColor(difficulty)}`} variant="secondary">
              {(difficulty?.charAt(0).toUpperCase() + difficulty?.slice(1)) || "Medium"}
            </Badge>
          </div>
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        
        {/* "Footer" content with stats and button */}
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:text-sm">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              {courseCount} courses
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {enrolledCount.toLocaleString()} learners
            </span>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-between rounded-md py-2 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/20 transition-all duration-300 hover:bg-primary/10 group-hover:ring-primary/40"
          >
            <span>Explore Institution</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

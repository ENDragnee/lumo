"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Clock, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface FeaturedCollectionCardProps {
  id: string;
  title: string
  description: string
  courseCount: number
  enrolledCount: number
  estimatedTime: string
  difficulty: string
  gradient?: string
  icon?: React.ReactNode
}

export function FeaturedCollectionCard({
  id,
  title,
  description,
  courseCount,
  enrolledCount,
  estimatedTime,
  difficulty,
  gradient,
  icon,
}: FeaturedCollectionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-sage text-frost"
      case "medium":
        return "bg-butter text-shadow"
      case "hard":
        return "bg-coral text-frost"
      default:
        return "bg-graphite text-frost"
    }
  }
  const router = useRouter()
  const handleClick = () => {
    router.push(`/${id}`)
  }

  return (
    <Card className="group apple-hover cursor-pointer shadow-apple-md overflow-hidden">
      <div className={`h-36 bg-gradient-to-br ${gradient} relative`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-4 left-4 text-white">{icon || <BookOpen className="w-6 h-6" />}</div>
      </div>
      <CardContent className="p-2">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-semibold text-shadow group-hover:text-pacific transition-colors">{title}</h3>
          <Badge className={getDifficultyColor(difficulty)} variant="secondary">
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
        </div>

        <p className="text-sm text-graphite mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between text-xs text-graphite mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {courseCount} courses
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {enrolledCount} enrolled
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {estimatedTime}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-between text-pacific hover:bg-pacific/10 group-hover:translate-x-1 transition-all duration-300"
          onClick={handleClick}
        >
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

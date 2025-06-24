"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Clock,
  TrendingUp,
  Lightbulb,
  Target,
  Zap,
  Coffee,
  BookOpen,
  X,
  Check,
  ChevronRight,
  Sparkles,
  Calendar,
  BarChart3,
} from "lucide-react"
import { useAIRecommendations, type StudyRecommendation } from "../../hooks/useAIRecommendations"

interface AIRecommendationsPanelProps {
  studentId?: string
  compact?: boolean
}

export function AIRecommendationsPanel({ studentId, compact = false }: AIRecommendationsPanelProps) {
  const { recommendations, loading, error, dismissRecommendation, acceptRecommendation } =
    useAIRecommendations(studentId)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  if (loading) {
    return (
      <Card className="shadow-apple-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-y-4">
            <div className="animate-spin">
              <Brain className="w-8 h-8 text-pacific" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-shadow">AI is analyzing your learning patterns...</p>
              <p className="text-xs text-graphite">This may take a moment</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !recommendations) {
    return (
      <Card className="shadow-apple-md border-coral/20">
        <CardContent className="p-6 text-center">
          <p className="text-coral">Unable to load AI recommendations</p>
        </CardContent>
      </Card>
    )
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "timing":
        return <Clock className="w-4 h-4" />
      case "content":
        return <BookOpen className="w-4 h-4" />
      case "method":
        return <Lightbulb className="w-4 h-4" />
      case "break":
        return <Coffee className="w-4 h-4" />
      case "review":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-coral text-frost"
      case "medium":
        return "bg-butter text-shadow"
      case "low":
        return "bg-sage text-frost"
      default:
        return "bg-graphite text-frost"
    }
  }

  const RecommendationCard = ({ recommendation }: { recommendation: StudyRecommendation }) => {
    const isExpanded = expandedCard === recommendation.id

    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-cloud p-4 hover:shadow-apple-sm transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pacific/10 rounded-lg flex items-center justify-center text-pacific">
              {getRecommendationIcon(recommendation.type)}
            </div>
            <div>
              <h4 className="font-semibold text-shadow text-sm">{recommendation.title}</h4>
              <p className="text-xs text-graphite">{recommendation.estimatedTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(recommendation.priority)} variant="secondary">
              {recommendation.priority}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-graphite">
              <Sparkles className="w-3 h-3" />
              {recommendation.confidence}%
            </div>
          </div>
        </div>

        <p className="text-sm text-graphite mb-3">{recommendation.description}</p>

        {isExpanded && (
          <div className="space-y-3 mb-3">
            <div className="bg-pacific/5 rounded-lg p-3">
              <h5 className="text-xs font-semibold text-pacific mb-1">AI Reasoning</h5>
              <p className="text-xs text-graphite">{recommendation.reasoning}</p>
            </div>
            {recommendation.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {recommendation.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedCard(isExpanded ? null : recommendation.id)}
            className="text-xs"
          >
            {isExpanded ? "Less" : "More"} details
            <ChevronRight className={`w-3 h-3 ml-1 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissRecommendation(recommendation.id)}
              className="text-xs text-graphite hover:text-coral"
            >
              <X className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              onClick={() => acceptRecommendation(recommendation.id)}
              className="text-xs bg-pacific hover:bg-midnight"
            >
              <Check className="w-3 h-3 mr-1" />
              {recommendation.action}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (compact) {
    return (
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h4">
            <Brain className="w-5 h-5 text-pacific" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RecommendationCard recommendation={recommendations.nextBestAction} />
          {recommendations.upcomingRecommendations.slice(0, 2).map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Next Best Action - Prominent */}
      <Card className="shadow-apple-lg bg-gradient-to-br from-pacific/5 to-sage/5 border-pacific/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h3">
            <Zap className="w-6 h-6 text-pacific" />
            Recommended Now
            <Badge className="bg-coral text-frost ml-auto">High Priority</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecommendationCard recommendation={recommendations.nextBestAction} />
        </CardContent>
      </Card>

      {/* Optimal Study Times */}
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h3">
            <Clock className="w-5 h-5 text-pacific" />
            Your Optimal Study Times
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.optimalStudyTimes.map((timeSlot, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg">
              <div>
                <h4 className="font-semibold text-shadow">{timeSlot.timeSlot}</h4>
                <p className="text-sm text-graphite">{timeSlot.reasoning}</p>
                <div className="flex gap-1 mt-1">
                  {timeSlot.subjects.map((subject) => (
                    <Badge key={subject} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-pacific">{timeSlot.efficiency}%</div>
                <div className="text-xs text-graphite">efficiency</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Learning Pattern Insights */}
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h3">
            <BarChart3 className="w-5 h-5 text-pacific" />
            Your Learning Pattern
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
              <h4 className="font-semibold text-shadow text-sm mb-2">Peak Hours</h4>
              <div className="flex flex-wrap gap-1">
                {recommendations.learningPattern.peakHours.map((hour) => (
                  <Badge key={hour} className="bg-pacific text-frost text-xs">
                    {hour}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
              <h4 className="font-semibold text-shadow text-sm mb-2">Optimal Session</h4>
              <div className="text-lg font-bold text-pacific">
                {recommendations.learningPattern.preferredDuration} min
              </div>
              <div className="text-xs text-graphite">
                with {recommendations.learningPattern.breakFrequency}min breaks
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
            <h4 className="font-semibold text-shadow text-sm mb-2">Weekly Focus Area</h4>
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-shadow">{recommendations.weeklyFocus.subject}</h5>
                <p className="text-sm text-graphite">{recommendations.weeklyFocus.reason}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-coral">{recommendations.weeklyFocus.suggestedHours}h</div>
                <div className="text-xs text-graphite">this week</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Recommendations */}
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h3">
            <Calendar className="w-5 h-5 text-pacific" />
            Upcoming Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.upcomingRecommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

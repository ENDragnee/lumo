"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, AlertTriangle, ArrowRight, Sparkles } from "lucide-react"

interface InsightsPanelProps {
  type: "strengths" | "weaknesses"
  insights: string[]
  recommendations?: Array<{
    title: string
    description: string
    action: string
  }>
}

export function InsightsPanel({ type, insights, recommendations }: InsightsPanelProps) {
  const isStrengths = type === "strengths"

  return (
    <Card className={`shadow-apple-md ${isStrengths ? "bg-green-50" : "bg-yellow-50"} border-0`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-responsive-h3">
          {isStrengths ? (
            <>
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-green-900">Top Skills</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-900">Focus Areas</span>
            </>
          )}
          <Badge variant="secondary" className="ml-auto bg-white/60">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Insights
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Insights */}
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                isStrengths ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}
            >
              <p className="text-sm font-medium">{insight}</p>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className={`font-semibold text-sm ${isStrengths ? "text-green-900" : "text-yellow-900"}`}>
              {isStrengths ? "Keep Building On:" : "Recommended Actions:"}
            </h4>
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm p-3 rounded-lg">
                <h5 className="font-medium text-sm text-shadow mb-1">{rec.title}</h5>
                <p className="text-xs text-graphite mb-2">{rec.description}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs ${
                    isStrengths ? "text-green-600 hover:bg-green-100" : "text-yellow-600 hover:bg-yellow-100"
                  }`}
                >
                  {rec.action}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

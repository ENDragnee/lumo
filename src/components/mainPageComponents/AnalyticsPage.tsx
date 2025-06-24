
import { useState } from "react"
import { TimeRangeSelector } from "@/components/analytics/TimeRangeSelector"
import { KnowledgeConstellation } from "@/components/analytics/KnowledgeConstellation"
import { MomentumChart } from "@/components/analytics/MomentumChart"
import { InsightsPanel } from "@/components/analytics/InsightsPanel"

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  const analyticsData = {
    knowledgeConstellation: [
      { subject: "Math", mastery: 85, color: "bg-blue-500" },
      { subject: "Physics", mastery: 72, color: "bg-green-500" },
      { subject: "Chemistry", mastery: 91, color: "bg-purple-500" },
      { subject: "Biology", mastery: 68, color: "bg-orange-500" },
    ],
    momentum: [
      { date: "Week 1", studyHours: 12, averageMastery: 65 },
      { date: "Week 2", studyHours: 15, averageMastery: 68 },
      { date: "Week 3", studyHours: 18, averageMastery: 72 },
      { date: "Week 4", studyHours: 14, averageMastery: 75 },
    ],
    strengths: [
      "You excel at Vector Calculus and Thermodynamics",
      "Your problem-solving speed has improved 23% this month",
      "Consistent daily study habits are paying off",
    ],
    weaknesses: [
      "Organic Synthesis concepts need more practice",
      "Physics problem accuracy could be improved",
      "Consider reviewing electromagnetic field theory",
    ],
    recommendations: [
      {
        title: "Practice Organic Synthesis",
        description: "Focus on reaction mechanisms and stereochemistry",
        action: "Start Practice Set",
      },
      {
        title: "Physics Problem Workshop",
        description: "Join the weekly problem-solving session",
        action: "Join Workshop",
      },
    ],
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-shadow tracking-tight">Analytics</h1>
        <TimeRangeSelector onRangeChange={setTimeRange} currentRange={timeRange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <KnowledgeConstellation data={analyticsData.knowledgeConstellation} />
        <MomentumChart data={analyticsData.momentum} />

        <InsightsPanel type="strengths" insights={analyticsData.strengths} />
        <InsightsPanel
          type="weaknesses"
          insights={analyticsData.weaknesses}
          recommendations={analyticsData.recommendations}
        />
      </div>
    </div>
  )
}


// AnalyticsPage.tsx

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAIRecommendations, type AIInsights } from "@/hooks/useAIRecommendations"; // Adjust path
import { TimeRangeSelector } from "@/components/analytics/TimeRangeSelector";
import { KnowledgeConstellation } from "@/components/analytics/KnowledgeConstellation";
import { MomentumChart } from "@/components/analytics/MomentumChart";
import { InsightsPanel } from "@/components/analytics/InsightsPanel";
import { Loader2, AlertTriangle, BarChart2 } from "lucide-react";

// --- TYPE DEFINITIONS for clarity ---

interface KnowledgeData {
  subject: string;
  mastery: number;
  color: string; // Keep color if your component uses it
}

interface MomentumData {
  date: string;
  studyHours: number;
  averageMastery: number;
}

interface ChartData {
  knowledgeConstellation: KnowledgeData[];
  momentum: MomentumData[];
}

// --- LOADING SKELETON Component ---

function LoadingSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <Loader2 className="w-12 h-12 animate-spin text-pacific mb-4" />
            <h2 className="text-xl font-semibold text-shadow">Analyzing Your Progress...</h2>
            <p className="text-graphite">Crafting your personalized learning insights and charts.</p>
        </div>
    );
}

// --- ERROR DISPLAY Component ---

function ErrorDisplay({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-coral bg-coral/10 p-6 rounded-lg">
            <AlertTriangle className="w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold">Oops! Something went wrong.</h2>
            <p>{message}</p>
        </div>
    );
}

// --- NO DATA Component ---
function NoDataDisplay() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-graphite bg-cloud/50 p-6 rounded-lg">
            <BarChart2 className="w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-shadow">Not Enough Data Yet</h2>
            <p>Start a few learning sessions to generate your first analytics report!</p>
        </div>
    );
}

// --- MAIN PAGE Component ---

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const { data: session } = useSession();

  // --- State Management for different data sources ---
  const { insights, loading: insightsLoading, error: insightsError } = useAIRecommendations(session?.user?.id);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);

  // --- Data Fetching Effect for Chart Data ---
  useEffect(() => {
    // Only fetch if the user session is available
    if (session?.user?.id) {
      const fetchChartData = async () => {
        try {
          setChartLoading(true);
          setChartError(null);
          const response = await fetch('/api/analytics/charts');
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch chart data");
          }
          const data: ChartData = await response.json();
          setChartData(data);
        } catch (err: any) {
          console.error(err);
          setChartError(err.message);
        } finally {
          setChartLoading(false);
        }
      };
      fetchChartData();
    } else {
        // If there's no session, no need to load chart data
        setChartLoading(false);
    }
  }, [session?.user?.id]);


  // --- Render Logic ---

  if (insightsLoading || chartLoading) {
    return <LoadingSkeleton />;
  }

  if (insightsError || chartError) {
    return <ErrorDisplay message={insightsError || chartError || "An unknown error occurred."} />;
  }

  if (!insights || !chartData) {
    return <NoDataDisplay />;
  }

  // Assign colors to constellation data if not provided by API
  const constellationWithColors = chartData.knowledgeConstellation.map((item, index) => ({
    ...item,
    // Add a default color logic if the API doesn't provide it
    color: item.color || `bg-blue-${(index + 4) * 100}`
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-shadow tracking-tight">Analytics</h1>
        <TimeRangeSelector onRangeChange={setTimeRange} currentRange={timeRange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart components now use live data */}
        <KnowledgeConstellation data={constellationWithColors} />
        <MomentumChart data={chartData.momentum} />

        {/* AI Insight components also use live data */}
        <InsightsPanel type="strengths" insights={insights.strengths} />
        <InsightsPanel
          type="weaknesses"
          insights={insights.weaknesses}
          recommendations={insights.aiRecommendations.map(rec => ({
            title: rec.title,
            description: rec.description,
            action: rec.actionText,
          }))}
        />
      </div>
    </div>
  );
}

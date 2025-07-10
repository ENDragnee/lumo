"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"; // Import the router for navigation
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Lightbulb,
  X,
  Check,
  ChevronRight,
  Sparkles,
  BookOpen,
  AlertTriangle,
} from "lucide-react"
// Import the updated hook and its types
import { useAIRecommendations, type AIInsights } from "../../hooks/useAIRecommendations" // Adjust path

interface AIRecommendationsPanelProps {
  // The hook now gets the studentId from the session, so we can simplify the props
  // studentId?: string
}

// --- LOADING SKELETON ---
function LoadingState() {
    return (
        <Card className="shadow-apple-md">
            <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin">
                        <Brain className="w-8 h-8 text-pacific" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-shadow">LumoAI is analyzing your learning patterns...</p>
                        <p className="text-xs text-graphite">This may take a moment.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// --- ERROR STATE ---
function ErrorState({ message }: { message: string }) {
    return (
        <Card className="shadow-apple-md border-coral/20">
            <CardContent className="p-6 text-center text-coral">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Unable to load AI recommendations</p>
                <p className="text-xs">{message}</p>
            </CardContent>
        </Card>
    );
}


export function AIRecommendationsPanel({}: AIRecommendationsPanelProps) {
  const { data: session } = useSession();
  const router = useRouter();

  // The hook now returns an 'insights' object
  const { insights, loading, error, dismissRecommendation } =
    useAIRecommendations(session?.user?.id);
  
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // --- SUB-COMPONENT: A single recommendation card, updated for the new data structure ---
  const RecommendationCard = ({ recommendation }: { recommendation: AIInsights['aiRecommendations'][0] }) => {
    // The new recommendation object has `contentId` which is perfect for a unique key
    const isExpanded = expandedCardId === recommendation.contentId;

    const handleAccept = () => {
        if (recommendation.contentId) {
            router.push(`/content/${recommendation.contentId}`);
        }
        // In a real app, you might also log this "acceptance" event to the database
    };

    const handleDismiss = () => {
        if (recommendation.contentId) {
            dismissRecommendation(recommendation.contentId);
        }
    };

    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-cloud p-4 hover:shadow-apple-sm transition-all">
        {/* --- Card Header --- */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pacific/10 rounded-lg flex items-center justify-center text-pacific">
              {/* Using a generic "Lightbulb" icon as the old `type` field is gone */}
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-shadow text-sm">{recommendation.title}</h4>
              <p className="text-xs text-graphite">{recommendation.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-pacific">
            <Sparkles className="w-3 h-3" />
            AI Insight
          </div>
        </div>

        {/* --- Expanded View --- */}
        {isExpanded && (
          <div className="space-y-3 my-3 animate-fade-in-fast">
            <div className="bg-pacific/5 rounded-lg p-3">
              <h5 className="text-xs font-semibold text-pacific mb-1">AI Reasoning</h5>
              <p className="text-xs text-graphite">{recommendation.reasoning}</p>
            </div>
          </div>
        )}

        {/* --- Card Actions --- */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedCardId(isExpanded ? null : recommendation.contentId || null)}
            className="text-xs"
          >
            {isExpanded ? "Less" : "More"} details
            <ChevronRight className={`w-3 h-3 ml-1 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-xs text-graphite hover:text-coral"
              aria-label="Dismiss recommendation"
            >
              <X className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="text-xs bg-pacific hover:bg-midnight"
              disabled={!recommendation.contentId} // Disable if no content to link to
            >
              <Check className="w-3 h-3 mr-1" />
              {recommendation.actionText}
            </Button>
          </div>
        </div>
      </div>
    );
  };


  // --- MAIN RENDER LOGIC ---

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!insights || insights.aiRecommendations.length === 0) {
    return (
      <Card className="shadow-apple-md">
        <CardContent className="p-6 text-center">
            <p className="text-graphite">No specific AI recommendations for you right now. Keep up the great work!</p>
        </CardContent>
      </Card>
    );
  }

  // The old complex layout is replaced with a single, focused list of recommendations.
  // The 'compact' prop is no longer needed.
  return (
    <div className="space-y-6">
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h3">
            <Brain className="w-5 h-5 text-pacific" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.aiRecommendations.map((rec) => (
            <RecommendationCard key={rec.contentId || rec.title} recommendation={rec} />
          ))}
        </CardContent>
      </Card>
      
      {/* 
        The "Optimal Study Times" and "Learning Pattern" sections have been removed
        as this data is now aggregated in the main Analytics page charts,
        and the AI's role is focused on content-specific recommendations.
      */}
    </div>
  );
}

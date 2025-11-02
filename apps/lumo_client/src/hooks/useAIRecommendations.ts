// hooks/useAIRecommendations.ts
"use client"

import { useState, useEffect, useCallback } from "react"
import { z } from 'zod';

// For simplicity, we redefine the types here. In a large app, you'd share these from a central file.
const StudyRecommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  reasoning: z.string(),
  actionText: z.string(),
  contentId: z.string().optional(),
});

const AIInsightsSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  aiRecommendations: z.array(StudyRecommendationSchema),
});

// This is the type our component will use
export type AIInsights = z.infer<typeof AIInsightsSchema>;

// The hook's name is now a bit of a misnomer, as it fetches all insights, not just recommendations.
// But we'll keep the name for consistency with your existing code.
export function useAIRecommendations(studentId?: string | null) {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/ai/generate-insights');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch AI insights. Status: ${response.status}`);
      }

      const data: AIInsights = await response.json();
      setInsights(data);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if studentId is provided (i.e., user is logged in)
    if (studentId) {
      fetchInsights();
    } else {
      // If no user, we can immediately stop loading.
      setLoading(false);
    }
  }, [studentId, fetchInsights]);

  // The dismiss/accept logic is now less relevant as the recommendations
  // are generated as a whole package. We can keep it if you want to
  // add client-side dismissal of individual cards.
  const dismissRecommendation = (contentId?: string) => {
    if (!insights || !contentId) return;
    
    setInsights({
      ...insights,
      aiRecommendations: insights.aiRecommendations.filter((rec) => rec.contentId !== contentId),
    });
  };

  return {
    insights,
    loading,
    error,
    dismissRecommendation,
  };
}

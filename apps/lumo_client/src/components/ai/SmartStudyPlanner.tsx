"use client"

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Clock,
  Target,
  Zap,
  TrendingUp,
  BookOpen,
  Coffee,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";

// --- TYPE DEFINITIONS ---
// This interface defines the shape of a single study session object
// that we expect from our new AI API endpoint.
interface StudySession {
  id: string; // This is now the contentId from the database, or a unique ID for breaks
  subject: string;
  topic: string;
  duration: number; // in minutes
  type: "focus" | "review" | "practice" | "break";
  difficulty: "easy" | "medium" | "hard";
  aiReasoning: string;
}

// --- CUSTOM HOOK ---
// This hook encapsulates all the logic for fetching the AI-generated study plan.
function useAIStudyPlan(userId?: string | null) {
    const [plan, setPlan] = useState<StudySession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlan = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/ai/generate-study-plan');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate a study plan.");
            }
            const data = await response.json();
            setPlan(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchPlan();
        } else {
            // If there's no user, don't attempt to fetch a plan.
            setLoading(false);
        }
    }, [userId, fetchPlan]);

    return { plan, loading, error };
}


// --- MAIN COMPONENT ---
export function SmartStudyPlanner() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  // Fetch the plan using our new hook, renaming 'plan' to 'todaysStudyPlan' for consistency
  const { plan: todaysStudyPlan, loading, error } = useAIStudyPlan(session?.user?.id);
  
  // Local state for the interactive timer and session tracking
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completedSessions, setCompletedSessions] = useState<string[]>([]);
  
  // Effect for handling the countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      setIsActive(false);
      // You could add a notification here to signal the end of a session
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  // --- UI HELPER FUNCTIONS ---
  const getSessionIcon = (type: string) => {
    switch (type) {
      case "focus": return <Target className="w-4 h-4" />;
      case "review": return <TrendingUp className="w-4 h-4" />;
      case "practice": return <BookOpen className="w-4 h-4" />;
      case "break": return <Coffee className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  }

  const getSessionColor = (type: string) => {
    switch (type) {
      case "focus": return "bg-pacific text-frost";
      case "review": return "bg-sage text-frost";
      case "practice": return "bg-butter text-shadow";
      case "break": return "bg-coral text-frost";
      default: return "bg-graphite text-frost";
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-sage";
      case "medium": return "text-butter";
      case "hard": return "text-coral";
      default: return "text-graphite";
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // --- INTERACTIVE FUNCTIONS ---
  const startSession = (session: StudySession) => {
    // If the session is a study session (not a break), navigate to the content page
    if (session.type !== 'break') {
      router.push(`/content/${session.id}`);
    }
    setCurrentSession(session);
    setTimeRemaining(session.duration * 60);
    setIsActive(false); // Don't start timer immediately; wait for user to press play
  };

  const pauseSession = () => setIsActive(false);
  const resumeSession = () => setIsActive(true);

  const completeSession = () => {
    if (currentSession) {
      setCompletedSessions(prev => [...prev, currentSession.id]);
      setCurrentSession(null);
      setIsActive(false);
      setTimeRemaining(0);
    }
  };

  const resetSession = () => {
    if (currentSession) {
      setTimeRemaining(currentSession.duration * 60);
      setIsActive(false);
    }
  };

  // --- RENDER LOGIC ---
  if (loading) {
    return (
      <Card className="shadow-apple-md">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-pacific" />
          <p className="mt-2 text-sm font-medium text-graphite">Generating your personalized study plan...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !todaysStudyPlan || todaysStudyPlan.length === 0) {
    return (
      <Card className="shadow-apple-md">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-48">
          <AlertTriangle className="w-8 h-8 text-butter" />
          <p className="mt-2 text-sm font-medium text-graphite">{error || "Could not generate a study plan today. Please check back later."}</p>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate progress based on the fetched plan
  const totalPlannedTime = todaysStudyPlan.reduce((total, session) => total + session.duration, 0);
  const completedTime = todaysStudyPlan
    .filter((session) => completedSessions.includes(session.id))
    .reduce((total, session) => total + session.duration, 0);

  return (
    <div className="space-y-6">
      {/* Active Session Timer */}
      {currentSession && (
        <Card className="shadow-apple-lg bg-gradient-to-br from-pacific/10 to-sage/10 border-pacific/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-responsive-h3">
              <Zap className="w-6 h-6 text-pacific" />
              Active Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-shadow mb-1">{currentSession.topic}</h3>
              <p className="text-graphite">{currentSession.subject}</p>
              <div className="text-4xl font-mono font-bold text-pacific my-4">{formatTime(timeRemaining)}</div>
              <Progress value={currentSession.duration > 0 ? (1 - timeRemaining / (currentSession.duration * 60)) * 100 : 0} className="mb-4" />
            </div>

            <div className="flex items-center justify-center gap-3">
              {!isActive ? (
                <Button onClick={resumeSession} className="bg-pacific hover:bg-midnight">
                  <Play className="w-4 h-4 mr-2" />
                  {timeRemaining === currentSession.duration * 60 ? "Start" : "Resume"}
                </Button>
              ) : (
                <Button onClick={pauseSession} variant="outline">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={resetSession} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={completeSession} className="bg-sage hover:bg-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete
              </Button>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
              <h4 className="font-semibold text-shadow text-sm mb-1">AI Insight</h4>
              <p className="text-xs text-graphite">{currentSession.aiReasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Study Plan */}
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h3">
            <Brain className="w-5 h-5 text-pacific" />
            AI-Optimized Study Plan
            <Badge className="bg-pacific/10 text-pacific ml-auto">Today</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-shadow">Daily Progress</span>
              <span className="text-sm text-graphite">
                {completedTime} / {totalPlannedTime} minutes
              </span>
            </div>
            <Progress value={totalPlannedTime > 0 ? (completedTime / totalPlannedTime) * 100 : 0} className="mb-2" />
            <p className="text-xs text-graphite">
              {completedSessions.length} of {todaysStudyPlan.length} sessions completed
            </p>
          </div>

          <div className="space-y-3">
            {todaysStudyPlan.map((session, index) => {
              const isCompleted = completedSessions.includes(session.id);
              const isCurrent = currentSession?.id === session.id;
              const isNext = !isCompleted && !isCurrent && completedSessions.length === index;

              return (
                <div
                  key={session.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isCompleted
                      ? "bg-sage/10 border-sage/20 opacity-75"
                      : isCurrent
                        ? "bg-pacific/10 border-pacific/30 ring-2 ring-pacific/20"
                        : isNext
                          ? "bg-white/80 border-cloud hover:shadow-apple-sm"
                          : "bg-white/40 border-cloud/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${getSessionColor(session.type)}`}
                      >
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : getSessionIcon(session.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-shadow">{session.topic}</h4>
                        <div className="flex items-center gap-2 text-sm text-graphite">
                          <span>{session.subject}</span>
                          <span>•</span>
                          <span>{session.duration} min</span>
                          <span>•</span>
                          <span className={getDifficultyColor(session.difficulty)}>{session.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isNext && (
                        <Badge className="bg-butter text-shadow" variant="secondary">
                          Up Next
                        </Badge>
                      )}
                      {!isCompleted && !isCurrent && (
                        <Button
                          size="sm"
                          onClick={() => startSession(session)}
                          className="bg-pacific hover:bg-midnight"
                          disabled={!!currentSession} // Disable starting a new session if one is active
                        >
                          Start
                        </Button>
                      )}
                      {isCurrent && (
                        <Badge className="bg-pacific text-frost" variant="secondary">
                          Active
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge className="bg-sage text-frost" variant="secondary">
                          Done
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 bg-white/40 rounded-lg p-2">
                    <p className="text-xs text-graphite">
                      <span className="font-medium">AI Reasoning:</span> {session.aiReasoning}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

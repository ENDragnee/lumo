"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, BarChart } from "lucide-react";

interface DailyActivity {
  date: string;
  dayLabel: string;
  totalHours: number;
  topics: string[];
}

function useWeeklyActivity(userId?: string | null) {
  const [activity, setActivity] = useState<DailyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/analytics/weekly-activity");
      if (!response.ok) {
        throw new Error("Could not load activity data.");
      }
      const data = await response.json();
      setActivity(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchActivity();
    } else {
      setLoading(false);
    }
  }, [userId, fetchActivity]);

  return { activity, loading, error };
}

function ActivityCanvasSkeleton() {
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
  const fixedHeights = [60, 40, 70, 50, 80, 30, 45];

  return (
    <div>
      <div className="flex justify-between items-baseline mb-6">
        <h2 className="text-3xl font-bold text-shadow tracking-tight">Weekly Activity</h2>
        <div className="h-6 bg-gray-200 rounded-md w-32 animate-pulse" />
      </div>
      <Card className="bg-white shadow-apple-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex justify-around items-end h-40">
            {dayLabels.map((label, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-5 bg-gray-200 rounded-full animate-pulse"
                  style={{ height: `${fixedHeights[index]}%` }}
                />
                <span className="text-xs text-gray-400 mt-2">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ActivityCanvas() {
  const { data: session } = useSession();
  const { activity, loading, error } = useWeeklyActivity(session?.user?.id);

  if (loading) {
    return <ActivityCanvasSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="mx-auto h-8 w-8 text-red-500 mb-2" />
        <p className="text-red-600 font-semibold">Could not load activity</p>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!activity || activity.length === 0) {
    return (
      <div className="text-center p-10 bg-gray-50 border border-gray-200 rounded-lg">
        <BarChart className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-gray-600 font-semibold">No Activity Recorded</p>
        <p className="text-gray-500 text-sm">Start some learning sessions to see your activity here.</p>
      </div>
    );
  }

  const maxActivity = Math.max(...activity.map((d) => d.totalHours), 1);
  const totalHours = activity.reduce((sum, day) => sum + day.totalHours, 0).toFixed(1);

  return (
    <div>
      <div className="flex justify-between items-baseline mb-6">
        <h2 className="text-3xl font-bold text-shadow tracking-tight">Weekly Activity</h2>
        <p className="font-semibold text-gray-600">
          {totalHours} hours <span className="font-normal text-gray-500">last 7 days</span>
        </p>
      </div>
      <Card className="bg-white shadow-apple-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex justify-around items-end h-40">
            {activity.map((day, index) => (
              <div key={index} className="flex flex-col items-center group relative">
                <div
                  className="w-5 bg-gradient-to-t from-pacific to-blue-300 rounded-full transition-all duration-500 ease-out hover:from-midnight hover:to-pacific"
                  style={{ height: `${(day.totalHours / maxActivity) * 100}%`, minHeight: "4px" }}
                />
                <span className="text-xs text-gray-500 mt-2">{day.dayLabel}</span>
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-shadow text-frost text-xs px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-max max-w-xs z-10">
                  <p className="font-bold text-sm mb-1">{day.totalHours} hours</p>
                  {day.topics.length > 0 ? (
                    <ul className="list-disc list-inside text-left">
                      {day.topics.map((topic, i) => (
                        <li key={i}>{topic}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-300 italic">No specific topics studied.</p>
                  )}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-shadow"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

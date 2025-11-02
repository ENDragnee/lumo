"use client"

import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { gql, request } from "graphql-request"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, BookOpen, Clock, Download, Filter, Loader2 } from "lucide-react"

// Type Definitions
interface AnalyticsOverviewStats {
  averageEngagement: number;
  averageCompletionRate: number;
  activeLearners: number;
  averageStudyTimeHours: number;
}
interface ContentPerformanceMetric {
  contentId: string;
  title: string;
  completionRate: number;
  avgTimeSpentHours: number;
  enrolledUsers: number;
  avgScore: number;
}
interface UserPerformanceSegment {
  category: string;
  count: number;
  percentage: number;
}
interface AnalyticsPageData {
  getAnalyticsData: {
    overviewStats: AnalyticsOverviewStats;
    contentAnalytics: ContentPerformanceMetric[];
    userAnalytics: UserPerformanceSegment[];
  };
}

// GraphQL Query
const GET_ANALYTICS_DATA = gql`
  query GetAnalyticsData {
    getAnalyticsData {
      overviewStats { averageEngagement, averageCompletionRate, activeLearners, averageStudyTimeHours }
      contentAnalytics { contentId, title, completionRate, avgTimeSpentHours, enrolledUsers, avgScore }
      userAnalytics { category, count, percentage }
    }
  }
`;

const GQL_API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`;
const fetchAnalyticsData = async (): Promise<AnalyticsPageData> => {
  return request(GQL_API_ENDPOINT, GET_ANALYTICS_DATA);
};

export default function AnalyticsPage() {
  const { data, isLoading, isError, error } = useQuery<AnalyticsPageData>({
    queryKey: ['analyticsData'],
    queryFn: fetchAnalyticsData,
  });

  const getSegmentColor = (category: string) => {
    switch (category) {
      case "High Performers": return "bg-green-500";
      case "Average Progress": return "bg-blue-500";
      case "Struggling Users": return "bg-red-500";
      case "Inactive Users": return "bg-gray-400";
      default: return "bg-gray-200";
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="ml-4 text-lg">Loading Analytics...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Failed to load analytics data.</p>
        <p className="text-sm">{(error as Error)?.message}</p>
      </div>
    );
  }
  
  const analytics = data?.getAnalyticsData;

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Analytics & Reporting</h1><p className="text-gray-600 mt-1">Insights into content effectiveness and user engagement</p></div>
        <div className="flex items-center gap-3"><Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Button><Button><Download className="w-4 h-4 mr-2" />Export Report</Button></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle><BarChart3 className="w-4 h-4 text-blue-600" /></CardHeader><CardContent><div className="text-2xl font-bold">{Math.round(analytics?.overviewStats.averageEngagement ?? 0)}%</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Avg. Completion</CardTitle><TrendingUp className="w-4 h-4 text-green-600" /></CardHeader><CardContent><div className="text-2xl font-bold">{Math.round(analytics?.overviewStats.averageCompletionRate ?? 0)}%</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Learners</CardTitle><Users className="w-4 h-4 text-purple-600" /></CardHeader><CardContent><div className="text-2xl font-bold">{analytics?.overviewStats.activeLearners ?? 0}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Avg. Study Time</CardTitle><Clock className="w-4 h-4 text-orange-600" /></CardHeader><CardContent><div className="text-2xl font-bold">{analytics?.overviewStats.averageStudyTimeHours.toFixed(1) ?? 0}h</div></CardContent></Card>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="content">Content Analytics</TabsTrigger><TabsTrigger value="users">User Analytics</TabsTrigger><TabsTrigger value="trends">Trends & Insights</TabsTrigger></TabsList>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Content Performance Metrics</CardTitle><CardDescription>Detailed analytics for each content module including completion rates and engagement</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.contentAnalytics.map((content) => (
                    <div key={content.contentId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div><h4 className="font-medium text-gray-900">{content.title}</h4><p className="text-sm text-gray-500">{content.enrolledUsers} enrolled users</p></div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div><p className="text-sm text-gray-600 mb-1">Completion Rate</p><div className="flex items-center gap-2"><Progress value={content.completionRate} className="flex-1 h-2" /><span className="text-sm font-medium">{Math.round(content.completionRate)}%</span></div></div>
                        <div><p className="text-sm text-gray-600 mb-1">Avg. Time Spent</p><p className="text-lg font-semibold text-gray-900">{content.avgTimeSpentHours.toFixed(1)}h</p></div>
                        <div><p className="text-sm text-gray-600 mb-1">Avg. Score</p><p className="text-lg font-semibold text-gray-900">{Math.round(content.avgScore)}%</p></div>
                        <div><p className="text-sm text-gray-600 mb-1">Enrolled Users</p><p className="text-lg font-semibold text-gray-900">{content.enrolledUsers}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>User Performance Distribution</CardTitle><CardDescription>Breakdown of user performance categories</CardDescription></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.userAnalytics.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3"><div className={`w-3 h-3 rounded-full ${getSegmentColor(category.category)}`} /><span className="text-sm font-medium text-gray-900">{category.category}</span></div>
                        <div className="flex items-center gap-3"><span className="text-sm text-gray-600">{category.count} users</span><span className="text-sm font-medium text-gray-900">{Math.round(category.percentage)}%</span></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Other user analytics cards remain static for now */}
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="mt-6">
            {/* This tab remains mostly static as it contains qualitative insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Key Insights</CardTitle><CardDescription>Important trends and recommendations</CardDescription></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg"><div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-green-600" /><span className="font-medium text-green-900">Positive Trend</span></div><p className="text-sm text-green-800">User engagement has increased by 12% over the last month.</p></div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg"><div className="flex items-center gap-2 mb-2"><BookOpen className="w-4 h-4 text-blue-600" /><span className="font-medium text-blue-900">Recommendation</span></div><p className="text-sm text-blue-800">Consider adding more quizzes to modules with lower average scores to boost performance.</p></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { useSession } from "next-auth/react";
import { StatsCard } from "@/components/stats-card"
import { ActivityFeed } from "@/components/activity-feed"
import { QuickActions } from "@/components/quick-actions"
import { Users, UserCheck, BookOpen, TrendingUp, Bell, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Type definitions (no changes needed)
interface StatValue {
  value: string;
  change: number | null;
}
interface DashboardStatsData {
  getDashboardStats: {
    totalEnrolledUsers: StatValue;
    pendingRegistrations: StatValue;
    publishedContentModules: StatValue;
    averageUserProgress: StatValue;
  };
}

const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    getDashboardStats {
      totalEnrolledUsers {
        value
        change
      }
      pendingRegistrations {
        value
        change
      }
      publishedContentModules {
        value
        change
      }
      averageUserProgress {
        value
        change
      }
    }
  }
`;

// Absolute URL for the API endpoint (no changes needed)
const GQL_API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`;

// 2. Fetcher function (no changes needed)
const fetchDashboardStats = async (): Promise<DashboardStatsData> => {
  return request<DashboardStatsData>(GQL_API_ENDPOINT, GET_DASHBOARD_STATS);
};

export default function DashboardPage() {
  const { data: session } = useSession();

  const { data, isLoading, isError, error } = useQuery<DashboardStatsData>({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });

  // The rest of your component is correct and does not need changes.
  const statsData = data ? [
    {
      title: "Total Enrolled Users",
      value: data.getDashboardStats.totalEnrolledUsers.value,
      change: { value: data.getDashboardStats.totalEnrolledUsers.change ?? 0, type: "increase" as const },
      icon: Users,
      description: "active members",
      trend: { value: data.getDashboardStats.totalEnrolledUsers.change ?? 0, direction: "up" as const },
    },
    {
      title: "Pending Registrations",
      value: data.getDashboardStats.pendingRegistrations.value,
      change: { value: data.getDashboardStats.pendingRegistrations.change ?? 0, type: "increase" as const },
      icon: UserCheck,
      description: "awaiting approval",
      trend: { value: data.getDashboardStats.pendingRegistrations.change ?? 0, direction: "up" as const },
    },
    {
      title: "Published Content Modules",
      value: data.getDashboardStats.publishedContentModules.value,
      change: { value: data.getDashboardStats.publishedContentModules.change ?? 0, type: "increase" as const },
      icon: BookOpen,
      description: "active modules",
      trend: { value: data.getDashboardStats.publishedContentModules.change ?? 0, direction: "up" as const },
    },
    {
      title: "Average User Progress",
      value: data.getDashboardStats.averageUserProgress.value,
      change: { value: data.getDashboardStats.averageUserProgress.change ?? 0, type: "increase" as const },
      icon: TrendingUp,
      description: "completion rate",
      trend: { value: data.getDashboardStats.averageUserProgress.change ?? 0, direction: "up" as const },
    },
  ] : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-lg text-gray-700">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="p-6 text-red-800 bg-red-100 border-l-4 border-red-600 rounded-md">
          <p className="font-bold">Failed to Load Dashboard</p>
          <p className="mt-2">There was an error fetching the required data. Please try refreshing the page.</p>
          <p className="mt-1 text-sm text-red-700">Error: {error instanceof Error ? error.message : "An unknown error occurred"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back, {session?.user?.name}! Here's what's happening with your institution.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            System Status: Online
          </Badge>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards - Now populated with live data from the API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard
            key={stat.title}
            icon={stat.icon}
            value={stat.value}
            title={stat.title}
            change={stat.change}
            description={stat.description}
            trend={stat.trend}
            index={index}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed - Takes 2 columns on large screens */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <ActivityFeed />
        </motion.div>

        {/* Quick Actions - Takes 1 column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <QuickActions />
        </motion.div>
      </div>

      {/* Additional Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">System Health</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Server Uptime</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                99.9%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Response Time</span>
              <Badge variant="secondary">120ms</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Sessions</span>
              <Badge variant="secondary">1,247</Badge>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Content Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Most Popular Module</span>
              <span className="text-sm font-medium text-gray-900">Tax Compliance</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                85%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">Avg. Study Time</span>
              <span className="text-sm font-medium text-gray-900">2.5 hours</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Updates</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Platform Update:</span> New analytics features deployed
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Security:</span> SSL certificates renewed
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Content:</span> 5 new modules published this week
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

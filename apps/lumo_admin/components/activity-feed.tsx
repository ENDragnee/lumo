"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserPlus, BookOpen, FileText, Clock, Eye, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { formatDistanceToNow } from 'date-fns';

interface ActivityItemFromAPI {
  id: string;
  eventType: 'start' | 'end' | 'update';
  timestamp: string;
  user: {
    name: string;
    profileImage: string | null;
  };
  content: {
    title: string;
  };
}

interface RecentActivityResponse {
  getRecentActivity: ActivityItemFromAPI[];
}

// 2. Define the GraphQL query
const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity($limit: Int) {
    getRecentActivity(limit: $limit) {
      id
      eventType
      timestamp
      user {
        name
        profileImage
      }
      content {
        title
      }
    }
  }
`;

// 3. Define the fetcher function
const GQL_API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`;
const fetchRecentActivity = async (): Promise<RecentActivityResponse> => {
  return request(GQL_API_ENDPOINT, GET_RECENT_ACTIVITY, { limit: 5 });
};

// ==========================================================

export function ActivityFeed() {
  // 4. Use React Query to fetch data
  const { data, isLoading, isError, error } = useQuery<RecentActivityResponse>({
    queryKey: ['recentActivity'],
    queryFn: fetchRecentActivity,
  });

  // 5. Transform the fetched data into the format the UI expects
  const transformedActivities = data?.getRecentActivity.map(activity => {
    let action = "";
    let icon;
    let iconColor = "text-gray-600";
    let iconBg = "bg-gray-100";
    let type = "Interaction";

    switch (activity.eventType) {
      case 'start':
        action = `started viewing "${activity.content.title}"`;
        icon = Eye;
        iconColor = 'text-gray-600';
        iconBg = 'bg-gray-100';
        type = 'Content View';
        break;
      case 'end':
        action = `completed interaction with "${activity.content.title}"`;
        icon = BookOpen;
        iconColor = 'text-blue-600';
        iconBg = 'bg-blue-100';
        type = 'Content Completion';
        break;
      case 'update':
        action = `is progressing through "${activity.content.title}"`;
        icon = Clock;
        iconColor = 'text-orange-600';
        iconBg = 'bg-orange-100';
        type = 'Content Progress';
        break;
      default:
        action = `interacted with "${activity.content.title}"`;
        icon = FileText;
        break;
    }

    return {
      id: activity.id,
      action,
      icon,
      iconColor,
      iconBg,
      type,
      user: {
        name: activity.user.name,
        avatar: activity.user.profileImage,
      },
      timestamp: formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }),
    };
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}
        {isError && (
           <div className="p-4 text-center text-red-600">
             Failed to load activity.
           </div>
        )}
        {!isLoading && !isError && (
          <div className="space-y-4">
            {transformedActivities && transformedActivities.length > 0 ? (
              transformedActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 ${activity.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{activity.user.name}</span>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.timestamp}</p>
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {activity.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                No recent activity to display.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

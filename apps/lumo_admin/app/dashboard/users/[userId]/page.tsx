"use client"

import { useState, use } from "react" // Import useState
import { motion } from "framer-motion"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { gql, request } from "graphql-request"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, Phone, Building, Calendar, Loader2, FileText, Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useSession } from "next-auth/react"
import { MessageUserModal } from "@/components/modals/message-user-modal"
import { generateSingleUserPdf } from "@/lib/single-user-pdf-generator"
import { ErrorFallback } from "@/components/error-fallback"

// Type Definitions
interface UserModulePerformance {
  contentId: string;
  title: string;
  performanceScore: number;
  status: string;
  timeSpentSeconds: number;
}
interface ActivityTimelineItem {
  id: string;
  eventType: string;
  timestamp: string;
  content: { title: string };
}
interface UserDetail {
  userId: string; name: string; email: string; profileImage: string | null; registrationDate: string; status: string;
  businessName: string | null; tin: string | null; phone: string | null; address: string | null;
  overallAveragePerformance: number;
  totalModulesCount: number; completedModulesCount: number; totalTimeSpentSeconds: number;
  modulePerformance: UserModulePerformance[];
  activityTimeline: ActivityTimelineItem[];
}
interface UserDetailData {
  getUserDetail: UserDetail;
}

// GraphQL Query
const GET_USER_DETAIL = gql`
  query GetUserDetail($userId: ID!) {
    getUserDetail(userId: $userId) {
      userId name email profileImage registrationDate status
      businessName tin phone address overallAveragePerformance
      totalModulesCount completedModulesCount totalTimeSpentSeconds
      modulePerformance { contentId title performanceScore status timeSpentSeconds }
      activityTimeline { id eventType timestamp content { title } }
    }
  }
`;

const GQL_API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`;
const fetchUserDetail = async (userId: string): Promise<UserDetailData> => {
  return request(GQL_API_ENDPOINT, GET_USER_DETAIL, { userId });
};

type UserDetailProp = {
  params: Promise<{ userId: string }>
}

export default function UserDetailPage({ params }: UserDetailProp) {
  const { userId } = use(params);
  // ✨ --- NEW STATE FOR MODAL --- ✨
  const [isMessageModalOpen, setMessageModalOpen] = useState(false);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<UserDetailData>({
    queryKey: ['userDetail', userId],
    queryFn: () => fetchUserDetail(userId),
    enabled: !!userId,
  });

  const handleRetry = () => {
    // Invalidate the query to trigger a refetch
    queryClient.invalidateQueries({ queryKey: ['userDetail', userId] });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return <ErrorFallback error={error as Error} onRetry={handleRetry} />;
  }

  const userData = data?.getUserDetail;

  if (!userData) {
    return (
      <div className="p-6 text-center text-gray-500">
        User not found or you do not have permission to view this profile.
      </div>
    );
  }
  
  const formatAction = (eventType: string, contentTitle: string) => {
    switch(eventType) {
      case 'start': return `Started "${contentTitle}"`;
      case 'end': return `Completed interaction with "${contentTitle}"`;
      case 'update': return `Progressed in "${contentTitle}"`;
      default: return `Interacted with "${contentTitle}"`;
    }
  };

  // ✨ --- NEW HANDLER FUNCTIONS --- ✨
  const handleGenerateReport = () => {
    if (userData && session?.institution?.name) {
      generateSingleUserPdf(userData, session.institution.name);
    }
  };

  return (
    <>
      {/* ✨ --- RENDER THE MODAL --- ✨ */}
      <MessageUserModal
        isOpen={isMessageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        recipients={userData ? [{ email: userData.email, name: userData.name }] : []}
      />

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/users"><ArrowLeft className="w-4 h-4 mr-2" />Back to Users</Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
              <p className="text-gray-600 mt-1">Detailed view of user information and performance</p>
            </div>
          </div>
          {/* ✨ --- UPDATED BUTTONS --- ✨ */}
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setMessageModalOpen(true)}>
              <Mail className="w-4 h-4 mr-2" />Send Message
            </Button>
            <Button onClick={handleGenerateReport}>
              <FileText className="w-4 h-4 mr-2" />Generate Report
            </Button>
          </div>
        </motion.div>

        {/* ... (Rest of the component JSX is unchanged) ... */}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <Avatar className="w-20 h-20"><AvatarImage src={userData.profileImage || undefined} /><AvatarFallback className="text-lg">{userData.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2"><h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2><Badge variant={userData.status === "active" ? "default" : "secondary"} className="capitalize">{userData.status}</Badge></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{userData.email}</div>
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{userData.phone || 'N/A'}</div>
                    <div className="flex items-center gap-2"><Building className="w-4 h-4" />{userData.businessName || 'N/A'}</div>
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />Registered {new Date(userData.registrationDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{userData.overallAveragePerformance}%</div><p className="text-sm text-gray-600">Avg. Performance</p><Progress value={userData.overallAveragePerformance} className="w-24 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-4"><TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="performance">Performance</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger><TabsTrigger value="certificates">Certificates</TabsTrigger></TabsList>
            
            <TabsContent value="profile" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card><CardHeader><CardTitle>Personal Information</CardTitle></CardHeader><CardContent className="space-y-4"><div><label className="text-sm font-medium text-gray-600">Full Name</label><p className="text-gray-900">{userData.name}</p></div><div><label className="text-sm font-medium text-gray-600">Email Address</label><p className="text-gray-900">{userData.email}</p></div><div><label className="text-sm font-medium text-gray-600">Phone Number</label><p className="text-gray-900">{userData.phone || 'N/A'}</p></div><div><label className="text-sm font-medium text-gray-600">Registration Date</label><p className="text-gray-900">{new Date(userData.registrationDate).toLocaleDateString()}</p></div></CardContent></Card>
                <Card><CardHeader><CardTitle>Business Information</CardTitle></CardHeader><CardContent className="space-y-4"><div><label className="text-sm font-medium text-gray-600">Business Name</label><p className="text-gray-900">{userData.businessName || 'N/A'}</p></div><div><label className="text-sm font-medium text-gray-600">TIN Number</label><p className="text-gray-900">{userData.tin || 'N/A'}</p></div></CardContent></Card>
                </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
                <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-blue-600">{userData.completedModulesCount} / {userData.totalModulesCount}</div><p className="text-sm text-gray-600">Modules Mastered</p></CardContent></Card>
                    <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-green-600">{(userData.totalTimeSpentSeconds / 3600).toFixed(1)}h</div><p className="text-sm text-gray-600">Total Time Spent</p></CardContent></Card>
                    <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-purple-600">{userData.overallAveragePerformance}%</div><p className="text-sm text-gray-600">Avg. Performance</p></CardContent></Card>
                </div>
                <Card>
                    <CardHeader><CardTitle>Module Performance</CardTitle><CardDescription>Detailed performance in each learning module</CardDescription></CardHeader>
                    <CardContent>
                    <div className="space-y-4">
                        {userData.modulePerformance.map((module) => (
                        <div key={module.contentId} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                            <div className="flex items-center justify-between mb-2"><h4 className="font-medium text-gray-900">{module.title}</h4><Badge variant={module.status === "mastered" ? "default" : "secondary"} className="capitalize">{module.status}</Badge></div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1"><Progress value={module.performanceScore} className="h-2" /></div>
                                <span className="text-sm text-gray-600">{Math.round(module.performanceScore)}%</span>
                                <div className="flex items-center gap-1 text-sm text-gray-500"><Clock className="w-3 h-3" />{(module.timeSpentSeconds / 60).toFixed(0)} min</div>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    </CardContent>
                </Card>
                </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
                <Card>
                <CardHeader><CardTitle>Recent Activity</CardTitle><CardDescription>Timeline of user learning activities</CardDescription></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {userData.activityTimeline.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">{formatAction(activity.eventType, activity.content.title)}</p>
                            <p className="text-sm text-gray-500">{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</p>
                        </div>
                        </div>
                    ))}
                    </div>
                </CardContent>
                </Card>
            </TabsContent>
            </Tabs>
        </motion.div>
      </div>
    </>
  )
}

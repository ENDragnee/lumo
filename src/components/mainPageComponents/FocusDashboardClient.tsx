// components/dashboard/FocusDashboardClient.tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Users, ChevronRight, Search, Home, FileText, BarChart3, Menu, X, Download
} from "lucide-react"

import { SmartHubSidebar } from "@/components/navigation/SmartHubSidebar"
import { ForYouSection } from "./ForYouSection"
import { ActivityCanvas } from "./ActivityCanvas"
import { InstitutionHubCard } from "@/components/mainPageComponents/InstitutionHubCard"
import { OfflineIndicator } from "@/components/offline/OfflineIndicator"
import { NotificationCenter } from "@/components/notifications/NotificationCenter"

// Import your other page components
import { MaterialsPage } from "@/components/materials/MaterialsPage" // Assuming you create these
import { PlanPage } from "@/components/plan/PlanPage"
import { AnalyticsPage } from "./AnalyticsPage"
import { ProfilePage } from "@/components/profile/ProfilePage"
import { AIRecommendationsPanel } from "@/components/ai/AIRecommendationsPanel"
import { SmartStudyPlanner } from "@/components/ai/SmartStudyPlanner"
import { OfflineManager } from "@/components/offline/OfflineManager"
import { TeacherProfile } from "@/components/mainPageComponents/TeacherProfile"


const teachersData = [
  {
    id: 1,
    name: "Maya Lin",
    subjects: ["Physics", "Biotech"],
    rating: 4.8,
    avatar: "/placeholder.svg?height=64&width=64",
    department: "Engineering Physics",
    experience: "12 years",
  },
  {
    id: 2,
    name: "Dr. Sarah Rodriguez",
    subjects: ["Chemistry", "Materials"],
    rating: 4.9,
    avatar: "/placeholder.svg?height=64&width=64",
    department: "Chemical Engineering",
    experience: "15 years",
  },
]
// This data is static or comes from the session/user object directly
const staticStudentData = {
    email: "alex.chen@aastu.edu",
    avatar: "/placeholder.svg?height=96&width=96",
    institution: "AASTU",
    institutionData: {
        name: "AASTU Curriculum",
        logo: "/placeholder.svg?height=80&width=80",
        notifications: 3,
        tasks: 1,
        description: "Your primary learning hub",
    },
}

export default function FocusDashboardClient({ user, initialData }: { user: any, initialData: any }) {
    const [activeTab, setActiveTab] = useState("home")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Combine session user data, static data, and fetched initial data
    const studentData = {
        ...staticStudentData,
        ...initialData,
        name: user.name, // Use the name from the session
        email: user.email, // Use the email from the session
    };

    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return (
                    <div className="space-y-12 animate-fade-in">
                        <InstitutionHubCard institution={studentData.institutionData} />
                        <ForYouSection
                            name={studentData.name}
                            upNext={studentData.upNext}
                            focusArea={studentData.focusArea}
                            weeklyGoal={studentData.weeklyGoal}
                        />
                        <ActivityCanvas
                            activity={studentData.activity}
                            totalTasksCompleted={studentData.totalTasksCompleted}
                        />
                    </div>
                )
            // You should have these components created for a full experience
            case "courses": return <MaterialsPage />
            case "plan": return <PlanPage />
            case "analytics": return <AnalyticsPage />
            case "profile": return <ProfilePage />
            case "ai-recommendations":
              return (
                <div className="space-y-8 animate-fade-in">
                  <h1 className="text-4xl font-bold text-shadow tracking-tight">AI Study Assistant</h1>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <AIRecommendationsPanel studentId="alex-chen" />
                    </div>
                    <div>
                      <SmartStudyPlanner />
                    </div>
                  </div>
                </div>
              )
            case "offline":
              return (
                <div className="space-y-8 animate-fade-in">
                  <h1 className="text-4xl font-bold text-shadow tracking-tight">Offline Access</h1>
                  <OfflineManager />
                </div>
              )
            case "teachers":
              return (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-shadow tracking-tight">Teacher Directory</h2>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-graphite" />
                        <input
                          type="text"
                          placeholder="Search teachers..."
                          className="w-[280px] h-[40px] pl-10 pr-4 py-2 border border-cloud rounded-lg focus:outline-none focus:ring-2 focus:ring-pacific bg-white/60 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {teachersData.map((teacher) => (
                      <TeacherProfile key={teacher.id} {...teacher} />
                    ))}
                  </div>
                </div>
              )
            // Add other cases as needed
            default:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <h2 className="text-3xl font-bold text-shadow tracking-tight">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h2>
                        <Card className="bg-white/60 backdrop-blur-sm shadow-apple-md border border-gray-200">
                            <CardContent className="p-12 text-center">
                                <p className="text-gray-600">Content for {activeTab} coming soon...</p>
                            </CardContent>
                        </Card>
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-cloud">
            <SmartHubSidebar activeTab={activeTab} setActiveTab={setActiveTab} user={studentData} />

            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-shadow/50" onClick={() => setIsMobileMenuOpen(false)}>
                    <div
                        className="bg-white/90 backdrop-blur-xl w-64 h-full shadow-apple-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SmartHubSidebar activeTab={activeTab} setActiveTab={setActiveTab} user={studentData} />
                    </div>
                </div>
            )}

            <main className="md:ml-64 flex-1">
                <div className="sticky top-0 z-30 p-6 backdrop-blur-lg bg-white/30 border-b border-black/10">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>

                        <div className="flex-1 max-w-md mx-auto md:mx-0">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-graphite" />
                                <input
                                    type="text"
                                    placeholder="Search courses, materials..."
                                    className="w-full h-10 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pacific"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <OfflineIndicator />
                            <NotificationCenter compact />
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={user.image || staticStudentData.avatar} />
                                <AvatarFallback className="bg-pacific text-frost">
                                    {user.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>

                <div className="p-10">{renderContent()}</div>
            </main>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-black/10 shadow-apple-lg z-40">
                <div className="grid grid-cols-5 py-2">
                    {[
                        { id: "home", icon: Home, label: "Home" },
                        { id: "courses", icon: FileText, label: "Courses" },
                        { id: "offline", icon: Download, label: "Offline" },
                        { id: "plan", icon: BarChart3, label: "Plan" },
                        { id: "teachers", icon: Users, label: "Teachers" },
                    ].map((item) => (
                        <Button
                            key={item.id}
                            variant="ghost"
                            className={`flex flex-col items-center gap-1 h-12 ${activeTab === item.id ? "text-pacific" : ""}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-xs">{item.label}</span>
                        </Button>
                    ))}
                </div>
            </nav>
        </div>
    )
}

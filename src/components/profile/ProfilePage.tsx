import { useState } from "react"
import { SettingsNav } from "@/components/profile/SettingsNav"
import { ProfileDetailsPanel } from "@/components/profile/ProfileDetailsPanel"
import { NotificationSettings } from "@/components/notifications/NotificationSettings"
import { Card, CardContent } from "@/components/ui/card"

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")

  const userData = {
    name: "Alex Chen",
    email: "alex.chen@aastu.edu",
    avatar: "/placeholder.svg?height=96&width=96",
    bio: "Computer Science student passionate about AI and machine learning. Always eager to learn new technologies and solve complex problems.",
    institution: "AASTU",
    joinDate: "September 2023",
    studyStreak: 14,
    totalHours: 127,
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-shadow tracking-tight">Account Settings</h1>
      <div className="flex gap-8">
        <SettingsNav onTabChange={setActiveTab} activeTab={activeTab} />
        <main className="flex-1">
          {activeTab === "profile" && <ProfileDetailsPanel user={userData} />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab !== "profile" && activeTab !== "notifications" && (
            <Card className="bg-white/60 backdrop-blur-sm shadow-apple-md border border-gray-200">
              <CardContent className="p-12 text-center">
                <p className="text-gray-600">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings coming soon...
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}

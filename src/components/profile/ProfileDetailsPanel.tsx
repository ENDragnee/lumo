"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Save, Edit } from "lucide-react"

interface ProfileDetailsPanelProps {
  user: {
    name: string
    email: string
    avatar: string
    bio: string
    institution: string
    joinDate: string
    studyStreak: number
    totalHours: number
  }
}

export function ProfileDetailsPanel({ user }: ProfileDetailsPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio,
  })

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="shadow-apple-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xl bg-pacific text-frost">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0">
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-shadow">{user.name}</h2>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <p className="text-graphite mb-3">{user.email}</p>

              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="bg-pacific/10 text-pacific">
                  {user.institution}
                </Badge>
                <span className="text-sm text-graphite">Member since {user.joinDate}</span>
              </div>

              <p className="text-sm text-graphite">{user.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Stats */}
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="text-lg">Learning Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-pacific mb-1">{user.studyStreak}</div>
              <div className="text-sm text-graphite">Day Study Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sage mb-1">{user.totalHours}</div>
              <div className="text-sm text-graphite">Total Study Hours</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      {isEditing && (
        <Card className="shadow-apple-md">
          <CardHeader>
            <CardTitle className="text-lg">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-shadow mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-cloud rounded-lg focus:outline-none focus:ring-2 focus:ring-pacific"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-shadow mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-cloud rounded-lg focus:outline-none focus:ring-2 focus:ring-pacific resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button onClick={handleSave} className="bg-pacific hover:bg-midnight">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

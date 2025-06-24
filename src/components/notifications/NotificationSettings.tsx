"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Clock, Trophy, Target, Users, Moon, Volume2, Smartphone, Monitor, Settings } from "lucide-react"
import { useNotificationSystem, type NotificationPreferences } from "../../hooks/useNotificationSystem"

export function NotificationSettings() {
  const { preferences, setPreferences, permission, requestPermission } = useNotificationSystem()
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences)

  const handleSave = () => {
    setPreferences(localPreferences)
    // In a real app, this would save to backend
    console.log("Notification preferences saved:", localPreferences)
  }

  const handleReset = () => {
    setLocalPreferences(preferences)
  }

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updateQuietHours = (key: string, value: any) => {
    setLocalPreferences((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [key]: value,
      },
    }))
  }

  const notificationTypes = [
    {
      key: "studyReminders" as keyof NotificationPreferences,
      title: "Study Reminders",
      description: "Get notified about optimal study times and session suggestions",
      icon: <Clock className="w-5 h-5 text-pacific" />,
    },
    {
      key: "achievements" as keyof NotificationPreferences,
      title: "Achievements",
      description: "Celebrate your learning milestones and accomplishments",
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
    },
    {
      key: "deadlines" as keyof NotificationPreferences,
      title: "Deadlines",
      description: "Stay on top of assignment and exam due dates",
      icon: <Target className="w-5 h-5 text-coral" />,
    },
    {
      key: "streaks" as keyof NotificationPreferences,
      title: "Study Streaks",
      description: "Track your daily study consistency",
      icon: <span className="text-lg">🔥</span>,
    },
    {
      key: "social" as keyof NotificationPreferences,
      title: "Social Updates",
      description: "Updates from study groups and peer activities",
      icon: <Users className="w-5 h-5 text-sage" />,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Browser Permission Status */}
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h3">
            <Bell className="w-5 h-5 text-pacific" />
            Browser Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-shadow">Permission Status</h4>
              <p className="text-sm text-graphite">
                {permission === "granted"
                  ? "Browser notifications are enabled"
                  : permission === "denied"
                    ? "Browser notifications are blocked"
                    : "Browser notifications not configured"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={permission === "granted" ? "default" : "secondary"}
                className={permission === "granted" ? "bg-sage text-frost" : ""}
              >
                {permission === "granted" ? "Enabled" : permission === "denied" ? "Blocked" : "Not Set"}
              </Badge>
              {permission !== "granted" && (
                <Button size="sm" onClick={requestPermission}>
                  Enable
                </Button>
              )}
            </div>
          </div>

          {permission === "denied" && (
            <div className="bg-coral/10 border border-coral/20 rounded-lg p-3">
              <p className="text-sm text-coral">
                Notifications are blocked. Please enable them in your browser settings to receive study reminders.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h3">
            <Settings className="w-5 h-5 text-pacific" />
            Notification Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((type) => (
            <div
              key={type.key}
              className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg"
            >
              <div className="flex items-center gap-3">
                {type.icon}
                <div>
                  <h4 className="font-semibold text-shadow">{type.title}</h4>
                  <p className="text-sm text-graphite">{type.description}</p>
                </div>
              </div>
              <Switch
                checked={localPreferences[type.key] as boolean}
                onCheckedChange={(checked) => updatePreference(type.key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h3">
            <Moon className="w-5 h-5 text-pacific" />
            Quiet Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-shadow">Enable Quiet Hours</h4>
              <p className="text-sm text-graphite">Pause notifications during specified hours</p>
            </div>
            <Switch
              checked={localPreferences.quietHours.enabled}
              onCheckedChange={(checked) => updateQuietHours("enabled", checked)}
            />
          </div>

          {localPreferences.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-white/60 backdrop-blur-sm rounded-lg">
              <div>
                <Label htmlFor="start-time" className="text-sm font-medium text-shadow">
                  Start Time
                </Label>
                <input
                  id="start-time"
                  type="time"
                  value={localPreferences.quietHours.start}
                  onChange={(e) => updateQuietHours("start", e.target.value)}
                  className="w-full mt-1 h-9 px-3 py-2 border border-cloud rounded-lg focus:outline-none focus:ring-2 focus:ring-pacific"
                />
              </div>
              <div>
                <Label htmlFor="end-time" className="text-sm font-medium text-shadow">
                  End Time
                </Label>
                <input
                  id="end-time"
                  type="time"
                  value={localPreferences.quietHours.end}
                  onChange={(e) => updateQuietHours("end", e.target.value)}
                  className="w-full mt-1 h-9 px-3 py-2 border border-cloud rounded-lg focus:outline-none focus:ring-2 focus:ring-pacific"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery Frequency */}
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h3">
            <Volume2 className="w-5 h-5 text-pacific" />
            Delivery Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="frequency" className="text-sm font-medium text-shadow">
              Notification Frequency
            </Label>
            <Select
              value={localPreferences.frequency}
              onValueChange={(value: "immediate" | "batched" | "daily") => updatePreference("frequency", value)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="batched">Batched (every 2 hours)</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-graphite mt-1">
              {localPreferences.frequency === "immediate" && "Get notifications as they happen"}
              {localPreferences.frequency === "batched" && "Receive notifications in groups every 2 hours"}
              {localPreferences.frequency === "daily" && "Get a daily summary of all notifications"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Device Preferences */}
      <Card className="shadow-apple-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-responsive-h3">
            <Smartphone className="w-5 h-5 text-pacific" />
            Device Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-4 h-4 text-pacific" />
                <h4 className="font-semibold text-shadow">Desktop</h4>
              </div>
              <p className="text-sm text-graphite">Browser notifications and in-app alerts</p>
            </div>
            <div className="p-3 bg-white/60 backdrop-blur-sm rounded-lg opacity-50">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-4 h-4 text-graphite" />
                <h4 className="font-semibold text-graphite">Mobile App</h4>
              </div>
              <p className="text-sm text-graphite">Coming soon - push notifications</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save/Reset Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleReset}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-pacific hover:bg-midnight">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}

// NotificationSettings.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Clock, Trophy, Target, Users, Moon, Volume2, Smartphone, Monitor, Settings, Loader2 } from "lucide-react";

// The type can be imported from your model file or defined here
export interface NotificationPreferences {
  studyReminders: boolean;
  achievements: boolean;
  deadlines: boolean;
  streaks: boolean;
  social: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: "immediate" | "batched" | "daily";
}

interface NotificationSettingsProps {
    initialPreferences: NotificationPreferences;
    onSave: (newSettings: any) => void;
}

export function NotificationSettings({ initialPreferences, onSave }: NotificationSettingsProps) {
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(initialPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    const status = await Notification.requestPermission();
    setPermission(status);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
        const response = await fetch('/api/settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notifications: localPreferences }),
        });
        if (!response.ok) throw new Error("Failed to save notification settings.");
        onSave({ notifications: localPreferences });
    } catch (error) {
        console.error("Save error:", error);
    } finally {
        setIsSaving(false);
    }
  };

  const handleReset = () => {
    setLocalPreferences(initialPreferences);
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    setLocalPreferences((prev) => ({ ...prev, [key]: value }));
  };
  const updateQuietHours = (key: string, value: any) => {
    setLocalPreferences((prev) => ({ ...prev, quietHours: { ...prev.quietHours, [key]: value } }));
  };

  const notificationTypes = [
    { key: "studyReminders" as const, title: "Study Reminders", description: "Get notified about optimal study times", icon: <Clock className="w-5 h-5 text-pacific" /> },
    { key: "achievements" as const, title: "Achievements", description: "Celebrate your learning milestones", icon: <Trophy className="w-5 h-5 text-yellow-500" /> },
    { key: "deadlines" as const, title: "Deadlines", description: "Stay on top of assignment due dates", icon: <Target className="w-5 h-5 text-coral" /> },
    { key: "streaks" as const, title: "Study Streaks", description: "Track your daily study consistency", icon: <span className="text-lg">🔥</span> },
    { key: "social" as const, title: "Social Updates", description: "Updates from study groups and peers", icon: <Users className="w-5 h-5 text-sage" /> },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-apple-md">
        <CardHeader><CardTitle className="flex items-center gap-2 text-responsive-h3"><Bell className="w-5 h-5 text-pacific" /> Browser Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-shadow">Permission Status</h4>
              <p className="text-sm text-graphite">{ permission === "granted" ? "Browser notifications are enabled" : permission === "denied" ? "Browser notifications are blocked" : "Browser notifications not configured" }</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={permission === "granted" ? "default" : "secondary"} className={permission === "granted" ? "bg-sage text-frost" : ""}>{permission.charAt(0).toUpperCase() + permission.slice(1)}</Badge>
              {permission !== "granted" && <Button size="sm" onClick={requestPermission}>Enable</Button>}
            </div>
          </div>
          {permission === "denied" && <div className="bg-coral/10 border border-coral/20 rounded-lg p-3"><p className="text-sm text-coral">Notifications are blocked. Please enable them in your browser settings to receive reminders.</p></div>}
        </CardContent>
      </Card>

      <Card className="shadow-apple-md">
        <CardHeader><CardTitle className="flex items-center gap-2 text-responsive-h3"><Settings className="w-5 h-5 text-pacific" /> Notification Types</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((type) => (
            <div key={type.key} className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg">
              <div className="flex items-center gap-3">{type.icon}<div><h4 className="font-semibold text-shadow">{type.title}</h4><p className="text-sm text-graphite">{type.description}</p></div></div>
              <Switch checked={localPreferences[type.key] as boolean} onCheckedChange={(checked) => updatePreference(type.key, checked)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-apple-md">
        <CardHeader><CardTitle className="flex items-center gap-2 text-responsive-h3"><Moon className="w-5 h-5 text-pacific" /> Quiet Hours</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><h4 className="font-semibold text-shadow">Enable Quiet Hours</h4><p className="text-sm text-graphite">Pause notifications during specified hours</p></div>
            <Switch checked={localPreferences.quietHours.enabled} onCheckedChange={(checked) => updateQuietHours("enabled", checked)} />
          </div>
          {localPreferences.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-white/60 backdrop-blur-sm rounded-lg">
              <div>
                <Label htmlFor="start-time" className="text-sm font-medium text-shadow">Start Time</Label>
                <input id="start-time" type="time" value={localPreferences.quietHours.start} onChange={(e) => updateQuietHours("start", e.target.value)} className="w-full mt-1 h-9 px-3 py-2 border border-cloud rounded-lg focus:outline-none focus:ring-2 focus:ring-pacific" />
              </div>
              <div>
                <Label htmlFor="end-time" className="text-sm font-medium text-shadow">End Time</Label>
                <input id="end-time" type="time" value={localPreferences.quietHours.end} onChange={(e) => updateQuietHours("end", e.target.value)} className="w-full mt-1 h-9 px-3 py-2 border border-cloud rounded-lg focus:outline-none focus:ring-2 focus:ring-pacific" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleReset}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-pacific hover:bg-midnight">
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}

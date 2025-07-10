// ProfileDetailsPanel.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Save, Edit, Loader2 } from "lucide-react";

interface ProfileDetailsPanelProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    bio?: string;
    institution?: string;
    joinDate: string;
    studyStreak: number;
    totalHours: number;
  };
  onSave: (newSettings: any) => void;
}

export function ProfileDetailsPanel({ user, onSave }: ProfileDetailsPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio || "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
        const response = await fetch('/api/settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile: formData }),
        });
        if (!response.ok) throw new Error("Failed to save profile.");
        onSave({ profile: { ...user, ...formData } });
        setIsEditing(false);
    } catch (error) {
        console.error("Save error:", error);
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-apple-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xl bg-pacific text-frost">
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0">
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-shadow">{isEditing ? formData.name : user.name}</h2>
                {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                )}
              </div>
              <p className="text-graphite mb-3">{user.email}</p>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="bg-pacific/10 text-pacific">{user.institution || 'No Institution'}</Badge>
                <span className="text-sm text-graphite">Member since {user.joinDate}</span>
              </div>
              <p className="text-sm text-graphite">{isEditing ? formData.bio : (user.bio || "No bio yet.")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-apple-md">
        <CardHeader><CardTitle className="text-lg">Learning Statistics</CardTitle></CardHeader>
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

      {isEditing && (
        <Card className="shadow-apple-md">
          <CardHeader><CardTitle className="text-lg">Edit Profile Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-shadow mb-2">Full Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-10 px-3 py-2 border border-cloud rounded-lg focus:outline-none focus:ring-2 focus:ring-pacific" />
            </div>
            <div>
              <label className="block text-sm font-medium text-shadow mb-2">Bio</label>
              <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} className="w-full px-3 py-2 border border-cloud rounded-lg focus:outline-none focus:ring-2 focus:ring-pacific resize-none" placeholder="Tell us about yourself..." />
            </div>
            <div className="flex items-center gap-3 pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => { setIsEditing(false); setFormData({ name: user.name, bio: user.bio || "" }); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

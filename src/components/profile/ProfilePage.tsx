// ProfilePage.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SettingsNav } from "@/components/profile/SettingsNav";
import { ProfileDetailsPanel } from "@/components/profile/ProfileDetailsPanel";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";
import { SecurityPanel } from "@/components/profile/SecurityPanel";
import { SubscriptionPanel } from "@/components/profile/SubscriptionPanel";
import { DataPrivacyPanel } from "@/components/profile/DataPrivacyPanel";
import { SupportPanel } from "@/components/profile/SupportPanel";
import { Loader2 } from "lucide-react";

// Define a type for the combined data we'll fetch
export interface UserSettingsData {
  profile: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
    bio?: string;
    institution?: string;
    createdAt: string;
  };
  notifications: any; // Using `any` for simplicity, could import the type from the model
  subscriptions: any[];
}

export function ProfilePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState<UserSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchSettings = async () => {
        try {
          setLoading(true);
          const response = await fetch('/api/settings');
          if (!response.ok) {
            throw new Error('Failed to load account settings.');
          }
          const data = await response.json();
          setSettings(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchSettings();
    } else if (status === 'unauthenticated') {
      // Handle case where user is not logged in, e.g., redirect or show message
      setLoading(false);
      setError("You must be logged in to view settings.");
    }
  }, [status]);

  const handleSettingsUpdate = (updatedData: Partial<UserSettingsData>) => {
    if (settings) {
      setSettings(prev => ({
        ...prev!,
        ...updatedData
      }));
    }
  };

  const handleUnsubscribe = (creatorId: string) => {
    if (settings) {
        setSettings(prev => ({
            ...prev!,
            subscriptions: prev!.subscriptions.filter(sub => sub.creatorId._id !== creatorId)
        }));
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (error || !settings) {
    return <div className="text-center text-red-500 p-8">{error || "Could not load settings."}</div>;
  }
  
  const userDataForPanel = {
    ...settings.profile,
    avatar: settings.profile.profileImage || "/placeholder.svg",
    joinDate: new Date(settings.profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    studyStreak: 14, // Placeholder
    totalHours: 127, // Placeholder
  };

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'profile':
        return <ProfileDetailsPanel user={userDataForPanel} onSave={handleSettingsUpdate} />;
      case 'notifications':
        return <NotificationSettings initialPreferences={settings.notifications} onSave={handleSettingsUpdate} />;
      case 'security':
        return <SecurityPanel user={settings.profile}/>;
      case 'subscription':
        return <SubscriptionPanel subscriptions={settings.subscriptions} onUnsubscribe={handleUnsubscribe} />;
      case 'privacy':
        return <DataPrivacyPanel />;
      case 'support':
        return <SupportPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-shadow tracking-tight">Account Settings</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <SettingsNav onTabChange={setActiveTab} activeTab={activeTab} />
        <main className="flex-1">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}

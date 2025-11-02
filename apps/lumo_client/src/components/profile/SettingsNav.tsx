"use client"

import { Button } from "@/components/ui/button"
import { User, Shield, Bell, CreditCard, Database, HelpCircle } from "lucide-react"

interface SettingsNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function SettingsNav({ activeTab, onTabChange }: SettingsNavProps) {
  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "privacy", label: "Data & Privacy", icon: Database },
    { id: "support", label: "Help & Support", icon: HelpCircle },
  ]

  return (
    <nav className="w-64 bg-white/60 backdrop-blur-sm rounded-lg border border-cloud p-2">
      <div className="space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className="w-full justify-start h-10"
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className="w-4 h-4 mr-3" />
            {item.label}
          </Button>
        ))}
      </div>
    </nav>
  )
}

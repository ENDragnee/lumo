"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  BookOpen,
  Calendar,
  Users,
  HelpCircle,
  Star,
  ChevronDown,
  Settings,
  LogOut,
  User,
  Bell,
  ChevronRight,
  Brain,
  Download,
  WifiOff,
  School, // Import the School icon
} from "lucide-react"
import { useOfflineSync } from "../../hooks/useOfflineSync"
import { signOut } from "next-auth/react"
import { formatAbsoluteDate, formatRelativeDate } from "@/lib/format-date"
import { useRouter } from "next/navigation"
import { getHistory, HistoryItem } from "@/app/actions/history";
import { getRecentSubscriptions, SubscribedCreator as SubscribedCreatorType } from '@/app/actions/subscriptions'; // Renamed to avoid conflict

interface SmartHubSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  user: {
    name: string
    email: string
    profileImage: string
    institution: string
  }
}

export function SmartHubSidebar({ activeTab, setActiveTab, user }: SmartHubSidebarProps) {
  const [isClient, setIsClient] = useState(false)
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(true)
  const { isOnline, stats } = useOfflineSync()
  const [recentHistories, setRecentHistories] = useState<HistoryItem[]>([])
  const [subscriptions, setSubscriptions] = useState<SubscribedCreatorType[]>([])
  const [planStats, setPlanStats] = useState<any>({ total: 0, completed: 0, overdue: 0 })
  const router = useRouter()
  
  const fetchRecentHistories = async () => {
    try {
      const historyData = await getHistory({ limit: 3, offset: 0 });
      console.log("Recent Histories:", historyData);
      setRecentHistories(historyData);
    } catch (error) {
      console.error("Failed to fetch recent histories:", error);
    }
  };
  
  const fetchSubscribed = async () => {
    try {
      const subscriptionsData = await getRecentSubscriptions({ limit: 5 });
      setSubscriptions(subscriptionsData);
    } catch (error) {
      console.log("Failed to fetch stars:", error);
    }
  };

  const fetchPlanStat = async () => {
    try {
      const response = await fetch("/api/tasks/stats");
      if (response.ok) {
        const data = await response.json();
        setPlanStats(data);
      }
    } catch (error) {
      console.log("Failed to fetch stars:", error);
    }
  };

  useEffect(() => {
    setIsClient(true)
    fetchRecentHistories();
    fetchPlanStat();
    fetchSubscribed();
  }, [])

  // Zone 1: Primary Workspace
  const primaryNav = [
    { id: "home", name: "Home", icon: Home, href: "#" },
    { id: "courses", name: "Courses", icon: BookOpen, href: "#" },
    { id: "plan", name: "Plan", icon: Calendar, href: "#", badge: planStats.total },
    { id: "ai-recommendations", name: "AI Assistant", icon: Brain, href: "#" },
    {
      id: "offline",
      name: "Offline Access",
      icon: isOnline ? Download : WifiOff,
      href: "#",
      badge: stats.totalDownloaded > 0 ? stats.totalDownloaded.toString() : undefined,
      status: isOnline ? "online" : "offline",
    },
  ]

  // Zone 3: Resources
  const resources = [
    // <-- CHANGE HERE: Replaced 'Teachers' with 'Institutions'
    { id: "institutions", name: "Institutions", icon: School, href: "#" }, 
    { id: "help", name: "Help Center", icon: HelpCircle, href: "#" },
  ]

  const NavLink = ({ item, isActive = false, onClick, children }: any) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={`w-full justify-start h-10 ${
        isActive
          ? "bg-gray-900/10 text-gray-900 hover:bg-gray-900/15"
          : "text-gray-600 hover:bg-gray-900/5 hover:text-gray-800"
      } ${item.status === "offline" ? "text-red-600" : ""}`}
      onClick={onClick}
    >
      <item.icon className="w-4 h-4 mr-3" />
      <span className="flex-1 text-left">{item.name}</span>
      {children}
    </Button>
  )

  const CourseShortcut = ({ course }: any) => (
    <Button
      variant="ghost"
      className="w-full justify-start h-9 text-gray-600 hover:bg-gray-900/5 hover:text-gray-800 group"
      onClick={() => router.push(`/content/${course._id}`)}
    >
      <span className={`w-2 h-2 mr-3 rounded-full ${course.color}`} />
      <div className="flex-1 text-left min-w-0">
        <div className="text-sm font-medium truncate">{course.title}</div>
        <div className="text-xs text-gray-400 truncate">
          {course.progress || "0"}% • {formatAbsoluteDate(course.latestInteractionTime)}
        </div>
      </div>
      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Button>
  )

  const SubscribedCreator = ({ item }: { item: SubscribedCreatorType }) => (
    <Button
      variant="ghost"
      className="w-full justify-start h-9 text-gray-600 hover:bg-gray-900/5 hover:text-gray-800"
      onClick={() => router.push(`/creator/${item._id}`)}
    >
      <Star className="w-4 h-4 mr-3 text-yellow-500" />
      <div className="flex-1 text-left min-w-0">
        <div className="text-sm font-medium truncate">{item.name}</div>
        <div className="text-xs text-gray-400 capitalize">{formatRelativeDate(item.subscribedAt)}</div>
      </div>
    </Button>
  )

  return (
    <div className="hidden md:flex fixed inset-y-0 left-0 w-64 p-3 flex-col border-r border-black/10 bg-white/60 backdrop-blur-xl z-40">
      {/* Header */}
      <div className="flex items-center flex-shrink-0 px-3 py-2 mb-6">
        <h1 className="text-xl font-bold text-midnight">EduPortal</h1>
        {isClient && !isOnline && (
          <Badge className="ml-auto bg-red-100 text-red-800 text-xs">
            <WifiOff className="w-3 h-3 mr-1" />
            Offline
          </Badge>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col h-full space-y-6">
          {/* Zone 1: Primary Workspace */}
          <div className="space-y-1">
            {primaryNav.map((item) => (
              <NavLink key={item.id} item={item} isActive={activeTab === item.id} onClick={() => setActiveTab(item.id)}>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className={`text-xs ml-auto ${
                      item.status === "offline" ? "bg-red-100 text-red-800" : "bg-coral text-frost"
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            ))}
          </div>

          {/* Zone 2: Smart Shortcuts */}
          <div className="space-y-4">
            {/* Active Courses */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Courses</h3>
              <div className="space-y-1">
                {recentHistories.map((course) => (
                  <CourseShortcut key={course._id} course={course} />
                ))}
              </div>
            </div>

            {/* Favorites */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subscribed to</h3>
              <div className="space-y-1">
                {subscriptions.map((item) => (
                  <SubscribedCreator key={item._id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Zone 3: Resources (Collapsible) */}
          <div className="mt-auto space-y-4">
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between h-8 text-gray-500 hover:text-gray-700 px-3"
                onClick={() => setIsResourcesExpanded(!isResourcesExpanded)}
              >
                <span className="text-xs font-semibold uppercase tracking-wider">Resources</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isResourcesExpanded ? "rotate-180" : ""}`} />
              </Button>

              {isResourcesExpanded && (
                <div className="mt-2 space-y-1">
                  {resources.map((item) => (
                    <NavLink
                      key={item.id}
                      item={item}
                      isActive={activeTab === item.id}
                      onClick={() => setActiveTab(item.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Zone 3 Continued: Profile Anchor */}
      <div className="flex-shrink-0 pt-4 mt-4 border-t border-gray-900/10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start h-auto p-3 hover:bg-gray-900/5">
              <Avatar className="w-9 h-9">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="bg-pacific text-frost text-sm">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1 text-left">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.institution}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-white/90 backdrop-blur-sm">
            <DropdownMenuItem onClick={() => setActiveTab("profile")} className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("profile")} className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("notifications")} className="cursor-pointer">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

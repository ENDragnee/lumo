"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  BellRing,
  Check,
  X,
  Settings,
  Trash2,
  Clock,
  Trophy,
  Target,
  Users,
  Zap,
  MoreHorizontal,
} from "lucide-react"
import { useNotificationSystem, type Notification } from "../../hooks/useNotificationSystem"

interface NotificationCenterProps {
  compact?: boolean
}

export function NotificationCenter({ compact = false }: NotificationCenterProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    triggerAchievement,
    triggerDeadlineReminder,
    triggerStreakNotification,
  } = useNotificationSystem()

  const [isOpen, setIsOpen] = useState(false)

  const getNotificationIcon = (type: string, icon?: string) => {
    if (icon) return icon

    switch (type) {
      case "reminder":
        return <Clock className="w-4 h-4" />
      case "achievement":
        return <Trophy className="w-4 h-4" />
      case "motivation":
        return <Zap className="w-4 h-4" />
      case "deadline":
        return <Target className="w-4 h-4" />
      case "streak":
        return <span className="text-sm">🔥</span>
      case "social":
        return <Users className="w-4 h-4" />
      case "system":
        return <Bell className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500 bg-red-50"
      case "high":
        return "border-l-orange-500 bg-orange-50"
      case "medium":
        return "border-l-blue-500 bg-blue-50"
      case "low":
        return "border-l-gray-500 bg-gray-50"
      default:
        return "border-l-gray-300 bg-white"
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const handleNotificationAction = (notification: Notification, actionType: string) => {
    switch (actionType) {
      case "start_session":
      case "start_review":
      case "quick_review":
        console.log("Starting study session...")
        break
      case "share":
      case "share_streak":
        console.log("Sharing achievement...")
        break
      case "view_stats":
      case "view_progress":
        console.log("Viewing progress...")
        break
      case "snooze":
        console.log("Snoozing notification...")
        break
      default:
        console.log(`Action: ${actionType}`)
    }
    markAsRead(notification.id)
  }

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div
      className={`p-4 border-l-4 transition-all hover:shadow-sm ${getPriorityColor(notification.priority)} ${
        !notification.read ? "ring-1 ring-blue-200" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
            {getNotificationIcon(notification.type, notification.icon)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-shadow text-sm truncate">{notification.title}</h4>
              {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
            </div>
            <p className="text-sm text-graphite mb-2">{notification.message}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{formatTimeAgo(notification.timestamp)}</span>
              <Badge variant="outline" className="text-xs capitalize">
                {notification.type}
              </Badge>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!notification.read && (
              <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                <Check className="w-3 h-3 mr-2" />
                Mark as read
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => removeNotification(notification.id)}>
              <X className="w-3 h-3 mr-2" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {notification.actionable && notification.actions && (
        <div className="flex items-center gap-2 mt-3">
          {notification.actions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              variant={action.style === "primary" ? "default" : "outline"}
              className={`text-xs h-7 ${
                action.style === "danger" ? "border-red-300 text-red-600 hover:bg-red-50" : ""
              }`}
              onClick={() => handleNotificationAction(notification, action.action)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )

  // Demo functions for testing
  const triggerDemoNotifications = () => {
    // Achievement notification
    triggerAchievement({
      title: "Course Completed! 🎉",
      description: "You've successfully completed Organic Chemistry Lab",
      icon: "🎓",
      type: "completion",
      metadata: { courseId: "chem-lab-101" },
    })

    // Deadline reminder
    setTimeout(() => {
      triggerDeadlineReminder({
        title: "Physics Problem Set 3",
        subject: "Physics",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        priority: "high",
      })
    }, 1000)

    // Streak notification
    setTimeout(() => {
      triggerStreakNotification(14)
    }, 2000)
  }

  if (compact) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            {unreadCount > 0 ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-coral text-frost text-xs">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-shadow">Notifications</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={triggerDemoNotifications}>
                  <Zap className="w-3 h-3" />
                </Button>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <Check className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          <ScrollArea className="max-h-96">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-graphite">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.slice(0, 5).map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            )}
          </ScrollArea>
          {notifications.length > 5 && (
            <div className="p-2 border-t">
              <Button variant="ghost" size="sm" className="w-full">
                View all notifications
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Card className="shadow-apple-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-responsive-h3">
            <Bell className="w-5 h-5 text-pacific" />
            Notifications
            {unreadCount > 0 && <Badge className="bg-coral text-frost">{unreadCount}</Badge>}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={triggerDemoNotifications}>
              <Zap className="w-4 h-4 mr-2" />
              Demo
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={markAllAsRead} disabled={unreadCount === 0}>
                  <Check className="w-4 h-4 mr-2" />
                  Mark all as read
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearAll} disabled={notifications.length === 0}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear all
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Notification settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-graphite">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold mb-2">No notifications yet</h3>
              <p className="text-sm">We'll notify you about study reminders and achievements</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

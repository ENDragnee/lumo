import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, FileText, Users, BarChart3 } from "lucide-react"

const featureDetails = {
  dashboard: {
    title: "Dashboard Studio",
    icon: Home,
    components: [
      {
        name: "Stats Cards",
        description: "Real-time metrics display",
        features: ["Total Enrolled Users", "Pending Registrations", "Published Content", "Average Progress"],
      },
      {
        name: "Activity Feed",
        description: "Recent platform activity",
        features: ["User Registrations", "Content Interactions", "System Updates", "Notifications"],
      },
      {
        name: "Quick Actions",
        description: "One-click common tasks",
        features: ["Create Content", "View Pending Users", "Generate Reports", "Bulk Operations"],
      },
    ],
  },
  content: {
    title: "Content Management",
    icon: FileText,
    components: [
      {
        name: "Content Editor",
        description: "Rich content creation interface",
        features: ["WYSIWYG Editor", "Media Embedding", "Code Highlighting", "Preview Mode"],
      },
      {
        name: "Module Organization",
        description: "Drag-and-drop course structure",
        features: ["Course Builder", "Module Reordering", "Chapter Management", "Prerequisites"],
      },
      {
        name: "Content Library",
        description: "Centralized content management",
        features: ["Search & Filter", "Version Control", "Bulk Operations", "Content Templates"],
      },
    ],
  },
  users: {
    title: "User Management",
    icon: Users,
    components: [
      {
        name: "User Dashboard",
        description: "Complete user lifecycle management",
        features: ["Registration Approval", "Progress Tracking", "User Profiles", "Communication Tools"],
      },
      {
        name: "Bulk Operations",
        description: "Efficient mass user management",
        features: ["Bulk Approval", "Mass Messaging", "Group Actions", "Export Data"],
      },
      {
        name: "Analytics Integration",
        description: "User behavior insights",
        features: ["Engagement Metrics", "Learning Paths", "Completion Rates", "Performance Tracking"],
      },
    ],
  },
  analytics: {
    title: "Analytics & Reporting",
    icon: BarChart3,
    components: [
      {
        name: "Content Analytics",
        description: "Content performance metrics",
        features: ["Completion Rates", "Engagement Time", "Quiz Scores", "Popular Content"],
      },
      {
        name: "User Analytics",
        description: "User behavior and progress",
        features: ["Learning Progression", "Struggling Users", "Cohort Analysis", "Retention Metrics"],
      },
      {
        name: "Custom Reports",
        description: "Tailored reporting system",
        features: ["Report Builder", "Scheduled Reports", "Data Export", "Visualization Tools"],
      },
    ],
  },
}

export default function FeatureBreakdown() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Feature Deep Dive</h2>
        <p className="text-muted-foreground">Comprehensive breakdown of core platform capabilities</p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {Object.entries(featureDetails).map(([key, feature]) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-2">
              <feature.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{feature.title.split(" ")[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(featureDetails).map(([key, feature]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">Complete feature overview and capabilities</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {feature.components.map((component, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{component.name}</CardTitle>
                    <CardDescription className="text-sm">{component.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {component.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {feat}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

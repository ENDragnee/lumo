import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, FileText, Home, Palette } from "lucide-react"

const platformFeatures = [
  {
    icon: Home,
    title: "Dashboard Studio",
    description: "Central command center with real-time metrics and quick actions",
    components: ["Stats Cards", "Activity Feed", "Quick Actions"],
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: FileText,
    title: "Content Management",
    description: "Full CRUD operations for educational content with rich editing",
    components: ["Content Editor", "Module Organization", "Media Upload"],
    color: "bg-green-50 text-green-700",
  },
  {
    icon: Users,
    title: "User Lifecycle",
    description: "Complete user management from registration to graduation",
    components: ["User Dashboard", "Progress Tracking", "Bulk Actions"],
    color: "bg-purple-50 text-purple-700",
  },
  {
    icon: BarChart3,
    title: "Analytics Engine",
    description: "Deep insights into content performance and user engagement",
    components: ["Content Analytics", "User Metrics", "Trend Analysis"],
    color: "bg-orange-50 text-orange-700",
  },
  {
    icon: Palette,
    title: "Brand Customization",
    description: "White-label portal with institution-specific branding",
    components: ["Logo Upload", "Color Themes", "Custom Domains"],
    color: "bg-pink-50 text-pink-700",
  },
]

export default function PlatformOverview() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Lumo Institution Creator Portal</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A comprehensive self-service platform empowering educational institutions to manage content, users, and
          branding autonomously
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platformFeatures.map((feature, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-3`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription className="text-sm">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {feature.components.map((component, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {component}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

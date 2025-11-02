import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const architectureLayers = [
  {
    layer: "Presentation Layer",
    technologies: ["Next.js 15", "TypeScript", "shadcn/ui", "Tailwind CSS"],
    description: "Modern React-based frontend with server-side rendering",
  },
  {
    layer: "Business Logic",
    technologies: ["Server Actions", "API Routes", "Middleware", "Validation"],
    description: "Secure business logic with proper authentication and authorization",
  },
  {
    layer: "Data Layer",
    technologies: ["PostgreSQL", "Prisma ORM", "Redis Cache", "File Storage"],
    description: "Robust data persistence with caching and media storage",
  },
  {
    layer: "Infrastructure",
    technologies: ["Vercel", "Docker", "CI/CD", "Monitoring"],
    description: "Scalable deployment with automated testing and monitoring",
  },
]

export default function SystemArchitecture() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Technical Architecture</h2>
        <p className="text-muted-foreground">Built on modern, scalable technologies for enterprise-grade performance</p>
      </div>

      <div className="space-y-4">
        {architectureLayers.map((layer, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                {layer.layer}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{layer.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {layer.technologies.map((tech, idx) => (
                  <Badge key={idx} variant="outline">
                    {tech}
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

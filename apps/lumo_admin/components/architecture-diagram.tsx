"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Server, Globe, Shield, Zap, Users } from "lucide-react"

const architectureComponents = [
  {
    icon: Globe,
    title: "Frontend Layer",
    description: "Modern web interface built with Next.js 15",
    technologies: ["React 18", "TypeScript", "Tailwind CSS", "Server Components"],
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Server,
    title: "Application Layer",
    description: "Scalable backend services and API endpoints",
    technologies: ["Node.js", "Server Actions", "API Routes", "Middleware"],
    color: "from-green-500 to-green-600",
  },
  {
    icon: Database,
    title: "Data Layer",
    description: "Enterprise-grade data management and storage",
    technologies: ["PostgreSQL", "Prisma ORM", "Redis Cache", "File Storage"],
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Shield,
    title: "Security Layer",
    description: "Multi-layered security and compliance framework",
    technologies: ["OAuth 2.0", "JWT", "RBAC", "Data Encryption"],
    color: "from-red-500 to-red-600",
  },
  {
    icon: Zap,
    title: "Integration Layer",
    description: "Seamless connectivity with external systems",
    technologies: ["REST APIs", "Webhooks", "SSO", "LDAP"],
    color: "from-yellow-500 to-yellow-600",
  },
  {
    icon: Users,
    title: "Management Layer",
    description: "Administrative controls and monitoring",
    technologies: ["Analytics", "Logging", "Monitoring", "Backup"],
    color: "from-indigo-500 to-indigo-600",
  },
]

export function ArchitectureDiagram() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">System Architecture</h3>
        <p className="text-gray-600">Enterprise-grade architecture designed for scalability and security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {architectureComponents.map((component, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full border border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${component.color} rounded-lg flex items-center justify-center mb-3`}
                >
                  <component.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{component.title}</CardTitle>
                <p className="text-sm text-gray-600">{component.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {component.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

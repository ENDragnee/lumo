// @/app/landing/page.tsx
"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Users, BarChart3, Palette, Shield, Settings, Database } from "lucide-react"
import { CapabilityCard } from "@/components/capability-card"
import { ArchitectureDiagram } from "@/components/architecture-diagram"
import Link from "next/link"

const platformCapabilities = [
  {
    icon: BookOpen,
    title: "Content Management System",
    description: "Comprehensive educational content creation and organization",
    capabilities: [
      "Rich text editor with multimedia support",
      "Drag-and-drop course builder interface",
      "Version control and content templates",
      "Multi-format content support (PDF, Video, Interactive)",
      "Automated content organization and categorization",
    ],
    technical: ["TipTap Editor", "File Upload API", "Content Versioning", "Media Processing"],
  },
  {
    icon: Users,
    title: "User Lifecycle Management",
    description: "Complete user administration and progress tracking system",
    capabilities: [
      "Automated user registration and approval workflows",
      "Comprehensive progress tracking and analytics",
      "Bulk user operations and management tools",
      "Custom user roles and permission management",
      "Detailed user activity logging and reporting",
    ],
    technical: ["RBAC System", "Bulk Operations API", "Progress Analytics", "Activity Logging"],
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting Engine",
    description: "Advanced data analytics and business intelligence platform",
    capabilities: [
      "Real-time performance dashboards and metrics",
      "Custom report generation and scheduling",
      "User behavior analysis and insights",
      "Content effectiveness measurement",
      "Predictive analytics for learning outcomes",
    ],
    technical: ["Chart.js", "Data Visualization", "Custom Reports", "Real-time Analytics"],
  },
  {
    icon: Palette,
    title: "Brand Customization Framework",
    description: "White-label platform with institutional branding capabilities",
    capabilities: [
      "Custom logo and color scheme integration",
      "Branded learning portals and interfaces",
      "Custom domain and subdomain support",
      "Responsive design across all devices",
      "Theme management and preview system",
    ],
    technical: ["CSS Variables", "Theme Engine", "Domain Management", "Responsive Design"],
  },
  {
    icon: Shield,
    title: "Security & Compliance Suite",
    description: "Enterprise-grade security with regulatory compliance",
    capabilities: [
      "Multi-factor authentication and SSO integration",
      "Role-based access control (RBAC)",
      "Data encryption at rest and in transit",
      "Audit trails and compliance reporting",
      "GDPR and institutional data protection compliance",
    ],
    technical: ["OAuth 2.0", "JWT Tokens", "AES Encryption", "Audit Logging"],
  },
  {
    icon: Settings,
    title: "System Integration Hub",
    description: "Seamless connectivity with existing institutional systems",
    capabilities: [
      "RESTful API with comprehensive documentation",
      "Webhook support for real-time notifications",
      "LDAP and Active Directory integration",
      "Third-party LMS and SIS connectivity",
      "Custom integration development support",
    ],
    technical: ["REST APIs", "Webhooks", "LDAP", "Custom Integrations"],
  },
]

const technicalSpecifications = [
  {
    category: "Performance",
    specs: [
      "99.9% uptime SLA guarantee",
      "Sub-second page load times",
      "Concurrent user support: 10,000+",
      "Auto-scaling infrastructure",
    ],
  },
  {
    category: "Security",
    specs: [
      "SOC 2 Type II compliance",
      "ISO 27001 certified infrastructure",
      "End-to-end data encryption",
      "Regular security audits and penetration testing",
    ],
  },
  {
    category: "Integration",
    specs: [
      "RESTful API with rate limiting",
      "Webhook support for real-time events",
      "SAML 2.0 and OAuth 2.0 support",
      "Custom integration consulting available",
    ],
  },
  {
    category: "Scalability",
    specs: [
      "Horizontal scaling architecture",
      "CDN-powered content delivery",
      "Database clustering and replication",
      "Load balancing and failover systems",
    ],
  },
]

export default function InstitutionalLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Lumo</span>
              <p className="text-xs text-gray-600">Institution Creator Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Access Portal
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-200 px-4 py-2">
              Enterprise Educational Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Institutional Learning
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {" "}
                Management Platform
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A comprehensive self-service platform designed for government agencies, educational institutions, and
              organizations to autonomously manage educational content, user lifecycle, and institutional branding with
              enterprise-grade security and scalability.
            </p>
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto mt-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Database className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Content Management</h3>
                  <p className="text-sm text-gray-600">
                    Full CRUD operations for educational content with rich editing capabilities
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">User Administration</h3>
                  <p className="text-sm text-gray-600">
                    Complete user lifecycle management with progress tracking and analytics
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Enterprise Security</h3>
                  <p className="text-sm text-gray-600">
                    SOC 2 compliant with advanced security features and audit capabilities
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-gray-100 text-gray-700 border-gray-200">Platform Capabilities</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Comprehensive Educational Management Suite
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Built specifically for institutional requirements with enterprise-grade features, security, and
              scalability to support large-scale educational initiatives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {platformCapabilities.map((capability, index) => (
              <CapabilityCard key={index} {...capability} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <ArchitectureDiagram />
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">Technical Specifications</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Enterprise-Grade Infrastructure</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Built on modern, scalable technologies with enterprise security and compliance standards.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technicalSpecifications.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white border border-gray-200 rounded-xl p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg">{spec.category}</h3>
                  <ul className="space-y-2">
                    {spec.specs.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Implement Institutional Learning Management?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Contact our team to discuss your institutional requirements and implementation timeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/login">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                  Access Portal
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg bg-transparent"
              >
                Technical Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Lumo</span>
                  <p className="text-xs text-gray-400">Institution Creator Portal</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Enterprise educational platform designed for government agencies and institutional learning management.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Content Management</li>
                <li>User Administration</li>
                <li>Analytics & Reporting</li>
                <li>System Integration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Technical Documentation</li>
                <li>Implementation Support</li>
                <li>System Administration</li>
                <li>Security & Compliance</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Lumo Institution Creator Portal. Enterprise Educational Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

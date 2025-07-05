"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
import Progress from "@/components/test/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle, Clock, Award, User, Menu, X, Play, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const modules = [
  {
    id: 1,
    title: "Introduction to Ethiopian Tax System",
    description: "Overview of ERCA, federal vs regional tax, tax categories",
    duration: "30 min",
    status: "available",
  },
  {
    id: 2,
    title: "Business Registration & TIN",
    description: "Licensing, TIN (Taxpayer Identification Number), legal structures",
    duration: "45 min",
    status: "locked",
  },
  {
    id: 3,
    title: "Understanding VAT",
    description: "VAT eligibility, thresholds, and filing",
    duration: "60 min",
    status: "locked",
  },
  {
    id: 4,
    title: "Turnover Tax (TOT) Simplified",
    description: "Who qualifies, how it's calculated",
    duration: "40 min",
    status: "locked",
  },
  {
    id: 5,
    title: "Income Tax for Small Businesses",
    description: "Profit-based tax, income brackets",
    duration: "50 min",
    status: "locked",
  },
  {
    id: 6,
    title: "Withholding Tax",
    description: "When and how to withhold taxes from suppliers and contractors",
    duration: "35 min",
    status: "locked",
  },
  {
    id: 7,
    title: "Payroll Tax and Pensions",
    description: "PAYE, pension contributions, and employment tax",
    duration: "45 min",
    status: "locked",
  },
  {
    id: 8,
    title: "Electronic Tax Filing (ERCA)",
    description: "Demonstrate ERCA's digital tax services step-by-step",
    duration: "55 min",
    status: "locked",
  },
  {
    id: 9,
    title: "Penalties and Compliance",
    description: "What happens if you don't file, common errors",
    duration: "40 min",
    status: "locked",
  },
  {
    id: 10,
    title: "Tax Planning Strategies",
    description: "Legal ways to reduce taxable income, keep good records",
    duration: "50 min",
    status: "locked",
  },
  {
    id: 11,
    title: "Record Keeping & Documentation",
    description: "Best practices, what documents to keep and for how long",
    duration: "35 min",
    status: "locked",
  },
  {
    id: 12,
    title: "Audits and Assessments",
    description: "How audits are triggered, what to expect",
    duration: "45 min",
    status: "locked",
  },
  {
    id: 13,
    title: "Final Review & Certification Exam",
    description: "Summarize all content and administer a graded quiz",
    duration: "90 min",
    status: "locked",
  },
]

export default function Dashboard() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [progress, setProgress] = useState<number>(0)
  const [completedModules, setCompletedModules] = useState<number[]>([])

  useEffect(() => {
    // Check if user is verified
    const isVerified = localStorage.getItem("userVerified")
    if (!isVerified) {
      router.push("/static/mor/verify")
      return
    }

    // Load user data
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    }

    // Load progress
    const storedProgress = localStorage.getItem("courseProgress")
    if (storedProgress) {
      const progressData = JSON.parse(storedProgress)
      setCompletedModules(progressData.completed || [])
      setProgress(progressData.percentage || 0)
    }
  }, [router])

  const getModuleStatus = (moduleId: number) => {
    if (completedModules.includes(moduleId)) {
      return "completed"
    }
    if (moduleId === 1 || (completedModules.length > 0 && moduleId === Math.max(...completedModules) + 1)) {
      return "available"
    }
    return "locked"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "available":
        return <Play className="h-5 w-5 text-blue-600" />
      default:
        return <Lock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "available":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-yellow-500 rounded-full flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Tax Education Portal</h1>
                  <p className="text-xs text-gray-600 hidden sm:block">Ministry of Revenue</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{userData.ownerName}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:shadow-none border-r`}
        >
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Course Progress</h2>
              <Progress value={progress} className="mb-2" />
              <p className="text-sm text-gray-600">{progress}% Complete</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Course Modules</h3>
              {modules.map((module) => {
                const status = getModuleStatus(module.id)
                return (
                  <div key={module.id} className="block">
                    {status === "available" ? (
                      <Link href={`/modules/${module.id}`}>
                        <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex-shrink-0 mr-3">{getStatusIcon(status)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{module.title}</p>
                            <p className="text-xs text-gray-500">{module.duration}</p>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-center p-3 rounded-lg opacity-60">
                        <div className="flex-shrink-0 mr-3">{getStatusIcon(status)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{module.title}</p>
                          <p className="text-xs text-gray-500">{module.duration}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {userData.ownerName}!</h1>
              <p className="text-gray-600">Continue your tax education journey. You're doing great!</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{progress}%</div>
                  <p className="text-xs text-gray-500">Course completion</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{completedModules.length}</div>
                  <p className="text-xs text-gray-500">of 13 modules</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Business</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold text-gray-900 truncate">{userData.businessName}</div>
                  <p className="text-xs text-gray-500">TIN: {userData.tin}</p>
                </CardContent>
              </Card>
            </div>

            {/* Current Module */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 text-green-600 mr-2" />
                  Continue Learning
                </CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                {completedModules.length === 0 ? (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{modules[0].title}</h3>
                      <p className="text-sm text-gray-600">{modules[0].description}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {modules[0].duration}
                      </div>
                    </div>
                    <Link href="/modules/1">
                      <Button className="bg-green-600 hover:bg-green-700">Start Course</Button>
                    </Link>
                  </div>
                ) : completedModules.length < 13 ? (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{modules[Math.max(...completedModules)].title}</h3>
                      <p className="text-sm text-gray-600">{modules[Math.max(...completedModules)].description}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {modules[Math.max(...completedModules)].duration}
                      </div>
                    </div>
                    <Link href={`/modules/${Math.max(...completedModules) + 1}`}>
                      <Button className="bg-green-600 hover:bg-green-700">Continue</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Congratulations!</h3>
                    <p className="text-gray-600 mb-4">You've completed all modules. Get your certificate now!</p>
                    <Link href="/certificate">
                      <Button className="bg-yellow-600 hover:bg-yellow-700">Get Certificate</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Modules Grid */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">All Modules</h2>
              <div className="grid gap-4">
                {modules.map((module) => {
                  const status = getModuleStatus(module.id)
                  return (
                    <Card key={module.id} className={status === "locked" ? "opacity-60" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">{getStatusIcon(status)}</div>
                            <div>
                              <h3 className="font-medium text-gray-900">{module.title}</h3>
                              <p className="text-sm text-gray-600">{module.description}</p>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {module.duration}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={getStatusColor(status)}>
                              {status === "completed" ? "Completed" : status === "available" ? "Available" : "Locked"}
                            </Badge>
                            {status === "available" && (
                              <Link href={`/modules/${module.id}`}>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  Start
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}

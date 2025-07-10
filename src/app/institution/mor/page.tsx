"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Award, Globe, CheckCircle, ArrowRight, Menu, X } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState<"en" | "am">("en")

  const content = {
    en: {
      title: "Ethiopian Tax Education Portal",
      subtitle: "Learn taxation for small businesses - Free online course by the Ministry of Revenue",
      description:
        "Master Ethiopia's tax system with our comprehensive 13-module course designed specifically for small and micro business owners.",
      startCourse: "Start Learning",
      learnMore: "Learn More",
      modules: "13 Modules",
      certificate: "Digital Certificate",
      mobile: "Mobile Friendly",
      free: "Completely Free",
      features: {
        comprehensive: {
          title: "Comprehensive Curriculum",
          description: "13 structured modules covering everything from VAT to e-filing",
        },
        practical: {
          title: "Practical Examples",
          description: "Real-world scenarios and step-by-step guidance",
        },
        certified: {
          title: "Official Certificate",
          description: "Receive a Ministry-issued digital certificate upon completion",
        },
        accessible: {
          title: "Mobile Optimized",
          description: "Works perfectly on smartphones with limited internet",
        },
      },
      courseModules: [
        "Introduction to Ethiopian Tax System",
        "Business Registration & TIN",
        "Understanding VAT",
        "Turnover Tax (TOT) Simplified",
        "Income Tax for Small Businesses",
        "Withholding Tax",
        "Payroll Tax and Pensions",
        "Electronic Tax Filing (ERCA)",
        "Penalties and Compliance",
        "Tax Planning Strategies",
        "Record Keeping & Documentation",
        "Audits and Assessments",
        "Final Review & Certification Exam",
      ],
    },
    am: {
      title: "የኢትዮጵያ ታክስ ትምህርት ፖርታል",
      subtitle: "ለትንንሽ ንግዶች ታክስ ይማሩ - በገቢ ሚኒስቴር የሚሰጥ ነፃ የመስመር ላይ ኮርስ",
      description: "በ13 ሞጁሎች ለትንንሽ እና ጥቃቅን ንግድ ቤት ባለቤቶች የተዘጋጀ አጠቃላይ ኮርስ በመውሰድ የኢትዮጵያን የታክስ ስርዓት ይቆጣጠሩ።",
      startCourse: "ትምህርት ጀምር",
      learnMore: "ተጨማሪ መረጃ",
      modules: "13 ሞጁሎች",
      certificate: "ዲጂታል ሰርተፊኬት",
      mobile: "ለሞባይል ተስማሚ",
      free: "ሙሉ በሙሉ ነፃ",
    },
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-yellow-500 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Ministry of Revenue</h1>
                <p className="text-xs text-gray-600">Tax Education Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "am" : "en")}
                className="hidden sm:flex"
              >
                <Globe className="h-4 w-4 mr-2" />
                {language === "en" ? "አማርኛ" : "English"}
              </Button>

工作中              <Button variant="ghost" size="sm" className="sm:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white border-t">
            <div className="px-4 py-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "am" : "en")}
                className="w-full"
              >
                <Globe className="h-4 w-4 mr-2" />
                {language === "en" ? "አማርኛ" : "English"}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 rounded-full flex items-center justify-center">
                <Award className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{currentContent.title}</h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6">{currentContent.subtitle}</p>
            <p className="text-base text-gray-700 max-w-2xl mx-auto mb-8">{currentContent.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/static/mor/verify">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                {currentContent.startCourse}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
              {currentContent.learnMore}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{currentContent.modules}</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{currentContent.certificate}</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <Globe className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{currentContent.mobile}</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{currentContent.free}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {language === "en" && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Our Tax Education Portal?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries((currentContent as typeof content.en).features).map(([key, feature]: [string, { title: string; description: string }]) => (
                <Card key={key} className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Course Modules Preview */}
      {language === "en" && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Course Modules</h2>
            <div className="grid gap-4">
              {((currentContent as typeof content.en).courseModules).map((module: string, index: number) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm flex items-center">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                    {index + 1}
                  </div>
                  <span className="text-gray-900 font-medium">{module}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-yellow-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Master Ethiopian Taxation?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of small business owners who have already completed our course
          </p>
          <Link href="/verify">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-yellow-500 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold">Ethiopian Ministry of Revenue</span>
            </div>
            <p className="text-gray-400 text-sm">© 2024 Ethiopian Ministry of Revenue. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

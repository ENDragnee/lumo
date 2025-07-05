"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Download, Share2, Calendar, User, Building, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CertificatePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [certificateData, setCertificateData] = useState<any>(null)

  useEffect(() => {
    // Check if user completed all modules
    const storedProgress = localStorage.getItem("courseProgress")
    const progressData = storedProgress ? JSON.parse(storedProgress) : { completed: [], percentage: 0 }

    if (progressData.completed.length < 13) {
      router.push("/dashboard")
      return
    }

    // Load user data
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    }

    // Generate certificate data
    const completionDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const verificationCode = `ETH-TAX-${Date.now().toString().slice(-6)}`

    setCertificateData({
      completionDate,
      verificationCode,
      issueDate: completionDate,
    })
  }, [router])

  const downloadCertificate = () => {
    // In a real application, this would generate and download a PDF
    alert(
      "Certificate download would be implemented here. The PDF would contain the Ministry logo, student information, and verification code.",
    )
  }

  const shareCertificate = () => {
    if (navigator.share) {
      navigator.share({
        title: "Ethiopian Tax Education Certificate",
        text: `I've completed the Ethiopian Tax Education course by the Ministry of Revenue!`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Certificate link copied to clipboard!")
    }
  }

  if (!userData || !certificateData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="flex items-center text-green-600 hover:text-green-700">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Congratulations Section */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Congratulations!</h1>
            <p className="text-xl text-gray-600 mb-2">You have successfully completed the</p>
            <p className="text-2xl font-bold text-green-600">Ethiopian Tax Education Course</p>
          </div>

          {/* Certificate Preview */}
          <Card className="mb-8 border-2 border-green-200 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Header */}
                <div className="border-b-2 border-green-600 pb-6">
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 rounded-full flex items-center justify-center">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Ministry of Revenue</h2>
                      <p className="text-gray-600">Federal Democratic Republic of Ethiopia</p>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-green-600">CERTIFICATE OF COMPLETION</h3>
                </div>

                {/* Certificate Body */}
                <div className="space-y-6">
                  <p className="text-lg text-gray-700">This is to certify that</p>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{userData.ownerName}</h4>
                    <p className="text-gray-600">Owner of {userData.businessName}</p>
                    <p className="text-sm text-gray-500">TIN: {userData.tin}</p>
                  </div>

                  <p className="text-lg text-gray-700">has successfully completed the comprehensive</p>

                  <h5 className="text-xl font-bold text-green-600">
                    Ethiopian Tax Education Course for Small Businesses
                  </h5>

                  <p className="text-gray-700">consisting of 13 modules covering all aspects of Ethiopian taxation</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="text-center">
                      <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Completion Date</p>
                      <p className="font-semibold text-gray-900">{certificateData.completionDate}</p>
                    </div>
                    <div className="text-center">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Verification Code</p>
                      <p className="font-semibold text-gray-900">{certificateData.verificationCode}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-green-600 pt-6 mt-8">
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <div className="w-32 h-1 bg-gray-400 mb-2"></div>
                      <p className="text-sm text-gray-600">Ministry Seal</p>
                    </div>
                    <div className="text-right">
                      <div className="w-32 h-1 bg-gray-400 mb-2"></div>
                      <p className="text-sm text-gray-600">Authorized Signature</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    This certificate can be verified at: verify.mor.gov.et using code {certificateData.verificationCode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button onClick={downloadCertificate} className="bg-green-600 hover:bg-green-700 px-8 py-3">
              <Download className="h-5 w-5 mr-2" />
              Download PDF Certificate
            </Button>
            <Button onClick={shareCertificate} variant="outline" className="px-8 py-3 bg-transparent">
              <Share2 className="h-5 w-5 mr-2" />
              Share Achievement
            </Button>
          </div>

          {/* Achievement Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 text-yellow-600 mr-2" />
                Course Achievement Summary
              </CardTitle>
              <CardDescription>Your learning journey with the Ethiopian Ministry of Revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">13 Modules</h3>
                  <p className="text-sm text-gray-600">Successfully completed</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Certified</h3>
                  <p className="text-sm text-gray-600">Tax education graduate</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Business Ready</h3>
                  <p className="text-sm text-gray-600">Tax compliant operations</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">What's Next?</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Apply your knowledge to your business operations</li>
                  <li>• Keep this certificate for your records</li>
                  <li>• Stay updated with tax law changes through ERCA</li>
                  <li>• Consider advanced tax courses for business growth</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

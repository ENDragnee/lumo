"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function VerificationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: "",
    tin: "",
    ownerName: "",
    fidaId: "",
    letterFile: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, letterFile: file }))
      if (errors.letterFile) {
        setErrors((prev) => ({ ...prev, letterFile: "" }))
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required"
    }

    if (!formData.tin.trim()) {
      newErrors.tin = "TIN is required"
    } else if (!/^\d{10}$/.test(formData.tin.replace(/\s/g, ""))) {
      newErrors.tin = "TIN must be 10 digits"
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required"
    }

    if (!formData.fidaId.trim()) {
      newErrors.fidaId = "FIDA ID is required"
    }

    if (!formData.letterFile) {
      newErrors.letterFile = "Letter of recommendation is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Store verification data in localStorage (in real app, this would be sent to backend)
    localStorage.setItem("userVerified", "true")
    localStorage.setItem("userData", JSON.stringify(formData))

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center text-green-600 hover:text-green-700">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Verification</h1>
            <p className="text-gray-600">Please provide your business details to access the tax education course</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Verify Your Business Identity
              </CardTitle>
              <CardDescription>
                All information will be kept confidential and used only for course access verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="businessName">Full Legal Business Name *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      placeholder="Enter your registered business name"
                      className={errors.businessName ? "border-red-500" : ""}
                    />
                    {errors.businessName && <p className="text-sm text-red-600 mt-1">{errors.businessName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="tin">TIN (Taxpayer Identification Number) *</Label>
                    <Input
                      id="tin"
                      value={formData.tin}
                      onChange={(e) => handleInputChange("tin", e.target.value)}
                      placeholder="0123456789"
                      maxLength={10}
                      className={errors.tin ? "border-red-500" : ""}
                    />
                    {errors.tin && <p className="text-sm text-red-600 mt-1">{errors.tin}</p>}
                  </div>

                  <div>
                    <Label htmlFor="ownerName">Owner's Full Name *</Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange("ownerName", e.target.value)}
                      placeholder="Enter business owner's full name"
                      className={errors.ownerName ? "border-red-500" : ""}
                    />
                    {errors.ownerName && <p className="text-sm text-red-600 mt-1">{errors.ownerName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="fidaId">FIDA ID Number (or National ID) *</Label>
                    <Input
                      id="fidaId"
                      value={formData.fidaId}
                      onChange={(e) => handleInputChange("fidaId", e.target.value)}
                      placeholder="Enter your FIDA ID or National ID"
                      className={errors.fidaId ? "border-red-500" : ""}
                    />
                    {errors.fidaId && <p className="text-sm text-red-600 mt-1">{errors.fidaId}</p>}
                  </div>

                  <div>
                    <Label htmlFor="letterFile">Letter of Recommendation *</Label>
                    <div className="mt-2">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="letterFile"
                          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                            errors.letterFile ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PDF or Image files only</p>
                          </div>
                          <input
                            id="letterFile"
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      {formData.letterFile && (
                        <p className="text-sm text-green-600 mt-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {formData.letterFile.name}
                        </p>
                      )}
                      {errors.letterFile && <p className="text-sm text-red-600 mt-1">{errors.letterFile}</p>}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Upload a letter of recommendation from a recognized institution, chamber of commerce, or
                      government office
                    </p>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your information will be verified before granting access to the course. This process may take 1-2
                    business days.
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                  {isSubmitting ? "Verifying..." : "Submit for Verification"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

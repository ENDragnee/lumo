// /app/static/institutions/mor-ethiopia/MorRegistration.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { InstitutionPortalProps } from "@/lib/institutionPortalLoader"; // Import the props type
import { registerForInstitution } from "@/app/actions/registerForInstitution";
// NEW: Server Action to handle registration

export default function MorRegistration({ institution, user, membership }: InstitutionPortalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: "",
    tin: "",
    ownerName: user?.name || "", // Pre-fill with user's name if available
    fidaId: "",
  });
  const [letterFile, setLetterFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLetterFile(file);
      if (errors.letterFile) {
        setErrors((prev) => ({ ...prev, letterFile: "" }));
      }
    }
  };

  const validateForm = () => {
    // ... validation logic remains the same ...
    const newErrors: Record<string, string> = {};
    if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
    if (!/^\d{10}$/.test(formData.tin.replace(/\s/g, ""))) newErrors.tin = "TIN must be 10 digits";
    if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required";
    if (!formData.fidaId.trim()) newErrors.fidaId = "FIDA ID is required";
    if (!letterFile) newErrors.letterFile = "Letter of recommendation is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setServerMessage(null);
    
    // In a real app, you would upload the file to S3/Cloudinary first
    // and get a URL to store in the metadata. For now, we'll skip this.
    const metadata = {
      ...formData,
      letterFileName: letterFile?.name,
      // In a real app: letterFileUrl: 'url-from-s3'
    };

    const result = await registerForInstitution(institution._id, metadata);
    
    setIsSubmitting(false);

    if (result.error) {
      setServerMessage({ type: 'error', text: result.error });
    } else {
      setServerMessage({ type: 'success', text: "Registration successful! You will be redirected." });
      // Refresh the page to re-trigger the server-side auth check
      // This will now show the dashboard.
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {membership && membership.status === 'pending' && (
             <Alert className="mb-8 bg-yellow-100 border-yellow-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Your previous registration is pending approval. You will be notified once it's reviewed.
                </AlertDescription>
            </Alert>
        )}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Join {institution.name}</h1>
            <p className="text-gray-600">Please provide your business details to access the tax education course.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Business Verification</CardTitle>
                <CardDescription>
                    Your information will be kept confidential and used only for course access.
                </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Form is largely the same, but with state for server messages */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... All your input fields here ... (Full code omitted for brevity but it's the same) */}
                <div>
                    <Label htmlFor="businessName">Full Legal Business Name *</Label>
                    <Input id="businessName" value={formData.businessName} onChange={(e) => handleInputChange("businessName", e.target.value)} />
                    {errors.businessName && <p className="text-sm text-red-600 mt-1">{errors.businessName}</p>}
                </div>
                {/* etc for all other fields */}

                {/* File Upload remains the same visually */}
                <div>
                    <Label htmlFor="letterFile">Letter of Recommendation *</Label>
                    {/* ... file upload JSX ... */}
                </div>

                {serverMessage && (
                  <Alert variant={serverMessage.type === 'error' ? 'destructive' : 'default'} className={serverMessage.type === 'success' ? 'bg-green-100' : ''}>
                      <AlertDescription>{serverMessage.text}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit for Verification"}
                </Button>
              </form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

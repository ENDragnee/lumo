"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2, Landmark, Building2, User, Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";
import { InstitutionPortalProps } from "@/lib/institutionPortalLoader";

// --- BILINGUAL TRANSLATION OBJECT (No changes) ---
const translations = {
  en: {
    languageName: "Amharic",
    languageCode: "አማርኛ",
    pageTitle: "Ministry of Revenue Portal Registration",
    pageDescription: "Complete the form below to apply for the tax education program.",
    pendingTitle: "Application Pending",
    pendingDescription: "Your previous registration is pending approval. You will be notified once it is reviewed by an administrator.",
    formTitle: "Business Verification",
    formDescription: "Your information will be kept confidential and used only for course access verification.",
    businessNameLabel: "Full Legal Business Name *",
    businessNamePlaceholder: "e.g., ABC Trading PLC",
    tinLabel: "Taxpayer Identification Number (TIN) *",
    tinPlaceholder: "Enter your 10-digit TIN",
    ownerNameLabel: "Full Name of Business Owner *",
    ownerNamePlaceholder: "As it appears on your ID",
    fidaIdLabel: "FIDA ID / Kebele ID *",
    fidaIdPlaceholder: "Enter your government-issued ID number",
    submitButton: "Submit for Verification",
    submittingButton: "Submitting...",
    successMessage: "Registration successful! Your application is under review. You will be redirected shortly.",
    errorBusinessName: "Business name is required",
    errorTin: "TIN must be exactly 10 digits",
    errorOwnerName: "Owner name is required",
    errorFidaId: "FIDA or Kebele ID is required",
  },
  am: {
    languageName: "English",
    languageCode: "English",
    pageTitle: "የገቢዎች ሚኒስቴር ፖርታል ምዝገባ",
    pageDescription: "ለግብር ትምህርት ፕሮግራም ለማመልከት ከታች ያለውን ቅጽ ይሙሉ",
    pendingTitle: "ማመልከቻ በመጠባበቅ ላይ ነው",
    pendingDescription: "የቀድሞ ምዝገባዎ ይሁንታ በመጠባበቅ ላይ ነው። በአስተዳዳሪ ከተገመገመ በኋላ ማሳወቂያ ይደርስዎታል።",
    formTitle: "የንግድ ማረጋገጫ",
    formDescription: "የእርስዎ መረጃ በሚስጥር የተያዘ ሲሆን ለኮርስ መዳረሻ ማረጋገጫ ብቻ ይውላል።",
    businessNameLabel: "ሙሉ የንግድ ሕጋዊ ስም *",
    businessNamePlaceholder: "ለምሳሌ፣ ኤቢሲ ትሬዲንግ ኃ/የተ/የግ/ማ",
    tinLabel: "የግብር ከፋይ መለያ ቁጥር (TIN) *",
    tinPlaceholder: "ባለ 10 አሃዝ ቲን ቁጥርዎን ያስገቡ",
    ownerNameLabel: "የንግዱ ባለቤት ሙሉ ስም *",
    ownerNamePlaceholder: "በመታወቂያዎ ላይ እንደሚታየው",
    fidaIdLabel: "የፊዳ መታወቂያ / የቀበሌ መታወቂያ *",
    fidaIdPlaceholder: "በመንግስት የተሰጠ የመታወቂያ ቁጥርዎን ያስገቡ",
    submitButton: "ለማረጋገጫ ያስገቡ",
    submittingButton: "በማስገባት ላይ...",
    successMessage: "ምዝገባው ተሳክቷል! ማመልከቻዎ በግምገማ ላይ ነው። በቅርቡ ወደ ዳሽቦርድ ይመራሉ።",
    errorBusinessName: "የንግድ ስም ያስፈልጋል",
    errorTin: "ቲን ቁጥር በትክክል 10 አሃዝ መሆን አለበት",
    errorOwnerName: "የባለቤቱ ስም ያስፈልጋል",
    errorFidaId: "የፊዳ ወይም የቀበሌ መታወቂያ ያስፈልጋል",
  }
};


export default function MorRegistration({ institution, user, membership }: InstitutionPortalProps) {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'am'>('en');
  const [formData, setFormData] = useState({
    businessName: "",
    tin: "",
    ownerName: user?.name || "",
    fidaId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const t = useMemo(() => translations[language], [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'am' : 'en');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.businessName.trim()) newErrors.businessName = t.errorBusinessName;
    if (!/^\d{10}$/.test(formData.tin.replace(/\s/g, ""))) newErrors.tin = t.errorTin;
    if (!formData.ownerName.trim()) newErrors.ownerName = t.errorOwnerName;
    if (!formData.fidaId.trim()) newErrors.fidaId = t.errorFidaId;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- THIS FUNCTION IS UPDATED ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerMessage(null);
    
    const metadata = { ...formData };

    try {
      const response = await fetch(`/api/institutions/${institution._id}/membership`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metadata }),
      });

      const result = await response.json();

      if (!response.ok) {
        // The API returned an error (e.g., 401, 409, 500)
        // Use the error message from the API if it exists
        throw new Error(result.error || 'An unexpected error occurred.');
      }
      
      // Success case
      setServerMessage({ type: 'success', text: t.successMessage });
      setTimeout(() => router.refresh(), 3000);

    } catch (error: any) {
      // Catches network errors or errors thrown from the response check
      setServerMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // The rest of the component's JSX is identical and correct
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="absolute top-4 right-4">
        <Button variant="outline" onClick={toggleLanguage}>
          {t.languageCode}
        </Button>
      </div>
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <span className="p-3 bg-gradient-to-br from-green-600 via-yellow-400 to-red-600 rounded-full">
                <Landmark className="h-8 w-8 text-white" />
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">{t.pageTitle}</h1>
            <p className="mt-3 text-lg text-gray-600">{t.pageDescription}</p>
          </div>

          {membership && membership.status === 'pending' && (
            <Alert variant="default" className="mb-8 bg-yellow-50 border-yellow-300 text-yellow-800">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <AlertTitle className="font-semibold">{t.pendingTitle}</AlertTitle>
              <AlertDescription>{t.pendingDescription}</AlertDescription>
            </Alert>
          )}

          <Card className="border-t-4 border-green-600 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{t.formTitle}</CardTitle>
              <CardDescription>{t.formDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Business Name */}
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="font-semibold">{t.businessNameLabel}</Label>
                  <div className="flex items-center">
                    <span className="p-3 border border-r-0 rounded-l-md bg-gray-50 text-gray-500"><Building2 className="h-5 w-5"/></span>
                    <Input id="businessName" placeholder={t.businessNamePlaceholder} value={formData.businessName} onChange={(e) => handleInputChange("businessName", e.target.value)} className="rounded-l-none" />
                  </div>
                  {errors.businessName && <p className="text-sm text-red-600 mt-1">{errors.businessName}</p>}
                </div>
                
                {/* TIN */}
                <div className="space-y-2">
                  <Label htmlFor="tin" className="font-semibold">{t.tinLabel}</Label>
                   <div className="flex items-center">
                    <span className="p-3 border border-r-0 rounded-l-md bg-gray-50 text-gray-500"><Fingerprint className="h-5 w-5"/></span>
                    <Input id="tin" placeholder={t.tinPlaceholder} value={formData.tin} onChange={(e) => handleInputChange("tin", e.target.value)} type="tel" maxLength={10} className="rounded-l-none" />
                  </div>
                  {errors.tin && <p className="text-sm text-red-600 mt-1">{errors.tin}</p>}
                </div>

                {/* Owner Name */}
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="font-semibold">{t.ownerNameLabel}</Label>
                   <div className="flex items-center">
                    <span className="p-3 border border-r-0 rounded-l-md bg-gray-50 text-gray-500"><User className="h-5 w-5"/></span>
                    <Input id="ownerName" placeholder={t.ownerNamePlaceholder} value={formData.ownerName} onChange={(e) => handleInputChange("ownerName", e.target.value)} className="rounded-l-none" />
                  </div>
                  {errors.ownerName && <p className="text-sm text-red-600 mt-1">{errors.ownerName}</p>}
                </div>

                {/* FIDA ID */}
                <div className="space-y-2">
                  <Label htmlFor="fidaId" className="font-semibold">{t.fidaIdLabel}</Label>
                   <div className="flex items-center">
                    <span className="p-3 border border-r-0 rounded-l-md bg-gray-50 text-gray-500"><Fingerprint className="h-5 w-5"/></span>
                    <Input id="fidaId" placeholder={t.fidaIdPlaceholder} value={formData.fidaId} onChange={(e) => handleInputChange("fidaId", e.target.value)} className="rounded-l-none" />
                  </div>
                  {errors.fidaId && <p className="text-sm text-red-600 mt-1">{errors.fidaId}</p>}
                </div>

                {serverMessage && (
                  <Alert variant={serverMessage.type === 'error' ? 'destructive' : 'default'} className={serverMessage.type === 'success' ? 'bg-green-50 border-green-300 text-green-800' : ''}>
                    {serverMessage.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertDescription>{serverMessage.text}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full text-lg py-6 bg-green-600 hover:bg-green-700" disabled={isSubmitting || (membership?.status === 'pending')}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t.submittingButton}</> : t.submitButton}
                </Button>
              </form>
            </CardContent>
          </Card>
           <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Ministry of Revenue. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

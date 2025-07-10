import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import mongoose from "mongoose";

import Institution from "@/models/Institution";
import InstitutionMember from "@/models/InstitutionMember";
import Content from "@/models/Content";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Calendar, User, Building, CheckCircle, ArrowLeft } from "lucide-react";
import CertificateClientActions from "@/components/static/institutions/CertificateClientActions";

async function getCertificateData(institutionId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        // Not logged in, redirect to login page
        redirect("/login");
    }

    if (!mongoose.Types.ObjectId.isValid(institutionId)) {
        notFound();
    }

    await dbConnect();

    const institutionPromise = Institution.findById(institutionId).lean();
    const membershipPromise = InstitutionMember.findOne({
        userId: new mongoose.Types.ObjectId(session.user.id),
        institutionId: new mongoose.Types.ObjectId(institutionId),
        status: "active",
    }).lean();
    const totalModulesPromise = Content.countDocuments({ institutionId }).lean();
    
    const [institution, membership, totalModules] = await Promise.all([
        institutionPromise,
        membershipPromise,
        totalModulesPromise,
    ]);

    if (!institution || !membership) {
        // User is not an active member of this institution
        notFound();
    }

    const completedModulesCount = membership.metadata?.completedModules?.length || 0;

    // SECURITY CHECK: User must have completed all modules
    if (completedModulesCount < totalModules || totalModules === 0) {
        // Redirect back to the dashboard if the course isn't fully completed
        redirect(`/institution/${institutionId}`);
    }

    return {
        user: session.user,
        institution,
        membership,
        totalModules,
    };
}

type CertificatePageProps = {
  params: Promise<{
    institutionId: string;
  }>;
};
export default async function CertificatePage({ params }: CertificatePageProps) {
  const { institutionId } = await params;
  const { user, institution, membership, totalModules } = await getCertificateData(institutionId);
  const session = await getServerSession(authOptions);

  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const verificationCode = `ETH-TAX-${session?.user?.id}-${institutionId.slice(-4)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
      <header className="bg-white shadow-sm border-b-2 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/institution/${institutionId}`} className="flex items-center text-green-600 hover:text-green-700">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-2">
                <p className="font-semibold">{user.name}</p>
                <User className="h-6 w-6 text-gray-500"/>
            </div>
          </div>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Congratulations, {user.name?.split(' ')[0]}!</h1>
            <p className="text-xl text-gray-600 mb-2">You have successfully completed the</p>
            <p className="text-2xl font-bold text-green-600">{institution.name} Program</p>
          </div>

          <Card className="mb-8 border-2 border-green-200 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="border-b-2 border-green-600 pb-6">
                   <div className="flex justify-center items-center space-x-4 mb-4">
                     {institution.branding?.logoUrl ? (
                         <img src={institution.branding.logoUrl} alt="Institution Logo" className="h-16 w-auto"/>
                     ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <Building className="h-8 w-8 text-gray-600" />
                        </div>
                     )}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{institution.name}</h2>
                      <p className="text-gray-600">Official Training Partner</p>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-green-600">CERTIFICATE OF COMPLETION</h3>
                </div>

                <div className="space-y-6">
                  <p className="text-lg text-gray-700">This is to certify that</p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h4>
                    {membership.metadata?.businessName && <p className="text-gray-600">Owner of {membership.metadata.businessName}</p>}
                    {membership.metadata?.tin && <p className="text-sm text-gray-500">TIN: {membership.metadata.tin}</p>}
                  </div>
                  <p className="text-lg text-gray-700">has successfully completed the comprehensive</p>
                  <h5 className="text-xl font-bold text-green-600">Tax Education Course for Small Businesses</h5>
                  <p className="text-gray-700">consisting of {totalModules} modules.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="text-center">
                      <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Completion Date</p>
                      <p className="font-semibold text-gray-900">{completionDate}</p>
                    </div>
                    <div className="text-center">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Verification Code</p>
                      <p className="font-semibold text-gray-900">{verificationCode}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-green-600 pt-6 mt-8">
                  <p className="text-xs text-gray-500 mt-4">
                    This certificate is a record of achievement for the course provided by {institution.name}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <CertificateClientActions />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 text-yellow-600 mr-2" />
                Course Achievement Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"><CheckCircle className="h-8 w-8 text-green-600" /></div><h3 className="font-semibold text-gray-900 mb-1">{totalModules} Modules</h3><p className="text-sm text-gray-600">Successfully completed</p></div>
                <div className="text-center"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"><User className="h-8 w-8 text-blue-600" /></div><h3 className="font-semibold text-gray-900 mb-1">Certified</h3><p className="text-sm text-gray-600">Tax education graduate</p></div>
                <div className="text-center"><div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3"><Building className="h-8 w-8 text-yellow-600" /></div><h3 className="font-semibold text-gray-900 mb-1">Business Ready</h3><p className="text-sm text-gray-600">Tax compliant operations</p></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

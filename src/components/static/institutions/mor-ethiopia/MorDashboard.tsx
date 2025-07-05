// /app/static/institutions/mor-ethiopia/MorDashboard.tsx
import { BookOpen, CheckCircle, Clock, Award, User, Play, Lock } from "lucide-react";
import Link from "next/link";
import { InstitutionPortalProps } from "@/lib/institutionPortalLoader"; // Import the props type
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Progress from "@/components/test/progress"; // Using your progress component
import { Badge } from "@/components/ui/badge";
import Content from "@/models/Content"; // Import the Content model
import dbConnect from "@/lib/mongodb";

// Server-side data fetching function for the content modules
async function getInstitutionContent(institutionId: string) {
    await dbConnect();
    const modules = await Content.find({
        institutionId: institutionId,
        isDraft: false,
        isTrash: false,
    }).sort({ createdAt: 1 }).lean(); // Sort by creation date to get them in order
    return JSON.parse(JSON.stringify(modules));
}

// The Dashboard is now an async Server Component!
export default async function MorDashboard({ institution, user, membership }: InstitutionPortalProps) {
  // Fetch the modules specific to this institution
  const modules = await getInstitutionContent(institution._id);
  
  // Progress logic would now come from the `membership.metadata`
  // For example, you might store `completedModules: [id1, id2]` there.
  const completedModules = membership?.metadata?.completedModules || [];
  const progress = Math.round((completedModules.length / (modules.length || 1)) * 100);

  const getModuleStatus = (moduleId: string) => {
      if (completedModules.includes(moduleId)) {
          return "completed";
      }
      // Logic to unlock the next module
      const lastCompletedIndex = modules.findIndex(m => m._id.toString() === completedModules[completedModules.length - 1]);
      const currentIndex = modules.findIndex(m => m._id.toString() === moduleId);

      if (currentIndex === 0 || (lastCompletedIndex !== -1 && currentIndex === lastCompletedIndex + 1)) {
          return "available";
      }
      return "locked";
  };
  
  const getStatusIcon = (status: string) => { /* ... same as before ... */ };
  const getStatusColor = (status: string) => { /* ... same as before ... */ };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (can now be a separate server component) */}
      <header className="bg-white shadow-sm border-b-2 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                    <h1 className="text-lg font-bold text-gray-900">{institution.name} Portal</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <User className="h-4 w-4" />
                    <span>{user?.name}</span>
                </div>
            </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar (can be client component if stateful) */}
        <aside className="w-80 bg-white shadow-lg border-r p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Course Progress</h2>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-gray-600">{progress}% Complete</p>
            {/* ... module list in sidebar ... */}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
            {/* ... Stats Cards, using server-driven data ... */}

            {/* All Modules Grid */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">All Modules</h2>
              <div className="grid gap-4">
                {modules.map((module) => {
                  const status = getModuleStatus(module._id);
                  return (
                    <Card key={module._id} className={status === "locked" ? "opacity-60" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">{module.title}</h3>
                              <p className="text-sm text-gray-600">{module.description}</p>
                            </div>
                            {/* The link now goes to the unified content page */}
                            {status !== 'locked' && (
                                <Link href={`/learn/${module._id}`}>
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                        {status === 'completed' ? 'Review' : 'Start'}
                                    </Button>
                                </Link>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
        </main>
      </div>
    </div>
  );
}

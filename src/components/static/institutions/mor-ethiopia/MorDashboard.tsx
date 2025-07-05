// /app/static/institutions/mor-ethiopia/MorDashboard.tsx (UPDATED FILE)

"use client"; // The top-level component that uses state must be a client component

// --- IMPORTS ---
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Clock, Award, User, Menu, X, Play, Lock } from "lucide-react";
import Link from "next/link";
// --- UPDATED ---
// Import the specific `DashboardPortalProps` type from the loader.
import { DashboardPortalProps } from "@/lib/institutionPortalLoader";
import { IContent } from "@/models/Content";
import { ResponsiveCircularProgress } from '@/components/ui/CircularProgress'; // Using your new progress component
export default function Dashboard({ institution, user, membership, modules = [] }: DashboardPortalProps) {
  // --- STATE MANAGEMENT ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // --- DERIVED DATA & LOGIC ---
  // All logic now uses the props passed from the server, not localStorage.
  const completedModules: string[] = membership?.metadata?.completedModules || [];
  const businessInfo = membership?.metadata || {};
  const progress = modules.length > 0 ? Math.round((completedModules.length / modules.length) * 100) : 0;

  // Determines the status of a module based on completion progress.
  const getModuleStatus = (moduleId: string): "completed" | "available" | "locked" => {
    if (completedModules.includes(moduleId)) {
      return "completed";
    }
    
    const currentIndex = modules.findIndex((m) => m._id.toString() === moduleId);
    
    // First module is always available if not completed.
    if (currentIndex === 0) {
      return "available";
    }

    // A module is available if the *previous* module is completed.
    if (currentIndex > 0) {
      const previousModuleId = modules[currentIndex - 1]._id.toString();
      if (completedModules.includes(previousModuleId)) {
        return "available";
      }
    }

    return "locked";
  };

  // Helper functions to get icons and colors based on status.
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "available": return <Play className="h-5 w-5 text-blue-600" />;
      default: return <Lock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "available": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  // Find the next available module for the "Continue Learning" card.
  const nextModule = modules.find(module => getModuleStatus(module._id.toString()) === 'available');

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
                  <h1 className="text-lg font-bold text-gray-900">{institution.name} Portal</h1>
                  <p className="text-xs text-gray-600 hidden sm:block">Ministry of Revenue</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:shadow-none border-r`}
        >
          <div className="p-6">
            <div className="mb-6 flex flex-col items-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Course Progress</h2>
              {/* --- INTEGRATED CIRCULAR PROGRESS --- */}
              <ResponsiveCircularProgress
                value={progress}
                color="text-green-600"
                alwaysShow={true}
                isHovered={false} // isHovered is false because alwaysShow handles visibility
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Course Modules</h3>
              {modules.map((module) => {
                const status = getModuleStatus(module._id);
                return (
                  <div key={module._id} className="block">
                    {status !== "locked" ? (
                      <Link href={`/learn/${module._id}`}>
                        <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex-shrink-0 mr-3">{getStatusIcon(status)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{module.title}</p>
                            <p className="text-xs text-gray-500">{module.estimatedTime}</p>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-center p-3 rounded-lg opacity-60">
                        <div className="flex-shrink-0 mr-3">{getStatusIcon(status)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{module.title}</p>
                          <p className="text-xs text-gray-500">{module.estimatedTime}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600">Continue your tax education journey. You're doing great!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Progress</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-gray-900">{progress}%</div><p className="text-xs text-gray-500">Course completion</p></CardContent></Card>
              <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-gray-900">{completedModules.length}</div><p className="text-xs text-gray-500">of {modules.length} modules</p></CardContent></Card>
              <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-gray-600">Business</CardTitle></CardHeader><CardContent><div className="text-sm font-bold text-gray-900 truncate">{businessInfo.businessName}</div><p className="text-xs text-gray-500">TIN: {businessInfo.tin}</p></CardContent></Card>
            </div>

            <Card className="mb-8">
              <CardHeader><CardTitle className="flex items-center"><BookOpen className="h-5 w-5 text-green-600 mr-2" />Continue Learning</CardTitle><CardDescription>Pick up where you left off</CardDescription></CardHeader>
              <CardContent>
                {progress === 100 ? (
                  <div className="text-center p-8"><Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" /><h3 className="text-xl font-bold text-gray-900 mb-2">Congratulations!</h3><p className="text-gray-600 mb-4">You've completed all modules. Get your certificate now!</p><Link href={`/institution/${institution._id}/certificate`}><Button className="bg-yellow-600 hover:bg-yellow-700">Get Certificate</Button></Link></div>
                ) : nextModule ? (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg"><div><h3 className="font-medium text-gray-900">{nextModule.title}</h3><p className="text-sm text-gray-600">{nextModule.description}</p><div className="flex items-center mt-2 text-sm text-gray-500"><Clock className="h-4 w-4 mr-1" />{nextModule.estimatedTime}</div></div><Link href={`/learn/${nextModule._id}`}><Button className="bg-green-600 hover:bg-green-700">Continue</Button></Link></div>
                ) : (
                  <div className="p-4 text-center text-gray-600">All available modules are complete. Great work!</div>
                )}
              </CardContent>
            </Card>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">All Modules</h2>
              <div className="grid gap-4">
                {modules.map((module) => {
                  const status = getModuleStatus(module._id);
                  return (
                    <Card key={module._id} className={status === "locked" ? "opacity-60" : ""}><CardContent className="p-4"><div className="flex items-center justify-between"><div className="flex items-center space-x-4"><div className="flex-shrink-0">{getStatusIcon(status)}</div><div><h3 className="font-medium text-gray-900">{module.title}</h3><p className="text-sm text-gray-600">{module.description}</p><div className="flex items-center mt-1 text-sm text-gray-500"><Clock className="h-4 w-4 mr-1" />{module.estimatedTime}</div></div></div><div className="flex items-center space-x-3"><Badge className={getStatusColor(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>{status === 'available' && (<Link href={`/learn/${module._id}`}><Button size="sm" className="bg-green-600 hover:bg-green-700">Start</Button></Link>)}</div></div></CardContent></Card>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {isSidebarOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />)}
    </div>
  );
}

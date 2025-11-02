"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Clock, Award, User, Menu, X, Play, Lock, ArrowLeft, Star, BarChart, FileText } from "lucide-react";
import Link from "next/link";
import { DashboardPortalProps } from "@/lib/institutionPortalLoader"; 
import { ResponsiveCircularProgress } from '@/components/ui/CircularProgress';

// ModuleCard and parsePrefix helpers remain the same...
type ModuleCardProps = {
  module: any;
  status: 'completed' | 'available' | 'locked';
  accentColor: string;
};

const ModuleCard = ({ module, status, accentColor }: ModuleCardProps) => {
  const isLocked = status === 'locked';
  
  const statusConfig = {
    completed: { Icon: CheckCircle, iconColor: 'text-green-600', badgeClass: 'bg-green-100 text-green-800', label: 'Completed' },
    available: { Icon: Play, iconColor: 'text-blue-600', badgeClass: 'bg-blue-100 text-blue-800', label: 'Available' },
    locked: { Icon: Lock, iconColor: 'text-gray-400', badgeClass: 'bg-gray-100 text-gray-600', label: 'Locked' },
  };

  const { Icon, iconColor, badgeClass, label } = statusConfig[status];

  const cardContent = (
    <div className={`flex items-center justify-between p-4 ${isLocked ? 'opacity-60' : ''}`}>
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full bg-gray-100 ${iconColor}`}><Icon className="h-6 w-6" /></div>
        <div>
          <h3 className="font-semibold text-gray-800">{module.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">{module.description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Badge variant="outline" className={`hidden sm:inline-flex ${badgeClass}`}>{label}</Badge>
        {status === 'available' && (<Button size="sm" style={{ backgroundColor: accentColor }}>Start</Button>)}
      </div>
    </div>
  );

  return (
    <Card className={`transition-all duration-300 ${!isLocked ? 'hover:shadow-md hover:border-gray-300' : ''}`}>
      {isLocked ? ( <div className="cursor-not-allowed">{cardContent}</div> ) : ( <Link href={`/content/${module._id}`}>{cardContent}</Link> )}
    </Card>
  );
};


const parsePrefix = (title: string): { chapter: number; section: number } | null => {
  const match = title.match(/chapter\s*(\d+)(?:\.(\d+))?/i);
  if (!match) return null;
  return {
    chapter: parseInt(match[1], 10),
    section: parseInt(match[2] || '0', 10),
  };
};

export default function Dashboard({ 
  institution, 
  user, 
  membership, 
  modules = [], 
  interactedContentIds = []
}: DashboardPortalProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const accentColor = institution?.branding?.primaryColor || '#059669';
  const businessInfo = membership?.metadata || {};

  const sortedModules = useMemo(() => {
    return [...modules].sort((a, b) => {
      const prefixA = parsePrefix(a.title);
      const prefixB = parsePrefix(b.title);
      if (prefixA && prefixB) {
        if (prefixA.chapter !== prefixB.chapter) return prefixA.chapter - prefixB.chapter;
        return prefixA.section - prefixB.section;
      }
      if (prefixA) return -1;
      if (prefixB) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [modules]);
  
  const completedModuleIdsFromDB: string[] = membership?.metadata?.completedModules || [];

  const moduleStatuses = useMemo(() => {
    const getStatus = (moduleId: string, index: number): "completed" | "available" | "locked" => {
      if (completedModuleIdsFromDB.includes(moduleId)) return "completed";
      if (index === 0) return "available";
      const previousModuleId = sortedModules[index - 1]._id.toString();
      if (interactedContentIds.includes(previousModuleId) || completedModuleIdsFromDB.includes(previousModuleId)) {
        return "available";
      }
      return "locked";
    };
    return sortedModules.map((module, index) => ({
      ...module,
      status: getStatus(module._id.toString(), index),
    }));
  }, [sortedModules, completedModuleIdsFromDB, interactedContentIds]);

  // --- UPDATED: SIMPLIFIED PROGRESS CALCULATION ---
  
  // 1. Count modules that are UNLOCKED (i.e., not locked).
  const unlockedCount = useMemo(() => 
    moduleStatuses.filter(m => m.status !== 'locked').length,
    [moduleStatuses]
  );
  
  // The "completed" count is now just for display on its card, not for logic.
  const completedCount = useMemo(() => 
    moduleStatuses.filter(m => m.status === 'completed').length, 
    [moduleStatuses]
  );

  const totalCount = sortedModules.length;

  // 2. The single `progress` value is based entirely on the unlocked count.
  const progress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;
  
  // --- END OF UPDATE ---
  
  const nextModule = useMemo(() => 
    moduleStatuses.find(m => m.status === 'available'),
    [moduleStatuses]
  );

  return (
    <div style={{ '--accent-color': accentColor } as React.CSSProperties} className="min-h-screen bg-gray-50 font-sans">
      
      {/* Header is unchanged */}
       <header className="bg-white shadow-sm border-b-4" style={{ borderColor: accentColor }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
               <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              <div className="flex items-center space-x-3">
                {institution.branding?.logoUrl ? (
                  <img src={institution.branding.logoUrl} alt={`${institution.name} Logo`} className="h-10 w-auto" />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full" style={{ backgroundColor: accentColor }}>
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-800">{institution.name} Portal</h1>
                  <p className="text-sm text-gray-500 hidden sm:block">Tax Education Program</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="hidden sm:flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-[var(--accent-color)] transition-colors">
                 <ArrowLeft className="h-4 w-4" />
                 <span>Back to Lumo</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                    <div className="font-semibold text-gray-800">{user?.name}</div>
                    <div className="text-xs text-gray-500">{businessInfo.businessName}</div>
                </div>
                <User className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-screen-xl mx-auto">
        <aside
          className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:shadow-none border-r border-gray-200 flex flex-col`}
        >
          <div className="p-6 text-center border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Course Progress</h2>
            <ResponsiveCircularProgress value={progress} color="text-[var(--accent-color)]" alwaysShow={true} isHovered={false} />
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <h3 className="px-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Modules</h3>
            {moduleStatuses.map((module) => {
              const isAvailable = module.status === 'available';
              return (
                <Link key={module._id} href={module.status !== 'locked' ? `/content/${module._id}` : '#'}
                  className={`flex items-center p-3 rounded-lg transition-colors space-x-3 ${
                    module.status === 'locked' ? 'cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-gray-100'
                  } ${isAvailable ? 'bg-blue-50 text-blue-800 font-semibold' : ''}`}
                  onClick={(e) => module.status === 'locked' && e.preventDefault()}
                >
                  {module.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />}
                  {module.status === 'available' && <Play className="h-5 w-5 text-[var(--accent-color)] flex-shrink-0" />}
                  {module.status === 'locked' && <Lock className="h-5 w-5 text-gray-400 flex-shrink-0" />}
                  <span className="truncate">{module.title}</span>
                </Link>
              );
            })}
          </nav>
            <div className="p-4 border-t border-gray-200">
                <Link href="/dashboard" className="flex sm:hidden items-center justify-center space-x-2 text-sm font-medium text-gray-600 hover:text-[var(--accent-color)] transition-colors">
                 <ArrowLeft className="h-4 w-4" />
                 <span>Back to Lumo</span>
              </Link>
            </div>
        </aside>

        <main className="flex-1 p-6 sm:p-8 bg-gray-100/50">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-lg text-gray-600 mt-1">You're making great progress. Let's keep the momentum going.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Progress</CardTitle><BarChart className="h-4 w-4 text-gray-500"/></CardHeader><CardContent><div className="text-3xl font-bold">{progress}%</div><p className="text-xs text-gray-500">Course unlocked</p></CardContent></Card>
              <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Unlocked</CardTitle><FileText className="h-4 w-4 text-gray-500"/></CardHeader><CardContent><div className="text-3xl font-bold">{unlockedCount}/{totalCount}</div><p className="text-xs text-gray-500">Modules available</p></CardContent></Card>
              <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Certificate</CardTitle><Award className="h-4 w-4 text-gray-500"/></CardHeader><CardContent><div className="text-3xl font-bold">{progress === 100 ? 'Ready!' : 'Locked'}</div><p className="text-xs text-gray-500">Unlock all modules</p></CardContent></Card>
            </div>

            {progress < 100 && nextModule && (
              <Card className="mb-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-xl">
                <CardHeader><CardTitle className="flex items-center gap-2"><Star className="text-yellow-400"/>Next Up: Continue Your Journey</CardTitle></CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{nextModule.title}</h3>
                    <p className="text-sm text-gray-300 mt-1">{nextModule.description}</p>
                  </div>
                  <Link href={`/content/${nextModule._id}`}>
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-200 font-bold">
                        Continue Module
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {progress === 100 && (
              <Card className="mb-8 bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 shadow-lg">
                <CardContent className="p-8 text-center">
                    <Award className="h-16 w-16 mx-auto mb-4 text-white" />
                    <h3 className="text-2xl font-bold mb-2">Congratulations! Course Unlocked!</h3>
                    <p className="text-yellow-800 mb-6">You have successfully unlocked all modules. You can now claim your certificate.</p>
                    <Link href={`/institution/${institution._id}/certificate`}>
                        <Button size="lg" variant="secondary" className="bg-white/90 hover:bg-white font-bold">
                            Get Your Certificate
                        </Button>
                    </Link>
                </CardContent>
              </Card>
            )}
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">All Course Modules</h2>
              <div className="grid gap-4">
                {moduleStatuses.map((module) => (
                  <ModuleCard
                    key={module._id}
                    module={module}
                    status={module.status}
                    accentColor={accentColor}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {isSidebarOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />)}
    </div>
  );
}

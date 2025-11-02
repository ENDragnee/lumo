"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FileText, FileSpreadsheet, Loader2, Users, Building, BookOpen, MousePointerClick } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

type ReportType = 'users' | 'sub-institutions' | 'content' | 'interactions';
type ReportFormat = 'xlsx' | 'pdf';

export default function ReportsPage() {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownload = async (reportType: ReportType, format: ReportFormat) => {
    const downloadKey = `${reportType}-${format}`;
    setIsDownloading(downloadKey);

    try {
      const response = await fetch(`/api/reports/${reportType}?format=${format}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to generate the ${reportType} report.`);
      }
      
      const disposition = response.headers.get("Content-Disposition");
      let filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format}`;
      if (disposition && disposition.includes('attachment')) {
        const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: `Your ${format.toUpperCase()} report is now downloading.`,
      });

    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(null);
    }
  };

  // Centralized data for rendering report cards to keep JSX clean
  const reportCards = [
    {
      type: 'users' as ReportType,
      title: "User Performance Report",
      description: "A detailed list of all registered users, their status, registration date, and average performance.",
      icon: <Users className="h-6 w-6 text-blue-500" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      type: 'sub-institutions' as ReportType,
      title: "Sub-Institutions Report",
      description: "An overview of all sub-institutions, including their owner, member count, and subscription status.",
      icon: <Building className="h-6 w-6 text-purple-500" />,
      iconBg: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      type: 'content' as ReportType,
      title: "Content Engagement Report",
      description: "Metrics for each content module, detailing engagement, completion rates, and average scores.",
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      iconBg: "bg-green-100 dark:bg-green-900/30"
    },
    {
      type: 'interactions' as ReportType,
      title: "User Interaction Log",
      description: "A comprehensive log of all user interactions with content, including start/end times and duration.",
      icon: <MousePointerClick className="h-6 w-6 text-orange-500" />,
      iconBg: "bg-orange-100 dark:bg-orange-900/30"
    }
  ];

  return (
    <div className="p-4 md:p-8">
       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Download Center</CardTitle>
            <CardDescription>
              Generate and download detailed reports for your institution's users, content, and organizational structure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {reportCards.map((report, index) => {
                const xlsxKey = `${report.type}-xlsx`;
                const pdfKey = `${report.type}-pdf`;

                return (
                  <motion.div 
                    key={report.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
                      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                        <div className={`flex-shrink-0 p-3 rounded-full ${report.iconBg}`}>
                          {report.icon}
                        </div>
                        <div className="flex-grow">
                          <CardTitle>{report.title}</CardTitle>
                          <CardDescription className="mt-1">{report.description}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardFooter className="mt-auto flex items-center gap-4 pt-4">
                        <Button 
                          variant="outline"
                          onClick={() => handleDownload(report.type, "xlsx")} 
                          disabled={isDownloading !== null}
                          className="w-full"
                        >
                          {isDownloading === xlsxKey ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                          )}
                          Download Excel
                        </Button>
                        
                        <Button 
                          variant="outline"
                          onClick={() => handleDownload(report.type, "pdf")} 
                          disabled={isDownloading !== null}
                          className="w-full"
                        >
                          {isDownloading === pdfKey ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <FileText className="mr-2 h-4 w-4" />
                          )}
                          Download PDF
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })}

            </div>
          </CardContent>
        </Card>
       </motion.div>
    </div>
  );
}

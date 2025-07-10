"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

export function DataPrivacyPanel() {
  return (
    <Card className="shadow-apple-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-responsive-h3">
          <Database className="w-5 h-5 text-pacific" />
          Data & Privacy
        </CardTitle>
      </CardHeader>
      <CardContent className="p-12 text-center text-graphite">
        <p>Options to manage your data and download your personal information coming soon.</p>
      </CardContent>
    </Card>
  );
}

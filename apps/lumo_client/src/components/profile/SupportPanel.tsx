"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export function SupportPanel() {
  return (
    <Card className="shadow-apple-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-responsive-h3">
          <HelpCircle className="w-5 h-5 text-pacific" />
          Help & Support
        </CardTitle>
      </CardHeader>
      <CardContent className="p-12 text-center text-graphite">
        <p>FAQ, contact forms, and support resources coming soon.</p>
      </CardContent>
    </Card>
  );
}

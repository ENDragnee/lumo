"use client";

import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

export default function CertificateClientActions() {

  const downloadCertificate = () => {
    // In a real application, this would trigger a PDF generation API route
    alert("Certificate download would be implemented here.");
    window.print(); // A simple way to generate a printable version
  };

  const shareCertificate = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Ethiopian Tax Education Certificate",
        text: `I've successfully completed the Ethiopian Tax Education course by the Ministry of Revenue!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Certificate link copied to clipboard!");
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
      <Button onClick={downloadCertificate} className="bg-green-600 hover:bg-green-700 px-8 py-3">
        <Download className="h-5 w-5 mr-2" />
        Download / Print
      </Button>
      <Button onClick={shareCertificate} variant="outline" className="px-8 py-3 bg-transparent">
        <Share2 className="h-5 w-5 mr-2" />
        Share Achievement
      </Button>
    </div>
  );
}

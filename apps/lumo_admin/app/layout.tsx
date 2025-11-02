// /app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/Providers"; // ✨ IMPORT THE NEW PROVIDER
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google"; // Added for completeness

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumo Creator Portal",
  description: "Manage your Lumo institution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}

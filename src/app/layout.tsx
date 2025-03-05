"use client"
// /src/app/layout.tsx
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-[#383c4a] text-black dark:text-white">
        <SessionProvider>
          <ThemeProvider attribute="class" enableSystem defaultTheme="light">
            <Toaster position="top-center" expand={false} richColors className="mt-10" />
            <main>{children}</main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

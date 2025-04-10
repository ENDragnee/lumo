// src/app/providers.tsx
"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" enableSystem defaultTheme="light">
        <Toaster position="top-center" expand={false} richColors className="mt-10" />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}

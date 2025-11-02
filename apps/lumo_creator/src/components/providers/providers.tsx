// src/app/providers.tsx
"use client"; // This component uses client-side features

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { ReduxProvider } from "@/app/store/ReduxProvider";
import QueryProvider from "./QueryProvider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
      <ReduxProvider>
        {children}
      </ReduxProvider>
      </ThemeProvider>
    </QueryProvider>
    </SessionProvider>
  );
}

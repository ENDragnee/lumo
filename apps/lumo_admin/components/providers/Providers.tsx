"use client"; 

import { SessionProvider } from "next-auth/react";
import QueryProvider from "./QueryProvider"; // Your existing QueryProvider

// This new component will wrap our entire application,
// providing all the necessary client-side context.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // The SessionProvider needs to be on the outside
    // so that React Query can potentially use session data in its queries.
    <SessionProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </SessionProvider>
  );
}

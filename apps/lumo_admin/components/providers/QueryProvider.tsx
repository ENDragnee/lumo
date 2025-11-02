// /components/providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Using useState ensures the QueryClient is only created once per component lifecycle,
  // preventing re-creation on re-renders, which is important for stability.
  const [queryClient] = useState(() => 
    new QueryClient({
      defaultOptions: {
        queries: {
          // It's good practice to set some sane defaults.
          staleTime: 1000 * 60 * 5, // 5 minutes
          refetchOnWindowFocus: false, // Optional: disable auto-refetch
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* The React Query Devtools are super useful for debugging. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

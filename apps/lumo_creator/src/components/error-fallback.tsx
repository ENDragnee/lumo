//@/components/error-fallback.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-red-100 dark:bg-red-900/30 p-3 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="mt-4">Oops! Something Went Wrong</CardTitle>
          <CardDescription>
            We encountered an error while trying to load the data for this page. Please try again or return to the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* This section will only render in development mode for easier debugging */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="bg-secondary p-3 rounded-md text-left text-xs text-muted-foreground my-4">
              <p className="font-semibold">Developer Debug Info:</p>
              <code>{error.message}</code>
            </div>
          )}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button variant="outline" onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button asChild>
              <Link href="/home">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

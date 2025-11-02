import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function InstitutionHubCardSkeleton() {
  return (
    <Card className="shadow-apple-md bg-white/60 backdrop-blur-sm">
      <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
        <Skeleton className="w-20 h-20 rounded-lg" />
        <div className="flex-1 text-center md:text-left">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-full max-w-xs mb-4" />
          <div className="flex justify-center md:justify-start items-center gap-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
        <Skeleton className="h-10 w-32 rounded-md mt-4 md:mt-0" />
      </CardContent>
    </Card>
  )
}

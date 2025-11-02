
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Bell, CheckCircle, ArrowRight } from "lucide-react"

export function InstitutionHubCard({ institution }: any) {
  const router = useRouter()
  return (
    <div>
      <h2 className="text-3xl font-bold text-shadow tracking-tight mb-4">Institution Portal</h2>
      <Card className="bg-gradient-to-br from-pacific to-midnight text-frost shadow-apple-lg overflow-hidden">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-lg mb-3 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-1">{institution.name}</h3>
            <p className="text-white/80 text-sm mb-6">{institution.description}</p>

            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>{institution.notifications} New Notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>{institution.tasks} Tasks Due</span>
              </div>
            </div>
          </div>
          <Button className="flex items-center space-x-2 px-5 py-3 bg-white/20 hover:bg-white/30 text-white border-white/30" onClick={() => router.push(`/aastu`)}>
            <span>Explore</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

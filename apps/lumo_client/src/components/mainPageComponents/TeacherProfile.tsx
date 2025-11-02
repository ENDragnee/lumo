import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function TeacherProfile({ avatar, name, subjects, rating, department, experience }: any) {
  return (
    <Card className="group apple-hover cursor-pointer shadow-apple-md w-full max-w-[280px]">
      <CardContent className="p-6 text-center">
        <Avatar className="w-16 h-16 mx-auto mb-4 ring-4 ring-cloud group-hover:ring-pacific transition-all duration-300">
          <AvatarImage src={avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-sm font-semibold bg-pacific text-frost">
            {name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <h4 className="text-lg font-semibold text-shadow mb-1">{name}</h4>
        <p className="text-sm text-graphite mb-2">{department}</p>

        <div className="flex items-center justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-butter text-butter" : "text-cloud"}`} />
          ))}
          <span className="text-xs text-graphite ml-1">{rating}</span>
        </div>

        <div className="flex flex-wrap gap-1 justify-center mb-4">
          {subjects.slice(0, 2).map((subject: string) => (
            <Badge key={subject} variant="secondary" className="text-xs bg-cloud text-graphite">
              {subject}
            </Badge>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full group-hover:bg-pacific group-hover:text-frost group-hover:border-pacific transition-all duration-300"
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  )
}

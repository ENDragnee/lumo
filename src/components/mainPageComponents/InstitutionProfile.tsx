"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { IInstitution } from "@/models/Institution";

export function InstitutionProfile({ institution }: { institution: IInstitution }) {
  const logoUrl = institution.branding?.logoUrl || "/placeholder.svg";
  
  const fallbackText = institution.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Link href={`/institution/${institution._id}`} className="block">
      <Card className="group apple-hover cursor-pointer shadow-apple-md w-full max-w-[280px] h-full transition-all duration-300">
        <CardContent className="p-6 text-center flex flex-col justify-between h-full">
          <div>
            <Avatar className="w-16 h-16 mx-auto mb-4 ring-4 ring-cloud group-hover:ring-pacific transition-all duration-300">
              <AvatarImage src={logoUrl} alt={`${institution.name} logo`} />
              <AvatarFallback className="text-sm font-semibold bg-pacific text-frost">
                {fallbackText}
              </AvatarFallback>
            </Avatar>

            <h4 className="text-lg font-semibold text-shadow mb-1">{institution.name}</h4>

            <div className="flex items-center justify-center gap-2 mb-4 text-sm text-graphite">
              <Users className="w-4 h-4" />
              <span>{institution.members.length} Members</span>
            </div>

            <div className="flex flex-wrap gap-1 justify-center mb-4">
              <Badge variant="secondary" className="text-xs bg-cloud text-graphite">
                Education
              </Badge>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-auto group-hover:bg-pacific group-hover:text-frost group-hover:border-pacific transition-all duration-300"
            tabIndex={-1} 
          >
            View Portal
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}

"use client" // This is the crucial directive that solves the error.

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users } from "lucide-react"
import type { Department } from "@/app/hooks/courseData" // Adjust path if needed
import { useRouter } from "next/navigation"

// Define the augmented Department type again for use in this component
export type UIDepartment = Department & {
  id: string
  category: string
  image: string
  students: number
  duration: string
  collegeName: string
  path?: string
}

export const DepartmentCard = ({ department }: { department: UIDepartment }) => {
  const router = useRouter()
  return (
    <Card key={department.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative h-40">
        <Image
          src={department.image}
          alt={department.name}
          fill
          className="object-cover"
          // The onError handler is now safely inside a Client Component
          onError={(e) => {
            e.currentTarget.src = "/images/aastu-gbi.jpg" // Fallback image
          }}
        />
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{department.collegeName}</p>
        <h3 className="font-semibold text-lg mb-2">{department.name}</h3>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1.5" />
            <span>{department.students} students</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1.5" />
            <span>{department.duration}</span>
          </div>
        </div>
        <div className="mt-auto">
          <Link href={`/courses/${department.id}`} passHref>
            <Button variant="outline" className="w-full" onClick={() => router.push(`${department.path}`)}>
              Explore Program
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
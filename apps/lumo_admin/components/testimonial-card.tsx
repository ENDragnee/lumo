"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface TestimonialProps {
  name: string
  role: string
  institution: string
  content: string
  avatar: string
  rating: number
  index: number
}

export function TestimonialCard({ name, role, institution, content, avatar, rating, index }: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <blockquote className="text-gray-700 mb-6 italic">"{content}"</blockquote>
          <div className="flex items-center">
            <Avatar className="w-12 h-12 mr-4">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
              <AvatarFallback>
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900">{name}</div>
              <div className="text-sm text-gray-600">{role}</div>
              <div className="text-sm text-blue-600 font-medium">{institution}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

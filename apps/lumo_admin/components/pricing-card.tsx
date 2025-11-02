"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

interface PricingPlan {
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
  buttonText: string
  buttonVariant?: "default" | "outline"
}

interface PricingCardProps {
  plan: PricingPlan
  index: number
}

export function PricingCard({ plan, index }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="relative h-full"
    >
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1">
          Most Popular
        </Badge>
      )}
      <Card
        className={`h-full border-2 transition-all duration-300 ${
          plan.popular
            ? "border-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50"
            : "border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl"
        }`}
      >
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
          <div className="mt-4">
            <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
            {plan.price !== "Custom" && <span className="text-gray-600">/month</span>}
          </div>
          <CardDescription className="mt-2 text-gray-600">{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-3">
            {plan.features.map((feature, idx) => (
              <motion.li
                key={idx}
                className="flex items-center text-gray-700"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + idx * 0.05 }}
              >
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                {feature}
              </motion.li>
            ))}
          </ul>
          <Button
            className={`w-full py-3 ${plan.popular ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" : ""}`}
            variant={plan.buttonVariant || "default"}
            size="lg"
          >
            {plan.buttonText}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

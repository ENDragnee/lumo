"use client"

import { motion } from "framer-motion"
import { BookOpen, Users, BarChart3, Palette, Shield, Zap } from "lucide-react"

const icons = [
  { Icon: BookOpen, delay: 0 },
  { Icon: Users, delay: 0.5 },
  { Icon: BarChart3, delay: 1 },
  { Icon: Palette, delay: 1.5 },
  { Icon: Shield, delay: 2 },
  { Icon: Zap, delay: 2.5 },
]

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, delay }, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: `${20 + index * 15}%`,
            top: `${30 + (index % 2) * 40}%`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 0.1, 0],
            y: [20, -20, 20],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 8,
            delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Icon className="w-8 h-8 text-blue-200" />
        </motion.div>
      ))}
    </div>
  )
}

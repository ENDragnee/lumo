"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface NotificationProps {
  message: string
  duration?: number
}

export function Notification({ message, duration = 5000 }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, message])

  useEffect(() => {
    setIsVisible(true)
  }, [message])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 bg-white/90 dark:bg-black/90 text-black dark:text-white px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm z-50"
        >
          <p className="text-base font-semibold text-center">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


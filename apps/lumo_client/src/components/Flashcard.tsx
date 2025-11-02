"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'

interface FlashcardProps {
  question: string
  answer: string
}

export default function Flashcard({ question, answer }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="perspective-1000 w-full max-w-md h-64 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg flex items-center justify-center p-6">
          <h2 className="text-2xl font-semibold text-gray-800">{question}</h2>
        </div>
        <div className="absolute w-full h-full backface-hidden bg-blue-500 text-white rounded-xl shadow-lg flex items-center justify-center p-6" style={{ transform: "rotateY(180deg)" }}>
          <p className="text-xl">{answer}</p>
        </div>
      </motion.div>
    </div>
  )
}


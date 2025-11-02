"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'

interface InteractiveQuizProps {
  quizData: {
    question: string
    options: string[]
    correctAnswer: number
    hint: string
  }[]
}

const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ quizData }) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
 
  const handleStartQuiz = () => {
    setIsOpen(false)
    router.push(`/quiz/0?quizData=${encodeURIComponent(JSON.stringify(quizData))}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5294e2] hover:bg-[#5294e2]/90 text-white">
          Exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#3b4252] text-white">
        <DialogHeader>
          <DialogTitle>Start Quiz</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you ready to start the quiz?</p>
        </div>
        <Button onClick={handleStartQuiz} className="bg-[#5294e2] hover:bg-[#5294e2]/90 text-white">
          Start Quiz
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default InteractiveQuiz


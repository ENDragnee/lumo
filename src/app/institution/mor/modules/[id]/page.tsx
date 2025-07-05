"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Progress from "@/components/test/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, FileText, Video, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

const moduleContent = {
  1: {
    title: "Introduction to Ethiopian Tax System",
    description: "Overview of ERCA, federal vs regional tax, tax categories",
    duration: "30 min",
    sections: [
      {
        type: "text",
        title: "Welcome to Ethiopian Taxation",
        content: `Ethiopia's tax system is administered by the Ethiopian Revenues and Customs Authority (ERCA). Understanding this system is crucial for every business owner in Ethiopia.

The Ethiopian tax system operates on multiple levels:
• Federal taxes (administered by ERCA)
• Regional taxes (administered by regional governments)
• Local taxes (administered by local governments)

As a small business owner, you'll primarily deal with federal taxes, which include:
• Value Added Tax (VAT)
• Turnover Tax (TOT)
• Income Tax
• Withholding Tax
• Payroll taxes`,
      },
      {
        type: "video",
        title: "ERCA Overview Video",
        content: "Understanding the role of ERCA in tax administration",
        videoId: "erca-overview",
      },
      {
        type: "text",
        title: "Tax Categories for Small Businesses",
        content: `Small businesses in Ethiopia are categorized based on their annual turnover:

Category A: Annual turnover up to 500,000 Birr
• Subject to Turnover Tax (TOT)
• Simple tax calculation
• Minimal record-keeping requirements

Category B: Annual turnover 500,001 to 2,000,000 Birr
• Subject to standard Income Tax
• Must maintain proper books of accounts
• Required to issue tax invoices

Category C: Annual turnover above 2,000,000 Birr
• Subject to VAT registration
• Must maintain detailed records
• Required to file monthly VAT returns`,
      },
    ],
    quiz: {
      questions: [
        {
          question: "What does ERCA stand for?",
          options: [
            "Ethiopian Revenue Collection Authority",
            "Ethiopian Revenues and Customs Authority",
            "Ethiopian Regional Customs Authority",
            "Ethiopian Revenue and Control Authority",
          ],
          correct: 1,
        },
        {
          question: "At what annual turnover level must a business register for VAT?",
          options: ["500,000 Birr", "1,000,000 Birr", "2,000,000 Birr", "5,000,000 Birr"],
          correct: 2,
        },
        {
          question: "Which tax applies to businesses with annual turnover up to 500,000 Birr?",
          options: ["VAT", "Income Tax", "Turnover Tax (TOT)", "Withholding Tax"],
          correct: 2,
        },
      ],
    },
  },
  // Add more modules as needed
}

export default function ModulePage() {
  const router = useRouter()
  const params = useParams()
  const moduleId = Number.parseInt(params.id as string)

  const [currentSection, setCurrentSection] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [moduleCompleted, setModuleCompleted] = useState(false)

  const module = moduleContent[moduleId as keyof typeof moduleContent]

  useEffect(() => {
    if (!module) {
      router.push("/dashboard")
      return
    }

    // Check if user has access to this module
    const storedProgress = localStorage.getItem("courseProgress")
    const progressData = storedProgress ? JSON.parse(storedProgress) : { completed: [], percentage: 0 }

    if (moduleId > 1 && !progressData.completed.includes(moduleId - 1)) {
      router.push("/dashboard")
      return
    }
  }, [moduleId, module, router])

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }))
  }

  const submitQuiz = () => {
    let correct = 0
    module.quiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        correct++
      }
    })

    const score = Math.round((correct / module.quiz.questions.length) * 100)
    setQuizScore(score)
    setQuizSubmitted(true)

    if (score >= 70) {
      completeModule()
    }
  }

  const completeModule = () => {
    const storedProgress = localStorage.getItem("courseProgress")
    const progressData = storedProgress ? JSON.parse(storedProgress) : { completed: [], percentage: 0 }

    if (!progressData.completed.includes(moduleId)) {
      progressData.completed.push(moduleId)
      progressData.percentage = Math.round((progressData.completed.length / 13) * 100)
      localStorage.setItem("courseProgress", JSON.stringify(progressData))
    }

    setModuleCompleted(true)
  }

  const nextSection = () => {
    if (currentSection < module.sections.length - 1) {
      setCurrentSection(currentSection + 1)
    } else {
      setShowQuiz(true)
    }
  }

  const prevSection = () => {
    if (showQuiz) {
      setShowQuiz(false)
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  if (!module) {
    return <div>Module not found</div>
  }

  const progress = showQuiz ? 100 : ((currentSection + 1) / module.sections.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center text-green-600 hover:text-green-700">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900">Module {moduleId}</h1>
              <p className="text-sm text-gray-600">{module.title}</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {!showQuiz ? (
          /* Content Section */
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center space-x-2">
                {module.sections[currentSection].type === "text" && <FileText className="h-5 w-5 text-blue-600" />}
                {module.sections[currentSection].type === "video" && <Video className="h-5 w-5 text-red-600" />}
                <CardTitle>{module.sections[currentSection].title}</CardTitle>
              </div>
              <CardDescription>
                Section {currentSection + 1} of {module.sections.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {module.sections[currentSection].type === "text" && (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {module.sections[currentSection].content}
                  </div>
                </div>
              )}

              {module.sections[currentSection].type === "video" && (
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">{module.sections[currentSection].content}</p>
                    <p className="text-sm text-gray-500 mt-2">Video content would be embedded here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Quiz Section */
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 text-orange-600 mr-2" />
                Module Quiz
              </CardTitle>
              <CardDescription>Answer all questions to complete this module. You need 70% to pass.</CardDescription>
            </CardHeader>
            <CardContent>
              {!quizSubmitted ? (
                <div className="space-y-6">
                  {module.quiz.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="space-y-3">
                      <h3 className="font-medium text-gray-900">
                        {questionIndex + 1}. {question.question}
                      </h3>
                      <RadioGroup
                        value={quizAnswers[questionIndex]?.toString()}
                        onValueChange={(value) => handleQuizAnswer(questionIndex, Number.parseInt(value))}
                      >
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <RadioGroupItem value={optionIndex.toString()} id={`q${questionIndex}-${optionIndex}`} />
                            <Label htmlFor={`q${questionIndex}-${optionIndex}`} className="cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}

                  <Button
                    onClick={submitQuiz}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={Object.keys(quizAnswers).length < module.quiz.questions.length}
                  >
                    Submit Quiz
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  {quizScore >= 70 ? (
                    <div className="space-y-4">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                      <h3 className="text-xl font-bold text-green-600">Congratulations!</h3>
                      <p className="text-gray-600">
                        You scored {quizScore}% and have successfully completed this module.
                      </p>
                      {moduleCompleted && (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>Module completed! You can now proceed to the next module.</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AlertCircle className="h-16 w-16 text-red-600 mx-auto" />
                      <h3 className="text-xl font-bold text-red-600">Try Again</h3>
                      <p className="text-gray-600">
                        You scored {quizScore}%. You need at least 70% to pass this module.
                      </p>
                      <Button
                        onClick={() => {
                          setQuizSubmitted(false)
                          setQuizAnswers({})
                        }}
                        variant="outline"
                      >
                        Retake Quiz
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={prevSection} disabled={currentSection === 0 && !showQuiz}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-gray-500">
            {showQuiz ? "Quiz" : `${currentSection + 1} of ${module.sections.length}`}
          </div>

          {!showQuiz ? (
            <Button onClick={nextSection} className="bg-green-600 hover:bg-green-700">
              {currentSection === module.sections.length - 1 ? "Take Quiz" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : quizSubmitted && quizScore >= 70 ? (
            <Link href="/dashboard">
              <Button className="bg-green-600 hover:bg-green-700">
                Continue to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  )
}

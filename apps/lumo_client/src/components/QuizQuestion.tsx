import React from 'react'

interface QuizQuestionProps {
  question: string
  options: string[]
  correctAnswer: number
  hint: string
  selectedAnswer: number | null
  showResults: boolean
  onSelectAnswer: (answerIndex: number) => void
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  correctAnswer,
  hint,
  selectedAnswer,
  showResults,
  onSelectAnswer,
}) => {
  return (
    <div className="dark:text-white">
      <h2 className="text-xl font-bold mb-4">{question}</h2>
      <ul className="space-y-2">
        {options.map((option, index) => (
          <li key={index}>
            <button
              className={`p-2 rounded-lg w-full text-left transition-colors
                ${
                  showResults
                    ? index === correctAnswer
                      ? 'bg-green-500 dark:bg-green-600 text-white'
                      : selectedAnswer === index
                      ? 'bg-red-500 dark:bg-red-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                    : selectedAnswer === index
                    ? 'bg-blue-300 dark:bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              onClick={() => !showResults && onSelectAnswer(index)}
              disabled={showResults}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
      {showResults && selectedAnswer !== correctAnswer && (
        <p className="mt-4 text-red-500 dark:text-red-400">{hint}</p>
      )}
    </div>
  )
}

export default QuizQuestion

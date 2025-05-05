"use client"

import type React from "react"

import { InlineMath, BlockMath } from "react-katex"
import { useState, useMemo, type ChangeEvent } from "react"
import QuizQuestion from "@/components/QuizQuestion"
import "katex/dist/katex.min.css"
import YouTubePanel from "@/components/content-components/YouTubePanel"
import SimulationPanel from "@/components/content-components/SimulationPanel" // Keep this import if you might add simulations later

// --- Type Definitions --- (Keep existing types)
interface InteractiveSliderProps {
  label: string
  unit: string
  min: number
  max: number
  step: number
  value: number
  onChange: (newValue: number) => void
  formulaSymbol: string
  displayLog?: boolean
}

interface MiniCheckQuestionProps {
  question: string
  correctAnswer: string
  explanation: string
}

interface QuizQuestionProps {
  key: number
  question: string
  options: string[]
  correctAnswer: number
  hint: string
  selectedAnswer: number | null
  showResults: boolean
  onSelectAnswer: (answerIndex: number) => void
}

// --- Mini Interactive Question Component --- (Keep existing component)
function MiniCheckQuestion({ question, correctAnswer, explanation }: MiniCheckQuestionProps) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md">
      <p className="font-medium text-sm mb-2 font-inter text-dark-gray dark:text-light-gray">{question}</p>
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="text-xs bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors"
        >
          Check Answer
        </button>
      )}
      {revealed && (
        <div className="text-sm space-y-1 font-inter">
          <p className="text-dark-gray dark:text-light-gray">
            <strong className="text-teal dark:text-mint">Answer:</strong> {correctAnswer}
          </p>
          <p className="text-dark-gray dark:text-light-gray">
            <strong className="text-gray-600 dark:text-gray-400">Explanation:</strong> {explanation}
          </p>
          <button
            onClick={() => setRevealed(false)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 font-inter"
          >
            Hide
          </button>
        </div>
      )}
    </div>
  )
}

// --- Page Specific Data ---
const quizQuestions = [
  {
    question: "What is the core idea behind Machine Learning?",
    options: [
      "Programming computers with specific instructions for every task.",
      "Enabling computers to learn automatically from past data without being explicitly programmed.",
      "Building physical robots that mimic human actions.",
      "Designing complex databases for information storage.",
    ],
    correctAnswer: 1,
    hint: "Think about learning from experience or data.",
  },
  {
    question: "Who is credited with coining the term 'Machine Learning' in 1959?",
    options: ["Alan Turing", "Geoffrey Hinton", "Arthur Samuel", "Tom Mitchell"],
    correctAnswer: 2,
    hint: "He developed a famous checkers-playing program.",
  },
  {
    question:
      "According to Tom Mitchell's definition, a computer program learns from experience E with respect to tasks T and performance measure P, if...",
    options: [
      "Its performance P at tasks T improves with experience E.",
      "It can complete tasks T faster with more experience E.",
      "It uses less memory E to perform tasks T with performance P.",
      "The experience E is gathered from tasks T with performance P.",
    ],
    correctAnswer: 0,
    hint: "The definition focuses on improvement in performance through experience.",
  },
  {
    question: "Which type of Machine Learning uses labeled data for training?",
    options: ["Unsupervised Learning", "Reinforcement Learning", "Supervised Learning", "Semi-Supervised Learning"],
    correctAnswer: 2,
    hint: "This type involves learning a mapping from inputs to known outputs.",
  },
  {
    question: "Clustering, where the goal is to group similar data points together, is an example of:",
    options: ["Supervised Learning", "Reinforcement Learning", "Regression", "Unsupervised Learning"],
    correctAnswer: 3,
    hint: "This type of learning deals with unlabeled data to find patterns.",
  },
  {
    question: "Training an agent to play a game by giving it rewards for good moves and penalties for bad ones is:",
    options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Classification"],
    correctAnswer: 2,
    hint: "This learning method is based on feedback from actions in an environment.",
  },
  {
    question: "Which of the following is a common application of Machine Learning?",
    options: ["Image Recognition", "Email Spam Filtering", "Product Recommendations", "All of the above"],
    correctAnswer: 3,
    hint: "ML is used in many modern technologies.",
  },
  {
    question: "What is the first step in the typical Machine Learning life cycle?",
    options: ["Training the Model", "Data Wrangling", "Gathering Data", "Deployment"],
    correctAnswer: 2,
    hint: "You need something to learn from before you can do anything else.",
  },
  {
    question: "Cleaning data and converting it into a usable format is known as:",
    options: ["Data Analysis", "Data Wrangling", "Model Testing", "Data Gathering"],
    correctAnswer: 1,
    hint: "This step deals with issues like missing values and noise.",
  },
  {
    question: "Deep Learning is a subset of Machine Learning primarily based on:",
    options: ["Decision Trees", "Support Vector Machines", "Artificial Neural Networks", "Bayesian Networks"],
    correctAnswer: 2,
    hint: "The 'deep' refers to the number of layers in these structures, inspired by the brain.",
  },
]

// --- Main Page Component ---
export default function MachineLearningIntro() {
  // --- State variables ---
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  // --- Quiz handlers ---
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (showResults) return
    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[questionIndex] = answerIndex
    setSelectedAnswers(newSelectedAnswers)
  }

  const handleSubmit = () => {
    const correctCount = selectedAnswers.reduce((count: number, answer: number | null, index: number) => {
      if (answer === null) return count
      return count + (answer === quizQuestions[index].correctAnswer ? 1 : 0)
    }, 0)
    setScore(correctCount)
    setShowResults(true)
  }

  const resetQuiz = () => {
    setShowQuiz(false)
    setShowResults(false)
    setSelectedAnswers(new Array(quizQuestions.length).fill(null))
    setScore(0)
  }

  // --- Component Render ---
  return (
    <div className="bg-off-white text-dark-gray dark:bg-deep-navy dark:text-light-gray min-h-screen font-lora">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
        {/* Title Section from Page 1 */}
        <h1 className="text-4xl lg:text-5xl font-bold font-playfair mb-8 lg:mb-12 text-center">
          Introduction to Machine Learning
        </h1>
        <p className="text-center text-xl font-inter mb-12 text-gray-600 dark:text-gray-400">Chapter 1: Overview</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
          <article className="lg:col-span-7 space-y-6">
            {/* What is Machine Learning? (Pages 2-5, 10) */}
            <section>
              <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                What is Machine Learning?
              </h2>
              <p className="leading-relaxed">
                Machine learning (ML) is a rapidly growing field within computer science and artificial intelligence
                (AI). At its core, it's about enabling computers to{" "}
                <strong className="text-purple-600 dark:text-purple-400 font-semibold">
                  learn automatically from past data or experiences
                </strong>{" "}
                without being explicitly programmed for every single task. Instead of writing detailed instructions, we
                use algorithms that allow computers to build mathematical models and make predictions based on historical
                information.
              </p>
              <p className="mt-3 leading-relaxed">
                Think about how humans learn – from experience. Machine learning aims to give computers a similar
                capability. As{" "}
                <strong className="text-teal dark:text-teal font-semibold">Arthur Samuel</strong>, who coined the term
                in 1959, put it, ML is the "field of study that gives computers the ability to learn without being
                explicitly programmed."
              </p>
              <p className="mt-3 leading-relaxed">
                A more formal definition by{" "}
                <strong className="text-teal dark:text-teal font-semibold">Tom Mitchell (1998)</strong> states: "A
                computer program is said to learn from{" "}
                <strong className="text-coral dark:text-gold font-semibold">experience E</strong> with respect to some
                class of <strong className="text-coral dark:text-gold font-semibold">tasks T</strong> and{" "}
                <strong className="text-coral dark:text-gold font-semibold">performance measure P</strong>, if its
                performance at tasks in T, as measured by P, improves with experience E."
              </p>
              <MiniCheckQuestion
                question="In Mitchell's definition (E, T, P), what does 'P' stand for?"
                correctAnswer="Performance Measure"
                explanation="P quantifies how well the program is doing on the tasks T, and this measure should improve as the program gains more experience E."
              />
            </section>

            {/* Need for Machine Learning (Pages 23-26) */}
            <section>
              <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                Why Do We Need Machine Learning?
              </h2>
              <p className="leading-relaxed">
                The need for ML is increasing rapidly due to several factors:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                <li>
                <strong className="text-green-600 dark:text-mint font-semibold">Complexity of Tasks:</strong> Some
                problems, like recognizing faces or understanding natural language, are incredibly difficult to
                program explicitly. We might not even know the exact steps our own brains use!
                </li>
                <li>
                <strong className="text-green-600 dark:text-mint font-semibold">Data Explosion:</strong> We generate
                vast amounts of data daily. ML provides tools to automatically analyze this data, find hidden
                patterns, and extract useful insights that humans might miss.
                </li>
                <li>
                <strong className="text-green-600 dark:text-mint font-semibold">Adaptation:</strong> ML models can
                adapt to new data and changing environments, improving their performance over time without manual
                reprogramming.
                </li>
                <li>
                <strong className="text-green-600 dark:text-mint font-semibold">Efficiency:</strong> For complex
                problems, training an ML model can be more efficient and cost-effective than trying to manually
                engineer a solution.
                </li>
              </ul>
              <p className="mt-3 leading-relaxed">
                From self-driving cars and fraud detection to personalized recommendations on Netflix and Amazon, ML is
                already solving complex problems and making our lives easier.
              </p>
            </section>

            {/* How ML Works (Pages 16-18, 20-21) */}
            <section>
              <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                How Does Machine Learning Work?
              </h2>
              <p className="leading-relaxed">
                The basic process involves feeding historical data (often called{" "}
                <strong className="text-purple-600 dark:text-purple-400 font-semibold">training data</strong>) into a
                chosen ML algorithm. The algorithm learns patterns, relationships, and logic from this data to build a{" "}
                <strong className="text-purple-600 dark:text-purple-400 font-semibold">predictive model</strong>.
              </p>
              <p className="mt-3 leading-relaxed">
                Once the model is trained, it can be given new, unseen data, and it will make predictions or decisions
                based on what it learned during training. The accuracy of these predictions often depends heavily on the
                amount and quality of the training data – more relevant data generally leads to better models.
              </p>
              {/* Placeholder for Diagram (e.g., from page 18 or 59) */}
              <div className="my-4 p-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center">
                <p className="font-inter font-semibold text-dark-gray dark:text-light-gray">
                  Simplified Flow:
                </p>
                <p className="font-mono text-sm text-dark-gray dark:text-light-gray mt-2">
                  Past Data → [ML Algorithm learns patterns] → Predictive Model → [Receives New Data] → Output/Prediction
                </p>
                <p className="text-xs mt-2 font-inter text-gray-500 dark:text-gray-400">
                  (This represents the core idea shown in diagrams on pages 18 & 59)
                </p>
              </div>
              <p className="leading-relaxed">
                Before training, data often needs significant{" "}
                <strong className="text-teal dark:text-teal font-semibold">pre-processing</strong> and{" "}
                <strong className="text-teal dark:text-teal font-semibold">wrangling</strong> to clean it and get it
                into a suitable format, whether it's structured, semi-structured, or unstructured.
              </p>
            </section>

            {/* Classification of ML (Pages 38-44) */}
            <section>
              <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                Types of Machine Learning
              </h2>
              <p className="leading-relaxed">
                Machine learning is broadly classified into three main types:
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold font-inter text-coral dark:text-gold">
                    1. Supervised Learning
                  </h3>
                  <p className="ml-4 leading-relaxed">
                    Uses <strong className="font-semibold">labeled data</strong> (input-output pairs) to train models.
                    The goal is to learn a mapping function that can predict the output for new, unseen inputs. Think of
                    it like learning with a teacher providing the correct answers.
                    <br />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Examples: Spam filtering (classifying emails as spam/not spam), predicting house prices
                      (regression).
                    </span>
                    <br />
                    <span className="text-sm font-semibold">Sub-categories: Classification, Regression.</span>
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold font-inter text-coral dark:text-gold">
                    2. Unsupervised Learning
                  </h3>
                  <p className="ml-4 leading-relaxed">
                    Uses <strong className="font-semibold">unlabeled data</strong>. The algorithm tries to find hidden
                    patterns, structures, or relationships within the data on its own, without explicit guidance on what
                    the "correct" output should be.
                    <br />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Examples: Customer segmentation (grouping similar customers), dimensionality reduction.
                    </span>
                    <br />
                    <span className="text-sm font-semibold">Sub-categories: Clustering, Association.</span>
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold font-inter text-coral dark:text-gold">
                    3. Reinforcement Learning
                  </h3>
                  <p className="ml-4 leading-relaxed">
                    An <strong className="font-semibold">agent</strong> learns by interacting with an{" "}
                    <strong className="font-semibold">environment</strong>. It receives{" "}
                    <strong className="font-semibold">rewards</strong> for desirable actions and{" "}
                    <strong className="font-semibold">penalties</strong> for undesirable ones. The goal is to learn a
                    policy (a strategy) that maximizes the cumulative reward over time.
                    <br />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Examples: Training a robot to walk, teaching an AI to play games like Chess or Go.
                    </span>
                  </p>
                </div>
              </div>
              <MiniCheckQuestion
                question="What is the key difference between Supervised and Unsupervised Learning?"
                correctAnswer="Supervised learning uses labeled data (known outputs), while Unsupervised learning uses unlabeled data (outputs are unknown)."
                explanation="Supervision comes from the labels which guide the learning process towards predicting those specific outputs."
              />
            </section>

            {/* Applications (Pages 45-57) */}
            <section>
              <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                Real-World Applications
              </h2>
              <p className="leading-relaxed">
                Machine learning is no longer science fiction; it's integrated into many aspects of our daily lives:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                <li>
                  <strong className="text-green-600 dark:text-mint">Image Recognition:</strong> Identifying objects,
                  people (e.g., Facebook's auto-tagging), and scenes in images.
                </li>
                <li>
                  <strong className="text-green-600 dark:text-mint">Speech Recognition:</strong> Converting spoken
                  language to text (e.g., Siri, Alexa, Google Assistant).
                </li>
                <li>
                  <strong className="text-green-600 dark:text-mint">Product Recommendations:</strong> Suggesting items
                  you might like based on past behavior (e.g., Amazon, Netflix).
                </li>
                <li>
                  <strong className="text-green-600 dark:text-mint">Email Spam Filtering:</strong> Automatically
                  classifying emails as important, normal, or spam (e.g., Gmail).
                </li>
                <li>
                  <strong className="text-green-600 dark:text-mint">Traffic Prediction:</strong> Estimating traffic
                  conditions and suggesting routes (e.g., Google Maps).
                </li>
                <li>
                  <strong className="text-green-600 dark:text-mint">Self-Driving Cars:</strong> Using ML for perception,
                  decision-making, and control.
                </li>
                <li>
                  <strong className="text-green-600 dark:text-mint">Medical Diagnosis:</strong> Assisting doctors in
                  identifying diseases from medical images or data.
                </li>
                <li>
                  <strong className="text-green-600 dark:text-mint">Financial Services:</strong> Fraud detection,
                  algorithmic trading, credit scoring.
                </li>
              </ul>
              {/* Placeholder for Application Diagram (e.g., from page 46) */}
              <div className="my-4 p-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs font-inter text-gray-500 dark:text-gray-400">
                  (See diagram on page 46 for a visual overview of applications)
                </p>
              </div>
            </section>

            {/* ML Life Cycle (Pages 58-66) */}
            <section>
              <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                The Machine Learning Life Cycle
              </h2>
              <p className="leading-relaxed">
                Building an effective ML project typically follows a cyclical process involving several key steps:
              </p>
              <ol className="list-decimal list-inside ml-4 space-y-1 mt-2 font-inter">
                <li>
                  <strong className="text-teal dark:text-teal">Gathering Data:</strong> Identify and collect relevant
                  data from various sources.
                </li>
                <li>
                  <strong className="text-teal dark:text-teal">Data Preparation:</strong> Organize and structure the
                  data; includes initial exploration to understand its nature.
                </li>
                <li>
                  <strong className="text-teal dark:text-teal">Data Wrangling:</strong> Clean the data, handle missing
                  values, remove noise, and transform it into a usable format.
                </li>
                <li>
                  <strong className="text-teal dark:text-teal">Data Analysis:</strong> Explore the data further, select
                  appropriate ML models, and start building initial versions.
                </li>
                <li>
                  <strong className="text-teal dark:text-teal">Training the Model:</strong> Feed the prepared data to
                  the chosen ML algorithm(s) to learn patterns.
                </li>
                <li>
                  <strong className="text-teal dark:text-teal">Testing the Model:</strong> Evaluate the model's
                  performance on unseen test data to check its accuracy and generalization.
                </li>
                <li>
                  <strong className="text-teal dark:text-teal">Deployment:</strong> Integrate the trained model into a
                  real-world system to make predictions or decisions.
                </li>
              </ol>
              {/* Placeholder for Lifecycle Diagram (e.g., from page 59) */}
              <div className="my-4 p-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs font-inter text-gray-500 dark:text-gray-400">
                  (See diagram on page 59 for a visual representation of this cycle)
                </p>
              </div>
              <p className="leading-relaxed mt-2">
                This process is often iterative – results from testing might lead back to earlier steps like gathering
                more data or trying different models.
              </p>
            </section>

            {/* History (Condensed from Pages 27-37) */}
            <section>
              <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                A Brief History of ML
              </h2>
              <p className="leading-relaxed">
                While the term is from 1959, the ideas have roots earlier (Turing). Key milestones include:
              </p>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                  <li>
                    <strong className="text-purple-600 dark:text-purple-400">1950s:</strong> Early work by Arthur Samuel
                    (checkers), foundational AI concepts (Turing test).
                  </li>
                  <li>
                    <strong className="text-purple-600 dark:text-purple-400">1970s:</strong> The "AI Winter" saw reduced
                    funding and interest.
                  </li>
                  <li>
                    <strong className="text-purple-600 dark:text-purple-400">1980s-90s:</strong> Resurgence with expert
                    systems, neural networks (NETtalk), and significant achievements like IBM's Deep Blue beating a chess
                    champion (1997).
                  </li>
                  <li>
                    <strong className="text-purple-600 dark:text-purple-400">2000s-Present:</strong> Explosion driven by
                    big data, computing power, and breakthroughs in Deep Learning (Hinton, 2006). Milestones include
                    Google's cat recognition (2012), advances in NLP (Turing Test passed variant, 2014), computer
                    vision (DeepFace, 2014), and game playing (AlphaGo, 2016).
                  </li>
                </ul>
            </section>

            {/* Related Concepts (Pages 11, 19, 67-71) */}
            <section>
              <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                Related Concepts: AI, Data Science, Deep Learning
              </h2>
              <p className="leading-relaxed">
                These terms are often used together and can be confusing:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                <li>
                  <strong className="text-coral dark:text-gold">Artificial Intelligence (AI):</strong> The broader field
                  of creating machines that can perform tasks typically requiring human intelligence. ML is a *subset*
                  of AI.
                </li>
                <li>
                  <strong className="text-coral dark:text-gold">Data Science (DS):</strong> An interdisciplinary field
                  focused on extracting knowledge and insights from data. It *uses* ML techniques, along with statistics,
                  visualization, domain expertise, etc. They are overlapping fields.
                </li>
                <li>
                  <strong className="text-coral dark:text-gold">Deep Learning (DL):</strong> A *subset* of ML that uses
                  Artificial Neural Networks (ANNs) with many layers ("deep" architectures). DL excels at tasks like
                  image and speech recognition, often requiring large amounts of data.
                </li>
              </ul>
              {/* Placeholder for Venn Diagram (e.g., from page 68) */}
              <div className="my-4 p-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs font-inter text-gray-500 dark:text-gray-400">
                  (See diagram on page 68 showing AI &gt ML &gt DL, with DS overlapping)
                </p>
              </div>
            </section>
          </article>

          {/* Aside Section */}
          <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
            <YouTubePanel videoId="ukzFI9rgwfU" title="What Is Machine Learning? | Explained Simply" />
            <YouTubePanel videoId="NWONeJKn6kc" title="Types Of Machine Learning Explained" />

            {/* Skills Section (Pages 69-70) */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold font-inter mb-4 text-purple-700 dark:text-purple-300">
                Skills in Demand
              </h3>
              <p className="text-sm mb-3 font-inter text-dark-gray dark:text-light-gray">
                Working in ML and Data Science requires a blend of skills:
              </p>
              <h4 className="font-semibold font-inter text-dark-gray dark:text-light-gray">Data Scientist:</h4>
              <ul className="list-disc list-inside text-xs font-inter space-y-1 my-2 ml-4 text-dark-gray dark:text-light-gray">
                <li>Programming (Python, R)</li>
                <li>Databases (SQL)</li>
                <li>ML Algorithms</li>
                <li>Statistics</li>
                <li>Data Mining, Cleaning, Visualization</li>
                <li>Big Data Tools (Hadoop, Spark)</li>
              </ul>
              <h4 className="font-semibold font-inter text-dark-gray dark:text-light-gray">ML Engineer:</h4>
              <ul className="list-disc list-inside text-xs font-inter space-y-1 my-2 ml-4 text-dark-gray dark:text-light-gray">
                <li>ML Algorithm Implementation</li>
                <li>Natural Language Processing (NLP)</li>
                <li>Programming (Python, R)</li>
                <li>Statistics & Probability</li>
                <li>Data Modeling & Evaluation</li>
              </ul>
            </div>

            <YouTubePanel videoId="I74ymkoNTnw" title="Machine Learning Life Cycle | ML Life Cycle" />

            {/* Optional: Link to a relevant simulation if found */}
            {/* <SimulationPanel title="TensorFlow Playground" simulationUrl="https://playground.tensorflow.org/" description="Experiment with a simple neural network in your browser." /> */}
          </aside>
        </div>

        {/* Quiz Button */}
        <div className="flex justify-center items-center mt-12 lg:mt-16">
          <button
            onClick={() => setShowQuiz(true)}
            className="w-full sm:w-1/2 lg:w-1/3 bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-3 px-6 rounded-lg transition-colors text-lg shadow-md"
          >
            Test Your ML Knowledge!
          </button>
        </div>
      </main>

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
            <button
              onClick={resetQuiz}
              className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl"
              aria-label="Close quiz"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">
              Machine Learning Intro Quiz
            </h2>
            <div className="space-y-6 font-inter">
              {quizQuestions.map((q, index) => (
                <QuizQuestion
                  key={index}
                  question={q.question}
                  options={q.options}
                  correctAnswer={q.correctAnswer}
                  hint={q.hint}
                  selectedAnswer={selectedAnswers[index]}
                  showResults={showResults}
                  onSelectAnswer={(answerIndex: number) => handleAnswerSelect(index, answerIndex)}
                />
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              {!showResults ? (
                <button
                  onClick={handleSubmit}
                  className="w-full sm:w-auto bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-bold font-inter py-2 px-6 rounded transition-colors disabled:opacity-50"
                  disabled={selectedAnswers.includes(null)}
                >
                  Submit Answers
                </button>
              ) : (
                <div /> // Placeholder to keep alignment when results are shown
              )}
              <button
                onClick={resetQuiz}
                className="w-full sm:w-auto bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-2 px-6 rounded transition-colors"
              >
                Close Quiz
              </button>
            </div>
            {showResults && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <h3 className="text-xl font-bold font-playfair mb-2 text-dark-gray dark:text-light-gray">
                  Quiz Results
                </h3>
                <p className="text-lg font-inter text-dark-gray dark:text-light-gray">
                  You got <strong className="text-teal dark:text-mint">{score}</strong> out of{" "}
                  <strong className="text-teal dark:text-mint">{quizQuestions.length}</strong> correct!
                </p>
                <p className="text-2xl font-bold font-inter mt-1 text-dark-gray dark:text-light-gray">
                  ({((score / quizQuestions.length) * 100).toFixed(0)}%)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
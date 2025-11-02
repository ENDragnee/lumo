'use client';
import { useState } from 'react';
import { InlineMath } from 'react-katex';
import QuizQuestion from '@/components/QuizQuestion';
import 'katex/dist/katex.min.css';

const quizQuestions = [
  {
    question: "What is the value of acceleration due to gravity used in projectile motion calculations?",
    options: ["5.8 m/s²", "7.8 m/s²", "9.8 m/s²", "11.8 m/s²"],
    correctAnswer: 2,
    hint: "Review the basic assumptions of projectile motion."
  },
  {
    question: "Which of the following is NOT an assumption in projectile motion?",
    options: [
      "Free-fall acceleration is constant",
      "Air resistance is negligible",
      "Horizontal velocity changes constantly",
      "Vertical and horizontal motions are independent"
    ],
    correctAnswer: 2,
    hint: "Remember that horizontal velocity remains constant in projectile motion."
  },
  {
    question: "The path of a projectile is called:",
    options: ["Linear", "Circular", "Parabolic", "Hyperbolic"],
    correctAnswer: 2,
    hint: "Think about the shape formed by combining constant horizontal velocity with accelerating vertical motion."
  },
  {
    question: "In horizontal projection, what is the initial vertical velocity?",
    options: ["Maximum", "Variable", "Zero", "Equal to horizontal velocity"],
    correctAnswer: 2,
    hint: "Consider the initial conditions of horizontal projection."
  },
  {
    question: "Which component of velocity remains constant during projectile motion?",
    options: ["Vertical", "Horizontal", "Both", "Neither"],
    correctAnswer: 1,
    hint: "Think about which direction experiences no acceleration."
  },
  {
    question: "For maximum range, what should be the angle of projection?",
    options: ["30°", "45°", "60°", "90°"],
    correctAnswer: 1,
    hint: "Consider the angle that maximizes the sin(2θ) term in the range equation."
  },
  {
    question: "What is the vertical acceleration in projectile motion?",
    options: ["Zero", "9.8 m/s² upward", "9.8 m/s² downward", "Variable"],
    correctAnswer: 2,
    hint: "Think about the direction of gravitational acceleration."
  },
  {
    question: "In the equation R = (v₀² sin 2θ)/g, what does R represent?",
    options: ["Height", "Time", "Range", "Velocity"],
    correctAnswer: 2,
    hint: "This equation calculates the horizontal distance traveled by the projectile."
  },
  {
    question: "For a given initial velocity, when is the maximum height achieved?",
    options: ["At 30°", "At 45°", "At 60°", "At 90°"],
    correctAnswer: 3,
    hint: "Consider when the vertical component of velocity would be maximum."
  },
  {
    question: "What determines the time of flight in projectile motion?",
    options: [
      "Only initial velocity",
      "Only angle of projection",
      "Only height of projection",
      "All of the above"
    ],
    correctAnswer: 3,
    hint: "Think about all factors that affect how long the projectile stays in the air."
  }
];

export default function ProjectileMotion() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0); 

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleSubmit = () => {
    const correctCount = selectedAnswers.reduce((count: number, answer: number | null, index: number) => {
      if (answer === null) return count;
      return count + (answer === quizQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
    setScore(correctCount);
    setShowResults(true);
  };

  return (
    <div className="px-6 sm:px-6 sm:text-xs md:text-base py-6 max-w-4xl mx-auto text-justify">
      <h1 className="text-3xl font-bold mb-6">2.1 Projectile Motion</h1>
      <p>
        A projectile is a thrown, fired, or released object that moves only
        under the influence of gravitational force. The projectile acceleration
        is <InlineMath math="g = 9.8 \, \text{m/s}^2" />. Anyone who has observed the motion of
        a ball kicked by a football player (Figure 2.1b) has observed projectile
        motion. The ball moves in a curved path and returns to the ground. Other
        examples of projectile motion include a cannonball fired from a cannon,
        a bullet fired from a gun, the flight of a golf ball, and a jet of water
        escaping a hose.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">
        Assumptions of Projectile Motion
      </h2>
      <ol className="list-decimal ml-6 mb-6">
        <li>
          The free-fall acceleration is constant over the range of motion and is
          always directed downward. It is the acceleration due to gravity (
          <InlineMath math="g=9.8 \, \text{m/s}^2" />).
        </li>
        <li>The effect of air resistance is negligible.</li>
        <li>
          The horizontal velocity is constant because the acceleration of the
          object does not have a vertical component.
        </li>
      </ol>

      <p>
        With these assumptions, the path of a projectile, called its trajectory,
        is a parabola. The horizontal and vertical components of a projectile’s
        motion are completely independent of each other and can be handled
        separately, with time <InlineMath math="t" /> as a common variable for both components.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">
        Horizontal Projection
      </h2>
      <p>
        In this type of motion, the projectile is projected horizontally from a
        certain height. Its initial velocity along the vertical direction is
        zero, and it possesses only horizontal velocity at the beginning. Over
        time, due to gravity, it acquires a vertical component of velocity.
      </p>

      <h3 className="text-xl font-semibold mt-4">Horizontal Component</h3>
      <p>The projectile has zero acceleration along the \( x \)-direction:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          <InlineMath math="v_x = v_{0x} \, (\text{constant})" />
        </li>
        <li>
          <InlineMath math="\Delta x = v_{0x} t" />
        </li>
      </ul>

      <h3 className="text-xl font-semibold mt-4">Vertical Component</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>
          <InlineMath math="v_y = v_{0y} + g t" />
        </li>
        <li>
          <InlineMath math="\Delta y = v_{0y} t + \frac{1}{2} g t^2" />
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Time of Flight</h2>
      <p>
        The time of flight is the time taken by the projectile to hit the
        ground. Using <InlineMath math="\Delta y = \frac{1}{2} g t^2" />, we calculate the total
        flight time.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Range</h2>
      <p>
        The range is the maximum horizontal distance traveled by the projectile.
        Using <InlineMath math="R = v_{0x} t" />, we can find the range.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">
        Inclined Projectile Motion
      </h2>
      <p>
        When an object is projected at an angle <InlineMath math="\theta" />, its motion can be
        analyzed by breaking its initial velocity into horizontal and vertical
        components:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          <InlineMath math="v_{0x} = v_0 \cos \theta" />
        </li>
        <li>
          <InlineMath math="v_{0y} = v_0 \sin \theta" />
        </li>
      </ul>

      <h3 className="text-xl font-semibold mt-4">Key Equations</h3>
      <ul className="list-disc ml-6">
        <li>
          Horizontal displacement: <InlineMath math="\Delta x = v_0 \cos \theta t" />
        </li>
        <li>
          Vertical displacement: <InlineMath math="\Delta y = v_0 \sin \theta t + \frac{1}{2} g t^2" />
        </li>
        <li>
          Total time of flight (when starting and landing at the same height):
          <InlineMath math="t = \frac{2v_0 \sin \theta}{g}" />
        </li>
        <li>
          Maximum height: <InlineMath math="H = \frac{v_0^2 \sin^2 \theta}{2g}" />
        </li>
        <li>
          Range: <InlineMath math="R = \frac{v_0^2 \sin 2\theta}{g}" />
        </li>
      </ul>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mt-6 mb-4">
          Interactive Simulation
        </h2>
        <p>
          Explore the concepts of projectile motion using the interactive
          simulation below:
        </p>
        <div className='relative w-full overflow-hidden aspect-video'>
          <iframe
            src="https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html"
            allowFullScreen
            className='responsive-iframe top-0 left-0 w-full h-full'
          ></iframe>
        </div>

        <div className='flex justify-center items-center'>
          <button 
            onClick={() => setShowQuiz(true)}
            className="w-1/2 h-1/2 mt-6 bg-slate-400 hover:bg-slate-500 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Take Quiz
          </button>
        </div>

      {showQuiz && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-[#242424] p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => {
                setShowQuiz(false);
                setShowResults(false);
                setSelectedAnswers(new Array(quizQuestions.length).fill(null));
              }}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Projectile Motion Quiz</h2>
            <div className="space-y-6">
              {quizQuestions.map((q, index) => (
                <QuizQuestion
                  key={index}
                  question={q.question}
                  options={q.options}
                  correctAnswer={q.correctAnswer}
                  hint={q.hint}
                  selectedAnswer={selectedAnswers[index]}
                  showResults={showResults}
                  onSelectAnswer={(answerIndex) => handleAnswerSelect(index, answerIndex)}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              {!showResults && (
                <button 
                  onClick={handleSubmit}
                  className="bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Submit
                </button>
              )}
              <button 
                onClick={() => {
                  setShowQuiz(false);
                  setShowResults(false);
                  setSelectedAnswers(new Array(quizQuestions.length).fill(null));
                }}
                className="bg-red-500 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Close
              </button>
            </div>
            {showResults && (
              <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="text-xl font-bold mb-2 dark:text-white">Quiz Results</h3>
                <p className="dark:text-white">
                  You got {score} out of {quizQuestions.length} questions correct! 
                  ({((score / quizQuestions.length) * 100).toFixed(1)}%)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

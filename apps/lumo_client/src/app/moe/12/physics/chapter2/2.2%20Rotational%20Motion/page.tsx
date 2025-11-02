"use client";

import { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import QuizQuestion from '@/components/QuizQuestion';
import 'katex/dist/katex.min.css';

const quizQuestions = [
  {
    "question": "What is the definition of a rigid body in rotational motion?",
    "options": [
      "An object that can change shape under force",
      "An object with a perfectly defined and unchanging shape",
      "An object with variable distance between particles",
      "An object that moves linearly"
    ],
    "correctAnswer": 1,
    "hint": "Consider the relationship between particles in the object."
  },
  {
    "question": "What is angular displacement typically measured in?",
    "options": [
      "Degrees",
      "Radians",
      "Meters",
      "Seconds"
    ],
    "correctAnswer": 1,
    "hint": "One complete revolution equals 2π of this unit."
  },
  {
    "question": "Which of the following is the formula for angular displacement?",
    "options": [
      "Δθ = θf - θ0",
      "Δθ = ωf - ω0",
      "Δθ = αt",
      "Δθ = v/t"
    ],
    "correctAnswer": 0,
    "hint": "Focus on the initial and final angles of rotation."
  },
  {
    "question": "What is the rate of change of angular displacement called?",
    "options": [
      "Angular displacement",
      "Angular acceleration",
      "Angular velocity",
      "Linear velocity"
    ],
    "correctAnswer": 2,
    "hint": "It is represented by the symbol ω."
  },
  {
    "question": "How is angular velocity measured?",
    "options": [
      "Radians per second (rad/s)",
      "Meters per second (m/s)",
      "Radians per second squared (rad/s²)",
      "Degrees per second (deg/s)"
    ],
    "correctAnswer": 0,
    "hint": "It relates to the rate of change of angular displacement."
  },
  {
    "question": "What is the formula for angular acceleration?",
    "options": [
      "α = Δω / Δt",
      "α = Δθ / Δt",
      "α = ω0 + Δt",
      "α = v²/r"
    ],
    "correctAnswer": 0,
    "hint": "It involves the change in angular velocity over time."
  },
  {
    "question": "Which rule determines the direction of angular velocity and acceleration vectors?",
    "options": [
      "Left-hand rule",
      "Right-hand rule",
      "Newton's third law",
      "Circular motion law"
    ],
    "correctAnswer": 1,
    "hint": "It involves curling the fingers of your hand in the direction of rotation."
  },
  {
    "question": "Which equation represents rotational motion with constant angular acceleration?",
    "options": [
      "ωf = ω0 + αΔt",
      "v = u + at",
      "Δs = ut + ½at²",
      "F = ma"
    ],
    "correctAnswer": 0,
    "hint": "It is the rotational analogy of v = u + at."
  },
  {
    "question": "What is the rotational kinematic analogy of linear velocity?",
    "options": [
      "Angular displacement (Δθ)",
      "Angular velocity (ω)",
      "Angular acceleration (α)",
      "Linear acceleration (a)"
    ],
    "correctAnswer": 1,
    "hint": "It corresponds to 'v' in linear motion."
  }
]


export default function RotationalMotion() {
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">2.2 Rotational Motion</h1>
      <p>
        Rotational motion is the motion of an object in a circle around a fixed
        axis. Examples include the rotation of the Earth around its axis, the
        flywheel of a sewing machine, a ceiling fan, and the wheels of a car.
      </p>
      <p>
        A disc performing rotational motion (see Figure 2.7) rotates all its
        particles around a fixed axis called the axis of rotation. An object can
        rotate clockwise or counterclockwise.
      </p>
      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-4">Rigid Body</h2>
      <p>
        A rigid body is an object with a perfectly defined and unchanging shape.
        No matter the size of the force, the distance between any two particles
        within the object remains constant.
      </p>
      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-4">
        Angular Displacement and Angular Velocity
      </h2>
      <div className="relative aspect-w-16 aspect-h-9 sm:aspect-h-[10] mb-6">
        <iframe
          src="https://www.youtube.com/embed/Rlj3ikcTYu0"
          className="w-full h-full"
          style={{ minHeight: "450px" }} // Ensures larger height
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <h3 className="text-lg sm:text-xl font-semibold mt-4">Angular Displacement</h3>
      <p>
        As shown in Figure 2.8, a particle on a rigid disc moves through an
        angle <InlineMath math="\theta" />. Because the object is rigid, all its
        particles rotate through the same angle. This angle is defined as the
        angular displacement, <InlineMath math="\Delta \theta" />:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath math="\Delta \theta = \theta_f - \theta_0" />
      </div>
      <p>
        Angular displacement is typically measured in radians. One complete
        revolution equals <InlineMath math="2\pi" /> radians or 360 degrees.
      </p>
      <h3 className="text-lg sm:text-xl font-semibold mt-4">Angular Velocity</h3>
      <p>
        The rate of change of angular displacement is angular velocity
        <InlineMath math="\omega" />:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath math="\omega = \frac{\Delta \theta}{\Delta t}" />
      </div>
      <p>
        Angular velocity is measured in radians per second (
        <InlineMath math="\text{rad/s}" />
        ).
      </p>
      <h3 className="text-lg sm:text-xl font-semibold mt-4">Angular Acceleration</h3>
      <p>
        If angular velocity changes over time, the object experiences angular
        acceleration <InlineMath math="\alpha" />:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath math="\alpha = \frac{\Delta \omega}{\Delta t}" />
      </div>
      <p>
        Angular acceleration is measured in radians per second squared (
        <InlineMath math="\text{rad/s}^2" />
        ).
      </p>
      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-4">
        Direction of Angular Velocity and Angular Acceleration
      </h2>
      <p>
        Angular velocity and acceleration are vectors. Their directions follow
        the right-hand rule: curl the fingers of your right hand in the
        direction of rotation, and your thumb points in the direction of the
        angular velocity.
      </p>
      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-4">
        Equations of Motion for Constant Angular Acceleration
      </h2>
      <p>
        Analogous to linear motion, rotational motion with constant angular
        acceleration follows these equations:
      </p>
      <ul className="list-disc ml-4 sm:ml-6 mb-4 overflow-x-auto text-wrap text-xs">
        <li>
          <BlockMath math="\omega_f = \omega_0 + \alpha \Delta t" />
        </li>
        <li>
          <BlockMath math="\Delta \theta = \omega_0 \Delta t + \frac{1}{2} \alpha \Delta t^2" />
        </li>
        <li>
          <BlockMath math="\omega_f^2 = \omega_0^2 + 2 \alpha \Delta \theta" />
        </li>
      </ul>
      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-4">
        Kinematic Analogies for Rotational and Linear Motion
      </h2>
      <p>
        Rotational kinematics parallels linear kinematics. Key analogies
        include:
      </p>
      <ul className="list-disc ml-4 sm:ml-6 mb-4">
        <li>
          Angular displacement <InlineMath math="\Delta \theta" /> corresponds
          to linear displacement <InlineMath math="\Delta s" />.
        </li>
        <li>
          Angular velocity <InlineMath math="\omega" /> corresponds to linear
          velocity
          <InlineMath math="v" />.
        </li>
        <li>
          Angular acceleration <InlineMath math="\alpha" /> corresponds to
          linear acceleration <InlineMath math="a" />.
        </li>
      </ul>

      <div className="relative w-full overflow-hidden aspect-video">
        <iframe
          scrolling="no"
          src="https://www.geogebra.org/material/iframe/id/177707/width/850/height/600/border/888888/rc/false/ai/false/sdz/false/smb/false/stb/false/stbh/true/ld/false/sri/true/at/auto"
          className='responsive-iframe top-0 left-0 w-full h-full'
          allowFullScreen
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
  );
}

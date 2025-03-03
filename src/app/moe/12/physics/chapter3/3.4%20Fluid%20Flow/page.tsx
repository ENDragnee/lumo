'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState } from 'react';
import QuizQuestion from '@/components/QuizQuestion';
import 'katex/dist/katex.min.css';

const quizQuestions = [
  {
    "question": "What causes fluid flow?",
    "options": [
      "Differences in temperature",
      "Differences in pressure",
      "Differences in mass",
      "Differences in density"
    ],
    "correctAnswer": 1,
    "hint": "Fluid flow is driven by pressure differences within the fluid."
  },
  {
    "question": "What is steady fluid flow characterized by?",
    "options": [
      "Random particle movement",
      "Constant velocity for each particle",
      "Irregular paths of particles",
      "Crossing paths of particles"
    ],
    "correctAnswer": 2,
    "hint": "In steady flow, every particle arriving at a point has the same velocity."
  },
  {
    "question": "What happens to fluid flow above a certain critical speed?",
    "options": [
      "It becomes laminar",
      "It remains steady",
      "It becomes turbulent",
      "It stops completely"
    ],
    "correctAnswer": 2,
    "hint": "When velocity increases, flow becomes irregular and chaotic."
  },
  {
    "question": "What is viscosity in a fluid?",
    "options": [
      "External pressure force",
      "Internal frictional force",
      "Gravitational attraction",
      "Electromagnetic interaction"
    ],
    "correctAnswer": 1,
    "hint": "Viscosity occurs when adjacent layers of a fluid try to move relative to each other."
  },
  {
    "question": "What is a streamline in a steady fluid flow?",
    "options": [
      "A random path of particles",
      "The surface of a fluid's waves",
      "The path a fluid particle follows under steady conditions",
      "A turbulent area where particles cross each other"
    ],
    "correctAnswer": 2,
    "hint": "In a streamline, the velocity of the fluid particle is always tangent to the path."
  },
  {
    "question": "What is the equation for flow rate \( Q \)?",
    "options": [
      "Q = V/t",
      "Q = P × A",
      "Q = \\rho g V",
      "Q = v² - h"
    ],
    "correctAnswer": 1,
    "hint": "Flow rate is the volume of fluid passing through a point over time."
  },
  {
    "question": "What is the equation of continuity for an incompressible fluid?",
    "options": [
      "A₁ v₁ = A₂ v₂",
      "P₁ = P₂",
      "F_B = V g",
      "ρ v = constant"
    ],
    "correctAnswer": 1,
    "hint": "This equation ensures that the flow rate remains constant in a pipe of varying cross-section."
  },
  {
    "question": "What does Bernoulli’s principle state about fluid speed and pressure?",
    "options": [
      "As speed increases, pressure increases",
      "As speed decreases, pressure decreases",
      "As speed increases, pressure decreases",
      "Speed and pressure remain constant"
    ],
    "correctAnswer": 2,
    "hint": "Pressure decreases as the speed of a moving fluid increases according to Bernoulli's principle."
  },
  {
    "question": "Which type of flow is characterized by smooth paths where particles do not cross each other?",
    "options": [
      "Laminar flow",
      "Turbulent flow",
      "Chaotic flow",
      "Vertical flow"
    ],
    "correctAnswer": 1,
    "hint": "Laminar flow occurs at low velocities and small diameter pipes."
  },
  {
    "question": "Why does pressure decrease in faster-moving regions of a fluid according to Bernoulli's principle?",
    "options": [
      "Due to increased viscosity",
      "Due to the kinetic energy of moving particles",
      "Due to gravitational forces",
      "Due to temperature variations"
    ],
    "correctAnswer": 2,
    "hint": "Bernoulli's principle relates pressure changes to fluid speed and kinetic energy."
  }
]

export default function FluidMechanics() {
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
      <h1 className="text-3xl font-bold mb-6">Fluid Mechanics</h1>

      <h2 className="text-2xl font-semibold mt-6 mb-4">3.4 Fluid Flow</h2>
      <p>
        Fluid flow is caused by differences in pressure. When the pressure in one region of the fluid is lower than in another region, the fluid tends to flow from the higher pressure region toward the lower pressure region. For example, large masses of air in Earth’s atmosphere move from regions of high pressure into regions of low pressure, creating what we call wind.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-4">Steady and Turbulent Fluid Flow</h3>
      <p>
        When fluid is in motion, its flow can be characterized as steady fluid flow if each particle of the fluid follows a smooth path such that the paths of different particles never cross each other. In steady flow, every fluid particle arriving at a given point in space has the same velocity. Laminar flow always occurs when the fluid flow is at low velocity and in small diameter pipes.
      </p>
      <p>
        Above a certain critical speed, turbulent fluid flow occurs. Turbulent flow is irregular flow characterized by small whirlpool-like regions. The adjacent layers of the fluid cross each other and move randomly in a zigzag manner. Turbulent flow occurs when the velocity of the fluid is high and it flows through larger diameter pipes.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-4">Viscosity</h3>
      <p>
        Just as a solid surface is acted upon by a frictional force when it slides over another solid, there is also an internal frictional force in liquids, called viscosity, when two adjacent layers of fluid try to move relative to each other. Viscosity causes part of the fluid’s kinetic energy to be transformed into internal energy. This mechanism is similar to the one by which the kinetic energy of an object sliding over a rough surface decreases.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-4">Streamline and Tube of Flow</h3>
      <p>
        The path taken by a fluid particle under steady flow is called a streamline. The velocity of the particle is always tangent to the streamline. A set of streamlines forms a tube of flow. In laminar flow, fluid particles cannot flow into or out of the sides of this tube; if they could, the streamlines would cross, resulting in turbulent flow.
      </p>
      <div className="relative w-full overflow-hidden aspect-video">
        <iframe
          src="https://phet.colorado.edu/sims/cheerpj/fluid-pressure-and-flow/latest/fluid-pressure-and-flow.html?simulation=fluid-pressure-and-flow"
          className='responsive-iframe top-0 left-0 w-full h-full'
          allowFullScreen
        ></iframe>
      </div>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Flow Rate</h2>
      <p>
        Flow rate <InlineMath>{'Q'}</InlineMath> is defined as the volume of fluid passing by a certain point through an area over a period of time:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>{'Q = \\frac{V}{t}'}</BlockMath>
      </div>
      <p>
        Where <InlineMath>{'V'}</InlineMath> is the volume of fluid, and <InlineMath>{'t'}</InlineMath> is the elapsed time. The SI unit for flow rate is <InlineMath>{'m^3/s'}</InlineMath>, though other units are also commonly used.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Equation of Continuity</h2>
      <p>
        The equation of continuity describes how an incompressible fluid flows through a pipe of varying radius. Since the fluid is incompressible, the same amount of fluid must flow past any point in the pipe during a given time. Thus, as the cross-sectional area of the pipe decreases, the velocity of the fluid must increase to maintain the flow rate. The equation of continuity is given by:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>{'Q_1 = Q_2 \quad A_1 v_1 = A_2 v_2'}</BlockMath>
      </div>
      <p>
        Where <InlineMath>{'v_1'}</InlineMath> and <InlineMath>{'v_2'}</InlineMath> are the average speeds of the fluid at points 1 and 2, and <InlineMath>{'A_1'}</InlineMath> and <InlineMath>{'A_2'}</InlineMath> are the corresponding cross-sectional areas.
      </p>
      <p>
        This equation is valid for any incompressible fluid. However, for compressible fluids like gases, the equation must be applied with caution, especially when they are subjected to significant compression or expansion.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Bernoulli's Principle</h2>
      <p>
        As a fluid’s speed increases, the pressure that the moving fluid exerts on a surface decreases. This is known as Bernoulli’s principle. It states that: 
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>{'P + \\frac{1}{2} \\rho v^2 + \\rho g h = \\text{constant}'}</BlockMath>
      </div>
      <p>
        Where <InlineMath>{'P'}</InlineMath> is the pressure, <InlineMath>{'\\rho'}</InlineMath> is the fluid’s density, <InlineMath>{'v'}</InlineMath> is the velocity of the fluid, and <InlineMath>{'h'}</InlineMath> is the height. This principle explains why pressure decreases as the speed of the fluid increases.
      </p>
      <div className="relative w-full overflow-hidden aspect-video">
        <iframe
          scrolling="no"
          src="https://www.geogebra.org/material/iframe/id/1719715/width/985/height/696/border/888888/rc/false/ai/false/sdz/false/smb/false/stb/false/stbh/true/ld/false/sri/true/at/auto"
          className='responsive-iframe top-0 left-0 w-full h-full'
          style={{ border: "0px" }}
        ></iframe>
      </div>
      <h3 className="text-xl font-semibold mt-6 mb-4">Applications of Fluid Flow</h3>
      <p>
        Fluid flow is important in biological systems, such as the flow of blood through blood vessels. Blood pressure against the walls of a vessel depends on how fast the blood is moving. When blood is moving faster, pressure decreases. A similar principle explains the sound of snoring. As air moves through a narrow passage above the soft palate, the pressure drops, causing the palate to move and create the sound.
      </p>
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

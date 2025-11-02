'use client';

import { InlineMath, BlockMath } from 'react-katex'; // Keep for potential future use
import { useState, ChangeEvent } from 'react'; // Removed useMemo as no complex calculations here
import QuizQuestion from '@/components/QuizQuestion'; // Assuming this component exists
import 'katex/dist/katex.min.css';

// --- Type Definitions ---
// Keep Interfaces for potential future use or consistency, even if not all used here
interface InteractiveSliderProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (newValue: number) => void;
  formulaSymbol: string;
  logScale?: boolean;
}

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

interface MiniCheckQuestionProps {
  question: string;
  correctAnswer: string;
  explanation: string;
}

// !! Adjust based on your actual QuizQuestion component !!
interface QuizQuestionProps {
    key: number;
    // questionNumber?: number; // Make optional or ensure component accepts it
    question: string;
    options: string[];
    correctAnswer: number;
    hint: string;
    selectedAnswer: number | null;
    showResults: boolean;
    onSelectAnswer: (answerIndex: number) => void;
}

// --- Reusable Components (Styled as per design system) ---

// YouTube Embed Component
function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  return (
    <div className="my-4">
      <p className="mb-2 font-semibold font-inter text-dark-gray dark:text-light-gray">{title}:</p>
      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
         <iframe
           className="w-full h-full"
           src={`https://www.youtube.com/embed/${videoId}`}
           title={title}
           frameBorder="0"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           allowFullScreen>
         </iframe>
      </div>
    </div>
  );
}

// Mini Interactive Question Component
function MiniCheckQuestion({ question, correctAnswer, explanation }: MiniCheckQuestionProps) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md">
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
          <p className="text-dark-gray dark:text-light-gray"><strong className="text-teal dark:text-mint">Answer:</strong> {correctAnswer}</p>
          <p className="text-dark-gray dark:text-light-gray"><strong className="text-gray-600 dark:text-gray-400">Explanation:</strong> {explanation}</p>
           <button
            onClick={() => setRevealed(false)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 font-inter"
          >
            Hide
          </button>
        </div>
      )}
    </div>
  );
}


// --- Page Specific Data ---
const quizQuestions = [
  {
    "question": "What pressure level is generally considered 'high pressure' in many industrial contexts?",
    "options": [
      "Just above 1 atmosphere",
      "Around 10 atmospheres",
      "Often greater than 50 atmospheres",
      "Below atmospheric pressure"
    ],
    "correctAnswer": 2, // Index for > 50 atm
    "hint": "High pressure typically refers to pressures significantly exceeding standard atmospheric pressure."
  },
  {
    "question": "Which of these is a common household application using high pressure?",
    "options": [
      "Microwave oven",
      "Refrigerator cooling cycle",
      "Pressure cooker",
      "Electric Kettle"
    ],
    "correctAnswer": 2,
    "hint": "These devices use elevated pressure to increase the boiling point of water and cook food faster."
  },
  {
    "question": "What is the primary function of a safety valve on a high-pressure system like a boiler or gas cylinder?",
    "options": [
      "To increase the operating pressure",
      "To measure the pressure accurately",
      "To automatically release excess pressure if it exceeds a safe limit",
      "To manually adjust the pressure"
    ],
    "correctAnswer": 2,
    "hint": "Safety valves are critical components designed to prevent catastrophic failure due to overpressure."
  },
  {
    "question": "Which hazard is NOT typically associated with a high-pressure system failure?",
    "options": [
      "Sudden release of stored energy (explosion)",
      "High-velocity projectiles (flying debris)",
      "Exposure to released fluids (steam, gas, chemicals)",
      "Generation of strong magnetic fields" // This is unrelated
    ],
    "correctAnswer": 3,
    "hint": "Failures involve mechanical energy release and potential fluid hazards, not electromagnetic fields."
  },
  {
    "question": "High-pressure water jets (washers) are commonly used for:",
    "options": [
      "Medical imaging",
      "Cleaning surfaces like concrete, vehicles, or building exteriors",
      "Generating electricity through turbines",
      "Filtering air in HVAC systems"
    ],
    "correctAnswer": 1,
    "hint": "Their primary use is leveraging the force of high-pressure water for cleaning."
  },
  {
    "question": "Which factor is a common contributor to failures in pressure systems?",
    "options": [
      "Regular maintenance and inspection", // This prevents failures
      "Using materials rated far above operating pressure", // This enhances safety
      "Poor welding or joint construction during manufacturing or repair",
      "Following strict operating procedures" // This prevents failures
    ],
    "correctAnswer": 2,
    "hint": "Defects in construction, inadequate maintenance, or operational errors are key causes."
  },
  {
    "question": "What is the main purpose of a high-pressure compressor?",
    "options": [
      "To expand a gas, lowering its pressure",
      "To pump liquids at low pressure",
      "To reduce the volume of a gas, thereby increasing its pressure",
      "To measure the flow rate of a gas"
    ],
    "correctAnswer": 2,
    "hint": "Compressors work by forcing gas into a smaller volume."
  },
  {
    "question": "Generating steam at high pressure puts severe stress on equipment primarily due to:",
    "options": [
      "The low density of steam",
      "The combined effects of high temperature and high pressure forces",
      "The electrical conductivity of water",
      "The weight of the water"
    ],
    "correctAnswer": 1,
    "hint": "Both high temperature and the contained pressure exert significant mechanical forces on the vessel walls."
  }
];


// --- Main Page Component ---
const SafetyAndHighPressure = () => { // Renamed component
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // --- Quiz Handlers ---
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (showResults) return;
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

  const resetQuiz = () => {
    setShowQuiz(false);
    setShowResults(false);
    setSelectedAnswers(new Array(quizQuestions.length).fill(null));
    setScore(0);
  }

  // --- Component Render ---
   return (
    <div className="bg-off-white text-dark-gray dark:bg-deep-navy dark:text-light-gray min-h-screen font-lora">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
            <h1 className="text-4xl lg:text-5xl font-bold font-playfair mb-8 lg:mb-12 text-center">
                3.5 Safety and High-Pressure Systems {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction to High Pressure */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Understanding High Pressure
                         </h2>
                         <p className="leading-relaxed">
                            While "high pressure" is relative, in many industrial and scientific contexts, it refers to pressures significantly above standard atmospheric pressure (1 atm), often exceeding 50 atmospheres (approx. 5 MPa or 735 psi).
                         </p>
                         <p className="mt-3 leading-relaxed">
                            Utilizing high pressure allows for various applications, driven by its effects on materials and processes.
                         </p>
                    </section>

                    {/* Applications */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Applications of High Pressure
                         </h2>
                         <p className="leading-relaxed">High pressure finds use in diverse fields:</p>
                         <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                            <li><strong className="text-teal dark:text-teal font-semibold">Cooking:</strong> Pressure cookers increase water's boiling point, cooking food faster.</li>
                            <li><strong className="text-teal dark:text-teal font-semibold">Fuel Storage:</strong> LPG (propane/butane) is stored under pressure as a liquid in cylinders.</li>
                            <li><strong className="text-teal dark:text-teal font-semibold">Industrial/Medical Gases:</strong> Gases like oxygen or nitrogen are compressed into cylinders for portability and use.</li>
                            <li><strong className="text-teal dark:text-teal font-semibold">Cleaning:</strong> High-pressure washers use water jets for effective cleaning.</li>
                            <li><strong className="text-teal dark:text-teal font-semibold">Material Science:</strong> Studying materials under extreme pressure reveals changes in properties and can lead to new material synthesis.</li>
                             <li><strong className="text-teal dark:text-teal font-semibold">Food Preservation (Pascalization):</strong> High pressure inactivates microorganisms, extending the shelf life of foods like juices and meats without heat.</li>
                         </ul>
                     </section>

                    {/* High Pressure Equipment */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             High-Pressure Equipment
                         </h2>
                         <p className="leading-relaxed">
                            Working with high pressure requires specialized equipment designed to withstand significant forces:
                         </p>
                         <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                            <li>
                                <strong className="font-semibold">Compressors/Pumps:</strong> Devices that increase gas or liquid pressure, often by reducing volume. Steam generation equipment also falls under this category due to high internal stresses.
                            </li>
                             <li>
                                 <strong className="font-semibold">Pressure Vessels:</strong> Robust containers (tanks, cylinders, reactors) built to safely hold fluids under pressure.
                             </li>
                             <li>
                                <strong className="font-semibold">Safety Accessories:</strong> Crucial components like <strong className="text-coral dark:text-gold">safety valves</strong> (release excess pressure) and <strong className="text-coral dark:text-gold">bursting discs</strong> (rupture at a set pressure) to prevent system failure. Limiting switches (pressure, temperature) may also trigger shutdowns.
                             </li>
                             <li>
                                 <strong className="font-semibold">Instrumentation:</strong> Gauges and sensors to accurately monitor pressure, temperature, flow rates, and fluid levels for safe operation.
                             </li>
                         </ul>
                    </section>

                    {/* Safety Considerations */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Safety with High-Pressure Systems
                         </h2>
                         <p className="leading-relaxed text-red-600 dark:text-coral font-semibold">
                            Failure of high-pressure equipment can be extremely dangerous due to the large amount of stored energy released suddenly.
                         </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Primary Hazards</h3>
                          <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                              <li><strong className="font-semibold">Explosion/Blast Wave:</strong> Rapid expansion of released gas or vapor.</li>
                              <li><strong className="font-semibold">Projectiles:</strong> Failed components (valves, vessel fragments) ejected at high velocity.</li>
                              <li><strong className="font-semibold">Fluid Release:</strong> Contact with high-pressure liquids/gases (steam burns, chemical exposure, asphyxiation).</li>
                              <li><strong className="font-semibold">Fire:</strong> If flammable materials are released and ignited.</li>
                          </ul>

                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Common Causes of Failure</h3>
                           <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                               <li><strong className="font-semibold">Design/Manufacturing Flaws:</strong> Poor material choice, incorrect calculations, welding defects.</li>
                               <li><strong className="font-semibold">Improper Installation/Modification:</strong> Not following specifications, unauthorized changes.</li>
                               <li><strong className="font-semibold">Inadequate Maintenance:</strong> Corrosion, fatigue, damaged safety devices not detected or repaired.</li>
                               <li><strong className="font-semibold">Operational Errors:</strong> Exceeding pressure limits, incorrect procedures, lack of training.</li>
                           </ul>
                    </section>

                    {/* Pressure Washer Safety */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             High-Pressure Washer Safety
                         </h2>
                          <p className="leading-relaxed">
                            While common, pressure washers demand respect. The high-velocity water jet can cause serious injury or damage property if misused.
                          </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Key Precautions:</h3>
                           <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                               <li>Wear appropriate Personal Protective Equipment (PPE): eye protection (goggles/face shield), sturdy footwear, gloves. Consider hearing protection for gas models.</li>
                               <li><strong className="text-coral dark:text-gold">Never</strong> point the nozzle at people or animals.</li>
                               <li>Be aware of surroundings; ensure stable footing.</li>
                               <li>Check equipment (hoses, connections) for damage before use.</li>
                               <li>Use the correct nozzle for the task (different nozzles produce different spray patterns and intensities).</li>
                               <li>Turn off the machine and release residual pressure before disconnecting hoses or changing nozzles.</li>
                               <li>Keep electrical components away from water.</li>
                           </ul>
                     </section>

                </article>

                {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                    {/* Panel 1: Applications Video */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="9zZzA82m7Pg" title="Video: How Pressure Cookers Work"/>
                        {/* Alt video: Hydraulic systems, industrial applications? */}
                    </div>

                     {/* Panel 2: Key Application Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Application Check</h3>
                          <MiniCheckQuestion
                             question="Why does pascalization (using high pressure on food) extend shelf life?"
                             correctAnswer="It inactivates or kills harmful microorganisms like bacteria and yeast."
                             explanation="High pressure disrupts the cellular structure and metabolic processes of microbes without using heat."
                          />
                    </div>

                    {/* Panel 3: Equipment & Safety Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        {/* Example: Could be a safety valve demo or general industrial safety video */}
                        <YouTubeEmbed videoId="v0GpLdF4T8A" title="Video: Importance of Pressure Relief Valves"/>
                    </div>

                    {/* Panel 4: Hazard Mini Question */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-red-700 dark:text-coral">Safety Check</h3>
                         <MiniCheckQuestion
                            question="If a high-pressure gas cylinder valve breaks off, why is it extremely dangerous?"
                            correctAnswer="The cylinder can become a high-speed projectile due to the rapid release of pressurized gas (like a rocket)."
                            explanation="The escaping gas provides immense thrust, making the heavy cylinder a dangerous missile."
                         />
                    </div>

                     {/* Panel 5: Pressure Washer Safety Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="TzK4fDxG2kI" title="Video: Pressure Washer Safety Tips"/>
                    </div>

                      {/* Panel 6: Safety Guidelines Link (Example) */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center">
                          <h3 className="text-xl font-semibold font-inter mb-3">Further Safety Info</h3>
                          <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">For detailed industrial safety guidelines, refer to official resources:</p>
                          {/* Replace with actual relevant links */}
                          <a href="https://www.osha.gov/pressure-vessels" target="_blank" rel="noopener noreferrer" className="text-coral dark:text-gold hover:underline font-inter font-semibold">
                              OSHA Pressure Vessels Info
                          </a>
                           <br/>
                           <a href="https://www.hse.gov.uk/pressure-systems/index.htm" target="_blank" rel="noopener noreferrer" className="text-coral dark:text-gold hover:underline font-inter font-semibold mt-2 inline-block">
                              HSE (UK) Pressure Systems
                          </a>
                     </div>
                </aside>
            </div>

            {/* Quiz Button */}
            <div className='flex justify-center items-center mt-12 lg:mt-16'>
                <button
                    onClick={() => setShowQuiz(true)}
                    className="w-full sm:w-1/2 lg:w-1/3 bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-3 px-6 rounded-lg transition-colors text-lg shadow-md"
                >
                    Check Your Safety Knowledge!
                </button>
            </div>
        </main>

        {/* Quiz Modal */}
        {showQuiz && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">High Pressure & Safety Quiz</h2>
                 <div className="space-y-6 font-inter">
                  {quizQuestions.map((q, index) => (
                    <QuizQuestion
                      key={index}
                      // questionNumber={index + 1} // Uncomment if needed
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
                         <button onClick={handleSubmit} className="w-full sm:w-auto bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-bold font-inter py-2 px-6 rounded transition-colors disabled:opacity-50" disabled={selectedAnswers.includes(null)}>
                             Submit Answers
                         </button>
                     ) : <div/>}
                     <button onClick={resetQuiz} className="w-full sm:w-auto bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-2 px-6 rounded transition-colors">
                         Close Quiz
                     </button>
                 </div>
                {showResults && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                     <h3 className="text-xl font-bold font-playfair mb-2 text-dark-gray dark:text-light-gray">Quiz Results</h3>
                     <p className="text-lg font-inter text-dark-gray dark:text-light-gray">
                        You got <strong className="text-teal dark:text-mint">{score}</strong> out of <strong className="text-teal dark:text-mint">{quizQuestions.length}</strong> correct!
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
  );
}

// Assign display name
SafetyAndHighPressure.displayName = 'SafetyAndHighPressure';

export default SafetyAndHighPressure;
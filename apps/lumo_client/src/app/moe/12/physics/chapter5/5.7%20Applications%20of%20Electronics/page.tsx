'use client';

import { InlineMath, BlockMath } from 'react-katex'; // Keep imports
import { useState, ChangeEvent } from 'react'; // Removed useMemo
import QuizQuestion from '@/components/QuizQuestion'; // Assuming this component exists
import Image from 'next/image'; // Import Image component if using Next.js images
import 'katex/dist/katex.min.css';

// --- Type Definitions ---
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
    "question": "Electronics used in aircraft for power management and measuring flight parameters belong to which industry?",
    "options": [
      "Automotive",
      "Medical",
      "Aerospace", // Correct
      "Telecommunication"
    ],
    "correctAnswer": 2,
    "hint": "This industry involves flight, space travel, and related technologies."
  },
  {
    "question": "What is the purpose of e-Agri Sensors in modern farming?",
    "options": [
      "To automatically harvest crops",
      "To monitor soil conditions, moisture, and crop health", // Correct
      "To scare away pests using sound waves",
      "To predict the weather"
    ],
    "correctAnswer": 1,
    "hint": "These electronic sensors help optimize growing conditions for better yields."
  },
  {
    "question": "MRI machines, electronic aspirin, and robotic check-ups are examples of electronics applications in which field?",
    "options": [
      "Communication",
      "Military",
      "Medical / Healthcare", // Correct
      "Residential"
    ],
    "correctAnswer": 2,
    "hint": "These technologies are used for diagnosis, treatment, and patient care."
  },
  {
    "question": "Engine Control Units (ECUs), infotainment systems, and driver assistance technologies are electronic systems primarily found in which industry?",
    "options": [
      "Aerospace",
      "Agriculture",
      "Automotive", // Correct
      "Medical"
    ],
    "correctAnswer": 2,
    "hint": "Modern vehicles rely heavily on complex electronic systems."
  },
  {
    "question": "The use of drones (UAVs), infrared detectors, and night vision for reconnaissance and targeting falls under which application area?",
    "options": [
      "Residential",
      "Communication",
      "Agriculture",
      "Military" // Correct
    ],
    "correctAnswer": 3,
    "hint": "These electronic tools enhance surveillance, targeting, and situational awareness in defense."
  },
  {
    "question": "Which electronic component is fundamental to amplification and switching in almost all applications mentioned?",
    "options": [
      "Capacitor",
      "Resistor",
      "Diode",
      "Transistor" // Correct
    ],
    "correctAnswer": 3,
    "hint": "Transistors are the key active components enabling signal processing and control."
  },
  {
    "question": "What process, enabled by diodes, converts AC power from the grid to the DC power needed by most electronic devices?",
    "options": [
      "Amplification",
      "Rectification", // Correct
      "Modulation",
      "Filtration"
    ],
    "correctAnswer": 1,
    "hint": "Rectifiers use diodes to change AC into DC."
  },
  {
    "question": "Mobile phones, computers, refrigerators, and air conditioners are examples of electronics applications in which sector?",
    "options": [
      "Military",
      "Aerospace",
      "Medical",
      "Residential / Consumer" // Correct
    ],
    "correctAnswer": 3,
    "hint": "These are common devices found in homes and used in daily life."
  }
];

// --- Main Page Component ---
const ElectronicsApplicationsPage = () => { // Renamed component
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
                5.7 Applications of Electronics {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction */}
                    <section>
                         <p className="leading-relaxed text-lg">
                            The principles of semiconductors, diodes, transistors, and integrated circuits underpin countless technologies that shape our modern world. Electronics have moved far beyond basic circuits to become integral parts of nearly every industry and aspect of daily life.
                         </p>
                    </section>

                    {/* Application Sections */}
                    <section>
                        <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Key Application Areas
                        </h2>

                        <div className="space-y-6">
                            {/* Aerospace */}
                            <div>
                                <h3 className="text-xl font-semibold font-playfair mb-2 text-teal dark:text-mint">1. Aerospace Industry</h3>
                                <p className="leading-relaxed">
                                    From complex navigation and communication systems in satellites and space shuttles to flight control and power management in commercial aircraft, electronics are indispensable. Instruments constantly monitor critical parameters like temperature, pressure, altitude, and engine performance.
                                </p>
                            </div>

                            {/* Medical */}
                            <div>
                                <h3 className="text-xl font-semibold font-playfair mb-2 text-teal dark:text-mint">2. Medical Field</h3>
                                <p className="leading-relaxed">
                                    Electronics have revolutionized healthcare. Diagnostic tools like X-ray machines, CT scanners, MRI machines, and ultrasound devices rely on sophisticated electronic sensors and processing. Therapeutic devices, patient monitoring systems, pacemakers, hearing aids, and emerging technologies like robotic surgery and electronic drug delivery systems showcase the profound impact.
                                </p>
                            </div>

                            {/* Automotive */}
                             <div>
                                <h3 className="text-xl font-semibold font-playfair mb-2 text-teal dark:text-mint">3. Automotive Industry</h3>
                                <p className="leading-relaxed">
                                    Modern vehicles are essentially computers on wheels. Engine Control Units (ECUs) optimize performance and emissions. Electronics manage transmissions, braking systems (ABS), airbags, stability control, navigation, infotainment, driver assistance systems (ADAS), and the complex systems in electric and hybrid vehicles.
                                </p>
                            </div>

                             {/* Agriculture */}
                             <div>
                                <h3 className="text-xl font-semibold font-playfair mb-2 text-teal dark:text-mint">4. Agriculture</h3>
                                <p className="leading-relaxed">
                                    "Smart farming" utilizes electronics for greater efficiency and yield. Sensors (like e-Agri Sensors) monitor soil moisture, nutrient levels, salinity, and environmental conditions. GPS guides autonomous tractors, drones survey crop health, and automated systems control irrigation and fertilization precisely.
                                </p>
                             </div>

                              {/* Communication */}
                              <div>
                                <h3 className="text-xl font-semibold font-playfair mb-2 text-teal dark:text-mint">5. Communication</h3>
                                <p className="leading-relaxed">
                                    The entire global communication network – encompassing mobile phones, the internet, radio, television, satellite communication, and data networks – is built upon electronic components and systems for signal generation, processing, transmission, and reception.
                                </p>
                              </div>

                              {/* Residential */}
                              <div>
                                <h3 className="text-xl font-semibold font-playfair mb-2 text-teal dark:text-mint">6. Residential / Consumer Electronics</h3>
                                <p className="leading-relaxed">
                                    Our homes are filled with electronics: computers, smartphones, tablets, televisions, smart home devices, kitchen appliances (microwaves, refrigerators), air conditioning, lighting controls, and entertainment systems all rely on semiconductor technology.
                                </p>
                              </div>

                              {/* Military */}
                              <div>
                                <h3 className="text-xl font-semibold font-playfair mb-2 text-teal dark:text-mint">7. Military & Defense</h3>
                                <p className="leading-relaxed">
                                    Advanced electronics are critical for modern defense. Applications include sophisticated radar and sonar systems, secure communications, electronic warfare, guidance systems for missiles, unmanned aerial vehicles (UAVs/drones) for surveillance and combat, night vision, and thermal imaging.
                                </p>
                              </div>
                        </div>
                    </section>

                    {/* Important Components Recap */}
                    <section>
                        <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Recap: Key Electronic Components
                        </h2>
                         <ul className="list-disc list-outside ml-6 space-y-1 font-inter text-sm"> {/* UI Font, smaller */}
                            <li><strong className="font-semibold">Diodes (P-N Junctions):</strong> Allow current flow in one direction (rectification, signal steering, protection). LEDs emit light; Photodiodes detect light.</li>
                            <li><strong className="font-semibold">Transistors (BJTs, FETs):</strong> Act as amplifiers or electronic switches, forming the basis of logic gates and processors.</li>
                            <li><strong className="font-semibold">Integrated Circuits (ICs):</strong> Miniaturized circuits containing millions/billions of transistors, diodes, resistors, and capacitors on a single chip.</li>
                             <li><strong className="font-semibold">Capacitors:</strong> Store electrical charge, used for filtering, timing, and energy storage.</li>
                            <li><strong className="font-semibold">Resistors:</strong> Limit current flow and set voltage levels.</li>
                            {/* Add Inductors if covered */}
                        </ul>
                    </section>

                     {/* Conclusion */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Conclusion
                         </h2>
                         <p className="leading-relaxed">
                             The development and application of electronics, particularly semiconductor devices, have driven unprecedented technological advancement across nearly every human endeavor. From fundamental components like diodes and transistors to complex integrated circuits, electronics continue to enable innovation and shape the future.
                         </p>
                     </section>

                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                     {/* Panel 1: General Applications Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="ysDuSaycHcg" title="Video: Impact of Electronics on Modern Life"/> {/* Example video */}
                     </div>

                     {/* Panel 2: Application Area Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Application Check</h3>
                          <MiniCheckQuestion
                             question="An Engine Control Unit (ECU) that monitors sensors and adjusts fuel injection and ignition timing is a key electronic component in which industry?"
                             correctAnswer="Automotive Industry."
                             explanation="ECUs are central to modern car engine management for performance, efficiency, and emissions control."
                         />
                     </div>

                    {/* Panel 3: Medical Electronics Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="WGFrHFMVcYw" title="Video: Electronics in Medical Devices"/> {/* Example video */}
                     </div>

                     {/* Panel 4: Communication Tech Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="j3Isf_Qkt1w" title="Video: Electronics in Communication Systems"/> {/* Example video */}
                     </div>

                     {/* Panel 5: Cross-Cutting Tech Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Core Component Check</h3>
                         <MiniCheckQuestion
                             question="Which fundamental semiconductor device, capable of switching and amplification, is essential for building the integrated circuits used in computers, phones, and cars?"
                             correctAnswer="The Transistor."
                             explanation="Transistors are the active building blocks that enable the complex functions within ICs across all these applications."
                         />
                     </div>

                     {/* Panel 6: Future of Electronics (Optional Link/Video) */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center">
                          <h3 className="text-xl font-semibold font-inter mb-3">The Future</h3>
                          <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Electronics continue to evolve rapidly. Explore emerging trends:</p>
                          <a href="https://www.example.com/future-electronics" target="_blank" rel="noopener noreferrer" className="text-coral dark:text-gold hover:underline font-inter font-semibold">
                              Example Article: Future Trends in Electronics
                          </a>
                          {/* Add a relevant future-focused video if desired */}
                     </div>

                </aside>
            </div>

            {/* Quiz Button */}
            <div className='flex justify-center items-center mt-12 lg:mt-16'>
                <button
                    onClick={() => setShowQuiz(true)}
                    className="w-full sm:w-1/2 lg:w-1/3 bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-3 px-6 rounded-lg transition-colors text-lg shadow-md"
                >
                    Check Your Application Knowledge!
                </button>
            </div>
        </main>

        {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Electronics Applications Quiz</h2>
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
ElectronicsApplicationsPage.displayName = 'ElectronicsApplicationsPage';

export default ElectronicsApplicationsPage;
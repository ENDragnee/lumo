'use client';

import { InlineMath, BlockMath } from 'react-katex'; // Keep imports
import { useState, ChangeEvent } from 'react'; // Removed useMemo
import QuizQuestion from '@/components/QuizQuestion'; // Assuming this component exists
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
    // ... (quiz questions remain unchanged)
     {
    "question": "What is the primary purpose of rectification in electronics?",
    "options": [
      "To increase AC voltage",
      "To convert AC voltage to DC voltage", // Correct
      "To store electrical charge",
      "To amplify AC signals"
    ],
    "correctAnswer": 1,
    "hint": "Rectification changes alternating current (which changes direction) into direct current (which flows in one direction)."
  },
  {
    "question": "Which rectifier type uses only one diode and allows only half of the AC cycle to pass through?",
    "options": [
      "Full-wave bridge rectifier",
      "Center-tapped full-wave rectifier",
      "Half-wave rectifier", // Correct
      "Voltage doubler"
    ],
    "correctAnswer": 2,
    "hint": "This is the simplest form of rectifier but is inefficient as it discards half the input power."
  },
   {
    "question": "How many diodes are typically used in a full-wave bridge rectifier?",
    "options": [
      "One",
      "Two",
      "Four", // Correct
      "Six"
    ],
    "correctAnswer": 2,
    "hint": "The bridge configuration uses four diodes to rectify both halves of the AC cycle."
  },
  {
    "question": "What is the main advantage of a full-wave rectifier over a half-wave rectifier?",
    "options": [
      "It uses fewer components.",
      "It produces a smoother DC output with less ripple.", // Correct (converts both halves)
      "It blocks both halves of the AC cycle.",
      "It operates at a higher frequency."
    ],
    "correctAnswer": 1,
    "hint": "By utilizing both halves of the AC cycle, the output is closer to a steady DC voltage."
  },
   {
    "question": "What component is commonly added after a rectifier circuit to smooth out the pulsating DC output?",
    "options": [
      "A resistor",
      "An inductor",
      "A capacitor (filter capacitor)", // Correct
      "Another diode"
    ],
    "correctAnswer": 2,
    "hint": "The capacitor charges during peaks and discharges during valleys, reducing voltage fluctuations (ripple)."
  },
  {
    "question": "A Light Emitting Diode (LED) converts electrical energy primarily into what form of energy?",
    "options": [
      "Heat energy",
      "Light energy (photons)", // Correct
      "Sound energy",
      "Mechanical energy"
    ],
    "correctAnswer": 1,
    "hint": "LEDs are designed for efficient light production when forward biased."
  },
  {
    "question": "A photodiode is designed to convert ______ into ______.",
    "options": [
      "Heat into current",
      "Current into light",
      "Light (photons) into electrical current", // Correct
      "Voltage into resistance"
    ],
    "correctAnswer": 2,
    "hint": "Photodiodes are used as light sensors, generating current proportional to light intensity."
  },
  {
    "question": "How can diodes be used for over-voltage protection in a circuit?",
    "options": [
      "By amplifying the voltage.",
      "By acting as a fuse that blows.",
      "By conducting heavily (clamping) when voltage exceeds a certain level, diverting excess current.", // Correct (e.g., TVS diodes)
      "By storing the excess voltage."
    ],
    "correctAnswer": 2,
    "hint": "Specialized diodes (like Zener or TVS) can be used to limit or 'clamp' voltage spikes."
  }
];


// --- KaTeX Constants (Optional, good practice if used) ---
const katex_AC = 'AC';
const katex_DC = 'DC';
const katex_D1 = 'D_1';
const katex_D2 = 'D_2';
const katex_D3 = 'D_3';
const katex_D4 = 'D_4';


// --- Main Page Component ---
const RectificationPage = () => { // Renamed component
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
                5.3 Rectification & Diode Applications {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* What is Rectification? */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             What is Rectification?
                         </h2>
                         <p className="leading-relaxed">
                            Most electronic devices require a steady Direct Current (<InlineMath math={katex_DC}/>) supply to function, but our mains power is typically Alternating Current (<InlineMath math={katex_AC}/>). The process of converting AC voltage into a unidirectional (pulsating) DC voltage is called <strong className="text-teal dark:text-teal font-semibold">rectification</strong>.
                         </p>
                         <p className="mt-3 leading-relaxed">
                             The key component enabling rectification is the <strong className="text-teal dark:text-teal font-semibold">P-N junction diode</strong>, which allows current to flow significantly in only one direction (when forward biased) and blocks it in the reverse direction.
                         </p>
                    </section>

                    {/* Half-Wave Rectifier */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Half-Wave Rectification
                         </h2>
                          <p className="leading-relaxed">
                            The simplest rectifier uses a single diode in series with the load (the device receiving power).
                             <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                 <li>During the <strong className="text-coral dark:text-gold">positive half-cycle</strong> of the AC input, the diode is forward biased and conducts current through the load.</li>
                                 <li>During the <strong className="text-coral dark:text-gold">negative half-cycle</strong>, the diode is reverse biased and blocks current flow.</li>
                             </ul>
                          </p>
                           <p className="mt-3 leading-relaxed">
                              The result is a pulsating DC output across the load where only the positive half-cycles of the original AC waveform appear. This is called <strong className="text-teal dark:text-teal font-semibold">half-wave rectification</strong>.
                           </p>
                            <p className="text-sm italic leading-relaxed text-gray-600 dark:text-gray-400 mt-2">
                               Disadvantage: Only utilizes half of the input AC power, resulting in inefficient power transfer and a highly fluctuating DC output.
                            </p>
                     </section>

                     {/* Full-Wave Rectifier */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Full-Wave Rectification (Bridge Rectifier)
                         </h2>
                          <p className="leading-relaxed">
                            To utilize both halves of the AC cycle and achieve a smoother DC output, <strong className="text-teal dark:text-teal font-semibold">full-wave rectification</strong> is used. A common configuration is the <strong className="text-coral dark:text-gold font-semibold">bridge rectifier</strong>, which uses four diodes arranged in a specific bridge pattern.
                          </p>
                           <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                               <li>During the <strong className="text-coral dark:text-gold">positive half-cycle</strong>, two diodes (e.g., <InlineMath math={katex_D1}/>, <InlineMath math={katex_D2}/>) are forward biased, allowing current to flow through the load in one direction. The other two diodes are reverse biased.</li>
                               <li>During the <strong className="text-coral dark:text-gold">negative half-cycle</strong>, the other pair of diodes (e.g., <InlineMath math={katex_D3}/>, <InlineMath math={katex_D4}/>) become forward biased, while the first pair blocks. Crucially, the current is routed through the load in the <strong className="text-teal dark:text-teal">same direction</strong> as during the positive half-cycle.</li>
                           </ul>
                            <p className="mt-3 leading-relaxed">
                               The output is a pulsating DC voltage where the negative half-cycles have been "flipped" to become positive. This is much more efficient and easier to smooth than the half-wave output.
                            </p>
                     </section>

                     {/* Smoothing with Capacitors */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Smoothing the Output (Filtering)
                         </h2>
                         <p className="leading-relaxed">
                             The output from both half-wave and full-wave rectifiers is pulsating DC, not the steady DC required by most electronics. To smooth out these fluctuations (known as <strong className="text-coral dark:text-gold">ripple</strong>), a <strong className="text-teal dark:text-teal font-semibold">filter capacitor</strong> is typically connected in parallel with the load resistor.
                         </p>
                         <p className="mt-3 leading-relaxed">
                            The capacitor charges up to the peak voltage during the rising part of the rectified pulse. As the pulse voltage falls, the capacitor starts to discharge slowly through the load, maintaining the voltage at a higher level than it would otherwise be. This significantly reduces the ripple and produces a much smoother DC voltage. Larger capacitance values provide better smoothing.
                         </p>
                     </section>

                    {/* Practical Uses */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Practical Uses of Diodes
                         </h2>
                           <p className="leading-relaxed">
                               Beyond rectification, diodes have many other important applications:
                           </p>
                           <ul className="list-disc list-outside ml-6 space-y-2 mt-2">
                                <li>
                                    <strong className="font-semibold">Light Emitting Diodes (LEDs):</strong> Specialized diodes designed to emit light (photons) when forward biased. The color depends on the semiconductor material used. LEDs are highly efficient light sources used in lighting, displays, and indicators.
                                </li>
                               <li>
                                   <strong className="font-semibold">Photodiodes:</strong> These diodes convert light energy into electrical current. When photons strike the depletion region, they generate electron-hole pairs, creating a current proportional to the light intensity. Used in light sensors, solar cells (photovoltaics), and optical communication.
                               </li>
                               <li>
                                   <strong className="font-semibold">Logic Gates:</strong> Diodes, combined with resistors, can form basic digital logic gates like AND and OR gates (Diode-Resistor Logic - DRL), although transistor-based logic (like TTL or CMOS) is far more common today.
                               </li>
                                <li>
                                   <strong className="font-semibold">Over-Voltage Protection:</strong> Certain types of diodes (like Zener diodes or Transient Voltage Suppression (TVS) diodes) are designed to conduct heavily when a specific reverse voltage (their breakdown voltage) is exceeded. Placed across sensitive circuits, they can "clamp" voltage spikes and divert excess current, protecting the circuit from damage.
                               </li>
                           </ul>
                     </section>

                </article>

                {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                      {/* Panel 1: Rectification Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="ln9zg0KOYhM" title="Video: Half-Wave and Full-Wave Rectification"/>
                     </div>

                     {/* Panel 2: Rectifier Type Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Rectifier Check</h3>
                          <MiniCheckQuestion
                             question="Which type of rectifier (half-wave or full-wave bridge) provides a DC output with less voltage fluctuation (ripple) before filtering?"
                             correctAnswer="Full-wave bridge rectifier."
                             explanation="The full-wave rectifier utilizes both halves of the AC cycle, resulting in output pulses that are closer together and have a higher average DC level, making it easier to smooth with a capacitor."
                         />
                     </div>

                     {/* Panel 3: LED Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="4y7p9R2No-4" title="Video: How Light Emitting Diodes (LEDs) Work"/>
                     </div>

                     {/* Panel 4: Photodiode Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="YqMQDyU5tNU" title="Video: How Photodiodes Work"/>
                      </div>

                     {/* Panel 5: LED vs Photodiode Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Optoelectronic Diodes</h3>
                         <MiniCheckQuestion
                            question="What is the key functional difference between an LED and a Photodiode?"
                            correctAnswer="LEDs convert electrical energy into light, while Photodiodes convert light energy into electrical current."
                            explanation="They perform opposite energy conversions based on interactions at the P-N junction."
                        />
                     </div>

                     {/* Panel 6: Falstad Simulation Link (Rectifiers) */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Rectifier Circuits</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Experiment with half-wave, full-wave, and filtered rectifier circuits in this simulator.</p>
                         <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                            <a href="https://falstad.com/circuit/circuitjs.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open Falstad Circuit Simulator (New Tab) <br/> <i className="text-xs">(Load rectifier examples from 'Circuits' menu)</i></span>
                            </a>
                        </div>
                    </div>

                </aside>
            </div>

             {/* Quiz Button */}
            <div className='flex justify-center items-center mt-12 lg:mt-16'>
                <button
                    onClick={() => setShowQuiz(true)}
                    className="w-full sm:w-1/2 lg:w-1/3 bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-3 px-6 rounded-lg transition-colors text-lg shadow-md"
                >
                    Test Your Rectification Knowledge!
                </button>
            </div>
        </main>

        {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Rectification & Diodes Quiz</h2>
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
RectificationPage.displayName = 'RectificationPage';

export default RectificationPage;
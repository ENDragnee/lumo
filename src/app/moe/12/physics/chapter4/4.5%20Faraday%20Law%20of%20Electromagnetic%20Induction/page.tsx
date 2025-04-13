'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, useMemo, ChangeEvent } from 'react'; // Added useMemo, ChangeEvent
import QuizQuestion from '@/components/QuizQuestion'; // Assuming this component exists
import 'katex/dist/katex.min.css';

// --- Type Definitions ---
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

// Slider Component
function InteractiveSlider({
    label, unit, min, max, step, value, onChange, formulaSymbol, logScale = false
}: InteractiveSliderProps) {
    // Simplified value and range logic, assuming non-log scale for this example
    const sliderValue = value;
    const minSlider = min;
    const maxSlider = max;
    const stepSlider = step;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        let actualValue = parseFloat(event.target.value);
        actualValue = Math.max(min, Math.min(max, actualValue)); // Clamp
        onChange(actualValue);
    };

    // Basic number formatting
    const displayValue = Math.abs(value) < 0.01 && value !== 0 ? value.toExponential(2) : value.toFixed(step < 0.01 ? 3 : (step < 1 ? 1 : 0));
    const minDisplay = Math.abs(min) < 0.01 && min !== 0 ? min.toExponential(1) : min;
    const maxDisplay = Math.abs(max) < 0.01 && max !== 0 ? max.toExponential(1) : max;

  return (
    <div className="mb-4">
      <label htmlFor={label} className="block text-sm font-medium mb-1 font-inter text-dark-gray dark:text-light-gray">
        {label} (<InlineMath math={formulaSymbol} /> = {displayValue} {unit})
      </label>
      <input
        type="range"
        id={label}
        min={minSlider}
        max={maxSlider}
        step={stepSlider}
        value={sliderValue}
        onChange={handleChange}
        className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal dark:accent-teal disabled:opacity-50 disabled:cursor-not-allowed"
      />
       <div className="flex justify-between text-xs font-inter text-gray-500 dark:text-gray-400">
          <span>{minDisplay} {unit}</span>
          <span>{maxDisplay} {unit}</span>
        </div>
    </div>
  );
}

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
    // ... (quiz questions array remains unchanged)
     {
    "question": "What must happen to the magnetic flux through a coil to induce an emf, according to Faraday's Law?",
    "options": [
      "It must be constant",
      "It must be zero",
      "It must change over time", // Correct
      "It must be aligned with the coil"
    ],
    "correctAnswer": 2,
    "hint": "Faraday's Law relates the induced emf to the *rate of change* of magnetic flux (ΔΦ_B / Δt)."
  },
  {
    "question": "In Faraday's Law, ε = -N(ΔΦ_B / Δt), what does 'N' represent?",
    "options": [
      "The magnetic field strength",
      "The area of the coil",
      "The number of turns (loops) in the coil", // Correct
      "The resistance of the coil"
    ],
    "correctAnswer": 2,
    "hint": "The total induced emf is proportional to the number of loops the changing flux passes through."
  },
  {
    "question": "Lenz's Law determines the ______ of the induced current.",
    "options": [
      "Magnitude",
      "Frequency",
      "Direction", // Correct
      "Speed"
    ],
    "correctAnswer": 2,
    "hint": "Lenz's Law specifies that the induced current creates a field opposing the change in flux."
  },
  {
    "question": "Lenz's Law is a consequence of which fundamental principle?",
    "options": [
      "Conservation of Charge",
      "Conservation of Momentum",
      "Conservation of Energy", // Correct
      "The Ideal Gas Law"
    ],
    "correctAnswer": 2,
    "hint": "If the induced current aided the change, it would lead to a perpetual motion machine, violating energy conservation."
  },
  {
    "question": "If you move the North pole of a magnet towards a loop of wire, the induced current will create a magnetic field with...",
    "options": [
      "a North pole facing the approaching magnet (repulsion).", // Correct
      "a South pole facing the approaching magnet (attraction).",
      "no magnetic field.",
      "a field parallel to the loop."
    ],
    "correctAnswer": 0,
    "hint": "Lenz's Law: The induced field opposes the *increase* in flux from the approaching North pole."
  },
  {
    "question": "What does the negative sign in Faraday's Law equation signify?",
    "options": [
      "That the induced emf is always negative.",
      "That energy is lost in the process.",
      "That the induced emf opposes the change in magnetic flux (Lenz's Law).", // Correct
      "That the magnetic flux is decreasing."
    ],
    "correctAnswer": 2,
    "hint": "The negative sign mathematically incorporates the direction specified by Lenz's Law."
  },
   {
    "question": "Which scenario would induce the largest emf in a coil?",
    "options": [
      "Slowly changing the magnetic flux by a small amount.",
      "Rapidly changing the magnetic flux by a large amount.", // Correct
      "Keeping the magnetic flux constant.",
      "Slowly changing the magnetic flux by a large amount."
    ],
    "correctAnswer": 1,
    "hint": "The induced emf depends on the *rate* of change (ΔΦ_B / Δt). A faster change and/or larger change yields a larger emf."
  },
   {
    "question": "Magnetic flux (Φ_B) depends on the magnetic field (B), the area (A), and the:",
    "options": [
      "Temperature (T)",
      "Current (I)",
      "Angle (θ) between B and the area normal", // Correct
      "Voltage (V)"
    ],
    "correctAnswer": 2,
    "hint": "The formula is Φ_B = BAcos(θ)."
  }
];


// --- KaTeX String Constants ---
const katex_epsilon = '\\epsilon'; // EMF symbol
const katex_DeltaPhiB = '\\Delta \\Phi_B'; // Change in Magnetic Flux
const katex_Delta_t = '\\Delta t'; // Change in time
const katex_N = 'N'; // Number of turns
const katex_Faraday_Single = '\\epsilon = - \\frac{\\Delta \\Phi_B}{\\Delta t}';
const katex_Faraday_Multi = '\\epsilon = - N \\frac{\\Delta \\Phi_B}{\\Delta t}';
const katex_Phi_B = '\\Phi_B'; // Magnetic Flux symbol

// --- Main Page Component ---
const FaradayLenzLawPage = () => { // Renamed component
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Faraday's Law Calculator State
  const [numTurns, setNumTurns] = useState(10); // N
  const [fluxChange, setFluxChange] = useState(0.05); // Delta Phi_B (Wb)
  const [timeChange, setTimeChange] = useState(0.1); // Delta t (s)

  // --- Memoized Calculations ---
  const inducedEMF = useMemo(() => {
    if (timeChange <= 0) return Infinity; // Avoid division by zero
    // Calculate magnitude, sign indicates direction (Lenz's Law)
    return (numTurns * fluxChange) / timeChange;
  }, [numTurns, fluxChange, timeChange]);

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
                4.5 Faraday's & Lenz's Laws {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction Recap */}
                    <section>
                         <p className="leading-relaxed">
                            Building on the discovery that moving charges create magnetic fields, Michael Faraday and Joseph Henry investigated the reverse: can magnetism create electricity? Their experiments revealed the crucial principle of <strong className="text-teal dark:text-teal font-semibold">electromagnetic induction</strong>.
                         </p>
                    </section>

                    {/* Faraday's Law */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Faraday's Law of Induction
                         </h2>
                         <p className="leading-relaxed">
                             Faraday's key conclusion was that an electromotive force (emf, <InlineMath math={katex_epsilon}/>), which acts like a voltage, is induced in a closed loop or coil of wire whenever the <strong className="text-coral dark:text-gold font-semibold">magnetic flux</strong> (<InlineMath math={katex_Phi_B}/>) passing through the loop <strong className="text-coral dark:text-gold font-semibold">changes with time</strong>.
                         </p>
                         <p className="mt-3 leading-relaxed">
                            The magnitude of this induced emf is directly proportional to the <strong className="text-teal dark:text-teal font-semibold">rate of change</strong> of the magnetic flux. Mathematically, for a single loop:
                         </p>
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                              {/* Magnitude focused equation initially */}
                              <BlockMath math={'|\\epsilon| = \\left| \\frac{\\Delta \\Phi_B}{\\Delta t} \\right|'}/>
                          </div>
                           <p className="leading-relaxed">
                              Where <InlineMath math={katex_DeltaPhiB}/> is the change in magnetic flux occurring over a time interval <InlineMath math={katex_Delta_t}/>.
                           </p>
                           <p className="mt-3 leading-relaxed">
                              If the coil consists of <InlineMath math={katex_N}/> identical turns, the total induced emf is multiplied by the number of turns, as the changing flux links through each turn:
                           </p>
                            <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                              {/* Magnitude focused equation */}
                              <BlockMath math={'|\\epsilon| = N \\left| \\frac{\\Delta \\Phi_B}{\\Delta t} \\right|'}/>
                            </div>
                            <p className="text-sm italic leading-relaxed text-gray-600 dark:text-gray-400">
                                The absolute value signs indicate we are currently focusing on the magnitude of the induced emf. The direction is determined by Lenz's Law.
                            </p>
                     </section>

                      {/* Lenz's Law */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Lenz's Law: Direction Matters
                         </h2>
                          <p className="leading-relaxed">
                            While Faraday's Law gives the magnitude of the induced emf (and thus the potential induced current), <strong className="text-teal dark:text-teal font-semibold">Lenz's Law</strong> determines its <strong className="text-coral dark:text-gold font-semibold">direction</strong>.
                          </p>
                          <blockquote className="mt-3 pl-4 italic border-l-4 border-teal dark:border-mint text-dark-gray dark:text-light-gray">
                              "The direction of the induced current in a loop is such that the magnetic field produced by the induced current opposes the change in magnetic flux that produced it."
                          </blockquote>
                           <p className="mt-3 leading-relaxed">
                              In simpler terms: nature opposes changes in magnetic flux. If the flux through a loop is increasing, the induced current will create its own magnetic field pointing in the opposite direction to fight the increase. If the flux is decreasing, the induced current will create a field in the same direction to try and maintain the original flux.
                           </p>
                           <p className="mt-3 leading-relaxed">
                               Lenz's Law is a consequence of the <strong className="text-coral dark:text-gold font-semibold">conservation of energy</strong>. If the induced current aided the change, it would create a runaway effect, generating energy from nothing.
                           </p>
                           <p className="mt-3 leading-relaxed">
                               The negative sign in the full form of Faraday's Law mathematically incorporates Lenz's Law:
                           </p>
                            <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                               <BlockMath math={katex_Faraday_Multi}/>
                            </div>
                            <p className="text-sm italic leading-relaxed text-gray-600 dark:text-gray-400">
                                The minus sign indicates that the induced emf (<InlineMath math={katex_epsilon}/>) acts to oppose the change in flux (<InlineMath math={katex_DeltaPhiB}/>).
                            </p>
                     </section>

                </article>

                 {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                    {/* Panel 1: Faraday/Induction Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="hajIIGHPeuU" title="Video: Faraday's Law & Induction Explained"/>
                     </div>

                     {/* Panel 2: EMF Calculator */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <h3 className="text-xl font-semibold font-inter mb-4 text-blue-700 dark:text-blue-300">Interactive EMF Calculator (<InlineMath math={'|\\epsilon| = N |\\Delta \\Phi_B / \\Delta t|'}/>)</h3>
                          <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Calculate the magnitude of induced EMF.</p>
                          <InteractiveSlider
                             label="Number of Turns (N)" unit=""
                             min={1} max={100} step={1}
                             value={numTurns} onChange={setNumTurns} formulaSymbol={katex_N}
                         />
                         <InteractiveSlider
                             label="Change in Flux (ΔΦ_B)" unit="Wb"
                             min={0.001} max={0.5} step={0.001}
                             value={fluxChange} onChange={setFluxChange} formulaSymbol={katex_DeltaPhiB}
                         />
                          <InteractiveSlider
                             label="Time Interval (Δt)" unit="s"
                             min={0.01} max={2.0} step={0.01}
                             value={timeChange} onChange={setTimeChange} formulaSymbol={katex_Delta_t}
                         />
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded shadow-inner text-center">
                              <p className="text-lg font-semibold font-inter text-dark-gray dark:text-light-gray">
                                 Induced EMF Magnitude (<InlineMath math={'|\\epsilon|'}/>) ≈ <span className="font-bold text-teal dark:text-mint">
                                     {isFinite(inducedEMF) ? inducedEMF.toFixed(3) : "Infinity"}
                                 </span> V
                              </p>
                          </div>
                           <MiniCheckQuestion
                              question="To induce a larger EMF, should the magnetic flux change quickly or slowly over a given time interval?"
                              correctAnswer="Quickly."
                              explanation="EMF is proportional to the *rate* of change (ΔΦ_B / Δt). A faster change (smaller Δt for the same ΔΦ_B) results in a larger induced EMF."
                          />
                     </div>

                    {/* Panel 3: Lenz's Law Video */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="k2RzSs4_Ur0" title="Video: Understanding Lenz's Law (Direction of Induced Current)"/>
                    </div>

                     {/* Panel 4: Lenz's Law Mini Question */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Lenz's Law Check</h3>
                         <MiniCheckQuestion
                            question="If you pull a South pole away from a loop, the decreasing flux induces a current. What kind of magnetic pole does this induced current create facing the retreating magnet?"
                            correctAnswer="A North pole."
                            explanation="The flux is decreasing. Lenz's Law says the induced field must oppose this *decrease* by trying to add flux in the original direction. A North pole facing the retreating South pole creates an attractive force, attempting to oppose the magnet's removal."
                        />
                    </div>

                    {/* Panel 5: PhET Simulation */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Faraday's Law</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Move magnets, change fields, and see the induced voltage and current.</p>
                        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                            <a href="https://phet.colorado.edu/sims/html/faradays-law/latest/faradays-law_en.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open PhET: Faraday's Law (New Tab)</span>
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
                    Test Your Induction Knowledge!
                </button>
            </div>
        </main>

        {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Faraday & Lenz Law Quiz</h2>
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
FaradayLenzLawPage.displayName = 'FaradayLenzLawPage';

export default FaradayLenzLawPage;
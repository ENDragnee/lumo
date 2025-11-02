'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, useMemo, ChangeEvent } from 'react';
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
    const sliderValue = logScale ? (value > 0 ? Math.log10(value) : Math.log10(min)) : value;
    const minSlider = logScale ? (min > 0 ? Math.log10(min) : -Infinity) : min;
    const maxSlider = logScale ? Math.log10(max) : max;
    const stepSlider = logScale ? (maxSlider - minSlider) / 100 : step;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const sliderVal = parseFloat(event.target.value);
        let actualValue = logScale ? Math.pow(10, sliderVal) : sliderVal;
        actualValue = Math.max(min, Math.min(max, actualValue));
        if (logScale && actualValue <= 0) actualValue = min;
        onChange(actualValue);
    };

    const displayValue = value <= 0 && logScale ? "N/A" : (value < 0.001 || value > 100000 ? value.toExponential(2) : value.toFixed(step < 0.01 ? 3 : (step < 1 ? 1 : 0)));
    const minDisplay = min <= 0 && logScale ? "N/A" : (min < 0.001 || min > 100000 ? min.toExponential(1) : min);
    const maxDisplay = max <= 0 && logScale ? "N/A" : (max < 0.001 || max > 100000 ? max.toExponential(1) : max);

  return (
    <div className="mb-4">
      <label htmlFor={label} className="block text-sm font-medium mb-1 font-inter text-dark-gray dark:text-light-gray">
        {label} (<InlineMath math={formulaSymbol} /> = {displayValue} {unit})
      </label>
      <input
        type="range"
        id={label}
        min={minSlider === -Infinity ? undefined : minSlider}
        max={maxSlider}
        step={stepSlider}
        value={sliderValue}
        onChange={handleChange}
        disabled={minSlider === -Infinity}
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
  {
    "question": "Who discovered that a changing magnetic field can induce an electromotive force (emf)?",
    "options": [
      "Hans Christian Oersted",
      "André-Marie Ampère",
      "Michael Faraday", // Correct
      "James Clerk Maxwell"
    ],
    "correctAnswer": 2,
    "hint": "This English scientist made the discovery of electromagnetic induction in 1831."
  },
  {
    "question": "What physical quantity does magnetic flux (Φ_B) measure?",
    "options": [
      "The strength of the magnetic field at a point.",
      "The total number of magnetic field lines passing through a given area.", // Correct
      "The force exerted by a magnetic field on a charge.",
      "The electric potential difference created by a magnet."
    ],
    "correctAnswer": 1,
    "hint": "Flux relates the magnetic field strength (B) and the area (A) it passes through."
  },
  {
    "question": "Electromagnetic induction is the phenomenon where...",
    "options": [
      "a current creates a magnetic field.",
      "a changing magnetic field creates an electric current (or emf).", // Correct
      "static charges create a magnetic field.",
      "magnets align with the Earth's field."
    ],
    "correctAnswer": 1,
    "hint": "It's the reverse of Oersted's discovery – magnetism producing electricity."
  },
  {
    "question": "What fundamental concept explains why generators and transformers work?",
    "options": [
      "Ohm's Law",
      "Coulomb's Law",
      "Electromagnetic Induction", // Correct
      "Newton's Law of Gravitation"
    ],
    "correctAnswer": 2,
    "hint": "The discoveries by Faraday and Henry regarding induced currents are key to these technologies."
  },
  {
    "question": "In the magnetic flux formula Φ_B = BAcos(θ), when is the flux maximum?",
    "options": [
      "When the magnetic field is parallel to the surface area vector (θ = 0°)", // Correct
      "When the magnetic field is perpendicular to the surface area vector (θ = 90°)",
      "When the magnetic field is zero",
      "When the area is zero"
    ],
    "correctAnswer": 0,
    "hint": "Cosine is maximum (1) when the angle is 0°, meaning the field lines pass straight through the area."
  },
   {
    "question": "What is the SI unit of magnetic flux?",
    "options": [
      "Tesla (T)",
      "Weber (Wb)", // Correct
      "Volt (V)",
      "Ampere (A)"
    ],
    "correctAnswer": 1,
    "hint": "Named after Wilhelm Weber, 1 Wb = 1 T⋅m²."
  },
  {
    "question": "Can a *constant*, uniform magnetic field passing through a stationary loop of wire induce a current?",
    "options": [
      "Yes, always",
      "Only if the field is very strong",
      "No, the magnetic flux must be changing", // Correct
      "Only if the wire is a superconductor"
    ],
    "correctAnswer": 2,
    "hint": "Faraday's Law states that induction requires a *change* in magnetic flux over time."
  }
];


// --- KaTeX String Constants ---
const katex_Phi_B = '\\Phi_B';
const katex_B = 'B';
const katex_A = 'A';
const katex_theta = '\\theta';
const katex_Flux_Eq = '\\Phi_B = B A \\cos(\\theta)';
const katex_Wb = '\\text{Wb}';


// --- Main Page Component ---
const ElectromagneticInductionPage = () => { // Renamed component
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Magnetic Flux Calculator State
  const [magneticFieldB, setMagneticFieldB] = useState(0.5); // Tesla
  const [areaA, setAreaA] = useState(0.1); // m^2
  const [angleTheta, setAngleTheta] = useState(0); // degrees

  // --- Memoized Calculations ---
   const calculatedMagneticFlux = useMemo(() => {
        // Convert angle from degrees to radians for Math.cos
        const angleRad = angleTheta * (Math.PI / 180);
        return magneticFieldB * areaA * Math.cos(angleRad);
    }, [magneticFieldB, areaA, angleTheta]);

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
                4.4 Electromagnetic Induction {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             The Interplay of Electricity and Magnetism
                         </h2>
                         <p className="leading-relaxed">
                            Early experiments by Oersted, Ampère, and others revealed that electricity and magnetism are deeply connected. We learned that moving electric charges (currents) produce magnetic fields. This naturally led scientists to ask the reverse question: Can magnetism produce electricity?
                         </p>
                    </section>

                    {/* Faraday's Discovery */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Faraday's Discovery: Induction
                         </h2>
                         <p className="leading-relaxed">
                             In 1831, <strong className="text-coral dark:text-gold font-semibold">Michael Faraday</strong> (and independently, Joseph Henry) made a groundbreaking discovery. He found that a <strong className="text-teal dark:text-teal font-semibold">changing magnetic field</strong> passing through a loop of wire could generate an electrical potential difference, called an <strong className="text-teal dark:text-teal font-semibold">electromotive force (emf)</strong>. If the wire formed a closed circuit, this induced emf would drive an <strong className="text-teal dark:text-teal font-semibold">induced electric current</strong>.
                         </p>
                          <p className="mt-3 leading-relaxed">
                             This phenomenon, known as <strong className="text-teal dark:text-teal font-semibold">electromagnetic induction</strong>, is the fundamental principle behind electric generators, transformers, and many other essential technologies. It demonstrated conclusively that magnetism could indeed produce electricity, but only when the magnetic field or its interaction with the circuit was changing.
                          </p>
                          <p className="mt-3 leading-relaxed">
                              The practical implications were immense. Without electromagnetic induction, widespread generation and use of electricity as we know it today would be impossible.
                          </p>
                    </section>

                    {/* Magnetic Flux */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Magnetic Flux (<InlineMath math={katex_Phi_B}/>)
                         </h2>
                         <p className="leading-relaxed">
                            To quantify the "amount" of magnetic field passing through a surface, we use the concept of <strong className="text-teal dark:text-teal font-semibold">magnetic flux</strong>, denoted by <InlineMath math={katex_Phi_B}/>. It's analogous to thinking about how many magnetic field lines pierce through a given area.
                         </p>
                          <p className="mt-3 leading-relaxed">
                            For a flat area <InlineMath math={katex_A}/> placed in a uniform magnetic field <InlineMath math={katex_B}/>, the magnetic flux is calculated as:
                          </p>
                           <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                              <BlockMath math={katex_Flux_Eq}/>
                          </div>
                          <p className="leading-relaxed">
                              Here, <InlineMath math={katex_theta}/> is the crucial angle between the direction of the magnetic field <InlineMath math={katex_B}/> and the direction <strong className="text-coral dark:text-gold">perpendicular (normal)</strong> to the surface area <InlineMath math={katex_A}/>.
                          </p>
                          <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                              <li>If the field is perpendicular to the surface (<InlineMath math="\theta = 0^\circ"/>, <InlineMath math="\cos(0^\circ)=1"/>), the flux is maximum: <InlineMath math="\Phi_B = BA"/>.</li>
                              <li>If the field is parallel to the surface (<InlineMath math="\theta = 90^\circ"/>, <InlineMath math="\cos(90^\circ)=0"/>), no field lines pass through, and the flux is zero: <InlineMath math="\Phi_B = 0"/>.</li>
                          </ul>
                          <p className="mt-3 leading-relaxed">
                             The SI unit of magnetic flux is the <strong className="text-teal dark:text-teal font-semibold">Weber (<InlineMath math={katex_Wb}/>)</strong>, where <InlineMath math="1 \\, Wb = 1 \\, T \\cdot m^2"/>.
                          </p>
                          <p className="mt-3 leading-relaxed">
                             Understanding magnetic flux is essential because Faraday found that the induced emf in a circuit is directly proportional to the <strong className="text-coral dark:text-gold font-semibold">rate of change</strong> of magnetic flux through that circuit.
                          </p>
                     </section>

                </article>

                {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                    {/* Panel 1: Faraday/Induction Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="hajIIGHPeuU" title="Video: Faraday's Law & Electromagnetic Induction"/>
                     </div>

                    {/* Panel 2: Magnetic Flux Calculator */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-4 text-blue-700 dark:text-blue-300">Interactive Magnetic Flux Calculator (<InlineMath math={katex_Flux_Eq}/>)</h3>
                         <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Adjust field strength (B), area (A), and the angle (θ) between B and the normal to the area.</p>
                          <InteractiveSlider
                             label="Magnetic Field (B)" unit="T"
                             min={0} max={2.0} step={0.05}
                             value={magneticFieldB} onChange={setMagneticFieldB} formulaSymbol={katex_B}
                         />
                         <InteractiveSlider
                             label="Area (A)" unit="m²"
                             min={0.01} max={0.5} step={0.01}
                             value={areaA} onChange={setAreaA} formulaSymbol={katex_A}
                         />
                          <InteractiveSlider
                             label="Angle (θ)" unit="°"
                             min={0} max={90} step={1} // 0 to 90 covers all magnitudes due to cosine
                             value={angleTheta} onChange={setAngleTheta} formulaSymbol={katex_theta}
                         />
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded shadow-inner text-center">
                              <p className="text-lg font-semibold font-inter text-dark-gray dark:text-light-gray">
                                 Magnetic Flux (<InlineMath math={katex_Phi_B}/>) ≈ <span className="font-bold text-teal dark:text-mint">
                                     {calculatedMagneticFlux.toFixed(4)}
                                 </span> Wb
                              </p>
                          </div>
                           <MiniCheckQuestion
                              question="If you rotate a loop of wire in a uniform magnetic field so the angle θ changes from 0° to 90°, how does the magnetic flux through the loop change?"
                              correctAnswer="The flux decreases from its maximum value (BA) to zero."
                              explanation="Cos(0°) = 1 (max flux), while Cos(90°) = 0 (zero flux). This *change* in flux can induce an emf."
                          />
                     </div>

                      {/* Panel 3: Flux Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="MjlAMANMgpE" title="Video: Understanding Magnetic Flux"/>
                     </div>

                     {/* Panel 4: Induction Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Induction Check</h3>
                         <MiniCheckQuestion
                             question="Which scenario will induce a current in a stationary loop of wire?"
                             correctAnswer="Moving a bar magnet towards or away from the loop."
                             explanation="Induction requires a *change* in magnetic flux. Moving the magnet changes the field strength passing through the loop, thus changing the flux."
                         />
                    </div>

                    {/* Panel 5: PhET Simulation - Faraday's Law */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Faraday's Law</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Move magnets, change fields, and see induced currents.</p>
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
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Electromagnetic Induction Quiz</h2>
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
ElectromagneticInductionPage.displayName = 'ElectromagneticInductionPage';

export default ElectromagneticInductionPage;
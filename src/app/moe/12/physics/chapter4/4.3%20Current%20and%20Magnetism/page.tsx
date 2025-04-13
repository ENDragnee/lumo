'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, useMemo, ChangeEvent } from 'react';
import QuizQuestion from '@/components/QuizQuestion'; // Assuming this component exists
import 'katex/dist/katex.min.css';

// --- Constants ---
const MU_0 = 4 * Math.PI * 1e-7; // T·m/A (Permeability of free space)

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
    const sliderValue = logScale ? (value > 0 ? Math.log10(value) : Math.log10(min)) : value; // Handle log(0 or negative)
    const minSlider = logScale ? (min > 0 ? Math.log10(min) : -Infinity) : min;
    const maxSlider = logScale ? Math.log10(max) : max;
    const stepSlider = logScale ? (maxSlider - minSlider) / 100 : step;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const sliderVal = parseFloat(event.target.value);
        let actualValue = logScale ? Math.pow(10, sliderVal) : sliderVal;
        actualValue = Math.max(min, Math.min(max, actualValue));
        if (logScale && actualValue <= 0) actualValue = min; // Ensure positive for log
        onChange(actualValue);
    };

    const displayValue = value <= 0 && logScale ? "N/A" : (value < 0.00001 || value > 100000 ? value.toExponential(2) : value.toFixed(step < 0.001 ? 4 : (step < 0.1 ? 2: 1)));
    const minDisplay = min <= 0 && logScale ? "N/A" : (min < 0.00001 || min > 100000 ? min.toExponential(1) : min);
    const maxDisplay = max <= 0 && logScale ? "N/A" : (max < 0.00001 || max > 100000 ? max.toExponential(1) : max);


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
    "question": "What happens to the magnetic field around a long straight current-carrying wire as the current (I) increases?",
    "options": [
      "The magnetic field decreases",
      "The magnetic field remains the same",
      "The magnetic field increases proportionally", // Correct
      "The magnetic field direction reverses"
    ],
    "correctAnswer": 2,
    "hint": "From B = μ₀I / (2πr), B is directly proportional to I."
  },
  {
    "question": "How is the direction of the magnetic field lines around a straight current-carrying wire determined?",
    "options": [
      "Left-Hand Rule for forces",
      "Right-Hand Grip Rule", // Correct
      "Lenz's Law",
      "Coulomb's Law"
    ],
    "correctAnswer": 1,
    "hint": "Point your right thumb in the direction of current; your fingers curl in the direction of the B field lines."
  },
  {
    "question": "What is the relationship between the distance (r) from a long straight current-carrying wire and the magnetic field strength (B)?",
    "options": [
      "B increases as r increases",
      "B is inversely proportional to r (decreases as r increases)", // Correct
      "B is constant regardless of r",
      "B is proportional to r squared"
    ],
    "correctAnswer": 1,
    "hint": "From B = μ₀I / (2πr), B is inversely proportional to r."
  },
  {
    "question": "What is the value of μ₀ (permeability of free space)?",
    "options": [
      "8.85 x 10⁻¹² F/m",
      "6.67 x 10⁻¹¹ N⋅m²/kg²",
      "4π x 10⁻⁷ T⋅m/A", // Correct
      "3.00 x 10⁸ m/s"
    ],
    "correctAnswer": 2,
    "hint": "This fundamental constant relates magnetic fields to the currents that create them in a vacuum."
  },
  {
    "question": "According to Table 4.1, which source produces a magnetic field roughly similar in magnitude to Earth's surface field?",
    "options": [
      "Strong superconducting magnet (30 T)",
      "Medical MRI unit (1.5 T)",
      "Bar magnet (10⁻² T)", // Closest common magnet
      "Human brain nerve impulses (10⁻¹³ T)"
    ],
    "correctAnswer": 2, // Bar magnet is 100x stronger but conceptually closest comparison provided
    "hint": "Earth's field is ~0.5 x 10⁻⁴ T. A typical bar magnet is ~10⁻² T."
  },
  {
    "question": "What shape do the magnetic field lines form around a long, straight current-carrying wire?",
    "options": [
      "Straight lines parallel to the wire",
      "Straight lines perpendicular to the wire",
      "Concentric circles centered on the wire", // Correct
      "Spirals winding around the wire"
    ],
    "correctAnswer": 2,
    "hint": "Use the Right-Hand Grip Rule to visualize the circular pattern."
  },
  {
    "question": "If you reverse the direction of the current in a wire, what happens to the magnetic field lines?",
    "options": [
      "They stay the same",
      "They become stronger",
      "Their direction reverses (e.g., clockwise becomes counter-clockwise)", // Correct
      "They disappear"
    ],
    "correctAnswer": 2,
    "hint": "The Right-Hand Grip Rule shows that reversing the thumb (current) reverses the direction the fingers curl (field)."
  },
  {
    "question": "What is the relationship between Tesla (T) and Gauss (G)?",
    "options": [
      "1 T = 1 G",
      "1 T = 100 G",
      "1 T = 10,000 G", // Correct
      "1 G = 10,000 T"
    ],
    "correctAnswer": 2,
    "hint": "Tesla is the larger SI unit; Gauss is a smaller CGS unit often used for weaker fields."
  }
];

// --- KaTeX String Constants ---
const katex_B = 'B';
const katex_mu0 = '\\mu_0';
const katex_I = 'I';
const katex_r = 'r';
const katex_pi = '\\pi';
const katex_B_wire = `B = \\frac{\\mu_0 I}{2\\pi r}`;
const katex_mu0_val = '\\mu_0 = 4\\pi \\times 10^{-7} \\, \\text{T}\\cdot\\text{m/A}';
const katex_T = 'T';
const katex_G = 'G';
const katex_T_G_conversion = '1 \\, T = 10^4 \\, G';

// --- Main Page Component ---
const MagneticFieldFromCurrent = () => { // Renamed component
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Magnetic Field Calculator State
  const [currentI, setCurrentI] = useState(10.0); // Amperes
  const [distanceR, setDistanceR] = useState(0.01); // meters (1 cm)

  // --- Memoized Calculations ---
  const calculatedMagneticField = useMemo(() => {
      if (distanceR <= 0) return Infinity; // Avoid division by zero
      return (MU_0 * currentI) / (2 * Math.PI * distanceR);
  }, [currentI, distanceR]);


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
                4.3 Magnetic Field from Current {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Magnetic Field from Long Straight Wire */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Field from a Long Straight Wire
                         </h2>
                         <p className="leading-relaxed">
                            One of the simplest yet most fundamental examples of electromagnetism is the magnetic field created by a steady electric current flowing through a long, straight wire. As Oersted discovered, this current generates a magnetic field in the space surrounding the wire.
                         </p>
                         <p className="mt-3 leading-relaxed">
                            The strength (magnitude) of this magnetic field (<InlineMath math={katex_B}/>) depends on two main factors:
                            <ul className="list-disc list-inside ml-4 mt-2">
                                <li>The magnitude of the current (<InlineMath math={katex_I}/>): A larger current produces a stronger magnetic field (<InlineMath math="B \propto I"/>).</li>
                                <li>The perpendicular distance (<InlineMath math={katex_r}/>) from the wire: The field gets weaker as you move further away from the wire (<InlineMath math="B \propto 1/r"/>).</li>
                            </ul>
                         </p>
                         <p className="mt-3 leading-relaxed">
                             The precise relationship is given by Ampere's Law (applied to this specific geometry):
                         </p>
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                              <BlockMath math={katex_B_wire}/>
                          </div>
                          <p className="leading-relaxed">
                              Where <InlineMath math={katex_mu0}/> is the permeability of free space, a fundamental constant with the value <InlineMath math={katex_mu0_val}/>.
                          </p>
                           <p className="mt-3 leading-relaxed">
                             The SI unit for magnetic field strength <InlineMath math={katex_B}/> is the <strong className="text-teal dark:text-teal font-semibold">Tesla (<InlineMath math={katex_T}/>)</strong>. A smaller unit, the Gauss (<InlineMath math={katex_G}/>), is also sometimes used, where <InlineMath math={katex_T_G_conversion}/>.
                           </p>
                    </section>

                    {/* Properties and Direction */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                              Field Properties & Direction
                          </h2>
                           <p className="leading-relaxed">
                               The magnetic field lines created by a current in a long straight wire have distinct characteristics:
                           </p>
                           <ul className="list-disc list-outside ml-6 space-y-2 mt-2">
                                <li>
                                   <strong className="font-semibold">Pattern:</strong> The field lines form concentric circles centered on the wire, lying in planes perpendicular to the wire.
                                </li>
                               <li>
                                   <strong className="font-semibold">Direction (Right-Hand Grip Rule):</strong> To find the direction of the field lines, use the <strong className="text-coral dark:text-gold font-semibold">Right-Hand Grip Rule</strong>. Point the thumb of your right hand in the direction of the conventional current (<InlineMath math={katex_I}/>). Your fingers will curl around the wire in the direction of the magnetic field (<InlineMath math={katex_B}/>) lines.
                               </li>
                                <li>
                                    <strong className="font-semibold">Current Reversal:</strong> If the direction of the current is reversed, the direction of the magnetic field lines also reverses (e.g., from clockwise to counter-clockwise).
                                </li>
                                <li>
                                    <strong className="font-semibold">Strength Variation:</strong> The field is strongest close to the wire and weakens as the distance (<InlineMath math={katex_r}/>) increases.
                                </li>
                            </ul>
                    </section>

                    {/* Table of Field Magnitudes */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Typical Magnetic Field Strengths
                         </h2>
                         <p className="leading-relaxed mb-4">
                             Magnetic fields vary enormously in strength depending on their source. Here are some approximate values (from Table 4.1):
                         </p>
                         <div className="overflow-x-auto font-inter"> {/* UI Font for table data */}
                             <table className="table-auto w-full border-collapse text-sm">
                                 <thead className="bg-gray-100 dark:bg-gray-700">
                                 <tr>
                                     <th className="border dark:border-gray-600 px-4 py-2 text-left font-semibold">Source of Field</th>
                                     <th className="border dark:border-gray-600 px-4 py-2 text-left font-semibold">Field Magnitude (T)</th>
                                 </tr>
                                 </thead>
                                 <tbody className="bg-white dark:bg-gray-800">
                                 <tr><td className="border dark:border-gray-600 px-4 py-2">Strong superconducting lab magnet</td><td className="border dark:border-gray-600 px-4 py-2">30</td></tr>
                                 <tr><td className="border dark:border-gray-600 px-4 py-2">Strong conventional lab magnet</td><td className="border dark:border-gray-600 px-4 py-2">2</td></tr>
                                 <tr><td className="border dark:border-gray-600 px-4 py-2">Medical MRI unit</td><td className="border dark:border-gray-600 px-4 py-2">1.5</td></tr>
                                 <tr><td className="border dark:border-gray-600 px-4 py-2">Bar magnet</td><td className="border dark:border-gray-600 px-4 py-2">10<sup>-2</sup></td></tr>
                                 <tr><td className="border dark:border-gray-600 px-4 py-2">Surface of the sun</td><td className="border dark:border-gray-600 px-4 py-2">10<sup>-2</sup></td></tr>
                                 <tr><td className="border dark:border-gray-600 px-4 py-2">Surface of the Earth</td><td className="border dark:border-gray-600 px-4 py-2">0.5 × 10<sup>-4</sup></td></tr>
                                 <tr><td className="border dark:border-gray-600 px-4 py-2">Inside human brain (nerve impulses)</td><td className="border dark:border-gray-600 px-4 py-2">10<sup>-13</sup></td></tr>
                                 </tbody>
                             </table>
                         </div>
                     </section>

                </article>

                {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                     {/* Panel 1: Field from Wire Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="JkO5T7elGS8" title="Video: Magnetic Field Around a Current-Carrying Wire"/>
                     </div>

                     {/* Panel 2: Magnetic Field Calculator */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-4 text-blue-700 dark:text-blue-300">Interactive Field Calculator (<InlineMath math={katex_B_wire}/>)</h3>
                         <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Adjust current (I) and distance (r) from a long straight wire.</p>
                         <InteractiveSlider
                            label="Current (I)" unit="A"
                            min={0.1} max={50.0} step={0.1}
                            value={currentI} onChange={setCurrentI} formulaSymbol={katex_I}
                            logScale={false} // Linear likely ok here
                         />
                         <InteractiveSlider
                             label="Distance (r)" unit="m"
                             min={0.001} max={0.1} step={0.001} // 1mm to 10cm
                             value={distanceR} onChange={setDistanceR} formulaSymbol={katex_r}
                             logScale={true} // Log scale helpful for distance
                         />
                         <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded shadow-inner text-center">
                              <p className="text-lg font-semibold font-inter text-dark-gray dark:text-light-gray">
                                Magnetic Field (<InlineMath math={katex_B}/>) ≈ <span className="font-bold text-teal dark:text-mint">
                                     {isFinite(calculatedMagneticField) ? calculatedMagneticField.toExponential(3) : "Infinity"}
                                 </span> T
                              </p>
                         </div>
                          <MiniCheckQuestion
                             question="According to the formula, if you double the distance 'r' from the wire, what happens to the magnetic field strength 'B'?"
                             correctAnswer="The field strength 'B' is halved (becomes 1/2)."
                             explanation="B is inversely proportional to r (B ∝ 1/r). If r doubles, B becomes half."
                         />
                     </div>

                    {/* Panel 3: Right-Hand Rule Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="bht4rK2Hr88" title="Video: Right-Hand Grip Rule for Wires"/>
                     </div>

                      {/* Panel 4: Mini Question on Direction */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Direction Check</h3>
                           <MiniCheckQuestion
                              question="If current flows upwards in a vertical wire, what is the direction of the magnetic field lines to the right of the wire?"
                              correctAnswer="Into the page/screen."
                              explanation="Using the Right-Hand Grip Rule: point thumb up (current), fingers curl around. To the right of the wire, your fingers point into the page."
                          />
                      </div>

                     {/* Panel 5: PhET Simulation */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Magnets & Electromagnets</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Use the 'Electromagnet' tab to see the field from current.</p>
                        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                            <a href="https://phet.colorado.edu/sims/html/magnets-and-electromagnets/latest/magnets-and-electromagnets_en.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open PhET: Magnets & Electromagnets (New Tab)</span>
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
                    Test Your Understanding!
                </button>
            </div>
        </main>

        {/* Quiz Modal */}
        {showQuiz && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Current & Magnetism Quiz</h2>
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
MagneticFieldFromCurrent.displayName = 'MagneticFieldFromCurrent';

export default MagneticFieldFromCurrent;
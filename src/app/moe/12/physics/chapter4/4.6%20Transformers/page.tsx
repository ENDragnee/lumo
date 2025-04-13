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
    // Basic implementation assuming non-log for simplicity here
    const sliderValue = value;
    const minSlider = min;
    const maxSlider = max;
    const stepSlider = step;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        let actualValue = parseFloat(event.target.value);
        actualValue = Math.max(min, Math.min(max, actualValue));
        onChange(actualValue);
    };

    const displayValue = value.toFixed(step < 1 ? (step < 0.1 ? 2 : 1) : 0);
    const minDisplay = min.toFixed(0);
    const maxDisplay = max.toFixed(0);

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
        className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal dark:accent-teal"
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
    "question": "What is the main function of a transformer in an electrical circuit?",
    "options": [
      "To generate electrical energy",
      "To transfer AC electrical energy between circuits using induction, often changing voltage.", // More specific
      "To convert AC to DC",
      "To store electrical energy"
    ],
    "correctAnswer": 1,
    "hint": "Transformers work via mutual induction between coils to change AC voltage levels."
  },
  {
    "question": "A transformer has Np = 100 turns and Ns = 500 turns. What type of transformer is it?",
    "options": [
      "Step-down transformer",
      "Step-up transformer", // Correct (Ns > Np)
      "Isolation transformer",
      "Autotransformer"
    ],
    "correctAnswer": 1,
    "hint": "If the secondary coil has more turns than the primary, it steps up the voltage."
  },
  {
    "question": "If the primary voltage (Vp) is 120V and the turns ratio Np/Ns is 10, what is the secondary voltage (Vs)?",
    "options": [
      "12V", // Correct (Vs = Vp * (Ns/Np) = 120 * (1/10))
      "1.2V",
      "1200V",
      "120V"
    ],
    "correctAnswer": 0,
    "hint": "Use the formula Vp/Vs = Np/Ns. This is a step-down transformer."
  },
  {
    "question": "An ideal transformer has an input power of 50W. What is its output power?",
    "options": [
      "Slightly less than 50W",
      "Exactly 50W", // Correct (Ideal means 100% efficient)
      "Slightly more than 50W",
      "Cannot be determined"
    ],
    "correctAnswer": 1,
    "hint": "An ideal transformer has 100% efficiency, meaning power in equals power out (Pin = Pout)."
  },
  {
    "question": "Why are transformers essential for long-distance power transmission?",
    "options": [
      "They convert AC to DC for transmission",
      "They step up voltage to reduce current, minimizing power loss (I²R loss) in transmission lines", // Correct
      "They increase the frequency for better transmission",
      "They generate the initial power"
    ],
    "correctAnswer": 1,
    "hint": "High voltage allows for lower current for the same power (P=VI), reducing resistive losses."
  },
  {
    "question": "What principle allows energy transfer between the primary and secondary coils of a transformer?",
    "options": [
      "Electrostatic attraction",
      "Direct electrical connection",
      "Electromagnetic induction (mutual induction)", // Correct
      "Resistive heating"
    ],
    "correctAnswer": 2,
    "hint": "The changing magnetic flux from the primary coil induces an EMF in the secondary coil."
  },
  {
    "question": "What type of current MUST be used for a standard transformer to operate?",
    "options": [
      "Direct Current (DC)",
      "Alternating Current (AC)", // Correct
      "Pulsating DC",
      "Static charge"
    ],
    "correctAnswer": 1,
    "hint": "Transformers rely on a *changing* magnetic flux, which is produced by AC, not steady DC."
  },
  {
    "question": "If a transformer steps up the voltage by a factor of 10 (ideal), what happens to the current?",
    "options": [
      "Current increases by a factor of 10",
      "Current decreases by a factor of 10", // Correct (IpVp = IsVs => Is = Ip * (Vp/Vs) = Ip / 10)
      "Current stays the same",
      "Current becomes zero"
    ],
    "correctAnswer": 1,
    "hint": "For an ideal transformer, power is conserved (P=IV). If V increases, I must decrease proportionally."
  }
];

// --- KaTeX String Constants ---
const katex_Vp = 'V_p';
const katex_Vs = 'V_s';
const katex_Np = 'N_p';
const katex_Ns = 'N_s';
const katex_TurnsRatio = `\\frac{N_p}{N_s} = \\frac{V_p}{V_s}`;
const katex_eta = '\\eta'; // Efficiency symbol
const katex_Eff = `\\eta = \\frac{P_{out}}{P_{in}} \\times 100\\%`;
const katex_Ip = 'I_p'; // Primary current
const katex_Is = 'I_s'; // Secondary current
const katex_PowerIdeal = 'V_p I_p = V_s I_s \\quad (\\text{Ideal})';

// --- Main Page Component ---
const TransformersPage = () => { // Renamed component
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Transformer Calculator State
  const [vp, setVp] = useState(120.0); // Volts (Primary)
  const [np, setNp] = useState(600);   // Turns (Primary)
  const [ns, setNs] = useState(60);    // Turns (Secondary) -> Default step-down

  // --- Memoized Calculations ---
  const vs = useMemo(() => {
      if (np <= 0) return NaN; // Prevent division by zero
      return vp * (ns / np);
  }, [vp, np, ns]);

  const turnsRatio = useMemo(() => {
      if (ns <= 0) return NaN;
      return np / ns;
  }, [np, ns]);

  const transformerType = useMemo(() => {
      if (ns > np) return "Step-Up";
      if (np > ns) return "Step-Down";
      return "Isolation (1:1)";
  }, [np, ns]);


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
                4.6 Transformers {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            What is a Transformer?
                         </h2>
                         <p className="leading-relaxed">
                            A <strong className="text-teal dark:text-teal font-semibold">transformer</strong> is a passive electrical device that leverages <strong className="text-teal dark:text-teal font-semibold">electromagnetic induction</strong> to transfer electrical energy from one AC circuit to another. Its primary function is usually to change the voltage level, either increasing it (<strong className="text-coral dark:text-gold">step-up</strong>) or decreasing it (<strong className="text-coral dark:text-gold">step-down</strong>), without changing the frequency of the alternating current.
                         </p>
                         <p className="mt-3 leading-relaxed">
                            They are essential components in power distribution systems, allowing electricity to be transmitted efficiently over long distances at high voltage and then reduced to safer levels for consumer use. They are also found in countless electronic devices.
                         </p>
                    </section>

                    {/* Construction and Principle */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Construction & Operating Principle
                         </h2>
                         <p className="leading-relaxed">
                             A basic transformer consists of two coils of insulated wire wound around a common <strong className="text-teal dark:text-teal font-semibold">magnetic core</strong> (often laminated iron to reduce energy losses).
                             <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                 <li><strong className="font-semibold">Primary Winding:</strong> Connected to the input AC voltage source.</li>
                                 <li><strong className="font-semibold">Secondary Winding:</strong> Connected to the load, where the output voltage is delivered.</li>
                             </ul>
                         </p>
                          <p className="mt-3 leading-relaxed">
                              <strong className="text-coral dark:text-gold font-semibold">Operating Principle:</strong>
                              <ol className="list-decimal list-inside ml-4 space-y-1 mt-2">
                                  <li>An alternating current (AC) flowing through the primary winding creates a continuously changing magnetic field in the core.</li>
                                  <li>This changing magnetic field permeates the core and links with the secondary winding.</li>
                                  <li>According to Faraday's Law of Induction, the changing magnetic flux through the secondary winding induces an alternating electromotive force (emf), i.e., a voltage, across it.</li>
                                  <li>If the secondary circuit is closed, this induced emf drives an AC current through the load.</li>
                              </ol>
                          </p>
                          <p className="mt-3 leading-relaxed">
                             Crucially, the primary and secondary windings are electrically isolated but magnetically coupled via the core. Energy is transferred purely through the magnetic field. Transformers <strong className="text-coral dark:text-gold">do not work with direct current (DC)</strong> because a steady DC current produces a constant magnetic field, which cannot induce an emf in the secondary coil.
                          </p>
                     </section>

                     {/* Turns Ratio and Voltage */}
                      <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Turns Ratio and Voltage Relation
                         </h2>
                         <p className="leading-relaxed">
                             The ratio of the voltage across the primary winding (<InlineMath math={katex_Vp}/>) to the voltage across the secondary winding (<InlineMath math={katex_Vs}/>) is approximately equal to the ratio of the number of turns in the primary coil (<InlineMath math={katex_Np}/>) to the number of turns in the secondary coil (<InlineMath math={katex_Ns}/>). This is known as the <strong className="text-teal dark:text-teal font-semibold">turns ratio</strong>.
                         </p>
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={katex_TurnsRatio}/>
                         </div>
                          <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                              <li>If <InlineMath math="N_s > N_p"/> (more turns on secondary), then <InlineMath math="V_s > V_p"/>: It's a <strong className="text-coral dark:text-gold">step-up</strong> transformer.</li>
                              <li>If <InlineMath math="N_s < N_p"/> (fewer turns on secondary), then <InlineMath math="V_s < V_p"/>: It's a <strong className="text-coral dark:text-gold">step-down</strong> transformer.</li>
                          </ul>
                          <p className="mt-3 leading-relaxed">
                             For an ideal (100% efficient) transformer, the power input equals the power output: <InlineMath math="P_{in} = P_{out}" />, or <InlineMath math="V_p I_p = V_s I_s"/>. This means if voltage is stepped up, current must be stepped down proportionally, and vice versa, to conserve energy.
                          </p>
                           <div className='my-4 p-2 text-sm bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                              <BlockMath math={katex_PowerIdeal}/>
                          </div>
                     </section>

                     {/* Efficiency */}
                      <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Efficiency (<InlineMath math={katex_eta}/>)
                         </h2>
                           <p className="leading-relaxed">
                             Real transformers are not perfectly efficient due to energy losses (e.g., resistive heating in windings, eddy currents in the core, hysteresis losses). However, large power transformers can be highly efficient, often exceeding 98-99%.
                           </p>
                           <p className="mt-3 leading-relaxed">
                               Efficiency (<InlineMath math={katex_eta}/>) is defined as the ratio of output power to input power, usually expressed as a percentage:
                           </p>
                            <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                               <BlockMath math={katex_Eff}/>
                            </div>
                     </section>

                     {/* Household Applications */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Household Applications
                         </h2>
                          <p className="leading-relaxed">
                            Many electronic devices require voltages lower than the standard mains supply (e.g., 120V or 230V AC). Small <strong className="text-teal dark:text-teal font-semibold">step-down transformers</strong> are built into power adapters (chargers) for laptops, phones, and other gadgets.
                          </p>
                          <p className="mt-3 leading-relaxed">
                              These transformers reduce the high mains voltage to a safe, low level suitable for the device's internal circuits. Often, these adapters also contain <strong className="text-coral dark:text-gold">rectifiers</strong> and filters to convert the stepped-down AC voltage into the direct current (DC) voltage required by most electronics.
                          </p>
                     </section>

                </article>

                {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                    {/* Panel 1: How Transformers Work Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="Vises6Momq4" title="Video: How Transformers Work"/>
                     </div>

                     {/* Panel 2: Transformer Calculator */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-4 text-blue-700 dark:text-blue-300">Interactive Transformer (<InlineMath math={katex_TurnsRatio}/>)</h3>
                          <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Adjust Vp, Np, and Ns to see the resulting Vs and type.</p>
                           <InteractiveSlider label="Primary Voltage (Vp)" unit="V" min={10} max={240} step={1} value={vp} onChange={setVp} formulaSymbol={katex_Vp} />
                           <InteractiveSlider label="Primary Turns (Np)" unit="turns" min={10} max={2000} step={10} value={np} onChange={setNp} formulaSymbol={katex_Np} />
                           <InteractiveSlider label="Secondary Turns (Ns)" unit="turns" min={10} max={2000} step={10} value={ns} onChange={setNs} formulaSymbol={katex_Ns} />
                           <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded shadow-inner grid grid-cols-1 sm:grid-cols-2 gap-2 text-center">
                               <p className="text-md font-semibold font-inter text-dark-gray dark:text-light-gray">
                                 Type: <span className="font-bold text-teal dark:text-mint">{transformerType}</span>
                               </p>
                               <p className="text-md font-semibold font-inter text-dark-gray dark:text-light-gray">
                                 Sec. Voltage (<InlineMath math={katex_Vs}/>) ≈ <span className="font-bold text-teal dark:text-mint">{isFinite(vs) ? vs.toFixed(1) : "N/A"}</span> V
                              </p>
                          </div>
                           <MiniCheckQuestion
                              question="To create a step-down transformer, should Ns (secondary turns) be greater than or less than Np (primary turns)?"
                              correctAnswer="Ns should be less than Np."
                              explanation="From Vp/Vs = Np/Ns, to make Vs smaller than Vp, Ns must be smaller than Np."
                          />
                     </div>

                    {/* Panel 3: Power Transmission Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="ZBig3wqJA4w" title="Video: Transformers in Power Transmission"/>
                     </div>

                     {/* Panel 4: Ideal Transformer Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Ideal Transformer Check</h3>
                         <MiniCheckQuestion
                            question="An ideal step-up transformer increases voltage from 100V to 1000V. If the primary current is 5A, what is the secondary current?"
                            correctAnswer="0.5A"
                            explanation="Power is conserved: Vp * Ip = Vs * Is. So, 100V * 5A = 1000V * Is. Solving for Is gives Is = (100 * 5) / 1000 = 0.5A."
                         />
                    </div>

                    {/* Panel 5: PhET Simulation (Generator - shows induction) */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Faraday's Generator</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">This simulation demonstrates the induction principle underlying transformers.</p>
                        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                            <a href="https://phet.colorado.edu/sims/html/faradays-electromagnetic-lab/latest/faradays-electromagnetic-lab_en.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open PhET: Faraday's Lab (New Tab)</span>
                            </a>
                            {/* Or iframe if possible:
                             <iframe src="https://phet.colorado.edu/sims/html/faradays-electromagnetic-lab/latest/faradays-electromagnetic-lab_en.html" ... ></iframe>
                            */}
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
                    Test Your Transformer Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
        {showQuiz && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Transformers Quiz</h2>
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
TransformersPage.displayName = 'TransformersPage';

export default TransformersPage;
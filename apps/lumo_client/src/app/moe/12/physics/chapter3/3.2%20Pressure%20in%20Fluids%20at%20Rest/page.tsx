"use client";

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
    const sliderValue = logScale ? Math.log10(value) : value;
    const minSlider = logScale ? (min > 0 ? Math.log10(min) : -Infinity) : min; // Handle log(0)
    const maxSlider = logScale ? Math.log10(max) : max;
    const stepSlider = logScale ? (maxSlider - minSlider) / 100 : step; // Adjust step for log

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const sliderVal = parseFloat(event.target.value);
        let actualValue = logScale ? Math.pow(10, sliderVal) : sliderVal;
        // Clamp value to min/max to avoid issues
        actualValue = Math.max(min, Math.min(max, actualValue));
        // Ensure value does not become non-positive if log scale requires positive input
        if (logScale && actualValue <= 0) actualValue = min;
        onChange(actualValue);
    };

    const displayValue = value <= 0 && logScale ? "N/A" : (value < 0.001 || value > 100000 ? value.toExponential(1) : value.toFixed(step < 0.01 ? 3 : (step < 1 ? 1 : 0)));
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
        min={minSlider === -Infinity ? undefined : minSlider} // Handle -Infinity case
        max={maxSlider}
        step={stepSlider}
        value={sliderValue}
        onChange={handleChange}
        disabled={minSlider === -Infinity} // Disable if min is invalid for log
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
    <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md"> {/* Increased top margin */}
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
    "question": "What causes gas particles to exert pressure on the walls of a container?",
    "options": [
      "Their random motion and collisions", // Clarified
      "Their high density",
      "Their ability to expand",
      "Their gravitational force"
    ],
    "correctAnswer": 0,
    "hint": "Pressure is caused by collisions of particles with the walls."
  },
  {
    "question": "What does Pascal’s Principle state about pressure in a static fluid?",
    "options": [
      "It decreases with depth.",
      "It is always constant everywhere.",
      "A change in pressure is transmitted undiminished throughout the fluid.",
      "It is proportional to the volume of the fluid."
    ],
    "correctAnswer": 2,
    "hint": "This principle relates to how pressure changes when applied to a fluid."
  },
  {
    "question": "What is one technical application of Pascal's Principle?",
    "options": [
      "A thermometer",
      "A barometer",
      "A hydraulic press",
      "A manometer"
    ],
    "correctAnswer": 2,
    "hint": "This device is used to lift heavy objects by converting small forces into larger forces."
  },
  {
    "question": "In a hydraulic lift, if A₂ is larger than A₁, how does F₂ compare to F₁?",
    "options": [
      "F₂ is smaller than F₁",
      "F₂ is equal to F₁",
      "F₂ is larger than F₁",
      "Cannot be determined"
    ],
    "correctAnswer": 2, // F₂ = F₁ * (A₂/A₁)
    "hint": "Pressure is equal (F₁/A₁ = F₂/A₂). If A₂ > A₁, then F₂ must be > F₁."
  },
  {
    "question": "How does pressure vary with depth in a liquid of constant density?", // Specified constant density
    "options": [
      "It decreases with depth.",
      "It remains constant.",
      "It increases linearly with depth.",
      "It fluctuates randomly with depth."
    ],
    "correctAnswer": 2,
    "hint": "This variation (P = P₀ + ρgh) is due to the weight of the liquid above."
  },
  {
    "question": "What device is commonly used to measure atmospheric pressure?",
    "options": [
      "Hydrometer",
      "Barometer",
      "Thermometer",
      "Manometer"
    ],
    "correctAnswer": 1,
    "hint": "This device typically uses a column of mercury."
  },
  {
    "question": "In a mercury barometer, what does the height 'h' in P_atm = ρgh represent?", // Clarified
    "options": [
      "The total height of the barometer tube",
      "The height of the mercury column above the mercury pool level",
      "The height of the vacuum above the mercury",
      "The depth of the mercury pool"
    ],
    "correctAnswer": 1,
    "hint": "Atmospheric pressure supports this specific column height."
  },
  {
    "question": "A manometer is used to measure the pressure difference between a gas and...",
    "options": [
      "a vacuum.",
      "another gas.",
      "the atmosphere (for open-tube) or a reference pressure (for differential).", // More general
      "the liquid density."
    ],
    "correctAnswer": 2,
    "hint": "It measures pressure relative to another pressure, often atmospheric."
  }
];

// --- KaTeX String Constants ---
const katex_P = 'P';
const katex_F1 = 'F_1';
const katex_A1 = 'A_1';
const katex_F2 = 'F_2';
const katex_A2 = 'A_2';
const katex_P_eq_F1_A1 = 'P = \\frac{F_1}{A_1}';
const katex_rho = '\\rho';
const katex_g = 'g';
const katex_h = 'h';
const katex_P0 = 'P_0';
const katex_P_depth = 'P = P_0 + \\rho g h';
const katex_P_atm_var = 'P_{atm}';
const katex_P_atm_eq = 'P_{atm} = \\rho_{Hg} g h'; // Specify rho_Hg


// --- Main Page Component ---
const FluidPressure = () => {
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Hydraulic Lift State
  const [f1, setF1] = useState(10); // Input Force (N)
  const [a1, setA1] = useState(0.01); // Input Area (m^2)
  const [a2, setA2] = useState(0.1); // Output Area (m^2)

  // Pressure vs Depth State
  const [p0, setP0] = useState(101300); // Surface Pressure (Pa, approx 1 atm)
  const [rho, setRho] = useState(1000); // Density (kg/m^3, water)
  const [h, setH] = useState(1); // Depth (m)
  const GRAVITY = 9.81; // m/s^2

  // --- Memoized Calculations ---
  const hydraulicPressure = useMemo(() => {
    if (a1 <= 0) return Infinity;
    return f1 / a1;
  }, [f1, a1]);

  const f2 = useMemo(() => {
    if (a1 <= 0) return Infinity;
    return hydraulicPressure * a2; // F2 = P * A2
  }, [hydraulicPressure, a2]);

  const pressureAtDepth = useMemo(() => {
    return p0 + rho * GRAVITY * h;
  }, [p0, rho, h]);

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
                3.2 Pressure in Fluids at Rest
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                 {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">
                    {/* Introduction */}
                    <section>
                         <p className="leading-relaxed">
                            Gas particles exert pressure by colliding with container walls. Liquid particles, though closer, also move randomly and exert pressure. We'll explore how pressure behaves in fluids that aren't flowing (static fluids).
                         </p>
                    </section>

                    {/* Pascal's Principle */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Pascal's Principle
                         </h2>
                         <p className="leading-relaxed">
                             Imagine pushing a piston into a container full of water with small holes everywhere. The water squirts out of all holes almost instantly. This illustrates <strong className="text-teal dark:text-teal font-semibold">Pascal’s Principle</strong>:
                         </p>
                         <blockquote className="mt-3 pl-4 italic border-l-4 border-teal dark:border-mint text-dark-gray dark:text-light-gray">
                             "A change in pressure applied to an enclosed incompressible fluid is transmitted undiminished to every portion of the fluid and to the walls of the containing vessel."
                         </blockquote>
                         <p className="mt-3 leading-relaxed">
                             This happens because the molecules in the fluid bump into each other, quickly spreading the pressure increase throughout.
                         </p>
                    </section>

                    {/* Hydraulic Press */}
                    <section>
                          <h3 className="text-2xl font-semibold font-playfair mt-6 mb-3">Application: The Hydraulic Press</h3>
                         <p className="leading-relaxed">
                            Pascal's Principle allows us to build devices like hydraulic lifts (used by mechanics) or hydraulic brakes. These systems use fluid pressure to multiply force.
                         </p>
                         <p className="mt-3 leading-relaxed">
                            Consider two pistons connected by a fluid-filled chamber. A small force (<InlineMath math={katex_F1}/>) applied to a small piston (area <InlineMath math={katex_A1}/>) creates a pressure:
                         </p>
                         <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={katex_P_eq_F1_A1}/>
                         </div>
                         <p className="leading-relaxed">
                             This pressure (<InlineMath math={katex_P}/>) is transmitted throughout the fluid, acting on a larger piston (area <InlineMath math={katex_A2}/>). The resulting upward force (<InlineMath math={katex_F2}/>) on the larger piston is:
                         </p>
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={`F_2 = P \\times A_2 = \\left( \\frac{F_1}{A_1} \\right) A_2 = F_1 \\left( \\frac{A_2}{A_1} \\right)`}/>
                         </div>
                         <p className="leading-relaxed">
                             Since <InlineMath math={katex_A2}/> is larger than <InlineMath math={katex_A1}/>, the output force <InlineMath math={katex_F2}/> is magnified compared to the input force <InlineMath math={katex_F1}/>.
                         </p>
                    </section>

                     {/* Pressure vs Depth */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Variation of Pressure with Depth
                         </h2>
                         <p className="leading-relaxed">
                            Pressure within a fluid at rest increases with depth. This is because the fluid at a lower point must support the weight of the fluid above it. For a liquid of constant density (<InlineMath math={katex_rho}/>), the pressure (<InlineMath math={katex_P}/>) at a depth (<InlineMath math={katex_h}/>) below a point where the pressure is <InlineMath math={katex_P0}/> (often the surface pressure) is given by:
                         </p>
                         <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={katex_P_depth}/>
                         </div>
                         <p className="leading-relaxed">
                             Where <InlineMath math={katex_g}/> is the acceleration due to gravity. This equation shows a linear increase in pressure with depth.
                         </p>
                    </section>

                    {/* Atmospheric Pressure & Measurement */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Atmospheric Pressure & Measurement
                         </h2>
                         <p className="leading-relaxed">
                             We live at the bottom of an "ocean" of air. The weight of the air column above us creates <strong className="text-teal dark:text-teal font-semibold">atmospheric pressure</strong> (<InlineMath math={katex_P_atm_var}/>). This pressure decreases with increasing altitude.
                         </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Barometer</h3>
                         <p className="leading-relaxed">
                             A <strong className="text-teal dark:text-teal font-semibold">barometer</strong> measures atmospheric pressure. A simple mercury barometer consists of an inverted tube filled with mercury (<InlineMath math={'\\rho_{Hg}'}/>) standing in a pool of mercury. The atmosphere pushes down on the pool, supporting a column of mercury of height (<InlineMath math={katex_h}/>). The atmospheric pressure equals the pressure exerted by this column:
                         </p>
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={katex_P_atm_eq}/>
                         </div>
                         <p className="text-sm italic leading-relaxed text-gray-600 dark:text-gray-400">
                             Standard atmospheric pressure at sea level supports a mercury column of about 760 mm.
                         </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Manometer</h3>
                          <p className="leading-relaxed">
                             A <strong className="text-teal dark:text-teal font-semibold">manometer</strong> measures the pressure of a confined gas, typically by comparing it to atmospheric pressure using a U-shaped tube filled with a liquid (often mercury or water). The difference in liquid levels indicates the gauge pressure of the gas.
                          </p>
                    </section>
                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                     {/* Panel 1: Pascal's Principle Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="YsKeHRwpF1w" title="Video: Understanding Pascal's Principle"/>
                    </div>

                     {/* Panel 2: Hydraulic Lift Calculator */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-4 text-blue-700 dark:text-blue-300">Interactive Hydraulic Lift</h3>
                         <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Apply force F₁ to area A₁ and see the output force F₂ on area A₂.</p>
                         <InteractiveSlider label="Input Force (F₁)" unit="N" min={1} max={100} step={1} value={f1} onChange={setF1} formulaSymbol={katex_F1} />
                         <InteractiveSlider label="Input Area (A₁)" unit="m²" min={0.001} max={0.1} step={0.001} value={a1} onChange={setA1} formulaSymbol={katex_A1} />
                         <InteractiveSlider label="Output Area (A₂)" unit="m²" min={0.01} max={1.0} step={0.01} value={a2} onChange={setA2} formulaSymbol={katex_A2} />
                         <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded shadow-inner grid grid-cols-2 gap-2 text-center">
                              <p className="text-md font-semibold font-inter text-dark-gray dark:text-light-gray">
                                Pressure (<InlineMath math={katex_P}/>) = <span className="font-bold text-teal dark:text-mint">{isFinite(hydraulicPressure) ? hydraulicPressure.toFixed(0) : "N/A"}</span> Pa
                             </p>
                             <p className="text-md font-semibold font-inter text-dark-gray dark:text-light-gray">
                                Output Force (<InlineMath math={katex_F2}/>) = <span className="font-bold text-teal dark:text-mint">{isFinite(f2) ? f2.toFixed(0) : "N/A"}</span> N
                             </p>
                         </div>
                         <MiniCheckQuestion
                            question="In the hydraulic lift, if you double the output area (A₂) while keeping F₁ and A₁ constant, what happens to the output force (F₂)? "
                            correctAnswer="The output force (F₂) doubles."
                            explanation="F₂ = F₁ * (A₂/A₁). If A₂ doubles, F₂ also doubles."
                         />
                     </div>

                      {/* Panel 3: Pressure vs Depth Calculator */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-4 text-green-700 dark:text-green-300">Interactive Pressure vs. Depth</h3>
                         <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">See how pressure changes with depth, density, and surface pressure.</p>
                         <InteractiveSlider label="Surface Pressure (P₀)" unit="Pa" min={0} max={200000} step={1000} value={p0} onChange={setP0} formulaSymbol={katex_P0} />
                         <InteractiveSlider label="Fluid Density (ρ)" unit="kg/m³" min={100} max={15000} step={100} value={rho} onChange={setRho} formulaSymbol={katex_rho} logScale={true}/> {/* Log scale useful here */}
                          <InteractiveSlider label="Depth (h)" unit="m" min={0} max={100} step={0.5} value={h} onChange={setH} formulaSymbol={katex_h} />
                         <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 rounded shadow-inner text-center">
                              <p className="text-lg font-semibold font-inter text-dark-gray dark:text-light-gray">
                                Pressure at Depth (<InlineMath math={katex_P}/>) = <span className="font-bold text-teal dark:text-mint">{pressureAtDepth.toFixed(0)}</span> Pa
                             </p>
                         </div>
                         <MiniCheckQuestion
                            question="If you double the depth (h) in a liquid, how does the *gauge* pressure (P - P₀) change?"
                            correctAnswer="The gauge pressure doubles."
                            explanation="Gauge pressure is ρgh. If h doubles, the gauge pressure doubles."
                         />
                     </div>

                    {/* Panel 4: Atmospheric Pressure / Barometer Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="jmQ8e05RknI" title="Video: Atmospheric Pressure and Barometers" />
                     </div>

                      {/* Panel 5: PhET Simulation (Under Pressure) */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Under Pressure</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Experiment with fluid pressure, density, and depth.</p>
                        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                           <a href="https://phet.colorado.edu/sims/html/under-pressure/latest/under-pressure_en.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open PhET: Under Pressure (New Tab)</span>
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
                    Check Your Understanding!
                </button>
            </div>
        </main>

        {/* Quiz Modal */}
         {showQuiz && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Fluid Pressure Quiz</h2>
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

// Assign a display name for the component if linting requires it
FluidPressure.displayName = 'FluidPressure';

export default FluidPressure; // Ensure default export matches component name or file name convention

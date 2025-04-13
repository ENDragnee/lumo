'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, useMemo, ChangeEvent } from 'react';
import QuizQuestion from '@/components/QuizQuestion';
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

// --- Reusable Components (Styled as per previous examples) ---

// Slider Component
function InteractiveSlider({
    label, unit, min, max, step, value, onChange, formulaSymbol, logScale = false
}: InteractiveSliderProps) {
    const sliderValue = logScale ? Math.log10(value) : value;
    const minSlider = logScale ? Math.log10(min) : min;
    const maxSlider = logScale ? Math.log10(max) : max;
    // Adjust step for log scale if needed, e.g., 0.1 for powers of 10
    const stepSlider = logScale ? (maxSlider-minSlider)/100 : step;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const sliderVal = parseFloat(event.target.value);
        const actualValue = logScale ? Math.pow(10, sliderVal) : sliderVal;
        // Clamp value to min/max to avoid issues with Math.log10(0) or exceeding bounds
        const clampedValue = Math.max(min, Math.min(max, actualValue));
        onChange(clampedValue);
    };

    const displayValue = value <= 0 ? "N/A" : (value < 0.01 || value > 10000 ? value.toExponential(1) : value.toFixed(step < 0.1 ? 2 : (step < 1 ? 1 : 0)));
    const minDisplay = min <= 0 ? "N/A" : (min < 0.01 || min > 10000 ? min.toExponential(1) : min);
    const maxDisplay = max <= 0 ? "N/A" : (max < 0.01 || max > 10000 ? max.toExponential(1) : max);


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
        value={sliderValue} // Use the potentially log-transformed value for the slider's internal state
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
    <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md">
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
        "question": "What is the primary characteristic of atoms in solids?",
        "options": [
        "They move freely in all directions.",
        "They vibrate but stay fixed relative to their neighbors.",
        "They slide over each other easily.",
        "They are separated by large distances."
        ],
        "correctAnswer": 1,
        "hint": "Atoms in solids are held in equilibrium positions by forces like springs."
    },
    {
        "question": "What property of fluids does fluid statics study?",
        "options": [
        "Fluids in motion",
        "Fluids under shear stress",
        "Fluids at rest",
        "Compressibility of fluids"
        ],
        "correctAnswer": 2,
        "hint": "Fluid statics focuses on the behavior of fluids without relative motion."
    },
    {
        "question": "Which stress is present in a fluid at rest?",
        "options": [
        "Shear stress",
        "Normal stress", // Corrected conceptual option
        "Tangential stress",
        "Elastic stress"
        ],
        "correctAnswer": 1, // Index matches 'Normal stress'
        "hint": "The only stress present in fluid statics is related to pressure, which acts perpendicularly (normal)."
    },
    {
        "question": "What is the formula for pressure in terms of force and area?",
        "options": [
        "P = F × A",
        "P = F / A",
        "P = A / F",
        "P = F + A"
        ],
        "correctAnswer": 1,
        "hint": "Pressure is the ratio of force to contact area."
    },
    {
        "question": "What is the SI unit of pressure?",
        "options": [
        "Pascal (Pa)",
        "Newton (N)",
        "Joule (J)",
        "Atmosphere (atm)"
        ],
        "correctAnswer": 0,
        "hint": "This unit is equivalent to one newton per square meter."
    },
    {
        "question": "What happens to the balloon when more air particles are added?",
        "options": [
        "It shrinks.",
        "It collapses.",
        "It expands outward.",
        "It remains unchanged."
        ],
        "correctAnswer": 2,
        "hint": "Increased collisions with the balloon’s walls cause expansion."
    },
    {
        "question": "What is gauge pressure?",
        "options": [
        "Pressure relative to a vacuum",
        "Pressure measured relative to atmospheric pressure",
        "Pressure at the Earth's core",
        "Pressure inside a sealed container"
        ],
        "correctAnswer": 1,
        "hint": "This pressure is the difference between absolute and atmospheric pressure."
    },
    {
        "question": "What is the formula for gauge pressure?",
        "options": [
        "P_gauge = P_abs + P_atm",
        "P_gauge = P_abs - P_atm",
        "P_gauge = P_atm - P_abs",
        "P_gauge = P_abs × P_atm"
        ],
        "correctAnswer": 1,
        "hint": "Gauge pressure subtracts atmospheric pressure from absolute pressure."
    },
    {
        "question": "What is the formula for density?",
        "options": [
        "ρ = V / m",
        "ρ = m × V",
        "ρ = m / V",
        "ρ = V × m"
        ],
        "correctAnswer": 2,
        "hint": "Density is the ratio of mass to volume."
    },
    {
        "question": "Which substance has the highest density among the options?",
        "options": [
        "Air",
        "Gold",
        "Water",
        "Ice"
        ],
        "correctAnswer": 1,
        "hint": "This substance has a density of 19.3 x 10³ kg/m³."
    },
    {
        "question": "What is specific gravity?",
        "options": [
        "The weight of a substance per unit volume",
        "The ratio of a substance’s density to water’s density",
        "The absolute density of a substance",
        "The volume of a substance per unit mass"
        ],
        "correctAnswer": 1,
        "hint": "Specific gravity compares a substance's density to that of water."
    },
    {
        "question": "What is the value of the density of water at 4°C in kg/m³?",
        "options": [
        "100",
        "1000",
        "10,000",
        "0.001"
        ],
        "correctAnswer": 1,
        "hint": "Water's density is commonly used as a standard for specific gravity."
    },
    {
        "question": "What does the ideal gas equation relate?",
        "options": [
        "Pressure and temperature only",
        "Density and pressure of gases at a given temperature", // Clarified
        "Volume and temperature only",
        "Mass and volume of solids"
        ],
        "correctAnswer": 1,
        "hint": "This equation connects gas properties like pressure, density, and temperature (P = ρRT)."
    },
    {
        "question": "What is the value of 1 atmosphere (atm) in mmHg?",
        "options": [
        "760",
        "101.3",
        "1",
        "14.7"
        ],
        "correctAnswer": 0,
        "hint": "This is a commonly used equivalent for atmospheric pressure."
    },
    {
        "question": "Which of the following is true about atoms in gases?",
        "options": [
        "They are tightly packed together.",
        "They are in close contact but can slide over one another.",
        "They are separated by distances larger than the atoms themselves.",
        "They are fixed in equilibrium positions."
        ],
        "correctAnswer": 2,
        "hint": "Atoms in gases are free to move and are widely spaced apart."
    }
];

// --- KaTeX String Constants ---
// Define potentially problematic KaTeX strings as constants
const katex_F = 'F';
const katex_A = 'A';
const katex_P = 'P';
const katex_P_eq_F_over_A = 'P = \\frac{F}{A}';
const katex_Pa = '1\\,Pa = 1\\,N/m^2';
const katex_atm_relations = '1\\,atm \\approx 101.3\\,kPa \\approx 760\\,mmHg \\approx 760\\,torr \\approx 14.7\\,psi';
const katex_P_gauge_var = 'P_{gauge}';
const katex_P_abs_var = 'P_{abs}';
const katex_P_atm_var = 'P_{atm}';
const katex_P_gauge_eq = 'P_{gauge} = P_{abs} - P_{atm}';
const katex_rho = '\\rho';
const katex_m = 'm';
const katex_V = 'V';
const katex_rho_eq_m_over_V = '\\rho = \\frac{m}{V}';
const katex_rho_H2O_val = '\\rho_{H_2O} = 1000 \\text{ kg/m}^3';
const katex_SG_eq = 'SG = \\frac{\\rho}{\\rho_{H_2O}}';
const katex_R_specific = 'R_{specific}';
const katex_T = 'T';
const katex_IdealGasLaw = 'P = \\rho R_{specific} T';


// --- Main Page Component ---
const FluidMechanics = () => {
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [pressureForce, setPressureForce] = useState(100); // N
  const [pressureArea, setPressureArea] = useState(0.1); // m^2
  const [densityMass, setDensityMass] = useState(1); // kg - Use log scale starting point (10^0)
  const [densityVolume, setDensityVolume] = useState(0.001); // m^3 (1 Liter) - Use log scale starting point (10^-3)

  // --- Memoized Calculations ---
  const calculatedPressure = useMemo(() => {
    if (pressureArea <= 0) return Infinity;
    return (pressureForce / pressureArea);
  }, [pressureForce, pressureArea]);

  const calculatedDensity = useMemo(() => {
    if (densityVolume <= 0) return Infinity;
    return (densityMass / densityVolume);
  }, [densityMass, densityVolume]);

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
                Unit 3: Fluid Mechanics
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">
                    {/* Section 3.1 */}
                    <section>
                        <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            3.1 Properties of Solids, Liquids, and Gases
                        </h2>
                        {/* ... existing text content ... */}
                         <p className="leading-relaxed">
                            Matter exists in different phases, primarily solid, liquid, and gas, distinguished by the arrangement and interaction of their constituent atoms or molecules.
                        </p>
                        <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Solids</h3>
                        <p className="leading-relaxed">
                            Atoms in solids are tightly packed, often in a regular lattice structure. Strong intermolecular forces hold them in relatively fixed positions, allowing only vibrations around these points. This fixed structure gives solids definite shape and volume, making them resistant to compression and shear stress.
                        </p>
                        <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Liquids</h3>
                        <p className="leading-relaxed">
                           In liquids, atoms or molecules are still close together but have enough energy to move past one another. This allows liquids to flow and take the shape of their container, but maintains a definite volume. They strongly resist compression.
                        </p>
                        <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Gases</h3>
                         <p className="leading-relaxed">
                            Gas particles are far apart and move randomly at high speeds, colliding with each other and the container walls. Intermolecular forces are weak. Gases have no definite shape or volume, expanding to fill their container and being easily compressible.
                         </p>
                         <p className="text-sm italic mt-4 text-gray-600 dark:text-gray-400">
                            (Refer to Figure 3.1 for visual representations of atomic arrangements in solids, liquids, and gases.)
                         </p>
                    </section>

                    {/* Section 3.2 */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             3.2 Fluid Statics: Pressure
                         </h2>
                          {/* ... existing text content using constants ... */}
                         <p className="leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Fluid statics</strong> studies fluids at rest. No shear stress exists, only <strong className="text-teal dark:text-teal font-semibold">pressure</strong> acting normal (perpendicular) to surfaces.
                         </p>
                         <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Defining Pressure</h3>
                         <p className="leading-relaxed">
                            Pressure (<InlineMath math={katex_P} />) is normal force (<InlineMath math={katex_F} />) per unit area (<InlineMath math={katex_A} />):
                         </p>
                         <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={katex_P_eq_F_over_A} />
                         </div>
                         <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Units of Pressure</h3>
                         <p className="leading-relaxed">
                             SI unit: <strong className="text-teal dark:text-teal font-semibold">Pascal (Pa)</strong> (<InlineMath math={katex_Pa} />). Other units: atm, mmHg, torr, psi.
                         </p>
                         <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center text-sm'>
                             <BlockMath math={katex_atm_relations} />
                         </div>
                         <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Pressure in Gases</h3>
                         <p className="leading-relaxed">
                            Arises from countless collisions of gas particles with container walls. More particles or faster particles (higher temperature) mean more collisions and higher pressure.
                         </p>
                         <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Absolute vs. Gauge Pressure</h3>
                          <p className="leading-relaxed">
                             <strong className="text-teal dark:text-teal font-semibold">Absolute pressure</strong> (<InlineMath math={katex_P_abs_var} />) is relative to vacuum. <strong className="text-teal dark:text-teal font-semibold">Gauge pressure</strong> (<InlineMath math={katex_P_gauge_var} />) is relative to atmospheric pressure (<InlineMath math={katex_P_atm_var} />).
                         </p>
                         <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                            <BlockMath math={katex_P_gauge_eq} />
                         </div>
                    </section>

                     {/* Section 3.3 */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             3.3 Density and Specific Gravity
                         </h2>
                         {/* ... existing text content using constants ... */}
                         <p className="leading-relaxed">
                             <strong className="text-teal dark:text-teal font-semibold">Density</strong> (<InlineMath math={katex_rho} />) is mass (<InlineMath math={katex_m} />) per unit volume (<InlineMath math={katex_V} />).
                         </p>
                         <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={katex_rho_eq_m_over_V} />
                         </div>
                         <div className="my-4 overflow-x-auto">
                             <h4 className="text-lg font-semibold font-playfair mb-2">Example Densities (kg/m³)</h4>
                             {/* ... Density Table ... */}
                               <table className="min-w-full table-auto text-left text-sm font-inter">
                                 <thead className="bg-gray-100 dark:bg-gray-700">
                                 <tr>
                                     <th className="py-2 px-3 border border-gray-300 dark:border-gray-600">Substance</th>
                                     <th className="py-2 px-3 border border-gray-300 dark:border-gray-600">ρ</th>
                                     <th className="py-2 px-3 border border-gray-300 dark:border-gray-600">Substance</th>
                                     <th className="py-2 px-3 border border-gray-300 dark:border-gray-600">ρ</th>
                                 </tr>
                                 </thead>
                                 <tbody className="bg-white dark:bg-gray-800">
                                 <tr>
                                     <td className="py-1 px-3 border">Air</td><td className="py-1 px-3 border">1.29</td>
                                     <td className="py-1 px-3 border">Water (4°C)</td><td className="py-1 px-3 border">1.00 x 10³</td>
                                 </tr>
                                 <tr>
                                     <td className="py-1 px-3 border">Ice</td><td className="py-1 px-3 border">0.917 x 10³</td>
                                      <td className="py-1 px-3 border">Aluminum</td><td className="py-1 px-3 border">2.70 x 10³</td>
                                 </tr>
                                  <tr>
                                     <td className="py-1 px-3 border">Iron</td><td className="py-1 px-3 border">7.86 x 10³</td>
                                     <td className="py-1 px-3 border">Mercury</td><td className="py-1 px-3 border">13.6 x 10³</td>
                                 </tr>
                                  <tr>
                                     <td className="py-1 px-3 border">Gold</td><td className="py-1 px-3 border">19.3 x 10³</td>
                                     <td className="py-1 px-3 border"></td><td className="py-1 px-3 border"></td>
                                 </tr>
                                 </tbody>
                             </table>
                         </div>
                         <h3 className="text-xl font-semibold font-playfair mt-6 mb-2">Specific Gravity</h3>
                         <p className="leading-relaxed">
                             <strong className="text-teal dark:text-teal font-semibold">Specific Gravity (SG)</strong> is the ratio of a substance's density (<InlineMath math={katex_rho} />) to water's density (<InlineMath math={katex_rho_H2O_val} />).
                         </p>
                         <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={katex_SG_eq} />
                         </div>
                          {/* SG Table can be added here if needed */}
                    </section>

                     {/* Section 3.4 */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             3.4 The Ideal Gas Equation
                         </h2>
                          {/* ... existing text content using constants ... */}
                         <p className="leading-relaxed">
                             For gases, pressure (<InlineMath math={katex_P}/>), density (<InlineMath math={katex_rho}/>), and absolute temperature (<InlineMath math={katex_T}/>) are often related by the <strong className="text-teal dark:text-teal font-semibold">Ideal Gas Law</strong> using the specific gas constant (<InlineMath math={katex_R_specific}/>):
                         </p>
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                              <BlockMath math={katex_IdealGasLaw} />
                         </div>
                     </section>
                </article>

                {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                    {/* Panel 1 */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="wclj3jWZ15E" title="Video: Solids, Liquids, and Gases Explained" />
                    </div>
                    {/* Panel 2 */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-4 text-blue-700 dark:text-blue-300">Interactive Pressure Calculator (<InlineMath math={katex_P_eq_F_over_A} />)</h3>
                         <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Adjust force and area.</p>
                         <InteractiveSlider label="Force (F)" unit="N" min={10} max={1000} step={10} value={pressureForce} onChange={setPressureForce} formulaSymbol={katex_F} />
                         <InteractiveSlider label="Area (A)" unit="m²" min={0.01} max={1.0} step={0.01} value={pressureArea} onChange={setPressureArea} formulaSymbol={katex_A} />
                         <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded shadow-inner text-center">
                             <p className="text-lg font-semibold font-inter text-dark-gray dark:text-light-gray">
                               Calculated Pressure (<InlineMath math={katex_P} />) = <span className="font-bold text-teal dark:text-mint">{isFinite(calculatedPressure) ? calculatedPressure.toFixed(0) : "Infinity"}</span> Pa
                             </p>
                         </div>
                          <MiniCheckQuestion question="Same force, smaller area: what happens to pressure?" correctAnswer="Pressure increases." explanation="P = F/A. Smaller A means larger P for the same F." />
                     </div>
                     {/* Panel 3 */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="tWHFrIAii4Y" title="Video: Understanding Pressure in Fluids" />
                     </div>
                     {/* Panel 4 */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-4 text-green-700 dark:text-green-300">Interactive Density Calculator (<InlineMath math={katex_rho_eq_m_over_V} />)</h3>
                          <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Adjust mass (log scale) and volume (log scale).</p>
                          <InteractiveSlider label="Mass (m)" unit="kg" min={0.1} max={100} step={0.1} value={densityMass} onChange={setDensityMass} formulaSymbol={katex_m} logScale={true} />
                          <InteractiveSlider label="Volume (V)" unit="m³" min={0.0001} max={0.1} step={0.0001} value={densityVolume} onChange={setDensityVolume} formulaSymbol={katex_V} logScale={true} />
                          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 rounded shadow-inner text-center">
                              <p className="text-lg font-semibold font-inter text-dark-gray dark:text-light-gray">
                                Calculated Density (<InlineMath math={katex_rho} />) = <span className="font-bold text-teal dark:text-mint">{isFinite(calculatedDensity) ? calculatedDensity.toFixed(1) : "Infinity"}</span> kg/m³
                              </p>
                          </div>
                           <MiniCheckQuestion question="Same volume, more mass: higher or lower density?" correctAnswer="Higher density." explanation="ρ = m/V. If V is constant, larger m means larger ρ." />
                     </div>
                     {/* Panel 5 */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="fWhHAcHWIsY" title="Video: Understanding Density" />
                     </div>
                     {/* Panel 6 */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Under Pressure</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Explore pressure vs. depth and density.</p>
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
                    Test Your Knowledge!
                </button>
            </div>
        </main>

        {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Fluid Properties Quiz</h2>
                 <div className="space-y-6 font-inter">
                  {quizQuestions.map((q, index) => (
                    <QuizQuestion
                      key={index}
                      // questionNumber={index + 1} // Uncomment if needed and supported
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
};

export default FluidMechanics;
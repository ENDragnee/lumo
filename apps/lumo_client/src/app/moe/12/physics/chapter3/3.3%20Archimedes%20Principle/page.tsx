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
    const sliderValue = logScale ? Math.log10(value) : value;
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
    // ... (quiz questions array remains unchanged)
    {
    "question": "What is the force called that acts upward on an object submerged in a fluid?",
    "options": [
      "Gravitational force",
      "Tensional force",
      "Buoyant force",
      "Centripetal force"
    ],
    "correctAnswer": 2,
    "hint": "This force is also known as up-thrust force."
  },
  {
    "question": "According to Archimedes' Principle, the buoyant force on an object is equal to:",
    "options": [
      "The weight of the object",
      "The weight of the fluid displaced by the object",
      "The volume of the object",
      "The pressure difference in the fluid"
    ],
    "correctAnswer": 1,
    "hint": "This principle relates buoyant force to the displaced fluid."
  },
  {
    "question": "What is the formula for the buoyant force on a submerged object?",
    "options": [
      "F_B = P_1 A",
      "F_B = \\rho_{fluid} g V_{disp}",
      "F_B = \\rho_{obj} g V_{disp}",
      "F_B = \\rho_{fluid} g h A"
    ],
    "correctAnswer": 1,
    "hint": "It relates the force to fluid density and displaced volume."
  },
  {
    "question": "When an object is fully submerged in a fluid, the volume of the displaced fluid is equal to:",
    "options": [
      "The mass of the object",
      "The weight of the object",
      "The volume of the object",
      "The density of the object"
    ],
    "correctAnswer": 2,
    "hint": "This is a fundamental property of displacement."
  },
  {
    "question": "What happens to an object if its density is less than the density of the fluid?",
    "options": [
      "It sinks",
      "It remains stationary",
      "It experiences a net upward force and rises",
      "It creates a vacuum"
    ],
    "correctAnswer": 2,
    "hint": "Objects less dense than the fluid experience a net upward force."
  },
  {
    "question": "For a floating object, the fraction of its volume submerged is equal to:",
    "options": [
      "The ratio of its weight to the weight of the fluid",
      "The ratio of its density to the density of the fluid",
      "The ratio of its volume to the volume of the fluid",
      "The ratio of the fluid's weight to the object's weight"
    ],
    "correctAnswer": 1,
    "hint": "This ratio explains why objects float partially submerged."
  },
  {
    "question": "What equation relates the densities of a floating object and the fluid to the submerged volume?",
    "options": [
      "\\rho_{fluid} g = \\rho_{obj} g",
      "\\frac{V_{disp}}{V_{obj}} = \\frac{\\rho_{obj}}{\\rho_{fluid}}",
      "F_B = \\rho_{fluid} g V_{obj}",
      "\\rho_{fluid} V_{disp} = \\rho_{obj} V_{obj}"
    ],
    "correctAnswer": 1,
    "hint": "This equation connects submerged volume with the density ratio."
  },
  {
    "question": "What determines whether an object sinks, floats, or remains in equilibrium in a fluid?",
    "options": [
      "The shape of the object",
      "The density of the object compared to the fluid",
      "The weight of the fluid",
      "The gravitational constant"
    ],
    "correctAnswer": 1,
    "hint": "It depends on the relative densities of the object and fluid."
  }
];

// --- KaTeX String Constants ---
const katex_FB = 'F_B';
const katex_W_fluid = 'W_{fluid}';
const katex_FB_eq_Wfluid = 'F_B = W_{fluid}';
const katex_P1 = 'P_1';
const katex_P2 = 'P_2';
const katex_rho_fluid = '\\rho_{fluid}';
const katex_g = 'g';
const katex_h = 'h';
const katex_A = 'A';
const katex_V_disp = 'V_{disp}';
const katex_V_obj = 'V_{obj}';
const katex_FB_derivation = 'F_B = P_2 A - P_1 A = (P_2 - P_1) A = (\\rho_{fluid} g h) A';
const katex_FB_eq_rho_g_Vdisp = 'F_B = \\rho_{fluid} g V_{disp}';
const katex_FB_eq_rho_g_Vobj = 'F_B = \\rho_{fluid} g V_{obj}';
const katex_M = 'M';
const katex_rho_obj = '\\rho_{obj}';
const katex_Fg = 'F_g';
const katex_Fg_eq = 'F_g = M g = \\rho_{obj} g V_{obj}';
const katex_NetForce_Submerged = 'F_{net} = F_B - F_g = (\\rho_{fluid} - \\rho_{obj}) g V_{obj}';
const katex_Floating_Equilibrium = '\\rho_{fluid} g V_{disp} = \\rho_{obj} g V_{obj}';
const katex_Submerged_Fraction = '\\frac{V_{disp}}{V_{obj}} = \\frac{\\rho_{obj}}{\\rho_{fluid}}';


// --- Main Page Component ---
const ArchimedesPrinciple = () => {
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Buoyant Force Calculator State
  const [fluidDensityFB, setFluidDensityFB] = useState(1000); // kg/m^3 (Water)
  const [displacedVolumeFB, setDisplacedVolumeFB] = useState(0.001); // m^3 (1 Liter)

  // Floating Object Calculator State
  const [objectDensityFloat, setObjectDensityFloat] = useState(700); // kg/m^3 (e.g., Wood)
  const [fluidDensityFloat, setFluidDensityFloat] = useState(1000); // kg/m^3 (Water)

  const GRAVITY = 9.81; // m/s^2

  // --- Memoized Calculations ---
  const calculatedBuoyantForce = useMemo(() => {
    return fluidDensityFB * GRAVITY * displacedVolumeFB;
  }, [fluidDensityFB, displacedVolumeFB]);

  const submergedFraction = useMemo(() => {
    if (fluidDensityFloat <= 0) return NaN; // Avoid division by zero
    const fraction = objectDensityFloat / fluidDensityFloat;
    // Fraction can't be > 1 (object sinks if denser), and density can't be negative
    return Math.max(0, Math.min(1, fraction));
  }, [objectDensityFloat, fluidDensityFloat]);

  const floatStatus = useMemo(() => {
      if (fluidDensityFloat <= 0) return "Invalid fluid density";
      const ratio = objectDensityFloat / fluidDensityFloat;
      if (ratio < 1) return `Floats (${(submergedFraction * 100).toFixed(0)}% submerged)`;
      if (ratio === 1) return "Neutrally buoyant (Suspended)";
      return "Sinks";
  },[objectDensityFloat, fluidDensityFloat, submergedFraction])

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
            {/* Page Title */}
            <h1 className="text-4xl lg:text-5xl font-bold font-playfair mb-8 lg:mb-12 text-center">
                3.3 Archimedes' Principle and Buoyancy
            </h1>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                 {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">
                    {/* Archimedes' Principle Section */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Archimedes' Principle: The Buoyant Force
                         </h2>
                         <p className="leading-relaxed">
                             Ever tried pushing a beach ball underwater? It's hard because the water pushes back up! This upward force exerted by a fluid on an immersed object is called the <strong className="text-teal dark:text-teal font-semibold">buoyant force</strong> (<InlineMath math={katex_FB}/>), sometimes called upthrust.
                         </p>
                         <p className="mt-3 leading-relaxed">
                             This force arises because fluid pressure increases with depth. The pressure pushing up on the bottom of a submerged object is greater than the pressure pushing down on its top, resulting in a net upward force.
                         </p>
                         <p className="mt-3 leading-relaxed">
                             The magnitude of this force was famously described by Archimedes:
                         </p>
                         <blockquote className="mt-3 pl-4 italic border-l-4 border-teal dark:border-mint text-dark-gray dark:text-light-gray">
                             "The buoyant force on an object immersed in a fluid is equal to the weight of the fluid displaced by the object."
                         </blockquote>
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={katex_FB_eq_Wfluid}/>
                         </div>
                    </section>

                    {/* Derivation/Explanation Section */}
                     <section>
                          <h3 className="text-2xl font-semibold font-playfair mt-6 mb-3">Deriving the Buoyant Force</h3>
                         <p className="leading-relaxed">
                            Consider a simple cylinder submerged in a fluid of density <InlineMath math={katex_rho_fluid}/>. The pressure at the bottom (<InlineMath math={katex_P2}/>) is higher than at the top (<InlineMath math={katex_P1}/>) by <InlineMath math={`${katex_rho_fluid} ${katex_g} ${katex_h}`}/>, where <InlineMath math={katex_h}/> is the cylinder's height.
                         </p>
                         <p className="mt-3 leading-relaxed">
                            The upward force on the bottom is <InlineMath math={`${katex_P2} ${katex_A}`}/>, and the downward force on the top is <InlineMath math={`${katex_P1} ${katex_A}`}/> (where <InlineMath math={katex_A}/> is the area). The net buoyant force is their difference:
                         </p>
                         <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={katex_FB_derivation}/>
                         </div>
                         <p className="leading-relaxed">
                            Since the volume of the cylinder (and the displaced fluid) is <InlineMath math={`${katex_V_disp} = ${katex_A} ${katex_h}`}/>, this simplifies to the standard buoyant force equation:
                         </p>
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={katex_FB_eq_rho_g_Vdisp}/>
                         </div>
                         <p className="leading-relaxed">
                            Buoyant force depends on the <strong className="text-teal dark:text-teal font-semibold">density of the fluid</strong> and the <strong className="text-teal dark:text-teal font-semibold">volume of fluid displaced</strong> by the object.
                         </p>
                    </section>

                    {/* Totally Submerged Object Section */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Totally Submerged Objects: Sink or Float?
                         </h2>
                         <p className="leading-relaxed">
                             When an object is fully underwater, the volume of displaced fluid (<InlineMath math={katex_V_disp}/>) equals the object's total volume (<InlineMath math={katex_V_obj}/>). The buoyant force is then <InlineMath math={katex_FB_eq_rho_g_Vobj}/>.
                         </p>
                         <p className="mt-3 leading-relaxed">
                             The object's weight is <InlineMath math={katex_Fg_eq}/>. The net force acting on the object is the difference between buoyancy and weight:
                         </p>
                         <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={katex_NetForce_Submerged}/>
                         </div>
                          <ul className="list-disc list-inside ml-4 space-y-1 mt-3">
                              <li>If <InlineMath math={`${katex_rho_fluid} > ${katex_rho_obj}`}/>: Net force is upward <span className="text-green-600 dark:text-mint font-semibold">(Object rises/floats)</span>.</li>
                              <li>If <InlineMath math={`${katex_rho_fluid} < ${katex_rho_obj}`}/>: Net force is downward <span className="text-red-600 dark:text-coral font-semibold">(Object sinks)</span>.</li>
                              <li>If <InlineMath math={`${katex_rho_fluid} = ${katex_rho_obj}`}/>: Net force is zero <span className="text-gray-600 dark:text-gray-400 font-semibold">(Object is neutrally buoyant/suspended)</span>.</li>
                          </ul>
                    </section>

                     {/* Floating Object Section */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Floating Objects
                         </h2>
                         <p className="leading-relaxed">
                             An object floats when its weight (<InlineMath math={katex_Fg}/>) is exactly balanced by the buoyant force (<InlineMath math={katex_FB}/>) acting on the *submerged part* of its volume (<InlineMath math={katex_V_disp}/>).
                         </p>
                          <p className="mt-3 leading-relaxed">
                              At equilibrium (<InlineMath math={`${katex_FB} = ${katex_Fg}`}/>):
                          </p>
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={katex_Floating_Equilibrium}/>
                         </div>
                         <p className="leading-relaxed">
                             Rearranging this gives the relationship between the fraction of the object's volume that is submerged and the densities:
                         </p>
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={katex_Submerged_Fraction}/>
                         </div>
                          <p className="leading-relaxed">
                             This shows that the fraction submerged equals the ratio of the object's density to the fluid's density. An iceberg (<InlineMath math={`${katex_rho_obj} \\approx 917`}/> kg/m³) floats in seawater (<InlineMath math={`${katex_rho_fluid} \\approx 1025`}/> kg/m³) with about 917/1025 ≈ 89% of its volume submerged.
                          </p>
                    </section>

                </article>

                 {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                    {/* Panel 1: Archimedes Principle Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="1jwqQfCPxQg" title="Video: Archimedes' Principle Explained"/>
                    </div>

                     {/* Panel 2: Buoyant Force Calculator */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-4 text-blue-700 dark:text-blue-300">Interactive Buoyant Force Calculator</h3>
                         <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Calculate <InlineMath math={katex_FB_eq_rho_g_Vdisp}/>.</p>
                         <InteractiveSlider label="Fluid Density (ρ_fluid)" unit="kg/m³" min={1} max={20000} step={10} value={fluidDensityFB} onChange={setFluidDensityFB} formulaSymbol={katex_rho_fluid} logScale={true} />
                         <InteractiveSlider label="Displaced Volume (V_disp)" unit="m³" min={0.0001} max={1} step={0.0001} value={displacedVolumeFB} onChange={setDisplacedVolumeFB} formulaSymbol={katex_V_disp} logScale={true}/>
                         <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded shadow-inner text-center">
                              <p className="text-lg font-semibold font-inter text-dark-gray dark:text-light-gray">
                                Buoyant Force (<InlineMath math={katex_FB}/>) = <span className="font-bold text-teal dark:text-mint">{calculatedBuoyantForce.toFixed(1)}</span> N
                             </p>
                         </div>
                         <MiniCheckQuestion
                            question="If you double the density of the fluid, what happens to the buoyant force on a fully submerged object?"
                            correctAnswer="The buoyant force doubles."
                            explanation="F_B = ρ_fluid * g * V_disp. If ρ_fluid doubles (and V_disp stays the same), F_B doubles."
                        />
                    </div>

                     {/* Panel 3: Floating Object Calculator */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-4 text-green-700 dark:text-green-300">Interactive Floating Object Calculator</h3>
                         <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Compare densities to see if an object floats and how much is submerged.</p>
                         <InteractiveSlider label="Object Density (ρ_obj)" unit="kg/m³" min={100} max={15000} step={10} value={objectDensityFloat} onChange={setObjectDensityFloat} formulaSymbol={katex_rho_obj} logScale={true} />
                         <InteractiveSlider label="Fluid Density (ρ_fluid)" unit="kg/m³" min={100} max={15000} step={10} value={fluidDensityFloat} onChange={setFluidDensityFloat} formulaSymbol={katex_rho_fluid} logScale={true} />
                         <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 rounded shadow-inner text-center">
                              <p className="text-md font-semibold font-inter text-dark-gray dark:text-light-gray">
                                Density Ratio (<InlineMath math={`${katex_rho_obj}/${katex_rho_fluid}`}/>) = <span className="font-bold text-teal dark:text-mint">{isFinite(submergedFraction) ? submergedFraction.toFixed(3) : "N/A"}</span>
                             </p>
                             <p className="mt-1 text-lg font-semibold font-inter text-dark-gray dark:text-light-gray">
                                Status: <span className="font-bold text-teal dark:text-mint">{floatStatus}</span>
                             </p>
                         </div>
                          <MiniCheckQuestion
                            question="An object floats in water (ρ ≈ 1000 kg/m³) with exactly half its volume submerged. What is the object's approximate density?"
                            correctAnswer="≈ 500 kg/m³"
                            explanation="The fraction submerged (0.5) equals the ratio ρ_obj / ρ_fluid. So, ρ_obj = 0.5 * ρ_fluid = 0.5 * 1000 = 500 kg/m³."
                        />
                    </div>

                     {/* Panel 4: Buoyancy Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="eQsmq3Hu9HA" title="Video: Buoyancy and Why Things Float/Sink" />
                    </div>

                    {/* Panel 5: GeoGebra Simulation */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Buoyancy Simulation</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Experiment with different objects and fluids in this GeoGebra simulation.</p>
                        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-gray-200"> {/* Light background for iframe */}
                            <iframe
                            scrolling="no"
                            title="Archimedes Principle GeoGebra Simulation"
                            src="https://www.geogebra.org/material/iframe/id/h9axp7xb/width/700/height/450/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/rc/false/ld/false/sdz/true/sri/false/ctl/false" // Found a different one, original might be broken
                            className='absolute top-0 left-0 w-full h-full'
                            allowFullScreen>
                                <p className="text-dark-gray dark:text-light-gray text-center pt-10">Loading GeoGebra Simulation...</p>
                            </iframe>
                        </div>
                    </div>

                     {/* Panel 6: PhET Buoyancy Link */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore Further: PhET Buoyancy</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Another great simulation for exploring buoyancy concepts.</p>
                        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                           <a href="https://phet.colorado.edu/sims/html/buoyancy/latest/buoyancy_en.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open PhET: Buoyancy (New Tab)</span>
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
                    Test Your Buoyancy Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Archimedes & Buoyancy Quiz</h2>
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
ArchimedesPrinciple.displayName = 'ArchimedesPrinciple';

export default ArchimedesPrinciple;
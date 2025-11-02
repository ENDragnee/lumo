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
    "question": "What causes fluid flow?",
    "options": [
      "Differences in temperature",
      "Differences in pressure",
      "Differences in mass",
      "Differences in density"
    ],
    "correctAnswer": 1,
    "hint": "Fluid flow is driven by pressure differences within the fluid."
  },
  {
    "question": "What is steady fluid flow characterized by?",
    "options": [
      "Random particle movement",
      "Velocity being constant at any given point over time", // More precise
      "Irregular paths of particles",
      "Crossing paths of particles"
    ],
    "correctAnswer": 1,
    "hint": "In steady flow, the velocity vector at any point remains constant."
  },
  {
    "question": "What happens to fluid flow above a certain critical speed?",
    "options": [
      "It becomes laminar",
      "It remains steady",
      "It becomes turbulent",
      "It stops completely"
    ],
    "correctAnswer": 2,
    "hint": "When velocity increases, flow becomes irregular and chaotic."
  },
  {
    "question": "What is viscosity in a fluid?",
    "options": [
      "External pressure force",
      "Internal frictional force between layers", // Clarified
      "Gravitational attraction",
      "Electromagnetic interaction"
    ],
    "correctAnswer": 1,
    "hint": "Viscosity represents resistance to flow due to internal friction."
  },
  {
    "question": "What is a streamline in a steady fluid flow?",
    "options": [
      "A random path of particles",
      "The surface of a fluid's waves",
      "An imaginary line tangent to the velocity vector at every point", // More precise
      "A turbulent area where particles cross each other"
    ],
    "correctAnswer": 2,
    "hint": "In steady flow, particles follow streamlines, and velocity is tangent to them."
  },
  {
    "question": "What is the equation for volumetric flow rate Q?", // Specified volumetric
    "options": [
      "Q = Volume / time (V/t)", // Option combining symbols and words
      "Q = Pressure × Area (P × A)",
      "Q = Density × Gravity × Volume (ρgV)",
      "Q = Speed × Area (v × A)" // Added common alternative
    ],
    "correctAnswer": 0, // Index for V/t
    "hint": "Flow rate is the volume of fluid passing a point per unit time. It can also be Av."
  },
  {
    "question": "What is the equation of continuity for an incompressible fluid?",
    "options": [
      "A₁ v₁ = A₂ v₂",
      "P₁ = P₂",
      "F_B = ρ V g", // Corrected buoyancy force
      "ρ v = constant"
    ],
    "correctAnswer": 0, // Correct index for A₁v₁ = A₂v₂
    "hint": "This equation states that the volume flow rate (Av) remains constant."
  },
  {
    "question": "What does Bernoulli’s principle (for horizontal flow) state about fluid speed and pressure?", // Specified horizontal
    "options": [
      "As speed increases, pressure increases",
      "As speed decreases, pressure decreases",
      "As speed increases, pressure decreases",
      "Speed and pressure remain constant"
    ],
    "correctAnswer": 2,
    "hint": "Where the fluid moves faster, the pressure is lower (ignoring height changes)."
  },
  {
    "question": "Which type of flow is characterized by smooth, parallel layers where particles do not cross streamlines?", // Clarified
    "options": [
      "Laminar flow",
      "Turbulent flow",
      "Chaotic flow",
      "Vertical flow"
    ],
    "correctAnswer": 0, // Correct index for Laminar flow
    "hint": "Laminar flow is orderly and occurs at lower velocities."
  },
  {
    "question": "According to Bernoulli's equation (P + ½ρv² + ρgh = constant), if fluid speed (v) increases while height (h) stays constant, what must happen to pressure (P)?", // More specific question
    "options": [
      "Pressure (P) must increase",
      "Pressure (P) must decrease",
      "Pressure (P) remains constant",
      "Cannot be determined without density"
    ],
    "correctAnswer": 1,
    "hint": "To keep the sum constant, if the kinetic energy term (½ρv²) increases, the pressure term (P) must decrease."
  }
];

// --- KaTeX String Constants ---
const katex_Q = 'Q';
const katex_V = 'V';
const katex_t = 't';
const katex_Q_eq_V_t = 'Q = \\frac{V}{t}';
const katex_m3s = 'm^3/s';
const katex_A1 = 'A_1';
const katex_v1 = 'v_1';
const katex_A2 = 'A_2';
const katex_v2 = 'v_2';
const katex_Q1 = 'Q_1';
const katex_Q2 = 'Q_2';
const katex_Continuity = 'Q_1 = Q_2 \\quad \\implies \\quad A_1 v_1 = A_2 v_2';
const katex_P = 'P';
const katex_rho = '\\rho';
const katex_v = 'v';
const katex_g = 'g';
const katex_h = 'h';
const katex_Bernoulli = 'P + \\frac{1}{2} \\rho v^2 + \\rho g h = \\text{constant}';
const katex_A = 'A'; // Added for continuity calculator

// --- Main Page Component ---
const FluidFlow = () => { // Renamed component
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Continuity Equation State
  const [area1, setArea1] = useState(0.02); // m^2
  const [velocity1, setVelocity1] = useState(1.0); // m/s
  const [area2, setArea2] = useState(0.01); // m^2

   // Bernoulli (Simplified horizontal) State - Assuming water density
   const RHO_WATER = 1000; // kg/m^3
   const [pressure1, setPressure1] = useState(110000); // Pa (~ slightly above 1 atm)
   const [speed1, setSpeed1] = useState(2.0); // m/s
   const [speed2, setSpeed2] = useState(4.0); // m/s


  // --- Memoized Calculations ---
  const flowRate = useMemo(() => area1 * velocity1, [area1, velocity1]);

  const velocity2 = useMemo(() => {
      if (area2 <= 0) return Infinity;
      return flowRate / area2; // v2 = Q / A2 = (A1*v1) / A2
  }, [flowRate, area2]);

  const bernoulliConstant = useMemo(() => {
    // Calculate for point 1 (assuming h=0 for simplicity or reference)
    return pressure1 + 0.5 * RHO_WATER * Math.pow(speed1, 2);
  }, [pressure1, speed1]);

  const pressure2 = useMemo(() => {
      // Calculate P2 using the constant from point 1 (assuming h=0)
      const p2 = bernoulliConstant - 0.5 * RHO_WATER * Math.pow(speed2, 2);
      return Math.max(0, p2); // Pressure cannot be negative in this simple model
  }, [bernoulliConstant, speed2]);


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
                3.4 Fluid Flow
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction to Fluid Flow */}
                    <section>
                         <p className="leading-relaxed">
                            Fluids (liquids and gases) move in response to pressure differences, flowing from regions of higher pressure to lower pressure. Think of wind – air moving between high and low-pressure atmospheric systems.
                         </p>
                    </section>

                    {/* Types of Flow */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Types of Fluid Flow
                         </h2>
                         <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Steady (Laminar) Flow</h3>
                         <p className="leading-relaxed">
                             In <strong className="text-teal dark:text-teal font-semibold">steady</strong> or <strong className="text-teal dark:text-teal font-semibold">laminar flow</strong>, fluid particles move along smooth, predictable paths called <strong className="text-teal dark:text-teal font-semibold">streamlines</strong>. Streamlines do not cross each other. The velocity of the fluid at any given point remains constant over time. This typically occurs at lower speeds and in narrower pipes.
                         </p>
                         <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Turbulent Flow</h3>
                          <p className="leading-relaxed">
                             Above a certain critical speed, the flow becomes <strong className="text-coral dark:text-gold font-semibold">turbulent</strong>. This flow is chaotic and irregular, characterized by swirling eddies and mixing between layers. Particle paths are unpredictable and cross each other. Turbulence often occurs at higher speeds or in wider pipes.
                         </p>
                    </section>

                     {/* Viscosity */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Viscosity
                         </h2>
                          <p className="leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Viscosity</strong> is essentially fluid friction. It's the internal resistance to flow that arises when adjacent layers of fluid move at different speeds relative to each other. More viscous fluids (like honey) flow less easily than less viscous fluids (like water). Viscosity converts some of the fluid's kinetic energy into internal (thermal) energy.
                         </p>
                    </section>

                     {/* Streamlines and Flow Rate */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Streamlines and Flow Rate
                         </h2>
                         <p className="leading-relaxed">
                             As mentioned, the path of a particle in steady flow is a streamline. Velocity is always tangent to the streamline. A bundle of streamlines forms a <strong className="text-teal dark:text-teal font-semibold">tube of flow</strong>. In laminar flow, fluid doesn't cross the boundaries of a flow tube.
                         </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Flow Rate (Q)</h3>
                         <p className="leading-relaxed">
                             Volumetric Flow Rate (<InlineMath math={katex_Q}/>) measures the volume (<InlineMath math={katex_V}/>) of fluid passing a point per unit time (<InlineMath math={katex_t}/>).
                         </p>
                         <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                            <BlockMath math={katex_Q_eq_V_t}/>
                         </div>
                          <p className="leading-relaxed">
                             The SI unit is <InlineMath math={katex_m3s}/>. Alternatively, if the fluid has speed <InlineMath math={katex_v}/> through an area <InlineMath math={katex_A}/> perpendicular to the flow, then <InlineMath math={'Q = Av'}/>.
                         </p>
                    </section>

                    {/* Equation of Continuity */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Equation of Continuity
                         </h2>
                          <p className="leading-relaxed">
                             For an <strong className="text-teal dark:text-teal font-semibold">incompressible fluid</strong> (density is constant) flowing steadily through a pipe with varying cross-sectional area, the volume flow rate (<InlineMath math={katex_Q}/>) must be the same everywhere along the pipe. This is the principle of conservation of mass for fluids.
                          </p>
                          <p className="mt-3 leading-relaxed">
                             If the area changes from <InlineMath math={katex_A1}/> to <InlineMath math={katex_A2}/>, the speed must change from <InlineMath math={katex_v1}/> to <InlineMath math={katex_v2}/> such that:
                          </p>
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={katex_Continuity}/>
                          </div>
                          <p className="leading-relaxed">
                             This means where the pipe narrows (<InlineMath math={katex_A}/> decreases), the fluid speed (<InlineMath math={katex_v}/>) must increase to maintain constant flow rate.
                          </p>
                    </section>

                    {/* Bernoulli's Principle */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Bernoulli's Principle
                         </h2>
                         <p className="leading-relaxed">
                            Developed by Daniel Bernoulli, this principle relates pressure, speed, and height for a fluid in steady, non-viscous, incompressible flow. It's essentially a statement of conservation of energy for fluids. The full equation is:
                         </p>
                         <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math={katex_Bernoulli}/>
                         </div>
                          <p className="leading-relaxed">
                             A key consequence, especially for horizontal flow (<InlineMath math={'h = \\text{constant}'}/>), is that where the fluid speed (<InlineMath math={katex_v}/>) is higher, the pressure (<InlineMath math={katex_P}/>) is lower, and vice versa. The terms represent pressure energy (<InlineMath math={katex_P}/>), kinetic energy per unit volume (<InlineMath math={'\\frac{1}{2} \\rho v^2'}/>), and potential energy per unit volume (<InlineMath math={'\\rho g h'}/>).
                          </p>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Applications</h3>
                           <p className="leading-relaxed">
                               Bernoulli's principle explains lift on airplane wings, curveballs, atomizers, and even blood flow dynamics. Faster-moving air over a wing creates lower pressure, resulting in lift. Faster blood flow in constricted arteries leads to lower pressure there.
                           </p>
                     </section>

                </article>

                 {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                     {/* Panel 1: Flow Types Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="KpOIP2Nw4bI" title="Video: Laminar vs. Turbulent Flow"/>
                     </div>

                     {/* Panel 2: PhET Fluid Pressure and Flow */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Fluid Pressure and Flow</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Visualize pressure, flow rate, and density.</p>
                        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                           <a href="https://phet.colorado.edu/sims/cheerpj/fluid-pressure-and-flow/latest/fluid-pressure-and-flow.html?simulation=fluid-pressure-and-flow" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open PhET: Fluid Pressure and Flow (New Tab)</span>
                            </a>
                             {/* If direct embedding works:
                             <iframe src="https://phet.colorado.edu/sims/cheerpj/fluid-pressure-and-flow/latest/fluid-pressure-and-flow.html?simulation=fluid-pressure-and-flow"
                                className='absolute top-0 left-0 w-full h-full' allowFullScreen title="PhET Fluid Pressure and Flow">
                                <p className="text-light-gray text-center pt-10">Loading Simulation...</p>
                             </iframe> */}
                        </div>
                         <MiniCheckQuestion
                            question="If fluid flows from a wide pipe section into a narrow section, what happens to its speed?"
                            correctAnswer="The speed increases."
                            explanation="The Equation of Continuity (A₁v₁ = A₂v₂) requires speed to increase when area decreases to maintain constant flow rate."
                         />
                     </div>

                      {/* Panel 3: Continuity Equation Calculator */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-4 text-blue-700 dark:text-blue-300">Interactive Continuity (<InlineMath math={'A_1 v_1 = A_2 v_2'}/>)</h3>
                          <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Adjust areas and initial speed to see how final speed changes.</p>
                           <InteractiveSlider label="Area 1 (A₁)" unit="m²" min={0.005} max={0.05} step={0.001} value={area1} onChange={setArea1} formulaSymbol={katex_A1} />
                           <InteractiveSlider label="Speed 1 (v₁)" unit="m/s" min={0.1} max={5.0} step={0.1} value={velocity1} onChange={setVelocity1} formulaSymbol={katex_v1} />
                           <InteractiveSlider label="Area 2 (A₂)" unit="m²" min={0.001} max={0.04} step={0.001} value={area2} onChange={setArea2} formulaSymbol={katex_A2} />
                           <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded shadow-inner grid grid-cols-2 gap-2 text-center">
                               <p className="text-md font-semibold font-inter text-dark-gray dark:text-light-gray">
                                Flow Rate (<InlineMath math={katex_Q}/>) = <span className="font-bold text-teal dark:text-mint">{flowRate.toFixed(3)}</span> m³/s
                              </p>
                              <p className="text-md font-semibold font-inter text-dark-gray dark:text-light-gray">
                                Speed 2 (<InlineMath math={katex_v2}/>) = <span className="font-bold text-teal dark:text-mint">{isFinite(velocity2) ? velocity2.toFixed(2) : "N/A"}</span> m/s
                              </p>
                          </div>
                     </div>

                     {/* Panel 4: Bernoulli's Principle Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="SJZOj7Jsyh0" title="Video: Understanding Bernoulli's Principle"/>
                     </div>

                      {/* Panel 5: Simplified Bernoulli Calculator (Horizontal Flow) */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-4 text-green-700 dark:text-green-300">Interactive Bernoulli (Horizontal Flow)</h3>
                         <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Change speeds and initial pressure (for water, ρ ≈ 1000 kg/m³). See how pressure changes. (Height h=0 assumed).</p>
                         <InteractiveSlider label="Pressure 1 (P₁)" unit="Pa" min={50000} max={150000} step={1000} value={pressure1} onChange={setPressure1} formulaSymbol={'P_1'} />
                         <InteractiveSlider label="Speed 1 (v₁)" unit="m/s" min={0.5} max={10.0} step={0.1} value={speed1} onChange={setSpeed1} formulaSymbol={katex_v1} />
                         <InteractiveSlider label="Speed 2 (v₂)" unit="m/s" min={0.5} max={15.0} step={0.1} value={speed2} onChange={setSpeed2} formulaSymbol={katex_v2} />
                         <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 rounded shadow-inner text-center">
                              <p className="text-lg font-semibold font-inter text-dark-gray dark:text-light-gray">
                                Pressure 2 (<InlineMath math={'P_2'}/>) ≈ <span className="font-bold text-teal dark:text-mint">{pressure2.toFixed(0)}</span> Pa
                              </p>
                         </div>
                          <MiniCheckQuestion
                            question="According to Bernoulli, if fluid flows horizontally from a low-speed region to a high-speed region, what happens to the pressure?"
                            correctAnswer="The pressure decreases."
                            explanation="P + ½ρv² = constant. If v increases, P must decrease to keep the sum constant (assuming constant height)."
                         />
                    </div>

                     {/* Panel 6: GeoGebra Bernoulli Simulation */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: GeoGebra Bernoulli</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Interact with pipe shape and see pressure/velocity changes.</p>
                        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-white"> {/* White bg for GeoGebra */}
                           {/* Note: GeoGebra embedding might vary */}
                            <iframe
                              scrolling="no"
                              title="GeoGebra Bernoulli Simulation"
                              src="https://www.geogebra.org/material/iframe/id/1719715/width/985/height/696/border/888888/rc/false/ai/false/sdz/false/smb/false/stb/false/stbh/true/ld/false/sri/true/at/auto"
                              className='absolute top-0 left-0 w-full h-full'
                              style={{ border: "0px" }}
                              allowFullScreen
                            ></iframe>
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
                    Check Your Flow Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
         {showQuiz && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Fluid Flow Quiz</h2>
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
FluidFlow.displayName = 'FluidFlow';

export default FluidFlow;
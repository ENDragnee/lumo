'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, useMemo, ChangeEvent } from 'react';
import QuizQuestion from '@/components/QuizQuestion';
import 'katex/dist/katex.min.css';
import YouTubePanel from '@/components/content-components/YouTubePanel';
import SimulationPanel from '@/components/content-components/SimulationPanel';

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

// --- Reusable Components (Typed and Styled) ---

// Slider Component (Applying Design)
function InteractiveSlider({
    label, unit, min, max, step, value, onChange, formulaSymbol
}: InteractiveSliderProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value));
  };

  return (
    <div className="mb-4">
      {/* UI Font */}
      <label htmlFor={label} className="block text-sm font-medium mb-1 font-inter text-dark-gray dark:text-light-gray">
        {label} (<InlineMath math={formulaSymbol} /> = {value.toFixed(unit === 'AU' || unit === 'years' ? 2 : 0)} {unit})
      </label>
      <input
        type="range"
        id={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        // Teal Accent for Physics/Science sliders
        className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal dark:accent-teal"
      />
       <div className="flex justify-between text-xs font-inter text-gray-500 dark:text-gray-400"> {/* UI Font */}
          <span>{min} {unit}</span>
          <span>{max} {unit}</span>
        </div>
    </div>
  );
}

// Mini Interactive Question Component (Applying Design)
function MiniCheckQuestion({ question, correctAnswer, explanation }: MiniCheckQuestionProps) {
  const [revealed, setRevealed] = useState(false);
  return (
    // Panel styling for consistency
    <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md">
        {/* UI Font */}
      <p className="font-medium text-sm mb-2 font-inter text-dark-gray dark:text-light-gray">{question}</p>
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
            // Coral/Gold Accent for action button
          className="text-xs bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors"
        >
          Check Answer
        </button>
      )}
      {revealed && (
        // UI Font
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
        "question": "What model of the Universe did Claudius Ptolemy propose?",
        "options": [
            "Heliocentric model",
            "Elliptical orbit model",
            "Geocentric model",
            "Planetary motion model"
        ],
        "correctAnswer": 2,
        "hint": "This model places Earth at the center of the Universe."
    },
    {
        "question": "Who proposed the heliocentric model?",
        "options": [
            "Johannes Kepler",
            "Tycho Brahe",
            "Nicolaus Copernicus",
            "Isaac Newton"
        ],
        "correctAnswer": 2,
        "hint": "This astronomer suggested that planets revolve around the Sun."
    },
    {
        "question": "What does Kepler’s first law describe?",
        "options": [
            "The relationship between orbital period and radius",
            "The sweeping of equal areas in equal times",
            "Elliptical orbits with the Sun at one focus",
            "The uniform speed of planets in orbit"
        ],
        "correctAnswer": 2,
        "hint": "It is also known as the law of ellipses."
    },
    {
        "question": "What shape is the orbit of a planet according to Kepler’s first law?",
        "options": [
            "Circular",
            "Elliptical",
            "Rectangular",
            "Parabolic"
        ],
        "correctAnswer": 1,
        "hint": "It is a closed curve with two foci."
    },
    {
        "question": "What does Kepler’s second law state?",
        "options": [
            "Planets move at constant speed along their orbits.",
            "A line joining the Sun and a planet sweeps out equal areas in equal time intervals.",
            "The orbital period squared is proportional to the orbital radius cubed.",
            "Planets have circular orbits with constant distance from the Sun."
        ],
        "correctAnswer": 1,
        "hint": "This law explains variations in a planet's speed."
    },
    {
        "question": "When is a planet's speed fastest according to Kepler’s second law?",
        "options": [
            "When it is at perihelion",
            "When it is at aphelion",
            "When it is equidistant from the Sun",
            "When it completes one orbit"
        ],
        "correctAnswer": 0,
        "hint": "This position is when the planet is closest to the Sun."
    },
    {
        "question": "What does Kepler’s third law compare?",
        "options": [
            "The elliptical and circular orbits of planets",
            "The orbital period and average radius of orbit",
            "The distance between the foci of an ellipse",
            "The mass of the planet and its distance from the Sun"
        ],
        "correctAnswer": 1,
        "hint": "It involves the ratio of T² to R³."
    },
    {
        "question": "What is the formula in Kepler’s third law?",
        "options": [
            "T²/R³ = K",
            "T/R = K",
            "T³/R² = K",
            "R³/T² = K"
        ],
        "correctAnswer": 0,
        "hint": "It relates the square of the orbital period to the cube of the radius."
    },
    {
        "question": "What does the proportionality constant K represent in Kepler’s third law?",
        "options": [
            "The mass of the planet",
            "The orbital radius of the planet",
            "A constant value nearly identical for all planets orbiting the same star", // Clarified
            "The gravitational force between the planet and the Sun"
        ],
        "correctAnswer": 2,
        "hint": "This constant is the same for planets in our solar system."
    },
    {
        "question": "Which law explains why planets move slower when farther from the Sun?",
        "options": [
            "Kepler’s First Law",
            "Kepler’s Second Law",
            "Kepler’s Third Law",
            "Newton’s Law of Gravitation"
        ],
        "correctAnswer": 1,
        "hint": "This law involves sweeping equal areas in equal times."
    }
];

// --- Main Page Component ---
export default function PlanetaryMotionAndKeplersLaws() {
  // --- State variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [eccentricity, setEccentricity] = useState(0.5);
  const [period1, setPeriod1] = useState(1.00);
  const [radius1, setRadius1] = useState(1.00);
  const [period2, setPeriod2] = useState(1.88);
  const [radius2, setRadius2] = useState(1.52);

  // --- Memoized calculations ---
  const keplerConstant1 = useMemo(() => {
      if (radius1 === 0) return NaN;
      return (Math.pow(period1, 2) / Math.pow(radius1, 3));
  }, [period1, radius1]);

  const keplerConstant2 = useMemo(() => {
      if (radius2 === 0) return NaN;
      return (Math.pow(period2, 2) / Math.pow(radius2, 3));
  }, [period2, radius2]);

  // --- Quiz handlers ---
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

  // --- Helper function ---
  const getEccentricityDescription = (e: number): string => {
      if (e === 0) return "A perfect circle!";
      if (e < 0.3) return "A slightly flattened circle.";
      if (e < 0.7) return "A noticeable ellipse.";
      if (e < 0.9) return "A very elongated ellipse.";
      return "Extremely elongated.";
  };

  // --- Component Render ---
  return (
    // Main container: Base colors, body font, min height
    <div className="bg-off-white text-dark-gray dark:bg-deep-navy dark:text-light-gray min-h-screen font-lora">
        {/* Assume Fixed Top Bar and Collapsible Sidebar are in Layout */}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
            {/* Page Title: Header Font */}
            <h1 className="text-4xl lg:text-5xl font-bold font-playfair mb-8 lg:mb-12 text-center">
                2.4 Planetary Motion & Kepler’s Laws
            </h1>

            {/* Main Grid: 1 col mobile, 12 cols large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">

                {/* Left Column (Static Content): 7 cols large */}
                <article className="lg:col-span-7 space-y-6">
                    {/* Historical Context */}
                    <section>
                        <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            From Earth-Centered to Sun-Centered
                        </h2>
                        <p>
                          For centuries, people believed Earth was the center of everything (the <strong className="text-red-500 dark:text-coral">Geocentric Model</strong>, championed by Ptolemy). It seemed obvious!
                        </p>
                        <p className="mt-3">
                          However, careful observations didn't quite fit. Nicolaus Copernicus bravely suggested maybe the Sun was the center (the <strong className="text-green-500 dark:text-mint">Heliocentric Model</strong>). This was revolutionary!
                        </p>
                        <p className="mt-3">
                          Later, Tycho Brahe made incredibly precise measurements of planet positions. His assistant, Johannes Kepler, used this data goldmine to figure out the mathematical rules governing how planets move – Kepler's Laws.
                        </p>
                    </section>

                    {/* Kepler's First Law */}
                    <section>
                        <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            1st Law: The Law of Ellipses
                        </h2>
                        <p>
                            Kepler realized planets don't orbit in perfect circles, but in <strong className="text-teal dark:text-teal font-semibold">ellipses</strong>. An ellipse is like a squashed circle.
                        </p>
                        <p className="mt-3">
                            Crucially, the Sun isn't at the *center* of the ellipse, but at one of its two <strong className="text-teal dark:text-teal font-semibold">foci</strong>. This means a planet's distance from the Sun changes as it orbits.
                        </p>
                        {/* Analogy Block */}
                         <div className="text-sm p-3 my-4 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 italic">
                             <strong>Analogy:</strong> Imagine two pins (the foci) on a board, a loop of string around them, and a pencil keeping the string taut. As you move the pencil, it traces an ellipse! The sum of the distances from the pencil to each pin stays constant.
                         </div>
                    </section>

                     {/* Kepler's Second Law */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             2nd Law: The Law of Equal Areas
                         </h2>
                        <p>
                            This law describes *how fast* planets move. It states: A line connecting a planet to the Sun sweeps out <strong className="text-teal dark:text-teal font-semibold">equal areas in equal amounts of time</strong>.
                        </p>
                        <p className="mt-3">
                            Imagine cutting the orbit into time slices (e.g., 30-day intervals). The area of the "pizza slice" swept out will be the same for every 30-day period.
                        </p>
                        <p className="mt-4 font-semibold">
                            What does this mean for speed?
                             <ul className="list-disc list-inside ml-4 font-normal space-y-1 mt-2">
                                 <li>When the planet is <strong className="text-coral dark:text-gold">closer</strong> to the Sun (at <strong className="font-medium">perihelion</strong>), it must move <strong className="text-coral dark:text-gold">faster</strong>.</li>
                                 <li>When the planet is <strong className="text-blue-500 dark:text-mint">farther</strong> from the Sun (at <strong className="font-medium">aphelion</strong>), it moves <strong className="text-blue-500 dark:text-mint">slower</strong>.</li>
                             </ul>
                        </p>
                    </section>

                     {/* Kepler's Third Law */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             3rd Law: The Law of Harmonies
                         </h2>
                        <p>
                            This law relates a planet's orbital period (<InlineMath math="T" />) to its average distance from the Sun (<InlineMath math="R" />).
                        </p>
                        <p className="mt-3">
                            It states: The square of the orbital period (<InlineMath math="T^2" />) is directly proportional to the cube of the average orbital radius (<InlineMath math="R^3" />).
                        </p>
                         {/* Equation Block */}
                        <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                            <BlockMath math="\frac{T^2}{R^3} = K \quad (\text{constant})" />
                        </div>
                        <p>
                            The amazing part: This constant <InlineMath math="K" /> is the <strong className="text-teal dark:text-teal font-semibold">same for all planets orbiting the same star</strong>! It allows us to compare different planets.
                        </p>
                         {/* Collapsible Data Table */}
                         <details className="mt-4 text-sm font-inter"> {/* UI Font for Table */}
                            <summary className="cursor-pointer font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                                Show Data Table (Earth & Mars in SI Units)
                            </summary>
                            <table className="w-full mt-2 border-collapse border border-gray-300 dark:border-gray-600 text-center text-xs">
                                 <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">Planet</th>
                                        <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">Period (s)</th>
                                        <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">Avg Dist (m)</th>
                                        <th className="border border-gray-300 dark:border-gray-600 px-2 py-1"><InlineMath math="T^2/R^3 (s^2/m^3)" /></th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800">
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">Earth</td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><InlineMath math="3.156 \times 10^7" /></td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><InlineMath math="1.496 \times 10^{11}" /></td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><InlineMath math="2.97 \times 10^{-19}" /></td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">Mars</td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><InlineMath math="5.93 \times 10^7" /></td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><InlineMath math="2.279 \times 10^{11}" /></td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"><InlineMath math="2.97 \times 10^{-19}" /></td>
                                    </tr>
                                    </tbody>
                            </table>
                        </details>
                    </section>

                </article> {/* End Left Column */}

                {/* Right Column (Interactive Elements): 5 cols large */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">

                    {/* Panel 1: Historical Context Video */}
                    <YouTubePanel videoId="S13Sr-H7TWI" title="Video: Geocentric vs. Heliocentric Models" />

                    {/* Panel 2: Eccentricity Slider + Mini Question */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-indigo-700 dark:text-indigo-300"> {/* UI Font */}
                            Law 1: Orbit Shape (Eccentricity <InlineMath math="e" />)
                        </h3>
                        <p className="text-sm mb-3 font-inter text-dark-gray dark:text-light-gray"> {/* UI Font */}
                            Eccentricity (<InlineMath math="e" />) measures how "squashed" an ellipse is. 0 = circle, close to 1 = very flat.
                        </p>
                        <InteractiveSlider
                            label="Adjust Eccentricity" unit="" min={0} max={0.95} step={0.05}
                            value={eccentricity} onChange={setEccentricity} formulaSymbol="e"
                        />
                        <div className="mt-2 p-2 bg-indigo-50 dark:bg-gray-700 rounded">
                            <p className="text-sm font-medium text-center font-inter text-indigo-700 dark:text-indigo-300"> {/* UI Font */}
                                {getEccentricityDescription(eccentricity)}
                            </p>
                        </div>
                        {/* Mini Question related to Law 1 */}
                         <MiniCheckQuestion
                            question="In Kepler's First Law, where is the Sun located within the planet's elliptical orbit?"
                            correctAnswer="At one of the two foci."
                            explanation="The Sun is not at the center of the ellipse (unless e=0), but offset at one focus point."
                        />
                    </div>

                     {/* Panel 3: Law 1 Video */}
                     <YouTubePanel videoId="qDHnWptz5Jo" title="Video: Understanding Ellipses & Kepler's 1st Law" />

                     {/* Panel 5: Law 2 Video */}
                     <YouTubePanel videoId='qd3dIGJqRDU' title="Video: Kepler's 2nd Law Explained" />

                     {/* Panel 4: Law 2 Mini Question */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-teal-700 dark:text-teal-300">Law 2 Check</h3> {/* UI Font */}
                         <MiniCheckQuestion
                            question="According to Kepler's Second Law, when does a planet travel fastest in its orbit?"
                            correctAnswer="When it is closest to the Sun (perihelion)."
                            explanation="To sweep out the same area in the same time when the radius is shorter, the planet must cover a longer arc distance, meaning it moves faster."
                        />
                    </div>

                    {/* Panel 6: Law 3 Calculator + Mini Question */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-amber-700 dark:text-amber-300"> {/* UI Font */}
                             Law 3: Interactive Calculator (<InlineMath math="T^2/R^3" />)
                         </h3>
                        <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray"> {/* UI Font */}
                            Compare two planets (using Years and AU). See if <InlineMath math="T^2 / R^3" /> stays constant (~1 for our Sun).
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                             {/* Planet 1 */}
                             <div>
                                 <h5 className="font-semibold font-inter mb-2 text-center text-dark-gray dark:text-light-gray">Planet 1</h5>
                                 <InteractiveSlider label="Period (T₁)" unit="years" min={0.1} max={300} step={0.1} value={period1} onChange={setPeriod1} formulaSymbol="T_1" />
                                 <InteractiveSlider label="Avg. Radius (R₁)" unit="AU" min={0.1} max={40} step={0.1} value={radius1} onChange={setRadius1} formulaSymbol="R_1" />
                                 <div className="mt-2 p-2 bg-amber-50 dark:bg-gray-700 rounded text-center">
                                     <p className="text-sm font-medium font-inter text-dark-gray dark:text-light-gray">
                                        <InlineMath math="T_1^2 / R_1^3 \approx" /> <span className="font-semibold text-teal dark:text-mint">{keplerConstant1.toFixed(3)}</span>
                                     </p>
                                 </div>
                             </div>
                             {/* Planet 2 */}
                             <div>
                                 <h5 className="font-semibold font-inter mb-2 text-center text-dark-gray dark:text-light-gray">Planet 2</h5>
                                 <InteractiveSlider label="Period (T₂)" unit="years" min={0.1} max={300} step={0.1} value={period2} onChange={setPeriod2} formulaSymbol="T_2" />
                                 <InteractiveSlider label="Avg. Radius (R₂)" unit="AU" min={0.1} max={40} step={0.1} value={radius2} onChange={setRadius2} formulaSymbol="R_2" />
                                 <div className="mt-2 p-2 bg-amber-50 dark:bg-gray-700 rounded text-center">
                                    <p className="text-sm font-medium font-inter text-dark-gray dark:text-light-gray">
                                        <InlineMath math="T_2^2 / R_2^3 \approx" /> <span className="font-semibold text-teal dark:text-mint">{keplerConstant2.toFixed(3)}</span>
                                    </p>
                                 </div>
                             </div>
                        </div>
                        {/* Mini Question related to Law 3 */}
                        <MiniCheckQuestion
                            question="If Planet A is farther from the Sun than Planet B, what does Kepler's Third Law imply about their orbital periods?"
                            correctAnswer="Planet A will have a longer orbital period than Planet B."
                            explanation="Since T²/R³ is constant, if R increases, T must also increase to keep the ratio the same (T increases ~ R^1.5)."
                        />
                    </div>

                     {/* Panel 7: Law 3 Video */}
                    <YouTubePanel videoId="KbXVpdlmYZo" title="Video: Kepler's 3rd Law Explained" />

                    {/* Panel 8: PhET Simulation */}
                    <SimulationPanel title='PhET Simulation: Kepler\’s Laws' simulationUrl='https://phet.colorado.edu/sims/html/keplers-laws/latest/keplers-laws_en.html' description='Visualize all three laws. Change planets, turn on tracers, observe velocity.'/>

                </aside> {/* End Right Column */}

            </div> {/* End Main Grid */}

            {/* Quiz Button */}
            <div className='flex justify-center items-center mt-12 lg:mt-16'>
                <button
                    onClick={() => setShowQuiz(true)}
                    // Coral/Gold Accent
                    className="w-full sm:w-1/2 lg:w-1/3 bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-3 px-6 rounded-lg transition-colors text-lg shadow-md"
                >
                    Take the Kepler's Laws Quiz!
                </button>
            </div>

        </main> {/* End Page Content Area */}

        {/* --- Quiz Modal (Styled according to design) --- */}
        {showQuiz && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Kepler's Laws Quiz</h2> {/* Header Font */}
                 <div className="space-y-6 font-inter"> {/* UI Font */}
                  {quizQuestions.map((q, index) => (
                    <QuizQuestion
                      key={index}
                      // questionNumber={index + 1} // Uncomment if QuizQuestion accepts this prop
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
                 {/* Quiz Buttons */}
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
                 {/* Quiz Results */}
                {showResults && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                     <h3 className="text-xl font-bold font-playfair mb-2 text-dark-gray dark:text-light-gray">Quiz Results</h3> {/* Header Font */}
                     <p className="text-lg font-inter text-dark-gray dark:text-light-gray"> {/* UI Font */}
                        You got <strong className="text-teal dark:text-mint">{score}</strong> out of <strong className="text-teal dark:text-mint">{quizQuestions.length}</strong> correct!
                     </p>
                     <p className="text-2xl font-bold font-inter mt-1 text-dark-gray dark:text-light-gray"> {/* UI Font */}
                         ({((score / quizQuestions.length) * 100).toFixed(0)}%)
                     </p>
                  </div>
                )}
              </div>
            </div>
        )}
    </div> // End Main Container
  );
}
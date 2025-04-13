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
  displayLog?: boolean; // Optional prop
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
    label, unit, min, max, step, value, onChange, formulaSymbol, displayLog = false
}: InteractiveSliderProps) {
    const displayValue = displayLog ? Math.pow(10, value).toExponential(1) : value.toFixed(unit === 'AU' || unit === 'years' ? 2 : (step < 1 ? 1 : 0));
    const minDisplay = displayLog ? Math.pow(10, min).toExponential(1) : min;
    const maxDisplay = displayLog ? Math.pow(10, max).toExponential(1) : max;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(parseFloat(event.target.value));
    };

  return (
    <div className="mb-4">
      {/* UI Font */}
      <label htmlFor={label} className="block text-sm font-medium mb-1 font-inter text-dark-gray dark:text-light-gray">
        {label} (<InlineMath math={formulaSymbol} /> = {displayValue} {unit})
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
          <span>{minDisplay} {unit}</span>
          <span>{maxDisplay} {unit}</span>
        </div>
    </div>
  );
}

// YouTube Embed Component (Applying Design)
function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  return (
    <div className="my-4"> {/* Adjusted margin */}
      {/* UI Font */}
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
        "question": "Who first proposed that the force of attraction between masses is universal?",
        "options": [
            "Galileo Galilei",
            "Isaac Newton",
            "Johannes Kepler",
            "Nicolaus Copernicus"
        ],
        "correctAnswer": 1,
        "hint": "This scientist formulated the law of universal gravitation in 1666."
    },
    {
        "question": "What is the formula for the gravitational force between two masses?",
        "options": [
            "F = ma",
            "F = Gm₁m₂",
            "F = Gm₁m₂/r²",
            "F = mv²/r"
        ],
        "correctAnswer": 2,
        "hint": "It involves the product of two masses and the inverse square of the distance."
    },
    {
        "question": "What is the value of the universal gravitational constant (G)?",
        "options": [
            "9.8 m/s²",
            "6.67 × 10⁻¹¹ Nm²/kg²",
            "5.97 × 10²⁴ kg",
            "1.4957 × 10¹¹ m"
        ],
        "correctAnswer": 1,
        "hint": "It is a constant used in the formula for gravitational force."
    },
    {
        "question": "What happens to the gravitational force if the distance between two masses is doubled?",
        "options": [
            "It remains the same",
            "It doubles",
            "It decreases by a factor of four",
            "It increases by a factor of four"
        ],
        "correctAnswer": 2,
        "hint": "Gravitational force is inversely proportional to the square of the distance."
    },
    {
        "question": "What is the acceleration due to gravity on Earth's surface?",
        "options": [
            "6.67 × 10⁻¹¹ m/s²",
            "9.8 m/s²",
            "5.97 × 10²⁴ m/s²",
            "1.4957 × 10¹¹ m/s²"
        ],
        "correctAnswer": 1,
        "hint": "This is the value of g derived from Newton’s universal gravitation equation."
    },
    {
        "question": "What provides the centripetal force for planets in orbit around the Sun?",
        "options": [
            "Tangential velocity",
            "Gravitational attraction of the Sun",
            "Centrifugal force",
            "Electromagnetic force"
        ],
        "correctAnswer": 1,
        "hint": "This force pulls planets toward the center of their orbit."
    },
    {
        "question": "What is the formula for centripetal force?",
        "options": [
            "F = Gm₁m₂/r²",
            "F = mv²/r",
            "F = ma",
            "F = mg"
        ],
        "correctAnswer": 1,
        "hint": "This formula involves the tangential velocity and radius of orbit."
    },
    {
        "question": "What does the equation v² = GM_s/r describe?",
        "options": [
            "Gravitational force",
            "Centripetal force",
            "Orbital speed",
            "Orbital period"
        ],
        "correctAnswer": 2,
        "hint": "It relates speed to the Sun’s mass and orbital radius."
    },
    {
        "question": "How is the orbital period (T) related to the orbital radius (r)?",
        "options": [
            "T² ∝ r³",
            "T ∝ r²",
            "T² ∝ r²",
            "T ∝ r³"
        ],
        "correctAnswer": 0,
        "hint": "This is Kepler’s third law as derived from Newton’s equations."
    },
    {
        "question": "What force causes the Moon to orbit the Earth?",
        "options": [
            "Centripetal force",
            "Gravitational force",
            "Tangential velocity",
            "Inertia"
        ],
        "correctAnswer": 1,
        "hint": "This is the same force that causes objects to fall to the ground."
    },
    {
        "question": "What happens to the gravitational force when the mass of one object is doubled?",
        "options": [
            "It remains the same",
            "It doubles",
            "It decreases by half",
            "It increases by a factor of four"
        ],
        "correctAnswer": 1,
        "hint": "Gravitational force is directly proportional to the product of the masses."
    },
    {
        "question": "Which equation relates orbital speed to orbital period?",
        "options": [
            "v = GM_s/r",
            "v = 2πr/T",
            "v = mv²/r",
            "v = GM_sT²/r³"
        ],
        "correctAnswer": 1,
        "hint": "It involves the radius and the time for one revolution."
    }
];

const G_CONST = 6.674e-11; // N m^2 / kg^2

// --- Main Page Component ---
export default function UniversalGravitation() {
  // --- State variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [mass1Log, setMass1Log] = useState(3);
  const [mass2Log, setMass2Log] = useState(6);
  const [distance, setDistance] = useState(10);

  // --- Memoized calculation ---
  const gravitationalForce = useMemo(() => {
    const m1 = Math.pow(10, mass1Log);
    const m2 = Math.pow(10, mass2Log);
    if (distance <= 0) return Infinity; // Handle zero or negative distance
    const force = (G_CONST * m1 * m2) / Math.pow(distance, 2);
    return force;
  }, [mass1Log, mass2Log, distance]);

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

  // --- Component Render ---
  return (
    // Main container: Base colors, body font, min height
    <div className="bg-off-white text-dark-gray dark:bg-deep-navy dark:text-light-gray min-h-screen font-lora">
        {/* Assume Layout Components (Top Bar, Sidebar) exist elsewhere */}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
            {/* Page Title: Header Font */}
            <h1 className="text-4xl lg:text-5xl font-bold font-playfair mb-8 lg:mb-12 text-center">
                2.5 Newton’s Law of Universal Gravitation
            </h1>

            {/* Main Grid: 1 col mobile, 12 cols large */}
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">

                {/* Left Column (Static Content): 7 cols large */}
                <article className="lg:col-span-7 space-y-6">
                    {/* Newton's Insight Section */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Newton's Big Idea: Gravity is Universal
                         </h2>
                         <p className="leading-relaxed">
                           While Galileo observed *how* things fall, Isaac Newton had a profound insight: the force pulling an apple to the ground is the <strong className="text-purple-600 dark:text-purple-400 font-semibold">exact same force</strong> keeping the Moon in orbit around the Earth, and the Earth around the Sun!
                         </p>
                         <p className="mt-3 leading-relaxed">
                           He proposed that <strong className="text-purple-600 dark:text-purple-400 font-semibold">every object with mass</strong> attracts every other object with mass in the universe. This attraction is what we call gravity.
                         </p>
                    </section>

                    {/* The Law Section */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Quantifying the Attraction
                         </h2>
                         <p className="leading-relaxed">
                           Newton described the force of gravitational attraction (<InlineMath math="F" />) mathematically. It depends on:
                            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                <li>Their masses (<InlineMath math="m_1" />, <InlineMath math="m_2" />): More mass = stronger pull (<InlineMath math="F \propto m_1 m_2" />).</li>
                                <li>The distance (<InlineMath math="r" />) between centers: Force weakens rapidly with distance (<InlineMath math="F \propto 1/r^2" />) - the <strong className="text-coral dark:text-gold font-semibold">Inverse Square Law</strong>.</li>
                            </ul>
                         </p>
                         {/* Equation Block */}
                         <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                           <BlockMath math="F = G \frac{m_1 m_2}{r^2}" />
                         </div>
                         <p className="text-sm leading-relaxed">
                              <InlineMath math="G" /> is the <strong className="text-purple-600 dark:text-purple-400 font-semibold">Universal Gravitational Constant</strong> (<InlineMath math="\approx 6.674 \times 10^{-11} \, \text{N m}^2/\text{kg}^2" />). Its tiny value shows gravity is weak unless masses are very large (like planets).
                         </p>
                    </section>

                    {/* Gravity on Earth Section */}
                    <section>
                        <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Why Things Fall: Acceleration Due to Gravity (<InlineMath math="g" />)
                        </h2>
                         <p className="leading-relaxed">
                             Earth's gravity pulls objects down (<InlineMath math="F_g" />). According to <InlineMath math="F=ma" />, this force causes acceleration <InlineMath math="g" />, so <InlineMath math="F_g = mg" />.
                         </p>
                         <p className="mt-3 leading-relaxed">
                             Using universal gravitation (with Earth mass <InlineMath math="M_E" />, object mass <InlineMath math="m" />, Earth radius <InlineMath math="R_E" />):
                         </p>
                         <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math="F_g = G \frac{M_E m}{R_E^2}" />
                         </div>
                         <p className="leading-relaxed">
                             Setting <InlineMath math="mg = G M_E m / R_E^2" />, the object's mass <InlineMath math="m" /> cancels out!
                         </p>
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math="g = G \frac{M_E}{R_E^2}" />
                         </div>
                         <p className="leading-relaxed">
                             This means <InlineMath math="g" /> (approx. <InlineMath math="9.8 \, \text{m/s}^2" /> near Earth's surface) is the <strong className="text-green-600 dark:text-mint font-semibold">same for all objects</strong> (ignoring air resistance). This confirms Galileo's observations.
                         </p>
                    </section>

                    {/* Gravity and Orbits Section */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Gravity Keeps Things in Orbit
                         </h2>
                         <p className="leading-relaxed">
                             An object in orbit constantly accelerates towards the center, requiring a <strong className="text-teal dark:text-teal font-semibold">centripetal force</strong> (<InlineMath math="F_c = mv^2/r" />).
                         </p>
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math="F_c = \frac{mv^2}{r}" />
                         </div>
                         <p className="mt-3 leading-relaxed">
                             For planets orbiting the Sun, <strong className="text-purple-600 dark:text-purple-400 font-semibold">gravity provides this centripetal force</strong>.
                         </p>
                         <p className="mt-3 leading-relaxed">
                             Equating the forces (planet mass <InlineMath math="m_p" />, Sun mass <InlineMath math="M_S" />):
                         </p>
                         <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center text-sm sm:text-base'>
                             <BlockMath math="\underbrace{G \frac{M_S m_p}{r^2}}_{\text{Gravity}} = \underbrace{\frac{m_p v^2}{r}}_{\text{Centripetal Req.}}" />
                         </div >
                         <p className="leading-relaxed">
                             The planet's mass <InlineMath math="m_p" /> cancels! Solving for orbital speed <InlineMath math="v" />:
                         </p>
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                             <BlockMath math="v = \sqrt{\frac{G M_S}{r}}" />
                         </div>
                          <p className="text-sm leading-relaxed">
                              Planets farther out (<InlineMath math="r" /> larger) orbit slower (<InlineMath math="v" /> smaller).
                         </p>

                         {/* Connecting to Kepler's 3rd */}
                          <h3 className="text-2xl font-semibold font-playfair mt-6 mb-3">Connecting to Kepler's 3rd Law</h3> {/* Header Font */}
                         <p className="leading-relaxed">
                             Using <InlineMath math="v = 2\pi r / T" /> (speed = circumference / period) and substituting into the <InlineMath math="v^2" /> equation leads to:
                         </p>
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                              <BlockMath math="\frac{T^2}{r^3} = \frac{4\pi^2}{G M_S}" />
                          </div>
                          <p className="leading-relaxed">
                             The right side is constant for all planets orbiting the Sun. This is <strong className="text-amber-600 dark:text-gold font-semibold">Kepler's Third Law</strong>! Newton's gravity explains *why* Kepler's law works.
                          </p>
                    </section>

                </article> {/* End Left Column */}

                {/* Right Column (Interactive Elements): 5 cols large */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">

                    {/* Panel 1: Newton's Insight Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed
                            videoId="7gf6YpdvtFU"
                            title="Video: Newton's Universal Gravitation Explained"
                        />
                    </div>

                    {/* Panel 2: Gravity Calculator + Mini Question */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                       <h3 className="text-xl font-semibold font-inter mb-4 text-purple-700 dark:text-purple-300">Interactive Gravity Calculator</h3> {/* UI Font */}
                       <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Play with masses (log scale) and distance. How does the force change?</p>
                       <InteractiveSlider
                         label="Mass 1 (m₁)" unit="kg" min={1} max={9} step={0.5} // Log 10^1 to 10^9
                         value={mass1Log} onChange={setMass1Log} formulaSymbol="m_1" displayLog={true}
                       />
                       <InteractiveSlider
                         label="Mass 2 (m₂)" unit="kg" min={1} max={9} step={0.5} // Log 10^1 to 10^9
                         value={mass2Log} onChange={setMass2Log} formulaSymbol="m_2" displayLog={true}
                       />
                       <InteractiveSlider
                         label="Distance (r)" unit="m" min={1} max={100} step={1} // Linear
                         value={distance} onChange={setDistance} formulaSymbol="r"
                       />
                       <div className="mt-4 p-3 bg-purple-50 dark:bg-gray-700 rounded shadow-inner text-center">
                         <p className="text-lg font-semibold font-inter text-dark-gray dark:text-light-gray"> {/* UI Font */}
                           Calculated Force (<InlineMath math="F" />) ≈ <span className="font-bold text-teal dark:text-mint">
                               {isFinite(gravitationalForce) ? gravitationalForce.toExponential(3) : "Infinity"} {/* Display result */}
                           </span> N
                         </p>
                       </div>
                       {/* Mini Question on Inverse Square */}
                       <MiniCheckQuestion
                         question="If you double the distance between two objects, what happens to the gravitational force between them?"
                         correctAnswer="It decreases by a factor of 4 (becomes 1/4 of the original force)."
                         explanation="Force follows an inverse square law (F ∝ 1/r²). Doubling r makes r² four times larger, so F is 1/4."
                       />
                    </div>

                     {/* Panel 3: PhET Gravity Force Lab */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Gravity Force Lab</h3> {/* UI Font */}
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Manipulate masses and see the force vectors change. Verify the inverse square law.</p>
                        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                            <iframe src="https://phet.colorado.edu/sims/html/gravity-force-lab/latest/gravity-force-lab_en.html"
                            className='absolute top-0 left-0 w-full h-full'
                            allowFullScreen
                            title="PhET Gravity Force Lab Simulation">
                                <p className="text-light-gray text-center pt-10">Loading Simulation...</p>
                            </iframe>
                        </div>
                    </div>

                     {/* Panel 4: Falling Rate Video + Mini Question */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Why Things Fall Together</h3> {/* UI Font */}
                         <YouTubeEmbed
                            videoId="4N7SqhIHNig"
                            title="Video: Why Everything Falls at the Same Rate"
                         />
                         {/* Mini Question on 'g' */}
                         <MiniCheckQuestion
                            question="What properties of a planet determine the acceleration due to gravity (g) on its surface?"
                            correctAnswer="The planet's mass and its radius."
                            explanation="From g = GM/R², 'g' depends on planet mass (M) and radius (R), not the falling object's mass."
                         />
                    </div>

                    {/* Panel 5: Orbits Video + Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-sky-700 dark:text-sky-300">How Orbits Work</h3> {/* UI Font */}
                         <YouTubeEmbed
                            videoId="0EVhnN3t_T4"
                            title="Video: How Orbits Work (Falling Around the Earth)"
                         />
                          {/* Mini Question on Orbits */}
                         <MiniCheckQuestion
                            question="What force acts as the centripetal force keeping the Earth in orbit around the Sun?"
                            correctAnswer="The gravitational force exerted by the Sun on the Earth."
                            explanation="Gravity provides the inward pull needed to continuously change Earth's direction into an orbit."
                         />
                    </div>

                     {/* Panel 6: PhET Gravity & Orbits */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Gravity and Orbits</h3> {/* UI Font */}
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Launch objects and see how gravity creates orbits. Turn gravity off! Observe vectors.</p>
                        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                            <iframe src="https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_en.html"
                            className='absolute top-0 left-0 w-full h-full'
                            allowFullScreen
                            title="PhET Gravity and Orbits Simulation">
                                <p className="text-light-gray text-center pt-10">Loading Simulation...</p>
                            </iframe>
                        </div>
                    </div>

                </aside> {/* End Right Column */}

            </div> {/* End Main Grid */}

            {/* Quiz Button */}
            <div className='flex justify-center items-center mt-12 lg:mt-16'>
                <button
                    onClick={() => setShowQuiz(true)}
                     // Coral/Gold Accent
                    className="w-full sm:w-1/2 lg:w-1/3 bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-3 px-6 rounded-lg transition-colors text-lg shadow-md"
                >
                    Test Your Gravity Knowledge!
                </button>
            </div>

        </main> {/* End Page Content Area */}

        {/* --- Quiz Modal (Styled according to design) --- */}
        {showQuiz && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Universal Gravitation Quiz</h2> {/* Header Font */}
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
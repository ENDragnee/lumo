'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, useMemo, ChangeEvent } from 'react'; // Added ChangeEvent for input onChange
import QuizQuestion from '@/components/QuizQuestion'; // Assuming this component exists
import 'katex/dist/katex.min.css';

// --- Type Definitions for Component Props ---

interface InteractiveSliderProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (newValue: number) => void; // Function that accepts a number and returns nothing
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

// Assuming QuizQuestionProps looks something like this (adjust based on your actual component)
// If your QuizQuestion component doesn't expect 'questionNumber', remove it here AND where it's passed below.
interface QuizQuestionProps {
    key: number; // React key prop
    questionNumber: number; // Added this prop
    question: string;
    options: string[];
    correctAnswer: number;
    hint: string;
    selectedAnswer: number | null;
    showResults: boolean;
    onSelectAnswer: (answerIndex: number) => void;
}


// --- Reusable Components with Types Applied ---

// Slider Component
function InteractiveSlider({
    label, unit, min, max, step, value, onChange, formulaSymbol, displayLog = false // Default value for optional prop
}: InteractiveSliderProps) { // Apply the Props type here
    const displayValue = displayLog ? Math.pow(10, value).toExponential(1) : value.toFixed(unit === 'AU' || unit === 'years' ? 2 : (step < 1 ? 1 : 0));
    const minDisplay = displayLog ? Math.pow(10, min).toExponential(1) : min;
    const maxDisplay = displayLog ? Math.pow(10, max).toExponential(1) : max;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(parseFloat(event.target.value));
    };

  return (
    <div className="mb-4">
      <label htmlFor={label} className="block text-sm font-medium mb-1">
        {label} (<InlineMath math={formulaSymbol} /> = {displayValue} {unit})
      </label>
      <input
        type="range"
        id={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange} // Use the typed handler
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-600 dark:accent-purple-400"
      />
       <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{minDisplay} {unit}</span>
          <span>{maxDisplay} {unit}</span>
        </div>
    </div>
  );
}

// YouTube Embed Component
function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) { // Apply the Props type here
  return (
    <div className="my-6">
      <p className="mb-2 font-semibold">{title}:</p>
      <div className="aspect-w-16 aspect-h-9">
         <iframe
           className="w-full h-full rounded-lg shadow-md"
           src={`https://www.youtube.com/embed/${videoId}`}
           title={title} // Use the prop directly
           frameBorder="0"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           allowFullScreen>
         </iframe>
      </div>
    </div>
  );
}

// Mini Interactive Question Component
function MiniCheckQuestion({ question, correctAnswer, explanation }: MiniCheckQuestionProps) { // Apply the Props type here
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="mt-4 p-3 border border-dashed border-blue-300 dark:border-blue-600 rounded-md bg-blue-50 dark:bg-gray-700">
      <p className="font-medium text-sm mb-2">{question}</p>
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded transition-colors"
        >
          Check Answer
        </button>
      )}
      {revealed && (
        <div className="text-sm space-y-1">
          <p><strong className="text-green-600 dark:text-green-400">Answer:</strong> {correctAnswer}</p>
          <p><strong className="text-gray-700 dark:text-gray-300">Explanation:</strong> {explanation}</p>
           <button
            onClick={() => setRevealed(false)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
          >
            Hide
          </button>
        </div>
      )}
    </div>
  );
}

// --- Main Component ---

const quizQuestions = [
    // ... (keep your existing quiz questions array - unchanged)
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

export default function UniversalGravitation() {
  // --- State for Quiz ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // --- State for Gravity Calculator ---
  const [mass1Log, setMass1Log] = useState(3);
  const [mass2Log, setMass2Log] = useState(6);
  const [distance, setDistance] = useState(10);

  // --- Memoized Calculation for Gravity ---
  const gravitationalForce = useMemo(() => {
    const m1 = Math.pow(10, mass1Log);
    const m2 = Math.pow(10, mass2Log);
    if (distance === 0) return 0;
    const force = (G_CONST * m1 * m2) / Math.pow(distance, 2);
    return force;
  }, [mass1Log, mass2Log, distance]);

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

  return (
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto text-justify dark:text-gray-300">
      {/* --- Page Title --- */}
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">2.5 Newton’s Law of Universal Gravitation</h1>

      {/* --- Newton's Insight Section --- */}
      <section className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow mb-8">
         <h2 className="text-2xl font-semibold mt-2 mb-4 text-gray-700 dark:text-gray-300">Newton's Big Idea: Gravity is Universal</h2>
         {/* ... content for this section ... */}
         <p className="mb-3">
          While Galileo observed *how* things fall, Isaac Newton had a profound insight: the force pulling an apple to the ground is the <strong className="text-purple-600 dark:text-purple-400">exact same force</strong> keeping the Moon in orbit around the Earth, and the Earth around the Sun!
        </p>
        <p className="mb-3">
          He proposed that <strong className="text-purple-600 dark:text-purple-400">every object with mass</strong> attracts every other object with mass in the universe. This attraction is what we call gravity.
        </p>
         <YouTubeEmbed
            videoId="7gf6YpdvtFU"
            title="Video: Newton's Universal Law of Gravitation Explained"
         />
      </section>

      {/* --- The Law of Universal Gravitation Section --- */}
      <section className="bg-purple-50 dark:bg-gray-800 p-4 rounded-lg shadow mb-8 border-l-4 border-purple-500 dark:border-purple-300">
         <h2 className="text-2xl font-semibold mt-2 mb-4 text-purple-700 dark:text-purple-300">Quantifying the Attraction</h2>
          {/* ... content for this section ... */}
          <p className="mb-3">
          Newton didn't just have the idea; he described it mathematically. The force of gravitational attraction (<InlineMath math="F" />) between two objects depends on:
           <ul className="list-disc list-inside ml-4 space-y-1 mt-1">
               <li>Their masses (<InlineMath math="m_1" /> and <InlineMath math="m_2" />): More massive objects pull harder. The force is directly proportional to the product of the masses (<InlineMath math="F \propto m_1 m_2" />).</li>
               <li>The distance (<InlineMath math="r" />) between their centers: Gravity gets weaker rapidly as objects get farther apart. The force is inversely proportional to the square of the distance (<InlineMath math="F \propto 1/r^2" />) - the famous <strong className="text-red-600 dark:text-red-400">Inverse Square Law</strong>.</li>
           </ul>
        </p>
        <div className='overflow-x-auto text-wrap text-lg bg-white dark:bg-gray-700 p-3 rounded text-center shadow-inner mb-3'>
          <BlockMath math="F = G \frac{m_1 m_2}{r^2}" />
        </div>
        <p className="mb-4 text-sm">
             <InlineMath math="G" /> is the <strong className="text-purple-600 dark:text-purple-400">Universal Gravitational Constant</strong>. It's a fundamental constant of nature, experimentally measured to be approximately <InlineMath math="6.674 \times 10^{-11} \, \text{N m}^2/\text{kg}^2" />. Its tiny value shows that gravity is actually a very weak force unless at least one of the masses involved is huge (like a planet or star).
        </p>

         {/* Interactive Gravity Calculator */}
         <div className="mt-6 p-4 border border-purple-200 dark:border-purple-700 rounded-md bg-white dark:bg-gray-700">
           {/* ... calculator content ... */}
           <h3 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-200">Interactive Gravity Calculator</h3>
           <p className="text-sm mb-4">Play with the masses and distance to see how the gravitational force changes. Notice the big impact of changing the distance!</p>

           <InteractiveSlider
             label="Mass 1 (m₁)" unit="kg" min={1} max={9} step={0.5}
             value={mass1Log} onChange={setMass1Log} formulaSymbol="m_1" displayLog={true}
           />
           <InteractiveSlider
             label="Mass 2 (m₂)" unit="kg" min={1} max={9} step={0.5}
             value={mass2Log} onChange={setMass2Log} formulaSymbol="m_2" displayLog={true}
           />
           <InteractiveSlider
             label="Distance (r)" unit="m" min={1} max={100} step={1}
             value={distance} onChange={setDistance} formulaSymbol="r"
           />

           <div className="mt-4 p-3 bg-purple-100 dark:bg-gray-600 rounded shadow">
             <p className="text-lg font-semibold text-center">
               Calculated Gravitational Force (<InlineMath math="F" />) ≈ <span className="text-purple-700 dark:text-purple-300">{gravitationalForce.toExponential(3)}</span> N
             </p>
           </div>
         </div>

         {/* Mini Check Question */}
          <MiniCheckQuestion
            question="If you double the distance between two objects, what happens to the gravitational force between them?"
            correctAnswer="It decreases by a factor of 4 (becomes 1/4 of the original force)."
            explanation="The force follows an inverse square law (F ∝ 1/r²). If r doubles, r² becomes 4 times larger, so the force becomes 1/4 as strong."
         />

          {/* PhET Simulation 1 */}
         <div className="my-6 p-4 border rounded-lg shadow bg-gray-100 dark:bg-gray-900">
            {/* ... PhET sim content ... */}
            <h4 className="text-lg font-semibold mb-2 text-center">Explore with PhET: Gravity Force Lab</h4>
            <p className="text-sm text-center mb-3">This simulation lets you directly manipulate two masses and see the gravitational force vectors change. Verify the relationships you explored with the sliders!</p>
            <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-700 rounded bg-black">
                <iframe src="https://phet.colorado.edu/sims/html/gravity-force-lab/latest/gravity-force-lab_en.html"
                className='absolute top-0 left-0 w-full h-full'
                allowFullScreen
                title="PhET Gravity Force Lab Simulation">
                    <p className="text-white text-center pt-10">Loading PhET Simulation...</p>
                </iframe>
            </div>
         </div>
      </section>

      {/* --- Gravity on Earth (g) Section --- */}
       <section className="bg-green-50 dark:bg-gray-800 p-4 rounded-lg shadow mb-8 border-l-4 border-green-500 dark:border-green-300">
         <h2 className="text-2xl font-semibold mt-2 mb-4 text-green-700 dark:text-green-300">Why Things Fall: Acceleration Due to Gravity (<InlineMath math="g" />)</h2>
         {/* ... content for this section ... */}
          <p className="mb-3">
            We experience Earth's gravity as the force pulling objects down (<InlineMath math="F_g" />). From Newton's Second Law (<InlineMath math="F=ma" />), this force causes an acceleration, which we call the acceleration due to gravity, <InlineMath math="g" />. So, <InlineMath math="F_g = mg" />.
        </p>
        <p className="mb-3">
            We can also calculate this force using the Law of Universal Gravitation, where <InlineMath math="m_1" /> is the mass of the Earth (<InlineMath math="M_E" />), <InlineMath math="m_2" /> is the mass of the object (<InlineMath math="m" />), and <InlineMath math="r" /> is the radius of the Earth (<InlineMath math="R_E" />, assuming the object is near the surface):
        </p>
        <div className='overflow-x-auto text-wrap text-base bg-white dark:bg-gray-700 p-3 rounded text-center shadow-inner mb-3'>
            <BlockMath math="F_g = G \frac{M_E m}{R_E^2}" />
        </div>
        <p className="mb-3">
            Setting the two expressions for <InlineMath math="F_g" /> equal:
        </p>
        <div className='overflow-x-auto text-wrap text-base bg-white dark:bg-gray-700 p-3 rounded text-center shadow-inner mb-3'>
            <BlockMath math="mg = G \frac{M_E m}{R_E^2}" />
        </div>
        <p className="font-semibold mb-3">
            Notice something important: the mass of the falling object (<InlineMath math="m" />) cancels out!
             <div className='overflow-x-auto text-wrap text-lg bg-white dark:bg-gray-700 p-3 rounded text-center shadow-inner my-2'>
                <BlockMath math="g = G \frac{M_E}{R_E^2}" />
            </div>
            This means the acceleration due to gravity near Earth's surface is the <strong className="text-green-600 dark:text-green-400">same for all objects</strong>, regardless of their mass (ignoring air resistance). This is what Galileo observed!
        </p>
        <p className="mb-3 text-sm">
             Plugging in the values for <InlineMath math="G" />, Earth's mass (<InlineMath math="M_E \approx 5.97 \times 10^{24}" /> kg), and Earth's average radius (<InlineMath math="R_E \approx 6.37 \times 10^6" /> m), we get:
             <InlineMath math="g \approx 9.8 \, \text{m/s}^2" />.
        </p>
         {/* Mini Check Question */}
         <MiniCheckQuestion
             question="What properties of a planet determine the acceleration due to gravity (g) on its surface?"
             correctAnswer="The planet's mass and its radius."
             explanation="As shown in the formula g = GM/R², 'g' depends directly on the planet's mass (M) and inversely on the square of its radius (R). The mass of the falling object cancels out."
         />
         {/* YouTube Embed */}
         <YouTubeEmbed
            videoId="4N7SqhIHNig"
            title="Video: Why Everything Falls at the Same Rate (Ignoring Air Resistance)"
         />
      </section>

      {/* --- Gravity and Orbits Section --- */}
       <section className="bg-sky-50 dark:bg-gray-800 p-4 rounded-lg shadow mb-8 border-l-4 border-sky-500 dark:border-sky-300">
        <h2 className="text-2xl font-semibold mt-2 mb-4 text-sky-700 dark:text-sky-300">Gravity Keeps Things in Orbit</h2>
        {/* ... content for this section ... */}
         <p className="mb-3">
            How does gravity explain why planets orbit the Sun, or moons orbit planets? An object in orbit is constantly changing direction, meaning it's accelerating towards the center of its orbit. This requires a force pointing towards the center, called the <strong className="text-sky-600 dark:text-sky-400">centripetal force</strong> (<InlineMath math="F_c" />).
        </p>
         <div className='overflow-x-auto text-wrap text-base bg-white dark:bg-gray-700 p-3 rounded text-center shadow-inner mb-3'>
            <BlockMath math="F_c = \frac{mv^2}{r}" />
        </div>
        <p className="mb-3">
            For planets orbiting the Sun, or moons orbiting planets, the <strong className="text-purple-600 dark:text-purple-400">gravitational force IS the centripetal force</strong>! It's the Sun's gravity pulling on the planet that continuously bends its path into an orbit.
        </p>
        <p className="mb-3">
            Setting the gravitational force equal to the required centripetal force (using <InlineMath math="m_p" /> for planet mass, <InlineMath math="M_S" /> for Sun mass):
        </p>
        <div className='overflow-x-auto text-wrap text-base bg-white dark:bg-gray-700 p-3 rounded text-center shadow-inner mb-3'>
            <BlockMath math="\underbrace{G \frac{M_S m_p}{r^2}}_{\text{Gravitational Force}} = \underbrace{\frac{m_p v^2}{r}}_{\text{Centripetal Force}}" />
        </div >
        <p className="mb-3">
            Again, the mass of the orbiting object (<InlineMath math="m_p" />) cancels out! Simplifying gives the required orbital speed (<InlineMath math="v" />):
        </p>
         <div className='overflow-x-auto text-wrap text-lg bg-white dark:bg-gray-700 p-3 rounded text-center shadow-inner mb-3'>
            <BlockMath math="v^2 = \frac{G M_S}{r} \quad \implies \quad v = \sqrt{\frac{G M_S}{r}}" />
        </div>
         <p className="mb-3 text-sm">
             This tells us that planets farther from the Sun (<InlineMath math="r" /> is larger) orbit more slowly (<InlineMath math="v" /> is smaller).
        </p>

        {/* Kepler's 3rd Law Derivation */}
         <h3 className="text-xl font-semibold mt-6 mb-2 text-sky-700 dark:text-sky-300">Connecting to Kepler's 3rd Law</h3>
        {/* ... content ... */}
        <p className="mb-3">
            We know that for circular motion, speed is distance/time, so <InlineMath math="v = 2\pi r / T" />, where <InlineMath math="T" /> is the orbital period. Substituting this into the <InlineMath math="v^2" /> equation above:
        </p>
        <div className='overflow-x-auto text-wrap text-base bg-white dark:bg-gray-700 p-3 rounded text-center shadow-inner mb-3'>
            <BlockMath math="\left( \frac{2\pi r}{T} \right)^2 = \frac{G M_S}{r}" />
        </div >
         <div className='overflow-x-auto text-wrap text-base bg-white dark:bg-gray-700 p-3 rounded text-center shadow-inner mb-3'>
             <BlockMath math="\frac{4\pi^2 r^2}{T^2} = \frac{G M_S}{r}" />
         </div>
        <p className="mb-3">
            Rearranging to group <InlineMath math="T" /> and <InlineMath math="r" />:
        </p>
         <div className='overflow-x-auto text-wrap text-lg bg-white dark:bg-gray-700 p-3 rounded text-center shadow-inner mb-3'>
             <BlockMath math="\frac{T^2}{r^3} = \frac{4\pi^2}{G M_S}" />
         </div>
         <p className="mb-3">
            Look familiar? The right side (<InlineMath math="4\pi^2 / GM_S" />) is a constant for all planets orbiting the Sun (<InlineMath math="M_S" />). This is exactly <strong className="text-amber-600 dark:text-amber-400">Kepler's Third Law</strong> (<InlineMath math="T^2/r^3 = K" />)! Newton's law of gravity provides the fundamental explanation for Kepler's empirically derived law.
        </p>

        {/* Mini Check Question */}
        <MiniCheckQuestion
            question="What force acts as the centripetal force keeping the Earth in orbit around the Sun?"
            correctAnswer="The gravitational force exerted by the Sun on the Earth."
            explanation="Gravity provides the inward pull necessary to constantly change the Earth's direction and keep it moving in its orbital path around the Sun."
         />
        {/* YouTube Embed */}
        <YouTubeEmbed
            videoId="0EVhnN3t_T4"
            title="Video: How Orbits Work (Falling Around the Earth)"
         />

        {/* PhET Simulation 2 */}
         <div className="my-6 p-4 border rounded-lg shadow bg-gray-100 dark:bg-gray-900">
             {/* ... PhET sim content ... */}
            <h4 className="text-lg font-semibold mb-2 text-center">Explore with PhET: Gravity and Orbits</h4>
            <p className="text-sm text-center mb-3">This simulation lets you launch objects and see how gravity affects their paths. Try creating stable orbits, or see what happens if gravity is turned off! Observe the velocity and force vectors.</p>
            <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-700 rounded bg-black">
                <iframe src="https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_en.html"
                className='absolute top-0 left-0 w-full h-full'
                allowFullScreen
                title="PhET Gravity and Orbits Simulation">
                    <p className="text-white text-center pt-10">Loading PhET Simulation...</p>
                </iframe>
            </div>
         </div>
      </section>

       {/* --- Quiz Button --- */}
       <div className='flex justify-center items-center mt-10'>
          <button
            onClick={() => setShowQuiz(true)}
            className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg shadow-md dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Test Your Gravity Knowledge!
          </button>
        </div>

      {/* --- Quiz Modal --- */}
      {showQuiz && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl">
             <button onClick={resetQuiz} className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-2xl" aria-label="Close quiz">×</button>
             <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Universal Gravitation Quiz</h2>
             <div className="space-y-6">
              {quizQuestions.map((q, index) => (
                // IMPORTANT: Make sure your QuizQuestion component DEFINES questionNumber in its props
                // If it doesn't, remove questionNumber={index + 1} below.
                <QuizQuestion
                  key={index}
                  // questionNumber={index + 1} // This prop caused the TS2322 error if not defined in QuizQuestion
                  question={q.question}
                  options={q.options}
                  correctAnswer={q.correctAnswer}
                  hint={q.hint}
                  selectedAnswer={selectedAnswers[index]}
                  showResults={showResults}
                  onSelectAnswer={(answerIndex: number) => handleAnswerSelect(index, answerIndex)} // Explicitly type answerIndex if needed
                />
              ))}
             </div>
             {/* Quiz Buttons and Results */}
             <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                 {!showResults ? (
                     <button onClick={handleSubmit} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors disabled:opacity-50" disabled={selectedAnswers.includes(null)}>
                         Submit Answers
                     </button>
                 ) : <div/>}
                 <button onClick={resetQuiz} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors">
                     Close Quiz
                 </button>
             </div>
            {showResults && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg text-center">
                 <h3 className="text-xl font-bold mb-2 dark:text-white">Quiz Results</h3>
                 <p className="text-lg dark:text-gray-200">You got <strong className="text-blue-600 dark:text-blue-400">{score}</strong> out of <strong className="text-blue-600 dark:text-blue-400">{quizQuestions.length}</strong> questions correct!</p>
                 <p className="text-2xl font-bold mt-1 dark:text-white">({((score / quizQuestions.length) * 100).toFixed(0)}%)</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
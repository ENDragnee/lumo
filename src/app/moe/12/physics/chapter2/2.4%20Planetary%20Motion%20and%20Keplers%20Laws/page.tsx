'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, useMemo, ChangeEvent } from 'react'; // Added ChangeEvent
import QuizQuestion from '@/components/QuizQuestion'; // Assuming this component exists and works
import 'katex/dist/katex.min.css';

// --- Type Definitions for Component Props ---

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

// Assuming QuizQuestionProps looks something like this (adjust based on your actual component)
// If your QuizQuestion component doesn't expect 'questionNumber', remove it here AND where it's passed below.
interface QuizQuestionProps {
    key: number;
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
    label, unit, min, max, step, value, onChange, formulaSymbol
}: InteractiveSliderProps) { // Apply Props type
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value));
  };

  return (
    <div className="mb-4">
      <label htmlFor={label} className="block text-sm font-medium mb-1">
        {label} (<InlineMath math={formulaSymbol} /> = {value.toFixed(unit === 'AU' || unit === 'years' ? 2 : 0)} {unit})
      </label>
      <input
        type="range"
        id={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange} // Use typed handler
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600 dark:accent-indigo-400"
      />
       <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{min} {unit}</span>
          <span>{max} {unit}</span>
        </div>
    </div>
  );
}

// YouTube Embed Component
function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) { // Apply Props type
  return (
    <div className="my-6">
      <p className="mb-2 font-semibold">{title}:</p>
      <div className="aspect-w-16 aspect-h-9">
         <iframe
           className="w-full h-full rounded-lg shadow-md"
           src={`https://www.youtube.com/embed/${videoId}`}
           title={title} // Use prop directly
           frameBorder="0"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           allowFullScreen>
         </iframe>
      </div>
    </div>
  );
}

// Mini Interactive Question Component
function MiniCheckQuestion({ question, correctAnswer, explanation }: MiniCheckQuestionProps) { // Apply Props type
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

export default function PlanetaryMotionAndKeplersLaws() {
  // --- State variables remain unchanged ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [eccentricity, setEccentricity] = useState(0.5);
  const [period1, setPeriod1] = useState(1.00);
  const [radius1, setRadius1] = useState(1.00);
  const [period2, setPeriod2] = useState(1.88);
  const [radius2, setRadius2] = useState(1.52);

  // --- Memoized calculations remain unchanged ---
  const keplerConstant1 = useMemo(() => {
      if (radius1 === 0) return NaN;
      return (Math.pow(period1, 2) / Math.pow(radius1, 3));
  }, [period1, radius1]);

  const keplerConstant2 = useMemo(() => {
      if (radius2 === 0) return NaN;
      return (Math.pow(period2, 2) / Math.pow(radius2, 3));
  }, [period2, radius2]);

  // --- Quiz handlers remain unchanged ---
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

  // --- Helper function remains unchanged ---
  const getEccentricityDescription = (e: number): string => {
      if (e === 0) return "A perfect circle! The two foci merge at the center.";
      if (e < 0.3) return "A slightly flattened circle. Foci are close to the center.";
      if (e < 0.7) return "A noticeable ellipse. Foci are clearly separated.";
      if (e < 0.9) return "A very elongated ellipse. Foci are far from the center.";
      return "Almost a parabola! Extremely elongated. (Max eccentricity for an ellipse is < 1)";
  };

  // --- JSX structure remains largely unchanged, only applying typed components ---
  return (
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto text-justify dark:text-gray-300">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">2.4 Planetary Motion & Kepler’s Laws</h1>

      {/* Historical Context Section */}
      <section className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow mb-8">
        {/* ... section content ... */}
        <h2 className="text-2xl font-semibold mt-2 mb-4 text-gray-700 dark:text-gray-300">From Earth-Centered to Sun-Centered</h2>
        <p className="mb-3">
          For centuries, people believed Earth was the center of everything (the <strong className="text-red-600 dark:text-red-400">Geocentric Model</strong>, championed by Ptolemy). It seemed obvious!
        </p>
        <p className="mb-3">
          However, careful observations didn't quite fit. Nicolaus Copernicus bravely suggested maybe the Sun was the center (the <strong className="text-green-600 dark:text-green-400">Heliocentric Model</strong>). This was revolutionary!
        </p>
        <p>
          Later, Tycho Brahe made incredibly precise measurements of planet positions. His assistant, Johannes Kepler, used this data goldmine to figure out the *mathematical rules* governing how planets move – Kepler's Laws.
        </p>
        <YouTubeEmbed
            videoId="qOHZdK6F_58"
            title="Video: Geocentric vs. Heliocentric Models"
         />
      </section>

      {/* Kepler's First Law Section */}
      <section className="bg-indigo-50 dark:bg-gray-800 p-4 rounded-lg shadow mb-8 border-l-4 border-indigo-500 dark:border-indigo-300">
         {/* ... section content ... */}
          <h2 className="text-2xl font-semibold mt-2 mb-4 text-indigo-700 dark:text-indigo-300">1st Law: The Law of Ellipses</h2>
        <p className="mb-3">
            Kepler realized planets don't orbit in perfect circles, but in <strong className="text-indigo-600 dark:text-indigo-400">ellipses</strong>. An ellipse is like a squashed circle.
        </p>
        <p className="mb-3">
            Crucially, the Sun isn't at the *center* of the ellipse, but at one of its two <strong className="text-indigo-600 dark:text-indigo-400">foci</strong> (plural of focus). This means a planet's distance from the Sun changes as it orbits.
        </p>
         <div className="text-sm p-2 bg-white dark:bg-gray-700 rounded shadow-inner my-3">
             <strong>Analogy:</strong> Imagine two pins (the foci) on a board, a loop of string around them, and a pencil keeping the string taut. As you move the pencil, it traces an ellipse! The sum of the distances from the pencil to each pin stays constant (the string length).
         </div>
         <div className="mt-5 p-4 border border-indigo-200 dark:border-indigo-700 rounded-md bg-white dark:bg-gray-700">
            <h4 className="text-lg font-semibold mb-3 text-indigo-800 dark:text-indigo-200">Orbit Shape: Eccentricity (<InlineMath math="e" />)</h4>
            <p className="text-sm mb-3">Eccentricity measures how "squashed" an ellipse is. <InlineMath math="e=0" /> is a perfect circle, and <InlineMath math="e" /> close to 1 is a very elongated ellipse.</p>
            <InteractiveSlider
                label="Adjust Eccentricity" unit="" min={0} max={0.95} step={0.05}
                value={eccentricity} onChange={setEccentricity} formulaSymbol="e"
            />
            <div className="mt-2 p-2 bg-indigo-100 dark:bg-gray-600 rounded">
                <p className="text-sm font-medium text-center text-indigo-700 dark:text-indigo-300">
                    {getEccentricityDescription(eccentricity)}
                </p>
            </div>
         </div>
          <MiniCheckQuestion
              question="In Kepler's First Law, where is the Sun located within the planet's elliptical orbit?"
              correctAnswer="At one of the two foci."
              explanation="The Sun is not at the center of the ellipse (unless the orbit is perfectly circular, e=0), but offset at one focus point."
          />
         <YouTubeEmbed
            videoId="qd2hZTKIb40"
            title="Video: Understanding Ellipses and Kepler's 1st Law"
         />
      </section>

      {/* Kepler's Second Law Section */}
      <section className="bg-teal-50 dark:bg-gray-800 p-4 rounded-lg shadow mb-8 border-l-4 border-teal-500 dark:border-teal-300">
          {/* ... section content ... */}
          <h2 className="text-2xl font-semibold mt-2 mb-4 text-teal-700 dark:text-teal-300">2nd Law: The Law of Equal Areas</h2>
        <p className="mb-3">
            This law describes *how fast* planets move. It states: A line connecting a planet to the Sun sweeps out <strong className="text-teal-600 dark:text-teal-400">equal areas in equal amounts of time</strong>.
        </p>
        <p className="mb-3">
            Imagine cutting the orbit into time slices (e.g., 30-day intervals). The area of the "pizza slice" swept out by the planet-Sun line will be the same for every 30-day period.
        </p>
        <p className="font-semibold mb-3">
            What does this mean for speed?
             <ul className="list-disc list-inside ml-4 font-normal space-y-1 mt-1">
                 <li>When the planet is <strong className="text-red-600 dark:text-red-400">closer</strong> to the Sun (at <strong className="text-red-500">perihelion</strong>), the "slice" is short but wide. To cover the same area in the same time, the planet must move <strong className="text-red-600 dark:text-red-400">faster</strong> along its orbital path.</li>
                 <li>When the planet is <strong className="text-blue-600 dark:text-blue-400">farther</strong> from the Sun (at <strong className="text-blue-500">aphelion</strong>), the "slice" is long but narrow. The planet moves <strong className="text-blue-600 dark:text-blue-400">slower</strong> to sweep out the same area in that time.</li>
             </ul>
        </p>
         <MiniCheckQuestion
             question="According to Kepler's Second Law, when does a planet travel fastest in its orbit?"
             correctAnswer="When it is closest to the Sun (perihelion)."
             explanation="To sweep out the same area in the same time when the radius (planet-Sun line) is shorter, the planet must cover a longer arc distance, meaning it moves faster."
         />
         <YouTubeEmbed
            videoId="jryS3ua4O3g"
            title="Video: Visualizing Kepler's 2nd Law (Equal Areas)"
         />
      </section>

      {/* Kepler's Third Law Section */}
       <section className="bg-amber-50 dark:bg-gray-800 p-4 rounded-lg shadow mb-8 border-l-4 border-amber-500 dark:border-amber-300">
         {/* ... section content ... */}
          <h2 className="text-2xl font-semibold mt-2 mb-4 text-amber-700 dark:text-amber-300">3rd Law: The Law of Harmonies</h2>
        <p className="mb-3">
            This law relates a planet's orbital period (<InlineMath math="T" />, the time for one full orbit) to its average distance from the Sun (<InlineMath math="R" />, the semi-major axis of the ellipse).
        </p>
        <p className="mb-3">
            It states: The square of the orbital period (<InlineMath math="T^2" />) is directly proportional to the cube of the average orbital radius (<InlineMath math="R^3" />).
        </p>
        <div className='overflow-x-auto text-wrap text-lg bg-white dark:bg-gray-700 p-3 rounded text-center shadow-inner mb-3'>
            <BlockMath math="\frac{T^2}{R^3} = K \quad (\text{constant})" />
        </div>
        <p className="mb-4">
            The amazing part: This constant <InlineMath math="K" /> is (almost exactly) the <strong className="text-amber-600 dark:text-amber-400">same for all planets orbiting the same star</strong> (like our Sun)! It doesn't depend on the planet's mass. This allows us to compare different planets in the same system.
        </p>

         <div className="mt-5 p-4 border border-amber-200 dark:border-amber-700 rounded-md bg-white dark:bg-gray-700">
            <h4 className="text-lg font-semibold mb-3 text-amber-800 dark:text-amber-200">Interactive Kepler's 3rd Law Calculator</h4>
            <p className="text-sm mb-4">Compare two planets. Adjust their orbital periods (in Earth years) and average distances (in Astronomical Units, AU, where 1 AU = Earth's average distance). See if <InlineMath math="T^2 / R^3" /> stays constant!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                     <h5 className="font-semibold mb-2 text-center">Planet 1 (e.g., Earth)</h5>
                     <InteractiveSlider
                         label="Period (T₁)" unit="years" min={0.1} max={300} step={0.1}
                         value={period1} onChange={setPeriod1} formulaSymbol="T_1"
                     />
                     <InteractiveSlider
                         label="Avg. Radius (R₁)" unit="AU" min={0.1} max={40} step={0.1}
                         value={radius1} onChange={setRadius1} formulaSymbol="R_1"
                     />
                      <div className="mt-2 p-2 bg-amber-100 dark:bg-gray-600 rounded text-center">
                         <p className="text-sm font-medium">
                            <InlineMath math="T_1^2 / R_1^3 \approx" /> {keplerConstant1.toFixed(3)}
                         </p>
                      </div>
                 </div>
                 <div>
                     <h5 className="font-semibold mb-2 text-center">Planet 2 (e.g., Mars)</h5>
                     <InteractiveSlider
                         label="Period (T₂)" unit="years" min={0.1} max={300} step={0.1}
                         value={period2} onChange={setPeriod2} formulaSymbol="T_2"
                     />
                     <InteractiveSlider
                         label="Avg. Radius (R₂)" unit="AU" min={0.1} max={40} step={0.1}
                         value={radius2} onChange={setRadius2} formulaSymbol="R_2"
                     />
                     <div className="mt-2 p-2 bg-amber-100 dark:bg-gray-600 rounded text-center">
                        <p className="text-sm font-medium">
                            <InlineMath math="T_2^2 / R_2^3 \approx" /> {keplerConstant2.toFixed(3)}
                        </p>
                     </div>
                 </div>
            </div>
             <p className="text-xs text-center mt-4 text-gray-600 dark:text-gray-400">
                 Note: Values are approximate. The constant is nearly 1.00 when using units of Earth years and AU for planets around our Sun.
             </p>
         </div>
         <MiniCheckQuestion
             question="If Planet A is farther from the Sun than Planet B, what does Kepler's Third Law imply about their orbital periods?"
             correctAnswer="Planet A will have a longer orbital period than Planet B."
             explanation="Since T²/R³ is constant, if R (distance) increases, T (period) must also increase to keep the ratio the same (specifically, T must increase proportionally to R^(3/2))."
         />
         <YouTubeEmbed
            videoId="KbXVpdlmYZo"
            title="Video: Understanding Kepler's 3rd Law (Law of Harmonies)"
         />
          <details className="mt-4 text-sm">
                <summary className="cursor-pointer font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Show Data Table (Earth & Mars)</summary>
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

      {/* PhET Simulation Section */}
       <div className="my-8 p-4 border dark:border-gray-600 rounded-lg shadow bg-gray-50 dark:bg-gray-800">
         {/* ... section content ... */}
         <h3 className="text-xl font-semibold mb-4 text-center">Explore with PhET Simulation</h3>
        <p className="text-sm text-center mb-4">This powerful simulation lets you visualize all three of Kepler's Laws in action. Try changing the planet, turning on tracers, and observing the velocity and forces.</p>
        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-700 rounded bg-black">
          <iframe src="https://phet.colorado.edu/sims/html/keplers-laws/latest/keplers-laws_en.html"
            className='absolute top-0 left-0 w-full h-full'
            allowFullScreen
            title="PhET Kepler's Laws Simulation">
             <p className="text-white text-center pt-10">Loading PhET Simulation...</p>
          </iframe>
        </div>
      </div>

       {/* Quiz Button */}
       <div className='flex justify-center items-center mt-10'>
         {/* ... button content ... */}
          <button
            onClick={() => setShowQuiz(true)}
            className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg shadow-md dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Take the Kepler's Laws Quiz!
          </button>
        </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl">
             <button onClick={resetQuiz} className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-2xl" aria-label="Close quiz">×</button>
             <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Kepler's Laws Quiz</h2>
             <div className="space-y-6">
              {quizQuestions.map((q, index) => (
                // IMPORTANT: Ensure your QuizQuestion component defines 'questionNumber' in its props interface.
                // If not, remove the line below.
                <QuizQuestion
                  key={index}
                  // questionNumber={index + 1} // Prop causing TS2322 if not defined in QuizQuestion
                  question={q.question}
                  options={q.options}
                  correctAnswer={q.correctAnswer}
                  hint={q.hint}
                  selectedAnswer={selectedAnswers[index]}
                  showResults={showResults}
                  onSelectAnswer={(answerIndex: number) => handleAnswerSelect(index, answerIndex)} // Explicit type if needed
                />
              ))}
             </div>
             {/* Buttons and Results */}
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
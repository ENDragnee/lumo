'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, useMemo, ChangeEvent } from 'react';
import QuizQuestion from '@/components/QuizQuestion';
import 'katex/dist/katex.min.css';
import SimulationPanel from '@/components/content-components/SimulationPanel';
import YouTubePanel from '@/components/content-components/YouTubePanel';

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

// !! Ensure your QuizQuestion component accepts 'questionNumber' if you keep it below !!
interface QuizQuestionProps {
    key: number;
    questionNumber: number; // Ensure QuizQuestion accepts this!
    question: string;
    options: string[];
    correctAnswer: number;
    hint: string;
    selectedAnswer: number | null;
    showResults: boolean;
    onSelectAnswer: (answerIndex: number) => void;
}

// --- Reusable Components (Typed) ---

// Slider Component (Apply Accent Color from Palette)
function InteractiveSlider({
    label, unit, min, max, step, value, onChange, formulaSymbol
}: InteractiveSliderProps) {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(parseFloat(event.target.value));
    };

  return (
    <div className="mb-4">
      <label htmlFor={label} className="block text-sm font-medium mb-1 font-inter dark:text-light-gray text-dark-gray"> {/* Apply UI Font */}
        {label} (<InlineMath math={formulaSymbol} /> = {value} {unit})
      </label>
      <input
        type="range"
        id={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        // Apply Accent Color (Teal for Physics)
        className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal dark:accent-teal"
      />
       <div className="flex justify-between text-xs font-inter text-gray-500 dark:text-gray-400"> {/* Apply UI Font */}
          <span>{min} {unit}</span>
          <span>{max} {unit}</span>
        </div>
    </div>
  );
}

// --- Page Specific Data ---
const quizQuestions = [
  // ... (quiz questions array remains unchanged)
    {
        "question": "What is torque in rotational dynamics?",
        "options": [
            "The force that acts along a straight line",
            "The rotational effect of force",
            "The resistance to linear acceleration",
            "The measure of rotational inertia"
        ],
        "correctAnswer": 1,
        "hint": "It causes an object to acquire angular acceleration."
    },
    {
        "question": "What is the formula for torque?",
        "options": [
            "τ = rF",
            "τ = rF sinθ",
            "τ = F/r",
            "τ = r²F"
        ],
        "correctAnswer": 1,
        "hint": "It involves the angle θ between r and F."
    },
    {
        "question": "What is the SI unit of torque?",
        "options": [
            "Newton meter (Nm)",
            "Kilogram meter squared (kg·m²)",
            "Joule (J)",
            "Meter per second squared (m/s²)"
        ],
        "correctAnswer": 0,
        "hint": "It combines the units of force and distance."
    },
    {
        "question": "Which rule determines the direction of torque?",
        "options": [
            "Left-hand rule",
            "Newton's second law",
            "Right-hand rule",
            "Conservation of angular momentum"
        ],
        "correctAnswer": 2,
        "hint": "It involves curling your fingers in the direction of rotation."
    },
    {
        "question": "What does the moment of inertia measure?",
        "options": [
            "Rotational inertia",
            "Linear inertia",
            "The rate of change of angular velocity",
            "The net torque acting on a body"
        ],
        "correctAnswer": 0,
        "hint": "It is the rotational analog of mass."
    },
    {
        "question": "What is the formula for the moment of inertia of a single point mass?",
        "options": [
            "I = m r²",
            "I = m r",
            "I = m r³",
            "I = m/r²"
        ],
        "correctAnswer": 0,
        "hint": "It depends on the mass and radius of rotation."
    },
    {
        "question": "What is the SI unit of moment of inertia?",
        "options": [
            "Nm",
            "kg·m",
            "kg·m²",
            "m²/s²"
        ],
        "correctAnswer": 2,
        "hint": "It combines mass and the square of distance."
    },
    {
        "question": "How do you calculate the moment of inertia for multiple particles?",
        "options": [
            "I = m₁r₁ + m₂r₂ + m₃r₃",
            "I = Σmr²",
            "I = τ/Iα",
            "I = Fd sinθ"
        ],
        "correctAnswer": 1,
        "hint": "It involves summing the products of mass and radius squared for each particle."
    },
    {
        "question": "What is the formula for net torque acting on an object?",
        "options": [
            "τ_net = Στ",
            "τ_net = ΣIα",
            "τ_net = Σmr",
            "τ_net = ΣFd"
        ],
        "correctAnswer": 0,
        "hint": "It involves summing all individual torques."
    },
    {
        "question": "What is the relationship between net torque and angular acceleration?",
        "options": [
            "τ = mα",
            "τ = Iα",
            "τ = I/α",
            "τ = Fα"
        ],
        "correctAnswer": 1,
        "hint": "It is analogous to F = ma in linear motion."
    },
    {
        "question": "How does angular acceleration relate to net torque?",
        "options": [
            "It is inversely proportional to net torque.",
            "It is directly proportional to net torque.",
            "It is independent of net torque.",
            "It depends only on the radius of rotation."
        ],
        "correctAnswer": 1,
        "hint": "Think of the rotational equivalent of Newton's second law."
    },
    {
        "question": "What does the symbol I represent in the equation τ = Iα?",
        "options": [
            "Torque",
            "Moment of inertia",
            "Angular acceleration",
            "Radius of rotation"
        ],
        "correctAnswer": 1,
        "hint": "It measures the resistance to changes in angular velocity."
    }
];


// --- Main Page Component ---
export default function RotationalDynamics() {
  // --- State variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [torqueForce, setTorqueForce] = useState(10);
  const [torqueRadius, setTorqueRadius] = useState(0.5);
  const [torqueAngle, setTorqueAngle] = useState(90);
  const [inertiaMass, setInertiaMass] = useState(2);
  const [inertiaRadius, setInertiaRadius] = useState(0.3);

  // --- Memoized calculations ---
  const calculatedTorque = useMemo(() => {
    const angleRad = torqueAngle * (Math.PI / 180);
    return (torqueRadius * torqueForce * Math.sin(angleRad)).toFixed(2);
  }, [torqueRadius, torqueForce, torqueAngle]);

  const calculatedInertia = useMemo(() => {
    return (inertiaMass * Math.pow(inertiaRadius, 2)).toFixed(3);
  }, [inertiaMass, inertiaRadius]);

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
    // Main container: Apply base colors, fonts, and padding/margins
    // Add 'font-lora' as the default body font if Lora is configured
    // Add a subtle paper texture class if desired: e.g., 'bg-paper-texture'
    <div className="bg-off-white text-dark-gray dark:bg-deep-navy dark:text-light-gray min-h-screen font-lora">
        {/* Assume Fixed Top Bar and Collapsible Sidebar are handled by a parent Layout component */}

        {/* Page Content Area with overall padding */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8"> {/* Generous margins/padding */}

            {/* Page Title: Use specified header font */}
            <h1 className="text-4xl lg:text-5xl font-bold font-playfair mb-8 lg:mb-12 text-center"> {/* Header Font */}
                2.3 Rotational Dynamics
            </h1>

            {/* Main Grid: 1 column on mobile, 12 columns on large screens with gap */}
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12"> {/* Adjusted gap */}

                {/* Left Column (Static Content): Spans 7 columns on large screens */}
                <article className="lg:col-span-7 space-y-6"> {/* Use <article> for main content */}
                    {/* Introductory Paragraph */}
                    <p className="text-lg leading-relaxed"> {/* Slightly larger leading for readability */}
                        Let's move from describing rotation (kinematics) to understanding what *causes* rotation (dynamics).
                        Just like <InlineMath math="F = ma" /> governs linear motion, rotational motion has its own key players: <strong className="text-teal font-semibold">Torque</strong> and <strong className="text-teal font-semibold">Moment of Inertia</strong>. {/* Using Teal accent */}
                    </p>

                    {/* Torque Section */}
                    <section>
                        <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2"> {/* Header Font + Style */}
                            Torque (<InlineMath math="\tau" />): The "Twisting Force"
                        </h2>
                        {/* Use smaller font-size or specific class for margin notes if implemented */}
                        {/* <span className="text-sm text-gray-500 float-right ml-4">[Margin Note: Definition of Torque]</span> */}
                        <p>
                          Torque is the rotational equivalent of linear force. It's what makes an object start rotating, stop rotating, or change its rotation speed. Think about opening a door: you apply a force, but *where* and *how* you push matters.
                        </p>
                        <p className="mt-4">
                          Imagine applying a force <InlineMath math="F" /> at a distance <InlineMath math="r" /> (the lever arm) from the pivot point (axis of rotation). The angle <InlineMath math="\theta" /> between the lever arm and the force is crucial. The formula for the magnitude of torque is:
                        </p>
                        {/* Equation Block: Centered, potentially with subtle border */}
                        <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                          <BlockMath math="τ = r F \sin\theta" />
                        </div>
                        <p>
                          <InlineMath math="\tau" /> (tau) represents torque.
                          Its SI unit is the Newton-meter (Nm).
                        </p>
                        <p className="mt-4">
                           Key points:
                           <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                             <li>Torque is maximized when the force is perpendicular to the lever arm (<InlineMath math="\theta = 90^\circ" />, so <InlineMath math="\sin\theta = 1" />).</li>
                             <li>No torque is produced if the force points directly towards or away from the pivot (<InlineMath math="\theta = 0^\circ" /> or <InlineMath math="180^\circ" />, so <InlineMath math="\sin\theta = 0" />).</li>
                             <li>A larger force (<InlineMath math="F" />) or a longer lever arm (<InlineMath math="r" />) results in greater torque.</li>
                           </ul>
                        </p>
                        {/* Torque Direction Sub-section */}
                         <h3 className="text-2xl font-semibold font-playfair mt-6 mb-3">Direction of Torque</h3> {/* Header Font */}
                         <p>
                           Torque is a vector! Its direction indicates the axis and sense of rotation it tends to cause. We use the <strong className="text-red-600 dark:text-gold font-semibold">Right-Hand Rule</strong>: {/* Using Coral/Gold accent */}
                           <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
                               <li>Point the fingers of your right hand along the direction of the lever arm (<InlineMath math="r" />).</li>
                               <li>Curl your fingers towards the direction of the force (<InlineMath math="F" />).</li>
                               <li>Your outstretched thumb points in the direction of the torque (<InlineMath math="\tau" />).</li>
                           </ol>
                           This direction is usually along the axis of rotation.
                         </p>
                    </section>

                    {/* Moment of Inertia Section */}
                    <section>
                       <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2"> {/* Header Font + Style */}
                           Moment of Inertia (<InlineMath math="I" />): Rotational Laziness
                        </h2>
                        <p>
                          Moment of Inertia (<InlineMath math="I" />) is the rotational equivalent of mass (<InlineMath math="m" />). It measures an object's resistance to changes in its rotational motion. Just like a heavier object is harder to push (more linear inertia), an object with a larger moment of inertia is harder to spin up or slow down.
                        </p>
                        <p className="mt-4">
                          Unlike mass, moment of inertia depends not only on *how much* mass there is, but also on *how that mass is distributed* relative to the axis of rotation. Mass further away from the axis contributes much more to <InlineMath math="I" />.
                        </p>
                        <p className="mt-4">
                          For a single point mass <InlineMath math="m" /> rotating at a radius <InlineMath math="r" /> from the axis, the moment of inertia is:
                        </p>
                        <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                           <BlockMath math="I = m r^2" />
                        </div>
                        <p>
                          The SI unit for moment of inertia is <InlineMath math="\text{kg} \cdot \text{m}^2" />. Notice the <InlineMath math="r^2" /> term – distance is very important!
                        </p>
                        <p className="mt-4">
                          For an object made of multiple particles:
                        </p>
                        <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                           <BlockMath math="I = \sum_i m_i r_i^2 = m_1 r_1^2 + m_2 r_2^2 + \dots" />
                        </div>
                    </section>

                     {/* Torque and Angular Acceleration Section */}
                     <section>
                        <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2"> {/* Header Font + Style */}
                            Connecting Torque, Inertia, and Acceleration
                        </h2>
                        <p>
                          Now we connect the cause (torque) with the effect (change in rotation). Just like Newton's Second Law for linear motion (<InlineMath math="F_{\text{net}} = ma" />), there's an equivalent law for rotation.
                        </p>
                        <p className="mt-4">
                          The net torque (<InlineMath math="\tau_{\text{net}} = \sum \tau" />) acting on an object is equal to its moment of inertia (<InlineMath math="I" />) times its angular acceleration (<InlineMath math="\alpha" />):
                        </p>
                        <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                           <BlockMath math="\tau_{\text{net}} = I \alpha" />
                        </div>
                        <p className="mt-4">
                           This crucial equation tells us:
                           <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                             <li>A larger net torque produces a larger angular acceleration (<InlineMath math="\alpha" />).</li>
                             <li>An object with a larger moment of inertia (<InlineMath math="I" />) will have a smaller angular acceleration for the same net torque (it's harder to accelerate).</li>
                             <li>If the net torque is zero, the angular acceleration is zero (rotational equilibrium).</li>
                           </ul>
                        </p>
                     </section>
                </article>

                {/* Right Column (Interactive Elements): Spans 5 columns on large screens */}
                {/* Use <aside> for complementary content */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">

                    {/* Interactive Panel 1: Intro Video */}
                    <YouTubePanel videoId='T99yH_gw3p8' title='Video Introduction: Torque and Moment of Inertia' />

                     {/* Interactive Panel 2: Torque Calculator */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-4 text-blue-700 dark:text-blue-300">Interactive Torque Calculator</h3> {/* UI Font */}
                        <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Play with the sliders to see how force, distance, and angle affect the torque!</p>
                        <InteractiveSlider
                            label="Force Magnitude" unit="N" min={0} max={50} step={1}
                            value={torqueForce} onChange={setTorqueForce} formulaSymbol="F"
                        />
                        <InteractiveSlider
                            label="Lever Arm Distance" unit="m" min={0.1} max={2} step={0.1}
                            value={torqueRadius} onChange={setTorqueRadius} formulaSymbol="r"
                        />
                        <InteractiveSlider
                            label="Angle between r and F" unit="°" min={0} max={180} step={5}
                            value={torqueAngle} onChange={setTorqueAngle} formulaSymbol="\theta"
                        />
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded shadow-inner text-center">
                            <p className="text-lg font-semibold font-inter text-dark-gray dark:text-light-gray"> {/* UI Font */}
                              Calculated Torque (<InlineMath math="\tau" />) = <span className="font-bold text-teal dark:text-mint">{calculatedTorque}</span> Nm {/* Accent Color */}
                            </p>
                        </div>
                    </div>

                     {/* Interactive Panel 3: Right Hand Rule Video */}
                     <YouTubePanel videoId='fuTVnSFBhwk' title='Video Explanation: Right Hand Rule for Torque' />

                    {/* Interactive Panel 4: Moment of Inertia Calculator */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-4 text-green-700 dark:text-green-300">Interactive Moment of Inertia Calculator</h3> {/* UI Font */}
                         <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">See how mass and distance affect resistance to rotation!</p>
                         <InteractiveSlider
                            label="Mass" unit="kg" min={0.1} max={10} step={0.1}
                            value={inertiaMass} onChange={setInertiaMass} formulaSymbol="m"
                         />
                         <InteractiveSlider
                            label="Radius of Rotation" unit="m" min={0.1} max={2} step={0.1}
                            value={inertiaRadius} onChange={setInertiaRadius} formulaSymbol="r"
                         />
                         <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 rounded shadow-inner text-center">
                            <p className="text-lg font-semibold font-inter text-dark-gray dark:text-light-gray"> {/* UI Font */}
                               Calculated <InlineMath math="I = mr^2" /> = <span className="font-bold text-teal dark:text-mint">{calculatedInertia}</span> kg·m² {/* Accent Color */}
                            </p>
                            <p className="text-xs font-inter text-gray-600 dark:text-gray-400 mt-1">
                                Notice doubling radius has a bigger impact than doubling mass!
                            </p>
                         </div>
                    </div>

                     {/* Interactive Panel 5: Moment of Inertia Video */}
                     <YouTubePanel videoId='ZrGhUTeIlWs' title='Video Explanation: Moment of Inertia' />

                     {/* Interactive Panel 6: Tau = I Alpha Video */}
                     <YouTubePanel videoId='lwCF0khryK8' title='Video Explanation: Tau = I Alpha' />

                    {/* Interactive Panel 7: PhET Simulation */}
                    <SimulationPanel title='Explore with PhET Simulation' description='Apply torques and see the resulting rotation. Try changing forces and object shapes!' simulationUrl='https://phet.colorado.edu/sims/cheerpj/rotation/latest/rotation.html?simulation=torque' />
                </aside>

            </div> {/* End Main Grid */}

            {/* Quiz Button: Placed after the grid, centered */}
            <div className='flex justify-center items-center mt-12 lg:mt-16'>
                <button
                    onClick={() => setShowQuiz(true)}
                    // Use Coral/Gold Accent Color for Button
                    className="w-full sm:w-1/2 lg:w-1/3 bg-coral hover:bg-opacity-80 dark:bg-gold dark:hover:bg-opacity-90 text-white dark:text-deep-navy font-bold font-inter py-3 px-6 rounded-lg transition-colors text-lg shadow-md" /* UI Font */
                >
                    Test Your Understanding!
                </button>
            </div>

        </main> {/* End Page Content Area */}

        {/* --- Quiz Modal --- */}
        {showQuiz && (
            // Use specified dark mode colors for modal background/text
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Rotational Dynamics Quiz</h2> {/* Header Font */}
                 <div className="space-y-6 font-inter"> {/* UI Font for quiz content */}
                  {quizQuestions.map((q, index) => (
                    <QuizQuestion
                      key={index}
                    // questionNumber={index + 1} // Pass question number (ensure component accepts it)
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
                 {/* Quiz Buttons and Results */}
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
        {/* Add Floating Toolbar placeholder if needed */}
        {/* <div className="fixed bottom-4 right-4 z-40"> Your Floating Toolbar Component </div> */}
    </div> // End Main Container
  );
}
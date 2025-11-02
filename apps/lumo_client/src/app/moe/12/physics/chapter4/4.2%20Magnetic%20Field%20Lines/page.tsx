'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, ChangeEvent } from 'react'; // Removed useMemo
import QuizQuestion from '@/components/QuizQuestion'; // Assuming this component exists
import 'katex/dist/katex.min.css';

// --- Type Definitions ---
// Keep relevant interfaces for consistency
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
// *** NEW Quiz Questions specific to Magnetic Field Lines and Ampere's Law ***
const quizQuestions = [
  {
    "question": "What do magnetic field lines represent?",
    "options": [
      "The path of electric current",
      "Lines of equal temperature",
      "The direction and strength of a magnetic field",
      "Gravitational force vectors"
    ],
    "correctAnswer": 2,
    "hint": "They are a visual tool; their density indicates strength and direction is shown by arrows."
  },
  {
    "question": "If magnetic field lines are very close together in a region, what does this indicate?",
    "options": [
      "A weak magnetic field",
      "A strong magnetic field",
      "The presence of electric charge",
      "A North pole only"
    ],
    "correctAnswer": 1,
    "hint": "The density of the lines is proportional to the field's strength."
  },
  {
    "question": "What is a key property of magnetic field lines regarding their continuity?",
    "options": [
      "They start at North poles and end at South poles externally.",
      "They form closed loops, having no beginning or end.",
      "They can cross each other at points of high field strength.",
      "They only exist inside magnets."
    ],
    "correctAnswer": 1,
    "hint": "Unlike electric field lines, magnetic field lines are continuous loops."
  },
  {
    "question": "What is the direction of magnetic field lines *inside* a bar magnet?",
    "options": [
      "From North pole to South pole",
      "From South pole to North pole",
      "Radially outward from the center",
      "There are no field lines inside"
    ],
    "correctAnswer": 1,
    "hint": "To form closed loops, the lines must travel from S to N inside the magnet."
  },
  {
    "question": "Can two magnetic field lines ever cross each other?",
    "options": [
      "Yes, at the poles",
      "Yes, in strong fields",
      "No, never",
      "Only if created by electromagnets"
    ],
    "correctAnswer": 2,
    "hint": "If they crossed, it would imply the field has two different directions at one point, which is impossible."
  },
  {
    "question": "What produces the magnetic field around a straight current-carrying wire?",
    "options": [
      "Static charges in the wire",
      "The resistance of the wire",
      "The movement of electric charges (the current)",
      "The temperature of the wire"
    ],
    "correctAnswer": 2,
    "hint": "Oersted's discovery showed the link between moving charges and magnetism."
  },
  {
    "question": "Ampere's Law relates the magnetic field created by a current to what property of the current?",
    "options": [
      "The voltage driving the current",
      "The resistance of the wire",
      "The magnitude (size) of the current",
      "The frequency of the current"
    ],
    "correctAnswer": 2,
    "hint": "The law states B is proportional to I (B = μ₀I / (2πr) for a long straight wire)."
  },
  {
    "question": "What does the constant μ₀ represent in Ampere's Law?",
    "options": [
      "The permittivity of free space",
      "The permeability of free space",
      "The resistance of free space",
      "Planck's constant"
    ],
    "correctAnswer": 1,
    "hint": "μ₀ relates to how easily a magnetic field can be established in a vacuum."
  }
];


// --- KaTeX String Constants ---
const katex_B = 'B';
const katex_mu0 = '\\mu_0';
const katex_I = 'I';
// Simplified Ampere's Law for the text (Note: this is conceptual, not the full integral form or specific case)
const katex_Ampere_Simple = `B \\propto I`; // Proportionality
const katex_Ampere_Full = `\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{enc}`; // Full Law (optional display)


// --- Main Page Component ---
const MagneticFieldLinesPage = () => { // Renamed component
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

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
                4.2 Magnetic Field Lines {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction to Field Lines */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Visualizing Magnetic Fields
                         </h2>
                         <p className="leading-relaxed">
                            Since magnetic fields are invisible, we use <strong className="text-teal dark:text-teal font-semibold">magnetic field lines</strong> as a visual tool to represent their direction and strength. Think of them like contour lines on a map, but for magnetism.
                         </p>
                         <p className="mt-3 leading-relaxed">
                            You can visualize these lines by sprinkling iron filings around a magnet; the filings align themselves along the field lines, revealing the pattern.
                         </p>
                    </section>

                    {/* Properties of Field Lines */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Properties of Magnetic Field Lines
                         </h2>
                         <ul className="list-decimal list-outside ml-6 space-y-2 marker:text-teal marker:dark:text-mint marker:font-semibold">
                             <li>
                                <span className="font-semibold">Direction:</span> The direction of the magnetic field (<InlineMath math={katex_B}/>) at any point is tangent to the field line passing through that point. A compass needle will align itself tangent to the field line.
                             </li>
                             <li>
                                 <span className="font-semibold">Strength:</span> The density of the field lines (how close together they are) represents the strength of the magnetic field. Closer lines indicate a stronger field.
                             </li>
                             <li>
                                <span className="font-semibold">No Crossing:</span> Magnetic field lines <strong className="text-coral dark:text-gold">never cross</strong> each other. If they did, it would imply the field has two different directions at the same point, which is physically impossible. The field at any point is unique.
                             </li>
                             <li>
                                 <span className="font-semibold">Closed Loops:</span> Unlike electric field lines (which start on positive charges and end on negative ones), magnetic field lines are always <strong className="text-teal dark:text-teal font-semibold">continuous closed loops</strong>. They have no beginning or end.
                             </li>
                             <li>
                                 <span className="font-semibold">External/Internal Path:</span> By convention, outside a magnet, field lines emerge from the North pole and enter the South pole. To complete the loop, they travel <strong className="text-teal dark:text-teal">from South to North *inside* the magnet</strong>.
                             </li>
                         </ul>
                    </section>

                    {/* Fields from Currents */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Magnetic Fields from Electric Currents
                         </h2>
                          <p className="leading-relaxed">
                            As Oersted discovered, moving electric charges (currents) create magnetic fields. A current flowing through a straight wire produces circular magnetic field lines centered on the wire. The direction of these field lines can be found using the <strong className="text-coral dark:text-gold font-semibold">Right-Hand Rule</strong> (point thumb in current direction, fingers curl in field direction).
                          </p>
                          <p className="mt-3 leading-relaxed">
                            Placing a compass near the wire will cause its needle to align with these circular field lines. If the current is turned off, the magnetic field disappears instantly. This is the principle behind electromagnets.
                          </p>
                     </section>

                     {/* Ampere's Law */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Ampere's Law (Conceptual)
                         </h2>
                         <p className="leading-relaxed">
                             Ampere's Law provides a quantitative relationship between electric current and the magnetic field it produces. In essence, it states that the magnetic field (<InlineMath math={katex_B}/>) circulating around a current (<InlineMath math={katex_I}/>) is directly proportional to the magnitude of that current.
                         </p>
                         <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                            {/* Simplified proportionality */}
                             <BlockMath math={katex_Ampere_Simple} />
                         </div>
                          <p className="leading-relaxed">
                             The constant of proportionality involves <InlineMath math={katex_mu0}/>, the <strong className="text-teal dark:text-teal font-semibold">permeability of free space</strong>, which reflects how easily a magnetic field can form in a vacuum. The full form of Ampere's Law involves integrating the magnetic field around a closed loop encompassing the current.
                          </p>
                           {/* Optional: Display full Ampere's Law */}
                           {/* <div className='my-4 p-2 text-xs bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-center'>
                              <BlockMath math={katex_Ampere_Full} />
                           </div> */}
                     </section>

                </article>

                {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                     {/* Panel 1: Visualizing Field Lines Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="V-SIs3G5hCg" title="Video: Magnetic Field Lines Explained"/>
                     </div>

                    {/* Panel 2: Properties Mini Question */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Field Line Properties Check</h3>
                          <MiniCheckQuestion
                             question="Why must magnetic field lines form closed loops?"
                             correctAnswer="Because there are no magnetic monopoles (isolated N or S poles) for lines to start or end on."
                             explanation="Unlike electric charges, magnetic poles always come in pairs (N/S). Field lines exiting a North pole must eventually return to a South pole, forming a loop."
                         />
                    </div>

                    {/* Panel 3: Field from Wire Video */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="JkO5T7elGS8" title="Video: Magnetic Field Around a Current-Carrying Wire"/>
                     </div>

                     {/* Panel 4: Ampere's Law Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Ampere's Law Check</h3>
                         <MiniCheckQuestion
                            question="If you double the current flowing through a long straight wire, what happens to the magnetic field strength at a fixed distance from the wire?"
                            correctAnswer="The magnetic field strength doubles."
                            explanation="Ampere's Law shows the magnetic field (B) is directly proportional to the current (I). If I doubles, B doubles (assuming distance remains constant)."
                         />
                    </div>

                      {/* Panel 5: PhET Simulation - Magnets and Electromagnets */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Magnets & Electromagnets</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Visualize fields from bar magnets and electromagnets. Observe the field lines.</p>
                        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                            <a href="https://phet.colorado.edu/sims/html/magnets-and-electromagnets/latest/magnets-and-electromagnets_en.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open PhET: Magnets & Electromagnets (New Tab)</span>
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
                    Test Your Field Line Knowledge!
                </button>
            </div>
        </main>

        {/* Quiz Modal */}
         {showQuiz && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Magnetic Field Lines Quiz</h2>
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
MagneticFieldLinesPage.displayName = 'MagneticFieldLinesPage';

export default MagneticFieldLinesPage;
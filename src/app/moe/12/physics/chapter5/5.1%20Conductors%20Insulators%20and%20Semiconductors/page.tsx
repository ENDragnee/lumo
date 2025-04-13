'use client';

import { InlineMath, BlockMath } from 'react-katex'; // Keep imports
import { useState, ChangeEvent } from 'react'; // Removed useMemo
import QuizQuestion from '@/components/QuizQuestion'; // Assuming this component exists
import 'katex/dist/katex.min.css';

// --- Type Definitions ---
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
const quizQuestions = [
  {
    "question": "What distinguishes conductors like metals from insulators?",
    "options": [
      "Conductors have a higher melting point.",
      "Conductors possess free electrons that can move easily, insulators do not.", // Correct
      "Insulators are always solids, conductors can be liquids.",
      "Conductors are magnetic, insulators are not."
    ],
    "correctAnswer": 1,
    "hint": "The availability of charge carriers (free electrons) is key to electrical conductivity."
  },
  {
    "question": "Materials like rubber, glass, and plastic are examples of:",
    "options": [
      "Conductors",
      "Semiconductors",
      "Insulators", // Correct
      "Superconductors"
    ],
    "correctAnswer": 2,
    "hint": "These materials resist the flow of electric current due to tightly bound electrons."
  },
  {
    "question": "How does the conductivity of a pure (intrinsic) semiconductor change with temperature?",
    "options": [
      "Conductivity decreases as temperature increases.",
      "Conductivity increases as temperature increases.", // Correct
      "Conductivity remains constant regardless of temperature.",
      "It becomes a superconductor at high temperatures."
    ],
    "correctAnswer": 1,
    "hint": "Higher temperature provides energy for electrons to break free from bonds and conduct."
  },
  {
    "question": "What is the process of intentionally adding impurities to a pure semiconductor called?",
    "options": [
      "Annealing",
      "Doping", // Correct
      "Sintering",
      "Oxidation"
    ],
    "correctAnswer": 1,
    "hint": "This process is used to control the conductivity and type (N or P) of the semiconductor."
  },
  {
    "question": "Doping silicon (Group IV) with phosphorus (Group V) creates which type of semiconductor?",
    "options": [
      "P-type",
      "N-type", // Correct
      "Intrinsic type",
      "Insulating type"
    ],
    "correctAnswer": 1,
    "hint": "Group V elements have one extra valence electron compared to silicon, donating free electrons (Negative charge carriers)."
  },
  {
    "question": "Doping silicon (Group IV) with boron (Group III) creates which type of semiconductor?",
    "options": [
      "P-type", // Correct
      "N-type",
      "Intrinsic type",
      "Conducting type"
    ],
    "correctAnswer": 0,
    "hint": "Group III elements have one fewer valence electron than silicon, creating 'holes' (Positive charge carriers)."
  },
  {
    "question": "What are the majority charge carriers in an N-type semiconductor?",
    "options": [
      "Holes",
      "Electrons", // Correct
      "Protons",
      "Ions"
    ],
    "correctAnswer": 1,
    "hint": "N-type is doped with donor atoms, providing excess free electrons."
  },
  {
    "question": "What are the majority charge carriers in a P-type semiconductor?",
    "options": [
      "Holes", // Correct
      "Electrons",
      "Neutrons",
      "Photons"
    ],
    "correctAnswer": 0,
    "hint": "P-type is doped with acceptor atoms, creating electron vacancies (holes)."
  }
];

// --- KaTeX Constants (if needed) ---
const katex_Si = 'Si';
const katex_Ge = 'Ge';
const katex_GaAs = 'GaAs';

// --- Main Page Component ---
const SemiconductorsPage = () => { // Renamed component
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
                Unit 5: Semiconductors {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Section 5.1 Intro */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            5.1 Conductors, Insulators, and Semiconductors
                         </h2>
                         <p className="leading-relaxed">
                            Materials can be broadly classified based on their ability to conduct electricity. This property depends crucially on how easily electrons can move within the material.
                         </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Conductors</h3>
                         <p className="leading-relaxed">
                             <strong className="text-teal dark:text-teal font-semibold">Conductors</strong>, like most metals (copper, silver, aluminum), allow electric current to flow easily. This is because they have many <strong className="text-teal dark:text-teal font-semibold">free electrons</strong> in their atomic structure – electrons that are not tightly bound to individual atoms and can move readily throughout the material when an electric field (voltage) is applied.
                         </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Insulators</h3>
                          <p className="leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Insulators</strong> (also called dielectrics), such as rubber, glass, plastic, and wood, strongly resist the flow of electricity. Their electrons are tightly bound to their atoms and cannot move freely. They are used to cover conductive wires to prevent shocks and short circuits.
                          </p>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Semiconductors</h3>
                          <p className="leading-relaxed">
                             <strong className="text-teal dark:text-teal font-semibold">Semiconductors</strong> lie between conductors and insulators in terms of conductivity. Common examples include pure elements like silicon (<InlineMath math={katex_Si}/>) and germanium (<InlineMath math={katex_Ge}/>), and compound semiconductors like gallium arsenide (<InlineMath math={katex_GaAs}/>).
                          </p>
                           <p className="mt-3 leading-relaxed">
                             Their unique property is that their conductivity can be significantly changed by factors like temperature or the addition of impurities. At absolute zero temperature (0 K), pure semiconductors act as insulators. As temperature increases, some electrons gain enough thermal energy to break free from their bonds, becoming free charge carriers and allowing some conduction.
                          </p>
                           <p className="mt-3 leading-relaxed">
                             The ability to precisely control the conductivity of semiconductors through a process called <strong className="text-coral dark:text-gold font-semibold">doping</strong> makes them the foundation of modern electronics.
                          </p>
                    </section>

                    {/* Lattice Structure & Doping */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Semiconductor Structure and Doping
                         </h2>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Crystal Lattice and Covalent Bonds</h3>
                          <p className="leading-relaxed">
                            Semiconductors like silicon form a regular, repeating crystal lattice structure. Each silicon atom has four valence electrons (electrons in the outermost shell) and forms strong <strong className="text-teal dark:text-teal font-semibold">covalent bonds</strong> with its four neighboring atoms by sharing these electrons. In a pure silicon crystal at low temperatures, almost all electrons are locked into these bonds.
                          </p>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Holes as Charge Carriers</h3>
                           <p className="leading-relaxed">
                              When an electron breaks free from a covalent bond (due to heat, for example), it leaves behind a vacancy or an absence of an electron in that bond. This vacancy is called a <strong className="text-teal dark:text-teal font-semibold">hole</strong>. A nearby electron can easily jump into this hole, effectively causing the hole to move in the opposite direction. Holes act as <strong className="text-coral dark:text-gold">positive charge carriers</strong> within the semiconductor lattice.
                           </p>
                           <p className="mt-3 leading-relaxed">
                               Both free electrons (negative carriers) and holes (positive carriers) contribute to electrical current in semiconductors.
                           </p>
                    </section>

                    {/* Types of Semiconductors */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Types of Semiconductors
                         </h2>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Intrinsic Semiconductors</h3>
                          <p className="leading-relaxed">
                            An <strong className="text-teal dark:text-teal font-semibold">intrinsic</strong> semiconductor is chemically very pure, containing only one type of material (like pure Si or Ge). In these materials, the number of free electrons is equal to the number of holes, generated solely by thermal energy breaking covalent bonds. Their conductivity is generally low at room temperature.
                          </p>

                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Extrinsic Semiconductors (Doping)</h3>
                          <p className="leading-relaxed">
                             To dramatically increase and control conductivity, pure semiconductors are <strong className="text-coral dark:text-gold font-semibold">doped</strong> by adding tiny, controlled amounts of specific impurity atoms. This creates <strong className="text-teal dark:text-teal font-semibold">extrinsic</strong> semiconductors. There are two main types:
                          </p>
                           <ul className="list-disc list-outside ml-6 space-y-2 mt-2">
                               <li>
                                    <strong className="font-semibold">N-Type Semiconductors:</strong> Created by doping with <strong className="text-coral dark:text-gold">donor</strong> impurities – elements from Group V of the periodic table (e.g., Phosphorus (P), Arsenic (As)). These atoms have five valence electrons. When added to silicon (Group IV), four electrons form bonds, leaving the fifth electron loosely bound and easily freed to become a mobile charge carrier. In N-type material, <strong className="text-teal dark:text-teal">electrons are the majority carriers</strong>, and holes are the minority carriers.
                               </li>
                                <li>
                                   <strong className="font-semibold">P-Type Semiconductors:</strong> Created by doping with <strong className="text-coral dark:text-gold">acceptor</strong> impurities – elements from Group III (e.g., Boron (B), Gallium (Ga)). These atoms have only three valence electrons. When added to silicon, they form three bonds, leaving one bond incomplete. This creates a vacancy – a <strong className="text-teal dark:text-teal">hole</strong> – which readily accepts an electron from a nearby bond, allowing the hole to move. In P-type material, <strong className="text-teal dark:text-teal">holes are the majority carriers</strong>, and electrons are the minority carriers.
                               </li>
                           </ul>
                           <p className="mt-3 leading-relaxed">
                               This ability to create materials with predominantly negative (N-type) or positive (P-type) charge carriers through doping is the key to building diodes, transistors, integrated circuits, and solar cells.
                           </p>
                    </section>

                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                     {/* Panel 1: Conductor/Insulator/Semiconductor Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="VyfmIqIyVdU" title="Video: Conductors, Insulators & Semiconductors Explained"/>
                     </div>

                     {/* Panel 2: Covalent Bonds / Holes Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Structure & Carriers</h3>
                          <MiniCheckQuestion
                             question="In a pure semiconductor, what allows electrical conduction to occur when temperature increases?"
                             correctAnswer="Thermal energy breaks some covalent bonds, creating free electrons and holes."
                             explanation="Both electrons and the holes they leave behind can move and contribute to current flow."
                         />
                     </div>

                     {/* Panel 3: Doping Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="JBtEckh3L9Q" title="Video: Semiconductor Doping (N-type & P-type)"/>
                     </div>

                    {/* Panel 4: N-type / P-type Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Doping Check</h3>
                         <MiniCheckQuestion
                             question="If you want to increase the number of free electrons in silicon, should you dope it with Boron (Group III) or Arsenic (Group V)?"
                             correctAnswer="Arsenic (Group V)."
                             explanation="Group V elements (donors) have an extra valence electron compared to silicon, which becomes a free electron, creating N-type material."
                         />
                    </div>

                    {/* Panel 5: PhET Simulation - Conductivity */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Conductivity</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">See how temperature and light affect conductivity in semiconductors.</p>
                         <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                             {/* Using a relevant PhET sim, though direct doping might not be available in HTML5 */}
                            <a href="https://phet.colorado.edu/sims/html/conductivity/latest/conductivity_en.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open PhET: Conductivity (New Tab)</span>
                            </a>
                        </div>
                    </div>

                      {/* Panel 6: P-N Junction Intro (Optional Preview) */}
                     {/* <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="JBtEckh3L9Q" title="Video: Intro to P-N Junctions (Next Topic)"/>
                     </div> */}

                </aside>
            </div>

             {/* Quiz Button */}
            <div className='flex justify-center items-center mt-12 lg:mt-16'>
                <button
                    onClick={() => setShowQuiz(true)}
                    className="w-full sm:w-1/2 lg:w-1/3 bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-3 px-6 rounded-lg transition-colors text-lg shadow-md"
                >
                    Test Your Semiconductor Knowledge!
                </button>
            </div>
        </main>

        {/* Quiz Modal */}
         {showQuiz && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Semiconductors Quiz</h2>
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
SemiconductorsPage.displayName = 'SemiconductorsPage';

export default SemiconductorsPage;
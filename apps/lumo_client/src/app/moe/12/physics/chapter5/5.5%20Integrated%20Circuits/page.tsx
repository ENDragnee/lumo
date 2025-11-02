'use client';

import { InlineMath, BlockMath } from 'react-katex'; // Keep imports
import { useState, ChangeEvent } from 'react'; // Removed useMemo
import QuizQuestion from '@/components/QuizQuestion'; // Assuming this component exists
import Image from 'next/image'; // Import Image component if using Next.js images
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
    "question": "Who are credited with the invention of the integrated circuit (IC)?",
    "options": [
      "Albert Einstein and Marie Curie",
      "Jack Kilby and Robert Noyce", // Correct
      "Nikola Tesla and Thomas Edison",
      "John Bardeen and Walter Brattain"
    ],
    "correctAnswer": 1,
    "hint": "Their independent work in the late 1950s led to the development of the microchip."
  },
  {
    "question": "What is the primary semiconductor material used for manufacturing most integrated circuits?",
    "options": [
      "Germanium",
      "Gallium Arsenide",
      "Silicon", // Correct
      "Copper"
    ],
    "correctAnswer": 2,
    "hint": "Silicon's properties and abundance make it the dominant material in the semiconductor industry."
  },
  {
    "question": "Which of the following is a major ADVANTAGE of integrated circuits over circuits made with discrete components?",
    "options": [
      "Easier to repair individual faulty components.",
      "Ability to handle very high power levels.",
      "Significantly smaller size and lower power consumption.", // Correct
      "Lower initial design cost for simple circuits."
    ],
    "correctAnswer": 2,
    "hint": "Miniaturization, speed, reliability, and reduced power needs are key benefits of ICs."
  },
  {
    "question": "What is a key limitation or DISADVANTAGE of typical integrated circuits?",
    "options": [
      "High reliability",
      "Low speed operation",
      "Difficulty or impossibility of repairing internal components.", // Correct
      "Large physical size"
    ],
    "correctAnswer": 2,
    "hint": "If a component inside an IC fails, the entire chip usually needs to be replaced."
  },
   {
    "question": "An integrated circuit (IC) essentially combines which types of electronic components onto a single chip?",
    "options": [
      "Only transistors",
      "Only resistors and capacitors",
      "Transistors, diodes, resistors, and capacitors", // Correct
      "Inductors and transformers"
    ],
    "correctAnswer": 2,
    "hint": "ICs integrate various active (transistors, diodes) and passive (resistors, capacitors) components."
  },
  {
    "question": "The development of integrated circuits enabled the creation of which revolutionary device?",
    "options": [
      "The vacuum tube",
      "The electric motor",
      "The microprocessor", // Correct
      "The telegraph"
    ],
    "correctAnswer": 2,
    "hint": "Microprocessors, containing millions or billions of transistors on one chip, are only possible due to IC technology."
  },
  {
    "question": "Why are ICs generally more reliable than circuits built from individual (discrete) components?",
    "options": [
      "They use less silicon.",
      "All components are fabricated simultaneously, and interconnections are internal, reducing connection failures.", // Correct
      "They operate at lower temperatures.",
      "They are easier to cool."
    ],
    "correctAnswer": 1,
    "hint": "Fewer solder joints and external connections lead to higher reliability."
  },
   {
    "question": "Why can't most standard ICs handle very high currents or voltages?",
    "options": [
      "They are made of insulating materials.",
      "The components and internal wiring are extremely small and can overheat or break down under high power.", // Correct
      "They lack sufficient capacitance.",
      "They are designed only for digital signals."
    ],
    "correctAnswer": 1,
    "hint": "The microscopic scale limits their power handling capabilities; specialized power ICs exist but have different designs."
  }
];


// --- KaTeX Constants (Minimal needed) ---
const katex_IC = 'IC'; // Abbreviation for Integrated Circuit

// --- Main Page Component ---
const IntegratedCircuitsPage = () => { // Renamed component
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
                5.5 Integrated Circuits (ICs) {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction & Importance */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             The Microchip Revolution
                         </h2>
                         <p className="leading-relaxed">
                            The invention of the transistor allowed for smaller electronic devices with lower power consumption compared to vacuum tubes. However, connecting many individual transistors and other components with wires was still complex and limited miniaturization.
                         </p>
                         <p className="mt-3 leading-relaxed">
                             The breakthrough came with the <strong className="text-teal dark:text-teal font-semibold">Integrated Circuit (<InlineMath math={katex_IC}/>)</strong>, also known as a <strong className="text-teal dark:text-teal font-semibold">chip</strong> or <strong className="text-teal dark:text-teal font-semibold">microchip</strong>. Independently invented by <strong className="text-coral dark:text-gold font-semibold">Jack Kilby</strong> and <strong className="text-coral dark:text-gold font-semibold">Robert Noyce</strong> in the late 1950s, the IC allowed entire electronic circuits—containing potentially millions or even billions of components—to be fabricated on a single, small piece of semiconductor material, usually silicon.
                         </p>
                          <p className="mt-3 leading-relaxed">
                              This invention is arguably the cornerstone of the digital revolution, enabling the creation of powerful computers, mobile phones, complex medical devices, and countless other technologies that define modern life. The goal shifted from connecting individual components to creating a single device that performs a complex function (like amplification, timing, memory storage, or processing).
                          </p>
                    </section>

                    {/* Components of an IC */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            What's Inside an IC?
                         </h2>
                          <p className="leading-relaxed">
                             An IC isn't just one component; it's a complex network of microscopic electronic components built onto a single semiconductor substrate (the "chip"). These components typically include:
                              <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                  <li><strong className="font-semibold">Transistors:</strong> The primary active components for switching and amplification.</li>
                                  <li><strong className="font-semibold">Diodes:</strong> For rectification, signal steering, and protection.</li>
                                  <li><strong className="font-semibold">Resistors:</strong> To control current flow and set voltage levels.</li>
                                  <li><strong className="font-semibold">Capacitors:</strong> To store charge, filter signals, and timing applications.</li>
                              </ul>
                          </p>
                           <p className="mt-3 leading-relaxed">
                              These components are created using sophisticated fabrication processes involving lithography, etching, and doping, similar to how individual transistors are made, but on a vastly smaller and integrated scale. Interconnections between components are made using thin layers of deposited metal (like aluminum or copper).
                           </p>
                    </section>

                     {/* Advantages and Disadvantages */}
                    <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Advantages and Disadvantages
                         </h2>
                         <h3 className="text-xl font-semibold font-playfair mt-4 mb-2 text-green-600 dark:text-mint">Advantages</h3>
                          <ul className="list-disc list-outside ml-6 space-y-2 mt-2">
                              <li><strong className="font-semibold">Miniaturization:</strong> Extremely small size allows for complex circuits in portable devices (computers, phones).</li>
                              <li><strong className="font-semibold">Low Power Consumption:</strong> Generally requires less power than equivalent circuits made of discrete components.</li>
                              <li><strong className="font-semibold">High Speed:</strong> Short distances between components reduce signal travel time, enabling faster operation.</li>
                               <li><strong className="font-semibold">High Reliability:</strong> Internal, permanent connections are less prone to failure than soldered joints in discrete circuits. Mass production allows for rigorous testing.</li>
                               <li><strong className="font-semibold">Lower Cost (in mass production):</strong> Although design is complex, fabricating millions of identical ICs is very cost-effective per unit compared to assembling discrete circuits.</li>
                               <li><strong className="font-semibold">Reduced Parts Count:</strong> Simplifies the assembly of electronic equipment.</li>
                           </ul>

                         <h3 className="text-xl font-semibold font-playfair mt-6 mb-2 text-red-600 dark:text-coral">Disadvantages</h3>
                         <ul className="list-disc list-outside ml-6 space-y-2 mt-2">
                              <li><strong className="font-semibold">Low Power Handling:</strong> Standard ICs cannot handle high currents or voltages due to the tiny size of components and interconnects, which leads to overheating or breakdown. Specialized power ICs exist but are different.</li>
                              <li><strong className="font-semibold">Inductors Difficult to Integrate:</strong> Fabricating efficient inductors directly onto silicon chips is challenging and often requires external components.</li>
                              <li><strong className="font-semibold">Non-Repairable:</strong> If a single internal component fails, the entire IC usually needs to be replaced; individual components cannot be accessed or repaired. Troubleshooting focuses on identifying the faulty IC rather than a specific resistor or transistor within it.</li>
                               <li><strong className="font-semibold">Vulnerability:</strong> Can be sensitive to static discharge (ESD) and voltage spikes if not properly protected.</li>
                           </ul>
                     </section>

                     {/* Conclusion */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Conclusion
                         </h2>
                          <p className="leading-relaxed">
                            Integrated circuits represent a monumental leap in electronic engineering. Their ability to pack immense functionality into tiny, reliable, and cost-effective packages has fundamentally reshaped technology and continues to drive innovation across nearly every field.
                          </p>
                     </section>

                </article>

                {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                     {/* Panel 1: What is an IC? Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="QroUHEmWpI4" title="Video: What is an Integrated Circuit (IC)?"/>
                     </div>

                    {/* Panel 2: Invention Mini Question */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Invention Check</h3>
                          <MiniCheckQuestion
                             question="Why was the invention of the integrated circuit so revolutionary compared to using individual transistors?"
                             correctAnswer="It allowed entire complex circuits with many components to be fabricated on a single tiny chip, enabling massive miniaturization, increased speed, reliability, and lower cost in mass production."
                             explanation="Before ICs, circuits were assembled from many discrete (separate) components connected by wires, which was bulky, slower, less reliable, and more expensive for complex systems."
                         />
                    </div>

                    {/* Panel 3: How ICs are Made Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="aWVywhzuHnQ" title="Video: How are Microchips Made? (Simplified)"/>
                     </div>

                     {/* Panel 4: Advantages/Disadvantages Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Pros & Cons Check</h3>
                         <MiniCheckQuestion
                             question="What is a major trade-off for the small size and high integration of ICs?"
                             correctAnswer="Limited power handling capability and the inability to repair internal components."
                             explanation="The microscopic scale makes them unsuitable for high currents/voltages and impossible to fix internally if a single part fails."
                         />
                     </div>

                     {/* Panel 5: Image of an IC / Die (Example Placeholder) */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Inside the Chip</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">A magnified view reveals the intricate layers and components.</p>
                        {/* Replace with an actual relevant image if available */}
                        <div className="relative w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                             {/* Example using Next.js Image (replace with your actual image source) */}
                             {/* <Image src="/images/ic-die-shot.jpg" alt="Magnified view of an integrated circuit die" layout="fill" objectFit="contain" /> */}
                             <span className="text-gray-500 font-inter">Magnified IC Image Placeholder</span>
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
                    Test Your IC Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Integrated Circuits Quiz</h2>
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
IntegratedCircuitsPage.displayName = 'IntegratedCircuitsPage';

export default IntegratedCircuitsPage;
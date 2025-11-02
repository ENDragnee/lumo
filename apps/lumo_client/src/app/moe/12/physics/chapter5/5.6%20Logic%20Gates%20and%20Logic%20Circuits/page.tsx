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
    // ... (quiz questions remain unchanged, seem appropriate)
      {
    "question": "What are the two main types of signals encountered in electronics?",
    "options": [
      "Analog (continuous) and Digital (discrete)", // Correct
      "Sound and Light",
      "Positive and Negative",
      "Input and Output"
    ],
    "correctAnswer": 0,
    "hint": "One varies smoothly over time, the other uses distinct levels (like 0 and 1)."
  },
  {
    "question": "In a positive logic system, a binary '1' (TRUE) is typically represented by:",
    "options": [
      "A low voltage level (e.g., 0V)",
      "A high voltage level (e.g., +5V)", // Correct
      "A negative voltage level",
      "Zero current"
    ],
    "correctAnswer": 1,
    "hint": "Positive logic assigns 'TRUE' or 'ON' to the higher voltage state."
  },
   {
    "question": "In a negative logic system, a binary '1' (TRUE) is typically represented by:",
    "options": [
      "A low voltage level (e.g., 0V)", // Correct
      "A high voltage level (e.g., +5V)",
      "A positive current flow",
      "An open switch"
    ],
    "correctAnswer": 0,
    "hint": "Negative logic reverses the assignment, making the lower voltage state 'TRUE'."
  },
  {
    "question": "What is the function of a NOT gate (inverter)?",
    "options": [
      "Output is TRUE only if all inputs are TRUE.",
      "Output is TRUE if any input is TRUE.",
      "Output is the opposite (inverse) of the single input.", // Correct
      "Output is always TRUE."
    ],
    "correctAnswer": 2,
    "hint": "It flips a 0 to a 1, and a 1 to a 0."
  },
  {
    "question": "For an AND gate, when is the output TRUE (1)?",
    "options": [
      "When at least one input is TRUE (1).",
      "Only when ALL inputs are TRUE (1).", // Correct
      "When at least one input is FALSE (0).",
      "Only when all inputs are FALSE (0)."
    ],
    "correctAnswer": 1,
    "hint": "Think 'A *AND* B must be TRUE'."
  },
  {
    "question": "For an OR gate, when is the output TRUE (1)?",
    "options": [
      "When at least one input is TRUE (1).", // Correct
      "Only when ALL inputs are TRUE (1).",
      "Only when all inputs are FALSE (0).",
      "When inputs are different."
    ],
    "correctAnswer": 0,
    "hint": "Think 'A *OR* B (or both) must be TRUE'."
  },
    {
    "question": "A NAND gate behaves like which combination?",
    "options": [
      "OR followed by NOT",
      "AND followed by NOT", // Correct
      "NOT followed by AND",
      "XOR followed by NOT"
    ],
    "correctAnswer": 1,
    "hint": "NAND stands for 'Not AND'."
  },
  {
    "question": "A NOR gate behaves like which combination?",
    "options": [
      "OR followed by NOT", // Correct
      "AND followed by NOT",
      "NOT followed by OR",
      "XNOR followed by NOT"
    ],
    "correctAnswer": 0,
    "hint": "NOR stands for 'Not OR'."
  },
  {
    "question": "Which two logic gates are considered 'universal gates' because any other logic function can be built using only them?",
    "options": [
      "AND and OR",
      "NOT and AND",
      "NAND and NOR", // Correct
      "XOR and XNOR"
    ],
    "correctAnswer": 2,
    "hint": "You can construct NOT, AND, and OR functions using only NAND gates, or using only NOR gates."
  },
   {
    "question": "What does the Boolean expression Y = A + B represent?",
    "options": [
      "AND gate",
      "OR gate", // Correct
      "NOT gate",
      "NAND gate"
    ],
    "correctAnswer": 1,
    "hint": "In Boolean algebra, '+' typically represents the logical OR operation."
  }
];


// --- KaTeX Constants ---
const katex_Y = 'Y'; // Output
const katex_A = 'A'; // Input A
const katex_B = 'B'; // Input B
const katex_OR = 'Y = A + B';
const katex_AND = 'Y = A \\cdot B'; // Using dot for AND
const katex_NOT = `Y = \\overline{${katex_A}}`;
const katex_NOR = `Y = \\overline{${katex_A} + ${katex_B}}`;
const katex_NAND = `Y = \\overline{${katex_A} \\cdot ${katex_B}}`;


// --- Main Page Component ---
const LogicGatesPage = () => { // Renamed component
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
                5.6 Logic Gates and Logic Circuits {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Analog vs Digital */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Analog vs. Digital Signals
                         </h2>
                         <p className="leading-relaxed">
                             Information in electronic systems is carried by signals, which are typically time-varying voltages or currents. There are two fundamental types:
                             <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                 <li><strong className="font-semibold">Analog Signals:</strong> Vary continuously over time, representing quantities that can take on any value within a range (like sound waves, temperature, or light intensity). Think of a smooth, flowing wave.</li>
                                 <li><strong className="font-semibold">Digital Signals:</strong> Represent information using discrete, distinct levels. Most commonly, binary digital signals use only two levels, typically represented as <strong className="text-coral dark:text-gold">0 (Low)</strong> and <strong className="text-coral dark:text-gold">1 (High)</strong>. These levels correspond to specific voltage ranges (e.g., 0V for Low, +5V for High). Digital signals form the basis of computers and most modern communication.</li>
                             </ul>
                         </p>
                    </section>

                    {/* Positive/Negative Logic */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Positive and Negative Logic
                         </h2>
                         <p className="leading-relaxed">
                             The binary values 0 and 1 represent logical states: typically <strong className="text-teal dark:text-teal font-semibold">FALSE (0)</strong> and <strong className="text-teal dark:text-teal font-semibold">TRUE (1)</strong>. How these logical states map to voltage levels defines the logic system:
                         </p>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 font-inter text-sm">
                              {/* Positive Logic Table */}
                              <div className="border p-3 rounded bg-gray-50 dark:bg-gray-800">
                                  <h4 className="font-semibold text-center mb-2">Positive Logic</h4>
                                   <table className="table-auto border-collapse w-full">
                                      <thead><tr className="bg-gray-100 dark:bg-gray-700"><th className="border p-1">Logic</th><th className="border p-1">Voltage</th><th className="border p-1">State</th></tr></thead>
                                       <tbody>
                                          <tr><td className="border p-1 text-center">1</td><td className="border p-1 text-center">High</td><td className="border p-1 text-center">TRUE / ON</td></tr>
                                          <tr><td className="border p-1 text-center">0</td><td className="border p-1 text-center">Low</td><td className="border p-1 text-center">FALSE / OFF</td></tr>
                                       </tbody>
                                   </table>
                              </div>
                               {/* Negative Logic Table */}
                              <div className="border p-3 rounded bg-gray-50 dark:bg-gray-800">
                                  <h4 className="font-semibold text-center mb-2">Negative Logic</h4>
                                   <table className="table-auto border-collapse w-full">
                                       <thead><tr className="bg-gray-100 dark:bg-gray-700"><th className="border p-1">Logic</th><th className="border p-1">Voltage</th><th className="border p-1">State</th></tr></thead>
                                       <tbody>
                                          <tr><td className="border p-1 text-center">1</td><td className="border p-1 text-center">Low</td><td className="border p-1 text-center">TRUE / ON</td></tr>
                                          <tr><td className="border p-1 text-center">0</td><td className="border p-1 text-center">High</td><td className="border p-1 text-center">FALSE / OFF</td></tr>
                                       </tbody>
                                   </table>
                              </div>
                         </div>
                         <p className="mt-3 leading-relaxed">
                            <strong className="text-coral dark:text-gold font-semibold">Positive logic</strong> is the most commonly used convention in digital electronics today.
                         </p>
                    </section>

                    {/* Logic Gates */}
                    <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Logic Gates: The Building Blocks
                         </h2>
                         <p className="leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Logic gates</strong> are fundamental digital circuits that perform a single, basic logical operation on one or more binary inputs (<InlineMath math={katex_A}/>, <InlineMath math={katex_B}/>, etc.) to produce a single binary output (<InlineMath math={katex_Y}/>). Their behavior is described by Boolean expressions and truth tables.
                         </p>

                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">OR Gate</h3>
                           <p className="leading-relaxed">
                              Output <InlineMath math={katex_Y}/> is TRUE (1) if <strong className="text-coral dark:text-gold">at least one</strong> input (<InlineMath math={katex_A}/> OR <InlineMath math={katex_B}/>) is TRUE (1).
                           </p>
                           <div className='my-2 p-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                               <BlockMath math={katex_OR}/>
                           </div>
                           <p className="text-sm italic leading-relaxed text-gray-600 dark:text-gray-400">Truth Table Summary: Output is 0 only when both inputs are 0.</p>

                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">AND Gate</h3>
                           <p className="leading-relaxed">
                               Output <InlineMath math={katex_Y}/> is TRUE (1) only if <strong className="text-coral dark:text-gold">all</strong> inputs (<InlineMath math={katex_A}/> AND <InlineMath math={katex_B}/>) are TRUE (1).
                           </p>
                            <div className='my-2 p-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                               <BlockMath math={katex_AND}/>
                           </div>
                            <p className="text-sm italic leading-relaxed text-gray-600 dark:text-gray-400">Truth Table Summary: Output is 1 only when both inputs are 1.</p>

                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">NOT Gate (Inverter)</h3>
                           <p className="leading-relaxed">
                               Has only one input (<InlineMath math={katex_A}/>). Output <InlineMath math={katex_Y}/> is the <strong className="text-coral dark:text-gold">opposite</strong> (inverse) of the input.
                           </p>
                           <div className='my-2 p-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                               <BlockMath math={katex_NOT}/>
                           </div>
                           <p className="text-sm italic leading-relaxed text-gray-600 dark:text-gray-400">Truth Table Summary: 0 becomes 1, 1 becomes 0.</p>

                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">NOR Gate (NOT OR)</h3>
                           <p className="leading-relaxed">
                              Equivalent to an OR gate followed by a NOT gate. Output <InlineMath math={katex_Y}/> is TRUE (1) only if <strong className="text-coral dark:text-gold">all</strong> inputs (<InlineMath math={katex_A}/> and <InlineMath math={katex_B}/>) are FALSE (0).
                           </p>
                            <div className='my-2 p-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                                <BlockMath math={katex_NOR}/>
                           </div>
                           <p className="text-sm italic leading-relaxed text-gray-600 dark:text-gray-400">Truth Table Summary: Output is 1 only when both inputs are 0.</p>

                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">NAND Gate (NOT AND)</h3>
                            <p className="leading-relaxed">
                                Equivalent to an AND gate followed by a NOT gate. Output <InlineMath math={katex_Y}/> is FALSE (0) only if <strong className="text-coral dark:text-gold">all</strong> inputs (<InlineMath math={katex_A}/> and <InlineMath math={katex_B}/>) are TRUE (1).
                           </p>
                           <div className='my-2 p-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                                <BlockMath math={katex_NAND}/>
                           </div>
                            <p className="text-sm italic leading-relaxed text-gray-600 dark:text-gray-400">Truth Table Summary: Output is 0 only when both inputs are 1.</p>
                            <p className="mt-3 leading-relaxed">
                                NAND and NOR gates are known as <strong className="text-teal dark:text-teal">universal gates</strong> because any other logic gate (AND, OR, NOT) can be constructed using only NAND gates or only NOR gates.
                           </p>
                    </section>

                    {/* Conclusion */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Conclusion
                         </h2>
                          <p className="leading-relaxed">
                             Logic gates, implemented using transistors within integrated circuits, form the foundation of all digital systems. By combining these simple gates in complex ways, we can perform calculations, make decisions, store information, and control processes, enabling everything from simple calculators to supercomputers.
                          </p>
                     </section>

                </article>

                {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                     {/* Panel 1: Analog vs Digital Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="1BITRtP45Eo" title="Video: Analog vs. Digital Signals Explained"/>
                     </div>

                    {/* Panel 2: Basic Logic Gates Video */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="gI-qXk7XojA" title="Video: Introduction to Logic Gates (AND, OR, NOT)"/>
                     </div>

                     {/* Panel 3: AND/OR Mini Question */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">AND vs OR Check</h3>
                         <MiniCheckQuestion
                            question="A security system should trigger an alarm (Output=1) only if BOTH the door sensor (A=1) AND the window sensor (B=1) are activated. Which logic gate represents this condition?"
                            correctAnswer="AND gate (Y = A · B)"
                            explanation="The output is TRUE only when all inputs are TRUE, matching the requirement that both sensors must be active."
                         />
                    </div>

                    {/* Panel 4: NAND/NOR Video */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="MEMgyWymgkI" title="Video: NAND and NOR Gates (Universal Gates)"/>
                    </div>

                     {/* Panel 5: NAND/NOR Mini Question */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Universal Gates Check</h3>
                         <MiniCheckQuestion
                            question="If a NAND gate has inputs A=1 and B=0, what is its output Y?"
                            correctAnswer="Output Y = 1"
                            explanation="First, perform the AND operation: A · B = 1 · 0 = 0. Then, invert the result (NOT): Output = NOT(0) = 1."
                        />
                    </div>

                    {/* Panel 6: Logic Gate Simulator Link */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Logic Gate Simulator</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Build circuits and test the behavior of different logic gates.</p>
                         <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                            {/* Link to a suitable online simulator */}
                            <a href="https://logic.ly/demo/" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open Logic.ly Demo (New Tab)</span>
                            </a>
                             {/* Alternate: Falstad Simulator also works */}
                             {/* <a href="https://falstad.com/circuit/circuitjs.html" target="_blank" rel="noopener noreferrer" className="..."> ... Falstad Link ... </a> */}
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
                    Test Your Logic Gate Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Logic Gates Quiz</h2>
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
LogicGatesPage.displayName = 'LogicGatesPage';

export default LogicGatesPage;
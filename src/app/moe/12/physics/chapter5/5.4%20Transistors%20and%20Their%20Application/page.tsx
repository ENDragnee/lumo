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
    "question": "What is the primary function of a transistor in an electronic circuit?",
    "options": [
      "To amplify or switch electronic signals/current", // Clarified
      "To block electrical current completely",
      "To store electrical energy like a capacitor",
      "To generate light like an LED"
    ],
    "correctAnswer": 0,
    "hint": "Transistors act as controllable valves for electric current."
  },
  {
    "question": "Which two main *classes* of transistors are generally recognized?", // Changed wording slightly
    "options": [
      "NPN and PNP only",
      "Bipolar Junction Transistors (BJT) and Field-Effect Transistors (FET)", // Correct general classes
      "Silicon and Germanium Transistors",
      "Amplifying and Switching Transistors"
    ],
    "correctAnswer": 1,
    "hint": "This section focuses on BJTs, but FETs are the other major category."
  },
  {
    "question": "A BJT consists of how many doped semiconductor regions?",
    "options": [
      "One",
      "Two (P-N)",
      "Three (e.g., N-P-N or P-N-P)", // Correct
      "Four"
    ],
    "correctAnswer": 2,
    "hint": "BJTs have an Emitter, Base, and Collector region."
  },
  {
    "question": "In an NPN transistor, the majority charge carriers that move from the emitter to the collector (when properly biased) are primarily:",
    "options": [
      "Holes",
      "Electrons", // Correct
      "Protons",
      "Positive Ions"
    ],
    "correctAnswer": 1,
    "hint": "The first 'N' in NPN stands for the N-type emitter, which supplies electrons."
  },
   {
    "question": "For standard BJT operation as an amplifier, how should the two junctions be biased?",
    "options": [
      "Both forward biased",
      "Both reverse biased",
      "Emitter-Base junction forward biased, Collector-Base junction reverse biased", // Correct
      "Emitter-Base junction reverse biased, Collector-Base junction forward biased"
    ],
    "correctAnswer": 2,
    "hint": "Forward biasing the E-B junction injects carriers into the base, which are then swept to the collector by the reverse biased C-B junction."
  },
  {
    "question": "Which BJT configuration typically offers the highest power gain (both voltage and current gain)?",
    "options": [
      "Common-Base (CB)",
      "Common-Collector (CC) / Emitter Follower",
      "Common-Emitter (CE)", // Correct
      "Grounded Base"
    ],
    "correctAnswer": 2,
    "hint": "The Common-Emitter configuration is widely used for amplification due to its good voltage and current gain characteristics."
  },
  {
    "question": "The Common-Collector (CC) configuration, also known as an Emitter Follower, is primarily used for:",
    "options": [
      "High voltage amplification",
      "High current amplification (providing current gain / impedance matching)", // Correct
      "Switching high frequencies",
      "Generating oscillations"
    ],
    "correctAnswer": 1,
    "hint": "It has a voltage gain close to 1 but provides significant current gain, useful for driving low-impedance loads."
  },
  {
    "question": "How does a transistor function as an electronic switch?",
    "options": [
      "By physically moving contacts like a relay",
      "By changing its resistance from very high (OFF/cutoff) to very low (ON/saturation) based on the base/gate control signal", // Correct
      "By generating its own voltage",
      "By storing charge"
    ],
    "correctAnswer": 1,
    "hint": "Applying a control signal allows a large current to flow (ON state) or blocks it (OFF state)."
  }
];


// --- KaTeX Constants ---
const katex_E = 'E'; // Emitter
const katex_B = 'B'; // Base
const katex_C = 'C'; // Collector
const katex_NPN = 'NPN';
const katex_PNP = 'PNP';
const katex_CE = 'CE'; // Common-Emitter
const katex_CC = 'CC'; // Common-Collector
const katex_CB = 'CB'; // Common-Base

// --- Main Page Component ---
const TransistorsPage = () => { // Renamed component
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
                5.4 Transistors and Their Applications {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* What is a Transistor? */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            The Transistor: A Semiconductor Revolution
                         </h2>
                         <p className="leading-relaxed">
                            The <strong className="text-teal dark:text-teal font-semibold">transistor</strong> is arguably one of the most important inventions of the 20th century. It's a semiconductor device, typically with three terminals, that acts as the fundamental building block for virtually all modern electronics. Its primary functions are to <strong className="text-coral dark:text-gold font-semibold">amplify</strong> electronic signals or to act as an electronic <strong className="text-coral dark:text-gold font-semibold">switch</strong>.
                         </p>
                          <p className="mt-3 leading-relaxed">
                            Transistors replaced bulky, inefficient vacuum tubes, enabling the miniaturization and proliferation of computers, radios, and countless other devices.
                          </p>
                           <p className="mt-3 leading-relaxed">
                             There are two main families: <strong className="text-teal dark:text-teal">Bipolar Junction Transistors (BJTs)</strong> and <strong className="text-teal dark:text-teal">Field-Effect Transistors (FETs)</strong>. This section focuses primarily on BJTs.
                           </p>
                    </section>

                    {/* BJT Structure */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Bipolar Junction Transistor (BJT) Structure
                         </h2>
                         <p className="leading-relaxed">
                             A BJT is formed by sandwiching one type of doped semiconductor between two layers of the opposite type, creating two P-N junctions back-to-back. This results in three distinct regions:
                             <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                 <li><strong className="font-semibold">Emitter (<InlineMath math={katex_E}/>):</strong> Heavily doped region that "emits" charge carriers (electrons or holes) into the base.</li>
                                 <li><strong className="font-semibold">Base (<InlineMath math={katex_B}/>):</strong> Very thin, lightly doped middle region that controls the flow of carriers from emitter to collector.</li>
                                 <li><strong className="font-semibold">Collector (<InlineMath math={katex_C}/>):</strong> Moderately doped region that "collects" the carriers passing through the base.</li>
                             </ul>
                         </p>
                          <p className="mt-3 leading-relaxed">
                             There are two types of BJTs based on the arrangement:
                             <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                 <li><strong className="text-coral dark:text-gold"><InlineMath math={katex_NPN}/> Transistor:</strong> A thin P-type base sandwiched between N-type emitter and collector regions. Majority carriers are electrons.</li>
                                 <li><strong className="text-coral dark:text-gold"><InlineMath math={katex_PNP}/> Transistor:</strong> A thin N-type base sandwiched between P-type emitter and collector regions. Majority carriers are holes.</li>
                             </ul>
                          </p>
                    </section>

                    {/* BJT Operation & Biasing */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Basic BJT Operation (NPN Example)
                         </h2>
                         <p className="leading-relaxed">
                             For a transistor to operate typically as an amplifier (in the "active region"), its two junctions must be biased correctly using external DC voltages:
                             <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                <li>The <strong className="text-teal dark:text-teal">Emitter-Base (E-B) junction</strong> must be <strong className="text-coral dark:text-gold">forward biased</strong>. (For NPN: Base positive relative to Emitter).</li>
                                <li>The <strong className="text-teal dark:text-teal">Collector-Base (C-B) junction</strong> must be <strong className="text-coral dark:text-gold">reverse biased</strong>. (For NPN: Collector much more positive than Base).</li>
                             </ul>
                         </p>
                         <p className="mt-3 leading-relaxed">
                             Under these conditions (for an NPN):
                             <ol className="list-decimal list-inside ml-4 space-y-1 mt-2">
                                 <li>The forward-biased E-B junction allows many electrons (majority carriers in the N-emitter) to be injected into the thin P-base.</li>
                                 <li>Because the base is very thin and lightly doped, most of these injected electrons diffuse across it without recombining with holes.</li>
                                 <li>Once they reach the C-B junction, the strong reverse bias electric field sweeps these electrons across into the N-collector region.</li>
                                 <li>A small number of electrons *do* recombine with holes in the base, constituting the small <strong className="font-semibold">base current (<InlineMath math="I_B"/>)</strong>. The electrons swept into the collector form the much larger <strong className="font-semibold">collector current (<InlineMath math="I_C"/>)</strong>.</li>
                             </ol>
                         </p>
                          <p className="mt-3 leading-relaxed">
                              Crucially, a small change in the base current (<InlineMath math="I_B"/>) can cause a large change in the collector current (<InlineMath math="I_C"/>). This is the basis of transistor amplification (<InlineMath math="I_C \approx \beta I_B"/>, where <InlineMath math="\beta"/> is the current gain).
                          </p>
                           <p className="mt-3 leading-relaxed">
                               A <strong className="text-teal dark:text-teal font-semibold">PNP transistor</strong> operates similarly, but the roles of electrons and holes are swapped, and the biasing polarities are reversed. Holes flow from emitter to collector, controlled by a small electron flow into the base.
                           </p>
                     </section>

                     {/* Transistor Configurations */}
                      <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Transistor Configurations
                         </h2>
                         <p className="leading-relaxed">
                             A BJT can be connected in a circuit in three basic configurations, depending on which terminal is common to both the input and output signals. Each configuration has different characteristics (gain, impedance):
                         </p>
                          <ul className="list-disc list-outside ml-6 space-y-2 mt-2">
                              <li><strong className="font-semibold">Common-Emitter (<InlineMath math={katex_CE}/>):</strong> Input to Base, Output from Collector (Emitter is common). Offers both significant <strong className="text-coral dark:text-gold">voltage gain</strong> and <strong className="text-coral dark:text-gold">current gain</strong>. Widely used for amplification. Output signal is phase-inverted relative to input.</li>
                              <li><strong className="font-semibold">Common-Collector (<InlineMath math={katex_CC}/>) / Emitter Follower:</strong> Input to Base, Output from Emitter (Collector is common). Offers high <strong className="text-coral dark:text-gold">current gain</strong> but voltage gain is approximately 1 (no voltage amplification). Has high input impedance and low output impedance, making it useful as a buffer or for driving low-impedance loads. Output is in phase with input.</li>
                              <li><strong className="font-semibold">Common-Base (<InlineMath math={katex_CB}/>):</strong> Input to Emitter, Output from Collector (Base is common). Offers high <strong className="text-coral dark:text-gold">voltage gain</strong> but current gain is slightly less than 1. Has low input impedance and high output impedance. Often used in high-frequency applications. Output is in phase with input.</li>
                          </ul>
                      </section>

                      {/* Applications */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Transistor Applications
                         </h2>
                          <p className="leading-relaxed">
                             Transistors are incredibly versatile:
                              <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                 <li><strong className="font-semibold">Amplification:</strong> Boosting weak signals (audio, radio) to usable levels.</li>
                                 <li><strong className="font-semibold">Switching:</strong> Acting as fast electronic switches to turn circuits ON or OFF, forming the basis of digital logic.</li>
                                 <li><strong className="font-semibold">Logic Gates:</strong> Combining transistors to perform logical operations (AND, OR, NOT, etc.), the foundation of microprocessors and digital systems.</li>
                                 <li><strong className="font-semibold">Oscillators:</strong> Generating specific frequencies.</li>
                                 <li><strong className="font-semibold">Voltage Regulation:</strong> Maintaining stable output voltages.</li>
                              </ul>
                          </p>
                           <p className="mt-3 leading-relaxed">
                               Their ability to control large currents with small signals, combined with their small size, low power consumption, and reliability, revolutionized electronics.
                           </p>
                     </section>

                </article>

                {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                     {/* Panel 1: How Transistors Work Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="7ukDKVHnac4" title="Video: How Transistors Work (BJT Basics)"/>
                     </div>

                    {/* Panel 2: NPN vs PNP Mini Question */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">NPN vs PNP Check</h3>
                         <MiniCheckQuestion
                            question="What is the main difference in operation between an NPN and a PNP transistor regarding charge carriers and bias voltages?"
                            correctAnswer="NPN uses electrons as primary carriers and requires positive V_BE and V_CE for active mode. PNP uses holes and requires negative V_BE and V_CE (or emitter positive relative to base/collector)."
                            explanation="They are complementary devices; NPN controls electron flow, PNP controls hole flow, requiring opposite voltage polarities."
                        />
                    </div>

                    {/* Panel 3: Transistor as a Switch Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="ZxGgcu_n3KM" title="Video: Transistor as a Switch"/>
                     </div>

                     {/* Panel 4: Transistor Configurations Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="QzysMDJXTQQ" title="Video: Transistor Configurations (CE, CC, CB)"/>
                     </div>

                      {/* Panel 5: Configuration Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Configuration Check</h3>
                         <MiniCheckQuestion
                            question="If you need to boost both the voltage and current of a small signal, which BJT configuration would you typically choose?"
                            correctAnswer="Common-Emitter (CE)."
                            explanation="The CE configuration is unique among the three basic BJT configurations in providing significant gain for both voltage and current."
                        />
                     </div>

                    {/* Panel 6: Falstad Simulator Link */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Transistor Circuits</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Build and test basic BJT amplifier and switch circuits.</p>
                         <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                            <a href="https://falstad.com/circuit/circuitjs.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open Falstad Circuit Simulator (New Tab)<br/><i className="text-xs">(Find BJT examples under 'Circuits' menu)</i></span>
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
                    Test Your Transistor Knowledge!
                </button>
            </div>
        </main>

        {/* Quiz Modal */}
         {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Transistors Quiz</h2>
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
TransistorsPage.displayName = 'TransistorsPage';

export default TransistorsPage;
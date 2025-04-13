'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, useMemo, ChangeEvent, useEffect } from 'react'; // Added useEffect
import QuizQuestion from '@/components/QuizQuestion'; // Assuming this component exists
import Image from 'next/image'; // For potential images
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
  options?: string[];
  correctOptionIndex?: number;
  onSelectOption?: (isCorrect: boolean) => void;
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

// Mini Interactive Question Component (Enhanced for Optional Multiple Choice)
function MiniCheckQuestion({
    question,
    correctAnswer,
    explanation,
    options,
    correctOptionIndex,
    onSelectOption }: MiniCheckQuestionProps) {
    const [revealed, setRevealed] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleOptionSelect = (index: number) => {
        if (revealed) return;
        setSelectedOption(index);
        const correct = index === correctOptionIndex;
        setIsCorrect(correct);
        setRevealed(true);
        if (onSelectOption) {
            onSelectOption(correct);
        }
    };

    const handleReveal = () => {
        setRevealed(true);
    };

    const handleHide = () => {
        setRevealed(false);
        setSelectedOption(null);
        setIsCorrect(null);
    }

  return (
    <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md">
      <p className="font-medium text-sm mb-3 font-inter text-dark-gray dark:text-light-gray">{question}</p>
      {options && options.length > 0 && !revealed && (
         <div className="space-y-2 mb-3">
              {options.map((option, index) => (
                  <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      className={`block w-full text-left text-sm p-2 rounded border font-inter transition-colors
                                  ${selectedOption === index ? (isCorrect ? 'bg-mint/30 border-teal' : 'bg-coral/30 border-red-500') : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'}
                                  text-dark-gray dark:text-light-gray`}
                  >
                      {`${String.fromCharCode(65 + index)}. ${option}`}
                  </button>
              ))}
          </div>
      )}
      {!options && !revealed && (
        <button
          onClick={handleReveal}
          className="text-xs bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors"
        >
          Check Answer
        </button>
      )}
      {revealed && (
        <div className="text-sm space-y-1 font-inter border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
           {options && isCorrect !== null && (
                <p className={`font-semibold ${isCorrect ? 'text-teal dark:text-mint' : 'text-coral dark:text-gold'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect.'}
                </p>
            )}
          <p className="text-dark-gray dark:text-light-gray"><strong className="text-teal dark:text-mint">Answer:</strong> {correctAnswer}</p>
          <p className="text-dark-gray dark:text-light-gray"><strong className="text-gray-600 dark:text-gray-400">Explanation:</strong> {explanation}</p>
           <button onClick={handleHide} className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 font-inter"> Hide/Reset </button>
        </div>
      )}
    </div>
  );
}

// Simple pH Scale Visualization Component
function PhScaleVisualization({ pH }: { pH: number | null }) {
    if (pH === null || !isFinite(pH)) {
        return <div className="text-sm text-center text-gray-500 dark:text-gray-400 italic">(Enter valid concentration or pH/pOH)</div>;
    }

    const scaleWidth = 100; // Percentage
    const position = Math.max(0, Math.min(14, pH)) / 14 * scaleWidth;

    const getColor = (pHValue: number): string => {
        if (pHValue < 3) return 'bg-red-600';
        if (pHValue < 6) return 'bg-orange-500';
        if (pHValue < 6.9) return 'bg-yellow-400 text-black';
        if (pHValue <= 7.1) return 'bg-green-500'; // Neutral range
        if (pHValue < 9) return 'bg-teal';
        if (pHValue < 11) return 'bg-blue-500';
        return 'bg-indigo-600';
    }
    const bgColor = getColor(pH);

    return (
        <div className="my-4 font-inter">
            <p className="text-sm text-center mb-1">pH Scale</p>
            {/* Simplified Gradient */}
            <div className="w-full h-4 bg-gradient-to-r from-red-600 via-green-500 to-indigo-600 rounded-full relative shadow-inner">
                <div
                    className="absolute top-[-4px] bottom-[-4px] w-1 border-l border-r border-white dark:border-gray-900 bg-black/50 rounded"
                    style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                    title={`pH ${pH.toFixed(1)}`}
                 ></div>
            </div>
            <div className="flex justify-between text-xs mt-1 text-gray-600 dark:text-gray-400">
                <span>0 (Acidic)</span>
                <span>7 (Neutral)</span>
                <span>14 (Basic)</span>
            </div>
             <p className={`text-center text-sm font-semibold mt-2 p-1 rounded ${bgColor} text-white mix-blend-luminosity dark:mix-blend-normal`}>
                pH: {pH.toFixed(1)} ({pH < 6.9 ? 'Acidic' : pH > 7.1 ? 'Basic' : 'Neutral'}) {/* Adjusted neutral range slightly */}
            </p>
        </div>
    );
}

// --- Page Specific Data ---
const quizQuestions = [
    // ... (Original quiz questions from the prompt - seems okay for this section)
     {
        "question": "According to Svante Arrhenius, what do acids increase in aqueous solutions?",
        "options": [
        "OH− concentration",
        "H+ concentration",
        "Water concentration",
        "Salt concentration"
        ],
        "correctAnswer": 1,
        "hint": "Acids increase the concentration of H+ (proton ions) in water."
    },
    {
        "question": "Which of the following is an example of a strong acid, according to the Arrhenius theory?",
        "options": [
        "Acetic acid",
        "Sodium hydroxide",
        "Perchloric acid",
        "Ammonia"
        ],
        "correctAnswer": 2,
        "hint": "Strong acids like perchloric acid completely ionize in aqueous solutions."
    },
    {
        "question": "In the Brønsted-Lowry theory, what is the role of a base?",
        "options": [
        "Proton donor",
        "Electron donor",
        "Proton acceptor",
        "Electron acceptor"
        ],
        "correctAnswer": 2,
        "hint": "A base in Brønsted-Lowry theory is a proton acceptor."
    },
    {
        "question": "What is formed when a Brønsted-Lowry acid donates a proton?",
        "options": [
        "A conjugate acid",
        "A conjugate base",
        "Water",
        "Hydroxide ions"
        ],
        "correctAnswer": 1,
        "hint": "A conjugate base is formed when an acid donates a proton."
    },
    {
        "question": "Which acid has a conjugate base that is a weak base?",
        "options": [
        "Hydrochloric acid",
        "Acetic acid",
        "Ammonium chloride",
        "Nitric acid"
        ],
        "correctAnswer": 0,
        "hint": "Strong acids like HCl have conjugate bases that are weak bases."
    },
    {
        "question": "What is the autoionization of water?",
        "options": [
        "The reaction where two water molecules form H3O+ and OH− ions",
        "The formation of HCl from H+ and Cl− ions",
        "The dissociation of NaOH in water",
        "The formation of hydrogen gas from water"
        ],
        "correctAnswer": 0,
        "hint": "Water ionizes into H3O+ and OH− ions in a self-ionization process."
    },
    {
        "question": "Which of the following is an example of an amphiprotic species?",
        "options": [
        "HCl",
        "Water",
        "NaOH",
        "Cl−"
        ],
        "correctAnswer": 1,
        "hint": "Water is the most important example of an amphiprotic species, acting as both an acid and a base."
    },
    {
        "question": "According to the Lewis acid-base theory, which of the following is true?",
        "options": [
        "A base donates a proton",
        "An acid accepts a proton",
        "A base donates an electron pair",
        "An acid donates an electron pair"
        ],
        "correctAnswer": 2,
        "hint": "In the Lewis theory, a base donates an electron pair, and an acid accepts one."
    }
];

// --- KaTeX String Constants ---
const katex_H_plus = 'H^+';
const katex_OH_minus = 'OH^-';
const katex_H3O_plus = 'H_3O^+';
const katex_HClO4_diss = `HClO_4(aq) + H_2O(l) \\rightarrow ${katex_H3O_plus}(aq) + ClO_4^-(aq)`;
const katex_NaOH_diss = `NaOH(s) \\xrightarrow{H_2O} Na^+(aq) + ${katex_OH_minus}(aq)`;
const katex_NH3_ionize = `NH_3(aq) + H_2O(l) \\rightleftharpoons NH_4^+(aq) + ${katex_OH_minus}(aq)`;
const katex_CH3COOH_ionize = `CH_3COOH(aq) + H_2O(l) \\rightleftharpoons CH_3COO^-(aq) + ${katex_H3O_plus}(aq)`;
const katex_Water_auto = `2H_2O(l) \\rightleftharpoons ${katex_H3O_plus}(aq) + ${katex_OH_minus}(aq)`;
const katex_BF3_NH3 = `BF_3 + {:NH_3} \\rightarrow F_3B{-}{:NH_3}`; // Corrected Lewis structure representation

// --- Main Page Component ---
const AcidBaseConceptsPage = () => {
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPH, setCurrentPH] = useState<number | null>(7.0); // Allow null for invalid state


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
                1.1 Acid-Base Concepts
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Arrhenius Theory */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Arrhenius Theory: The Water Perspective
                         </h2>
                         {/* ... Arrhenius text content using constants ... */}
                          <p className="leading-relaxed">
                            Proposed by Svante Arrhenius, this early theory defines acids and bases based on their behavior in water:
                             <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                 <li><strong className="text-coral dark:text-gold font-semibold">Arrhenius Acid:</strong> Increases <InlineMath math={katex_H_plus}/> (or <InlineMath math={katex_H3O_plus}/>) concentration. E.g., HClO₄.</li>
                                 <BlockMath math={katex_HClO4_diss} />
                                 <li><strong className="font-semibold text-teal dark:text-mint">Arrhenius Base:</strong> Increases <InlineMath math={katex_OH_minus}/> concentration. E.g., NaOH.</li>
                                  <BlockMath math={katex_NaOH_diss} />
                             </ul>
                         </p>
                         <p className="mt-3 text-sm italic leading-relaxed text-gray-600 dark:text-gray-400">
                             Limitations: Mainly applies to aqueous solutions; doesn't explain bases like NH₃.
                         </p>
                    </section>

                     {/* Brønsted-Lowry Theory */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Brønsted-Lowry Theory: Proton Transfer
                         </h2>
                          {/* ... Brønsted-Lowry text content using constants ... */}
                          <p className="leading-relaxed">
                             A broader definition focusing on proton (<InlineMath math={katex_H_plus}/>) movement:
                             <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                 <li><strong className="text-coral dark:text-gold font-semibold">Acid:</strong> Proton donor.</li>
                                 <li><strong className="font-semibold text-teal dark:text-mint">Base:</strong> Proton acceptor.</li>
                             </ul>
                          </p>
                           <p className="mt-3 leading-relaxed">
                              Example: Ammonia (<InlineMath math="NH_3"/>) + Water (<InlineMath math="H_2O"/>):
                           </p>
                           <BlockMath math={katex_NH3_ionize} />
                           <p className="leading-relaxed text-sm">
                               (Here, H₂O is the acid, NH₃ is the base).
                           </p>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Conjugate Acid-Base Pairs</h3>
                            <p className="leading-relaxed">
                                Acid/Base reactions create conjugate pairs:
                                <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                                     <li>Acid loses H⁺ → forms Conjugate Base</li>
                                     <li>Base gains H⁺ → forms Conjugate Acid</li>
                                </ul>
                            </p>
                             <p className="mt-3 leading-relaxed">
                                Example: Acetic acid (<InlineMath math="CH_3COOH"/>) + Water:
                             </p>
                              <BlockMath math={katex_CH3COOH_ionize} />
                              <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                                  <li>Pair 1: <InlineMath math="CH_3COOH"/> (Acid) / <InlineMath math="CH_3COO^-"/> (Conj. Base)</li>
                                  <li>Pair 2: <InlineMath math="H_2O"/> (Base) / <InlineMath math={katex_H3O_plus}/> (Conj. Acid)</li>
                              </ul>
                             <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Strength of Conjugates</h3>
                              <p className="leading-relaxed">
                                Strong Acid ⇌ Weak Conjugate Base. Weak Acid ⇌ Strong Conjugate Base.
                              </p>
                    </section>

                     {/* Water: Autoionization & Amphiprotic */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             The Role of Water
                         </h2>
                         {/* ... Water text content using constants ... */}
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Autoionization</h3>
                          <p className="leading-relaxed"> Water self-ionizes slightly:</p>
                           <BlockMath math={katex_Water_auto}/>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Amphiprotic Nature</h3>
                           <p className="leading-relaxed"> Water can act as both an acid (donating H⁺) and a base (accepting H⁺), making it <strong className="text-teal dark:text-teal font-semibold">amphiprotic</strong>.</p>
                     </section>

                    {/* Lewis Theory */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Lewis Theory: Electron Pairs
                         </h2>
                          {/* ... Lewis text content using constants ... */}
                          <p className="leading-relaxed">
                             The most general theory, focusing on electron pairs:
                             <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                 <li><strong className="text-coral dark:text-gold font-semibold">Lewis Acid:</strong> Electron pair acceptor.</li>
                                 <li><strong className="font-semibold text-teal dark:text-mint">Lewis Base:</strong> Electron pair donor.</li>
                             </ul>
                         </p>
                          <p className="mt-3 leading-relaxed">
                              Example: BF₃ (acid, accepts pair) + NH₃ (base, donates pair):
                          </p>
                           {/* Corrected BlockMath usage */}
                           <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                               <BlockMath math={katex_BF3_NH3} />
                           </div>
                           <p className="leading-relaxed">This definition includes reactions without proton transfer.</p>
                     </section>

                    {/* Study Tips Section */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Memorization Tips
                         </h2>
                         {/* ... Study tips content ... */}
                           <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                                <li><strong className="font-semibold">Visualize Definitions:</strong>
                                    <ul className="list-circle list-outside ml-6 mt-1 text-sm">
                                        <li>Arrhenius = Ions (<InlineMath math="H^+"/>/<InlineMath math="OH^-"/>) in Water</li>
                                        <li>Brønsted-Lowry = Proton (<InlineMath math="H^+"/>) Transfer (Donor/Acceptor)</li>
                                        <li>Lewis = Electron Pair Transfer (Acceptor/Donor) - Think <span className="italic">L</span>ewis = <span className="italic">L</span>one pair.</li>
                                    </ul>
                                </li>
                                 <li><strong className="font-semibold">Focus on Proton Movement (Brønsted-Lowry):</strong> Track where the H⁺ goes. Losing H⁺ = Acid → Conj. Base. Gaining H⁺ = Base → Conj. Acid.</li>
                                 <li><strong className="font-semibold">Conjugate Pair Strength Rule:</strong> Strong Acid ⇌ Weak Conj. Base; Weak Acid ⇌ Strong Conj. Base.</li>
                                 <li><strong className="font-semibold">Practice Identification:</strong> Label components in example reactions.</li>
                                 <li><strong className="font-semibold">Use Mnemonics:</strong> BAAD (Bases Accept, Acids Donate).</li>
                                 <li><strong className="font-semibold">Relate to pH:</strong> High [H⁺] = Acidic = Low pH.</li>
                                <li><strong className="font-semibold">Flashcards:</strong> For definitions, strong/weak acids/bases, and conjugate pairs.</li>
                           </ul>
                     </section>

                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                     {/* Panel 1: Overview Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="ANi7keb3pjE" title="Video: Introduction to Acids and Bases (Overview)"/>
                     </div>

                    {/* Panel 2: Brønsted-Lowry Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="pFKzgoVME_g" title="Video: Brønsted-Lowry & Conjugate Pairs"/>
                     </div>

                     {/* Panel 3: Conjugate Pair Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Conjugate Pair Check</h3>
                         <MiniCheckQuestion
                            question={`In the reaction: H₂S + OH⁻ ⇌ HS⁻ + H₂O, identify the Brønsted-Lowry base and its conjugate acid.`} // Changed to ask for base/conj acid
                            correctAnswer="Base: OH⁻, Conjugate Acid: H₂O"
                            explanation="OH⁻ accepts a proton (H⁺) from H₂S to become H₂O. Therefore, OH⁻ is the base, and H₂O is its conjugate acid."
                         />
                     </div>

                     {/* Panel 4: Lewis Acids/Bases Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="RdIwNKVb0-A" title="Video: Lewis Acids and Bases"/>
                     </div>

                      {/* Panel 5: Lewis Theory Mini Question - Corrected Props */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Lewis Theory Check</h3>
                           {/* **FIXED**: Passed props correctly as key="value" strings */}
                           <MiniCheckQuestion
                               question={`In the reaction: BF₃ + :NH₃ → F₃B:NH₃, which species acts as the Lewis acid?`}
                               correctAnswer="BF₃"
                               explanation="Boron in BF₃ lacks a full octet and can accept the electron pair from Nitrogen in NH₃."
                           />
                      </div>


                     {/* Panel 6: PhET Simulation Link */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Acid-Base Solutions</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Visualize dissociation and molecule interactions.</p>
                         <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                            <a href="https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_en.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open PhET: Acid-Base Solutions (New Tab)</span>
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
                    Test Your Acid-Base Concepts!
                </button>
            </div>
        </main>

        {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Acid-Base Concepts Quiz</h2>
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
AcidBaseConceptsPage.displayName = 'AcidBaseConceptsPage';

export default AcidBaseConceptsPage;
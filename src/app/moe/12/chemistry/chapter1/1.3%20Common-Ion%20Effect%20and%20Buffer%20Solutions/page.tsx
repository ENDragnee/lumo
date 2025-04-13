'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, useMemo, ChangeEvent, useEffect } from 'react'; // Added useMemo, ChangeEvent, useEffect
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

// --- Helper function for pH slider color (reused) ---
const getPhColor = (pHValue: number): string => {
    if (pHValue < 3) return 'bg-red-600';
    if (pHValue < 6) return 'bg-orange-500';
    if (pHValue < 6.9) return 'bg-yellow-400 text-black';
    if (pHValue <= 7.1) return 'bg-green-500'; // Neutral range
    if (pHValue < 9) return 'bg-teal';
    if (pHValue < 11) return 'bg-blue-500';
    return 'bg-indigo-600';
}

// --- Page Specific Data ---
// *** EXPANDED QUIZ QUESTIONS ***
const quizQuestions = [
  {
    "question": "What is the common-ion effect?",
    "options": [
      "The increase in solubility when a common ion is added",
      "The shift in equilibrium caused by adding an ion already present in the equilibrium", // Correct
      "The complete dissociation of strong electrolytes",
      "The formation of complex ions"
    ],
    "correctAnswer": 1,
    "hint": "It's an application of Le Chatelier's principle to ionic equilibria."
  },
  {
    "question": "If you add sodium acetate (NaCH₃COO) to a solution of acetic acid (CH₃COOH), what happens to the ionization of acetic acid?",
    "options": [
      "Increases significantly",
      "Decreases (is suppressed)", // Correct
      "Remains exactly the same",
      "Causes precipitation"
    ],
    "correctAnswer": 1,
    "hint": "Adding acetate ions (CH₃COO⁻), a product of the ionization, shifts the equilibrium to the left."
  },
  {
    "question": "What is the defining characteristic of a buffer solution?",
    "options": [
      "It has a pH of exactly 7.0",
      "It contains a strong acid and a strong base",
      "It resists changes in pH upon addition of small amounts of acid or base", // Correct
      "It neutralizes any added substance completely"
    ],
    "correctAnswer": 2,
    "hint": "Buffers maintain a relatively stable pH environment."
  },
  {
    "question": "Which pair could form an effective buffer solution?",
    "options": [
      "HCl (strong acid) and NaCl (salt of strong acid)",
      "NaOH (strong base) and NaCl (salt)",
      "HF (weak acid) and NaF (salt containing conjugate base F⁻)", // Correct
      "HNO₃ (strong acid) and KNO₃ (salt of strong acid)"
    ],
    "correctAnswer": 2,
    "hint": "Buffers require a weak acid/base and its conjugate pair in comparable amounts."
  },
   {
    "question": "What happens chemically when a small amount of strong acid (H⁺) is added to an acetate buffer (CH₃COOH / CH₃COO⁻)?",
    "options": [
      "The CH₃COOH reacts with H⁺",
      "The CH₃COO⁻ (conjugate base) reacts with H⁺ to form CH₃COOH", // Correct
      "The pH increases sharply",
      "Water reacts with H⁺"
    ],
    "correctAnswer": 1,
    "hint": "The basic component of the buffer neutralizes the added acid."
  },
  {
    "question": "What happens chemically when a small amount of strong base (OH⁻) is added to an acetate buffer (CH₃COOH / CH₃COO⁻)?",
    "options": [
      "The CH₃COO⁻ reacts with OH⁻",
      "The CH₃COOH (weak acid) reacts with OH⁻ to form CH₃COO⁻ and H₂O", // Correct
      "The pH decreases sharply",
      "The Na⁺ ions react with OH⁻"
    ],
    "correctAnswer": 1,
    "hint": "The acidic component of the buffer neutralizes the added base."
  },
  {
    "question": "The Henderson-Hasselbalch equation allows calculation of a buffer's pH. What does the term 'pKa' represent in this equation?",
    "options": [
      "The pH of the conjugate base",
      "The negative logarithm of the acid ionization constant (Ka)", // Correct
      "The concentration of the weak acid",
      "The buffer capacity"
    ],
    "correctAnswer": 1,
    "hint": "pKa is a measure of the weak acid's strength, similar to how pH measures acidity."
  },
  {
    "question": "According to the Henderson-Hasselbalch equation, when is the pH of a buffer equal to the pKa of the weak acid?",
    "options": [
      "When the concentration of the weak acid is zero",
      "When the concentration of the conjugate base is zero",
      "When the concentrations of the weak acid and its conjugate base are equal", // Correct
      "Never"
    ],
    "correctAnswer": 2,
    "hint": "If [A⁻]/[HA] = 1, then log([A⁻]/[HA]) = log(1) = 0, leaving pH = pKa."
  },
   {
    "question": "What is buffer capacity?",
    "options": [
      "The pH of the buffer solution",
      "The amount of acid or base the buffer can neutralize before the pH changes significantly", // Correct
      "The pKa of the weak acid component",
      "The concentration of the buffer components"
    ],
    "correctAnswer": 1,
    "hint": "Capacity depends on the absolute concentrations of the buffer components."
  },
   {
    "question": "Which factor primarily determines the *pH* at which a buffer is most effective?",
    "options": [
      "The total concentration of buffer components",
      "The temperature of the solution",
      "The pKa of the weak acid (or pKb of the weak base)", // Correct
      "The volume of the solution"
    ],
    "correctAnswer": 2,
    "hint": "Buffers work best when the desired pH is close to the pKa of the weak acid."
  }
];


// --- KaTeX String Constants ---
const katex_CH3COOH = 'CH_3COOH';
const katex_H2O = 'H_2O';
const katex_CH3COO_minus = 'CH_3COO^-';
const katex_H3O_plus = 'H_3O^+';
const katex_Acetate_Eq = `${katex_CH3COOH}(aq) + ${katex_H2O}(l) \\rightleftharpoons ${katex_CH3COO_minus}(aq) + ${katex_H3O_plus}(aq)`;
const katex_H_plus = 'H^+';
const katex_OH_minus = 'OH^-';
const katex_Buffer_Acid_React = `${katex_CH3COO_minus}(aq) + ${katex_H_plus}(aq) \\rightleftharpoons ${katex_CH3COOH}(aq)`;
const katex_Buffer_Base_React = `${katex_CH3COOH}(aq) + ${katex_OH_minus}(aq) \\rightleftharpoons ${katex_CH3COO_minus}(aq) + ${katex_H2O}(l)`;
const katex_HA = 'HA';
const katex_A_minus = 'A^-';
const katex_Ka = 'K_a';
const katex_pKa = 'pK_a';
const katex_H_plus_conc = `[${katex_H_plus}]`;
const katex_A_minus_conc = `[${katex_A_minus}]`;
const katex_HA_conc = `[${katex_HA}]`;
const katex_Ka_expr = `${katex_Ka} = \\frac{${katex_H_plus_conc}${katex_A_minus_conc}}{${katex_HA_conc}}`;
const katex_H_plus_from_Ka = `${katex_H_plus_conc} = ${katex_Ka} \\times \\frac{${katex_HA_conc}}{${katex_A_minus_conc}}`;
// Corrected Henderson-Hasselbalch forms
const katex_HH_acid = `pH = ${katex_pKa} + \\log \\left( \\frac{${katex_A_minus_conc}}{${katex_HA_conc}} \\right)`; // Correct log term for acid buffer
const katex_HH_base = `pOH = pK_b + \\log \\left( \\frac{[\\text{Conjugate acid}]}{[\\text{Weak base}]} \\right)`;

// --- Main Page Component ---
const CommonIonBufferPage = () => { // Renamed component
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Henderson-Hasselbalch Calculator State
  const [pKa, setPKa] = useState(4.74); // Example: Acetic Acid
  const [concBase, setConcBase] = useState(0.1); // [A-] or [Base]
  const [concAcid, setConcAcid] = useState(0.1); // [HA] or [Conj. Acid]

  // --- Memoized Calculations ---
  const calculatedPH_HH = useMemo(() => {
      if (concAcid <= 0 || concBase <= 0) return null; // Avoid log(0) or negative
      try {
        // pH = pKa + log([Base]/[Acid])
        return pKa + Math.log10(concBase / concAcid);
      } catch (e) {
          console.error("HH calculation error:", e);
          return null;
      }
  }, [pKa, concBase, concAcid]);


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
                1.3 Common-Ion Effect & Buffer Solutions {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Common-Ion Effect */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            The Common-Ion Effect
                         </h2>
                         <p className="leading-relaxed">
                             Imagine an equilibrium system, like the ionization of a weak acid (e.g., acetic acid, <InlineMath math={katex_CH3COOH}/>) in water:
                         </p>
                          <BlockMath math={katex_Acetate_Eq}/>
                         <p className="mt-3 leading-relaxed">
                             The <strong className="text-teal dark:text-teal font-semibold">common-ion effect</strong> describes what happens when we add a soluble salt containing one of the ions already involved in this equilibrium (a "common ion"). For example, if we add sodium acetate (<InlineMath math="NaCH_3COO"/>), which dissolves to produce <InlineMath math={katex_CH3COO_minus}/> ions.
                         </p>
                          <p className="mt-3 leading-relaxed">
                             According to <strong className="text-coral dark:text-gold font-semibold">Le Châtelier's Principle</strong>, adding a product (<InlineMath math={katex_CH3COO_minus}/>) will shift the equilibrium to the <strong className="text-coral dark:text-gold">left</strong>. This means the ionization of the weak acid (<InlineMath math={katex_CH3COOH}/>) is suppressed – less of it dissociates than it would in pure water. The same principle applies if we added a strong acid (providing common ion <InlineMath math={katex_H3O_plus}/>).
                          </p>
                          <p className="mt-3 leading-relaxed">
                              This effect is crucial for understanding and creating buffer solutions.
                          </p>
                    </section>

                    {/* Buffer Solutions */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Buffer Solutions: Resisting pH Change
                         </h2>
                          <p className="leading-relaxed">
                            A <strong className="text-teal dark:text-teal font-semibold">buffer solution</strong> is a remarkable mixture that resists significant changes in pH when small amounts of strong acid or strong base are added, or when the solution is diluted.
                          </p>
                          <p className="mt-3 leading-relaxed">
                              Buffers are typically composed of:
                              <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                 <li>A <strong className="font-semibold">weak acid</strong> and its <strong className="font-semibold">conjugate base</strong> (usually added as a salt). Example: Acetic acid (<InlineMath math={katex_CH3COOH}/>) and Sodium Acetate (<InlineMath math="NaCH_3COO"/>).</li>
                                 <li>OR</li>
                                  <li>A <strong className="font-semibold">weak base</strong> and its <strong className="font-semibold">conjugate acid</strong> (usually added as a salt). Example: Ammonia (<InlineMath math="NH_3"/>) and Ammonium Chloride (<InlineMath math="NH_4Cl"/>).</li>
                              </ul>
                          </p>
                           <p className="mt-3 leading-relaxed">
                              The key is having significant amounts of both the weak acid/base and its conjugate partner present in the solution.
                           </p>
                    </section>

                    {/* How Buffers Work */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             How Buffers Work
                         </h2>
                         <p className="leading-relaxed">
                             Consider the acetic acid/acetate buffer (<InlineMath math={katex_CH3COOH}/> / <InlineMath math={katex_CH3COO_minus}/>):
                         </p>
                         <ul className="list-disc list-outside ml-6 space-y-2 mt-2">
                            <li>
                                <strong className="font-semibold">Adding Acid (<InlineMath math={katex_H_plus}/>):</strong> The added H⁺ ions react with the abundant conjugate base (<InlineMath math={katex_CH3COO_minus}/>) present in the buffer:
                                <BlockMath math={katex_Buffer_Acid_React}/>
                                This reaction consumes the added H⁺ and forms more weak acid, preventing a large drop in pH.
                            </li>
                             <li>
                                 <strong className="font-semibold">Adding Base (<InlineMath math={katex_OH_minus}/>):</strong> The added OH⁻ ions react with the abundant weak acid (<InlineMath math={katex_CH3COOH}/>) present in the buffer:
                                 <BlockMath math={katex_Buffer_Base_React}/>
                                 This reaction consumes the added OH⁻ and forms more conjugate base and water, preventing a large rise in pH.
                             </li>
                         </ul>
                          <p className="mt-3 leading-relaxed">
                              The buffer effectively neutralizes small additions of strong acid or base by converting them into the weak acid or weak base components of the buffer system itself, thus minimizing the pH change.
                          </p>
                     </section>

                     {/* Biological Importance */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Biological Importance
                         </h2>
                         <p className="leading-relaxed">
                             Maintaining a stable pH is vital for life. Enzymes and other biological molecules function optimally only within a narrow pH range. Body fluids contain natural buffer systems. For example, human blood is buffered primarily by the carbonic acid/bicarbonate system (<InlineMath math="H_2CO_3 / HCO_3^-"/>) to maintain a pH very close to 7.4. Deviations from this range can be life-threatening.
                         </p>
                     </section>

                    {/* Henderson-Hasselbalch Equation */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             The Henderson-Hasselbalch Equation
                         </h2>
                          <p className="leading-relaxed">
                             This equation provides a convenient way to estimate the pH of a buffer solution prepared from a weak acid (<InlineMath math={katex_HA}/>) and its conjugate base (<InlineMath math={katex_A_minus}/>), or to determine the ratio of base to acid needed to achieve a specific pH.
                          </p>
                           <p className="mt-3 leading-relaxed">
                             Starting with the <InlineMath math={katex_Ka}/> expression (<InlineMath math={katex_Ka_expr}/>) and solving for <InlineMath math={katex_H_plus_conc}/> (<InlineMath math={katex_H_plus_from_Ka}/>), then taking the negative logarithm of both sides gives:
                          </p>
                          {/* Show derivation step briefly */}
                          {/* <BlockMath>{`-\\log[${katex_H_plus_conc}] = -\\log(${katex_Ka}) - \\log \\left( \\frac{${katex_HA_conc}}{${katex_A_minus_conc}} \\right)`}</BlockMath> */}
                           <p className="leading-relaxed">
                             Using the definitions pH = -log[H⁺] and pKa = -log(Ka), and flipping the log term gives the standard form:
                           </p>
                            <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                              <BlockMath math={katex_HH_acid}/>
                            </div>
                             <p className="leading-relaxed">
                              Similarly, for a buffer made from a weak base and its conjugate acid:
                           </p>
                            <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                                <BlockMath math={katex_HH_base}/>
                            </div>
                            <p className="text-sm italic leading-relaxed text-gray-600 dark:text-gray-400 mt-2">
                                Note: These equations work best when the concentrations of the acid/base and their conjugates are significant and not extremely dilute, and when the desired pH is close to the pKa (or pOH close to pKb).
                            </p>
                      </section>

                      {/* Study Tips Section */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Memorization Tips
                         </h2>
                         <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                             <li><strong className="font-semibold">Common Ion = Le Châtelier:</strong> Think of adding a common ion as adding a product (or reactant) to an existing equilibrium. The equilibrium will shift away from the added substance.</li>
                             <li><strong className="font-semibold">Buffer Definition:</strong> Key phrase: "Resists pH change". Key components: Weak Acid + Conjugate Base OR Weak Base + Conjugate Acid.</li>
                              <li><strong className="font-semibold">How Buffers Work (Visualize):</strong> Imagine two "sponges" in the solution. One (the conjugate base) soaks up added H⁺. The other (the weak acid) soaks up added OH⁻. This prevents large swings in free H⁺ or OH⁻.</li>
                              <li><strong className="font-semibold">Henderson-Hasselbalch Uses:</strong> 1) Calculate pH of a buffer if you know pKa and concentrations. 2) Calculate the ratio [Base]/[Acid] needed to make a buffer of a specific pH.</li>
                              <li><strong className="font-semibold">pH = pKa Point:</strong> Understand why pH = pKa when [Base] = [Acid]. This is the point of maximum buffer capacity – where the buffer resists pH change most effectively in both directions.</li>
                               <li><strong className="font-semibold">Practice Problems:</strong> Work through common-ion effect calculations (using ICE tables) and buffer calculations (using Henderson-Hasselbalch or ICE tables).</li>
                           </ul>
                     </section>

                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                      {/* Panel 1: Common Ion Effect Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="PqS0zEY33Cs" title="Video: The Common Ion Effect"/>
                     </div>

                     {/* Panel 2: Buffer Solutions Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="jQpJwGlg4tU" title="Video: Buffer Solutions Explained"/>
                     </div>

                     {/* Panel 3: How Buffers Work Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Buffer Action Check</h3>
                          <MiniCheckQuestion
                             question="A buffer contains hydrofluoric acid (HF, weak acid) and fluoride ions (F⁻, conjugate base). What happens if a small amount of NaOH (a strong base) is added?"
                             correctAnswer="The HF reacts with the added OH⁻: HF + OH⁻ → F⁻ + H₂O"
                             explanation="The weak acid component (HF) neutralizes the added strong base (OH⁻), converting it into the conjugate base (F⁻) and water, thus minimizing the pH increase."
                         />
                     </div>

                     {/* Panel 4: Henderson-Hasselbalch Calculator */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <h3 className="text-xl font-semibold font-inter mb-4 text-green-700 dark:text-green-300">Henderson-Hasselbalch pH Calculator</h3>
                          <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Estimate buffer pH using the H-H equation (<InlineMath math={katex_HH_acid}/>).</p>
                          {/* Assuming pKa input, could also calculate from Ka */}
                           <div className="mb-3 font-inter">
                              <label htmlFor="pKaInput" className="block text-sm font-medium mb-1">pKa of Weak Acid:</label>
                              <input type="number" id="pKaInput" step="0.01" value={pKa} onChange={(e) => setPKa(parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-light-gray" placeholder="e.g., 4.74" />
                          </div>
                           <div className="mb-3 font-inter">
                               <label htmlFor="concBaseInput" className="block text-sm font-medium mb-1">Concentration of Conjugate Base [A⁻] (M):</label>
                              <input type="number" id="concBaseInput" step="0.01" min="0.001" value={concBase} onChange={(e) => setConcBase(parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-light-gray" placeholder="e.g., 0.1" />
                           </div>
                           <div className="mb-4 font-inter">
                                <label htmlFor="concAcidInput" className="block text-sm font-medium mb-1">Concentration of Weak Acid [HA] (M):</label>
                              <input type="number" id="concAcidInput" step="0.01" min="0.001" value={concAcid} onChange={(e) => setConcAcid(parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-light-gray" placeholder="e.g., 0.1" />
                           </div>

                           <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 rounded shadow-inner text-center">
                               <p className="text-lg font-semibold font-inter text-dark-gray dark:text-light-gray">
                                 Calculated Buffer pH ≈ <span className="font-bold text-teal dark:text-mint">
                                     {calculatedPH_HH !== null && isFinite(calculatedPH_HH) ? calculatedPH_HH.toFixed(2) : "Invalid Input"}
                                 </span>
                               </p>
                           </div>
                            <MiniCheckQuestion
                             question="If you want to make a buffer with pH = 5.00 using an acid with pKa = 4.74, should the concentration of the conjugate base [A⁻] be higher or lower than the concentration of the weak acid [HA]?"
                             correctAnswer="[A⁻] should be higher than [HA]."
                             explanation="pH = pKa + log([A⁻]/[HA]). Since the target pH (5.00) is higher than the pKa (4.74), the log term must be positive. This requires the ratio [A⁻]/[HA] to be greater than 1."
                         />
                     </div>

                      {/* Panel 5: Biological Buffers Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="mogSeD6XMjY" title="Video: Buffers in Biological Systems (e.g., Blood)"/>
                      </div>

                     {/* Panel 6: PhET Simulation Link */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Acid-Base Solutions</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Observe the common-ion effect and buffer action in this simulation.</p>
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
                    Test Your Buffer Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
         {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Common Ion & Buffers Quiz</h2>
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
CommonIonBufferPage.displayName = 'CommonIonBufferPage';

export default CommonIonBufferPage;
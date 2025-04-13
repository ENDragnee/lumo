'use client';

import { InlineMath, BlockMath } from 'react-katex';
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

// --- Page Specific Data ---
// *** EXPANDED QUIZ QUESTIONS for Hydrolysis ***
const quizQuestions = [
  {
    "question": "What is hydrolysis in the context of salts?",
    "options": [
      "The dissolving of salt in water",
      "The reaction of salt ions (cation or anion or both) with water to produce H₃O⁺ or OH⁻", // Correct
      "The formation of salt from acid and base",
      "The evaporation of water from a salt solution"
    ],
    "correctAnswer": 1,
    "hint": "Hydrolysis means 'water splitting' and involves ions reacting with water molecules."
  },
  {
    "question": "A salt formed from a strong acid (like HCl) and a strong base (like NaOH) produces a solution that is:",
    "options": [
      "Acidic",
      "Basic",
      "Neutral", // Correct
      "Depends on concentration"
    ],
    "correctAnswer": 2,
    "hint": "Neither the cation (e.g., Na⁺) nor the anion (e.g., Cl⁻) from strong parents hydrolyzes significantly."
  },
  {
    "question": "When sodium acetate (NaCH₃COO) dissolves in water, which ion hydrolyzes and what is the effect on pH?",
    "options": [
      "Na⁺ hydrolyzes, making it acidic",
      "CH₃COO⁻ hydrolyzes, making it basic", // Correct
      "Both hydrolyze, making it neutral",
      "Neither hydrolyzes, making it neutral"
    ],
    "correctAnswer": 1,
    "hint": "Acetate (CH₃COO⁻) is the conjugate base of a weak acid (CH₃COOH) and acts as a weak base in water, accepting H⁺ and leaving excess OH⁻."
  },
  {
    "question": "The hydrolysis reaction for the acetate ion (CH₃COO⁻) is:",
    "options": [
      "CH₃COO⁻ + H₃O⁺ → CH₃COOH + H₂O",
      "CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻", // Correct
      "CH₃COOH + H₂O ⇌ CH₃COO⁻ + H₃O⁺",
      "Na⁺ + H₂O → NaOH + H⁺"
    ],
    "correctAnswer": 1,
    "hint": "The weak conjugate base accepts a proton from water, producing hydroxide ions."
  },
   {
    "question": "A salt formed from a weak base (like NH₃) and a strong acid (like HCl) produces a solution that is:",
    "options": [
      "Acidic", // Correct
      "Basic",
      "Neutral",
      "Depends on temperature"
    ],
    "correctAnswer": 0,
    "hint": "The cation (e.g., NH₄⁺) is the conjugate acid of a weak base and acts as a weak acid in water, donating H⁺."
  },
  {
    "question": "The hydrolysis reaction for the ammonium ion (NH₄⁺) is:",
    "options": [
      "NH₄⁺ + OH⁻ → NH₃ + H₂O",
      "NH₃ + H₂O ⇌ NH₄⁺ + OH⁻",
      "NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺", // Correct
      "Cl⁻ + H₂O → HCl + OH⁻"
    ],
    "correctAnswer": 2,
    "hint": "The weak conjugate acid donates a proton to water, producing hydronium ions."
  },
  {
    "question": "For a salt made from a weak acid (HA) and a weak base (B), the solution will be acidic if:",
    "options": [
      "Ka(HA) < Kb(B)",
      "Ka(HA) > Kb(B)", // Correct
      "Ka(HA) = Kb(B)",
      "The salt concentration is high"
    ],
    "correctAnswer": 1,
    "hint": "If the acid component (cation hydrolysis producing H₃O⁺) is stronger than the base component (anion hydrolysis producing OH⁻), the solution is acidic."
  },
  {
    "question": "For a salt made from a weak acid and a weak base, the solution will be approximately neutral if:",
    "options": [
      "Ka >> Kb",
      "Kb >> Ka",
      "Ka ≈ Kb", // Correct
      "The salt is insoluble"
    ],
    "correctAnswer": 2,
    "hint": "If the extent of cation hydrolysis (making H₃O⁺) is roughly equal to the extent of anion hydrolysis (making OH⁻), the pH will be near 7."
  },
  {
    "question": "Which ion acts as a 'spectator ion' and does NOT typically undergo hydrolysis in water?",
    "options": [
      "CH₃COO⁻ (acetate)",
      "NH₄⁺ (ammonium)",
      "F⁻ (fluoride)",
      "Cl⁻ (chloride)" // Correct
    ],
    "correctAnswer": 3,
    "hint": "Anions derived from strong acids (like Cl⁻ from HCl) are extremely weak bases and don't react significantly with water."
  },
   {
    "question": "Which ion acts as a 'spectator ion' and does NOT typically undergo hydrolysis in water?",
    "options": [
      "Al³⁺ (Aluminum ion)",
      "Fe³⁺ (Iron(III) ion)",
      "Na⁺ (Sodium ion)", // Correct
      "NH₄⁺ (Ammonium ion)"
    ],
    "correctAnswer": 2,
    "hint": "Cations derived from strong bases (like Na⁺ from NaOH) are extremely weak acids and don't react significantly with water. (Note: Small, highly charged metal ions like Al³⁺ *can* hydrolyze)."
  }
];

// --- KaTeX String Constants ---
const katex_H_plus = 'H^+';
const katex_OH_minus = 'OH^-';
const katex_H2O = 'H_2O';
const katex_H3O_plus = 'H_3O^+';
const katex_NaOH = 'NaOH';
const katex_HCl = 'HCl';
const katex_NaCl = 'NaCl';
const katex_Na_plus = 'Na^+';
const katex_Cl_minus = 'Cl^-';
const katex_Strong_Neut = `\\text{Strong Acid + Strong Base} \\rightarrow \\text{Neutral Salt (pH=7)}`;
const katex_CH3COOH = 'CH_3COOH';
const katex_CH3COONa = 'CH_3COONa';
const katex_CH3COO_minus = 'CH_3COO^-';
const katex_WeakA_StrongB = `${katex_CH3COOH}(aq) + ${katex_NaOH}(aq) \\rightarrow ${katex_CH3COONa}(aq) + ${katex_H2O}(l)`;
const katex_Acetate_Hydrolysis = `${katex_CH3COO_minus}(aq) + ${katex_H2O}(l) \\rightleftharpoons ${katex_CH3COOH}(aq) + ${katex_OH_minus}(aq)`;
const katex_WeakA_StrongB_Result = `\\text{Weak Acid + Strong Base} \\rightarrow \\text{Basic Salt (pH>7)}`;
const katex_NH3 = 'NH_3';
const katex_NH4Cl = 'NH_4Cl';
const katex_NH4_plus = 'NH_4^+';
const katex_WeakB_StrongA = `${katex_NH3}(aq) + ${katex_HCl}(aq) \\rightarrow ${katex_NH4Cl}(aq)`;
const katex_Ammonium_Hydrolysis = `${katex_NH4_plus}(aq) + ${katex_H2O}(l) \\rightleftharpoons ${katex_NH3}(aq) + ${katex_H3O_plus}(aq)`;
const katex_WeakB_StrongA_Result = `\\text{Weak Base + Strong Acid} \\rightarrow \\text{Acidic Salt (pH<7)}`;
const katex_Ka = 'K_a';
const katex_Kb = 'K_b';
const katex_Weak_Weak_Compare = `\\text{Compare } ${katex_Ka}(\\text{cation}) \\text{ vs } ${katex_Kb}(\\text{anion})`;
const katex_Ka_gt_Kb = `${katex_Ka} > ${katex_Kb} \\rightarrow \\text{Acidic Solution}`;
const katex_Kb_gt_Ka = `${katex_Kb} > ${katex_Ka} \\rightarrow \\text{Basic Solution}`;
const katex_Ka_eq_Kb = `${katex_Ka} \\approx ${katex_Kb} \\rightarrow \\text{Neutral Solution}`;


// --- Main Page Component ---
const HydrolysisOfSaltsPage = () => { // Renamed component
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
                1.4 Hydrolysis of Salts {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* What is Hydrolysis? */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             What is Salt Hydrolysis?
                         </h2>
                         <p className="leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Hydrolysis</strong> literally means "water splitting". In the context of salts dissolved in water, it refers to the reaction of the salt's ions (the cation or anion, or both) with water molecules.
                         </p>
                         <p className="mt-3 leading-relaxed">
                            This interaction can change the concentration of hydronium (<InlineMath math={katex_H3O_plus}/>) or hydroxide (<InlineMath math={katex_OH_minus}/>) ions in the solution, causing the solution's pH to deviate from neutral (pH 7). Whether a salt solution is acidic, basic, or neutral depends on the nature of the acid and base from which the salt was formed.
                         </p>
                    </section>

                    {/* Salt Type 1: Strong Acid + Strong Base */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            1. Salt of Strong Acid + Strong Base
                         </h2>
                         <p className="leading-relaxed">
                            Example: Sodium chloride (<InlineMath math={katex_NaCl}/>), formed from <InlineMath math={katex_HCl}/> (strong acid) and <InlineMath math={katex_NaOH}/> (strong base).
                         </p>
                          <BlockMath math={`NaOH(aq) + HCl(aq) \\rightarrow NaCl(aq) + H_2O(l)`} />
                          <p className="mt-3 leading-relaxed">
                            When NaCl dissolves, it forms <InlineMath math={katex_Na_plus}/> and <InlineMath math={katex_Cl_minus}/> ions.
                            <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                                <li><InlineMath math={katex_Na_plus}/> is the conjugate acid of a strong base (NaOH). It's a very weak acid and does <strong className="text-coral dark:text-gold">not</strong> react with water (hydrolyze) to produce H₃O⁺.</li>
                                <li><InlineMath math={katex_Cl_minus}/> is the conjugate base of a strong acid (HCl). It's a very weak base and does <strong className="text-coral dark:text-gold">not</strong> react with water (hydrolyze) to produce OH⁻.</li>
                            </ul>
                          </p>
                          <p className="mt-3 leading-relaxed font-semibold text-teal dark:text-mint">
                            Result: Neither ion hydrolyzes significantly. The solution remains neutral (pH ≈ 7 at 25°C).
                          </p>
                           <BlockMath math={katex_Strong_Neut} />
                     </section>

                    {/* Salt Type 2: Weak Acid + Strong Base */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            2. Salt of Weak Acid + Strong Base
                         </h2>
                          <p className="leading-relaxed">
                            Example: Sodium acetate (<InlineMath math={katex_CH3COONa}/>), formed from <InlineMath math={katex_CH3COOH}/> (weak acid) and <InlineMath math={katex_NaOH}/> (strong base).
                          </p>
                          <BlockMath math={katex_WeakA_StrongB} />
                           <p className="mt-3 leading-relaxed">
                            When NaCH₃COO dissolves, it forms <InlineMath math={katex_Na_plus}/> and <InlineMath math={katex_CH3COO_minus}/> ions.
                            <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                                <li><InlineMath math={katex_Na_plus}/> (from strong base) does <strong className="text-coral dark:text-gold">not</strong> hydrolyze.</li>
                                 <li><InlineMath math={katex_CH3COO_minus}/> (acetate, conjugate base of weak acid CH₃COOH) <strong className="text-teal dark:text-teal">does</strong> hydrolyze. It acts as a weak base, accepting a proton from water:</li>
                                 <BlockMath math={katex_Acetate_Hydrolysis} />
                            </ul>
                           </p>
                           <p className="mt-3 leading-relaxed font-semibold text-teal dark:text-mint">
                             Result: Hydrolysis produces excess <InlineMath math={katex_OH_minus}/> ions. The solution becomes basic (pH &gt 7 at 25°C).
                           </p>
                           <BlockMath math={katex_WeakA_StrongB_Result}/>
                     </section>

                     {/* Salt Type 3: Strong Acid + Weak Base */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            3. Salt of Strong Acid + Weak Base
                         </h2>
                          <p className="leading-relaxed">
                            Example: Ammonium chloride (<InlineMath math={katex_NH4Cl}/>), formed from <InlineMath math={katex_HCl}/> (strong acid) and <InlineMath math={katex_NH3}/> (weak base).
                          </p>
                           <BlockMath math={katex_WeakB_StrongA}/>
                          <p className="mt-3 leading-relaxed">
                            When NH₄Cl dissolves, it forms <InlineMath math={katex_NH4_plus}/> and <InlineMath math={katex_Cl_minus}/> ions.
                             <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                                <li><InlineMath math={katex_Cl_minus}/> (from strong acid) does <strong className="text-coral dark:text-gold">not</strong> hydrolyze.</li>
                                <li><InlineMath math={katex_NH4_plus}/> (ammonium, conjugate acid of weak base NH₃) <strong className="text-teal dark:text-teal">does</strong> hydrolyze. It acts as a weak acid, donating a proton to water:</li>
                                <BlockMath math={katex_Ammonium_Hydrolysis}/>
                            </ul>
                           </p>
                           <p className="mt-3 leading-relaxed font-semibold text-coral dark:text-gold">
                             Result: Hydrolysis produces excess <InlineMath math={katex_H3O_plus}/> ions. The solution becomes acidic (pH &lt 7 at 25°C).
                           </p>
                           <BlockMath math={katex_WeakB_StrongA_Result}/>
                     </section>

                      {/* Salt Type 4: Weak Acid + Weak Base */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            4. Salt of Weak Acid + Weak Base
                         </h2>
                          <p className="leading-relaxed">
                            Example: Ammonium acetate (<InlineMath math="NH_4CH_3COO"/>), formed from <InlineMath math={katex_CH3COOH}/> (weak acid) and <InlineMath math={katex_NH3}/> (weak base).
                          </p>
                          <p className="mt-3 leading-relaxed">
                            In this case, <strong className="text-teal dark:text-teal font-semibold">both ions hydrolyze</strong>:
                              <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                                <li>Cation acts as acid: <InlineMath math={`${katex_NH4_plus}(aq) + H_2O(l) \\rightleftharpoons ${katex_NH3}(aq) + ${katex_H3O_plus}(aq)`}/></li>
                                <li>Anion acts as base: <InlineMath math={`${katex_CH3COO_minus}(aq) + H_2O(l) \\rightleftharpoons ${katex_CH3COOH}(aq) + ${katex_OH_minus}(aq)`}/></li>
                             </ul>
                          </p>
                           <p className="mt-3 leading-relaxed">
                              The overall pH of the solution depends on the <strong className="text-coral dark:text-gold">relative strengths</strong> of the cation as an acid (measured by its <InlineMath math={katex_Ka}/>) and the anion as a base (measured by its <InlineMath math={katex_Kb}/>). Remember that for conjugates, <InlineMath math="K_a \times K_b = K_w"/>).
                           </p>
                            <ul className="list-disc list-outside ml-6 space-y-1 mt-2">
                               <li>If <InlineMath math="K_a(\text{cation}) > K_b(\text{anion})"/>: Solution is <strong className="text-coral dark:text-gold">acidic</strong> (pH &lt 7).</li>
                               <li>If <InlineMath math="K_b(\text{anion}) > K_a(\text{cation})"/>: Solution is <strong className="text-teal dark:text-mint">basic</strong> (pH &gt 7).</li>
                                <li>If <InlineMath math="K_a(\text{cation}) \approx K_b(\text{anion})"/>: Solution is approximately <strong className="font-semibold">neutral</strong> (pH ≈ 7).</li>
                            </ul>
                           <p className="mt-3 text-sm italic text-gray-600 dark:text-gray-400">
                                Example: For ammonium acetate, Ka(NH₄⁺) ≈ 5.6x10⁻¹⁰ and Kb(CH₃COO⁻) ≈ 5.6x10⁻¹⁰. Since Ka ≈ Kb, the solution is approximately neutral.
                           </p>
                     </section>

                     {/* Study Tips Section */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Memorization Tips
                         </h2>
                         <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                              <li><strong className="font-semibold">Identify the Parents:</strong> To predict hydrolysis, determine the acid and base that *could* form the salt (e.g., NaCl comes from NaOH + HCl).</li>
                              <li><strong className="font-semibold">Strength Matters:</strong> Memorize common strong acids (HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄) and strong bases (Group 1A hydroxides, Ca(OH)₂, Sr(OH)₂, Ba(OH)₂). If an ion comes from a strong parent, it's a weak conjugate and likely won't hydrolyze significantly (it's a spectator).</li>
                              <li><strong className="font-semibold">Weak Creates Reaction:</strong> If an ion comes from a weak parent, it's a relatively stronger conjugate and *will* hydrolyze.
                                  <ul className="list-circle list-outside ml-6 mt-1 text-sm">
                                      <li>Cation from Weak Base → Weak Acid → Donates H⁺ to H₂O → Forms H₃O⁺ → Acidic Solution</li>
                                      <li>Anion from Weak Acid → Weak Base → Accepts H⁺ from H₂O → Forms OH⁻ → Basic Solution</li>
                                  </ul>
                              </li>
                               <li><strong className="font-semibold">Weak + Weak = Compare K's:</strong> If both ions come from weak parents, compare Ka of the cation (acting as acid) and Kb of the anion (acting as base). The larger K value dominates the pH.</li>
                                <li><strong className="font-semibold">Visualize the Reaction:</strong> Write out the hydrolysis reaction for the ion that reacts with water. Does it produce H₃O⁺ or OH⁻?</li>
                           </ul>
                     </section>

                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                     {/* Panel 1: Hydrolysis Intro Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="jpLka7pQ8uQ" title="Video: Introduction to Salt Hydrolysis"/>
                     </div>

                     {/* Panel 2: Strong/Strong Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Strong Acid + Strong Base Salt</h3>
                          <MiniCheckQuestion
                             question="Potassium Nitrate (KNO₃) is formed from KOH (strong base) and HNO₃ (strong acid). Will a solution of KNO₃ be acidic, basic, or neutral?"
                             correctAnswer="Neutral."
                             explanation="K⁺ comes from a strong base (KOH) and NO₃⁻ comes from a strong acid (HNO₃). Neither ion hydrolyzes significantly, so the pH remains approximately 7."
                         />
                     </div>

                    {/* Panel 3: Weak Acid / Strong Base Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="QWmQ_1QYGjA" title="Video: Hydrolysis of Salts (Weak Acid/Strong Base Example)"/>
                     </div>

                     {/* Panel 4: Weak Base / Strong Acid Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Strong Acid + Weak Base Salt</h3>
                          <MiniCheckQuestion
                             question="Pyridinium chloride (C₅H₅NHCl) is formed from pyridine (C₅H₅N, a weak base) and HCl (a strong acid). Will a solution of C₅H₅NHCl be acidic, basic, or neutral?"
                             correctAnswer="Acidic."
                             explanation="Cl⁻ (from strong acid HCl) doesn't hydrolyze. The pyridinium ion (C₅H₅NH⁺, conjugate acid of weak base pyridine) *does* hydrolyze (C₅H₅NH⁺ + H₂O ⇌ C₅H₅N + H₃O⁺), producing H₃O⁺ and making the solution acidic."
                         />
                     </div>

                     {/* Panel 5: Weak Acid / Weak Base Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-red-700 dark:text-coral">Weak Acid + Weak Base Salt</h3>
                          <MiniCheckQuestion
                             question="Ammonium cyanide (NH₄CN) is formed from NH₃ (weak base, Kb=1.8x10⁻⁵) and HCN (weak acid, Ka=4.9x10⁻¹⁰). Will a solution of NH₄CN be acidic, basic, or neutral?"
                             correctAnswer="Basic."
                             explanation="We need Ka for NH₄⁺ and Kb for CN⁻. Ka(NH₄⁺) = Kw/Kb(NH₃) = 10⁻¹⁴ / (1.8x10⁻⁵) ≈ 5.6x10⁻¹⁰. Kb(CN⁻) = Kw/Ka(HCN) = 10⁻¹⁴ / (4.9x10⁻¹⁰) ≈ 2.0x10⁻⁵. Since Kb(CN⁻) > Ka(NH₄⁺), the anion hydrolysis dominates, producing more OH⁻, making the solution basic."
                         />
                     </div>

                     {/* Panel 6: PhET Simulation Link */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Acid-Base Solutions</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Observe how different salts affect the pH of water in this simulation.</p>
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
                    Test Your Hydrolysis Knowledge!
                </button>
            </div>
        </main>

        {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Salt Hydrolysis Quiz</h2>
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
HydrolysisOfSaltsPage.displayName = 'HydrolysisOfSaltsPage';

export default HydrolysisOfSaltsPage;
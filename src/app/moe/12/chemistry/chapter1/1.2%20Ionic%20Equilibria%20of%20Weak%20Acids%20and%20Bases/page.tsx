'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, useMemo, ChangeEvent, useEffect } from 'react';
import QuizQuestion from '@/components/QuizQuestion'; // Assuming this component exists
import 'katex/dist/katex.min.css';

// --- Constants ---
const KW_25C = 1.0e-14;

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
            {/* **FIXED**: Simplified Gradient */}
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
                pH: {pH.toFixed(1)} ({pH < 6.9 ? 'Acidic' : pH > 7.1 ? 'Basic' : 'Neutral'})
            </p>
        </div>
    );
}


// --- Page Specific Data ---
const quizQuestions = [
    // ... (Original quiz questions - expanded in previous step)
      {
        "question": "What process describes water molecules reacting with each other to form H₃O⁺ and OH⁻ ions?",
        "options": ["Hydrolysis", "Neutralization", "Autoionization (Self-ionization)", "Dissociation"],
        "correctAnswer": 2,
        "hint": "This equilibrium exists even in pure water."
    },
    {
        "question": "What is the value of the ion-product constant for water (Kw) at 25°C?",
        "options": ["1.0 x 10⁻⁷", "1.0 x 10⁻¹⁴", "7.0", "14.0"],
        "correctAnswer": 1,
        "hint": "Kw = [H₃O⁺][OH⁻] = 1.0 x 10⁻¹⁴ at standard temperature."
    },
    {
        "question": "In a neutral solution at 25°C, what is the concentration of H₃O⁺ ions?",
        "options": ["1.0 x 10⁻¹⁴ M", "0 M", "1.0 x 10⁻⁷ M", "7.0 M"],
        "correctAnswer": 2,
        "hint": "In neutral water, [H₃O⁺] = [OH⁻]. Since Kw = [H₃O⁺][OH⁻] = 1.0 x 10⁻¹⁴, solve for [H₃O⁺]."
    },
    {
        "question": "If a solution has [H₃O⁺] > 1.0 x 10⁻⁷ M, it is considered:",
        "options": ["Acidic", "Neutral", "Basic", "Concentrated"],
        "correctAnswer": 0,
        "hint": "Higher hydronium concentration means lower pH, indicating acidity."
    },
    {
        "question": "The pH scale is defined as:",
        "options": ["pH = log[H₃O⁺]", "pH = 10^[H₃O⁺]", "pH = -log[H₃O⁺]", "pH = [H₃O⁺] / Kw"],
        "correctAnswer": 2,
        "hint": "It's the negative base-10 logarithm of the hydronium ion concentration."
    },
    {
        "question": "A solution has a pH of 9.0. What is its pOH at 25°C?",
        "options": ["9.0", "7.0", "5.0", "1.0 x 10⁻⁹"],
        "correctAnswer": 2,
        "hint": "Remember the relationship: pH + pOH = 14.0 at 25°C."
    },
     {
        "question": "If the pOH of a solution is 3.5, what is the [OH⁻] concentration?",
        "options": ["10^3.5 M", "10^(-3.5) M", "-log(3.5) M", "14 - 3.5 M"],
        "correctAnswer": 1,
        "hint": "The relationship is [OH⁻] = 10^(-pOH)."
    },
    {
        "question": "The acid ionization constant (Ka) is the equilibrium constant for which reaction?",
        "options": ["The formation of water", "The dissociation of a base", "The dissociation of an acid in water", "The neutralization reaction"],
        "correctAnswer": 2,
        "hint": "Ka measures the extent to which an acid donates protons to water."
    },
    {
        "question": "A larger Ka value indicates a:",
        "options": ["Weaker acid", "Stronger acid", "Weaker base", "Stronger base"],
        "correctAnswer": 1,
        "hint": "Larger Ka means the acid dissociates more completely, making it stronger."
    },
    {
        "question": "The base dissociation constant (Kb) measures the strength of a base based on its ability to:",
        "options": ["Donate protons", "Accept protons from water (producing OH⁻)", "Donate electrons", "Accept electrons"],
        "correctAnswer": 1,
        "hint": "Kb is the equilibrium constant for the reaction B + H₂O ⇌ BH⁺ + OH⁻."
    },
     {
        "question": "For a weak acid, the percent ionization typically ______ as the initial concentration of the acid decreases.",
        "options": ["Increases", "Decreases", "Stays the same", "Becomes zero"],
        "correctAnswer": 0,
        "hint": "Diluting a weak acid shifts the equilibrium towards more ionization (Le Chatelier's principle)."
    },
     {
        "question": "If acid HA has Ka = 1.8 x 10⁻⁵ and acid HB has Ka = 6.2 x 10⁻⁸, which acid is stronger?",
        "options": ["HA", "HB", "They are equal strength", "Cannot determine"],
        "correctAnswer": 0,
        "hint": "The acid with the larger Ka value is the stronger acid."
    }
];


// --- KaTeX String Constants ---
const katex_H3O_plus = 'H_3O^+';
const katex_OH_minus = 'OH^-';
const katex_H2O = 'H_2O';
const katex_Kw = 'K_w';
const katex_Kc = 'K_c';
const katex_Water_auto = `${katex_H2O}(l) + ${katex_H2O}(l) \\rightleftharpoons ${katex_H3O_plus}(aq) + ${katex_OH_minus}(aq)`;
const katex_Kc_expr = `K_c = \\frac{[${katex_H3O_plus}][${katex_OH_minus}]}{[${katex_H2O}]^2}`;
const katex_Kw_expr = `${katex_Kw} = [${katex_H3O_plus}][${katex_OH_minus}]`;
const katex_Kw_val = `${katex_Kw} = 1.0 \\times 10^{-14} \\text{ (at 25°C)}`;
const katex_H3O_conc = `[${katex_H3O_plus}]`;
const katex_OH_conc = `[${katex_OH_minus}]`;
// **FIXED**: Define KaTeX strings for comparison expressions
const katex_H3O_eq_OH = `[${katex_H3O_plus}] = [${katex_OH_minus}]`;
const katex_H3O_gt_OH = `[${katex_H3O_plus}] > [${katex_OH_minus}]`;
const katex_OH_gt_H3O = `[${katex_OH_minus}] > [${katex_H3O_plus}]`;
const katex_H3O_gt_1e7 = `[${katex_H3O_plus}] > 1.0 \\times 10^{-7} M`;
const katex_OH_gt_1e7 = `[${katex_OH_minus}] > 1.0 \\times 10^{-7} M`;

const katex_pH_def = `pH = -\\log[${katex_H3O_plus}]`;
const katex_H3O_from_pH = `[${katex_H3O_plus}] = 10^{-pH}`;
const katex_pOH_def = `pOH = -\\log[${katex_OH_minus}]`;
const katex_OH_from_pOH = `[${katex_OH_minus}] = 10^{-pOH}`;
const katex_pH_pOH_relation = `pH + pOH = 14.00 \\text{ (at 25°C)}`;
const katex_HA = 'HA';
const katex_A_minus = 'A^-';
const katex_Ka = 'K_a';
const katex_Ka_eq = `${katex_HA}(aq) + ${katex_H2O}(l) \\rightleftharpoons ${katex_H3O_plus}(aq) + ${katex_A_minus}(aq)`;
const katex_Ka_expr = `${katex_Ka} = \\frac{[${katex_H3O_plus}][${katex_A_minus}]}{[${katex_HA}]}`;
const katex_B_base = 'B'; // Generic base
const katex_BH_plus = 'BH^+'; // Conjugate acid
const katex_Kb = 'K_b';
const katex_Kb_eq = `${katex_B_base}(aq) + ${katex_H2O}(l) \\rightleftharpoons ${katex_BH_plus}(aq) + ${katex_OH_minus}(aq)`;
const katex_Kb_expr = `${katex_Kb} = \\frac{[${katex_BH_plus}][${katex_OH_minus}]}{[${katex_B_base}]}`;
const katex_PercentIon = `\\% \\text{ Ionization} = \\frac{[${katex_H3O_plus}]_{\\text{eq}}}{[${katex_HA}]_{\\text{initial}}} \\times 100\\%`;


// --- Main Page Component ---
const IonicEquilibriaPage = () => {
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [inputType, setInputType] = useState<'pH' | 'pOH' | 'H3O' | 'OH'>('pH');
  const [inputValue, setInputValue] = useState<string>('7.0');
  const [calculatedValues, setCalculatedValues] = useState<{
      pH: number | null;
      pOH: number | null;
      H3O: number | null;
      OH: number | null;
  }>({ pH: 7.0, pOH: 7.0, H3O: 1e-7, OH: 1e-7 });

  // --- Update calculations ---
  useEffect(() => {
    // Use try-catch for robust parsing, especially with scientific notation
    let numValue: number | null = null;
    try {
        numValue = parseFloat(inputValue.replace(/\\times/g, 'e')); // Handle 'x' for scientific notation if needed
    } catch (e) {
        numValue = null; // Invalid input
    }

    let pH: number | null = null;
    let pOH: number | null = null;
    let H3O: number | null = null;
    let OH: number | null = null;

    if (numValue !== null && !isNaN(numValue)) {
        try {
            switch (inputType) {
                case 'pH':
                    if (numValue >= 0 && numValue <= 14) {
                        pH = numValue;
                        pOH = 14.0 - pH;
                        H3O = Math.pow(10, -pH);
                        OH = KW_25C / H3O;
                    }
                    break;
                case 'pOH':
                     if (numValue >= 0 && numValue <= 14) {
                        pOH = numValue;
                        pH = 14.0 - pOH;
                        OH = Math.pow(10, -pOH);
                        H3O = KW_25C / OH;
                     }
                    break;
                case 'H3O':
                     if (numValue > 0) {
                        H3O = numValue;
                        pH = -Math.log10(H3O);
                        if(pH >= 0 && pH <= 14) {
                             OH = KW_25C / H3O;
                             pOH = 14.0 - pH;
                        } else { pH = pOH = OH = null; } // Invalidate if pH outside range
                     }
                    break;
                case 'OH':
                     if (numValue > 0) {
                        OH = numValue;
                        pOH = -Math.log10(OH);
                         if(pOH >= 0 && pOH <= 14) {
                             H3O = KW_25C / OH;
                             pH = 14.0 - pOH;
                         } else { pOH = pH = H3O = null; } // Invalidate if pOH outside range
                     }
                    break;
            }
        } catch (e) {
             console.error("Calculation error:", e);
             pH = pOH = H3O = OH = null;
        }
    } else {
        // Handle non-numeric input by clearing results
        pH = pOH = H3O = OH = null;
    }

     setCalculatedValues({
          pH: (pH !== null && isFinite(pH)) ? pH : null,
          pOH: (pOH !== null && isFinite(pOH)) ? pOH : null,
          H3O: (H3O !== null && isFinite(H3O)) ? H3O : null,
          OH: (OH !== null && isFinite(OH)) ? OH : null,
     });

  }, [inputType, inputValue]);

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
                1.2 Ionic Equilibria & Acid/Base Strength
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                     {/* Self-Ionization of Water */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Self-Ionization of Water & K<sub className="font-serif">w</sub>
                          </h2>
                         {/* ... text ... */}
                          <p className="leading-relaxed">
                             Even pure water conducts electricity very slightly because it undergoes <strong className="text-teal dark:text-teal font-semibold">autoionization</strong>:
                          </p>
                           <BlockMath math={katex_Water_auto}/>
                          <p className="mt-3 leading-relaxed">
                             This equilibrium gives the <strong className="text-teal dark:text-teal font-semibold">ion-product constant for water, <InlineMath math={katex_Kw}/></strong>:
                          </p>
                          <BlockMath math={katex_Kw_expr}/>
                           <p className="leading-relaxed">
                             At 25°C:
                           </p>
                          <BlockMath math={katex_Kw_val}/>
                           <p className="leading-relaxed">
                              In pure water: <InlineMath math={`[${katex_H3O_plus}] = [${katex_OH_minus}] = 1.0 \\times 10^{-7} M`}/>.
                           </p>
                     </section>

                      {/* Acidic, Basic, Neutral */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Acidic, Basic, and Neutral Solutions (25°C)
                         </h2>
                         <p className="leading-relaxed">
                             The <InlineMath math={katex_Kw}/> relationship always holds:
                             <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                 {/* **FIXED**: Used KaTeX constants */}
                                 <li><strong className="font-semibold">Neutral:</strong> <InlineMath math={katex_H3O_eq_OH}/></li>
                                 <li><strong className="text-coral dark:text-gold font-semibold">Acidic:</strong> <InlineMath math={katex_H3O_gt_OH}/> (or <InlineMath math={katex_H3O_gt_1e7}/>)</li>
                                 <li><strong className="font-semibold text-teal dark:text-mint">Basic:</strong> <InlineMath math={katex_OH_gt_H3O}/> (or <InlineMath math={katex_OH_gt_1e7}/>)</li>
                             </ul>
                         </p>
                     </section>

                      {/* pH and pOH */}
                      <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             The pH and pOH Scales
                         </h2>
                          {/* ... text using constants ... */}
                           <p className="leading-relaxed"><strong className="text-teal dark:text-teal font-semibold">pH scale</strong> (acidity):</p>
                           <BlockMath math={katex_pH_def}/>
                           <p className="leading-relaxed mt-3"><strong className="text-teal dark:text-teal font-semibold">pOH scale</strong> (basicity):</p>
                           <BlockMath math={katex_pOH_def}/>
                           <p className="mt-3 leading-relaxed">Relationship at 25°C:</p>
                           <BlockMath math={katex_pH_pOH_relation}/>
                            <p className="leading-relaxed mt-3">Key points at 25°C:</p>
                              <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                                 <li>pH = 7 (Neutral)</li>
                                 <li>pH &lt 7 (Acidic)</li>
                                 <li>pH &gt 7 (Basic)</li>
                                 <li>Low pH = High [H₃O⁺] = Acidic</li>
                                 <li>Low pOH = High [OH⁻] = Basic</li>
                              </ul>
                           <p className="mt-3 leading-relaxed"> Conversions: <InlineMath math={katex_H3O_from_pH}/> and <InlineMath math={katex_OH_from_pOH}/>.</p>
                      </section>

                     {/* Acid/Base Strength & Constants */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Acid and Base Strength (K<sub className="font-serif">a</sub> and K<sub className="font-serif">b</sub>)
                         </h2>
                          {/* ... text using constants ... */}
                          <p className="leading-relaxed">Weak acids/bases only partially ionize. Their strength is measured by equilibrium constants.</p>
                         <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Acid Ionization Constant (<InlineMath math={katex_Ka}/>)</h3>
                          <BlockMath math={katex_Ka_eq}/>
                          <BlockMath math={katex_Ka_expr}/>
                           <p className="leading-relaxed">Larger <InlineMath math={katex_Ka}/> = Stronger Acid.</p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Base Dissociation Constant (<InlineMath math={katex_Kb}/>)</h3>
                           <BlockMath math={katex_Kb_eq}/>
                           <BlockMath math={katex_Kb_expr}/>
                           <p className="leading-relaxed">Larger <InlineMath math={katex_Kb}/> = Stronger Base.</p>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Percent Ionization</h3>
                           <BlockMath math={katex_PercentIon}/>
                            <p className="leading-relaxed">Higher % ionization = Stronger (weak) acid/base. Increases with dilution.</p>
                     </section>

                      {/* Study Tips */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Memorization Tips
                         </h2>
                          {/* ... Study tips content ... */}
                            <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                                <li><strong className="font-semibold">Master Kw:</strong> Kw = [H₃O⁺][OH⁻] = 10⁻¹⁴ is fundamental.</li>
                                <li><strong className="font-semibold">pH Square Practice:</strong> Drill conversions between pH, pOH, [H₃O⁺], [OH⁻] using the formulas and pH + pOH = 14. Use the calculator!</li>
                                 <li><strong className="font-semibold">Ka/Kb Meaning:</strong> Larger K = Stronger. Know the reaction it represents.</li>
                                 <li><strong className="font-semibold">Logarithms:</strong> Understand that pH is a negative log scale. A 1-unit pH change is a 10x change in [H₃O⁺].</li>
                                 <li><strong className="font-semibold">Visualize pH Scale:</strong> Use the interactive scale to connect pH values to acidity/basicity and common examples.</li>
                                 <li><strong className="font-semibold">Problem Solving:</strong> Work through examples calculating pH of weak acids/bases using Ka/Kb (often needs ICE tables - a later topic).</li>
                           </ul>
                     </section>

                </article>

                {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                     {/* Panel 1: Kw/Autoionization Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="ZEi-DFEjGfk" title="Video: Autoionization of Water and Kw"/>
                     </div>

                     {/* Panel 2: pH/pOH Calculator & Visualizer */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-4 text-blue-700 dark:text-blue-300">pH/pOH/Concentration Calculator (25°C)</h3>
                          {/* Calculator Inputs */}
                          <div className="mb-3 font-inter grid grid-cols-2 gap-4">
                              <div>
                                 <label htmlFor="inputType" className="block text-sm font-medium mb-1">Calculate from:</label>
                                  <select id="inputType" value={inputType} onChange={(e) => setInputType(e.target.value as any)} className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-light-gray" >
                                      <option value="pH">pH</option>
                                      <option value="pOH">pOH</option>
                                      <option value="H3O">[H₃O⁺] (M)</option>
                                      <option value="OH">[OH⁻] (M)</option>
                                  </select>
                              </div>
                               <div>
                                  <label htmlFor="inputValue" className="block text-sm font-medium mb-1">Enter Value:</label>
                                  <input type="text" id="inputValue" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-light-gray" placeholder={inputType === 'H3O' || inputType === 'OH' ? 'e.g., 1.0e-7' : 'e.g., 7.0'} />
                               </div>
                          </div>
                           {/* Display Results */}
                           <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded shadow-inner text-sm font-inter space-y-1">
                              <p>pH: <span className="font-semibold text-teal dark:text-mint">{calculatedValues.pH?.toFixed(2) ?? 'Invalid Input'}</span></p>
                              <p>pOH: <span className="font-semibold text-teal dark:text-mint">{calculatedValues.pOH?.toFixed(2) ?? 'Invalid Input'}</span></p>
                              <p>[H₃O⁺]: <span className="font-semibold text-teal dark:text-mint">{calculatedValues.H3O?.toExponential(2) ?? 'Invalid Input'}</span> M</p>
                              <p>[OH⁻]: <span className="font-semibold text-teal dark:text-mint">{calculatedValues.OH?.toExponential(2) ?? 'Invalid Input'}</span> M</p>
                          </div>
                           {/* pH Scale Visualization */}
                           <PhScaleVisualization pH={calculatedValues.pH} />
                            <MiniCheckQuestion
                             question={`If [OH⁻] = 2.5 x 10⁻⁴ M, what is the approximate pH?`}
                             correctAnswer="pH ≈ 10.40"
                             explanation={`First find pOH = -log(2.5 x 10⁻⁴) ≈ 3.60. Then pH = 14.00 - pOH = 14.00 - 3.60 = 10.40.`}
                         />
                     </div>

                     {/* Panel 3: pH/pOH Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="pQOa3bbS-zw" title="Video: pH, pOH, [H⁺], [OH⁻] Calculations"/>
                     </div>

                     {/* Panel 4: Ka/Kb Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="4eNKPyXLw5s" title="Video: Acid/Base Strength, Ka and Kb"/>
                     </div>

                     {/* Panel 5: Ka/Kb Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Strength Check (K<sub className="font-inter">a</sub>/K<sub className="font-inter">b</sub>)</h3>
                           <MiniCheckQuestion
                             question="Which indicates a stronger base: Kb = 1 x 10⁻⁵ or Kb = 1 x 10⁻⁹?"
                             correctAnswer="Kb = 1 x 10⁻⁵"
                             explanation="A larger Kb value means the base accepts protons more readily (dissociates more in water to produce OH⁻), indicating a stronger base."
                         />
                     </div>

                     {/* Panel 6: PhET Simulation Link */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Acid-Base Solutions</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Visualize dissociation, pH, strength, and the role of water.</p>
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
                    Test Your Equilibria Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Ionic Equilibria & Strength Quiz</h2>
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
IonicEquilibriaPage.displayName = 'IonicEquilibriaPage';

export default IonicEquilibriaPage;
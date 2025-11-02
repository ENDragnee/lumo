'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, useMemo, ChangeEvent, useEffect } from 'react'; // Added useMemo, useEffect
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

// --- Helper function for pH slider color (reused/adapted) ---
const getPhColorForIndicator = (pHValue: number, rangeMin: number, rangeMax: number, acidColorClass: string, baseColorClass: string): string => {
    if (pHValue < rangeMin) return acidColorClass;
    if (pHValue > rangeMax) return baseColorClass;
    // Simple gradient transition within the range (can be improved)
    const transitionPoint = (rangeMin + rangeMax) / 2;
    if (pHValue < transitionPoint) return `bg-gradient-to-r ${acidColorClass} ${baseColorClass} opacity-70`; // Mix colors
     return `bg-gradient-to-r ${acidColorClass} ${baseColorClass} opacity-70`; // Mix colors - simplified
    // A more complex gradient could be implemented if needed
};

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

// Indicator Visualization Component
function IndicatorColorVisualizer({ indicator, currentPH }: { indicator: IndicatorData, currentPH: number | null }) {
    if (currentPH === null || !isFinite(currentPH)) {
        return <div className="text-sm text-center text-gray-500 dark:text-gray-400 italic">(Adjust pH slider)</div>;
    }

    const { name, acidColor, baseColor, rangeMin, rangeMax, acidColorClass, baseColorClass } = indicator;
    let displayColorClass = '';
    let colorName = '';

    if (currentPH < rangeMin) {
        displayColorClass = acidColorClass;
        colorName = acidColor;
    } else if (currentPH > rangeMax) {
        displayColorClass = baseColorClass;
        colorName = baseColor;
    } else {
        // Simple transition - show mixed color name, use gradient (could be more sophisticated)
        displayColorClass = `bg-gradient-to-r ${acidColorClass} ${baseColorClass} opacity-80`;
        colorName = `${acidColor}/${baseColor} Transition`;
    }

    return (
        <div className="mt-4 p-3 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 font-inter">
            <p className="text-sm font-semibold text-center mb-2">{name} (pH Range: {rangeMin.toFixed(1)} - {rangeMax.toFixed(1)})</p>
            <div className={`w-full h-8 rounded ${displayColorClass} flex items-center justify-center shadow-inner`}>
                 <span className="text-xs font-medium text-white mix-blend-difference px-2">{colorName}</span>
            </div>
            <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">Color at current pH: {currentPH.toFixed(1)}</p>
        </div>
    );
}

// --- Page Specific Data ---
interface IndicatorData {
    name: string;
    acidColor: string;
    baseColor: string;
    rangeMin: number;
    rangeMax: number;
    acidColorClass: string; // Tailwind class for acid color
    baseColorClass: string; // Tailwind class for base color
}

const indicators: IndicatorData[] = [
  { name: "Methyl violet", acidColor: "Yellow", baseColor: "Violet", rangeMin: 0.0, rangeMax: 1.6, acidColorClass: 'from-yellow-400', baseColorClass: 'to-violet-600' },
  { name: "Methyl orange", acidColor: "Red", baseColor: "Yellow", rangeMin: 3.2, rangeMax: 4.4, acidColorClass: 'from-red-500', baseColorClass: 'to-yellow-400' },
  { name: "Bromcresol green", acidColor: "Yellow", baseColor: "Blue", rangeMin: 3.8, rangeMax: 5.4, acidColorClass: 'from-yellow-400', baseColorClass: 'to-blue-500' },
  { name: "Methyl red", acidColor: "Red", baseColor: "Yellow", rangeMin: 4.8, rangeMax: 6.0, acidColorClass: 'from-red-500', baseColorClass: 'to-yellow-400' },
  { name: "Litmus", acidColor: "Red", baseColor: "Blue", rangeMin: 5.0, rangeMax: 8.0, acidColorClass: 'from-red-500', baseColorClass: 'to-blue-600' },
  { name: "Phenolphthalein", acidColor: "Colorless", baseColor: "Pink", rangeMin: 8.2, rangeMax: 10.0, acidColorClass: 'from-transparent', baseColorClass: 'to-pink-500' },
];

// *** EXPANDED QUIZ QUESTIONS for Indicators/Titrations ***
const quizQuestions = [
    { question: "Acid-base indicators are typically:", options: ["Strong acids or strong bases", "Weak acids or weak bases whose conjugate forms have different colors", "Neutral salts", "Highly reactive metals"], correctAnswer: 1, hint: "Their equilibrium shift based on pH causes the color change." },
    { question: "If an indicator HIn has a yellow acidic form and a blue basic form (In⁻), what color will it likely be in a solution with pH significantly *below* its transition range?", options: ["Green", "Blue", "Yellow", "Colorless"], correctAnswer: 2, hint: "Low pH (high [H₃O⁺]) pushes the HIn ⇌ H⁺ + In⁻ equilibrium to the left, favoring the HIn form." },
    { question: "If an indicator HIn has a yellow acidic form and a blue basic form (In⁻), what color will it likely be in a solution with pH significantly *above* its transition range?", options: ["Yellow", "Green", "Colorless", "Blue"], correctAnswer: 3, hint: "High pH (low [H₃O⁺]) pushes the equilibrium to the right, favoring the In⁻ form." },
    { question: "Which indicator from the table would be most suitable for a titration where the equivalence point is expected to be around pH 9?", options: ["Methyl orange", "Methyl red", "Litmus", "Phenolphthalein"], correctAnswer: 3, hint: "Choose an indicator whose pH transition range brackets the expected equivalence point pH." },
    { question: "What is an 'equivalent' of an acid like H₂SO₄?", options: ["The amount that contains one mole of H₂SO₄", "The amount that reacts with or supplies one mole of H⁺ ions", "The molar mass of H₂SO₄", "The volume of 1L of H₂SO₄ solution"], correctAnswer: 1, hint: "Since H₂SO₄ can donate *two* protons, one mole of H₂SO₄ contains two equivalents." },
    { question: "What is 'Normality (N)' of a solution?", options: ["Moles of solute per liter of solution (Molarity)", "Grams of solute per liter of solution", "Equivalents of solute per liter of solution", "Density of the solution"], correctAnswer: 2, hint: "Normality considers the number of reactive units (equivalents) per liter." },
    { question: "In an acid-base titration, the 'equivalence point' is reached when:", options: ["The indicator changes color", "The volume of titrant equals the volume of analyte", "The moles of H⁺ ions added equals the initial moles of OH⁻ ions (or vice-versa)", "The pH reaches exactly 7.0"], correctAnswer: 2, hint: "It's the stoichiometric point where reactants have completely neutralized each other." },
    { question: "The 'end point' of a titration is:", options: ["Always exactly the same as the equivalence point", "The point where the indicator changes color", "The point where the burette is empty", "The theoretical point of complete neutralization"], correctAnswer: 1, hint: "The endpoint is the *observed* point (color change), which should ideally be very close to the *theoretical* equivalence point." },
    { question: "If 25.0 mL of 0.100 N HCl is titrated with NaOH, what volume of 0.050 N NaOH is required to reach the equivalence point?", options: ["12.5 mL", "25.0 mL", "50.0 mL", "100.0 mL"], correctAnswer: 2, hint: "Use the formula N₁V₁ = N₂V₂. (0.100 N)(25.0 mL) = (0.050 N)(V₂). Solve for V₂." },
    { question: "Why should the indicator's end point pH range match the equivalence point pH of a titration?", options: ["To make the color change more visible", "To ensure the color change occurs precisely when neutralization is complete", "To speed up the reaction", "To use less indicator solution"], correctAnswer: 1, hint: "If the indicator changes color too early or too late relative to the equivalence point, the measured volume will be inaccurate." }
];

// --- KaTeX Constants ---
const katex_HIn = 'HIn';
const katex_In_minus = 'In^-';
const katex_H3O_plus = 'H_3O^+';
const katex_Indicator_Eq = `${katex_HIn}(aq) + H_2O(l) \\rightleftharpoons ${katex_H3O_plus}(aq) + ${katex_In_minus}(aq)`;
const katex_H_plus = 'H^+';
const katex_OH_minus = 'OH^-';
const katex_H2SO4 = 'H_2SO_4';
const katex_BaOH2 = 'Ba(OH)_2';
const katex_N_eq_V = `\\text{Normality (N)} = \\frac{\\text{Equivalents of Solute}}{\\text{Liters of Solution}}`;
const katex_N1V1 = 'N_1V_1';
const katex_N2V2 = 'N_2V_2';
const katex_Titration_Eq = `${katex_N1V1} = ${katex_N2V2}`;


// --- Main Page Component ---
const IndicatorsTitrationsPage = () => { // Renamed component
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPH, setCurrentPH] = useState<number>(7.0); // pH for indicator visualization
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorData>(indicators[5]); // Default: Phenolphthalein

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

  const handleIndicatorChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const indicatorName = event.target.value;
    const indicator = indicators.find(ind => ind.name === indicatorName);
    if (indicator) {
        setSelectedIndicator(indicator);
    }
  };


  // --- Component Render ---
   return (
    <div className="bg-off-white text-dark-gray dark:bg-deep-navy dark:text-light-gray min-h-screen font-lora">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
            <h1 className="text-4xl lg:text-5xl font-bold font-playfair mb-8 lg:mb-12 text-center">
                1.5 Acid-Base Indicators & Titrations {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* How Indicators Work */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            How Acid-Base Indicators Change Color
                         </h2>
                         <p className="leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Acid-base indicators</strong> are special substances (usually weak organic acids or bases) that change color depending on the pH of the solution they are in. They act as visual guides to the acidity or basicity of a solution.
                         </p>
                          <p className="mt-3 leading-relaxed">
                              Let's represent a generic weak acid indicator as <InlineMath math={katex_HIn}/>. In solution, it establishes an equilibrium with its conjugate base, <InlineMath math={katex_In_minus}/>:
                          </p>
                          {/* Equation Block - Corrected */}
                          <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                              <BlockMath math={`${katex_HIn}(aq) + H_2O(l) \\rightleftharpoons ${katex_H3O_plus}(aq) + ${katex_In_minus}(aq)`}/>
                              <p className="text-xs mt-1">(Acid Color)            (Base Color)</p>
                           </div>
                           <p className="leading-relaxed">
                              Crucially, the <InlineMath math={katex_HIn}/> form has a different color than the <InlineMath math={katex_In_minus}/> form. The position of this equilibrium, and thus the dominant color observed, depends on the concentration of <InlineMath math={katex_H3O_plus}/> (i.e., the pH) of the surrounding solution, according to Le Châtelier's Principle:
                           </p>
                            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                <li><strong className="text-coral dark:text-gold font-semibold">In Acidic Solution (High <InlineMath math={katex_H3O_plus}/>):</strong> The equilibrium shifts LEFT. The indicator exists primarily as <InlineMath math={katex_HIn}/>, displaying the "Acid Color".</li>
                                <li><strong className="font-semibold text-teal dark:text-mint">In Basic Solution (Low <InlineMath math={katex_H3O_plus}/>):</strong> The equilibrium shifts RIGHT. The indicator exists primarily as <InlineMath math={katex_In_minus}/>, displaying the "Base Color".</li>
                             </ul>
                              <p className="mt-3 leading-relaxed">
                                Each indicator changes color over a specific, relatively narrow pH range (its transition range).
                              </p>
                    </section>

                    {/* Indicators and Titrations */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Indicators in Titration
                         </h2>
                          <p className="leading-relaxed">
                             Indicators are essential tools in <strong className="text-teal dark:text-teal font-semibold">acid-base titrations</strong>. A titration is a laboratory technique used to determine the unknown concentration of an acid or base (analyte) by reacting it precisely with a solution of known concentration (titrant).
                          </p>
                           <p className="mt-3 leading-relaxed">
                              A few drops of a suitable indicator are added to the analyte solution. The titrant is added slowly from a burette until the indicator changes color. This point of color change is called the <strong className="text-coral dark:text-gold font-semibold">end point</strong>.
                           </p>
                           <p className="mt-3 leading-relaxed">
                               Ideally, the end point should coincide with the <strong className="text-coral dark:text-gold font-semibold">equivalence point</strong> – the theoretical point where stoichiometrically equivalent amounts of acid and base have reacted (moles of H⁺ = moles of OH⁻ for strong acid/base). Choosing an indicator whose pH transition range brackets the expected pH at the equivalence point is crucial for accuracy.
                           </p>
                             {/* Table */}
                          <h3 className="text-xl font-semibold font-playfair mt-6 mb-2">Table 1.5: Common Indicators</h3>
                           <div className="overflow-x-auto font-inter text-sm">
                               <table className="min-w-full border-collapse">
                                   <thead className="bg-gray-100 dark:bg-gray-700">
                                   <tr className="border-b dark:border-gray-600"><th className="py-2 px-3 text-left">Indicator</th><th className="py-2 px-3 text-left">Acid Color</th><th className="py-2 px-3 text-left">Base Color</th><th className="py-2 px-3 text-left">pH Range</th></tr>
                                   </thead>
                                   <tbody className="bg-white dark:bg-gray-800">
                                       {indicators.map(ind => (
                                           <tr key={ind.name} className="border-b dark:border-gray-600">
                                               <td className="py-1.5 px-3">{ind.name}</td>
                                               <td className="py-1.5 px-3">{ind.acidColor}</td>
                                               <td className="py-1.5 px-3">{ind.baseColor}</td>
                                               <td className="py-1.5 px-3">{ind.rangeMin.toFixed(1)} – {ind.rangeMax.toFixed(1)}</td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                           </div>
                     </section>


                     {/* Equivalents and Normality */}
                     <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Equivalents and Normality
                         </h2>
                          <p className="leading-relaxed">
                              In titrations, especially involving acids or bases that can donate or accept more than one proton or hydroxide ion, the concept of <strong className="text-teal dark:text-teal font-semibold">equivalents</strong> and <strong className="text-teal dark:text-teal font-semibold">Normality (N)</strong> is sometimes used.
                          </p>
                           <p className="mt-3 leading-relaxed">
                              An <strong className="font-semibold">equivalent (eq)</strong> of an acid is the amount that furnishes one mole of H⁺ ions. An equivalent of a base is the amount that furnishes one mole of OH⁻ ions (or accepts one mole of H⁺).
                                <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                                   <li>1 mole HCl = 1 equivalent HCl (donates 1 H⁺)</li>
                                   <li>1 mole H₂SO₄ = 2 equivalents H₂SO₄ (can donate 2 H⁺)</li>
                                   <li>1 mole NaOH = 1 equivalent NaOH (provides 1 OH⁻)</li>
                                   <li>1 mole Ba(OH)₂ = 2 equivalents Ba(OH)₂ (provides 2 OH⁻)</li>
                               </ul>
                           </p>
                           <p className="mt-3 leading-relaxed">
                               <strong className="font-semibold">Normality (N)</strong> is a concentration unit defined as equivalents of solute per liter of solution:
                           </p>
                            <BlockMath math={katex_N_eq_V}/>
                           <p className="leading-relaxed">
                               The key advantage is that at the equivalence point of *any* acid-base titration, the number of equivalents of acid equals the number of equivalents of base. This leads to the simple titration formula:
                           </p>
                           <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                               <BlockMath math={katex_Titration_Eq}/>
                           </div>
                            <p className="text-sm italic leading-relaxed text-gray-600 dark:text-gray-400 mt-2">
                               (Where N₁, V₁ are normality and volume of solution 1, and N₂, V₂ are for solution 2). While useful, Molarity (M) is more commonly used in modern chemistry. N = M × (number of equivalents per mole).
                           </p>
                     </section>


                    {/* Study Tips Section */}
                    <section>
                        <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Study & Memorization Tips
                        </h2>
                        <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                            <li><strong className="font-semibold">Indicator Equilibrium:</strong> Visualize HIn ⇌ H⁺ + In⁻. Adding acid (H⁺) shifts left (acid color). Adding base (removes H⁺) shifts right (base color).</li>
                            <li><strong className="font-semibold">Choosing an Indicator:</strong> The indicator's pH transition range MUST overlap the steep part of the titration curve around the equivalence point pH. Memorize the approximate ranges/colors of common indicators like litmus, phenolphthalein, and methyl orange.</li>
                            <li><strong className="font-semibold">Equivalence vs. End Point:</strong> Equivalence point is theoretical (moles acid = moles base). End point is experimental (indicator changes color). Goal is to make them match closely.</li>
                            <li><strong className="font-semibold">Normality Concept:</strong> Think of Normality as "Molarity of reactive units". For H₂SO₄, N = 2M. For HCl, N = M. For Ba(OH)₂, N = 2M.</li>
                            <li><strong className="font-semibold">Titration Formula (N₁V₁ = N₂V₂):</strong> Understand it comes from equivalents acid = equivalents base. Remember volumes can be in mL if consistent on both sides.</li>
                            <li><strong className="font-semibold">Visualize Titration Curve:</strong> Sketch typical titration curves (strong/strong, weak/strong, strong/weak). Mark the equivalence point pH and identify suitable indicator ranges.</li>
                        </ul>
                    </section>

                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                      {/* Panel 1: Indicators Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="VIAPfERO4_E" title="Video: How Acid-Base Indicators Work"/>
                     </div>

                     {/* Panel 2: Indicator Color Visualizer */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-4 text-blue-700 dark:text-blue-300">Indicator Color Visualizer</h3>
                          <div className="mb-3 font-inter">
                               <label htmlFor="indicatorSelect" className="block text-sm font-medium mb-1">Select Indicator:</label>
                               <select
                                   id="indicatorSelect"
                                   value={selectedIndicator.name}
                                   onChange={handleIndicatorChange}
                                   className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-light-gray"
                               >
                                   {indicators.map(ind => <option key={ind.name} value={ind.name}>{ind.name}</option>)}
                               </select>
                           </div>
                           <div className="mb-4 font-inter">
                               <label htmlFor="phSlider" className="block text-sm font-medium mb-1">Adjust Solution pH:</label>
                               <input
                                   type="range" id="phSlider"
                                   min="0" max="14" step="0.1"
                                   value={currentPH}
                                   onChange={(e) => setCurrentPH(parseFloat(e.target.value))}
                                   className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal dark:accent-teal"
                               />
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1"><span>0</span><span>7</span><span>14</span></div>
                           </div>
                            <IndicatorColorVisualizer indicator={selectedIndicator} currentPH={currentPH} />
                            <MiniCheckQuestion
                                question={`Using the visualizer, what color is Bromcresol Green at pH 3.0?`}
                                correctAnswer="Yellow"
                                explanation="pH 3.0 is below the transition range (3.8-5.4) for Bromcresol Green, so it shows its acidic color (Yellow)."
                            />
                     </div>

                     {/* Panel 3: Titration Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="sFpFCPTDv2w" title="Video: Acid-Base Titration Technique & Equivalence Point"/>
                     </div>

                     {/* Panel 4: Equivalence vs End Point Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Titration Points Check</h3>
                          <MiniCheckQuestion
                             question="Is the 'end point' observed during a titration always exactly the same pH as the theoretical 'equivalence point'?"
                             correctAnswer="Not necessarily, but a good indicator choice makes them very close."
                             explanation="The end point is where the indicator visually changes color over its specific pH range. The equivalence point is the exact stoichiometric point. Skillful titration aims to minimize the difference between them."
                         />
                     </div>

                      {/* Panel 5: Normality Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <h3 className="text-xl font-semibold font-inter mb-3 text-red-700 dark:text-coral">Normality Check</h3>
                           <MiniCheckQuestion
                              question="What is the Normality (N) of a 0.5 M H₂SO₄ solution (assuming complete dissociation for both protons)?"
                              correctAnswer="1.0 N"
                              explanation="H₂SO₄ provides 2 equivalents of H⁺ per mole. Normality = Molarity × Equivalents/Mole = 0.5 M × 2 eq/mol = 1.0 eq/L = 1.0 N."
                          />
                     </div>

                     {/* Panel 6: PhET Titration Simulation */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Titration Simulation</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Perform virtual titrations, observe pH curves, and test different indicators.</p>
                         <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                            <a href="https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_en.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open PhET: Acid-Base Solutions (Titration Tab) (New Tab)</span>
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
                    Test Your Indicator & Titration Knowledge!
                </button>
            </div>
        </main>

        {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Indicators & Titrations Quiz</h2>
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
IndicatorsTitrationsPage.displayName = 'IndicatorsTitrationsPage';

export default IndicatorsTitrationsPage;
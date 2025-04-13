'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, ChangeEvent } from 'react';
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
       {/* Added button to open in new tab */}
       <div className="flex justify-end mb-1">
           <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer"
              className="text-xs font-inter text-blue-600 dark:text-blue-400 hover:underline" title="Open video in new tab">
               Open ↗
            </a>
        </div>
      <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md bg-black">
         <iframe
           className="absolute top-0 left-0 w-full h-full"
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
        <div className="text-xs space-y-1 font-inter border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
           {options && isCorrect !== null && (
                <p className={`font-semibold ${isCorrect ? 'text-teal dark:text-mint' : 'text-coral dark:text-gold'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect.'}
                </p>
            )}
          <p className="text-dark-gray dark:text-light-gray"><strong className="text-teal dark:text-mint">Answer:</strong> {correctAnswer}</p>
          <p className="text-dark-gray dark:text-light-gray"><strong className="text-gray-600 dark:text-gray-400">Explanation:</strong> {explanation}</p>
           <button onClick={handleHide} className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 font-inter"> Hide/Reset </button>
        </div>
      )}
    </div>
  );
}

// Simulation Panel Component (iframe + external link)
function SimulationPanel({ title, description, embedUrl, externalUrl }: {title: string, description: string, embedUrl?: string, externalUrl: string}) {
  return (
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold font-inter mb-3 text-center">{title}</h3>
        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">{description}</p>
        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
            {embedUrl ? (
                 <iframe
                    src={embedUrl}
                    className='absolute top-0 left-0 w-full h-full'
                    allowFullScreen
                    title={title}>
                        <p className="text-light-gray text-center pt-10">Loading Simulation...</p>
                 </iframe>
            ) : (
                 <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                     <span className="text-light-gray font-inter font-semibold p-4 text-center">Simulation cannot be embedded.</span>
                 </div>
            )}
        </div>
         {/* Button to open simulation in a new tab */}
        <div className="text-center mt-3">
            <a href={externalUrl} target="_blank" rel="noopener noreferrer"
               className="inline-block text-xs bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors"
               title={`Open ${title} in new tab`}>
               Open Simulation in New Tab ↗
            </a>
        </div>
      </div>
  );
}


// --- Page Specific Data ---
// *** EXPANDED QUIZ QUESTIONS for Electrolysis Applications ***
const quizQuestions = [
  {
    "question": "A mineral from which a metal can be extracted *profitably* is called:",
    "options": ["A gemstone", "A rock", "An ore", "An alloy"],
    "correctAnswer": 2,
    "hint": "Profitability is key to the definition of an ore."
  },
  {
    "question": "Metals like sodium, potassium, and aluminum are high in the reactivity series. How are they typically extracted from their compounds?",
    "options": ["Heating with carbon", "Displacement by a more reactive metal", "Electrolysis of their molten compounds or solutions", "Roasting in air"],
    "correctAnswer": 2,
    "hint": "Their high reactivity means chemical reducing agents like carbon aren't strong enough; electricity is needed."
  },
  {
    "question": "Why is molten aluminum oxide (Al₂O₃) dissolved in cryolite (Na₃AlF₆) during aluminum extraction?",
    "options": ["To increase the reactivity", "To lower the melting point significantly, reducing energy costs", "To make the aluminum float", "To prevent oxygen formation"],
    "correctAnswer": 1,
    "hint": "Pure Al₂O₃ melts at over 2000°C, which is impractical. Cryolite acts as a solvent."
  },
  {
    "question": "In the electrolysis of molten aluminum oxide, what happens at the cathode (negative electrode)?",
    "options": ["Oxygen ions lose electrons (O²⁻ → O₂ + 4e⁻)", "Aluminum ions gain electrons (Al³⁺ + 3e⁻ → Al)", "Carbon electrode burns", "Cryolite decomposes"],
    "correctAnswer": 1,
    "hint": "Positive aluminum ions are attracted to the negative cathode and gain electrons (reduction)."
  },
  {
    "question": "What happens to the graphite anodes during aluminum extraction, requiring them to be replaced periodically?",
    "options": ["They dissolve in the cryolite", "They react with the aluminum produced", "They react with the oxygen produced at high temperatures, forming CO and CO₂", "They become coated with aluminum"],
    "correctAnswer": 2,
    "hint": "The oxygen produced at the anode reacts with the hot carbon electrode."
  },
  {
    "question": "In the electrolytic refining of copper, the impure copper acts as the ______ and the pure copper acts as the ______.",
    "options": ["cathode; anode", "anode; cathode", "electrolyte; electrode", "electrode; electrolyte"],
    "correctAnswer": 1,
    "hint": "Impure metal dissolves at the anode (oxidation), pure metal plates onto the cathode (reduction)."
  },
  {
    "question": "What happens to impurities less reactive than copper (like gold, silver) during copper refining?",
    "options": ["They dissolve in the electrolyte", "They deposit on the cathode", "They settle at the bottom as anode mud", "They react with the copper sulfate"],
    "correctAnswer": 2,
    "hint": "These less reactive metals don't dissolve easily and fall to the bottom."
  },
   {
    "question": "What happens to impurities more reactive than copper (like zinc, iron) during copper refining?",
    "options": ["They dissolve into the electrolyte as ions but do not deposit on the cathode", "They deposit on the cathode along with copper", "They settle at the bottom as anode mud", "They remain on the anode"],
    "correctAnswer": 0,
    "hint": "They dissolve at the anode, but are harder to reduce than Cu²⁺, so they stay in solution while pure Cu plates out."
  },
  {
    "question": "In electroplating an object with silver, the object should be made the ______ and the anode should be made of ______.",
    "options": ["anode; silver", "cathode; silver", "anode; carbon", "cathode; carbon"],
    "correctAnswer": 1,
    "hint": "The object to be plated is the cathode (where reduction/deposition occurs). The anode replenishes the metal ions (silver) in the electrolyte."
  },
   {
    "question": "What is the primary purpose of the chlor-alkali process?",
    "options": [
      "To produce sodium metal",
      "To produce chlorine gas, hydrogen gas, and sodium hydroxide solution", // Correct
      "To purify water",
      "To extract salt from seawater"
      ],
    "correctAnswer": 1,
    "hint": "It involves the electrolysis of brine (concentrated NaCl solution)."
  }
];

// --- KaTeX String Constants ---
const katex_Al2O3 = 'Al_2O_3';
const katex_Al3_plus = 'Al^{3+}';
const katex_O2_minus = 'O^{2-}';
const katex_Al = 'Al';
const katex_O2 = 'O_2';
const katex_electron = 'e^{-}';
const katex_Al_Cathode = `Al^{3+} + 3${katex_electron} \\rightarrow ${katex_Al}(l)`; // Simplified, showing 1 Al
const katex_Al_Anode = `2${katex_O2_minus} \\rightarrow ${katex_O2}(g) + 4${katex_electron}`; // Simplified
const katex_Al_Overall = `2${katex_Al2O3}(l) \\rightarrow 4${katex_Al}(l) + 3${katex_O2}(g)`; // Stoichiometrically correct overall
const katex_CuSO4 = 'CuSO_4';
const katex_Cu = 'Cu';
const katex_Cu2_plus = 'Cu^{2+}';
const katex_Refining_Anode = `${katex_Cu}(\\text{impure}) \\rightarrow ${katex_Cu2_plus}(aq) + 2${katex_electron}`;
const katex_Refining_Cathode = `${katex_Cu2_plus}(aq) + 2${katex_electron} \\rightarrow ${katex_Cu}(\\text{pure})`;
const katex_NaCl = 'NaCl';
const katex_H2O = 'H_2O';
const katex_Na_plus = 'Na^+';
const katex_OH_minus = 'OH^-';
const katex_Cl_minus = 'Cl^-';
const katex_Cl2 = 'Cl_2';
const katex_H2 = 'H_2';
const katex_ChlorAlk_Anode = `2${katex_Cl_minus}(aq) \\rightarrow ${katex_Cl2}(g) + 2${katex_electron}`;
const katex_ChlorAlk_Cathode = `2${katex_H2O}(l) + 2${katex_electron} \\rightarrow ${katex_H2}(g) + 2${katex_OH_minus}(aq)`;
const katex_ChlorAlk_Overall = `2${katex_NaCl}(aq) + 2${katex_H2O}(l) \\rightarrow 2${katex_Na_plus}(aq) + 2${katex_OH_minus}(aq) + ${katex_Cl2}(g) + ${katex_H2}(g)`;


// --- Main Page Component ---
const ElectrolysisApplicationsPage = () => { // Renamed component
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
                2.4 Industrial Applications of Electrolysis {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction: Ores & Extraction Methods */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            From Ore to Metal
                         </h2>
                         <p className="leading-relaxed">
                            Metals are essential materials in modern society, used in everything from construction to electronics. While some unreactive metals like gold and silver exist freely in nature, most are found combined with other elements in <strong className="text-teal dark:text-teal font-semibold">minerals</strong>. A mineral deposit from which a metal can be extracted <strong className="text-coral dark:text-gold">economically</strong> is called an <strong className="text-teal dark:text-teal font-semibold">ore</strong>.
                         </p>
                         <p className="mt-3 leading-relaxed">
                            The method used to extract a metal from its ore depends largely on the metal's reactivity:
                            <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                                <li>Metals <strong className="font-semibold">less reactive than carbon</strong> (e.g., iron, copper, zinc) can often be extracted by heating their oxides with carbon (reduction using carbon), where carbon acts as the reducing agent.</li>
                                 <li>Metals <strong className="font-semibold">more reactive than carbon</strong> (e.g., sodium, potassium, calcium, magnesium, aluminum) cannot be reduced by carbon. They require a more powerful method: <strong className="text-coral dark:text-gold font-semibold">electrolysis</strong>.</li>
                             </ul>
                         </p>
                    </section>

                    {/* Extraction of Aluminum */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            1. Extraction of Metals: Aluminum Example
                         </h2>
                         <p className="leading-relaxed">
                            Aluminum is abundant but highly reactive, found primarily as aluminum oxide (<InlineMath math={katex_Al2O3}/>, bauxite ore). Electrolysis is used to extract it.
                         </p>
                          <ul className="list-disc list-outside ml-6 space-y-2 mt-2">
                              <li><strong className="font-semibold">Electrolyte:</strong> Molten aluminum oxide (<InlineMath math={katex_Al2O3}/>) dissolved in molten cryolite (<InlineMath math="Na_3AlF_6"/>). Cryolite lowers the melting point of Al₂O₃ from over 2000°C to around 950°C, saving energy.</li>
                              <li><strong className="font-semibold">Electrodes:</strong> Carbon (graphite) electrodes are typically used.</li>
                              <li><strong className="font-semibold">Cathode (Negative):</strong> Attracts positive aluminum ions (<InlineMath math={katex_Al3_plus}/>). Reduction occurs: Aluminum ions gain electrons and form molten aluminum metal, which collects at the bottom.
                                  <BlockMath math={katex_Al_Cathode}/>
                              </li>
                              <li><strong className="font-semibold">Anode (Positive):</strong> Attracts negative oxide ions (<InlineMath math={katex_O2_minus}/>). Oxidation occurs: Oxide ions lose electrons to form oxygen gas (<InlineMath math={katex_O2}/>).
                                   <BlockMath math={katex_Al_Anode}/>
                                   <span className="text-xs italic">(Note: At the high operating temperatures, the oxygen produced reacts with the carbon anode: <InlineMath math={`C(s) + O_2(g) \\rightarrow CO_2(g)`}/>, so the anodes are gradually consumed and need replacement).</span>
                              </li>
                              <li><strong className="font-semibold">Overall Reaction:</strong>
                                  <BlockMath math={katex_Al_Overall}/>
                              </li>
                           </ul>
                     </section>

                     {/* Electrolytic Refining */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            2. Electrolytic Refining of Metals (e.g., Copper)
                         </h2>
                         <p className="leading-relaxed">
                             Electrolysis can also be used to purify metals obtained by other extraction methods. Copper, for example, is often refined electrolytically to achieve high purity (needed for electrical wiring).
                         </p>
                          <ul className="list-disc list-outside ml-6 space-y-2 mt-2">
                              <li><strong className="font-semibold">Setup:</strong>
                                  <ul className="list-circle list-outside ml-6 mt-1 text-sm">
                                     <li><strong className="text-coral dark:text-gold">Anode:</strong> Thick block of impure copper.</li>
                                     <li><strong className="text-teal dark:text-mint">Cathode:</strong> Thin sheet of pure copper.</li>
                                     <li><strong className="font-semibold">Electrolyte:</strong> Aqueous solution of copper(II) sulfate (<InlineMath math={katex_CuSO4}/>) acidified slightly with sulfuric acid.</li>
                                  </ul>
                              </li>
                              <li><strong className="font-semibold">Reactions:</strong>
                                  <ul className="list-circle list-outside ml-6 mt-1 text-sm">
                                     <li>At the Anode (Oxidation): Impure copper dissolves, releasing Cu²⁺ ions into the solution: <InlineMath math={katex_Refining_Anode}/>. More reactive impurities (like Zn, Fe) also dissolve. Less reactive impurities (Ag, Au, Pt) do not dissolve and fall to the bottom as <strong className="italic">anode mud</strong>.</li>
                                     <li>At the Cathode (Reduction): Copper ions (<InlineMath math={katex_Cu2_plus}/>) from the solution gain electrons and deposit as pure copper metal onto the cathode: <InlineMath math={katex_Refining_Cathode}/>. The more reactive metal ions (Zn²⁺, Fe²⁺) remain in solution as they are harder to reduce than Cu²⁺.</li>
                                  </ul>
                               </li>
                                <li><strong className="font-semibold">Result:</strong> The anode dissolves, the pure cathode grows, and valuable impurities can be recovered from the anode mud.</li>
                           </ul>
                     </section>

                     {/* Electroplating */}
                      <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            3. Electroplating
                         </h2>
                          <p className="leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Electroplating</strong> is the process of coating an object (usually metallic) with a thin layer of another metal using electrolysis. It's done for decorative purposes (e.g., silver plating cutlery, chrome plating car parts) or for protection against corrosion (e.g., galvanizing steel with zinc).
                          </p>
                          <ul className="list-disc list-outside ml-6 space-y-2 mt-2">
                              <li><strong className="font-semibold">Setup:</strong>
                                  <ul className="list-circle list-outside ml-6 mt-1 text-sm">
                                     <li><strong className="text-coral dark:text-gold">Cathode:</strong> The object to be plated (e.g., an iron key).</li>
                                     <li><strong className="text-teal dark:text-mint">Anode:</strong> A piece of the plating metal (e.g., a copper bar if plating with copper).</li>
                                     <li><strong className="font-semibold">Electrolyte:</strong> A solution containing ions of the plating metal (e.g., copper sulfate solution for copper plating).</li>
                                  </ul>
                              </li>
                               <li><strong className="font-semibold">Process (e.g., Copper Plating Iron):</strong>
                                   <ul className="list-circle list-outside ml-6 mt-1 text-sm">
                                     <li>At the Anode: The copper anode dissolves, replenishing Cu²⁺ ions in the solution: <InlineMath math={`Cu(s) \\rightarrow Cu^{2+}(aq) + 2e^-`}/>.</li>
                                     <li>At the Cathode: Copper ions from the solution deposit onto the iron key: <InlineMath math={`Cu^{2+}(aq) + 2e^- \\rightarrow Cu(s)`}/>.</li>
                                  </ul>
                               </li>
                          </ul>
                           <p className="mt-3 text-sm italic text-gray-600 dark:text-gray-400">
                               (Refer to Experiment 2.3 for a practical procedure).
                           </p>
                      </section>

                     {/* Electrosynthesis */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            4. Electrosynthesis (Chlor-Alkali Process)
                         </h2>
                         <p className="leading-relaxed">
                             Electrolysis is a major industrial method for producing important chemicals. The <strong className="text-teal dark:text-teal font-semibold">chlor-alkali process</strong> electrolyzes concentrated aqueous sodium chloride (<InlineMath math={katex_NaCl}/>, brine) to produce three valuable products: chlorine gas (<InlineMath math={katex_Cl2}/>), hydrogen gas (<InlineMath math={katex_H2}/>), and sodium hydroxide (NaOH) solution.
                         </p>
                         <p className="mt-3 leading-relaxed">Using inert electrodes:</p>
                           <ul className="list-disc list-outside ml-6 space-y-2 mt-2 text-sm">
                                <li><strong className="font-semibold">Anode (Oxidation):</strong> Due to high concentration, chloride ions are preferentially oxidized over water:
                                    <BlockMath math={katex_ChlorAlk_Anode}/>
                                </li>
                                <li><strong className="font-semibold">Cathode (Reduction):</strong> Water is more easily reduced than Na⁺ ions:
                                     <BlockMath math={katex_ChlorAlk_Cathode}/>
                                </li>
                                 <li><strong className="font-semibold">Overall (simplified):</strong>
                                      <BlockMath math={katex_ChlorAlk_Overall}/>
                                      (Sodium ions remain in solution with the produced hydroxide ions).
                                </li>
                           </ul>
                     </section>

                     {/* Study Tips Section */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Memorization Tips
                         </h2>
                         <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                              <li><strong className="font-semibold">Reactivity Series Link:</strong> Electrolysis is needed for metals *above* Carbon. Reduction with Carbon works for metals *below* Carbon (but above H). Unreactive metals (below H) often found native.</li>
                              <li><strong className="font-semibold">Electrolysis Basics:</strong> Remember Anode=Oxidation(+), Cathode=Reduction(-). Cations go to Cathode, Anions go to Anode.</li>
                              <li><strong className="font-semibold">Aluminum Extraction Key Feature:</strong> Use of molten cryolite to lower the melting point of Al₂O₃. Remember carbon anodes react with O₂.</li>
                               <li><strong className="font-semibold">Refining Setup:</strong> Impure = Anode, Pure = Cathode, Electrolyte = Salt of metal being refined. Visualize metal dissolving from anode and plating onto cathode.</li>
                               <li><strong className="font-semibold">Electroplating Setup:</strong> Object to plate = Cathode, Plating metal = Anode, Electrolyte = Salt of plating metal. Visualize ions moving from anode to cathode via solution.</li>
                               <li><strong className="font-semibold">Chlor-Alkali Products:</strong> Brine electrolysis → Cl₂, H₂, NaOH. Know the half-reactions (Cl⁻ oxidation at anode, H₂O reduction at cathode).</li>
                                <li><strong className="font-semibold">Visualize Processes:</strong> Draw simple diagrams of the electrolytic cells for each application, showing electrode materials, electrolyte, ion movement, and reactions.</li>
                           </ul>
                     </section>


                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                      {/* Panel 1: Metal Extraction Overview Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="BbuPf3L0wII" title="Video: Overview of Metal Extraction Methods"/>
                     </div>

                     {/* Panel 2: Aluminum Extraction Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="Xs12BP64gYc" title="Video: Electrolysis of Aluminum Oxide"/>
                     </div>

                      {/* Panel 3: Aluminum Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Aluminum Extraction Check</h3>
                           <MiniCheckQuestion
                              question="What is the main reason cryolite is added to aluminum oxide during electrolysis?"
                              correctAnswer="To lower the melting point of Al₂O₃."
                              explanation="Pure aluminum oxide melts at a very high temperature (>2000°C). Dissolving it in molten cryolite reduces the operating temperature to around 950°C, making the process more economical."
                          />
                      </div>

                      {/* Panel 4: Copper Refining Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="CNuXArvyXn8" title="Video: Electrolytic Refining of Copper"/>
                      </div>

                      {/* Panel 5: Refining Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Refining Check</h3>
                           <MiniCheckQuestion
                              question="In copper refining, why does pure copper deposit on the cathode while more reactive metals like zinc stay in solution?"
                              correctAnswer="Cu²⁺ ions are more easily reduced (gain electrons) than Zn²⁺ ions."
                              explanation="According to the electrochemical series/reduction potentials, it takes less energy to reduce Cu²⁺ back to Cu metal compared to reducing Zn²⁺."
                          />
                      </div>

                      {/* Panel 6: Electroplating Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="yGzAj3rnCgI" title="Video: Electroplating Process Explained"/>
                      </div>

                       {/* Panel 7: Chlor-Alkali Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="Amj0tV9MoqU" title="Video: The Chlor-Alkali Process"/>
                      </div>

                      {/* Panel 8: Simulation Link */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Electrolysis Simulation</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Visualize ion movement and electrode reactions in different scenarios.</p>
                         <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                            <a href="https://phet.colorado.edu/sims/html/electrolysis/latest/electrolysis_en.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open PhET: Electrolysis (New Tab)</span>
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
                    Test Your Electrolysis Applications Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Industrial Electrolysis Quiz</h2>
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
ElectrolysisApplicationsPage.displayName = 'ElectrolysisApplicationsPage';

export default ElectrolysisApplicationsPage;
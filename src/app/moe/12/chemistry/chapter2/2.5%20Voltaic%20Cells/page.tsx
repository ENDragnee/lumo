'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, useMemo, ChangeEvent, useEffect } from 'react';
import QuizQuestion from '@/components/QuizQuestion'; // Assuming this component exists
import Image from 'next/image'; // For placeholder image
import 'katex/dist/katex.min.css';

// --- Constants ---
const R = 8.314; // Ideal Gas Constant (J/mol·K)
const F_CONST = 96500; // Faraday Constant (C/mol e⁻)
const TEMP_K = 298.15; // Standard Temperature (25°C in Kelvin)

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
                    sandbox="allow-scripts allow-same-origin" // Sandbox for security
                    title={title}>
                        <p className="text-light-gray text-center pt-10">Loading Simulation...</p>
                 </iframe>
            ) : (
                 <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                     <span className="text-light-gray font-inter font-semibold p-4 text-center">Simulation cannot be embedded here.</span>
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
const quizQuestions = [
    // ... (Original quiz questions - seem appropriate)
     {
        "question": "What is the primary difference between a Galvanic (Voltaic) cell and an Electrolytic cell?",
        "options": [
        "Galvanic cells use DC, Electrolytic cells use AC.",
        "Galvanic cells convert chemical to electrical energy (spontaneous), Electrolytic cells use electrical to drive chemical energy (non-spontaneous).", // Correct
        "Galvanic cells have only one compartment, Electrolytic cells have two.",
        "Galvanic cells use inert electrodes, Electrolytic cells use active electrodes."
        ],
        "correctAnswer": 1,
        "hint": "Think about whether the cell PRODUCES electricity or CONSUMES it."
    },
    {
        "question": "What is the function of the salt bridge in a Galvanic cell?",
        "options": [
        "To allow electron flow between half-cells.",
        "To maintain electrical neutrality in the half-cells by allowing ion migration.", // Correct
        "To separate the anode from the cathode physically.",
        "To provide reactants for the cell reaction."
        ],
        "correctAnswer": 1,
        "hint": "It completes the circuit by preventing charge buildup in the half-cells."
    },
    {
        "question": "In the Daniell cell (Zn/Zn²⁺ || Cu²⁺/Cu), oxidation occurs at the:",
        "options": [
        "Copper electrode (cathode)",
        "Zinc electrode (anode)", // Correct
        "Salt bridge",
        "External wire"
        ],
        "correctAnswer": 1,
        "hint": "Oxidation is loss of electrons (LEO). Zinc (Zn → Zn²⁺ + 2e⁻) is more easily oxidized than copper."
    },
    {
        "question": "The Standard Hydrogen Electrode (SHE) is assigned a standard reduction potential of exactly:",
        "options": ["1.00 V", "-1.00 V", "0.00 V", "0.76 V"],
        "correctAnswer": 2,
        "hint": "The SHE serves as the universal reference point for measuring other electrode potentials."
    },
    {
        "question": "The Nernst equation is used to calculate the cell potential (E_cell) under conditions where:",
        "options": [
        "The temperature is absolute zero.",
        "The reaction is at equilibrium.",
        "The concentrations of reactants and products are NOT standard (e.g., not 1 M).", // Correct
        "Only oxidation is occurring."
        ],
        "correctAnswer": 2,
        "hint": "It adjusts the standard cell potential (E°) for non-standard concentrations using the reaction quotient (Q)."
    },
    {
        "question": "In a concentration cell like Cu(s)|Cu²⁺(0.1M)||Cu²⁺(1.0M)|Cu(s), electrons flow from:",
        "options": [
        "The concentrated side to the dilute side.",
        "The dilute side (anode) to the concentrated side (cathode).", // Correct
        "Both sides towards the salt bridge.",
        "No electron flow occurs."
        ],
        "correctAnswer": 1,
        "hint": "The system tries to equalize concentrations. Oxidation (Cu→Cu²⁺) occurs in the dilute side, reduction (Cu²⁺→Cu) occurs in the concentrated side."
    },
    {
        "question": "Why is Platinum (Pt) often used as the electrode material in the SHE?",
        "options": [
        "It actively reacts with hydrogen.",
        "It is very inexpensive.",
        "It is chemically inert but provides a surface for the H⁺/H₂ reaction to occur.", // Correct
        "It dissolves in the acid."
        ],
        "correctAnswer": 2,
        "hint": "An inert electrode is needed to conduct electrons without participating in the redox reaction itself."
    },
    {
        "question": "Cell notation represents the anode on the ______ and the cathode on the ______, separated by a double vertical line (||) representing the ______.",
        "options": ["right; left; wire", "left; right; salt bridge", "top; bottom; electrolyte", "right; left; salt bridge"],
        "correctAnswer": 1,
        "hint": "Convention: Anode | Anode Soln || Cathode Soln | Cathode"
    },
    {
        "question": "A positive standard cell potential (E°_cell) indicates that the overall cell reaction under standard conditions is:",
        "options": ["Non-spontaneous", "Spontaneous (favors products)", "At equilibrium", "Endothermic"],
        "correctAnswer": 1,
        "hint": "A positive E°_cell corresponds to a negative Gibbs Free Energy change (ΔG°), indicating spontaneity."
    },
    {
        "question": "A fuel cell is different from a typical battery primarily because:",
        "options": [
        "It uses solid reactants.",
        "Reactants are continuously supplied from an external source.", // Correct
        "It generates DC instead of AC.",
        "It cannot be recharged."
        ],
        "correctAnswer": 1,
        "hint": "Batteries store reactants internally, while fuel cells consume fuel provided externally."
    }
];

// --- KaTeX String Constants ---
const katex_Zn = 'Zn(s)';
const katex_CuSO4_aq = 'CuSO_4(aq)';
const katex_ZnSO4_aq = 'ZnSO_4(aq)';
const katex_Cu_aq = 'Cu(s)';
const katex_Zn2_plus_aq = 'Zn^{2+}(aq)';
const katex_Cu2_plus_aq = 'Cu^{2+}(aq)';
const katex_e_minus = 'e^-';
const katex_Daniell_Overall = `${katex_Zn} + ${katex_Cu2_plus_aq} \\rightarrow ${katex_Zn2_plus_aq} + ${katex_Cu_aq}`;
const katex_Ox_Zn = `${katex_Zn} \\rightarrow ${katex_Zn2_plus_aq} + 2${katex_e_minus}`;
const katex_Red_Cu = `${katex_Cu2_plus_aq} + 2${katex_e_minus} \\rightarrow ${katex_Cu_aq}`;
const katex_Daniell_Notation = `Zn(s) | Zn^{2+}(aq) || Cu^{2+}(aq) | Cu(s)`;
const katex_E_cell = 'E_{\\text{cell}}';
const katex_E_cathode = 'E_{\\text{cathode}}';
const katex_E_anode = 'E_{\\text{anode}}';
const katex_E0_cell = `E^\\circ_{\\text{cell}}`;
const katex_E0 = `E^\\circ`; // Standard Potential
const katex_E_cell_eq = `${katex_E_cell} = ${katex_E_cathode} - ${katex_E_anode}`;
const katex_H_plus_aq = 'H^{+}(aq)';
const katex_H2_g = 'H_2(g)';
const katex_Pt_s = 'Pt(s)';
const katex_SHE_Reaction = `2${katex_H_plus_aq}(1M) + 2${katex_e_minus} \\rightleftharpoons ${katex_H2_g}(1 \\text{ atm})`;
const katex_SHE_E0 = `${katex_E0} = 0.00 \\, V`;
const katex_Zn_SHE_Notation = `Zn(s) | Zn^{2+}(1M) || H^{+}(1M) | H_2(1 \\text{ atm}) | Pt(s)`;
const katex_Cu_SHE_Notation = `Pt(s) | H_2(1 \\text{ atm}) | H^{+}(1M) || Cu^{2+}(1M) | Cu(s)`;
const katex_E0_Zn = `E^\\circ_{Zn^{2+}/Zn} = -0.76 \\, V`;
const katex_E0_Cu = `E^\\circ_{Cu^{2+}/Cu} = +0.34 \\, V`;
const katex_Daniell_E0_calc = `${katex_E0_cell} = ${katex_E_cathode} - ${katex_E_anode} = (+0.34 \\, V) - (-0.76 \\, V) = 1.10 \\, V`;
const katex_Nernst_Simple = `E = E^\\circ - \\frac{0.0592}{n} \\log Q \\text{ (at 25°C)}`;
const katex_Nernst_Full = `E = E^\\circ - \\frac{RT}{nF} \\ln Q`;
const katex_Q = 'Q'; // Reaction Quotient
const katex_R = 'R'; // Gas Constant
const katex_T = 'T'; // Temperature (K)
const katex_n = 'n'; // moles of electrons
const katex_F = 'F'; // Faraday Constant
const katex_ln = '\\ln'; // Natural log
const katex_log = '\\log'; // Base-10 log
const katex_ConcCell_Cu_Notation = `Cu(s) | Cu^{2+}(0.1M) || Cu^{2+}(1.0M) | Cu(s)`;
const katex_ConcCell_Overall = `Cu^{2+}(aq; 1.0 M) \\rightarrow Cu^{2+}(aq; 0.1 M)`;
const katex_ConcCell_E = `E = 0.0296 \\, V`; // Calculated value from example
const katex_FuelCell_Anode = `H_2(g) \\rightarrow 2H^+ (aq) + 2e^{-}`;
const katex_FuelCell_Cathode = `O_2(g) + 4H^+ (aq) + 4e^{-} \\rightarrow 2H_2O(g)`;
const katex_FuelCell_Overall = `2H_2(g) + O_2(g) \\rightarrow 2H_2O(l)`;
const katex_Corrosion_Anode = `Fe(s) \\rightarrow Fe^{2+} (aq) + 2e^{-}`;
const katex_Corrosion_Cathode = `O_2(g) + 4H^+ (aq) + 4e^{-} \\rightarrow 2H_2O(l)`;
const katex_Corrosion_Overall = `2Fe(s) + O_2(g) + 4H^+ (aq) \\rightarrow 2Fe^{2+} (aq) + 2H_2O(l)`;

// --- Main Page Component ---
const VoltaicCellsPage = () => { // Renamed component
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Nernst Calculator State
  const [e0_cell, setE0Cell] = useState(1.10); // V (Daniell Cell standard)
  const [n_electrons, setNElectrons] = useState(2); // Moles of electrons
  const [concProd, setConcProd] = useState(1.0); // M (e.g., [Zn²⁺])
  const [concReact, setConcReact] = useState(1.0); // M (e.g., [Cu²⁺])

  // --- Memoized Calculations ---
  const reactionQuotientQ = useMemo(() => {
      // Simple Q = [Products]/[Reactants] for M -> Mⁿ⁺ + ne⁻ || Ox + ne⁻ -> Red
      // Assuming activity coefficients are 1, solids/liquids have activity 1
      // Example: Zn + Cu²⁺ -> Zn²⁺ + Cu => Q = [Zn²⁺] / [Cu²⁺]
      if (concReact <= 0) return Infinity; // Avoid division by zero
      return concProd / concReact;
  }, [concProd, concReact]);

  const nernstPotentialE = useMemo(() => {
      if (n_electrons <= 0 || reactionQuotientQ <= 0 || !isFinite(reactionQuotientQ)) return null; // Invalid inputs for log or division
      // E = E⁰ - (RT/nF)lnQ = E⁰ - (0.0592/n)log₁₀Q at 25°C
      try {
         return e0_cell - (0.0592 / n_electrons) * Math.log10(reactionQuotientQ);
      } catch (e) {
          return null; // Handle potential math errors
      }
  }, [e0_cell, n_electrons, reactionQuotientQ]);


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
                2.5 Voltaic (Galvanic) Cells {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction & Daniell Cell */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Generating Electricity from Chemistry
                         </h2>
                         <p className="leading-relaxed">
                            While electrolytic cells use electricity to cause chemical reactions, <strong className="text-teal dark:text-teal font-semibold">Voltaic (or Galvanic) cells</strong> do the opposite: they harness <strong className="text-coral dark:text-gold">spontaneous</strong> chemical redox reactions to generate electrical energy. Batteries are common examples.
                         </p>
                         <p className="mt-3 leading-relaxed">
                            Consider the spontaneous reaction between zinc metal and copper(II) ions:
                         </p>
                          <BlockMath math={katex_Daniell_Overall}/>
                          <p className="leading-relaxed">
                              In a voltaic cell, we physically separate the oxidation half (Zn losing electrons) from the reduction half (Cu²⁺ gaining electrons) into two <strong className="text-teal dark:text-teal font-semibold">half-cells</strong>. Electrons are forced to travel through an external wire, creating an electric current.
                          </p>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">The Daniell Cell Example</h3>
                            <p className="leading-relaxed">
                                A classic voltaic cell:
                                 <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                                     <li><strong className="font-semibold">Anode (Oxidation):</strong> A zinc electrode (<InlineMath math="Zn"/>) immersed in a zinc sulfate solution (<InlineMath math={katex_ZnSO4_aq}/>). <InlineMath math={katex_Ox_Zn}/></li>
                                     <li><strong className="font-semibold">Cathode (Reduction):</strong> A copper electrode (<InlineMath math="Cu"/>) immersed in a copper sulfate solution (<InlineMath math={katex_CuSO4_aq}/>). <InlineMath math={katex_Red_Cu}/></li>
                                     <li><strong className="font-semibold">External Circuit:</strong> A wire connecting the Zn and Cu electrodes allows electron flow from anode (Zn) to cathode (Cu).</li>
                                      <li><strong className="font-semibold">Salt Bridge:</strong> Connects the two solutions, allowing ions to migrate and maintain electrical neutrality in each half-cell, completing the circuit. Without it, charge buildup would quickly stop the electron flow.</li>
                                </ul>
                           </p>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Cell Notation</h3>
                           <p className="leading-relaxed">
                               A shorthand way to represent this cell:
                           </p>
                            <div className='my-2 p-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center text-sm'>
                               <BlockMath math={katex_Daniell_Notation}/>
                            </div>
                             <p className="text-xs italic leading-relaxed text-gray-600 dark:text-gray-400">
                                (Anode | Anode Solution || Cathode Solution | Cathode. Single line | = phase boundary, Double line || = salt bridge).
                            </p>
                     </section>

                    {/* Standard Electrode Potentials */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Measuring Cell Potential (EMF)
                         </h2>
                         <p className="leading-relaxed">
                             The "driving force" of a voltaic cell is its <strong className="text-teal dark:text-teal font-semibold">cell potential (<InlineMath math={katex_E_cell}/>)</strong> or electromotive force (EMF), measured in Volts (V). It represents the potential difference between the cathode and the anode.
                         </p>
                           <BlockMath math={katex_E_cell_eq}/>
                           <p className="mt-3 leading-relaxed">
                              To compare different half-reactions, we measure their potentials relative to a standard reference electrode under standard conditions (1 M concentration, 1 atm pressure for gases, 25°C).
                           </p>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Standard Hydrogen Electrode (SHE)</h3>
                           <p className="leading-relaxed">
                               The universally accepted reference is the SHE, consisting of a platinum electrode immersed in 1 M <InlineMath math={katex_H_plus_aq}/> solution with <InlineMath math={katex_H2_g}/> gas bubbled over it at 1 atm. Its standard potential (<InlineMath math={katex_E0}/>) is defined as exactly <strong className="text-coral dark:text-gold">0.00 V</strong> at all temperatures.
                           </p>
                           <BlockMath math={`${katex_SHE_Reaction}, \\quad ${katex_SHE_E0}`}/>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Standard Reduction Potentials</h3>
                            <p className="leading-relaxed">
                                By constructing a voltaic cell with the SHE and another half-cell under standard conditions, we can measure the <strong className="text-teal dark:text-teal font-semibold">standard reduction potential (<InlineMath math={katex_E0}/>)</strong> of the other half-cell.
                                <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                                    <li>Example: Zn/SHE cell (<InlineMath math={katex_Zn_SHE_Notation}/>) measures E°<sub>cell</sub> = +0.76 V. Since Zn is oxidized (anode) and SHE is reduced (cathode), E°<sub>cell</sub> = E°<sub>cathode</sub> - E°<sub>anode</sub> = 0.00 V - E°<sub>Zn²⁺/Zn</sub>. Therefore, <InlineMath math={katex_E0_Zn}/>.</li>
                                    <li>Example: Cu/SHE cell (<InlineMath math={katex_Cu_SHE_Notation}/>) measures E°<sub>cell</sub> = +0.34 V. Here SHE is oxidized (anode) and Cu is reduced (cathode). E°<sub>cell</sub> = E°<sub>cathode</sub> - E°<sub>anode</sub> = E°<sub>Cu²⁺/Cu</sub> - 0.00 V. Therefore, <InlineMath math={katex_E0_Cu}/>.</li>
                                </ul>
                            </p>
                             <p className="mt-3 leading-relaxed">
                                Standard reduction potentials are tabulated, allowing us to calculate the standard cell potential for *any* combination: <InlineMath math={`${katex_E0_cell} = E^\\circ_{\\text{reduction}} - E^\\circ_{\\text{oxidation}}`} />. A positive <InlineMath math={katex_E0_cell}/> indicates a spontaneous reaction under standard conditions. For the Daniell cell:
                             </p>
                              <BlockMath math={katex_Daniell_E0_calc}/>
                     </section>

                     {/* Nernst Equation */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Effect of Concentration: The Nernst Equation
                         </h2>
                         <p className="leading-relaxed">
                             Cell potentials are not always measured under standard conditions (1 M, 1 atm, 25°C). The <strong className="text-teal dark:text-teal font-semibold">Nernst Equation</strong> relates the actual cell potential (<InlineMath math={katex_E_cell}/>) to the standard cell potential (<InlineMath math={katex_E0_cell}/>) and the concentrations of reactants and products via the reaction quotient (<InlineMath math={katex_Q}/>).
                         </p>
                           <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                              <BlockMath math={katex_Nernst_Full}/>
                          </div>
                          <p className="leading-relaxed">
                              At standard temperature (25°C or 298.15 K), using base-10 logarithm:
                          </p>
                           <div className='my-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-center'>
                              <BlockMath math={katex_Nernst_Simple}/>
                          </div>
                           <p className="leading-relaxed text-sm">
                               Where <InlineMath math={katex_R}/> is the gas constant, <InlineMath math={katex_T}/> is temperature in Kelvin, <InlineMath math={katex_n}/> is moles of electrons transferred, <InlineMath math={katex_F}/> is Faraday's constant, and <InlineMath math={katex_Q}/> is the reaction quotient ([Products]/[Reactants], excluding solids/liquids).
                           </p>
                            <p className="mt-3 leading-relaxed">
                                The Nernst equation shows that increasing product concentrations or decreasing reactant concentrations will <strong className="text-coral dark:text-gold">decrease</strong> the cell potential relative to <InlineMath math={katex_E0_cell}/>. As the reaction proceeds towards equilibrium, <InlineMath math={katex_E_cell}/> approaches zero.
                            </p>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Concentration Cells</h3>
                            <p className="leading-relaxed">
                               A voltage can even be generated by having the same electrode/ion pair in both half-cells but at different concentrations (e.g., <InlineMath math={katex_ConcCell_Cu_Notation}/>). The cell potential arises solely from the concentration difference, driving the system towards equilibrium where concentrations are equal.
                            </p>
                     </section>

                    {/* Applications & Comparison */}
                    <section>
                        <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Applications and Comparison
                         </h2>
                         <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Galvanic vs. Electrolytic Cells</h3>
                         {/* Simple comparison table */}
                          <table className="table-auto w-full text-sm my-4 font-inter border">
                            <thead>
                              <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="px-3 py-1 border dark:border-gray-600">Feature</th>
                                <th className="px-3 py-1 border dark:border-gray-600">Galvanic (Voltaic)</th>
                                <th className="px-3 py-1 border dark:border-gray-600">Electrolytic</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr><td className="border px-3 py-1">Energy Conversion</td><td className="border px-3 py-1">Chemical → Electrical</td><td className="border px-3 py-1">Electrical → Chemical</td></tr>
                              <tr><td className="border px-3 py-1">Reaction Type</td><td className="border px-3 py-1">Spontaneous (ΔG &gt 0)</td><td className="border px-3 py-1">Non-spontaneous (ΔG &gt 0)</td></tr>
                              <tr><td className="border px-3 py-1">Anode Sign</td><td className="border px-3 py-1">Negative (-)</td><td className="border px-3 py-1">Positive (+)</td></tr>
                              <tr><td className="border px-3 py-1">Cathode Sign</td><td className="border px-3 py-1">Positive (+)</td><td className="border px-3 py-1">Negative (-)</td></tr>
                               <tr><td className="border px-3 py-1">External Power</td><td className="border px-3 py-1">No (Generates Power)</td><td className="border px-3 py-1">Yes (Consumes Power)</td></tr>
                            </tbody>
                          </table>
                         <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Fuel Cells</h3>
                          <p className="leading-relaxed">
                              These are special galvanic cells where reactants (fuel like H₂ and oxidant like O₂) are continuously supplied. Example: Hydrogen-Oxygen Fuel Cell producing water.
                          </p>
                          <BlockMath math={katex_FuelCell_Overall}/>
                          <p className="leading-relaxed"> They offer high efficiency and clean operation (water is the main byproduct).</p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Corrosion</h3>
                           <p className="leading-relaxed">
                             Corrosion (like rusting of iron) is an unwanted electrochemical process, essentially a spontaneous galvanic cell where the metal acts as the anode and is oxidized, often with oxygen acting as the cathode. Understanding electrochemistry helps develop methods (coatings, alloys, sacrificial anodes) to prevent corrosion.
                           </p>
                           <BlockMath math={katex_Corrosion_Overall} />
                     </section>


                      {/* Study Tips Section */}
                      <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Memorization Tips
                         </h2>
                         <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                              <li><strong className="font-semibold">Galvanic vs. Electrolytic Core Difference:</strong> Galvanic = Spontaneous, Produces electricity. Electrolytic = Non-spontaneous, Consumes electricity.</li>
                              <li><strong className="font-semibold">Electrode Definitions:</strong> Anode = Oxidation, Cathode = Reduction (An Ox, Red Cat) - *ALWAYS* true. The *sign* (+/-) changes between cell types!</li>
                              <li><strong className="font-semibold">Electron Flow:</strong> Always Anode to Cathode through the external wire.</li>
                               <li><strong className="font-semibold">Ion Flow (Salt Bridge):</strong> Cations → Cathode, Anions → Anode to maintain neutrality.</li>
                               <li><strong className="font-semibold">Standard Potentials (E°):</strong> Understand SHE as the zero reference. More positive E° means easier to reduce. E°<sub>cell</sub> = E°<sub>cathode</sub> - E°<sub>anode</sub>. Positive E°<sub>cell</sub> = Spontaneous reaction.</li>
                               <li><strong className="font-semibold">Nernst Equation Purpose:</strong> Use it when conditions are *not* standard (concentrations ≠ 1M, pressures ≠ 1 atm). Understand how Q affects E<sub>cell</sub> (Q &gt 1 decreases E<sub>cell</sub>, Q &gt 1 increases E<sub>cell</sub>).</li>
                                <li><strong className="font-semibold">Visualize Cells:</strong> Draw simple diagrams of the Daniell cell, concentration cells, etc., labeling electrodes, solutions, electron flow, and ion flow through the salt bridge.</li>
                           </ul>
                     </section>


                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                      {/* Panel 1: Voltaic Cell Intro Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="7b349 TBSs" title="Video: Introduction to Voltaic (Galvanic) Cells"/> {/* Corrected ID (example) */}
                      </div>

                      {/* Panel 2: Daniell Cell Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Daniell Cell Check</h3>
                           <MiniCheckQuestion
                              question="In the Daniell cell (Zn/Cu), why do sulfate ions (SO₄²⁻) move from the copper half-cell towards the zinc half-cell through the salt bridge?"
                              correctAnswer="To balance the buildup of positive charge (Zn²⁺ ions) in the anode compartment as Zn is oxidized."
                              explanation="As Zn → Zn²⁺ + 2e⁻ occurs, positive charge increases in the anode beaker. Negative sulfate ions migrate from the cathode side (where positive Cu²⁺ ions are being removed) via the salt bridge to neutralize this excess positive charge."
                          />
                      </div>

                     {/* Panel 3: Standard Electrode Potentials Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="W3wJsmtvF4I" title="Video: Standard Electrode Potentials & SHE"/>
                      </div>

                     {/* Panel 4: Nernst Equation Calculator */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <h3 className="text-xl font-semibold font-inter mb-4 text-green-700 dark:text-green-300">Nernst Equation Calculator (25°C)</h3>
                          <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Calculate cell potential under non-standard conditions.</p>
                           <div className="mb-3 font-inter">
                              <label htmlFor="e0cellInput" className="block text-sm font-medium mb-1">Standard Cell Potential (E⁰<sub>cell</sub>) (V):</label>
                              <input type="number" id="e0cellInput" step="0.01" value={e0_cell} onChange={(e) => setE0Cell(parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-light-gray" placeholder="e.g., 1.10" />
                           </div>
                           <div className="mb-3 font-inter">
                               <label htmlFor="nElectronsInput" className="block text-sm font-medium mb-1">Moles of Electrons (n):</label>
                              <input type="number" id="nElectronsInput" step="1" min="1" value={n_electrons} onChange={(e) => setNElectrons(parseInt(e.target.value, 10))} className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-light-gray" placeholder="e.g., 2" />
                           </div>
                           <div className="mb-3 font-inter">
                               <label htmlFor="concProdInput" className="block text-sm font-medium mb-1">Product Ion Conc. [Prod] (M):</label>
                              <input type="number" id="concProdInput" step="0.01" min="0.001" value={concProd} onChange={(e) => setConcProd(parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-light-gray" placeholder="e.g., 1.0" />
                           </div>
                            <div className="mb-4 font-inter">
                                <label htmlFor="concReactInput" className="block text-sm font-medium mb-1">Reactant Ion Conc. [React] (M):</label>
                              <input type="number" id="concReactInput" step="0.01" min="0.001" value={concReact} onChange={(e) => setConcReact(parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-light-gray" placeholder="e.g., 1.0" />
                           </div>

                           <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 rounded shadow-inner text-center">
                               <p className="text-lg font-semibold font-inter text-dark-gray dark:text-light-gray">
                                 Non-Standard Potential (<InlineMath math={katex_E_cell}/>) ≈ <span className="font-bold text-teal dark:text-mint">
                                     {nernstPotentialE !== null && isFinite(nernstPotentialE) ? nernstPotentialE.toFixed(3) : "Invalid Input"}
                                 </span> V
                               </p>
                           </div>
                           <MiniCheckQuestion
                             question={`Using the Nernst calculator for the Daniell cell (E⁰=1.10V, n=2): If [Zn²⁺]=0.1M and [Cu²⁺]=2.0M, will E_cell be greater or less than 1.10V?`}
                             correctAnswer="Greater than 1.10V."
                             explanation={`Q = [Zn²⁺]/[Cu²⁺] = 0.1 / 2.0 = 0.05. Since Q < 1, log(Q) is negative. E = E⁰ - (0.0592/n)log(Q). Subtracting a negative number increases E_cell.`}
                         />
                     </div>

                    {/* Panel 5: Fuel Cell Video */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="FHdIyYqDc2E" title="Video: How Fuel Cells Work"/>
                    </div>

                    {/* Panel 6: PhET Simulation Link */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Voltaic Cells</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Build different galvanic cells and measure potentials.</p>
                         <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                             {/* Link to relevant PhET sim */}
                            <a href="https://phet.colorado.edu/sims/html/galvanic-cells/latest/galvanic-cells_en.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open PhET: Voltaic Cells (New Tab)</span>
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
                    Test Your Voltaic Cell Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
         {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Voltaic Cells Quiz</h2>
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
VoltaicCellsPage.displayName = 'VoltaicCellsPage';

export default VoltaicCellsPage;
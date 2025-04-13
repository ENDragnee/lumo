'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, ChangeEvent, Fragment } from 'react'; // Added Fragment
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

interface InteractiveBalanceProps {
    reaction: string; // Unbalanced reaction string
    steps: BalancingStep[]; // Array of steps for balancing
}

interface BalancingStep {
    stepNumber: number;
    description: string; // What to do in this step
    currentState: string; // Reaction state after this step (optional visual)
    checkQuestion?: MiniCheckQuestionProps; // Optional question for this step
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
      <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md bg-black"> {/* Added relative and bg */}
         <iframe
           className="absolute top-0 left-0 w-full h-full" // Use absolute positioning
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
    // Embedded within a step, slightly less margin
    <div className="mt-4 p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 shadow-sm">
      <p className="font-medium text-sm mb-3 font-inter text-dark-gray dark:text-light-gray">{question}</p>
      {options && options.length > 0 && !revealed && (
         <div className="space-y-2 mb-3">
              {options.map((option, index) => (
                  <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      className={`block w-full text-left text-xs p-2 rounded border font-inter transition-colors
                                  ${selectedOption === index ? (isCorrect ? 'bg-mint/30 border-teal' : 'bg-coral/30 border-red-500') : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500'}
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
        <div className="text-xs space-y-1 font-inter border-t border-gray-300 dark:border-gray-500 pt-2 mt-2">
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

// Interactive Balancing Exercise Component
function InteractiveBalancing({ reaction, steps }: InteractiveBalanceProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const handlePrev = () => {
        setCurrentStep(prev => Math.max(0, prev - 1));
    };

    const handleReset = () => {
        setCurrentStep(0);
    };

    const currentStepData = steps[currentStep];

    return (
        <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md font-inter">
            <h4 className="text-lg font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Interactive Balancing: Half-Reaction Method</h4>
            <p className="text-sm mb-2">Initial Reaction:</p>
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded mb-4 text-center text-sm">
                <BlockMath math={reaction} />
            </div>

            <div className="border dark:border-gray-600 p-3 rounded mb-4">
                <p className="text-sm font-semibold mb-1">Step {currentStepData.stepNumber}: {currentStepData.description}</p>
                {currentStepData.currentState && (
                    <div className="p-1 my-2 bg-gray-50 dark:bg-gray-600 rounded text-center text-xs">
                       <BlockMath math={currentStepData.currentState} />
                    </div>
                )}
                 {/* Render MiniCheckQuestion if it exists for the current step */}
                 {currentStepData.checkQuestion && (
                    <MiniCheckQuestion {...currentStepData.checkQuestion} />
                 )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="text-xs bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-inter font-semibold py-1 px-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous Step
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">Step {currentStep + 1} of {steps.length}</span>
                <button
                    onClick={handleNext}
                    disabled={currentStep === steps.length - 1}
                    className="text-xs bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next Step
                </button>
            </div>
             <button
                onClick={handleReset}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-3 block mx-auto"
             >
                 Reset Steps
             </button>
        </div>
    );
}


// --- Page Specific Data ---
// *** EXPANDED QUIZ QUESTIONS for Redox ***
const quizQuestions = [
  {
    "question": "Oxidation involves the ______ of electrons and a(n) ______ in oxidation number.",
    "options": ["gain; decrease", "loss; increase", "gain; increase", "loss; decrease"],
    "correctAnswer": 1,
    "hint": "Remember LEO says GER: Loss of Electrons is Oxidation, Gain of Electrons is Reduction."
  },
  {
    "question": "Reduction involves the ______ of electrons and a(n) ______ in oxidation number.",
    "options": ["gain; decrease", "loss; increase", "gain; increase", "loss; decrease"],
    "correctAnswer": 0,
    "hint": "Remember LEO says GER: Loss of Electrons is Oxidation, Gain of Electrons is Reduction."
  },
   {
    "question": "In the reaction Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g), which element is oxidized?",
    "options": ["Mg", "H", "Cl", "None"],
    "correctAnswer": 0,
    "hint": "Magnesium goes from oxidation state 0 in Mg(s) to +2 in MgCl₂."
  },
   {
    "question": "In the reaction Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g), which element is reduced?",
    "options": ["Mg", "H", "Cl", "None"],
    "correctAnswer": 1,
    "hint": "Hydrogen goes from oxidation state +1 in HCl to 0 in H₂(g)."
  },
  {
    "question": "Why must the number of electrons lost in oxidation equal the number of electrons gained in reduction when balancing a redox equation?",
    "options": ["Due to conservation of energy", "Due to conservation of mass", "Due to conservation of charge", "Due to Avogadro's Law"],
    "correctAnswer": 2,
    "hint": "Electrons cannot be created or destroyed in a chemical reaction; they are transferred."
  },
  {
    "question": "When balancing a half-reaction in acidic solution using the half-reaction method, how are oxygen atoms typically balanced?",
    "options": ["By adding O₂ molecules", "By adding OH⁻ ions", "By adding H₂O molecules", "By adding electrons"],
    "correctAnswer": 2,
    "hint": "Water is the source of oxygen in acidic aqueous solutions."
  },
    {
    "question": "After balancing oxygen with H₂O in acidic solution, how are hydrogen atoms typically balanced?",
    "options": ["By adding H₂ molecules", "By adding OH⁻ ions", "By adding H₂O molecules", "By adding H⁺ ions"],
    "correctAnswer": 3,
    "hint": "Protons (H⁺) are readily available in acidic solutions."
  },
    {
    "question": "When balancing a half-reaction in basic solution, after balancing O with H₂O and H with H⁺, what is the next step involving OH⁻?",
    "options": [
      "Add OH⁻ to balance the charge",
      "Remove all H⁺ ions",
      "Add an equal number of OH⁻ ions to *both* sides for every H⁺ ion present", // Correct
      "Replace H₂O with OH⁻"
      ],
    "correctAnswer": 2,
    "hint": "This step converts H⁺ ions into H₂O by reacting them with the added OH⁻."
  },
   {
    "question": "What is the oxidation number of Cr in Cr₂O₇²⁻?",
    "options": ["+3", "+6", "+7", "+12"],
    "correctAnswer": 1,
    "hint": "Oxygen is usually -2. Let Cr be x. 2x + 7(-2) = -2 (overall charge). Solve for x: 2x - 14 = -2 => 2x = 12 => x = +6."
  },
  {
    "question": "What is the oxidation number of Mn in MnO₄⁻?",
    "options": ["+2", "+4", "+7", "+8"],
    "correctAnswer": 2,
    "hint": "Oxygen is usually -2. Let Mn be x. x + 4(-2) = -1 (overall charge). Solve for x: x - 8 = -1 => x = +7."
  }
];

// --- KaTeX String Constants ---
const katex_H_plus = 'H^+';
const katex_OH_minus = 'OH^-';
const katex_H2O = 'H_2O';
const katex_Mg = 'Mg(s)';
const katex_HCl = 'HCl(aq)';
const katex_MgCl2 = 'MgCl_2(aq)';
const katex_H2 = 'H_2(g)';
const katex_Cl_minus = 'Cl^-';
const katex_Mg_HCl_rxn = `${katex_Mg} + 2 ${katex_HCl} \\rightarrow ${katex_MgCl2} + ${katex_H2}`;
const katex_Fe2_plus = 'Fe^{2+}';
const katex_Fe3_plus = 'Fe^{3+}';
const katex_electron = 'e^-';
const katex_Cr2O7_2minus = 'Cr_2O_7^{2-}';
const katex_Cr3_plus = 'Cr^{3+}';
const katex_Ox_Fe = `${katex_Fe2_plus} \\rightarrow ${katex_Fe3_plus} + ${katex_electron}`;
const katex_Red_Cr_O = `${katex_Cr2O7_2minus} \\rightarrow 2${katex_Cr3_plus} + 7${katex_H2O}`;
const katex_Red_Cr_H = `14${katex_H_plus} + ${katex_Cr2O7_2minus} \\rightarrow 2${katex_Cr3_plus} + 7${katex_H2O}`;
const katex_Red_Cr_e = `14${katex_H_plus} + ${katex_Cr2O7_2minus} + 6${katex_electron} \\rightarrow 2${katex_Cr3_plus} + 7${katex_H2O}`;
const katex_Ox_Fe_x6 = `6(${katex_Fe2_plus} \\rightarrow ${katex_Fe3_plus} + ${katex_electron})`;
const katex_Balanced_Fe_Cr = `6${katex_Fe2_plus} + 14${katex_H_plus} + ${katex_Cr2O7_2minus} \\rightarrow 6${katex_Fe3_plus} + 2${katex_Cr3_plus} + 7${katex_H2O}`;
const katex_I_minus = 'I^-';
const katex_I2 = 'I_2';
const katex_MnO4_minus = 'MnO_4^-';
const katex_MnO2 = 'MnO_2';
const katex_Iodide_Ox_Half = `${katex_I_minus} \\rightarrow ${katex_I2}`;
const katex_Permanganate_Red_Half = `${katex_MnO4_minus} \\rightarrow ${katex_MnO2}`;
const katex_Iodide_Balanced = `6${katex_I_minus}(aq) + 2${katex_MnO4_minus}(aq) + 4${katex_H2O}(l) \\rightarrow 3${katex_I2}(s) + 2${katex_MnO2}(s) + 8${katex_OH_minus}(aq)`; // Example balanced in basic

// --- Interactive Balancing Steps Data ---
const acidicBalancingSteps: BalancingStep[] = [
    {
        stepNumber: 1,
        description: "Separate into half-reactions.",
        currentState: `Ox: ${katex_Fe2_plus} \\rightarrow ${katex_Fe3_plus} \\quad | \\quad Red: ${katex_Cr2O7_2minus} \\rightarrow ${katex_Cr3_plus}`,
        checkQuestion: {
            question: "Which species is being oxidized?",
            correctAnswer: "Fe²⁺",
            explanation: "Iron's oxidation number increases from +2 to +3, indicating loss of electrons (oxidation)."
        }
    },
    {
        stepNumber: 2,
        description: "Balance atoms other than O and H (Cr).",
        currentState: `Ox: ${katex_Fe2_plus} \\rightarrow ${katex_Fe3_plus} \\quad | \\quad Red: ${katex_Cr2O7_2minus} \\rightarrow 2${katex_Cr3_plus}`,
         checkQuestion: {
            question: "How many Cr atoms are on each side of the reduction half-reaction now?",
            correctAnswer: "Two",
            explanation: "We added a coefficient '2' before Cr³⁺ to balance the two Cr atoms in Cr₂O₇²⁻."
        }
    },
     {
        stepNumber: 3,
        description: "Balance Oxygen atoms by adding H₂O (Reduction half).",
        currentState: `Ox: ${katex_Fe2_plus} \\rightarrow ${katex_Fe3_plus} \\quad | \\quad Red: ${katex_Cr2O7_2minus} \\rightarrow 2${katex_Cr3_plus} + 7${katex_H2O}`,
        checkQuestion: {
            question: "Why were 7 H₂O molecules added?",
            correctAnswer: "To balance the 7 oxygen atoms in Cr₂O₇²⁻.",
            explanation: "Each water molecule provides one oxygen atom."
        }
    },
     {
        stepNumber: 4,
        description: "Balance Hydrogen atoms by adding H⁺ (Reduction half).",
        currentState: `Ox: ${katex_Fe2_plus} \\rightarrow ${katex_Fe3_plus} \\quad | \\quad Red: 14${katex_H_plus} + ${katex_Cr2O7_2minus} \\rightarrow 2${katex_Cr3_plus} + 7${katex_H2O}`,
         checkQuestion: {
            question: "How many H atoms are now on the right side of the reduction half-reaction?",
            correctAnswer: "14 (from 7 H₂O)",
            explanation: "The 7 water molecules contain a total of 14 hydrogen atoms, requiring 14 H⁺ on the left."
        }
    },
     {
        stepNumber: 5,
        description: "Balance charge by adding electrons (e⁻).",
        currentState: `Ox: ${katex_Ox_Fe} \\quad | \\quad Red: ${katex_Red_Cr_e}`,
         checkQuestion: {
            question: "What is the net charge on the left side of the reduction half before adding electrons? (+14) + (-2) = ?",
            correctAnswer: "+12",
            explanation: "The net charge on the right is 2 * (+3) = +6. To balance +12 on the left to +6 on the right, 6 electrons (6 negative charges) must be added to the left."
        }
    },
    {
        stepNumber: 6,
        description: "Equalize electrons lost and gained by multiplying half-reactions.",
        currentState: `Ox (x6): ${katex_Ox_Fe_x6} \\quad | \\quad Red (x1): ${katex_Red_Cr_e}`,
         checkQuestion: {
            question: "Why multiply the oxidation half by 6?",
            correctAnswer: "To match the 6 electrons gained in the reduction half.",
            explanation: "Electrons transferred must be equal. 1 electron lost (ox) needs to match 6 electrons gained (red)."
        }
    },
     {
        stepNumber: 7,
        description: "Add the balanced half-reactions and cancel common species (electrons).",
        currentState: katex_Balanced_Fe_Cr,
         checkQuestion: {
            question: "What is the final net charge on both sides of the equation?",
            correctAnswer: "+24",
            explanation: "Left: 6(+2) + 14(+1) + (-2) = +12 + 14 - 2 = +24. Right: 6(+3) + 2(+3) = +18 + 6 = +24. Charges match."
        }
    },
     {
        stepNumber: 8,
        description: "Final check: Verify atom and charge balance. Add states if needed.",
        currentState: `${katex_Balanced_Fe_Cr} \\text{ (Balanced)}`,
        // No check question needed for final step
    }
];

// --- Main Page Component ---
const RedoxBalancingPage = () => { // Renamed component
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
                2.1 Oxidation-Reduction (Redox) Reactions {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Definitions */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Oxidation and Reduction
                         </h2>
                         <p className="leading-relaxed">
                             Redox reactions involve the transfer of electrons between chemical species.
                             <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                <li><strong className="text-coral dark:text-gold font-semibold">Oxidation:</strong> The <strong className="italic">loss</strong> of electrons by a substance. Its oxidation number <strong className="italic">increases</strong>. (Mnemonic: LEO - Loss of Electrons is Oxidation)</li>
                                <li><strong className="font-semibold text-teal dark:text-mint">Reduction:</strong> The <strong className="italic">gain</strong> of electrons by a substance. Its oxidation number <strong className="italic">decreases</strong> (is reduced). (Mnemonic: GER - Gain of Electrons is Reduction)</li>
                             </ul>
                         </p>
                         <p className="mt-3 leading-relaxed">
                            Example: Reaction of Magnesium with Hydrochloric Acid
                         </p>
                          <BlockMath math={katex_Mg_HCl_rxn}/>
                           <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                                <li>Mg (oxidation state 0) loses electrons to become Mg²⁺ (oxidation state +2) → <strong className="text-coral dark:text-gold">Oxidized</strong>.</li>
                                <li>H⁺ (oxidation state +1 in HCl) gains electrons to become H₂ (oxidation state 0) → <strong className="text-teal dark:text-mint">Reduced</strong>.</li>
                                <li>Cl⁻ ions are <strong className="italic text-gray-500 dark:text-gray-400">spectator ions</strong>; their oxidation state (-1) doesn't change.</li>
                           </ul>
                            <p className="mt-3 leading-relaxed font-semibold">
                                Oxidation and reduction always occur together in a redox reaction. One substance cannot lose electrons unless another substance gains them.
                            </p>
                    </section>

                     {/* Balancing Rationale */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Why Balance Redox Equations?
                         </h2>
                         <p className="leading-relaxed">
                             Balancing chemical equations ensures adherence to the <strong className="text-teal dark:text-teal font-semibold">Law of Conservation of Mass</strong> (atoms are not created or destroyed) and <strong className="text-teal dark:text-teal font-semibold">Conservation of Charge</strong> (the total charge must be the same on both sides of the equation). Redox reactions require special methods because we must also ensure the number of electrons lost equals the number of electrons gained.
                         </p>
                    </section>

                     {/* Oxidation Number Method */}
                    <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Balancing Method 1: Oxidation Number Change
                         </h2>
                         <p className="leading-relaxed">
                            This method focuses on tracking the changes in oxidation numbers. It's often used for reactions not explicitly in aqueous solution or not involving ions.
                         </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Steps:</h3>
                           <ol className="list-decimal list-outside ml-6 space-y-1 font-inter text-sm"> {/* UI Font for steps */}
                                <li>Write the unbalanced skeleton equation.</li>
                                <li>Assign oxidation numbers to all atoms.</li>
                                <li>Identify which atoms are oxidized (increase in ox. number) and which are reduced (decrease in ox. number).</li>
                                <li>Determine the total increase in oxidation number (electrons lost) and the total decrease (electrons gained).</li>
                                <li>Multiply the species involved in oxidation and/or reduction by appropriate factors to make the total electrons lost equal the total electrons gained. Use these factors as coefficients in the equation.</li>
                                <li>Balance the remaining atoms by inspection (often H and O last, if present). Add states of matter.</li>
                           </ol>
                     </section>

                    {/* Half-Reaction Method */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Balancing Method 2: Half-Reaction (Ion-Electron)
                         </h2>
                          <p className="leading-relaxed">
                            This method is particularly useful for reactions occurring in aqueous solution (acidic or basic) where ions are involved. It explicitly balances mass and charge in separate oxidation and reduction steps.
                          </p>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Steps (Acidic Solution Example):</h3>
                           <ol className="list-decimal list-outside ml-6 space-y-1 font-inter text-sm">
                               <li>Write the unbalanced skeleton equation and identify oxidation states to separate into oxidation and reduction half-reactions.</li>
                               <li>Balance atoms other than O and H in each half-reaction.</li>
                                <li>Balance Oxygen atoms by adding <InlineMath math={katex_H2O}/> molecules.</li>
                                <li>Balance Hydrogen atoms by adding <InlineMath math={katex_H_plus}/> ions.</li>
                                <li>Balance the charge in each half-reaction by adding electrons (<InlineMath math={katex_electron}/>) to the more positive side.</li>
                                <li>Multiply one or both half-reactions by integers so the number of electrons lost in oxidation equals the number of electrons gained in reduction.</li>
                               <li>Add the balanced half-reactions together, canceling out electrons and any other species appearing identically on both sides.</li>
                               <li>Final Check: Ensure both atoms and charges are balanced. Add states of matter.</li>
                           </ol>
                           <p className="mt-3 leading-relaxed text-sm italic text-gray-600 dark:text-gray-400">
                              <strong className="font-semibold">For Basic Solutions:</strong> Follow steps 1-7 as for acidic solution. Then, for every <InlineMath math={katex_H_plus}/> ion present, add an equal number of <InlineMath math={katex_OH_minus}/> ions to *both* sides of the equation. Combine <InlineMath math={katex_H_plus}/> and <InlineMath math={katex_OH_minus}/> on the same side to form <InlineMath math={katex_H2O}/>. Cancel any excess <InlineMath math={katex_H2O}/> molecules. Check final balance.
                           </p>
                     </section>

                      {/* Study Tips Section */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Memorization Tips
                         </h2>
                         <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                              <li><strong className="font-semibold">LEO says GER:</strong> This mnemonic (Loss of Electrons is Oxidation, Gain of Electrons is Reduction) is essential.</li>
                              <li><strong className="font-semibold">Oxidation Numbers Rules:</strong> Practice assigning oxidation numbers quickly and accurately (element=0, monatomic ion=charge, O=-2 (usually), H=+1 (usually), sum in compound=0, sum in ion=charge).</li>
                              <li><strong className="font-semibold">Half-Reaction Steps (Acidic):</strong> Memorize the order: Balance non-O/H atoms → Balance O with H₂O → Balance H with H⁺ → Balance charge with e⁻.</li>
                               <li><strong className="font-semibold">Basic Solution Trick:</strong> Balance as if acidic first, *then* add OH⁻ to both sides to neutralize H⁺, simplifying water.</li>
                               <li><strong className="font-semibold">Practice Systematically:</strong> Don't skip steps! Work through many examples of both methods. Check atom and charge balance at the end.</li>
                               <li><strong className="font-semibold">Visualize Electron Transfer:</strong> Think about where electrons are coming from (oxidized species) and where they are going (reduced species). The balancing ensures this transfer is equal.</li>
                           </ul>
                     </section>

                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                      {/* Panel 1: Redox Intro Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="lQ6FqjXhXG0" title="Video: Introduction to Oxidation and Reduction"/>
                     </div>

                    {/* Panel 2: Oxidation Numbers Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Oxidation Number Check</h3>
                           <MiniCheckQuestion
                             question={`What is the oxidation number of Sulfur (S) in the sulfate ion, SO₄²⁻?`}
                             correctAnswer="+6"
                             explanation="Oxygen is usually -2. Let Sulfur be x. x + 4(-2) = -2 (overall charge). x - 8 = -2. x = +6."
                         />
                     </div>

                    {/* Panel 3: Balancing Video (Half-Reaction Method) */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="N6ivVUUKD-A" title="Video: Balancing Redox with Half-Reaction Method (Acidic)"/>
                         {/* Consider adding another for Basic if needed */}
                     </div>

                    {/* Panel 4: Interactive Balancing Exercise */}
                    <InteractiveBalancing
                        reaction={`Fe^{2+}(aq) + Cr_2O_7^{2-}(aq) \\rightarrow Fe^{3+}(aq) + Cr^{3+}(aq) \\text{ (Acidic Solution)}`}
                        steps={acidicBalancingSteps}
                    />

                     {/* Panel 5: Practice Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Balancing Check</h3>
                           <MiniCheckQuestion
                              question="When balancing the half-reaction MnO₄⁻ → Mn²⁺ in acidic solution, how many H⁺ ions are added and on which side?"
                              correctAnswer="8 H⁺ on the left side."
                              explanation="First balance O: MnO₄⁻ → Mn²⁺ + 4H₂O. Then balance H: 8H⁺ + MnO₄⁻ → Mn²⁺ + 4H₂O. Finally balance charge: 5e⁻ + 8H⁺ + MnO₄⁻ → Mn²⁺ + 4H₂O."
                          />
                     </div>

                      {/* Panel 6: Redox Simulator/Practice Link (Optional) */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center">
                         <h3 className="text-xl font-semibold font-inter mb-3">Practice Problems</h3>
                          <p className="text-sm mb-4 font-inter text-dark-gray dark:text-light-gray">Find more balancing examples online:</p>
                           <a href="https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_Chemistry_-_The_Central_Science_(Brown_et_al.)/04%3A_Reactions_in_Aqueous_Solution/4.04%3A_Oxidation-Reduction_Reactions" target="_blank" rel="noopener noreferrer" className="text-coral dark:text-gold hover:underline font-inter font-semibold">
                               LibreTexts: Redox Reactions
                           </a>
                     </div>

                 </aside>
            </div>

             {/* Quiz Button */}
            <div className='flex justify-center items-center mt-12 lg:mt-16'>
                <button
                    onClick={() => setShowQuiz(true)}
                    className="w-full sm:w-1/2 lg:w-1/3 bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-3 px-6 rounded-lg transition-colors text-lg shadow-md"
                >
                    Test Your Redox Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Redox Reactions Quiz</h2>
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
RedoxBalancingPage.displayName = 'RedoxBalancingPage';

export default RedoxBalancingPage;
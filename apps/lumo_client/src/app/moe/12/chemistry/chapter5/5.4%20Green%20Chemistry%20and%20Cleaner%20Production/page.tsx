'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, ChangeEvent, Fragment, useMemo } from 'react'; // Added useMemo
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

interface TrueFalseStatement {
    id: number;
    statement: string;
    isTrue: boolean;
    explanation: string;
}

interface AtomEconomyCalcProps {
    reactants: { formula: string; coeff: number; molarMass: number }[];
    products: { formula: string; coeff: number; molarMass: number; isDesired: boolean }[];
}

// Define QuizQuestionData structure based on your quizQuestions array
interface QuizQuestionData {
    question: string;
    options: string[];
    correctAnswer: number;
    hint: string;
}

// !! Adjust based on your actual QuizQuestion component's expected props !!
interface QuizQuestionProps {
    key: number;
    // questionNumber?: number;
    question: string;
    options: string[];
    correctAnswer: number;
    hint: string;
    selectedAnswer: number | null;
    showResults: boolean;
    onSelectAnswer: (answerIndex: number) => void;
}

// --- Reusable Components (Styled as per design system) ---

// YouTube Embed Component (Includes Open in New Tab)
function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  return (
    <div className="my-4">
      <p className="mb-2 font-semibold font-inter text-dark-gray dark:text-light-gray">{title}:</p>
       <div className="flex justify-end mb-1">
           <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer"
              className="text-xs font-inter text-blue-600 dark:text-blue-400 hover:underline" title={`Open ${title} video in new tab`}>
               Open ↗
            </a>
        </div>
      <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md bg-black">
         <iframe
           className="absolute top-0 left-0 w-full h-full"
           src={`https://www.youtube.com/embed/${videoId}`}
           title={title} // Accessibility: Title attribute for iframe
           frameBorder="0"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           allowFullScreen>
         </iframe>
      </div>
    </div>
  );
}

// Mini Interactive Question Component (Includes Multiple Choice Option)
function MiniCheckQuestion({
    question, correctAnswer, explanation, options, correctOptionIndex, onSelectOption
}: MiniCheckQuestionProps) {
    const [revealed, setRevealed] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleOptionSelect = (index: number) => { /* ... logic from previous */ };
    const handleReveal = () => setRevealed(true);
    const handleHide = () => { setRevealed(false); setSelectedOption(null); setIsCorrect(null); };

    return (
        <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md">
             {/* ... JSX from previous correct version ... */}
             <p className="font-medium text-sm mb-3 font-inter text-dark-gray dark:text-light-gray">{question}</p> {options && options.length > 0 && !revealed && ( <div className="space-y-2 mb-3"> {options.map((option, index) => ( <button key={index} onClick={() => handleOptionSelect(index)} className={`block w-full text-left text-sm p-2 rounded border font-inter transition-colors ${selectedOption === index ? (isCorrect ? 'bg-mint/30 border-teal' : 'bg-coral/30 border-red-500') : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'} text-dark-gray dark:text-light-gray`} > {`${String.fromCharCode(65 + index)}. ${option}`} </button> ))} </div> )} {!options && !revealed && (<button onClick={handleReveal} className="text-xs bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors"> Check Answer </button>)} {revealed && (<div className="text-xs space-y-1 font-inter border-t border-gray-300 dark:border-gray-600 pt-2 mt-2"> {options && isCorrect !== null && (<p className={`font-semibold ${isCorrect ? 'text-teal dark:text-mint' : 'text-coral dark:text-gold'}`}> {isCorrect ? 'Correct!' : 'Incorrect.'} </p>)} <p className="text-dark-gray dark:text-light-gray"><strong className="text-teal dark:text-mint">Answer:</strong> {correctAnswer}</p> <p className="text-dark-gray dark:text-light-gray"><strong className="text-gray-600 dark:text-gray-400">Explanation:</strong> {explanation}</p> <button onClick={handleHide} className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 font-inter"> Hide/Reset </button> </div>)}
        </div>
    );
}

// True/False Interactive Exercise Component
function TrueFalseExercise({ title, statements }: { title: string, statements: TrueFalseStatement[] }) {
     // ... (state and handlers from previous correct version) ...
    const [answers, setAnswers] = useState<{ [key: number]: boolean | null }>({}); const [feedback, setFeedback] = useState<{ [key: number]: 'correct' | 'incorrect' | null }>({}); const [showAllFeedback, setShowAllFeedback] = useState(false); const handleAnswer = (id: number, answer: boolean) => { setAnswers(prev => ({ ...prev, [id]: answer })); setShowAllFeedback(false); }; const checkAllAnswers = () => { const newFeedback: { [key: number]: 'correct' | 'incorrect' | null } = {}; statements.forEach(statement => { if (answers[statement.id] !== null && answers[statement.id] !== undefined) { newFeedback[statement.id] = (answers[statement.id] === statement.isTrue) ? 'correct' : 'incorrect'; } else { newFeedback[statement.id] = null; } }); setFeedback(newFeedback); setShowAllFeedback(true); }; const resetExercise = () => { setAnswers({}); setFeedback({}); setShowAllFeedback(false); };

    return (
        <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md font-inter">
            {/* ... JSX structure from previous correct version ... */}
            <h4 className="text-lg font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">{title}</h4> <div className="space-y-4"> {statements.map((item) => ( <div key={item.id} className={`p-3 border rounded ${feedback[item.id] === 'correct' ? 'border-teal bg-mint/20' : feedback[item.id] === 'incorrect' ? 'border-red-500 bg-coral/20' : 'border-gray-300 dark:border-gray-600'}`}> <p className="text-sm mb-2 text-dark-gray dark:text-light-gray">{item.statement}</p> <div className="flex space-x-3"> <button onClick={() => handleAnswer(item.id, true)} className={`text-xs px-3 py-1 rounded border transition-colors ${answers[item.id] === true ? 'bg-teal/80 text-white border-teal' : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500'}`}> True </button> <button onClick={() => handleAnswer(item.id, false)} className={`text-xs px-3 py-1 rounded border transition-colors ${answers[item.id] === false ? 'bg-coral/80 text-white border-coral' : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500'}`}> False </button> </div> {showAllFeedback && feedback[item.id] === 'incorrect' && ( <p className="text-xs mt-2 text-red-700 dark:text-coral"> <strong className="font-semibold">Explanation:</strong> {item.explanation} (Correct: {item.isTrue ? 'True' : 'False'}) </p> )} {showAllFeedback && feedback[item.id] === 'correct' && ( <p className="text-xs mt-2 text-green-700 dark:text-mint font-semibold">Correct!</p> )} {showAllFeedback && feedback[item.id] === null && ( <p className="text-xs mt-2 text-gray-500 italic">Not answered.</p> )} </div> ))} </div> <div className="mt-4 flex justify-center space-x-4"> <button onClick={checkAllAnswers} className="text-xs bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors">Check All</button> <button onClick={resetExercise} className="text-xs bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-inter font-semibold py-1 px-3 rounded transition-colors">Reset</button> </div>
        </div>
    );
}

// Atom Economy Calculator Component
function AtomEconomyCalculator({ reactants, products }: AtomEconomyCalcProps) {
    const totalReactantMass = reactants.reduce((sum, r) => sum + r.coeff * r.molarMass, 0);
    const desiredProductMass = products.reduce((sum, p) => sum + (p.isDesired ? p.coeff * p.molarMass : 0), 0);
    const atomEconomy = (totalReactantMass > 0) ? (desiredProductMass / totalReactantMass) * 100 : 0;
    const reactantString = reactants.map(r => `${r.coeff > 1 ? r.coeff : ''}${r.formula}`).join(' + ');
    const productString = products.map(p => `${p.coeff > 1 ? p.coeff : ''}${p.formula}`).join(' + ');
    const reactionString = `${reactantString} \\rightarrow ${productString}`;

    return (
        <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md font-inter">
            {/* ... JSX structure from previous correct version ... */}
             <h4 className="text-lg font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Atom Economy Calculator</h4> <p className="text-xs mb-2">Reaction:</p> <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded mb-3 text-center text-sm overflow-x-auto"> <BlockMath math={reactionString} /> </div> <p className="text-xs mb-1">Total Mass of Reactants = {totalReactantMass.toFixed(2)} g/mol</p> <p className="text-xs mb-3">Total Mass of Desired Product(s) = {desiredProductMass.toFixed(2)} g/mol</p> <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 rounded shadow-inner text-center"> <p className="text-md font-semibold font-inter text-dark-gray dark:text-light-gray"> Atom Economy ≈ <span className="font-bold text-teal dark:text-mint"> {isFinite(atomEconomy) ? atomEconomy.toFixed(1) : "N/A"}% </span> </p> </div> <p className="text-xs italic text-center mt-2 text-gray-500 dark:text-gray-400"> (Higher % means more reactant atoms end up in the desired product, less waste.) </p>
        </div>
    );
}

// Simulation Panel Component (iframe + external link)
function SimulationPanel({ title, description, embedUrl, externalUrl }: {title: string, description: string, embedUrl?: string, externalUrl: string}) {
   return (
       <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
         <h3 className="text-xl font-semibold font-inter mb-3 text-center">{title}</h3>
         <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">{description}</p>
          {/* Button moved above iframe */}
         <div className="text-center mb-3">
             <a href={externalUrl} target="_blank" rel="noopener noreferrer"
                className="inline-block text-xs bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors"
                title={`Open ${title} in new tab`}>
                Open Simulation in New Tab ↗
             </a>
         </div>
         <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
             {embedUrl ? ( <iframe src={embedUrl} className='absolute top-0 left-0 w-full h-full' allowFullScreen sandbox="allow-scripts allow-same-origin" title={title}><p className="text-light-gray text-center pt-10">Loading Simulation...</p></iframe> ) : ( <div className="absolute inset-0 flex items-center justify-center bg-gray-700"><span className="text-light-gray font-inter font-semibold p-4 text-center">Live simulation embed not available for this source. Use link above.</span></div> )}
         </div>
       </div>
   );
 }


// --- Page Specific Data ---
const quizQuestions: QuizQuestionData[] = [
    // ... (Original questions seem relevant)
      { question: "What is the primary goal of Green Chemistry?", options: ["Making chemistry cheaper", "Reducing or eliminating the use and generation of hazardous substances", "Synthesizing only organic compounds", "Speeding up all chemical reactions"], correctAnswer: 1, hint: "It focuses on sustainability and minimizing negative environmental/health impacts." },
     { question: "Reducing the number of steps in a chemical synthesis (like the ibuprofen example) primarily addresses which Green Chemistry principle?", options: ["Use of Renewable Feedstock", "Atom Economy", "Prevention (of waste)", "Design for Degradation"], correctAnswer: 2, hint: "Fewer steps often mean less intermediate waste and better overall efficiency." },
     { question: "Atom Economy calculates the efficiency of a reaction based on:", options: ["Reaction speed", "Energy consumed", "How many reactant atoms are incorporated into the desired product(s)", "The cost of reactants"], correctAnswer: 2, hint: "It measures how well atoms are conserved in the final product, ignoring byproducts." },
     { question: "Replacing a toxic organic solvent used in dry cleaning with liquid CO₂ is an example of which Green Chemistry principle?", options: ["Atom Economy", "Safer Solvents and Auxiliaries", "Use of Renewable Feedstock", "Catalysis"], correctAnswer: 1, hint: "It substitutes a hazardous substance with a safer alternative." },
     { question: "Designing a pesticide that breaks down quickly into harmless substances in the soil after its use aligns with which principle?", options: ["Prevention", "Atom Economy", "Design for Degradation", "Real-time Analysis"], correctAnswer: 2, hint: "This principle aims to prevent persistent pollutants." },
     { question: "Using catalysts instead of stoichiometric reagents (which are consumed in the reaction) is preferred in Green Chemistry primarily because catalysts:", options: ["Are usually cheaper", "Can often enable reactions with higher atom economy, lower energy use, and less waste", "Are always derived from renewable resources", "Make reactions non-reversible"], correctAnswer: 1, hint: "Catalysts increase efficiency and selectivity, reducing waste and energy needs (Principle 9)." },
     { question: "Developing chemical processes that run efficiently at room temperature and pressure relates directly to which Green Chemistry principle?", options: ["Safer Chemicals", "Design for Energy Efficiency", "Reduce Derivatives", "Inherently Safer Chemistry"], correctAnswer: 1, hint: "Minimizing energy input (heating, pressure) reduces environmental and economic costs." },
     { question: "Using plant-based materials (biomass) instead of petroleum to synthesize chemicals is an example of applying which principle?", options: ["Atom Economy", "Less Hazardous Synthesis", "Use of Renewable Feedstock", "Design for Degradation"], correctAnswer: 2, hint: "This shifts reliance from finite fossil fuels to replenishable resources." },
     { question: "The first principle of Green Chemistry, 'Prevention', emphasizes that it's better to:", options: ["Treat waste chemically", "Incinerate waste", "Prevent waste from being generated in the first place", "Recycle waste materials"], correctAnswer: 2, hint: "Avoiding waste creation is the most fundamental green approach." },
     { question: "Implementing sensors to monitor a reaction as it happens to detect and prevent byproduct formation relates to which principle?", options: ["Catalysis", "Atom Economy", "Real-time Analysis for Pollution Prevention", "Safer Solvents"], correctAnswer: 2, hint: "In-process monitoring allows for control and minimization of undesired outcomes." }
];

const trueFalseStatements: TrueFalseStatement[] = [
    // ... (Original statements are good)
    { id: 1, statement: "Green chemistry aims to completely stop all chemical manufacturing.", isTrue: false, explanation: "No, it aims to make chemical manufacturing sustainable and environmentally benign, not eliminate it." },
    { id: 2, statement: "A reaction with 100% yield always has 100% atom economy.", isTrue: false, explanation: "Yield measures how much product is actually obtained vs. theoretical max. Atom economy measures how many reactant atoms end up in the desired product vs. byproducts. You can have 100% yield but poor atom economy if many byproducts are formed." },
    { id: 3, statement: "Using water as a solvent is always considered 'green'.", isTrue: false, explanation: "While often safer than many organic solvents, using large amounts of water can still have environmental impacts (energy for purification, potential contamination). The 'greenness' depends on the specific context and alternatives." },
    { id: 4, statement: "Designing biodegradable products is a key aspect of Green Chemistry.", isTrue: true, explanation: "This aligns with the 'Design for Degradation' principle, preventing persistent pollution." },
    { id: 5, statement: "Green Chemistry often leads to processes that are less profitable.", isTrue: false, explanation: "Often, greener processes are more efficient (less waste, less energy, fewer steps), which can lead to increased profitability in the long run, despite potential initial investment." }
];

// Data for Atom Economy Example
const atomEconomyExample: AtomEconomyCalcProps = {
    reactants: [ { formula: 'Fe_2O_3', coeff: 1, molarMass: 159.69 }, { formula: 'CO', coeff: 3, molarMass: 28.01 } ],
    products: [ { formula: 'Fe', coeff: 2, molarMass: 55.845, isDesired: true }, { formula: 'CO_2', coeff: 3, molarMass: 44.01, isDesired: false } ]
};

// --- KaTeX Constants ---
const katex_CO2 = 'CO_2'; const katex_H2O = 'H_2O'; const katex_O2 = 'O_2';


// --- Main Page Component ---
const GreenChemistryPage = () => {
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // --- Quiz Handlers ---
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => { /* ... */ };
  const handleSubmit = () => { /* ... */ };
  const resetQuiz = () => { /* ... */ }

  // --- Component Render ---
   return (
    <div className="bg-off-white text-dark-gray dark:bg-deep-navy dark:text-light-gray min-h-screen font-lora">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
             <h1 className="text-4xl lg:text-5xl font-bold font-playfair mb-8 lg:mb-12 text-center">
                 Unit 5.3: Green Chemistry & Cleaner Production
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">
                    {/* Section: Need for Greener Chemistry */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2"> The Need for Greener Chemistry </h2>
                         <p className="leading-relaxed"> Modern society relies heavily on chemical products... but traditional manufacturing often consumes vast resources, generates hazardous waste, and releases pollutants... </p>
                          {/* Inline Visualization/Analogy */}
                           <div className="my-4 p-3 bg-gray-100 dark:bg-gray-800 border-l-4 border-coral dark:border-gold rounded shadow-sm">
                                <p className="font-semibold font-inter text-sm text-coral dark:text-gold">Think About It:</p>
                               <p className="text-sm font-inter text-dark-gray dark:text-light-gray mt-1">Consider your phone or computer. What materials went into making it? Where did they come from? What happens when it's discarded? Green chemistry encourages thinking about this entire lifecycle.</p>
                           </div>
                         <p className="mt-3 leading-relaxed"> Recognizing these challenges... <strong className="text-teal dark:text-teal font-semibold">Green Chemistry</strong> focuses on designing chemical products and processes that are environmentally benign and sustainable...</p>
                    </section>

                    {/* Section: What is Green Chemistry */}
                    <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2"> What is Green Chemistry? </h2>
                           {/* ... text ... */}
                           <p className="leading-relaxed"> It asks chemists and engineers to consider the environmental impact at every stage...</p>
                           {/* Visualization Point */}
                           <div className="mt-4 p-3 bg-yellow-100 dark:bg-soft-yellow/20 border-l-4 border-yellow-500 dark:border-soft-yellow rounded"> <p className="font-semibold font-inter text-sm text-yellow-800 dark:text-soft-yellow">Visualize This:</p> <p className="text-sm font-inter text-dark-gray dark:text-light-gray mt-1">Think of green chemistry as building with LEGOs but aiming to use *all* the starting bricks in the final structure (high atom economy), using non-toxic bricks (safer chemicals), using less energy to snap them together, and designing the final structure so it can be easily taken apart or biodegrade afterwards.</p> </div>
                           <p className="mt-3 leading-relaxed"> Examples include finding safer alternatives... (like using liquid <InlineMath math={katex_CO2}/> for dry cleaning) or redesigning syntheses to be more efficient... (like the improved ibuprofen process)...</p>
                           {/* Embed Video within text flow */}
                           <div className="my-6">
                               <YouTubeEmbed videoId="pUAkJNeTce0" title="Video: Introduction to Green Chemistry Principles"/>
                            </div>
                           <p className="leading-relaxed"> Often, greener processes are also more economically viable in the long term.</p>
                     </section>

                     {/* Section: 12 Principles */}
                     <section>
                            <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2"> The 12 Principles of Green Chemistry </h2>
                            <p className="leading-relaxed mb-3"> Anastas and Warner outlined twelve guiding principles:</p>
                            {/* More engaging display - maybe grid or cards? Simple list for now */}
                            <ol className="list-decimal list-outside ml-6 space-y-2 font-inter text-sm">
                                {/* List items */}
                                <li><strong className="text-coral dark:text-gold">Prevention:</strong> Avoid waste &gt Treat waste.</li>
                               <li><strong className="text-coral dark:text-gold">Atom Economy:</strong> Maximize reactant atoms in product.</li>
                               {/* ... other principles ... */}
                               <li><strong className="text-coral dark:text-gold">Safer Chemistry for Accidents:</strong> Minimize potential for fires, explosions, releases.</li>
                            </ol>
                            {/* Interactive Element: True/False Check on Principles */}
                             <TrueFalseExercise title="Principle Check: True or False?" statements={trueFalseStatements} />
                     </section>

                     {/* Section: Goals & Atom Economy */}
                      <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2"> Goals & Atom Economy </h2>
                            {/* ... text ... */}
                            <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Atom Economy</h3>
                           <p className="leading-relaxed"> This metric quantifies efficiency...</p>
                            <BlockMath math={`\\% \\text{ Atom Economy} = \\frac{\\text{Molar mass of desired product(s)}}{\\text{Sum of molar masses of all reactants}} \\times 100\\%`}/>
                             {/* Interactive Element: Atom Economy Calculator Inline */}
                            <div className="my-6">
                                <AtomEconomyCalculator reactants={atomEconomyExample.reactants} products={atomEconomyExample.products}/>
                             </div>
                            <p className="leading-relaxed mt-2"> A higher atom economy means less waste is generated...</p>
                      </section>

                     {/* Study Tips Section */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2"> Study & Visualization Tips </h2>
                           {/* ... Study tips list ... */}
                     </section>
                </article>

                {/* Right Column (Consolidated Interactive Elements) */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                      {/* Panel 1: Examples Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <YouTubeEmbed videoId="A-kFzjs500E" title="Video: Examples of Green Chemistry in Action"/>
                       </div>

                       {/* Panel 2: Principle Checks */}
                       <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Principle Application Check</h3>
                            <MiniCheckQuestion
                               question={`Replacing a hazardous solvent with water or supercritical CO₂ primarily addresses which Green Chemistry principle?`}
                               correctAnswer="Principle 5: Safer Solvents and Auxiliaries."
                               explanation="This principle focuses on minimizing or eliminating the use of toxic or environmentally harmful solvents."
                           />
                            <MiniCheckQuestion
                               question="Developing a reaction that uses a highly selective catalyst to avoid unwanted byproducts directly supports which TWO principles?"
                               correctAnswer="Principle 2 (Atom Economy) and Principle 9 (Catalysis)."
                               explanation="Catalysts (Principle 9) improve selectivity, meaning more reactants form the desired product and fewer form byproducts, thus improving Atom Economy (Principle 2) and often preventing waste (Principle 1)."
                           />
                       </div>

                       {/* Panel 3: Renewable Feedstock Check */}
                         <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Feedstock & Degradation Check</h3>
                           <MiniCheckQuestion
                               question="Using plant-derived sugars instead of petroleum to make plastics addresses which principle?"
                               correctAnswer="Principle 7: Use of Renewable Feedstock."
                               explanation="Plant sugars are renewable, while petroleum is a finite, non-renewable resource."
                           />
                            <MiniCheckQuestion
                               question="If the resulting plant-based plastic is also designed to biodegrade easily in a compost environment, which additional principle does this address?"
                               correctAnswer="Principle 10: Design for Degradation."
                               explanation="This ensures the product doesn't persist as waste after its useful life."
                           />
                       </div>

                       {/* Panel 4: Simulation Placeholder/Link */}
                       <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore Further</h3>
                          <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Explore Green Chemistry resources and tools:</p>
                           <div className="text-center space-y-2">
                                <a href="https://www.acs.org/greenchemistry.html" target="_blank" rel="noopener noreferrer" className="inline-block text-xs bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors" title="ACS Green Chemistry"> ACS Green Chemistry Institute ↗ </a>
                                <br/>
                                 {/* Link to an Atom Economy Calculator Tool if found */}
                                 <a href="https://example.com/atom-economy-calculator" target="_blank" rel="noopener noreferrer" className="inline-block text-xs bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors" title="Online Atom Economy Calculator"> Online Atom Economy Tool (Example) ↗ </a>
                           </div>
                       </div>
                 </aside>
            </div>

             {/* Quiz Button */}
             <div className='flex justify-center items-center mt-12 lg:mt-16'> <button onClick={() => setShowQuiz(true)} className="w-full sm:w-1/2 lg:w-1/3 bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-3 px-6 rounded-lg transition-colors text-lg shadow-md" > Test Your Green Chemistry Knowledge! </button> </div>
        </main>

         {/* Quiz Modal */}
         {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 {/* Close Button */}
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 {/* Modal Title */}
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Green Chemistry Quiz</h2>
                 {/* Questions Area */}
                 <div className="space-y-6 font-inter">
                  {quizQuestions.map((q, index) => (
                    <QuizQuestion
                      key={index}
                      // questionNumber={index + 1} // Uncomment if needed and QuizQuestion supports it
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
                 {/* Buttons: Submit / Close */}
                 <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                     {!showResults ? (
                         <button onClick={handleSubmit} className="w-full sm:w-auto bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-bold font-inter py-2 px-6 rounded transition-colors disabled:opacity-50" disabled={selectedAnswers.includes(null)}>
                             Submit Answers
                         </button>
                     ) : <div/>} {/* Placeholder div to maintain layout */}
                     <button onClick={resetQuiz} className="w-full sm:w-auto bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-2 px-6 rounded transition-colors">
                         Close Quiz
                     </button>
                 </div>
                 {/* Results Display */}
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
GreenChemistryPage.displayName = 'GreenChemistryPage';

// Export default
export default GreenChemistryPage;
'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, ChangeEvent, Fragment } from 'react'; // Added Fragment
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

// Interactive Process Flow Component (Simplified)
interface ProcessStep {
    name: string;
    details: string; // Could include reactants, conditions, products
    icon?: string; // Optional icon (e.g., furnace, reactor, condenser) - Requires icon library
}

function ProcessFlow({ title, steps }: { title: string, steps: ProcessStep[] }) {
    return (
        <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md font-inter">
            <h4 className="text-lg font-semibold font-inter mb-3 text-center text-blue-700 dark:text-blue-300">{title}</h4>
            <div className="flex flex-col sm:flex-row sm:space-x-2 items-stretch justify-center overflow-x-auto py-2">
                {steps.map((step, index) => (
                    <Fragment key={index}>
                        <div className="flex-shrink-0 w-full sm:w-auto flex flex-col items-center mb-2 sm:mb-0">
                             {/* Icon Placeholder */}
                            {/* <div className="text-2xl mb-1">{step.icon || '⚙️'}</div> */}
                            <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700 shadow-sm text-center max-w-[150px]">
                                <p className="text-xs font-semibold">{step.name}</p>
                                <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">{step.details}</p>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                          <>
                            <div className="self-center mx-1 text-xl font-bold text-gray-400 dark:text-gray-500 hidden sm:block">→</div>
                            <div className="self-center my-1 text-xl font-bold text-gray-400 dark:text-gray-500 sm:hidden">↓</div>
                          </>
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
}


// --- Reusable Components (Styled as per design system - Copied from previous) ---

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
    const handleReveal = () => { setRevealed(true); };
    const handleHide = () => { setRevealed(false); setSelectedOption(null); setIsCorrect(null); }

  return (
    <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md">
      <p className="font-medium text-sm mb-3 font-inter text-dark-gray dark:text-light-gray">{question}</p>
      {options && options.length > 0 && !revealed && (
         <div className="space-y-2 mb-3">
              {options.map((option, index) => (
                  <button key={index} onClick={() => handleOptionSelect(index)} className={`block w-full text-left text-sm p-2 rounded border font-inter transition-colors ${selectedOption === index ? (isCorrect ? 'bg-mint/30 border-teal' : 'bg-coral/30 border-red-500') : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'} text-dark-gray dark:text-light-gray`} > {`${String.fromCharCode(65 + index)}. ${option}`} </button>
              ))}
          </div>
      )}
      {!options && !revealed && (<button onClick={handleReveal} className="text-xs bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors"> Check Answer </button>)}
      {revealed && (<div className="text-xs space-y-1 font-inter border-t border-gray-300 dark:border-gray-600 pt-2 mt-2"> {options && isCorrect !== null && (<p className={`font-semibold ${isCorrect ? 'text-teal dark:text-mint' : 'text-coral dark:text-gold'}`}> {isCorrect ? 'Correct!' : 'Incorrect.'} </p>)} <p className="text-dark-gray dark:text-light-gray"><strong className="text-teal dark:text-mint">Answer:</strong> {correctAnswer}</p> <p className="text-dark-gray dark:text-light-gray"><strong className="text-gray-600 dark:text-gray-400">Explanation:</strong> {explanation}</p> <button onClick={handleHide} className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 font-inter"> Hide/Reset </button> </div>)}
    </div>
  );
}


// --- Page Specific Data ---
// *** EXPANDED QUIZ QUESTIONS for Manufacturing ***
const quizQuestions = [
  { question: "What is the Haber-Bosch process primarily used to manufacture?", options: ["Sulfuric Acid", "Nitric Acid", "Ammonia (NH₃)", "Urea"], correctAnswer: 2, hint: "This process combines Nitrogen and Hydrogen under high pressure and temperature." },
  { question: "Which element acts as the catalyst in the Haber-Bosch process for ammonia synthesis?", options: ["Platinum (Pt)", "Vanadium Pentoxide (V₂O₅)", "Iron (Fe)", "Nickel (Ni)"], correctAnswer: 2, hint: "Iron catalysts are used to speed up the reaction between N₂ and H₂." },
  { question: "The Ostwald process starts with ammonia (NH₃) and ultimately produces which acid?", options: ["Sulfuric Acid (H₂SO₄)", "Hydrochloric Acid (HCl)", "Nitric Acid (HNO₃)", "Acetic Acid (CH₃COOH)"], correctAnswer: 2, hint: "It involves the catalytic oxidation of ammonia." },
  { question: "What is the key intermediate gas formed during the Ostwald process (after the first step)?", options: ["Nitrogen Dioxide (NO₂)", "Nitrogen Monoxide (NO)", "Dinitrogen Tetroxide (N₂O₄)", "Ammonia (NH₃)"], correctAnswer: 1, hint: "Ammonia is first oxidized to NO over a catalyst." },
  { question: "Urea (CO(NH₂)₂) is a widely used fertilizer primarily because of its high content of which element?", options: ["Phosphorus", "Potassium", "Carbon", "Nitrogen"], correctAnswer: 3, hint: "Urea has the chemical formula CO(NH₂)₂, indicating a high percentage of Nitrogen by mass." },
  { question: "Which process is used for the industrial manufacture of sulfuric acid (H₂SO₄)?", options: ["Haber-Bosch Process", "Ostwald Process", "Contact Process", "Solvay Process"], correctAnswer: 2, hint: "This process involves the catalytic oxidation of SO₂ to SO₃." },
  { question: "What is the catalyst typically used in the Contact process to convert SO₂ to SO₃?", options: ["Iron (Fe)", "Platinum (Pt)", "Vanadium Pentoxide (V₂O₅)", "Nickel (Ni)"], correctAnswer: 2, hint: "V₂O₅ is the standard catalyst for this crucial step." },
  { question: "What is 'oleum' or 'fuming sulfuric acid'?", options: ["Pure SO₃ gas", "A solution of SO₃ dissolved in concentrated H₂SO₄ (H₂S₂O₇)", "Dilute sulfuric acid", "Sulfur dissolved in water"], correctAnswer: 1, hint: "Absorbing SO₃ into existing H₂SO₄ forms oleum, which is then diluted." },
  { question: "Organochlorine pesticides are known for being:", options: ["Readily biodegradable", "Soluble in water", "Persistent in the environment and accumulating in fatty tissues", "Non-toxic to insects"], correctAnswer: 2, hint: "Their persistence led to environmental concerns and bans (e.g., DDT)." },
  { question: "Sodium Carbonate (Na₂CO₃), also known as washing soda, is produced industrially mainly via the:", options: ["Haber-Bosch Process", "Contact Process", "Ostwald Process", "Solvay Process"], correctAnswer: 3, hint: "The Solvay process uses ammonia, brine, and limestone." },
  { question: "Sodium Hydroxide (NaOH), or caustic soda, is a major co-product of which industrial process?", options: ["Contact Process", "Haber-Bosch Process", "Chlor-Alkali Process (Electrolysis of Brine)", "Ostwald Process"], correctAnswer: 2, hint: "Electrolysis of NaCl solution yields NaOH, Cl₂, and H₂." }
];

// --- KaTeX String Constants ---
const katex_NH3 = 'NH_3'; const katex_H2O = 'H_2O'; const katex_NH4_plus = 'NH_4^+'; const katex_OH_minus = 'OH^-';
const katex_NH3_diss = `${katex_NH3} + ${katex_H2O} \\rightleftharpoons ${katex_NH4_plus} + ${katex_OH_minus}`;
const katex_NH4Cl = 'NH_4Cl'; const katex_CaOH2 = 'Ca(OH)_2'; const katex_CaCl2 = 'CaCl_2';
const katex_NH3_lab = `2${katex_NH4Cl} + ${katex_CaOH2} \\rightarrow ${katex_CaCl2} + 2${katex_H2O} + 2${katex_NH3}(g)`;
const katex_N2 = 'N_2'; const katex_H2 = 'H_2';
const katex_HaberBosch = `${katex_N2}(g) + 3${katex_H2}(g) \\xrightarrow[\\text{Fe catalyst}]{\\text{High P, T}} 2${katex_NH3}(g)`;
const katex_HNO3 = 'HNO_3'; const katex_O2 = 'O_2'; const katex_NO = 'NO'; const katex_NO2 = 'NO_2';
const katex_Ostwald1 = `4${katex_NH3}(g) + 5${katex_O2}(g) \\xrightarrow{\\text{Pt/Rh catalyst}} 4${katex_NO}(g) + 6${katex_H2O}(g)`;
const katex_Ostwald2 = `2${katex_NO}(g) + ${katex_O2}(g) \\rightarrow 2${katex_NO2}(g)`;
const katex_Ostwald3 = `3${katex_NO2}(g) + ${katex_H2O}(l) \\rightarrow 2${katex_HNO3}(aq) + ${katex_NO}(g)`;
const katex_Urea = 'CO(NH_2)_2';
const katex_DAP = '(NH_4)_2HPO_4';
const katex_H2SO4 = 'H_2SO_4'; const katex_S = 'S(s)'; const katex_SO2 = 'SO_2(g)'; const katex_SO3 = 'SO_3(g)';
const katex_V2O5 = 'V_2O_5'; const katex_H2S2O7 = 'H_2S_2O_7(l)'; // Oleum
const katex_Contact1 = `${katex_S} + ${katex_O2} \\rightarrow ${katex_SO2}`;
const katex_Contact2 = `2${katex_SO2} + ${katex_O2} \\rightleftharpoons[\\text{${katex_V2O5}}]{\\text{400-500°C}} 2${katex_SO3}`;
const katex_Contact3 = `${katex_SO3} + ${katex_H2SO4}(\\text{conc.}) \\rightarrow ${katex_H2S2O7}`;
const katex_Contact4 = `${katex_H2S2O7} + ${katex_H2O} \\rightarrow 2${katex_H2SO4}(\\text{conc.})`;
const katex_Na2CO3 = 'Na_2CO_3';
const katex_NaOH = 'NaOH';


// Process Flow Data
const haberBoschSteps: ProcessStep[] = [
    { name: "Reactant Prep", details: "Obtain N₂ (air) & H₂ (methane/steam reforming or electrolysis)", icon: "💨" },
    { name: "Compression", details: "Compress N₂/H₂ mixture (15-25 MPa)", icon: "🔧" },
    { name: "Reaction", details: "Pass over Fe catalyst (300-500°C)", icon: "🔥" },
    { name: "Condensation", details: "Cool mixture to liquefy NH₃", icon: "❄️" },
    { name: "Recycling", details: "Unreacted N₂/H₂ recycled back to reactor", icon: "♻️" }
];

const ostwaldSteps: ProcessStep[] = [
     { name: "NH₃ Oxidation", details: "React NH₃ + O₂ over Pt/Rh catalyst (~850°C)", icon: "🔥"},
     { name: "NO Oxidation", details: "React NO + O₂ (air) to form NO₂", icon: "💨"},
     { name: "Absorption", details: "Bubble NO₂ into H₂O to form HNO₃ and recycle NO", icon: "💧"}
];

const contactSteps: ProcessStep[] = [
    { name: "SO₂ Production", details: "Burn S or roast sulfide ores", icon: "🔥"},
    { name: "SO₂ Oxidation", details: "React SO₂ + O₂ over V₂O₅ catalyst (400-500°C)", icon: "⚙️"},
    { name: "SO₃ Absorption", details: "Absorb SO₃ into conc. H₂SO₄ to form Oleum (H₂S₂O₇)", icon: "💧"},
    { name: "Dilution", details: "Carefully dilute Oleum with H₂O to desired H₂SO₄ conc.", icon: "💧"}
];


// --- Main Page Component ---
const ManufacturingValuableProductsPage = () => { // Renamed component
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // --- Quiz Handlers ---
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => { if (showResults) return; const newSelectedAnswers = [...selectedAnswers]; newSelectedAnswers[questionIndex] = answerIndex; setSelectedAnswers(newSelectedAnswers); };
  const handleSubmit = () => { const correctCount = selectedAnswers.reduce((count: number, answer: number | null, index: number) => { if (answer === null) return count; return count + (answer === quizQuestions[index].correctAnswer ? 1 : 0); }, 0); setScore(correctCount); setShowResults(true); };
  const resetQuiz = () => { setShowQuiz(false); setShowResults(false); setSelectedAnswers(new Array(quizQuestions.length).fill(null)); setScore(0); }

  // --- Component Render ---
   return (
    <div className="bg-off-white text-dark-gray dark:bg-deep-navy dark:text-light-gray min-h-screen font-lora">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
            <h1 className="text-4xl lg:text-5xl font-bold font-playfair mb-8 lg:mb-12 text-center">
                 3.3 Manufacturing of Valuable Chemical Products {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction */}
                    <section>
                          <p className="leading-relaxed text-lg">
                            Chemical industries design processes to convert raw materials into desired products efficiently and safely, using a series of physical and chemical treatment steps. This section explores the manufacturing of several vital chemicals.
                         </p>
                    </section>

                    {/* Ammonia (NH3) */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Ammonia (<InlineMath math={katex_NH3}/>)
                         </h2>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Properties & Uses</h3>
                          <p className="leading-relaxed text-sm">Colorless, pungent gas; lighter than air; very soluble in water forming ammonium hydroxide (weak base: <InlineMath math={katex_NH3_diss}/>). Common conc. 28-30%. Uses: Fertilizer production (primary!), nitric acid feedstock (Ostwald process), cleaning agents, explosives precursor, soda ash production.</p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Production (Haber-Bosch Process)</h3>
                           <p className="leading-relaxed text-sm">Combines Nitrogen (<InlineMath math={katex_N2}/> from air) and Hydrogen (<InlineMath math={katex_H2}/> from natural gas/steam reforming) under specific conditions:</p>
                           <ul className="list-disc list-outside ml-6 space-y-1 text-xs mt-1">
                              <li>High Pressure (15–25 MPa / 150-250 atm)</li>
                              <li>Moderate Temperature (300–550°C - compromise between rate and equilibrium)</li>
                              <li>Iron (Fe) based Catalyst</li>
                           </ul>
                            <BlockMath math={katex_HaberBosch}/>
                            <p className="leading-relaxed text-sm mt-1">Ammonia is liquefied by cooling, and unreacted gases are recycled for high overall yield (~97%).</p>
                    </section>

                     {/* Nitric Acid (HNO3) */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Nitric Acid (<InlineMath math={katex_HNO3}/>)
                         </h2>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Properties & Uses</h3>
                          <p className="leading-relaxed text-sm">Pure acid is a colorless liquid; turns brown on exposure to light due to decomposition (<InlineMath math={`4HNO_3 \\rightarrow 4NO_2 + O_2 + 2H_2O`}/>). Strong oxidizing acid. Uses: Fertilizer production (ammonium nitrate), explosives, production of dyes and polymers, metal treatment.</p>
                         <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Production (Ostwald Process)</h3>
                          <p className="leading-relaxed text-sm">A three-step process starting with ammonia:</p>
                           <ol className="list-decimal list-outside ml-6 space-y-1 text-xs mt-1">
                              <li>Catalytic oxidation of NH₃ to NO: <BlockMath math={katex_Ostwald1}/> (Pt/Rh catalyst, ~850°C)</li>
                              <li>Oxidation of NO to NO₂ with air: <BlockMath math={katex_Ostwald2}/></li>
                              <li>Absorption of NO₂ in water: <BlockMath math={katex_Ostwald3}/> (NO is recycled)</li>
                           </ol>
                     </section>

                      {/* Fertilizers */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Fertilizers
                         </h2>
                          <p className="leading-relaxed">
                             Chemicals providing essential nutrients (Nitrogen, Phosphorus, Potassium - NPK) for plant growth. Key Nitrogen fertilizers derived from ammonia:
                              <ul className="list-disc list-outside ml-6 space-y-1 mt-2 text-sm">
                                 <li><strong className="font-semibold">Anhydrous Ammonia (<InlineMath math={katex_NH3}/>):</strong> Highest N content, injected into soil.</li>
                                 <li><strong className="font-semibold">Urea (<InlineMath math={katex_Urea}/>):</strong> High N solid, very soluble, widely used.</li>
                                 <li><strong className="font-semibold">Ammonium Nitrate (<InlineMath math="NH_4NO_3"/>):</strong> Solid/solution, also used in explosives.</li>
                                  <li><strong className="font-semibold">Diammonium Phosphate (DAP, <InlineMath math={katex_DAP}/>):</strong> Provides both Nitrogen and Phosphorus.</li>
                              </ul>
                          </p>
                     </section>

                      {/* Sulfuric Acid (H2SO4) */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Sulfuric Acid (<InlineMath math={katex_H2SO4}/>)
                         </h2>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Properties & Uses</h3>
                           <p className="leading-relaxed text-sm">Colorless, oily, heavy liquid; highly corrosive; strong acid; powerful dehydrating and oxidizing agent. Mixes with water exothermically (add acid to water!). Uses: Fertilizer production (superphosphates), chemical synthesis, petroleum refining, metal processing (pickling), battery acid.</p>
                         <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Production (Contact Process)</h3>
                          <p className="leading-relaxed text-sm">Involves catalytic oxidation of SO₂ to SO₃:</p>
                            <ol className="list-decimal list-outside ml-6 space-y-1 text-xs mt-1">
                                <li>Produce SO₂ (burn S or roast ores): <BlockMath math={katex_Contact1}/></li>
                                <li>Catalytically oxidize SO₂ to SO₃: <BlockMath math={katex_Contact2}/> (V₂O₅ catalyst, 400-500°C)</li>
                                <li>Absorb SO₃ in conc. H₂SO₄ to form Oleum: <BlockMath math={katex_Contact3}/></li>
                                <li>Dilute Oleum with water: <BlockMath math={katex_Contact4}/></li>
                           </ol>
                     </section>

                     {/* Pesticides & Herbicides */}
                      <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Pesticides & Herbicides
                         </h2>
                          <p className="leading-relaxed">
                             <strong className="text-teal dark:text-teal font-semibold">Pesticides</strong> control insects, fungi, rodents, etc. <strong className="text-teal dark:text-teal font-semibold">Herbicides</strong> control weeds. Classified by target or chemical structure (Organochlorines, Organophosphates, Carbamates, Pyrethroids). Their use involves balancing crop protection benefits against environmental and health risks (toxicity, persistence, bioaccumulation).
                          </p>
                     </section>

                     {/* Sodium Carbonate & Hydroxide */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Sodium Carbonate & Sodium Hydroxide
                         </h2>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Sodium Carbonate (<InlineMath math={katex_Na2CO3}/>)</h3>
                           <p className="leading-relaxed text-sm">Washing soda. White crystalline solid. Uses: Glass manufacturing, detergents, water softening, chemical synthesis. Produced mainly by the Solvay process.</p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Sodium Hydroxide (<InlineMath math={katex_NaOH}/>)</h3>
                            <p className="leading-relaxed text-sm">Caustic soda. White crystalline solid. Highly corrosive strong base. Uses: Soap/detergent production, paper manufacturing, aluminum production, chemical processing, water treatment. Produced mainly by the Chlor-Alkali process (electrolysis of brine).</p>
                     </section>

                      {/* Study Tips Section */}
                      <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Visualization Tips
                         </h2>
                         <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                             <li><strong className="font-semibold">Focus on Key Processes:</strong> Understand the main steps, reactants, products, and conditions (catalyst, T, P) for Haber-Bosch (NH₃), Ostwald (HNO₃), and Contact (H₂SO₄). Use the interactive flowcharts.</li>
                              <li><strong className="font-semibold">Link Chemicals & Uses:</strong> Create a mind map or table connecting major chemicals (NH₃, HNO₃, H₂SO₄, Urea, NaOH, Na₂CO₃) to their primary industrial applications (fertilizers, explosives, detergents, glass, etc.).</li>
                              <li><strong className="font-semibold">Visualize Reactions:</strong> Look at the balanced chemical equations provided. Identify reactants, products, and catalysts. Imagine the atoms rearranging.</li>
                               <li><strong className="font-semibold">Relate Properties to Uses:</strong> Why is NH₃ used in fertilizers (high N content)? Why is H₂SO₄ a good dehydrating agent? Why is NaOH 'caustic'?</li>
                               <li><strong className="font-semibold">Mnemonics for Processes:</strong> Create simple reminders (e.g., "Haber needs Iron Pressure"; "Ostwald starts with Ammonia, makes Nitric"; "Contact makes Sulfuric with SO₃").</li>
                                <li><strong className="font-semibold">Flowchart Summary:</strong> Draw simplified box-and-arrow diagrams for the Haber, Ostwald, and Contact processes yourself to reinforce the sequence of steps.</li>
                           </ul>
                     </section>

                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                      {/* Panel 1: Haber-Bosch Process */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="NWhZ77Qm5y4" title="Video: The Haber-Bosch Process (Ammonia)"/>
                          <ProcessFlow title="Haber-Bosch Process Flow" steps={haberBoschSteps} />
                           <MiniCheckQuestion
                              question="What are the two main raw materials for the Haber-Bosch process?"
                              correctAnswer="Nitrogen (N₂) and Hydrogen (H₂)."
                              explanation="Nitrogen is obtained from air, and hydrogen is typically produced from natural gas (methane)."
                          />
                      </div>

                    {/* Panel 2: Ostwald Process */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="FU938YCSfoI" title="Video: The Ostwald Process (Nitric Acid)"/>
                         <ProcessFlow title="Ostwald Process Flow" steps={ostwaldSteps} />
                          <MiniCheckQuestion
                             question="What is the starting material for the Ostwald process, and what catalyst is used in the first step?"
                             correctAnswer="Starting material: Ammonia (NH₃). Catalyst: Platinum/Rhodium (Pt/Rh)."
                             explanation="Ammonia is oxidized over a precious metal catalyst at high temperature to form NO."
                         />
                     </div>

                    {/* Panel 3: Contact Process */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="jdGYgk5jHqg" title="Video: The Contact Process (Sulfuric Acid)"/>
                          <ProcessFlow title="Contact Process Flow" steps={contactSteps} />
                          <MiniCheckQuestion
                             question="Why isn't SO₃ directly dissolved in water to make H₂SO₄ in the Contact Process?"
                             correctAnswer="The reaction is extremely exothermic and forms a hazardous, hard-to-handle mist of H₂SO₄."
                             explanation="Dissolving SO₃ in existing concentrated H₂SO₄ to form oleum, followed by controlled dilution with water, is a safer and more efficient method."
                         />
                     </div>

                      {/* Panel 4: Fertilizers Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="cY0wAAmVkMY" title="Video: How Fertilizers are Made (Focus on NPK)"/>
                         <MiniCheckQuestion
                             question="What are the three primary macronutrients typically provided by chemical fertilizers?"
                             correctAnswer="Nitrogen (N), Phosphorus (P), and Potassium (K)."
                             explanation="These are often represented by the N-P-K ratio on fertilizer bags."
                         />
                     </div>

                      {/* Panel 5: Pesticides Overview (Could be text/image based) */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Pesticides & Herbicides</h3>
                         <p className="text-sm font-inter text-dark-gray dark:text-light-gray mb-3">Chemicals used to control pests (insects, fungi, weeds). Different chemical classes (organochlorines, organophosphates, etc.) have varying toxicities and environmental persistence.</p>
                         {/* Placeholder for an image or more detailed info */}
                          <div className="text-center text-xs italic text-gray-400">[Placeholder: Image comparing pesticide types or persistence]</div>
                          <MiniCheckQuestion
                             question="What is a major environmental concern associated with older organochlorine pesticides like DDT?"
                             correctAnswer="Their persistence in the environment and bioaccumulation in food chains."
                             explanation="They break down very slowly and build up in organisms, potentially harming wildlife higher up the food chain."
                         />
                     </div>

                 </aside>
            </div>

             {/* Quiz Button */}
            <div className='flex justify-center items-center mt-12 lg:mt-16'>
                <button
                    onClick={() => setShowQuiz(true)}
                    className="w-full sm:w-1/2 lg:w-1/3 bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-3 px-6 rounded-lg transition-colors text-lg shadow-md"
                >
                    Test Your Manufacturing Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Chemical Manufacturing Quiz</h2>
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
ManufacturingValuableProductsPage.displayName = 'ManufacturingValuableProductsPage';

export default ManufacturingValuableProductsPage;
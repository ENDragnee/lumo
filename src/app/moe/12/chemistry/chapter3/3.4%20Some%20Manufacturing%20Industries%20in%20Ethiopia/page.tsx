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

interface ProcessStep {
    name: string;
    details: string;
    icon?: string;
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

// Interactive Process Flow Component
function ProcessFlow({ title, steps }: { title: string, steps: ProcessStep[] }) {
    return (
        <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md font-inter">
            <h4 className="text-lg font-semibold font-inter mb-3 text-center text-blue-700 dark:text-blue-300">{title}</h4>
             <div className="flex flex-col sm:flex-row sm:space-x-2 items-stretch justify-center overflow-x-auto py-2">
                {steps.map((step, index) => (
                    <Fragment key={index}>
                        <div className="flex-shrink-0 w-full sm:w-auto flex flex-col items-center mb-2 sm:mb-0">
                            {/* Icon Placeholder - Could use an SVG library or unicode */}
                            <div className="text-2xl mb-1">{step.icon || '🏭'}</div>
                            <div className="p-2 border rounded bg-gray-100 dark:bg-gray-700 shadow-sm text-center max-w-[150px]">
                                <p className="text-xs font-semibold">{step.name}</p>
                                <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">{step.details}</p>
                            </div>
                        </div>
                         {index < steps.length - 1 && (
                             <><div className="self-center mx-1 text-xl font-bold text-gray-400 dark:text-gray-500 hidden sm:block">→</div><div className="self-center my-1 text-xl font-bold text-gray-400 dark:text-gray-500 sm:hidden">↓</div></>
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
}

// --- Page Specific Data ---
const quizQuestions = [
  { question: "What is the primary raw material for common glass production?", options: ["Limestone", "Soda Ash", "Sand (Silica - SiO₂)", "Boron Oxide"], correctAnswer: 2, hint: "Silica sand is the main component, forming the network structure of glass." },
  { question: "Soda-lime glass, used for windows and bottles, is made from silica, limestone, and what other major ingredient?", options: ["Borax", "Potash", "Soda Ash (Sodium Carbonate - Na₂CO₃)", "Lead Oxide"], correctAnswer: 2, hint: "Soda ash acts as a flux to lower the melting point of silica." },
  { question: "What is the purpose of 'annealing' in glass manufacturing?", options: ["Melting the raw materials", "Shaping the molten glass", "Removing internal stresses by controlled cooling", "Adding color to the glass"], correctAnswer: 2, hint: "Slow cooling prevents the glass from becoming brittle due to internal stress." },
  { question: "Clay, feldspar, and talc are common raw materials for which industry?", options: ["Cement", "Ceramics", "Glass", "Paper"], correctAnswer: 1, hint: "These minerals form the basis of pottery, tiles, porcelain, etc." },
  { question: "The decomposition of limestone (CaCO₃ → CaO + CO₂) is a key high-temperature reaction in the production of:", options: ["Glass", "Ceramics", "Cement", "Sugar"], correctAnswer: 2, hint: "Heating limestone in a kiln produces lime (CaO), a primary component of cement clinker." },
  { question: "What biological process, often using yeast, is central to the production of ethanol for beverages?", options: ["Photosynthesis", "Respiration", "Fermentation", "Distillation"], correctAnswer: 2, hint: "Yeast converts sugars (from grains, fruits, sugarcane) into ethanol and carbon dioxide." },
  { question: "Saponification, the reaction of fats/oils with a strong base (like NaOH), is the core process for making:", options: ["Detergents", "Soap", "Plastics", "Fertilizers"], correctAnswer: 1, hint: "This reaction produces glycerol and the sodium/potassium salts of fatty acids, which are soap." },
  { question: "Synthetic detergents often work better than soap in hard water because:", options: ["They are more acidic", "They do not form insoluble precipitates with Ca²⁺ and Mg²⁺ ions", "They are made from natural oils", "They require higher temperatures"], correctAnswer: 1, hint: "Soap forms 'scum' with hard water ions, while detergents typically remain soluble." },
  { question: "The Kraft process and Sulphite process are methods used in which industry to separate cellulose fibers from lignin?", options: ["Textile", "Leather Tanning", "Pulp and Paper", "Food Preservation"], correctAnswer: 2, hint: "These chemical pulping methods break down the lignin binder in wood." },
  { question: "Tanning converts raw animal hides into durable leather primarily by:", options: ["Drying the skin completely", "Coating the skin with plastic", "Chemically stabilizing the protein (collagen) structure of the skin", "Removing all the hair"], correctAnswer: 2, hint: "Tanning agents (like chromium salts or vegetable tannins) cross-link the collagen fibers." }
];

// --- KaTeX String Constants ---
const katex_SiO2 = 'SiO_2';
const katex_Na2CO3 = 'Na_2CO_3';
const katex_CaCO3 = 'CaCO_3';
const katex_CaO = 'CaO';
const katex_CO2 = 'CO_2';
const katex_Cement_Rxn = `${katex_CaCO3}(s) \\xrightarrow{\\Delta} ${katex_CaO}(s) + ${katex_CO2}(g)`;
const katex_Sugar = 'C_{12}H_{22}O_{11}'; // Sucrose
const katex_Glucose = 'C_6H_{12}O_6';
const katex_Ethanol = 'C_2H_5OH';
const katex_Ferment1 = `${katex_Sugar} \\xrightarrow{\\text{invertase}} ${katex_Glucose}(\\text{glucose}) + ${katex_Glucose}(\\text{fructose})`;
const katex_Ferment2 = `${katex_Glucose} \\xrightarrow{\\text{zymase}} 2 ${katex_Ethanol} + 2 ${katex_CO2}`;
const katex_Ethene = 'CH_2=CH_2';
const katex_H2O_g = 'H_2O(g)';
const katex_Ethanol_g = 'CH_3CH_2OH(g)';
const katex_Hydration = `${katex_Ethene} + ${katex_H2O_g} \\xrightarrow{H_3PO_4 \\text{ catalyst}} ${katex_Ethanol_g}`;
const katex_NaOH = 'NaOH'; const katex_Na2S = 'Na_2S';
const katex_Kraft = `${katex_CaCO3} + ${katex_NaOH} + ${katex_Na2S} \\rightarrow \\text{Pulp}`; // Simplified Kraft
const katex_NaLarylSulfate = 'C_{12}H_{25}O{-}SO_2{-}ONa';
const katex_DodecylAlc = 'C_{12}H_{25}OH'; const katex_H2SO4 = 'H_2SO_4';
const katex_DetergentSynth = `${katex_DodecylAlc} + ${katex_H2SO4} \\rightarrow C_{12}H_{25}OSO_3H \\xrightarrow{NaOH} ${katex_NaLarylSulfate}`; // Simplified

// Process Flow Data
const glassSteps: ProcessStep[] = [ { name: "Batch Prep", details: "Mix Sand, Soda Ash, Limestone", icon: "🧱" }, { name: "Melting", details: "Heat to ~1600°C", icon: "🔥" }, { name: "Forming", details: "Shape molten glass (blowing, molding)", icon: "🏺" }, { name: "Annealing", details: "Controlled slow cooling", icon: "❄️" }, { name: "Inspection", details: "Quality checks", icon: "✔️" } ];
const cementSteps: ProcessStep[] = [ { name: "Raw Material Prep", details: "Grind Limestone, Clay, Silica, etc.", icon: "🧱" }, { name: "Kiln Heating", details: "Heat mix (~1450°C) to form Clinker", icon: "🔥" }, { name: "Clinker Grinding", details: "Grind clinker with Gypsum", icon: "⚙️" }, { name: "Packaging", details: "Store and dispatch cement powder", icon: "📦" } ];
const sugarSteps: ProcessStep[] = [ { name: "Harvest & Prep", details: "Collect, wash, shred cane", icon: "🌿" }, { name: "Juicing", details: "Extract juice", icon: "💧" }, { name: "Clarifying", details: "Purify juice (lime, CO₂)", icon: "🧪" }, { name: "Evaporation", details: "Boil to thick syrup", icon: "🔥" }, { name: "Crystallization", details: "Form sugar crystals", icon: "💎" }, { name: "Refining", details: "Remove impurities (optional)", icon: "✨" } ];
const paperSteps: ProcessStep[] = [ { name: "Harvesting", details: "Cut & transport trees", icon: "🌲" }, { name: "Preparation", details: "Debark, chip wood", icon: "🔪" }, { name: "Pulping", details: "Separate fibers (mechanical/chemical)", icon: "🧪" }, { name: "Bleaching", details: "Whiten pulp (optional)", icon: "⚪" }, { name: "Papermaking", details: "Form & dry sheets on screen", icon: "📜" } ];
const tanningSteps: ProcessStep[] = [ { name: "Preparation", details: "Cure, Soak, Flesh, Dehair, Delime", icon: "🧼" }, { name: "Tanning", details: "Stabilize proteins (Vegetable/Mineral)", icon: "🧪" }, { name: "Crusting", details: "Dye, Finish, Soften", icon: "🎨" } ];


// --- Main Page Component ---
const ManufacturingIndustriesEthiopiaPage = () => { // Renamed component
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
                3.4 Some Manufacturing Industries in Ethiopia {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Overview of Key Industries
                         </h2>
                         <p className="leading-relaxed">
                            While Ethiopia's chemical industry is developing, several established manufacturing sectors utilize chemical principles and processes to produce essential goods. This section looks at the basics of glass, ceramics, cement, sugar, paper, leather, food preservation, beverage, and soap/detergent manufacturing, highlighting the chemistry involved.
                         </p>
                         <p className="text-sm italic leading-relaxed text-gray-600 dark:text-gray-400 mt-2">
                            (Ethiopia has over 2000 manufacturing industries, contributing to its growing economy).
                         </p>
                    </section>

                    {/* Glass Production */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Glass Production
                         </h2>
                         <p className="leading-relaxed">
                             Glass is an amorphous (non-crystalline) solid, valued for its transparency, inertness, and recyclability. Its main component is <strong className="text-teal dark:text-teal">silica</strong> (<InlineMath math={katex_SiO2}/>, from sand).
                         </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Types & Production Steps</h3>
                          <p className="leading-relaxed text-sm">
                            <strong className="text-coral dark:text-gold">Soda-lime glass</strong> (most common, ~90%) uses silica, soda ash (<InlineMath math={katex_Na2CO3}/>), and limestone (<InlineMath math={katex_CaCO3}/>). <strong className="text-coral dark:text-gold">Borosilicate glass</strong> (Pyrex) adds boron oxide for heat/chemical resistance. <strong className="text-coral dark:text-gold">Quartz glass</strong> is pure fused silica.
                          </p>
                          <p className="leading-relaxed text-sm mt-2">Production involves mixing raw materials (batch), melting at high temperatures (~1600°C), forming (shaping), annealing (slow cooling to remove stress), and inspection.</p>
                    </section>

                     {/* Ceramics Production */}
                    <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Ceramics Production
                         </h2>
                          <p className="leading-relaxed">
                             <strong className="text-teal dark:text-teal font-semibold">Ceramics</strong> are inorganic, non-metallic solids made by heating materials (often clays, talc, feldspar) to high temperatures. Examples include pottery, tiles, porcelain, bricks, and advanced technical ceramics.
                          </p>
                           <p className="leading-relaxed text-sm mt-2">Manufacturing typically involves shaping the powdered raw material (moulding) and then heating it (firing or sintering) to bond the particles and achieve desired density and strength (densification).</p>
                     </section>

                    {/* Cement Production */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Cement Production
                         </h2>
                          <p className="leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Cement</strong> is a binder that sets and hardens to adhere to other materials, forming concrete when mixed with aggregates (sand, gravel) and water. Raw materials include limestone (<InlineMath math={katex_CaCO3}/>), clay, silica sand, and gypsum.
                          </p>
                           <p className="leading-relaxed text-sm mt-2">Key chemical reaction: High-temperature heating (<InlineMath math="\approx 1450^\circ C"/>) in a kiln decomposes limestone and facilitates reactions to form complex calcium silicates and aluminates (collectively called <strong className="text-coral dark:text-gold">clinker</strong>).</p>
                            <BlockMath math={katex_Cement_Rxn} />
                            <p className="leading-relaxed text-sm mt-1">The clinker is then ground with gypsum to produce cement powder. Setting involves complex hydration reactions when mixed with water.</p>
                     </section>

                    {/* Sugar Production */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Sugar Production
                         </h2>
                           <p className="leading-relaxed">
                             Primarily involves extracting and purifying <strong className="text-teal dark:text-teal font-semibold">sucrose</strong> (<InlineMath math={katex_Sugar}/>) from sugarcane or sugar beets.
                           </p>
                            <p className="leading-relaxed text-sm mt-2">Key steps include harvesting, cleaning, crushing/shredding to extract juice, clarifying the juice (removing impurities), evaporating water to concentrate the syrup, crystallizing the sucrose, separating crystals (raw sugar), and potentially further refining.</p>
                     </section>

                    {/* Pulp and Paper */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Pulp and Paper Manufacturing
                         </h2>
                         <p className="leading-relaxed">
                           <strong className="text-teal dark:text-teal font-semibold">Paper</strong> is primarily made from <strong className="text-coral dark:text-gold">cellulose</strong> fibers, typically derived from wood pulp. Wood also contains lignin (a binder), resins, and oils that need to be separated.
                         </p>
                         <p className="leading-relaxed text-sm mt-2">The process involves harvesting trees, preparing wood chips, <strong className="text-teal dark:text-teal">pulping</strong> (separating fibers mechanically or chemically - e.g., Kraft or Sulphite processes that break down lignin), bleaching (optional whitening), and papermaking (forming sheets from pulp slurry and drying).</p>
                         <p className="text-xs italic leading-relaxed text-gray-600 dark:text-gray-400 mt-1">Kraft process example (highly simplified): Uses NaOH, Na₂S.</p>
                     </section>

                     {/* Leather Tanning */}
                    <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Leather Tanning
                         </h2>
                         <p className="leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Tanning</strong> converts raw animal hides/skins (prone to decay) into durable, stable <strong className="text-coral dark:text-gold">leather</strong> by chemically altering the protein structure (collagen).
                         </p>
                         <p className="leading-relaxed text-sm mt-2">Includes preparatory steps (curing, soaking, cleaning, hair removal, deliming) followed by the tanning step using agents like vegetable tannins (from bark) or mineral salts (commonly chromium salts). Final 'crusting' involves dyeing and finishing.</p>
                     </section>

                      {/* Food Preservation */}
                      <section>
                            <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Food Preservation & Packaging
                         </h2>
                          <p className="leading-relaxed">
                             Methods to prevent spoilage and extend shelf life by inhibiting microbial growth and chemical changes.
                              <ul className="list-disc list-outside ml-6 space-y-1 mt-2 text-sm">
                                  <li><strong className="font-semibold">Physical Methods:</strong> Freezing, Freeze-drying (sublimation of water), Vacuum-packing (removes oxygen).</li>
                                   <li><strong className="font-semibold">Chemical Preservatives (Inorganic):</strong> Salt (NaCl - lowers water activity), Nitrites/Nitrates (meat curing), Sulfites (SO₂, SO₃²⁻ - antimicrobial, anti-browning in wines, fruits).</li>
                                   <li><strong className="font-semibold">Chemical Preservatives (Organic):</strong> Acids and their salts like Lactic, Propionic (baked goods, cheese), Acetic (vinegar, pickles), Sorbic, Benzoic (acidic foods), Parabens.</li>
                               </ul>
                          </p>
                      </section>

                    {/* Ethanol & Beverages */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Ethanol Production & Beverages
                         </h2>
                         <p className="leading-relaxed">
                           Ethanol (<InlineMath math={katex_Ethanol}/>) is produced primarily by <strong className="text-teal dark:text-teal font-semibold">fermentation</strong> of carbohydrates (sugars, starches) using yeast enzymes (invertase, zymase).
                         </p>
                          <BlockMath math={katex_Ferment1} />
                           <BlockMath math={katex_Ferment2} />
                          <p className="leading-relaxed text-sm mt-1">Also produced synthetically by <strong className="text-teal dark:text-teal">catalytic hydration of ethene</strong> (from petroleum).</p>
                           <BlockMath math={katex_Hydration} />
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Beverages</h3>
                           <p className="leading-relaxed text-sm">Beer (fermented barley/hops, ~2-6% alcohol), Wine (fermented grapes/fruit, ~10-16% alcohol). Liquors (whisky, rum) use distillation after fermentation to increase alcohol content (30-45%+).</p>
                           <p className="leading-relaxed text-sm mt-1">Local Ethiopian beverages like 'Araki' also involve fermentation and distillation.</p>
                     </section>

                     {/* Soaps and Detergents */}
                     <section>
                            <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Soaps and Detergents
                         </h2>
                          <p className="leading-relaxed">
                             <strong className="text-teal dark:text-teal font-semibold">Soaps</strong> are sodium or potassium salts of long-chain fatty acids, made by <strong className="text-coral dark:text-gold">saponification</strong> (hydrolysis of fats/oils with strong base like NaOH). They act as surfactants, cleaning by emulsifying grease/dirt.
                          </p>
                           <p className="mt-3 leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Synthetic Detergents</strong> (e.g., sodium lauryl sulfate, <InlineMath math={katex_NaLarylSulfate}/>) are similar surfactants but often work better in hard water (don't form scum). They are synthesized from petroleum derivatives or alcohols.
                           </p>
                           <BlockMath math={katex_DetergentSynth} />
                           <p className="mt-3 leading-relaxed text-sm"><strong className="font-semibold">Dry Cleaning</strong> uses non-aqueous solvents (like tetrachloroethylene) to dissolve grease without water.</p>
                     </section>

                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                      {/* Panel 1: Industrial Chem Overview */}
                       <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <YouTubeEmbed videoId="uP7y430shwU" title="Video: What is Industrial Chemistry?"/>
                       </div>

                      {/* Panel 2: Glass Production Flowchart */}
                      <ProcessFlow title="Glass Production Steps" steps={glassSteps} />

                     {/* Panel 3: Cement Production Flowchart & Video */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="ARIej9kmets" title="Video: How Cement is Made"/>
                           <ProcessFlow title="Cement Production Steps" steps={cementSteps} />
                          <MiniCheckQuestion
                             question="What is the main chemical transformation happening inside the high-temperature cement kiln?"
                             correctAnswer="Decomposition of limestone (CaCO₃) and reaction with other materials to form calcium silicates/aluminates (clinker)."
                             explanation="The heat drives off CO₂ from limestone and causes complex solid-state reactions to form the binding compounds of cement."
                         />
                      </div>

                      {/* Panel 4: Sugar Production Flowchart */}
                       <ProcessFlow title="Sugar Production Steps (from Cane)" steps={sugarSteps} />

                     {/* Panel 5: Paper Production Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="KIaWJ08jMWI" title="Video: How Paper is Made (Pulping)"/>
                           <MiniCheckQuestion
                             question="What is the purpose of the pulping process (e.g., Kraft process) in papermaking?"
                             correctAnswer="To break down and remove lignin, the substance that binds cellulose fibers together in wood."
                             explanation="Separating the cellulose fibers is necessary to form a uniform paper sheet."
                         />
                     </div>

                      {/* Panel 6: Tanning Flowchart */}
                     <ProcessFlow title="Leather Tanning Steps" steps={tanningSteps} />

                      {/* Panel 7: Food Preservation Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="IL899-BUH78" title="Video: Food Preservation Techniques Overview"/>
                      </div>

                      {/* Panel 8: Ethanol/Fermentation Mini Question */}
                       <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Fermentation Check</h3>
                           <MiniCheckQuestion
                              question="What type of microorganism and enzyme are crucial for converting sugars like glucose into ethanol during fermentation?"
                              correctAnswer="Yeast, containing the enzyme zymase."
                              explanation="Yeast performs anaerobic respiration (fermentation), using zymase to catalyze the conversion of glucose to ethanol and CO₂."
                          />
                       </div>

                     {/* Panel 9: Soap vs Detergent Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Cleaning Agents Check</h3>
                           <MiniCheckQuestion
                              question="What is the main advantage of synthetic detergents over traditional soaps, especially in certain water conditions?"
                              correctAnswer="Detergents generally do not form insoluble precipitates ('scum') with hard water ions (like Ca²⁺, Mg²⁺), remaining effective cleaners."
                              explanation="Soap anions react with hard water ions to form insoluble salts, reducing cleaning power."
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
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Manufacturing Industries Quiz</h2>
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
ManufacturingIndustriesEthiopiaPage.displayName = 'ManufacturingIndustriesEthiopiaPage';

export default ManufacturingIndustriesEthiopiaPage;
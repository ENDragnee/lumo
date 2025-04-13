'use client';

import { useState, ChangeEvent, Fragment } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
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

interface CycleProcessStep {
  name: string; // e.g., "Photosynthesis", "Respiration", "Nitrification"
  description: string; // Brief description
  equation?: string; // Optional KaTeX equation string
  // CHANGE: Allow a single location OR an array of locations
  location: 'Atmosphere' | 'Hydrosphere' | 'Lithosphere' | 'Biosphere' | ('Atmosphere' | 'Hydrosphere' | 'Lithosphere' | 'Biosphere')[];
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

    const handleOptionSelect = (index: number) => { if (revealed) return; setSelectedOption(index); const correct = index === correctOptionIndex; setIsCorrect(correct); setRevealed(true); if (onSelectOption) { onSelectOption(correct); } };
    const handleReveal = () => { setRevealed(true); };
    const handleHide = () => { setRevealed(false); setSelectedOption(null); setIsCorrect(null); }

  return (
    <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md">
      <p className="font-medium text-sm mb-3 font-inter text-dark-gray dark:text-light-gray">{question}</p>
      {options && options.length > 0 && !revealed && ( <div className="space-y-2 mb-3"> {options.map((option, index) => ( <button key={index} onClick={() => handleOptionSelect(index)} className={`block w-full text-left text-sm p-2 rounded border font-inter transition-colors ${selectedOption === index ? (isCorrect ? 'bg-mint/30 border-teal' : 'bg-coral/30 border-red-500') : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'} text-dark-gray dark:text-light-gray`} > {`${String.fromCharCode(65 + index)}. ${option}`} </button> ))} </div> )}
      {!options && !revealed && (<button onClick={handleReveal} className="text-xs bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors"> Check Answer </button>)}
      {revealed && (<div className="text-xs space-y-1 font-inter border-t border-gray-300 dark:border-gray-600 pt-2 mt-2"> {options && isCorrect !== null && (<p className={`font-semibold ${isCorrect ? 'text-teal dark:text-mint' : 'text-coral dark:text-gold'}`}> {isCorrect ? 'Correct!' : 'Incorrect.'} </p>)} <p className="text-dark-gray dark:text-light-gray"><strong className="text-teal dark:text-mint">Answer:</strong> {correctAnswer}</p> <p className="text-dark-gray dark:text-light-gray"><strong className="text-gray-600 dark:text-gray-400">Explanation:</strong> {explanation}</p> <button onClick={handleHide} className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 font-inter"> Hide/Reset </button> </div>)}
    </div>
  );
}

// True/False Interactive Exercise Component
function TrueFalseExercise({ title, statements }: { title: string, statements: TrueFalseStatement[] }) {
    const [answers, setAnswers] = useState<{ [key: number]: boolean | null }>({});
    const [feedback, setFeedback] = useState<{ [key: number]: 'correct' | 'incorrect' | null }>({});
    const [showAllFeedback, setShowAllFeedback] = useState(false);

    const handleAnswer = (id: number, answer: boolean) => { setAnswers(prev => ({ ...prev, [id]: answer })); setShowAllFeedback(false); };
    const checkAllAnswers = () => { const newFeedback: { [key: number]: 'correct' | 'incorrect' | null } = {}; statements.forEach(statement => { if (answers[statement.id] !== null && answers[statement.id] !== undefined) { newFeedback[statement.id] = (answers[statement.id] === statement.isTrue) ? 'correct' : 'incorrect'; } else { newFeedback[statement.id] = null; } }); setFeedback(newFeedback); setShowAllFeedback(true); };
    const resetExercise = () => { setAnswers({}); setFeedback({}); setShowAllFeedback(false); };

    return ( <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md font-inter"> <h4 className="text-lg font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">{title}</h4> <div className="space-y-4"> {statements.map((item) => ( <div key={item.id} className={`p-3 border rounded ${feedback[item.id] === 'correct' ? 'border-teal bg-mint/20' : feedback[item.id] === 'incorrect' ? 'border-red-500 bg-coral/20' : 'border-gray-300 dark:border-gray-600'}`}> <p className="text-sm mb-2 text-dark-gray dark:text-light-gray">{item.statement}</p> <div className="flex space-x-3"> <button onClick={() => handleAnswer(item.id, true)} className={`text-xs px-3 py-1 rounded border transition-colors ${answers[item.id] === true ? 'bg-teal/80 text-white border-teal' : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500'}`}> True </button> <button onClick={() => handleAnswer(item.id, false)} className={`text-xs px-3 py-1 rounded border transition-colors ${answers[item.id] === false ? 'bg-coral/80 text-white border-coral' : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500'}`}> False </button> </div> {showAllFeedback && feedback[item.id] === 'incorrect' && ( <p className="text-xs mt-2 text-red-700 dark:text-coral"> <strong className="font-semibold">Explanation:</strong> {item.explanation} (Correct answer was: {item.isTrue ? 'True' : 'False'}) </p> )} {showAllFeedback && feedback[item.id] === 'correct' && ( <p className="text-xs mt-2 text-green-700 dark:text-mint font-semibold">Correct!</p> )} {showAllFeedback && feedback[item.id] === null && ( <p className="text-xs mt-2 text-gray-500 italic">Not answered.</p> )} </div> ))} </div> <div className="mt-4 flex justify-center space-x-4"> <button onClick={checkAllAnswers} className="text-xs bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors">Check All</button> <button onClick={resetExercise} className="text-xs bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-inter font-semibold py-1 px-3 rounded transition-colors">Reset</button> </div> </div> );
}

// Interactive Biogeochemical Cycle Visualizer/Selector
// Interactive Biogeochemical Cycle Visualizer/Selector
function BiogeochemicalCycle({ cycles }: { cycles: { [key: string]: CycleProcessStep[] } }) {
  const cycleNames = Object.keys(cycles);
  const [selectedCycle, setSelectedCycle] = useState<string>(cycleNames[0]);

  // Helper function to display location(s)
  const displayLocation = (location: CycleProcessStep['location']): string => {
      if (Array.isArray(location)) {
          return location.join(' / '); // Join array elements with " / "
      }
      return location; // Return single string directly
  };

  return (
       <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md font-inter">
          <h4 className="text-lg font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Biogeochemical Cycle Steps</h4>
           <div className="mb-3">
              <label htmlFor="cycleSelect" className="block text-sm font-medium mb-1">Select Cycle:</label>
              <select
                  id="cycleSelect"
                  value={selectedCycle}
                  onChange={(e) => setSelectedCycle(e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-light-gray"
               >
                  {cycleNames.map(name => <option key={name} value={name}>{name}</option>)}
               </select>
           </div>
            <div className="space-y-3">
               {cycles[selectedCycle].map((step, index) => (
                   <div key={`${selectedCycle}-${index}`} className="p-2 border-l-4 dark:border-teal border-coral rounded bg-gray-50 dark:bg-gray-700">
                       {/* **FIXED**: Use displayLocation helper */}
                       <p className="text-sm font-semibold">{step.name} <span className="text-xs text-gray-500 dark:text-gray-400">({displayLocation(step.location)})</span></p>
                       <p className="text-xs mt-1">{step.description}</p>
                       {step.equation && (
                           <div className="text-center text-xs mt-1 overflow-x-auto">
                               <BlockMath math={step.equation}/>
                           </div>
                       )}
                   </div>
               ))}
           </div>
       </div>
  );
}

// --- Page Specific Data ---
const quizQuestions = [
    // ... (Original questions seem relevant, perhaps add more detail)
     { question: "Environmental chemistry primarily studies:", options: ["Synthesizing new plastics", "Chemical processes occurring in air, water, soil, and living organisms", "Geological formations", "Astronomical phenomena"], correctAnswer: 1, hint: "It focuses on the chemistry of natural environmental systems and human impact." },
     { question: "Burning coal containing sulfur mainly releases which gas, contributing to acid rain?", options: ["CO₂", "SO₂", "NO₂", "CH₄"], correctAnswer: 1, hint: "Sulfur oxides (SOx), primarily SO₂, are major precursors to acid rain." },
     { question: "What is the most abundant gas in Earth's atmosphere?", options: ["Oxygen (O₂)", "Argon (Ar)", "Carbon Dioxide (CO₂)", "Nitrogen (N₂)"], correctAnswer: 3, hint: "Nitrogen makes up about 78% of the air we breathe." },
     { question: "Chlorofluorocarbons (CFCs) contribute to ozone layer depletion by:", options: ["Reacting directly with oxygen", "Catalytically destroying ozone (O₃) molecules in the stratosphere", "Absorbing UV radiation", "Increasing atmospheric CO₂"], correctAnswer: 1, hint: "Chlorine radicals released from CFCs break down ozone." },
     { question: "The hydrosphere includes:", options: ["Only oceans and seas", "Only rivers and lakes", "All water on, under, and above the Earth's surface", "Only groundwater"], correctAnswer: 2, hint: "It encompasses oceans, lakes, rivers, groundwater, glaciers, and atmospheric water vapor." },
     { question: "Eutrophication in water bodies, characterized by excessive algae growth, is often caused by excess input of which nutrients?", options: ["Carbon and Oxygen", "Nitrogen (Nitrates) and Phosphorus (Phosphates)", "Sulfur and Chlorine", "Iron and Magnesium"], correctAnswer: 1, hint: "Runoff containing fertilizers (N and P) is a major cause." },
     { question: "Photosynthesis uses sunlight, water, and ______ to produce glucose and oxygen.", options: ["Nitrogen", "Sulfur Dioxide", "Carbon Dioxide", "Methane"], correctAnswer: 2, hint: "CO₂ is the carbon source for making glucose in photosynthesis." },
     { question: "The lithosphere primarily consists of:", options: ["Gases and water vapor", "Living organisms", "The Earth's crust and upper mantle (rocks and soil)", "The oceans"], correctAnswer: 2, hint: "It's the rigid, rocky outer part of the Earth." },
     { question: "Nitrogen fixation, a key step in the nitrogen cycle, converts:", options: ["Ammonia (NH₃) into Nitrates (NO₃⁻)", "Atmospheric Nitrogen gas (N₂) into ammonia (NH₃) or related compounds", "Nitrates (NO₃⁻) back into Nitrogen gas (N₂)", "Organic nitrogen into ammonia (NH₃)"], correctAnswer: 1, hint: "This process makes atmospheric nitrogen available to living organisms, often done by bacteria." },
     { question: "A 'sink' in environmental chemistry refers to:", options: ["A source of pollutants", "A laboratory apparatus", "A part of the environment that removes or stores a pollutant", "A type of chemical reaction"], correctAnswer: 2, hint: "Examples include oceans absorbing CO₂ or soil immobilizing heavy metals." }
];

const trueFalseStatements: TrueFalseStatement[] = [
    { id: 1, statement: "Environmental chemistry only studies man-made pollution.", isTrue: false, explanation: "It studies both natural chemical processes and the impact of human activities on the environment." },
    { id: 2, statement: "The atmosphere protects life on Earth by absorbing harmful UV radiation.", isTrue: true, explanation: "The ozone layer in the stratosphere is particularly important for absorbing most UV-B and UV-C radiation." },
    { id: 3, statement: "All water in the hydrosphere is freshwater.", isTrue: false, explanation: "Over 97% of Earth's water is saltwater in oceans; only a small fraction is freshwater." },
    { id: 4, statement: "The lithosphere is chemically inert and does not interact with other environmental spheres.", isTrue: false, explanation: "Chemical weathering of rocks (lithosphere) releases minerals into water (hydrosphere) and soil, and volcanic activity releases gases into the atmosphere." },
    { id: 5, statement: "The carbon cycle involves only biological processes like photosynthesis and respiration.", isTrue: false, explanation: "It also involves geological processes (rock formation, volcanic activity) and dissolution in oceans." },
    { id: 6, statement: "A pollutant and a contaminant are exactly the same thing.", isTrue: false, explanation: "A contaminant is a substance not naturally present, while a pollutant is a substance present at harmful concentrations (it could be natural or man-made)." }
];

// Data for Biogeochemical Cycles
const biogeochemicalCycles: { [key: string]: CycleProcessStep[] } = {
  "Carbon Cycle": [
      // **FIXED**: Use array for location spanning spheres
      { name: "Photosynthesis", description: "Plants use CO₂ + H₂O + sunlight → Glucose + O₂", equation: `6CO_2 + 6H_2O \\xrightarrow{Sunlight} C_6H_{12}O_6 + 6O_2`, location: ["Biosphere", "Atmosphere"] },
      { name: "Respiration", description: "Organisms break down glucose → CO₂ + H₂O + Energy", equation: `C_6H_{12}O_6 + 6O_2 \\rightarrow 6CO_2 + 6H_2O`, location: ["Biosphere", "Atmosphere"] },
      { name: "Decomposition", description: "Microbes break down organic matter, releasing CO₂", location: ["Biosphere", "Lithosphere"] },
      { name: "Combustion", description: "Burning fossil fuels or biomass releases CO₂", location: ["Lithosphere", "Atmosphere"] },
      { name: "Ocean Exchange", description: "CO₂ dissolves in and is released from oceans", location: ["Atmosphere", "Hydrosphere"] },
  ],
  "Nitrogen Cycle": [
      // **FIXED**: Use array for location spanning spheres
      { name: "Nitrogen Fixation", description: "N₂ gas converted to NH₃/NH₄⁺ by bacteria or lightning", equation: `N_2 \\rightarrow NH_3 / NH_4^+`, location: ["Atmosphere", "Biosphere", "Lithosphere"] },
      { name: "Nitrification", description: "NH₄⁺ oxidized to NO₂⁻ then NO₃⁻ by bacteria", equation: `NH_4^+ \\rightarrow NO_2^- \\rightarrow NO_3^-`, location: ["Lithosphere", "Biosphere"] }, // Primarily soil/water bacteria
      { name: "Assimilation", description: "Plants absorb NO₃⁻ or NH₄⁺ to make organic molecules", location: "Biosphere" }, // Primarily biosphere
      { name: "Ammonification", description: "Decomposers break down organic matter releasing NH₃/NH₄⁺", location: ["Biosphere", "Lithosphere"] },
      { name: "Denitrification", description: "Bacteria convert NO₃⁻ back to N₂ gas", equation: `NO_3^- \\rightarrow N_2`, location: ["Lithosphere", "Atmosphere"] }, // Soil/water to atmosphere
  ],
   "Sulfur Cycle": [
      { name: "Weathering", description: "Rocks release sulfate (SO₄²⁻)", location: "Lithosphere" },
      { name: "Assimilation", description: "Plants/microbes take up sulfate for proteins", location: "Biosphere" },
      { name: "Decomposition", description: "Organic sulfur converted back to inorganic forms (like H₂S)", location: ["Biosphere", "Lithosphere"] },
      // **FIXED**: Use array for location spanning spheres
      { name: "Oxidation (e.g., H₂S)", description: "Hydrogen sulfide oxidized to sulfate (SO₄²⁻)", equation: `H_2S + 2O_2 \\rightarrow SO_4^{2-} + 2H^+`, location: ["Atmosphere", "Hydrosphere"] }, // Occurs in both
      { name: "Reduction (e.g., SO₄²⁻)", description: "Sulfate reduced to sulfide (e.g., H₂S) under anaerobic conditions", equation: `SO_4^{2-} + \\text{Organic Matter} \\rightarrow H_2S + CO_2`, location: ["Hydrosphere", "Lithosphere"] }, // Sediments, waterlogged soil
      { name: "Volcanic Emission", description: "Volcanoes release SO₂", location: ["Lithosphere", "Atmosphere"] },
  ],
};

// --- KaTeX String Constants ---
const katex_SO2 = 'SO_2';
const katex_SO3 = 'SO_3';
const katex_H2SO4 = 'H_2SO_4';
const katex_N2 = 'N_2'; const katex_O2 = 'O_2'; const katex_CO2 = 'CO_2'; const katex_Ar='Ar';
const katex_NO = 'NO'; const katex_NO2 = 'NO_2';
const katex_UV = '\\text{UV}';
const katex_Ozone_Form = `2${katex_NO}(g) + ${katex_O2}(g) \\xrightarrow{${katex_UV}} 2${katex_NO2}(g)`;
const katex_CFC = 'CF_2Cl_2'; const katex_Cl = 'Cl'; const katex_O3 = 'O_3'; const katex_ClO = 'ClO';
const katex_CFC_Decomp = `${katex_CFC} + ${katex_UV} \\rightarrow CF_2Cl + ${katex_Cl}`;
const katex_Ozone_Depl = `${katex_Cl} + ${katex_O3} \\rightarrow ${katex_ClO} + ${katex_O2}`;
const katex_NH3 = 'NH_3'; const katex_NO3_minus = 'NO_3^-'; const katex_H_plus = 'H^+'; const katex_H2O = 'H_2O';
const katex_N_Oxidation = `2${katex_NH3} + 3${katex_O2} \\rightarrow 2${katex_NO3_minus} + 2${katex_H_plus} + 2${katex_H2O}`; // Simplified overall nitrification
const katex_FeCO3 = 'FeCO_3'; const katex_FeOH3 = 'Fe(OH)_3';
const katex_Mineral_Ox = `2${katex_FeCO3} + \\frac{1}{2} ${katex_O2} + 3${katex_H2O} \\xrightarrow{\\text{Bacteria}} 2${katex_FeOH3} + 2${katex_CO2}`;
const katex_Fe2O3 = 'Fe_2O_3';
const katex_Rust_Hydrate = `${katex_Fe2O3} + 3${katex_H2O} \\rightarrow ${katex_Fe2O3} \\cdot 3${katex_H2O}`;
const katex_Glucose = 'C_6H_{12}O_6';
const katex_Photosynthesis = `6${katex_CO2} + 6${katex_H2O} \\xrightarrow{\\text{Sunlight}} ${katex_Glucose} + 6${katex_O2}`;
const katex_Respiration = `${katex_Glucose} + 6${katex_O2} \\rightarrow 6${katex_CO2} + 6${katex_H2O} + \\text{Energy}`;
const katex_Methane = 'CH_4';
const katex_Methane_Comb = `${katex_Methane} + 2${katex_O2} \\rightarrow ${katex_CO2} + 2${katex_H2O} + \\text{Energy}`;
const katex_CH2O = 'CH_2O'; // Represents organic matter
const katex_NH4_plus = 'NH_4^+';
const katex_NO2_minus = 'NO_2^-';
const katex_N_Fixation = `${katex_N2} + 3${katex_CH2O} + 3${katex_H2O} + 4${katex_H_plus} \\rightarrow 3${katex_CO2} + 4${katex_NH4_plus}`;
const katex_Nitrification = `2${katex_O2} + ${katex_NH4_plus} \\rightarrow ${katex_NO3_minus} + 2${katex_H_plus} + ${katex_H2O}`; // Simplified
const katex_H2S = 'H_2S'; const katex_SO4_2minus = 'SO_4^{2-}';
const katex_S_Oxidation = `${katex_H2S} + 2{${katex_O2}} \\rightarrow ${katex_SO4_2minus} + 2${katex_H_plus}`; // Simplified H2S oxidation
const katex_S_Reduction = `${katex_SO4_2minus} + 2${katex_CH2O} + 2${katex_H_plus} \\rightarrow ${katex_H2S} + 2${katex_CO2} + 2{${katex_H2O}}`; // Corrected water


// --- Main Page Component ---
const EnvironmentalChemistryPage = () => { // Renamed component
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
                Unit 5: Environmental Chemistry {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             What is Environmental Chemistry?
                         </h2>
                         <p className="leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Environmental chemistry</strong> is the scientific study of chemical and biochemical phenomena that occur in natural places. It examines the sources, reactions, transport, effects, and fates of chemical species in the <strong className="text-coral dark:text-gold">air, water, soil, and living environments</strong>, and the impact of human activities on these processes.
                         </p>
                          <p className="mt-3 leading-relaxed">
                             Consider a pollutant like sulfur dioxide (<InlineMath math={katex_SO2}/>) released from burning coal. Environmental chemistry tracks its journey: formation (S + O₂ → SO₂), transport in the atmosphere, further reactions (SO₂ → SO₃ → H₂SO₄ forming acid rain), its effects on ecosystems (plants, lakes), and its ultimate fate or "sink" (e.g., neutralized in soil or water).
                          </p>
                    </section>

                    {/* Components of the Environment */}
                    <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             The Environmental Compartments
                         </h2>
                         <p className="leading-relaxed">
                            The environment is typically divided into four interconnected spheres:
                         </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2 text-sky-600 dark:text-sky-400">1. The Atmosphere</h3>
                           <p className="leading-relaxed text-sm">
                             The layer of gases surrounding Earth (~78% N₂, ~21% O₂, ~1% other gases like Ar, CO₂). It protects life by absorbing harmful UV radiation (ozone layer), regulates temperature, and provides essential gases (O₂, CO₂, N₂). Key atmospheric reactions include ozone formation/depletion and the oxidation of pollutants. Example reactions:
                           </p>
                            <BlockMath math={katex_Ozone_Form}/>
                            <BlockMath math={katex_Ozone_Depl}/>
                            <BlockMath math={katex_CFC_Decomp}/>

                          <h3 className="text-xl font-semibold font-playfair mt-6 mb-2 text-blue-600 dark:text-blue-400">2. The Hydrosphere</h3>
                           <p className="leading-relaxed text-sm">
                             All the water on Earth (oceans, lakes, rivers, groundwater, ice, vapor). Oceans are the largest reservoir. Water chemistry involves dissolved substances, pH, dissolved oxygen, and reactions like the oxidation of ammonia from pollution, which can lead to eutrophication if excess nutrients like nitrates are present.
                           </p>
                            <BlockMath math={katex_N_Oxidation}/>

                          <h3 className="text-xl font-semibold font-playfair mt-6 mb-2 text-yellow-700 dark:text-yellow-500">3. The Lithosphere</h3>
                           <p className="leading-relaxed text-sm">
                              The solid Earth: crust and upper mantle (rocks, soil, sediments). Source of minerals and fossil fuels. Chemistry involves weathering (chemical breakdown of rocks), soil formation, and microbial processes affecting mineral oxidation/reduction. Example: Bacterial oxidation of iron carbonate.
                           </p>
                             <BlockMath math={katex_Mineral_Ox}/>
                            <p className="leading-relaxed text-sm"> Example: Hydration of iron oxide (rusting).</p>
                             <BlockMath math={katex_Rust_Hydrate}/>

                           <h3 className="text-xl font-semibold font-playfair mt-6 mb-2 text-green-600 dark:text-green-400">4. The Biosphere</h3>
                            <p className="leading-relaxed text-sm">
                              The realm of life – all ecosystems and living organisms. Chemistry involves metabolic processes like photosynthesis (plants converting CO₂ and water to glucose and O₂) and respiration (organisms using glucose and O₂ to release energy, CO₂, and water).
                           </p>
                             <BlockMath math={katex_Photosynthesis}/>
                             <BlockMath math={katex_Respiration}/>
                      </section>

                       {/* Biogeochemical Cycles */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Biogeochemical Cycles
                         </h2>
                          <p className="leading-relaxed">
                             Essential elements (Carbon, Nitrogen, Oxygen, Phosphorus, Sulfur) and water cycle continuously through the different environmental compartments via physical, chemical, and biological processes. These <strong className="text-teal dark:text-teal font-semibold">biogeochemical cycles</strong> maintain the balance necessary for life. Key examples include:
                           </p>
                           <ul className="list-disc list-outside ml-6 space-y-1 mt-2 text-sm">
                               <li><strong className="font-semibold">Hydrologic Cycle:</strong> Evaporation, condensation, precipitation, runoff, groundwater flow.</li>
                               <li><strong className="font-semibold">Carbon Cycle:</strong> Photosynthesis, respiration, decomposition, combustion, ocean exchange.</li>
                               <li><strong className="font-semibold">Nitrogen Cycle:</strong> Fixation (N₂ → NH₃/NH₄⁺), nitrification (NH₄⁺ → NO₃⁻), assimilation, ammonification, denitrification (NO₃⁻ → N₂).</li>
                               <li><strong className="font-semibold">Oxygen Cycle:</strong> Closely linked to carbon cycle (photosynthesis produces O₂, respiration consumes O₂).</li>
                               <li><strong className="font-semibold">Phosphorus Cycle:</strong> Primarily geological; weathering releases phosphate, assimilated by plants, moves through food webs, returns via decomposition.</li>
                               <li><strong className="font-semibold">Sulfur Cycle:</strong> Involves weathering, volcanic emissions, biological processes (decomposition, assimilation), and atmospheric reactions (oxidation of H₂S/SO₂).</li>
                           </ul>
                            <p className="mt-3 leading-relaxed text-sm">Human activities (like burning fossil fuels, using fertilizers) can significantly disrupt the natural balance of these cycles.</p>
                     </section>


                    {/* Pollutants and Concepts */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Pollutants and Key Concepts
                         </h2>
                         <ul className="list-disc list-outside ml-6 space-y-2 mt-2 font-inter text-sm"> {/* UI Font */}
                             <li><strong className="font-semibold">Pollutant:</strong> Substance present at harmful concentrations due to human activity (e.g., SO₂, excess CO₂, heavy metals).</li>
                             <li><strong className="font-semibold">Contaminant:</strong> Substance not naturally present, introduced by humans; becomes a pollutant if harmful.</li>
                             <li><strong className="font-semibold">Sink:</strong> Environmental medium that accumulates or chemically transforms a pollutant (e.g., oceans for CO₂, soil for some pesticides).</li>
                             <li><strong className="font-semibold">Dissolved Oxygen (DO):</strong> Crucial for aquatic life; depleted by decomposition of organic waste.</li>
                             <li><strong className="font-semibold">Biological Oxygen Demand (BOD):</strong> Measure of oxygen needed by microbes to decompose organic matter in water; high BOD indicates pollution.</li>
                             <li><strong className="font-semibold">Threshold Limit Value (TLV):</strong> Permissible exposure limit for airborne toxic substances in the workplace.</li>
                         </ul>
                    </section>

                    {/* Study Tips Section */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Visualization Tips
                         </h2>
                         <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                              <li><strong className="font-semibold">Visualize the Spheres:</strong> Picture the Atmosphere (air), Hydrosphere (water), Lithosphere (rock/soil), and Biosphere (life) as distinct but interacting layers/regions.</li>
                              <li><strong className="font-semibold">Track a Pollutant:</strong> Follow the journey of SO₂ described: Coal (Lithosphere) → Burning → SO₂ (Atmosphere) → Acid Rain (Atmosphere/Hydrosphere) → Lake/Soil (Hydrosphere/Lithosphere/Biosphere effects).</li>
                               <li><strong className="font-semibold">Focus on Cycles:</strong> Use the interactive cycle viewer. For each cycle (Carbon, Nitrogen, etc.), identify the main reservoirs (where the element is stored) and the key processes (arrows) that move the element between reservoirs. Note key chemical transformations.</li>
                               <li><strong className="font-semibold">Key Reactions:</strong> Memorize the core equations for photosynthesis and respiration as they are central to Carbon and Oxygen cycles. Understand the basics of nitrogen fixation and denitrification.</li>
                               <li><strong className="font-semibold">Definitions Matter:</strong> Clearly distinguish Pollutant vs. Contaminant, DO vs. BOD, Sink vs. Source.</li>
                                <li><strong className="font-semibold">Connect Concepts:</strong> How does burning fossil fuels (Carbon Cycle) affect acid rain (Sulfur Cycle, Nitrogen Cycle) and climate change? How does fertilizer runoff (Nitrogen/Phosphorus Cycles) cause eutrophication (Hydrosphere/Biosphere)?</li>
                                <li><strong className="font-semibold">Use the Interactive Exercises:</strong> Test your understanding with the True/False statements and Mini-Questions.</li>
                           </ul>
                     </section>

                </article>

                {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                     {/* Panel 1: Environmental Chem Intro Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="0fNJsPL4D1M" title="Video: What is Environmental Chemistry?"/>
                     </div>

                     {/* Panel 2: Spheres of Earth Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="BnpF0ndXk-8" title="Video: Earth's Environmental Spheres"/>
                           <MiniCheckQuestion
                              question="Which sphere contains the oceans, rivers, lakes, and groundwater?"
                              correctAnswer="Hydrosphere"
                              explanation="Hydro- refers to water; this sphere encompasses all of Earth's water."
                          />
                     </div>

                     {/* Panel 3: Biogeochemical Cycles Interactive */}
                     <BiogeochemicalCycle cycles={biogeochemicalCycles}/>

                     {/* Panel 4: Cycles Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Cycle Check</h3>
                           <MiniCheckQuestion
                              question="Which biogeochemical cycle is most directly impacted by the burning of fossil fuels, leading to increased atmospheric concentrations?"
                              correctAnswer="The Carbon Cycle."
                              explanation="Fossil fuels are ancient stored carbon. Burning them releases large amounts of CO₂ into the atmosphere much faster than natural processes can remove it."
                          />
                      </div>


                     {/* Panel 5: True/False Exercise */}
                       <TrueFalseExercise title="Environmental Facts: True or False?" statements={trueFalseStatements} />


                      {/* Panel 6: Pollution Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="M7jolRzKIQk" title="Video: Air Pollution Explained"/> {/* Example pollution topic */}
                      </div>

                 </aside>
            </div>

             {/* Quiz Button */}
            <div className='flex justify-center items-center mt-12 lg:mt-16'>
                <button
                    onClick={() => setShowQuiz(true)}
                    className="w-full sm:w-1/2 lg:w-1/3 bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-3 px-6 rounded-lg transition-colors text-lg shadow-md"
                >
                    Test Your Environmental Chemistry Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Environmental Chemistry Quiz</h2>
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
EnvironmentalChemistryPage.displayName = 'EnvironmentalChemistryPage';

export default EnvironmentalChemistryPage;
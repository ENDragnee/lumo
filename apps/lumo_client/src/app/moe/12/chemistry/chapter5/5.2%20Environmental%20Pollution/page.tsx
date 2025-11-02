'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, ChangeEvent, Fragment } from 'react';
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

interface PollutionSourceItem {
    id: string;
    text: string; // e.g., "Burning Coal", "Fertilizer Runoff", "Plastic Waste"
    category: 'air' | 'water' | 'land'; // The type of pollution it primarily causes
}

interface PollutionCategoryTarget {
    id: 'air' | 'water' | 'land'; // Explicitly type the id
    text: string; // Display name
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

    return ( <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md font-inter"> <h4 className="text-lg font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">{title}</h4> <div className="space-y-4"> {statements.map((item) => ( <div key={item.id} className={`p-3 border rounded ${feedback[item.id] === 'correct' ? 'border-teal bg-mint/20' : feedback[item.id] === 'incorrect' ? 'border-red-500 bg-coral/20' : 'border-gray-300 dark:border-gray-600'}`}> <p className="text-sm mb-2 text-dark-gray dark:text-light-gray">{item.statement}</p> <div className="flex space-x-3"> <button onClick={() => handleAnswer(item.id, true)} className={`text-xs px-3 py-1 rounded border transition-colors ${answers[item.id] === true ? 'bg-teal/80 text-white border-teal' : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500'}`}> True </button> <button onClick={() => handleAnswer(item.id, false)} className={`text-xs px-3 py-1 rounded border transition-colors ${answers[item.id] === false ? 'bg-coral/80 text-white border-coral' : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500'}`}> False </button> </div> {showAllFeedback && feedback[item.id] === 'incorrect' && ( <p className="text-xs mt-2 text-red-700 dark:text-coral"> <strong className="font-semibold">Explanation:</strong> {item.explanation} (Correct: {item.isTrue ? 'True' : 'False'}) </p> )} {showAllFeedback && feedback[item.id] === 'correct' && ( <p className="text-xs mt-2 text-green-700 dark:text-mint font-semibold">Correct!</p> )} {showAllFeedback && feedback[item.id] === null && ( <p className="text-xs mt-2 text-gray-500 italic">Not answered.</p> )} </div> ))} </div> <div className="mt-4 flex justify-center space-x-4"> <button onClick={checkAllAnswers} className="text-xs bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors">Check All</button> <button onClick={resetExercise} className="text-xs bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-inter font-semibold py-1 px-3 rounded transition-colors">Reset</button> </div> </div> );
}

// Drag and Drop Classification Exercise (Conceptual - requires actual DnD library)
function PollutionSourceCategorize({ title, items, targets }: { title: string, items: PollutionSourceItem[], targets: PollutionCategoryTarget[] }) {
    // State and handlers (simplified placeholders)
    const [placedItems, setPlacedItems] = useState<{ [targetId: string]: PollutionSourceItem[] }>({});
    const [unplacedItems, setUnplacedItems] = useState([...items].sort(() => 0.5 - Math.random())); // Initial shuffle
    const [feedback, setFeedback] = useState<{[itemId: string]: boolean | null}>({});

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: PollutionSourceItem) => { e.dataTransfer.setData("text/plain", item.id); e.currentTarget.classList.add('opacity-50'); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: 'air' | 'water' | 'land') => { // Use explicit type for targetId
        e.preventDefault(); const itemId = e.dataTransfer.getData("text/plain"); const item = items.find(i => i.id === itemId);
        if (item) { setPlacedItems(prev => ({ ...prev, [targetId]: [...(prev[targetId] || []), item] })); setUnplacedItems(prev => prev.filter(i => i.id !== itemId)); setFeedback(prev => ({...prev, [itemId]: null})); }
         e.currentTarget.classList.remove('bg-yellow-100', 'dark:bg-yellow-800');
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.currentTarget.classList.add('bg-yellow-100', 'dark:bg-yellow-800'); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.currentTarget.classList.remove('bg-yellow-100', 'dark:bg-yellow-800'); };

    const checkAnswers = () => { const newFeedback: { [itemId: string]: boolean | null } = {}; Object.keys(placedItems).forEach(targetId => { placedItems[targetId].forEach(item => { newFeedback[item.id] = (item.category === targetId); }); }); unplacedItems.forEach(item => newFeedback[item.id] = false); setFeedback(newFeedback); if (unplacedItems.length === 0 && Object.values(newFeedback).every(val => val === true)) { alert("All classifications correct!"); } else if (unplacedItems.length === 0) { alert("Some classifications are incorrect."); } };
    const resetExercise = () => { setPlacedItems({}); setUnplacedItems([...items].sort(() => 0.5 - Math.random())); setFeedback({}); }; // Re-shuffle on reset

    return (
        <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md font-inter">
             {/* ... JSX structure from previous correct version ... */}
             <h4 className="text-lg font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">{title}</h4> <p className="text-xs mb-4">Drag the pollution sources to the primary environmental compartment they affect.</p> <div className="mb-4 p-3 border border-dashed dark:border-gray-600 rounded min-h-[60px] flex flex-wrap gap-2 items-start"> <span className="text-xs font-semibold self-center mr-2">Sources Pool:</span> {unplacedItems.map(item => ( <div key={item.id} draggable onDragStart={(e) => handleDragStart(e, item)} onDragEnd={(e) => e.currentTarget.classList.remove('opacity-50')} className={`text-xs p-1 px-2 rounded border cursor-grab bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500`}> {item.text} </div> ))} {unplacedItems.length === 0 && <span className="text-xs italic text-gray-400">All sources placed.</span>} </div> <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"> {targets.map(target => ( <div key={target.id} onDrop={(e) => handleDrop(e, target.id)} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className="p-3 border-2 border-dashed dark:border-gray-500 rounded min-h-[80px] transition-colors"> <h5 className="text-sm font-semibold mb-2 text-center">{target.text}</h5> <div className="flex flex-wrap gap-1 justify-center items-start min-h-[20px]"> {(placedItems[target.id] || []).map(item => ( <div key={item.id} className={`text-xs p-1 px-2 rounded border ${feedback[item.id] === true ? 'bg-mint/50 border-teal' : feedback[item.id] === false ? 'bg-coral/50 border-red-500' : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500'}`}> {item.text} </div> ))} </div> </div> ))} </div> <div className="mt-4 flex justify-center space-x-4"> <button onClick={checkAnswers} disabled={Object.keys(placedItems).length === 0} className="text-xs bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors disabled:opacity-50">Check Placements</button> <button onClick={resetExercise} className="text-xs bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-inter font-semibold py-1 px-3 rounded transition-colors">Reset</button> </div>
         </div>
    );
}

// Simulation Panel Component (iframe + external link)
function SimulationPanel({ title, description, embedUrl, externalUrl }: {title: string, description: string, embedUrl?: string, externalUrl: string}) {
  return (
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold font-inter mb-3 text-center">{title}</h3>
        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">{description}</p>
         {/* Button to open simulation in a new tab - MOVED ABOVE IFRAME */}
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
// Expanded Quiz Questions
const quizQuestions = [
    // Original Q1-Q9 are good. Let's add more.
     { question: "Environmental chemistry studies chemical species in which environmental compartments?", options: ["Air only", "Water only", "Air, Water, Soil, and Living Organisms", "Soil and Air only"], correctAnswer: 2, hint: "It encompasses all major parts of the environment and their interactions." },
    { question: "Acid rain is primarily caused by atmospheric reactions involving which two types of pollutants?", options: ["CO₂ and CH₄", "O₃ and Particulates", "SO₂ and NOx", "CFCs and CO"], correctAnswer: 2, hint: "Sulfur dioxide and nitrogen oxides react with water and oxygen to form sulfuric and nitric acids." },
    { question: "What is the main negative impact of eutrophication?", options: ["Increased water clarity", "Depletion of dissolved oxygen (hypoxia/anoxia)", "Cooling of water temperature", "Reduction in algae growth"], correctAnswer: 1, hint: "Decomposition of excess algae consumes oxygen vital for aquatic animals." },
    { question: "Which term describes a substance *not* naturally found in the environment, introduced by human activity?", options: ["Pollutant", "Contaminant", "Nutrient", "Reactant"], correctAnswer: 1, hint: "A contaminant only becomes a pollutant if it causes harm." },
    { question: "What does 'BOD' (Biological Oxygen Demand) measure?", options: ["The amount of oxygen produced by plants", "The oxygen required by microbes to decompose organic waste in water", "The total dissolved solids in water", "The speed of water flow"], correctAnswer: 1, hint: "High BOD indicates high levels of organic pollution." },
    { question: "Why is tropospheric (ground-level) ozone considered a pollutant?", options: ["It blocks harmful UV radiation", "It is essential for breathing", "It is toxic to humans and plants, and a component of smog", "It cools the atmosphere"], correctAnswer: 2, hint: "Unlike stratospheric ozone, ground-level ozone is harmful." },
    { question: "Reducing the use of plastic bags helps combat which type of pollution most directly?", options: ["Air pollution", "Water pollution", "Land pollution", "Noise pollution"], correctAnswer: 2, hint: "Plastics are non-biodegradable and contribute significantly to landfill volume and litter." },
    { question: "Afforestation (planting trees) primarily helps reduce which air pollutant?", options: ["Sulfur Dioxide (SO₂)", "Carbon Monoxide (CO)", "Carbon Dioxide (CO₂)", "Particulates"], correctAnswer: 2, hint: "Trees absorb CO₂ during photosynthesis." },
    { question: "What is the main health concern associated with high levels of carbon monoxide (CO)?", options: ["Causes acid rain", "Depletes the ozone layer", "Reduces the blood's ability to carry oxygen", "Causes eutrophication"], correctAnswer: 2, hint: "CO binds to hemoglobin much more strongly than oxygen." },
    { question: "Using filters on industrial chimneys is a method primarily aimed at reducing:", options: ["Water pollution", "Land pollution", "Air pollution (specifically particulates and some gases)", "Noise pollution"], correctAnswer: 2, hint: "Filters physically remove solid particles and can sometimes chemically scrub gases." }
];


const trueFalseStatements: TrueFalseStatement[] = [
    { id: 1, statement: "All pollutants are man-made.", isTrue: false, explanation: "Natural events like volcanic eruptions also release pollutants (e.g., SO₂)." },
    { id: 2, statement: "Oxygen is the most abundant gas in the Earth's atmosphere.", isTrue: false, explanation: "Nitrogen (N₂) is the most abundant gas, making up about 78%." },
    { id: 3, statement: "Eutrophication improves water quality for fish.", isTrue: false, explanation: "Eutrophication leads to oxygen depletion (hypoxia/anoxia) when the excess plant matter decomposes, harming aquatic life." },
    { id: 4, statement: "Carbon monoxide (CO) enhances the oxygen transport in blood.", isTrue: false, explanation: "CO binds strongly to hemoglobin, *preventing* oxygen transport and causing harm." },
    { id: 5, statement: "Using organic fertilizers can help reduce water pollution compared to synthetic ones.", isTrue: true, explanation: "Organic fertilizers generally release nutrients more slowly, reducing runoff and leaching into water bodies." },
    { id: 6, statement: "Plastic waste is a major land pollutant because it biodegrades quickly.", isTrue: false, explanation: "Plastic is non-biodegradable, persisting in the environment for hundreds or thousands of years." },
     { id: 7, statement: "The atmosphere acts like a solvent for various gaseous solutes.", isTrue: true, explanation: "With Nitrogen as the most abundant gas (solvent), other gases like Oxygen, CO₂, etc., are dissolved in it (solutes)." },
    { id: 8, statement: "A 'sink' in environmental chemistry creates pollutants.", isTrue: false, explanation: "A sink *removes* or stores pollutants from a particular environmental compartment (e.g., oceans are a sink for CO₂)." }
];

// Data for Pollution Source Drag & Drop
const pollutionSources: PollutionSourceItem[] = [
    { id: 'src1', text: 'Car Exhaust (NOx, CO)', category: 'air' },
    { id: 'src2', text: 'Factory Smoke (SO₂, Particulates)', category: 'air' },
    { id: 'src3', text: 'Fertilizer Runoff (Nitrates, Phosphates)', category: 'water' },
    { id: 'src4', text: 'Untreated Sewage', category: 'water' },
    { id: 'src5', text: 'Oil Spill on Ground', category: 'land' },
    { id: 'src6', text: 'Plastic Litter', category: 'land' },
    { id: 'src7', text: 'CFCs from old aerosols/refrigerants', category: 'air' },
    { id: 'src8', text: 'Pesticide Leaching into Groundwater', category: 'water' },
     { id: 'src9', text: 'Landfill Leachate seeping into soil', category: 'land' },
     { id: 'src10', text: 'Acid Rain forming in clouds', category: 'air' }, // Forms in air, affects land/water
     { id: 'src11', text: 'Thermal discharge from power plant into river', category: 'water'},
];

const pollutionTargets: PollutionCategoryTarget[] = [
    { id: 'air', text: 'Air Pollution' },
    { id: 'water', text: 'Water Pollution' },
    { id: 'land', text: 'Land Pollution' },
];


// --- KaTeX Constants ---
const katex_SO2 = 'SO_2'; const katex_N2 = 'N_2'; const katex_O2 = 'O_2';
const katex_CO2 = 'CO_2'; const katex_Ar='Ar'; const katex_NOx = 'NO_x';
const katex_CO = 'CO'; const katex_O3 = 'O_3'; const katex_CFC = 'CFCs';
const katex_NO = 'NO'; const katex_NO2 = 'NO_2';
const katex_UV = '\\text{UV}';
const katex_Cl = 'Cl'; const katex_ClO = 'ClO';
const katex_CFC_Decomp = `CF_2Cl_2 + ${katex_UV} \\rightarrow CF_2Cl + ${katex_Cl}`;
const katex_Ozone_Depl = `${katex_Cl} + ${katex_O3} \\rightarrow ${katex_ClO} + ${katex_O2}`;
const katex_NH3 = 'NH_3'; const katex_NO3_minus = 'NO_3^-'; const katex_H_plus = 'H^+'; const katex_H2O = 'H_2O';
const katex_FeCO3 = 'FeCO_3'; const katex_FeOH3 = 'Fe(OH)_3';
const katex_Mineral_Ox = `2${katex_FeCO3} + \\frac{1}{2} ${katex_O2} + 3${katex_H2O} \\xrightarrow{\\text{Bacteria}} 2${katex_FeOH3} + 2${katex_CO2}`;
const katex_Fe2O3 = 'Fe_2O_3';
const katex_Rust_Hydrate = `${katex_Fe2O3} + 3${katex_H2O} \\rightarrow ${katex_Fe2O3} \\cdot 3${katex_H2O}`;
const katex_Glucose = 'C_6H_{12}O_6';
const katex_Photosynthesis = `6${katex_CO2} + 6${katex_H2O} \\xrightarrow{\\text{Sunlight}} ${katex_Glucose} + 6${katex_O2}`;
const katex_Respiration = `${katex_Glucose} + 6${katex_O2} \\rightarrow 6${katex_CO2} + 6${katex_H2O} + \\text{Energy}`;
const katex_N_Fixation = `N_2 \\xrightarrow{\\text{Fixation}} \\text{Reactive N (e.g., } NH_3, NO_3^-)`; // Conceptual
const katex_Denitrification = `NO_3^- \\xrightarrow{\\text{Denitrification}} N_2`; // Conceptual


// --- Main Page Component ---
const EnvironmentalPollutionPage = () => {
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
                 Unit 5: Environmental Pollution
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            What is Environmental Pollution?
                         </h2>
                          <p className="leading-relaxed"> <strong className="text-teal dark:text-teal font-semibold">Pollution</strong> is the introduction of harmful substances (pollutants) or energy into the environment, causing adverse effects on ecosystems, wildlife, and human health. Pollutants can be natural (volcanic ash) or anthropogenic (human-caused, e.g., industrial waste). We categorize pollution by the affected environment: air, water, and land. </p>
                            {/* Visualization Point 1 */}
                            <div className="mt-4 p-3 bg-yellow-100 dark:bg-soft-yellow/20 border-l-4 border-yellow-500 dark:border-soft-yellow rounded">
                                <p className="font-semibold font-inter text-sm text-yellow-800 dark:text-soft-yellow">Visualize This:</p>
                                <p className="text-sm font-inter text-dark-gray dark:text-light-gray mt-1">Imagine Earth's environment as interconnected rooms (Air, Water, Land). Pollution is like spilling something harmful in one room that can seep into others. Environmental chemistry tracks where the spill came from, what it turns into, and how it affects everything.</p>
                            </div>
                     </section>

                    {/* Air Pollution */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Air Pollution
                         </h2>
                          <p className="leading-relaxed"> Contamination of the atmosphere by harmful gases and particulates. </p>
                          {/* Integrate interactive elements within the text */}
                            <h3 className="text-xl font-semibold font-playfair mt-4 mb-2 text-coral dark:text-gold">Major Air Pollutants & Sources:</h3>
                           <ul className="list-disc list-outside ml-6 space-y-1 mt-2 text-sm">
                                <li>SO₂: Burning coal/oil, smelting. (Causes acid rain, respiratory issues)</li>
                                <li>NOx (NO, NO₂): High-temp combustion (engines, power plants). (Acid rain, smog, ozone issues)</li>
                                <li>CO: Incomplete combustion (vehicles). (Toxic, reduces oxygen in blood)</li>
                                <li>O₃ (Tropospheric): Formed from NOx + VOCs + sunlight. (Smog, respiratory issues)</li>
                                <li>Particulates: Dust, soot, smoke. (Respiratory problems)</li>
                                <li>CFCs: Older refrigerants/aerosols. (Ozone layer depletion, greenhouse gas)</li>
                           </ul>
                            {/* Mini Question inline */}
                            <MiniCheckQuestion
                                question="Which gas is harmful at ground level (smog) but protective in the stratosphere?"
                                correctAnswer="Ozone (O₃)"
                                explanation="Ground-level ozone is a pollutant causing respiratory problems, while stratospheric ozone shields us from harmful UV radiation."
                            />
                            <h3 className="text-xl font-semibold font-playfair mt-4 mb-2 text-teal dark:text-mint">Reducing Air Pollution:</h3>
                            <p className="leading-relaxed text-sm">Use public transport, save energy, recycle, avoid burning waste, use filters, plant trees.</p>
                     </section>

                    {/* Water Pollution */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Water Pollution
                         </h2>
                          <p className="leading-relaxed"> Degradation of water quality in rivers, lakes, oceans, groundwater. </p>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2 text-coral dark:text-gold">Major Sources & Pollutants:</h3>
                            <ul className="list-disc list-outside ml-6 space-y-1 mt-2 text-sm">
                                <li>Agricultural Runoff: Nitrates, Phosphates (fertilizers), pesticides.</li>
                                <li>Sewage: Organic waste, pathogens, nutrients.</li>
                                <li>Industrial Waste: Chemicals, heavy metals, heat.</li>
                                <li>Oil Spills.</li>
                                <li>Plastic Debris.</li>
                            </ul>
                            <h3 className="text-xl font-semibold font-playfair mt-4 mb-2 text-coral dark:text-gold">Eutrophication:</h3>
                            <p className="leading-relaxed text-sm">Excess nutrients (N, P) → Algal bloom → Decomposition → Oxygen depletion → Aquatic life dies.</p>
                             {/* Inline Visualization Point */}
                            <div className="my-3 text-center">
                                {/* Placeholder for a simple eutrophication diagram */}
                                <Image src="/placeholder-eutrophication.png" alt="Simplified diagram showing nutrient runoff leading to algal bloom and oxygen depletion" width={300} height={150} className="inline-block border dark:border-gray-600 rounded"/>
                                <p className="text-xs italic text-gray-500 dark:text-gray-400">Conceptual Eutrophication Process</p>
                            </div>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2 text-teal dark:text-mint">Reducing Water Pollution:</h3>
                           <p className="leading-relaxed text-sm">Wastewater treatment, control runoff, reduce fertilizer/pesticide use, prevent spills, manage waste.</p>
                     </section>

                    {/* Land Pollution */}
                     <section>
                            <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Land Pollution
                         </h2>
                          <p className="leading-relaxed"> Degradation of land surfaces. </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2 text-coral dark:text-gold">Major Causes:</h3>
                          <ul className="list-disc list-outside ml-6 space-y-1 mt-2 text-sm">
                              <li>Improper Waste Disposal (esp. non-biodegradable plastics).</li>
                              <li>Industrial waste/mining tailings.</li>
                              <li>Agricultural chemicals (pesticides, excess fertilizers).</li>
                              <li>Deforestation leading to soil erosion.</li>
                              <li>Oil/Chemical spills.</li>
                           </ul>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2 text-teal dark:text-mint">Reducing Land Pollution:</h3>
                           <p className="leading-relaxed text-sm">Reduce, Reuse, Recycle; proper hazardous waste disposal; sustainable agriculture; reforestation; spill prevention/cleanup.</p>
                     </section>


                     {/* Study Tips Section */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Visualization Tips
                         </h2>
                           {/* ... Study tips from previous step ... */}
                          <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                              <li><strong className="font-semibold">Visualize Pathways:</strong> Trace a pollutant (e.g., fertilizer nitrate) from source (farm) to pathway (runoff) to impact (eutrophication in river).</li>
                              <li><strong className="font-semibold">Categorize Sources:</strong> Use the drag-and-drop to link sources (factories, cars, farms, waste) to pollution types (air, water, land).</li>
                              <li><strong className="font-semibold">Key Chemical Villains:</strong> Associate pollutants with problems: SO₂/NOx→Acid Rain, CFCs→Ozone Hole, CO→Asphyxiation, Nutrients→Eutrophication, Plastics→Persistence.</li>
                               <li><strong className="font-semibold">Cause & Effect Chains:</strong> Map activities to pollutants to environmental effects (e.g., Driving → NOx → Smog/Acid Rain → Respiratory issues/Ecosystem damage).</li>
                               <li><strong className="font-semibold">Solutions Grouping:</strong> Group reduction methods by category (e.g., Source Reduction, Treatment, Alternative Practices, Conservation).</li>
                                <li><strong className="font-semibold">Definitions Flashcards:</strong> Pollutant, Contaminant, Eutrophication, BOD, DO, TLV, Biodegradable, etc.</li>
                                <li><strong className="font-semibold">Use the Interatives:</strong> Videos, T/F, Drag/Drop, Mini-Qs reinforce different aspects.</li>
                           </ul>
                     </section>

                </article>

                {/* Right Column */}
                <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                    {/* Panel 1: Overview Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="GLEETI9oG0A" title="Video: Types of Environmental Pollution"/>
                     </div>

                    {/* Panel 2: Atmosphere Composition Table */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 font-inter text-xs">
                         <h3 className="text-lg font-semibold font-inter mb-3 text-center text-blue-700 dark:text-blue-300">Atmosphere Composition</h3>
                           <table className="table-auto border-collapse w-full text-left">
                                <thead> <tr className="bg-gray-100 dark:bg-gray-700"> <th className="border dark:border-gray-600 px-2 py-1">Gas</th> <th className="border dark:border-gray-600 px-2 py-1">% by Volume</th> </tr> </thead>
                                <tbody>
                                    <tr><td className="border dark:border-gray-600 px-2 py-1">Nitrogen (N₂)</td><td className="border dark:border-gray-600 px-2 py-1">~78%</td></tr>
                                    <tr><td className="border dark:border-gray-600 px-2 py-1">Oxygen (O₂)</td><td className="border dark:border-gray-600 px-2 py-1">~21%</td></tr>
                                    <tr><td className="border dark:border-gray-600 px-2 py-1">Argon (Ar)</td><td className="border dark:border-gray-600 px-2 py-1">~0.93%</td></tr>
                                    <tr><td className="border dark:border-gray-600 px-2 py-1">Carbon Dioxide (CO₂)</td><td className="border dark:border-gray-600 px-2 py-1">~0.04%+</td></tr>
                                    <tr><td className="border dark:border-gray-600 px-2 py-1">Water Vapor (H₂O)</td><td className="border dark:border-gray-600 px-2 py-1">Variable (~0.08% avg)</td></tr>
                                    <tr><td className="border dark:border-gray-600 px-2 py-1">Trace Gases</td><td className="border dark:border-gray-600 px-2 py-1">Neon, Helium, Methane, etc.</td></tr>
                               </tbody>
                           </table>
                           <MiniCheckQuestion
                                question="Besides Nitrogen and Oxygen, which gas is the next most abundant in dry air?"
                                correctAnswer="Argon (Ar)"
                                explanation="Argon makes up almost 1% of the atmosphere, significantly more than CO₂ or other trace gases."
                            />
                      </div>


                      {/* Panel 3: Pollution Source Drag & Drop */}
                       <PollutionSourceCategorize
                           title="Categorize Pollution Sources"
                           items={pollutionSources}
                           targets={pollutionTargets}
                       />

                      {/* Panel 4: Eutrophication Video */}
                       <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <YouTubeEmbed videoId="6-xdBQVuzAQ" title="Video: Eutrophication Explained"/>
                       </div>

                       {/* Panel 5: True/False Exercise */}
                       <TrueFalseExercise title="Pollution Facts: True or False?" statements={trueFalseStatements} />

                     {/* Panel 6: Acid Rain Simulation */}
                       <SimulationPanel
                           title="Explore: Acid Rain Simulation"
                           description="See how emissions affect rain pH and the environment."
                           externalUrl="https://phet.colorado.edu/sims/html/acid-rain/latest/acid-rain_en.html"
                           // embedUrl="Optional embed URL if available"
                       />

                      {/* Panel 7: Waste Management Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Waste Reduction Check</h3>
                            <MiniCheckQuestion
                               question="Which of the '3 Rs' of waste management directly addresses the Green Chemistry principle of 'Prevention'?"
                               correctAnswer="Reduce."
                               explanation="Reducing consumption prevents waste from being generated in the first place, which is more effective than reusing or recycling materials that have already been produced and potentially discarded."
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
                    Test Your Pollution Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
         {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Environmental Pollution Quiz</h2>
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
EnvironmentalPollutionPage.displayName = 'EnvironmentalPollutionPage';

export default EnvironmentalPollutionPage;
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

interface TrueFalseStatement {
    id: number;
    statement: string;
    isTrue: boolean;
    explanation: string;
}

// Interactive classification exercise
interface PolymerItem {
    id: string;
    name: string;
    // Add properties to classify by:
    source: 'natural' | 'synthetic';
    type: 'addition' | 'condensation';
    thermal: 'thermoplastic' | 'thermoset';
}

interface ClassificationTarget {
    id: string;
    text: string;
    category: 'source' | 'type' | 'thermal'; // The property to classify by
    value: string; // The correct value for this category (e.g., 'natural', 'addition', 'thermoplastic')
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


// Drag and Drop Classification Exercise (Conceptual)
function ClassificationDragDrop({ title, items, targets }: { title: string, items: PolymerItem[], targets: ClassificationTarget[] }) {
    const [placedItems, setPlacedItems] = useState<{ [targetId: string]: PolymerItem[] }>({});
    const [unplacedItems, setUnplacedItems] = useState(items);
     const [feedback, setFeedback] = useState<{[itemId: string]: boolean | null}>({}); // item.id -> true/false/null

     // Placeholder DnD handlers (replace with actual library)
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: PolymerItem) => { e.dataTransfer.setData("text/plain", item.id); e.currentTarget.classList.add('opacity-50'); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, target: ClassificationTarget) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData("text/plain");
        const item = items.find(i => i.id === itemId);
        if (item) {
            setPlacedItems(prev => ({ ...prev, [target.id]: [...(prev[target.id] || []), item] }));
            setUnplacedItems(prev => prev.filter(i => i.id !== itemId));
            setFeedback(prev => ({...prev, [itemId]: null})); // Clear feedback on drop
        }
         e.currentTarget.classList.remove('bg-yellow-100', 'dark:bg-yellow-800');
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.currentTarget.classList.add('bg-yellow-100', 'dark:bg-yellow-800'); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.currentTarget.classList.remove('bg-yellow-100', 'dark:bg-yellow-800'); };

     const checkAnswers = () => {
        const newFeedback: { [itemId: string]: boolean | null } = {};
        Object.keys(placedItems).forEach(targetId => {
            const target = targets.find(t => t.id === targetId);
            if (target) {
                 placedItems[targetId].forEach(item => {
                     // Check if the item's property matches the target's category value
                     newFeedback[item.id] = (item[target.category] === target.value);
                 });
            }
        });
        // Also mark unplaced items if necessary, or assume they are incorrect if required
         unplacedItems.forEach(item => newFeedback[item.id] = false); // Mark unplaced as incorrect for check
        setFeedback(newFeedback);
         if (unplacedItems.length === 0 && Object.values(newFeedback).every(val => val === true)) {
             alert("All classifications correct!");
         } else if (unplacedItems.length === 0) {
             alert("Some classifications are incorrect. Review the feedback.");
         }
    };

    const resetExercise = () => { setPlacedItems({}); setUnplacedItems(items); setFeedback({}); };

    return (
        <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md font-inter">
            <h4 className="text-lg font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">{title}</h4>
            <p className="text-xs mb-4">Drag the polymers from the pool to the correct classification category.</p>
            {/* Unplaced Items */}
             <div className="mb-4 p-3 border border-dashed dark:border-gray-600 rounded min-h-[60px] flex flex-wrap gap-2 items-start">
                <span className="text-xs font-semibold self-center mr-2">Polymer Pool:</span>
                 {unplacedItems.map(item => ( <div key={item.id} draggable onDragStart={(e) => handleDragStart(e, item)} onDragEnd={(e) => e.currentTarget.classList.remove('opacity-50')} className={`text-xs p-1 px-2 rounded border cursor-grab bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500`}> {item.name} </div> ))}
                 {unplacedItems.length === 0 && <span className="text-xs italic text-gray-400">All polymers placed.</span>}
             </div>
            {/* Drop Targets */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {targets.map(target => ( <div key={target.id} onDrop={(e) => handleDrop(e, target)} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className="p-3 border-2 border-dashed dark:border-gray-500 rounded min-h-[80px] transition-colors"> <h5 className="text-sm font-semibold mb-2 text-center">{target.text}</h5> <div className="flex flex-wrap gap-1 justify-center items-start"> {(placedItems[target.id] || []).map(item => ( <div key={item.id} className={`text-xs p-1 px-2 rounded border ${feedback[item.id] === true ? 'bg-mint/50 border-teal' : feedback[item.id] === false ? 'bg-coral/50 border-red-500' : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500'}`}> {item.name} </div> ))} </div> </div> ))}
             </div>
              <div className="mt-4 flex justify-center space-x-4"> <button onClick={checkAnswers} disabled={Object.keys(placedItems).length === 0} className="text-xs bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors disabled:opacity-50">Check Placements</button> <button onClick={resetExercise} className="text-xs bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-inter font-semibold py-1 px-3 rounded transition-colors">Reset</button> </div>
         </div>
    );
}


// --- Page Specific Data ---
const quizQuestions = [
    // ... (Original questions are good, perhaps add one distinguishing copolymer types)
    { question: "What type of polymer is made from only one type of monomer unit?", options: ["Copolymer", "Homopolymer", "Blend", "Composite"], correctAnswer: 1, hint: "Homo- means 'same'." },
    { question: "A polymer made from two *different* types of monomers linked together is called a:", options: ["Homopolymer", "Isomer", "Copolymer", "Oligomer"], correctAnswer: 2, hint: "Co- means 'together' or 'joint'." },
    { question: "Which sequence represents an *alternating* copolymer?", options: ["A-A-B-A-B-B-A", "A-A-A-B-B-B", "A-B-A-B-A-B", "A-A-A-A-A-A"], correctAnswer: 2, hint: "Alternating means the units follow a regular repeating pattern." },
    { question: "Polyethylene, Polystyrene, and PVC are all examples of which major class based on polymerization reaction type?", options: ["Condensation Polymers", "Addition Polymers", "Natural Polymers", "Thermosets"], correctAnswer: 1, hint: "They are formed by adding unsaturated monomers without losing small molecules." },
    { question: "Cellulose, starch, and proteins are examples of:", options: ["Synthetic Addition Polymers", "Synthetic Condensation Polymers", "Natural Polymers", "Thermosetting Plastics"], correctAnswer: 2, hint: "These polymers are produced by living organisms." },
    { question: "Polypropylene (used in containers, ropes) is synthesized from which monomer?", options: ["Ethylene", "Styrene", "Propylene (Propene)", "Vinyl Chloride"], correctAnswer: 2, hint: "Poly-propylene means 'many propylenes'." },
    { question: "Which classification is based on how a polymer behaves when heated?", options: ["Homopolymer/Copolymer", "Natural/Synthetic", "Addition/Condensation", "Thermoplastic/Thermoset"], correctAnswer: 3, hint: "This relates to whether the polymer melts or decomposes upon heating." },
    { question: "A polymer that can be repeatedly softened by heating and solidified by cooling is a:", options: ["Thermoset", "Elastomer", "Thermoplastic", "Homopolymer"], correctAnswer: 2, hint: "Think 'thermo' (heat) and 'plastic' (moldable)." },
    { question: "Bakelite and epoxy resins, which harden irreversibly upon heating or curing, are examples of:", options: ["Thermoplastics", "Elastomers", "Natural Polymers", "Thermosets"], correctAnswer: 3, hint: "Think 'thermo' (heat) and 'set' (permanently hardened)." },
    { question: "Which property is more characteristic of thermosetting polymers compared to thermoplastics?", options: ["Lower melting point", "Solubility in common solvents", "Ability to be remelted and reshaped", "Higher rigidity and inability to melt once cured"], correctAnswer: 3, hint: "The cross-linked network structure prevents melting." }
];

const trueFalseStatements: TrueFalseStatement[] = [
    { id: 1, statement: "Homopolymers can only be formed by addition polymerization.", isTrue: false, explanation: "Homopolymers can be formed by either addition (e.g., polyethylene) or condensation (e.g., some types of polyesters from a single hydroxy-acid monomer)." },
    { id: 2, statement: "Copolymers always contain exactly two different types of monomers.", isTrue: false, explanation: "Copolymers contain *at least* two different monomers, but can contain three (terpolymers) or more." },
    { id: 3, statement: "All natural polymers are condensation polymers.", isTrue: false, explanation: "While many are (proteins, cellulose), natural rubber (polyisoprene) is conceptually closer to an addition polymer." },
    { id: 4, statement: "Thermoplastics typically consist of linear or branched chains with weak intermolecular forces.", isTrue: true, explanation: "These weak forces allow the chains to slide past each other when heated, enabling melting and reshaping." },
    { id: 5, statement: "Thermosets can be easily recycled by melting them down.", isTrue: false, explanation: "Thermosets have strong covalent cross-links; they do not melt but decompose or char upon strong heating, making recycling difficult." }
];

// Data for Classification Drag & Drop
const polymersToClassify: PolymerItem[] = [
    { id: 'poly1', name: 'Polyethylene', source: 'synthetic', type: 'addition', thermal: 'thermoplastic' },
    { id: 'poly2', name: 'Cellulose', source: 'natural', type: 'condensation', thermal: 'thermoplastic' }, // Technically condensation by definition of linking glucose
    { id: 'poly3', name: 'Nylon 6,6', source: 'synthetic', type: 'condensation', thermal: 'thermoplastic' },
    { id: 'poly4', name: 'Bakelite', source: 'synthetic', type: 'condensation', thermal: 'thermoset' },
    { id: 'poly5', name: 'Natural Rubber', source: 'natural', type: 'addition', thermal: 'thermoplastic' }, // Vulcanized is thermoset
    { id: 'poly6', name: 'PVC', source: 'synthetic', type: 'addition', thermal: 'thermoplastic' },
    { id: 'poly7', name: 'Protein', source: 'natural', type: 'condensation', thermal: 'thermoplastic' }, // Denatures, but structurally thermoplastic-like before degradation
    { id: 'poly8', name: 'Epoxy Resin (cured)', source: 'synthetic', type: 'condensation', thermal: 'thermoset' }
];

const classificationTargets: ClassificationTarget[] = [
    { id: 'catNat', text: 'Natural', category: 'source', value: 'natural' },
    { id: 'catSyn', text: 'Synthetic', category: 'source', value: 'synthetic' },
    { id: 'catAdd', text: 'Addition Polymer', category: 'type', value: 'addition' },
    { id: 'catCon', text: 'Condensation Polymer', category: 'type', value: 'condensation' },
    { id: 'catThermo', text: 'Thermoplastic', category: 'thermal', value: 'thermoplastic' },
    { id: 'catSet', text: 'Thermoset', category: 'thermal', value: 'thermoset' },
];


// --- KaTeX Constants ---
// (Minimal needed, mostly chemical names)
const katex_SiO2 = 'SiO_2';
const katex_Ethylene = 'CH_2=CH_2';
const katex_Propylene = 'CH_2=CHCH_3';
const katex_n = 'n';
const katex_m = 'm';
const katex_PE = '-[CH_2-CH_2]_n-';
const katex_EthenePoly = `${katex_n} ${katex_Ethylene} \\rightarrow ${katex_PE}`;
const katex_Copolymer = `(${katex_Ethylene})_n + (${katex_Propylene})_m`; // Simplified representation
const katex_RandCopoly = `...-A-A-B-A-B-B-A-...`; // Random
const katex_AltCopoly = `...-A-B-A-B-A-B-...`; // Alternating/Regular
const katex_Diol = 'HO-R-OH';
const katex_Diacid = 'HOOC-R\'-COOH';
const katex_Polyester = `-(O-R-O-CO-R'-CO)_n-`; // Simplified polyester link
const katex_H2O = 'H_2O';
const katex_PolyesterRxn = `${katex_n} ${katex_Diol} + ${katex_n} ${katex_Diacid} \\rightarrow {\\text{Catalyst}} ${katex_Polyester} + (2n-1) ${katex_H2O}`; // Adjusted water count
const katex_VinylChloride = 'CH_2=CHCl';
const katex_PVC = '-(CH_2-CHCl)_n-';
const katex_PVC_Rxn = `${katex_n} ${katex_VinylChloride} \\rightarrow {\\text{Catalyst}} ${katex_PVC}`;


// --- Main Page Component ---
const ClassificationOfPolymersPage = () => { // Renamed component
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
                 4.3 Classification of Polymers {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Classification Intro */}
                    <section>
                         <p className="leading-relaxed text-lg">
                            Polymers are diverse materials with varied properties and origins. Understanding how they are classified helps predict their behavior and applications. We can classify polymers based on several criteria.
                         </p>
                    </section>

                    {/* 1. Based on Monomer Type */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            1. Classification by Monomer Type
                         </h2>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Homopolymers</h3>
                         <p className="leading-relaxed">
                            These polymers are formed from only <strong className="text-coral dark:text-gold">one type</strong> of monomer unit. The entire chain consists of identical repeating units.
                         </p>
                         <p className="mt-2 leading-relaxed text-sm">
                            Example: Polyethylene, made solely from ethylene monomers.
                         </p>
                         <BlockMath math={katex_EthenePoly}/>

                         <h3 className="text-xl font-semibold font-playfair mt-6 mb-2">Copolymers</h3>
                          <p className="leading-relaxed">
                            These polymers are formed from <strong className="text-coral dark:text-gold">two or more different</strong> types of monomer units. The arrangement of these different units along the chain can vary:
                          </p>
                           <ul className="list-disc list-outside ml-6 space-y-1 mt-2 text-sm">
                               <li><strong className="font-semibold">Random Copolymers:</strong> Monomer units (A and B) are arranged randomly along the chain (e.g., ...-A-A-B-A-B-B-A-...).</li>
                               <li><strong className="font-semibold">Alternating Copolymers:</strong> Monomer units strictly alternate (e.g., ...-A-B-A-B-A-B-...). Nylon 6,6 is an example if you consider the diamine and diacid as A and B.</li>
                                <li><strong className="font-semibold">Block Copolymers:</strong> Long sequences (blocks) of one monomer type are linked to blocks of another type (e.g., ...-A-A-A-A-A-B-B-B-B-B-...).</li>
                                <li><strong className="font-semibold">Graft Copolymers:</strong> Chains of one type of monomer are grafted onto the backbone of another polymer chain.</li>
                           </ul>
                           <p className="mt-2 leading-relaxed text-sm">
                               Example: SBR rubber (Styrene-Butadiene Rubber) used in tires is a common copolymer. PET (Dacron) is made from two different monomers.
                           </p>
                    </section>

                    {/* 2. Based on Polymerization Reaction */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             2. Classification by Polymerization Reaction
                         </h2>
                         <p className="leading-relaxed">
                             As discussed previously (Section 4.2), polymers can be classified by how they are made:
                          </p>
                           <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                <li><strong className="font-semibold text-teal dark:text-teal">Addition Polymers:</strong> Formed by the sequential addition of monomers (usually unsaturated) without the loss of any atoms. Examples: Polyethylene, PVC, Polystyrene.</li>
                                 <li><strong className="font-semibold text-teal dark:text-teal">Condensation Polymers:</strong> Formed by the reaction between monomers (with ≥ 2 functional groups), accompanied by the elimination of a small molecule (like H₂O, CH₃OH). Examples: Polyesters (PET/Dacron), Polyamides (Nylon), Bakelite, Proteins.</li>
                           </ul>
                    </section>

                     {/* 3. Based on Source */}
                    <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            3. Classification by Source
                         </h2>
                         <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                              <li><strong className="font-semibold text-green-600 dark:text-mint">Natural Polymers:</strong> Occur naturally in plants and animals. Examples: Cellulose, Starch (polysaccharides), Proteins, DNA/RNA (nucleic acids), Natural Rubber (polyisoprene).</li>
                              <li><strong className="font-semibold text-purple-600 dark:text-purple-400">Synthetic Polymers:</strong> Man-made polymers synthesized from simpler monomers, usually derived from petroleum. Examples: Polyethylene, Polypropylene, PVC, Polystyrene, Nylon, Polyester, Teflon, Bakelite, Epoxy resins.</li>
                           </ul>
                    </section>

                     {/* 4. Based on Thermal Behavior */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            4. Classification by Thermal Behavior
                         </h2>
                         <p className="leading-relaxed">
                            How polymers respond to heat is a crucial classification for processing and application:
                         </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2 text-orange-600 dark:text-orange-400">Thermoplastics</h3>
                           <p className="leading-relaxed text-sm">
                             These polymers <strong className="text-coral dark:text-gold">soften or melt</strong> upon heating and solidify upon cooling. This process can be repeated multiple times, making them easily moldable and recyclable (in principle). They typically consist of linear or branched chains with weak intermolecular forces. Examples: Polyethylene (PE), Polypropylene (PP), Polyvinyl Chloride (PVC), Polystyrene (PS), PET.
                           </p>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2 text-red-600 dark:text-red-400">Thermosets (Thermosetting Plastics)</h3>
                           <p className="leading-relaxed text-sm">
                              These polymers undergo irreversible chemical changes (<strong className="text-coral dark:text-gold">curing</strong>) upon initial heating or by adding a curing agent. This forms a rigid, heavily cross-linked 3D network structure. Once set, they <strong className="text-coral dark:text-gold">do not melt</strong> upon reheating but will decompose or char at very high temperatures. They cannot be easily reshaped or recycled by melting. Examples: Bakelite, Epoxy resins, Vulcanized rubber, Polyurethane foams (rigid).
                           </p>
                     </section>

                    {/* Study Tips Section */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Visualization Tips
                         </h2>
                         <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                              <li><strong className="font-semibold">Focus on Definitions:</strong> Clearly understand Homopolymer vs. Copolymer, Addition vs. Condensation, Natural vs. Synthetic, Thermoplastic vs. Thermoset.</li>
                              <li><strong className="font-semibold">Use Examples:</strong> Associate key examples with each classification (e.g., PE=Homo, Addition, Synthetic, Thermoplastic; Nylon=Copolymer, Condensation, Synthetic, Thermoplastic; Cellulose=Homo, Natural, Thermoplastic).</li>
                               <li><strong className="font-semibold">Visualize Structures:</strong>
                                   <ul className="list-circle list-outside ml-6 mt-1 text-sm">
                                       <li>Homopolymer = Chain of identical beads (...AAAAA...).</li>
                                       <li>Copolymer (alternating) = Chain of different beads (...ABABAB...).</li>
                                       <li>Thermoplastic = Like cooked spaghetti strands (can move past each other when hot).</li>
                                       <li>Thermoset = Like a tangled fishing net (chains permanently linked).</li>
                                   </ul>
                               </li>
                                <li><strong className="font-semibold">Relate Thermal Behavior to Structure:</strong> Thermoplastics melt because chains slide. Thermosets don't melt because cross-links prevent sliding.</li>
                                <li><strong className="font-semibold">Interactive Exercises:</strong> Use the classification drag-and-drop and true/false exercises to test your understanding of these categories.</li>
                           </ul>
                     </section>

                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                      {/* Panel 1: Polymer Classification Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <YouTubeEmbed videoId="dtxvSS4lQoI" title="Video: Classification of Polymers"/>
                      </div>

                     {/* Panel 2: Interactive Classification Drag & Drop */}
                      {/* Note: Needs 'correctCategoryId' added to items based on the 'value' of the target */}
                      <ClassificationDragDrop
                           title="Classify These Polymers"
                           items={polymersToClassify} // Ensure PolymerItem has source, type, thermal props
                           targets={classificationTargets} // Ensure ClassificationTarget has category and value props
                       />

                       {/* Panel 3: Thermoplastic vs Thermoset Video */}
                       <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <YouTubeEmbed videoId="hGuTUNvovmQ" title="Video: Thermoplastics vs. Thermosets"/>
                       </div>

                      {/* Panel 4: Thermal Behavior Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Thermal Behavior Check</h3>
                            <MiniCheckQuestion
                               question="You have a plastic object. When you heat it gently, it becomes soft and bendable. When it cools, it becomes hard again. What type of polymer is it likely made of?"
                               correctAnswer="Thermoplastic."
                               explanation="Thermoplastics can be repeatedly softened by heating and hardened by cooling because their polymer chains are not permanently cross-linked."
                           />
                      </div>

                     {/* Panel 5: True/False Exercise */}
                      <TrueFalseExercise title="Polymer Classification: True or False?" statements={trueFalseStatements} />


                      {/* Panel 6: Natural Polymers Examples (Image/Text) */}
                       <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-600 dark:text-mint">Natural Polymer Examples</h3>
                         <p className="text-sm font-inter text-dark-gray dark:text-light-gray mb-3">Nature produces amazing polymers!</p>
                          {/* Placeholder for images or list */}
                          <ul className="list-disc list-outside ml-6 text-sm font-inter space-y-1">
                             <li>Cellulose (Plant cell walls - wood, cotton)</li>
                             <li>Starch (Energy storage in plants)</li>
                             <li>Proteins (Enzymes, muscle, hair, silk)</li>
                              <li>DNA/RNA (Genetic material)</li>
                             <li>Natural Rubber (Latex from rubber trees)</li>
                          </ul>
                           <MiniCheckQuestion
                              question="Is natural rubber (polyisoprene) formed by addition or condensation polymerization?"
                              correctAnswer="Addition polymerization (conceptually)."
                              explanation="Natural rubber is formed from isoprene (C₅H₈) monomers joining via their double bonds, fitting the pattern of addition polymerization."
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
                    Test Your Polymer Classification Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
         {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Polymer Classification Quiz</h2>
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
ClassificationOfPolymersPage.displayName = 'ClassificationOfPolymersPage';

export default ClassificationOfPolymersPage;
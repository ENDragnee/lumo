'use client';

import { InlineMath, BlockMath } from 'react-katex'; // Keep imports
import { useState, ChangeEvent, Fragment } from 'react'; // Removed useMemo, Added Fragment
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

// Interactive Drag-and-Drop / Matching Exercise Component (Conceptual)
interface MatchItem {
    id: string;
    text: string;
    group: 'raw' | 'product'; // Type of item
    matchId: string; // ID of the item it should match with
}

function MatchingExercise({ title, items }: { title: string, items: MatchItem[] }) {
    const [rawMaterials, setRawMaterials] = useState<MatchItem[]>(items.filter(i => i.group === 'raw').sort(() => 0.5 - Math.random())); // Shuffle
    const [products, setProducts] = useState<MatchItem[]>(items.filter(i => i.group === 'product').sort(() => 0.5 - Math.random())); // Shuffle
    const [connections, setConnections] = useState<{ [key: string]: string }>({}); // { rawId: productId }
    const [feedback, setFeedback] = useState<{ [key: string]: 'correct' | 'incorrect' }>({});
    const [selectedRaw, setSelectedRaw] = useState<string | null>(null);

    const handleRawClick = (rawId: string) => {
        setSelectedRaw(rawId);
    };

    const handleProductClick = (productId: string) => {
        if (selectedRaw) {
            setConnections(prev => ({ ...prev, [selectedRaw]: productId }));
            setSelectedRaw(null); // Deselect after matching
        }
    };

    const checkAnswers = () => {
        const newFeedback: { [key: string]: 'correct' | 'incorrect' } = {};
        let allCorrect = true;
        items.filter(i => i.group === 'raw').forEach(rawItem => {
            const connectedProduct = connections[rawItem.id];
            if (connectedProduct && connectedProduct === rawItem.matchId) {
                newFeedback[rawItem.id] = 'correct';
            } else {
                newFeedback[rawItem.id] = 'incorrect';
                allCorrect = false;
            }
        });
        setFeedback(newFeedback);
        // Optionally provide overall feedback (e.g., alert)
        if (allCorrect && Object.keys(connections).length === rawMaterials.length) {
           alert("All matches correct!");
        } else if (Object.keys(connections).length === rawMaterials.length) {
            alert("Some matches are incorrect. Try again!");
        }
    };

     const resetExercise = () => {
        setConnections({});
        setFeedback({});
        setSelectedRaw(null);
         // Re-shuffle
         setRawMaterials(items.filter(i => i.group === 'raw').sort(() => 0.5 - Math.random()));
         setProducts(items.filter(i => i.group === 'product').sort(() => 0.5 - Math.random()));
    };

    return (
        <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md font-inter">
            <h4 className="text-lg font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">{title}</h4>
            <p className="text-xs mb-4">Click a raw material, then click the product made from it.</p>
            <div className="grid grid-cols-2 gap-4">
                {/* Raw Materials Column */}
                <div>
                    <h5 className="text-sm font-semibold mb-2 text-center">Raw Materials</h5>
                    <div className="space-y-2">
                        {rawMaterials.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleRawClick(item.id)}
                                className={`w-full text-left text-sm p-2 rounded border transition-colors ${selectedRaw === item.id ? 'bg-yellow-200 dark:bg-yellow-700 border-yellow-500 ring-2 ring-yellow-400' : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'}
                                            ${feedback[item.id] === 'correct' ? '!bg-mint/50 !border-teal' : ''} ${feedback[item.id] === 'incorrect' ? '!bg-coral/50 !border-red-500' : ''}`}
                            >
                                {item.text}
                                {connections[item.id] && <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">(Matched)</span>}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Products Column */}
                 <div>
                    <h5 className="text-sm font-semibold mb-2 text-center">Products</h5>
                     <div className="space-y-2">
                        {products.map(item => (
                             <button
                                key={item.id}
                                onClick={() => handleProductClick(item.id)}
                                disabled={!selectedRaw} // Disable if no raw material is selected
                                className={`w-full text-left text-sm p-2 rounded border transition-colors ${!selectedRaw ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-600'} bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600`}
                             >
                                {item.text}
                                {/* Indicate if this product is already matched */}
                                {Object.values(connections).includes(item.id) && <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">(Matched)</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
             <div className="mt-4 flex justify-center space-x-4">
                <button onClick={checkAnswers} className="text-xs bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors">Check Matches</button>
                <button onClick={resetExercise} className="text-xs bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-inter font-semibold py-1 px-3 rounded transition-colors">Reset</button>
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

// Simulation Panel Component
function SimulationPanel({ title, description, embedUrl, externalUrl }: {title: string, description: string, embedUrl?: string, externalUrl: string}) {
  return (
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold font-inter mb-3 text-center">{title}</h3>
        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">{description}</p>
        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
            {embedUrl ? ( <iframe src={embedUrl} className='absolute top-0 left-0 w-full h-full' allowFullScreen sandbox="allow-scripts allow-same-origin" title={title}><p className="text-light-gray text-center pt-10">Loading Simulation...</p></iframe> ) : ( <div className="absolute inset-0 flex items-center justify-center bg-gray-700"><span className="text-light-gray font-inter font-semibold p-4 text-center">Simulation cannot be embedded here.</span></div> )}
        </div>
        <div className="text-center mt-3"> <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-xs bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors" title={`Open ${title} in new tab`}> Open Simulation in New Tab ↗ </a> </div>
      </div>
  );
}


// --- Page Specific Data ---
// *** EXPANDED QUIZ QUESTIONS for Industrial Chem Intro ***
const quizQuestions = [
  { question: "What historical period saw the most rapid initial growth of chemical industries?", options: ["Renaissance", "Industrial Revolution (19th Century)", "Digital Age (20th Century)", "Ancient Rome"], correctAnswer: 1, hint: "This era brought new technologies and demands that spurred chemical production." },
  { question: "Which is NOT typically considered a direct product of the chemical industry?", options: ["Fertilizers", "Plastics", "Crude Oil (as extracted)", "Pharmaceutical Drugs"], correctAnswer: 2, hint: "Crude oil is a raw material *used* by the chemical industry (refining), not typically a final product itself." },
  { question: "Industrial chemistry primarily focuses on:", options: ["Theoretical research in labs", "Scaling up chemical processes for commercial production", "Environmental impact studies only", "Teaching chemistry principles"], correctAnswer: 1, hint: "It applies chemical knowledge to large-scale manufacturing of useful products." },
  { question: "What is a key characteristic shared by most chemical manufacturing processes?", options: ["Low energy requirements", "Use of only natural catalysts", "Significant consumption of energy", "Production of zero waste"], correctAnswer: 2, hint: "Chemical transformations often require substantial energy input (heating, pressure, etc.)." },
  { question: "Why is Quality Control (QC) important in chemical industries?", options: ["To increase production speed", "To ensure products meet safety and performance specifications", "To discover new raw materials", "To reduce energy consumption"], correctAnswer: 1, hint: "QC labs perform tests to verify product consistency and standards." },
  { question: "Developing countries like Ethiopia can benefit from industrial chemistry primarily by:", options: ["Exporting raw minerals only", "Utilizing natural resources to produce value-added chemical products", "Focusing solely on agricultural chemistry", "Importing all necessary chemicals"], correctAnswer: 1, hint: "Transforming local resources into finished goods adds economic value." },
  { question: "Which activity is central to industrial chemistry?", options: ["Observing star patterns", "Transforming raw materials via chemical reactions", "Analyzing historical documents", "Designing computer software"], correctAnswer: 1, hint: "The core is using chemical processes to make new substances." },
   { question: "Safety in chemical industries involves:", options: ["Ignoring potential hazards", "Using only small reaction vessels", "Implementing safe operating procedures and equipment design", "Avoiding quality control tests"], correctAnswer: 2, hint: "Handling chemicals and processes safely is paramount." },
   { question: "What does it mean to extract a metal 'economically' from an ore?", options: ["The extraction uses no energy", "The metal is very rare", "The value of the extracted metal is greater than the cost of extraction", "The ore contains only the pure metal"], correctAnswer: 2, hint: "Profitability is the key factor defining an ore versus just a mineral." },
   { question: "Synthetic fibers like nylon or polyester are products of which industry?", options: ["Metallurgy", "Agriculture", "Chemical Industry", "Mining"], correctAnswer: 2, hint: "These are polymers created through chemical synthesis." }
];

// Matching Exercise Data
const matchingItems: MatchItem[] = [
    { id: 'raw1', text: 'Crude Oil', group: 'raw', matchId: 'prod1' },
    { id: 'raw2', text: 'Natural Gas (Methane)', group: 'raw', matchId: 'prod2' },
    { id: 'raw3', text: 'Sulfur', group: 'raw', matchId: 'prod3' },
    { id: 'raw4', text: 'Limestone (CaCO₃)', group: 'raw', matchId: 'prod4' },
    { id: 'raw5', text: 'Air (Nitrogen, Oxygen)', group: 'raw', matchId: 'prod2' }, // Also for Ammonia/Fertilizers
    { id: 'raw6', text: 'Salt (NaCl)', group: 'raw', matchId: 'prod5' },

    { id: 'prod1', text: 'Gasoline, Plastics', group: 'product', matchId: 'raw1' },
    { id: 'prod2', text: 'Ammonia, Fertilizers', group: 'product', matchId: 'raw2' }, // Matches raw2 (and raw5 implicitly)
    { id: 'prod3', text: 'Sulfuric Acid', group: 'product', matchId: 'raw3' },
    { id: 'prod4', text: 'Cement, Glass', group: 'product', matchId: 'raw4' },
    { id: 'prod5', text: 'Chlorine, Sodium Hydroxide', group: 'product', matchId: 'raw6' },
];


// --- Main Page Component ---
const IndustrialChemistryIntroPage = () => { // Renamed component
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
                 Unit 3: Industrial Chemistry - Introduction {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             The Chemical Industry: Transforming Resources
                         </h2>
                         <p className="leading-relaxed">
                            The <strong className="text-coral dark:text-gold font-semibold">Industrial Revolution</strong> catalyzed the growth of chemical industries, transforming how societies produce essential goods. Today, these industries convert raw materials into countless products vital for modern life, including synthetic fibers, plastics, fertilizers, medicines, and construction materials.
                         </p>
                         <p className="mt-3 leading-relaxed">
                            For developing nations like Ethiopia, rich in natural resources such as metal ores (iron, gold, tantalum), salt, coal, and potential oil/gas reserves, developing a robust chemical industry is key to economic growth and utilizing these assets effectively.
                         </p>
                    </section>

                    {/* What is Industrial Chemistry? */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             What is Industrial Chemistry?
                         </h2>
                          <p className="leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Industrial chemistry</strong> bridges the gap between laboratory chemistry and large-scale manufacturing. It applies chemical and physical principles to transform <strong className="text-coral dark:text-gold">raw materials</strong> (natural or synthetic) into <strong className="text-teal dark:text-mint">useful products</strong> efficiently, safely, and economically.
                          </p>
                          <p className="mt-3 leading-relaxed">
                             It's the engine of the chemical industry, focusing on processes like chemical reactions, purification, separation, and formulation to meet societal demands for materials with specific properties and quality.
                          </p>
                     </section>

                     {/* Key Features */}
                    <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Key Features of Chemical Industries
                         </h2>
                          <p className="leading-relaxed">
                             Chemical industries typically share several core characteristics:
                          </p>
                           <ul className="list-disc list-outside ml-6 space-y-2 mt-2">
                               <li><strong className="font-semibold">Raw Material Transformation:</strong> Converting basic inputs into more valuable finished or semi-finished goods.</li>
                                <li><strong className="font-semibold">Chemical Processes:</strong> Relying heavily on controlled chemical reactions, separations (like distillation, extraction), and refining techniques.</li>
                               <li><strong className="font-semibold">Energy Intensive:</strong> Manufacturing often requires substantial energy input for heating, cooling, pressure changes, and driving reactions.</li>
                               <li><strong className="font-semibold">Safety Focus:</strong> Handling potentially hazardous materials and processes necessitates strict safety protocols and equipment design.</li>
                                <li><strong className="font-semibold">Quality Control:</strong> Rigorous testing at various stages ensures products meet required purity, performance, and safety standards.</li>
                                <li><strong className="font-semibold">Scale:</strong> Operations range from batch processing to large-scale continuous production.</li>
                           </ul>
                     </section>


                      {/* Study Tips Section */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Visualization Tips
                         </h2>
                         <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                              <li><strong className="font-semibold">Think Flowcharts:</strong> Visualize industrial processes as a sequence: Raw Materials → Pre-treatment → Reaction → Separation/Purification → Product → Quality Control.</li>
                              <li><strong className="font-semibold">Connect Raw Materials to Products:</strong> Use the matching exercise and videos to link common inputs (oil, air, salt, minerals) to major outputs (plastics, fertilizers, chlorine, metals).</li>
                              <li><strong className="font-semibold">Focus on the 'Why':</strong> Understand *why* specific chemical reactions or processes are used (e.g., why electrolysis for aluminum? why cracking for gasoline?).</li>
                               <li><strong className="font-semibold">Scale Matters:</strong> Appreciate the difference between lab chemistry (grams) and industrial chemistry (tons). This involves challenges in heat transfer, mixing, safety, and economics.</li>
                               <li><strong className="font-semibold">Real-World Examples:</strong> Look at everyday objects (plastic bottle, clothing tag, fertilizer bag) and trace back the likely industrial chemical origins.</li>
                                <li><strong className="font-semibold">Key Terms:</strong> Define and understand terms like 'ore', 'raw material', 'catalyst', 'yield', 'byproduct', 'quality control'.</li>
                           </ul>
                     </section>

                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                      {/* Panel 1: What is Industrial Chemistry Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="uP7y430shwU" title="Video: What is Industrial Chemistry?"/> {/* Example Video ID */}
                     </div>

                     {/* Panel 2: Interactive Matching Exercise */}
                      <MatchingExercise title="Match Raw Material to Product" items={matchingItems} />


                     {/* Panel 3: How Stuff is Made Video (Example) */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          {/* Find a video showing a chemical process, e.g., fertilizer production, plastic molding */}
                         <YouTubeEmbed videoId="cY0wAAmVkMY" title="Video: How is Fertilizer Made?"/> {/* Example */}
                     </div>

                    {/* Panel 4: Role of Chemistry Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Core Concept Check</h3>
                          <MiniCheckQuestion
                             question="What is the fundamental role of chemistry in industrial processes?"
                             correctAnswer="To provide the understanding of reactions and properties needed to transform raw materials into desired products efficiently and safely."
                             explanation="Industrial chemistry applies core chemical principles like reaction kinetics, thermodynamics, equilibrium, and material science to large-scale manufacturing."
                         />
                     </div>

                      {/* Panel 5: Simulation Link (Process Simulation - harder to find simple ones) */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Chemical Processes</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Simulations of industrial processes are complex. Explore specific reactions (like Haber process for ammonia) in chemistry simulators.</p>
                         <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                             {/* Link to a relevant simulator or educational resource */}
                            <a href="https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_Chemistry_-_The_Central_Science_(Brown_et_al.)/15%3A_Chemical_Equilibrium/15.07%3A_Le_Chateliers_Principle" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Example: Le Chatelier's Principle (Affects Yield) - LibreTexts ↗</span>
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
                    Test Your Industrial Chemistry Basics!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Industrial Chemistry Intro Quiz</h2>
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
IndustrialChemistryIntroPage.displayName = 'IndustrialChemistryIntroPage';

export default IndustrialChemistryIntroPage;
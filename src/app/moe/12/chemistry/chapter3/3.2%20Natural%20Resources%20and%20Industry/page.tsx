'use client';

import { useState, ChangeEvent, Fragment } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import QuizQuestion from '@/components/QuizQuestion'; // Assuming this component exists
import Image from 'next/image'; // For placeholder image
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

interface DraggableItem {
    id: string;
    text: string;
    group: 'resource' | 'category'; // Type of item: resource or category
    correctCategoryId: string;
}

interface DropTarget {
    id: string; // e.g., 'renewable', 'non-renewable', 'lithosphere', 'atmosphere', etc.
    text: string; // Display name of the category
    group: 'category';
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

// Simple Drag and Drop Component (Conceptual - requires actual DnD library like react-dnd)
function DragDropCategorize({ title, items, targets }: { title: string, items: DraggableItem[], targets: DropTarget[] }) {
    // --- Basic State (Full DnD state is more complex) ---
    const [placedItems, setPlacedItems] = useState<{ [targetId: string]: DraggableItem[] }>({});
    const [unplacedItems, setUnplacedItems] = useState(items);
    const [feedback, setFeedback] = useState<{[itemId: string]: boolean | null}>({}); // Track correctness of placement

    // --- Placeholder Drag Handlers ---
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: DraggableItem) => {
        e.dataTransfer.setData("text/plain", item.id);
        e.currentTarget.classList.add('opacity-50'); // Visual cue for dragging
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData("text/plain");
        const item = items.find(i => i.id === itemId);
        const target = targets.find(t => t.id === targetId);

        if (item && target) {
             // Basic logic: Move item to target visually (actual library handles this better)
             setPlacedItems(prev => ({
                ...prev,
                [targetId]: [...(prev[targetId] || []), item]
            }));
            setUnplacedItems(prev => prev.filter(i => i.id !== itemId));
            // Clear previous feedback for this item if re-dropped
            setFeedback(prev => ({...prev, [itemId]: null}));
        }
         e.currentTarget.classList.remove('bg-yellow-100', 'dark:bg-yellow-800'); // Remove drop indicator
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Necessary to allow dropping
        e.currentTarget.classList.add('bg-yellow-100', 'dark:bg-yellow-800'); // Highlight drop zone
    };

     const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('bg-yellow-100', 'dark:bg-yellow-800'); // Remove drop indicator
    };

    // --- Placeholder Check Logic ---
    const checkAnswers = () => {
       // A real implementation would check if item.category matches targetId
       // This is complex without knowing the correct category for each item in props
       alert("Checking logic needs implementation based on correct item categories.");
       // Example check (if item data had correct category):
       // const newFeedback = {};
       // Object.keys(placedItems).forEach(targetId => {
       //     placedItems[targetId].forEach(item => {
       //         newFeedback[item.id] = item.correctCategoryId === targetId; // Assuming item has correctCategoryId
       //     });
       // });
       // setFeedback(newFeedback);
    };

    const resetExercise = () => {
        setPlacedItems({});
        setUnplacedItems(items);
        setFeedback({});
    };


    return (
        <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md font-inter">
            <h4 className="text-lg font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">{title}</h4>
            <p className="text-xs mb-4">Drag the resources from the pool to the correct category.</p>

            {/* Unplaced Items Pool */}
             <div className="mb-4 p-3 border border-dashed dark:border-gray-600 rounded min-h-[60px] flex flex-wrap gap-2 items-start">
                <span className="text-xs font-semibold self-center mr-2">Resources Pool:</span>
                {unplacedItems.map(item => (
                    <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={(e) => e.currentTarget.classList.remove('opacity-50')}
                        className={`text-xs p-1 px-2 rounded border cursor-grab bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 ${feedback[item.id] === false ? 'ring-2 ring-red-500' : ''} ${feedback[item.id] === true ? 'ring-2 ring-green-500' : ''}`}
                    >
                        {item.text}
                    </div>
                ))}
                 {unplacedItems.length === 0 && <span className="text-xs italic text-gray-400">All items placed.</span>}
            </div>

            {/* Drop Targets (Categories) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {targets.map(target => (
                    <div
                        key={target.id}
                        onDrop={(e) => handleDrop(e, target.id)}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className="p-3 border-2 border-dashed dark:border-gray-500 rounded min-h-[80px] transition-colors"
                    >
                        <h5 className="text-sm font-semibold mb-2 text-center">{target.text}</h5>
                        <div className="flex flex-wrap gap-1 justify-center items-start">
                           {(placedItems[target.id] || []).map(item => (
                                <div key={item.id} className={`text-xs p-1 px-2 rounded border bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 ${feedback[item.id] === false ? 'ring-2 ring-red-500' : ''} ${feedback[item.id] === true ? 'ring-2 ring-green-500' : ''}`}>
                                    {item.text}
                                </div>
                           ))}
                        </div>
                    </div>
                ))}
            </div>

             <div className="mt-4 flex justify-center space-x-4">
                <button onClick={checkAnswers} disabled={Object.keys(placedItems).length === 0} className="text-xs bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors disabled:opacity-50">Check Placements</button>
                <button onClick={resetExercise} className="text-xs bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-inter font-semibold py-1 px-3 rounded transition-colors">Reset</button>
            </div>
        </div>
    );
}

// --- Page Specific Data ---
const quizQuestions = [
    // ... (Quiz questions from previous step seem fine)
     {
        "question": "Which 'sphere' primarily provides gases like Nitrogen and Oxygen for the chemical industry?",
        "options": ["Lithosphere", "Hydrosphere", "Atmosphere", "Biosphere"],
        "correctAnswer": 2,
        "hint": "The air around us is the source of these essential industrial gases."
    },
    {
        "question": "Ocean water is a major source for which industrial chemicals?",
        "options": ["Ammonia and Sulfuric Acid", "Iron Ore and Coal", "Sodium Chloride (Salt), Magnesium, and Bromine", "Wood pulp and Natural rubber"],
        "correctAnswer": 2,
        "hint": "The hydrosphere contains vast amounts of dissolved salts and minerals."
    },
    {
        "question": "Coal, natural gas, and petroleum are examples of resources obtained from the:",
        "options": ["Atmosphere", "Hydrosphere", "Lithosphere", "Biosphere"],
        "correctAnswer": 2,
        "hint": "These fossil fuels are found within the Earth's crust."
    },
    {
        "question": "Vegetable oils, natural fibers (like cotton or wool), and sugars are derived from which source?",
        "options": ["Atmosphere", "Lithosphere", "Hydrosphere", "Biosphere"],
        "correctAnswer": 3,
        "hint": "These are products obtained from living organisms (plants and animals)."
    },
    {
        "question": "What defines a 'renewable' natural resource?",
        "options": ["It exists in unlimited quantities.", "It can be replenished relatively quickly through natural processes.", "It is man-made.", "It is found only underground."],
        "correctAnswer": 1,
        "hint": "Think of resources that can regrow or be naturally replaced within a human timescale, like forests or solar energy."
    },
    {
        "question": "Fossil fuels like coal and petroleum are considered 'non-renewable' because:",
        "options": ["They regenerate every year.", "They were formed over millions of years and are consumed much faster than they can form.", "They can be easily synthesized in a lab.", "They are found everywhere on Earth."],
        "correctAnswer": 1,
        "hint": "Their formation process is extremely slow compared to the rate of human consumption."
    },
    {
        "question": "Which category does the transformation of raw materials into finished products like cars or electronics primarily fall under?",
        "options": ["Agriculture", "Transportation", "Manufacturing Industry", "Service Industry"],
        "correctAnswer": 2,
        "hint": "Manufacturing involves making physical goods."
    },
    {
        "question": "The chemical industry is a subset of which broader industry type?",
        "options": ["Agriculture", "Manufacturing", "Mining", "Energy"],
        "correctAnswer": 1,
        "hint": "Chemical production involves *manufacturing* chemicals and materials."
    }
];

// Draggable items data (Ensure IDs are unique and match logic)
// Add 'correctCategoryId' to each item based on the targets below
const draggableResources: DraggableItem[] = [
    { id: 'res1', text: 'Air (N₂, O₂)', group: 'resource', correctCategoryId: 'cat1' },
    { id: 'res2', text: 'Ocean Water', group: 'resource', correctCategoryId: 'cat2' },
    { id: 'res3', text: 'Iron Ore', group: 'resource', correctCategoryId: 'cat3' },
    { id: 'res4', text: 'Trees/Wood', group: 'resource', correctCategoryId: 'cat4' },
    { id: 'res5', text: 'Coal/Oil', group: 'resource', correctCategoryId: 'cat3' },
    { id: 'res6', text: 'Salt (NaCl)', group: 'resource', correctCategoryId: 'cat3' }, // Also from lithosphere/hydrosphere
    { id: 'res7', text: 'Sugarcane', group: 'resource', correctCategoryId: 'cat4' },
    { id: 'res8', text: 'Cotton Plant', group: 'resource', correctCategoryId: 'cat4' },
];

// Drop target data
const resourceCategories: DropTarget[] = [
    { id: 'cat1', text: 'Atmosphere', group: 'category' },
    { id: 'cat2', text: 'Hydrosphere', group: 'category' },
    { id: 'cat3', text: 'Lithosphere', group: 'category' },
    { id: 'cat4', text: 'Biosphere', group: 'category' },
];


// --- Main Page Component ---
const NaturalResourcesIndustryPage = () => { // Renamed component
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
                3.2 Natural Resources and Industry {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Natural Resources Introduction */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Natural Resources: The Inputs
                         </h2>
                         <p className="leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Natural resources</strong> are materials or substances occurring in nature that can be exploited for economic gain. They are the fundamental raw materials for all industries, especially the chemical industry. These resources originate from the Earth's different spheres:
                         </p>
                         <ul className="list-disc list-outside ml-6 space-y-2 mt-2">
                             <li>
                                <strong className="font-semibold text-sky-600 dark:text-sky-400">Atmosphere (Air):</strong> Provides vast quantities (≈ 5x10¹⁵ tons) of gases like Nitrogen (<InlineMath>N_2</InlineMath>), Oxygen (<InlineMath>O_2</InlineMath>), Carbon Dioxide (<InlineMath>CO_2</InlineMath>), and noble gases (Ar, Ne, etc.), crucial for producing ammonia, fertilizers, and industrial gases.
                             </li>
                              <li>
                                 <strong className="font-semibold text-blue-600 dark:text-blue-400">Hydrosphere (Water):</strong> Oceans and seas (≈ 1.5x10²¹ L) are immense sources of water itself, and dissolved salts containing Sodium Chloride (NaCl), Magnesium (Mg), and Bromine (Br).
                             </li>
                             <li>
                                <strong className="font-semibold text-yellow-700 dark:text-yellow-500">Lithosphere (Earth's Crust):</strong> The source of mineral ores (iron, copper, aluminum, etc.), fossil fuels (coal, petroleum, natural gas), limestone, phosphate rock, sulfur, and salts.
                             </li>
                             <li>
                                <strong className="font-semibold text-green-600 dark:text-green-400">Biosphere (Living Organisms):</strong> Provides renewable resources like wood, plant oils, fibers (cotton, wool), sugars, starches, animal fats, leather, and natural rubber.
                             </li>
                         </ul>
                    </section>

                     {/* Classification of Resources */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Classification: Renewable vs. Non-Renewable
                         </h2>
                          <p className="leading-relaxed">
                             Natural resources are broadly categorized based on their rate of regeneration compared to their rate of consumption:
                          </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2 text-green-600 dark:text-mint">Renewable Resources</h3>
                           <p className="leading-relaxed">
                             These resources can be replenished naturally within a human timescale or are essentially inexhaustible. Examples include solar energy, wind energy, hydropower, geothermal energy, biomass (wood, crops), water (though fresh water availability can be limited), and soil. Sustainable management is key to their continued availability.
                           </p>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2 text-red-600 dark:text-coral">Non-Renewable Resources</h3>
                           <p className="leading-relaxed">
                              These resources exist in finite quantities and are consumed much faster than they are formed (often over geological timescales). Once depleted, they are effectively gone forever. Examples include fossil fuels (coal, oil, natural gas) and most mineral ores (iron, copper, aluminum, gold). Conservation and finding alternatives are crucial.
                           </p>
                    </section>

                     {/* Industry Definition & Classification */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Industry: Transforming Resources
                         </h2>
                         <p className="leading-relaxed">
                            An <strong className="text-teal dark:text-teal font-semibold">industry</strong> refers to economic activity concerned with processing raw materials and manufacturing goods in factories, or specific commercial enterprises like tourism or agriculture.
                         </p>
                         <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Manufacturing Industries</h3>
                         <p className="leading-relaxed">
                             These industries focus specifically on converting raw materials into tangible goods using labor, machinery, and systematic processes. They encompass a vast range, including food/beverage processing, textiles, apparel, leather goods, paper production, etc.
                         </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Chemical Industry</h3>
                           <p className="leading-relaxed">
                              A major subset of manufacturing, the <strong className="text-teal dark:text-teal font-semibold">chemical industry</strong> uses chemical reactions, separations, and purification techniques to:
                               <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                                  <li>Transform organic and inorganic raw materials into industrial chemicals.</li>
                                   <li>Extract and purify valuable substances from natural sources.</li>
                                  <li>Synthesize materials with specific desired properties (plastics, fibers, pharmaceuticals, etc.).</li>
                               </ul>
                           </p>
                            <p className="mt-3 leading-relaxed">
                               Chemical industries can be classified based on the raw materials they use (e.g., petrochemical industry using oil/gas, sugar industry using sugarcane) or the type of products they make (e.g., fertilizers, pharmaceuticals, plastics, paints).
                            </p>
                     </section>


                     {/* Study Tips Section */}
                      <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Visualization Tips
                         </h2>
                         <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                             <li><strong className="font-semibold">Categorize Resources:</strong> Practice sorting examples (like in the drag-and-drop) into Atmosphere, Hydrosphere, Lithosphere, and Biosphere. Think about where we get common materials from.</li>
                              <li><strong className="font-semibold">Renewable vs. Non-Renewable:</strong> Focus on the timescale of regeneration. Can it regrow/reform quickly (renewable) or does it take millions of years (non-renewable)? Visualize a forest regrowing vs. an oil deposit forming.</li>
                              <li><strong className="font-semibold">Industry Hierarchy:</strong> Understand that Manufacturing is broad, and the Chemical Industry is a specific, vital part of manufacturing focused on chemical transformations.</li>
                               <li><strong className="font-semibold">Link Inputs and Outputs:</strong> Connect specific raw materials to the major chemical industries that use them (e.g., Air → Ammonia/Fertilizers; Crude Oil → Plastics/Gasoline; Salt → Chlorine/NaOH). Use the matching exercise.</li>
                               <li><strong className="font-semibold">Visualize Processes (Simple):</strong> Even without complex diagrams, imagine taking air (N₂, O₂) and using energy + catalysts to make ammonia (NH₃) for fertilizer. Imagine drilling oil (lithosphere) and refining it into different fuels and plastic precursors.</li>
                                <li><strong className="font-semibold">Real-World Connection:</strong> Look at product labels (fertilizer composition, plastic type recycling codes) and think about their industrial origins.</li>
                           </ul>
                     </section>

                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                      {/* Panel 1: Natural Resources Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="7djzUnGt3GU" title="Video: Natural Resources Overview (Renewable/Non-Renewable)"/>
                      </div>

                      {/* Panel 2: Drag and Drop Exercise */}
                       {/* Note: The DragDropCategorize component needs a proper DnD library implementation */}
                       <DragDropCategorize
                           title="Categorize Natural Resources"
                           items={draggableResources}
                           targets={resourceCategories}
                       />

                     {/* Panel 3: How Chemical Industry Works Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="ufkLWAzVf0I" title="Video: The Chemical Industry Explained (Simplified)"/> {/* Example video */}
                     </div>

                     {/* Panel 4: Resource Origin Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Resource Origin Check</h3>
                           <MiniCheckQuestion
                              question="Bauxite, the primary ore for aluminum, is extracted from which Earth sphere?"
                              correctAnswer="Lithosphere (Earth's crust)."
                              explanation="Ores are minerals mined from the solid part of the Earth."
                          />
                      </div>

                     {/* Panel 5: Industry Type Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Industry Type Check</h3>
                           <MiniCheckQuestion
                              question="An enterprise that grows wheat, mills it into flour, and bakes bread involves which *two* broad industry types mentioned?"
                              correctAnswer="Agriculture (growing wheat) and Manufacturing (milling flour, baking bread - food processing)."
                              explanation="It starts with primary resource production (agriculture) and then involves transforming raw materials (manufacturing)."
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
                    Test Your Resources & Industry Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Natural Resources & Industry Quiz</h2>
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
NaturalResourcesIndustryPage.displayName = 'NaturalResourcesIndustryPage';

export default NaturalResourcesIndustryPage;
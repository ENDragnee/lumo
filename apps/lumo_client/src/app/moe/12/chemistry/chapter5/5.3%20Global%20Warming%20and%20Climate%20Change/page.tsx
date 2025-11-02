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

// Simulation Panel Component (iframe + external link)
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
const quizQuestions = [
    // ... (Original questions seem relevant, perhaps add one on relative impact)
      { question: "Which human activity is the LARGEST contributor to increased atmospheric CO₂ concentrations?", options: ["Deforestation", "Cement Production", "Burning Fossil Fuels (coal, oil, gas)", "Industrial Processes"], correctAnswer: 2, hint: "Combustion of fossil fuels for energy and transport releases vast amounts of stored carbon." },
      { question: "Which greenhouse gas, although less abundant than CO₂, has a much higher warming potential per molecule over shorter timescales?", options: ["Water Vapor (H₂O)", "Methane (CH₄)", "Nitrous Oxide (N₂O)", "Ozone (O₃)"], correctAnswer: 1, hint: "Methane traps significantly more heat than CO₂ initially, but breaks down faster in the atmosphere." },
      { question: "What natural phenomenon is essential for life but is amplified by excess greenhouse gases, leading to global warming?", options: ["Photosynthesis", "The Greenhouse Effect", "The Water Cycle", "Volcanic Eruptions"], correctAnswer: 1, hint: "The natural greenhouse effect keeps Earth warm enough for life; human activities enhance it." },
      { question: "Nitrous Oxide (N₂O) emissions are significantly linked to which human activity?", options: ["Refrigeration and air conditioning", "Agricultural practices (especially fertilizer use) and industrial processes", "Burning wood", "Nuclear power generation"], correctAnswer: 1, hint: "Soil microbes process nitrogen fertilizers, releasing N₂O." },
      { question: "Which common atmospheric gases do NOT significantly contribute to the greenhouse effect because they don't absorb infrared radiation well?", options: ["Carbon Dioxide (CO₂) and Water Vapor (H₂O)", "Methane (CH₄) and Nitrous Oxide (N₂O)", "Nitrogen (N₂) and Oxygen (O₂)", "Ozone (O₃) and CFCs"], correctAnswer: 2, hint: "These diatomic molecules lack the complex vibrational modes needed to absorb IR radiation." },
      { question: "Tropospheric Ozone (O₃), a component of smog, acts as a greenhouse gas. How is it primarily formed?", options: ["Direct emission from factories", "Reaction of pollutants (NOx, VOCs) in sunlight", "Release from oceans", "Breakdown of CO₂"], correctAnswer: 1, hint: "It's a secondary pollutant formed from photochemical reactions involving primary pollutants." },
      { question: "Halogenated compounds like CFCs and HCFCs are potent greenhouse gases AND also contribute to:", options: ["Acid Rain", "Eutrophication", "Stratospheric Ozone Depletion", "Soil Salinization"], correctAnswer: 2, hint: "These chemicals were phased out due to their damaging effect on the protective ozone layer." },
      { question: "What is the core principle of 'Green Chemistry'?", options: ["Using only green-colored chemicals", "Focusing exclusively on plant-based chemistry", "Designing chemical products and processes to reduce or eliminate hazardous substances", "Maximizing energy consumption in chemical reactions"], correctAnswer: 2, hint: "It aims for sustainability and reduced environmental impact throughout a chemical's lifecycle." },
       { question: "Which greenhouse gas persists in the atmosphere for the longest duration, contributing to long-term warming?", options: ["Methane (CH₄) (~12 years)", "Nitrous Oxide (N₂O) (~114 years)", "Tropospheric Ozone (O₃) (months)", "Carbon Dioxide (CO₂) (centuries to millennia)"], correctAnswer: 3, hint: "While some CO₂ cycles quickly, a significant fraction remains for very long periods." },
       { question: "Besides trapping heat, what is another major environmental consequence of increasing atmospheric CO₂?", options: ["Ocean Acidification", "Improved Crop Yields Globally", "Strengthening the Ozone Layer", "Cooling the Stratosphere"], correctAnswer: 0, hint: "CO₂ dissolves in ocean water, forming carbonic acid and lowering the pH." }
];

const trueFalseStatements: TrueFalseStatement[] = [
    { id: 1, statement: "Water vapor is technically a greenhouse gas.", isTrue: true, explanation: "Water vapor is a very potent greenhouse gas, but its concentration is primarily controlled by temperature (feedback) rather than direct human emissions (forcing)." },
    { id: 2, statement: "All greenhouse gases have the same ability to trap heat per molecule.", isTrue: false, explanation: "Gases have different Global Warming Potentials (GWPs). For example, over 100 years, methane (CH₄) traps much more heat per molecule than CO₂, but CO₂ persists longer." },
    { id: 3, statement: "The greenhouse effect is entirely a man-made phenomenon.", isTrue: false, explanation: "There is a natural greenhouse effect essential for life. Human activities have *enhanced* this natural effect, leading to global warming." },
    { id: 4, statement: "Reducing deforestation helps mitigate climate change.", isTrue: true, explanation: "Forests absorb large amounts of CO₂ through photosynthesis. Cutting them down releases this carbon and reduces future absorption capacity." },
    { id: 5, statement: "Green chemistry only focuses on reducing pollution at the end of a chemical process.", isTrue: false, explanation: "Green chemistry aims to prevent pollution throughout the entire lifecycle, from raw material choice and reaction design to final product and disposal." }
];


// --- KaTeX String Constants ---
const katex_CO2 = 'CO_2';
const katex_H2O = 'H_2O';
const katex_O2 = 'O_2';
const katex_CxHy = 'C_xH_y'; // Hydrocarbon
const katex_Combustion = `${katex_CxHy} + ${katex_O2} \\rightarrow ${katex_CO2} + ${katex_H2O} + \\text{heat}`;
const katex_CH4 = 'CH_4';
const katex_N2O = 'N_2O';
const katex_O3 = 'O_3';
const katex_CFC = '\\text{CFCs, HCFCs, HFCs}'; // Halogenated compounds


// --- Main Page Component ---
const GlobalWarmingClimateChangePage = () => { // Renamed component
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
                 Unit 5.2: Global Warming and Climate Change {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Chemistry's Role */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Chemistry and Climate Change
                         </h2>
                         <p className="leading-relaxed">
                            Climate change, driven largely by global warming, is a major environmental challenge. Chemistry plays a central role both in understanding the problem and in developing solutions. Many greenhouse gases responsible for warming are generated or influenced by chemical processes, both natural and human-induced.
                         </p>
                         <p className="mt-3 leading-relaxed">
                             Key sources linked to chemistry include:
                             <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                                 <li><strong className="font-semibold">Combustion of Fossil Fuels:</strong> Releasing vast amounts of <InlineMath math={katex_CO2}/>. (<InlineMath math={katex_Combustion}/>)</li>
                                 <li><strong className="font-semibold">Industrial Processes:</strong> Manufacturing cement releases <InlineMath math={katex_CO2}/>. Chemical production can release various greenhouse gases like <InlineMath math={katex_N2O}/> or halogenated compounds.</li>
                                  <li><strong className="font-semibold">Agriculture:</strong> Fertilizer use releases <InlineMath math={katex_N2O}/>. Livestock digestion and manure management release <InlineMath math={katex_CH4}/>.</li>
                                  <li><strong className="font-semibold">Deforestation:</strong> Reduces <InlineMath math={katex_CO2}/> uptake by photosynthesis and releases stored carbon when trees are burned or decay.</li>
                                  <li><strong className="font-semibold">Waste Decomposition:</strong> Landfills release <InlineMath math={katex_CH4}/> under anaerobic conditions.</li>
                             </ul>
                         </p>
                    </section>

                    {/* Greenhouse Effect Explained */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            The Greenhouse Effect
                         </h2>
                         <p className="leading-relaxed">
                             The <strong className="text-teal dark:text-teal font-semibold">greenhouse effect</strong> is a natural process vital for life on Earth. Certain gases in the atmosphere, known as <strong className="text-coral dark:text-gold font-semibold">greenhouse gases (GHGs)</strong>, trap some of the Earth's outgoing infrared (heat) radiation, preventing it from escaping directly into space. This keeps the planet warm enough to support life (average temperature ~15°C instead of -18°C).
                         </p>
                         {/* Visualization Point */}
                          <div className="mt-4 p-3 bg-yellow-100 dark:bg-soft-yellow/20 border-l-4 border-yellow-500 dark:border-soft-yellow rounded">
                             <p className="font-semibold font-inter text-sm text-yellow-800 dark:text-soft-yellow">Visualize This:</p>
                             <p className="text-sm font-inter text-dark-gray dark:text-light-gray mt-1">Imagine the atmosphere as a blanket. Greenhouse gases make the blanket thicker, trapping more heat underneath.</p>
                          </div>
                           <p className="mt-3 leading-relaxed">
                              Major natural greenhouse gases include water vapor (<InlineMath math={katex_H2O}/>), carbon dioxide (<InlineMath math={katex_CO2}/>), methane (<InlineMath math={katex_CH4}/>), and nitrous oxide (N<sub>2</sub>). While essential gases like Nitrogen (N<sub>2</sub>) and Oxygen (<InlineMath math={katex_O2}/>) make up most of the atmosphere, they do *not* absorb infrared radiation effectively and thus don't contribute significantly to the greenhouse effect.
                           </p>
                          <p className="mt-3 leading-relaxed">
                             <strong className="text-coral dark:text-gold">Global Warming</strong> occurs when human activities increase the concentrations of these greenhouse gases (especially CO₂, CH₄, N₂O) and introduce new, potent ones (like CFCs), enhancing the natural greenhouse effect and causing the planet's average temperature to rise.
                          </p>
                     </section>

                     {/* Major Greenhouse Gases */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Major Human-Influenced Greenhouse Gases
                         </h2>
                           <p className="leading-relaxed">
                              Different greenhouse gases have varying sources, atmospheric lifetimes, and heat-trapping abilities (Global Warming Potential - GWP). Key contributors include:
                           </p>
                            {/* Table moved to right panel */}
                             <ul className="list-disc list-outside ml-6 space-y-2 mt-2 text-sm">
                                 <li><strong className="font-semibold"><InlineMath math={katex_CO2}/> (Carbon Dioxide):</strong> Largest contributor (~53%). Sources: Fossil fuel burning, deforestation, cement production. Lifetime: Very long (centuries to millennia for full removal).</li>
                                 <li><strong className="font-semibold"><InlineMath math={katex_CH4}/> (Methane):</strong> Significant contributor (~15%). Sources: Livestock, agriculture (rice paddies), natural gas leaks, landfills. Lifetime: ~12 years (potent but shorter-lived).</li>
                                  <li><strong className="font-semibold">Halogenated Compounds (<InlineMath math={katex_CFC}/>, etc.):</strong> (~11%). Sources: Refrigerants, aerosols (older ones), industrial processes. Lifetime: Varies hugely (months to tens of thousands of years). Very high GWP. Also deplete ozone.</li>
                                 <li><strong className="font-semibold">Tropospheric <InlineMath math={katex_O3}/> (Ozone):</strong> (~11%). Not directly emitted, but formed from NOx, VOCs in sunlight (smog component). Lifetime: Months.</li>
                                  <li><strong className="font-semibold"><InlineMath math={katex_N2O}/> (Nitrous Oxide):</strong> (~11%). Sources: Fertilizer use, fossil fuel combustion, industrial processes, wastewater treatment. Lifetime: ~114 years. High GWP.</li>
                             </ul>
                     </section>

                     {/* Green Chemistry */}
                      <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Green Chemistry: A Path Forward
                         </h2>
                         <p className="leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Green chemistry</strong> offers solutions by focusing on designing chemical products and processes that are inherently safer and more sustainable. Its principles aim to:
                            <ul className="list-disc list-inside ml-4 space-y-1 mt-2 text-sm">
                                <li>Prevent waste generation.</li>
                                <li>Maximize atom economy (incorporating reactants into the final product).</li>
                                <li>Use less hazardous chemical syntheses and substances.</li>
                                <li>Design safer chemicals.</li>
                                <li>Use safer solvents and auxiliaries.</li>
                                <li>Improve energy efficiency in processes.</li>
                                <li>Utilize renewable feedstocks.</li>
                                <li>Reduce unnecessary derivatization steps.</li>
                                <li>Employ catalytic reagents over stoichiometric ones.</li>
                                <li>Design products for degradation after use.</li>
                                <li>Implement real-time analysis for pollution prevention.</li>
                                <li>Develop inherently safer chemistry for accident prevention.</li>
                            </ul>
                         </p>
                          <p className="mt-3 leading-relaxed">
                              By applying these principles, chemistry can help reduce greenhouse gas emissions, develop alternative energy sources (solar cells, biofuels, hydrogen), create materials for carbon capture, and design more efficient industrial processes, contributing significantly to mitigating climate change.
                          </p>
                      </section>

                     {/* Study Tips Section */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Visualization Tips
                         </h2>
                         <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                              <li><strong className="font-semibold">Greenhouse Analogy:</strong> Visualize sunlight (visible light) passing through glass, warming the inside. The heat (infrared) trying to escape is then trapped by the glass, similar to how GHGs trap IR radiation in the atmosphere.</li>
                              <li><strong className="font-semibold">Key GHGs & Sources:</strong> Create flashcards or a table linking each major GHG (CO₂, CH₄, N₂O, O₃, CFCs) to its primary human-caused sources. Use the summary table.</li>
                              <li><strong className="font-semibold">Lifetime vs. Impact:</strong> Understand that some gases (like CH₄) are potent short-term warmers, while others (like CO₂) persist much longer, causing cumulative long-term warming.</li>
                               <li><strong className="font-semibold">Distinguish Natural vs. Enhanced Effect:</strong> Know that the greenhouse effect is natural and necessary, but human activities are *enhancing* it unsustainably.</li>
                               <li><strong className="font-semibold">Green Chemistry Principles:</strong> Focus on the core idea – preventing pollution and hazard at the source through smarter chemical design. Pick 2-3 key principles (e.g., waste prevention, atom economy, energy efficiency) to remember initially.</li>
                                <li><strong className="font-semibold">Visualize Solutions:</strong> Think about how chemistry contributes to solutions: better solar cells, catalysts for cleaner fuel production, materials for capturing CO₂, biodegradable plastics.</li>
                                <li><strong className="font-semibold">Use Interactive Exercises:</strong> The True/False and Mini-Questions reinforce key facts and concepts. Explore the linked simulations.</li>
                           </ul>
                     </section>


                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                      {/* Panel 1: Greenhouse Effect Video */}
                       <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <YouTubeEmbed videoId="sTvqIijqvTg" title="Video: The Greenhouse Effect Explained"/>
                       </div>

                      {/* Panel 2: GHG Summary Table */}
                       <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 font-inter text-xs overflow-x-auto">
                            <h3 className="text-lg font-semibold font-inter mb-3 text-center text-blue-700 dark:text-blue-300">Major Greenhouse Gases (Human Impact)</h3>
                             <table className="table-auto w-full border-collapse text-left">
                                <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700">
                                    <th className="border dark:border-gray-600 p-1.5">Gas</th>
                                    <th className="border dark:border-gray-600 p-1.5">Main Sources</th>
                                    <th className="border dark:border-gray-600 p-1.5">Avg. Lifetime</th>
                                    <th className="border dark:border-gray-600 p-1.5">Contribution %</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800">
                                <tr><td className="border dark:border-gray-600 p-1.5">CO₂</td><td className="border dark:border-gray-600 p-1.5">Fossil fuels, Deforestation, Cement</td><td className="border dark:border-gray-600 p-1.5">100s-1000s yrs</td><td className="border dark:border-gray-600 p-1.5">~53%</td></tr>
                                <tr><td className="border dark:border-gray-600 p-1.5">CH₄</td><td className="border dark:border-gray-600 p-1.5">Livestock, Agriculture, Gas Leaks, Waste</td><td className="border dark:border-gray-600 p-1.5">~12 yrs</td><td className="border dark:border-gray-600 p-1.5">~15%</td></tr>
                                <tr><td className="border dark:border-gray-600 p-1.5">Halogenated Cmpds</td><td className="border dark:border-gray-600 p-1.5">Refrigerants, Solvents, Industry</td><td className="border dark:border-gray-600 p-1.5">Varies (yrs to millennia)</td><td className="border dark:border-gray-600 p-1.5">~11%</td></tr>
                                <tr><td className="border dark:border-gray-600 p-1.5">Tropospheric O₃</td><td className="border dark:border-gray-600 p-1.5">From NOx + VOCs + Sunlight</td><td className="border dark:border-gray-600 p-1.5">Months</td><td className="border dark:border-gray-600 p-1.5">~11%</td></tr>
                                <tr><td className="border dark:border-gray-600 p-1.5">N₂O</td><td className="border dark:border-gray-600 p-1.5">Fertilizers, Industry, Combustion</td><td className="border dark:border-gray-600 p-1.5">~114 yrs</td><td className="border dark:border-gray-600 p-1.5">~11%</td></tr>
                                </tbody>
                            </table>
                             <MiniCheckQuestion
                              question="Which two gases listed have the longest atmospheric lifetimes, contributing to warming for centuries or more?"
                              correctAnswer="Carbon Dioxide (CO₂) and some Halogenated Compounds (like certain CFCs)."
                              explanation="CO₂ persists for extremely long times, while methane (CH₄) and tropospheric ozone (O₃) break down much faster, though they are potent while present. N₂O also lasts over a century."
                           />
                       </div>


                     {/* Panel 3: Climate Change Impacts Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <YouTubeEmbed videoId="G4H1N_yXBiA" title="Video: Climate Change Impacts Overview"/>
                      </div>

                       {/* Panel 4: Green Chemistry Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="pUAkJNeTce0" title="Video: Introduction to Green Chemistry Principles"/>
                           <MiniCheckQuestion
                              question="Which Green Chemistry principle directly addresses minimizing waste *before* it is created?"
                              correctAnswer="Prevention (Principle 1)."
                              explanation="The first principle states it's better to prevent waste than to treat or clean it up after it has been created."
                          />
                      </div>


                     {/* Panel 5: True/False Exercise */}
                       <TrueFalseExercise title="Climate Facts: True or False?" statements={trueFalseStatements} />


                      {/* Panel 6: Simulation Link */}
                       <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                           <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Greenhouse Effect</h3>
                           <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Visualize how greenhouse gases trap heat.</p>
                           <SimulationPanel
                                title="PhET: The Greenhouse Effect"
                                description="Adjust GHG concentrations and see the effect on temperature."
                                // Note: PhET Java sims might need CheerpJ or alternative HTML5 sims
                                externalUrl="https://phet.colorado.edu/sims/html/greenhouse-effect/latest/greenhouse-effect_en.html"
                                // embedUrl="URL_IF_EMBEDDABLE" // Optional: Add if an embeddable version exists
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
                    Test Your Climate Change Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Global Warming & Green Chem Quiz</h2>
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
GlobalWarmingClimateChangePage.displayName = 'GlobalWarmingClimateChangePage';

export default GlobalWarmingClimateChangePage;
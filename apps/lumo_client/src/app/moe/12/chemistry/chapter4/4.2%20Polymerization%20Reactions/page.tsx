'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, ChangeEvent, Fragment } from 'react';
import QuizQuestion from '@/components/QuizQuestion'; // Assuming this component exists
import Image from 'next/image'; // For potential images
import 'katex/dist/katex.min.css';
import { QuizQuestionProps } from "@/types/QuizQuestion"

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

interface Monomer {
    id: string;
    name: string;
    structure: string; // KaTeX or simple text
    type: 'addition' | 'condensation_A' | 'condensation_B'; // Type for matching
    functionalGroups: number;
}

interface PolymerBuilderProps {
     title: string;
     monomers: Monomer[];
}


// --- Reusable Components (Styled + FIXED return statements) ---

// YouTube Embed Component
function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  // *** ADDED return statement and JSX ***
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

  // *** ADDED return statement and JSX ***
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

    // *** ADDED return statement and JSX ***
    return (
        <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md font-inter">
            <h4 className="text-lg font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">{title}</h4>
            <div className="space-y-4">
                {statements.map((item) => (
                    <div key={item.id} className={`p-3 border rounded ${feedback[item.id] === 'correct' ? 'border-teal bg-mint/20' : feedback[item.id] === 'incorrect' ? 'border-red-500 bg-coral/20' : 'border-gray-300 dark:border-gray-600'}`}>
                        <p className="text-sm mb-2 text-dark-gray dark:text-light-gray">{item.statement}</p>
                        <div className="flex space-x-3">
                             <button onClick={() => handleAnswer(item.id, true)} className={`text-xs px-3 py-1 rounded border transition-colors ${answers[item.id] === true ? 'bg-teal/80 text-white border-teal' : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500'}`}> True </button>
                             <button onClick={() => handleAnswer(item.id, false)} className={`text-xs px-3 py-1 rounded border transition-colors ${answers[item.id] === false ? 'bg-coral/80 text-white border-coral' : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500'}`}> False </button>
                        </div>
                         {showAllFeedback && feedback[item.id] === 'incorrect' && ( <p className="text-xs mt-2 text-red-700 dark:text-coral"> <strong className="font-semibold">Explanation:</strong> {item.explanation} (Correct answer was: {item.isTrue ? 'True' : 'False'}) </p> )}
                         {showAllFeedback && feedback[item.id] === 'correct' && ( <p className="text-xs mt-2 text-green-700 dark:text-mint font-semibold">Correct!</p> )}
                          {showAllFeedback && feedback[item.id] === null && ( <p className="text-xs mt-2 text-gray-500 italic">Not answered.</p> )}
                    </div>
                ))}
            </div>
             <div className="mt-4 flex justify-center space-x-4">
                <button onClick={checkAllAnswers} className="text-xs bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors">Check All</button>
                <button onClick={resetExercise} className="text-xs bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-inter font-semibold py-1 px-3 rounded transition-colors">Reset</button>
            </div>
        </div>
    );
}

// Interactive Polymer Builder (Conceptual)
function PolymerBuilder({ title, monomers }: PolymerBuilderProps) { // Added Props type
    const [chain, setChain] = useState<Monomer[]>([]);
    const [feedback, setFeedback] = useState<string>('');
    const [showHint, setShowHint] = useState(false);

    const addMonomer = (monomer: Monomer) => { /* ... (logic remains the same) ... */ };
    const resetChain = () => { /* ... (logic remains the same) ... */ };
    const chainRepresentation = chain.map(m => `-[${m.structure}]`).join('') + (chain.length > 0 ? '-' : '');

    // *** ADDED return statement and JSX ***
    return (
        <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md font-inter">
            <h4 className="text-lg font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">{title}</h4>
             <p className="text-xs mb-3">Click monomers below to add them to the chain. Follow polymerization rules!</p>
             <div className="mb-3 flex flex-wrap gap-2"> {/* Monomer Pool */}
                 <span className="text-sm font-semibold mr-2 self-center">Available Monomers:</span>
                 {monomers.map(m => ( <button key={m.id} onClick={() => addMonomer(m)} className="text-xs p-1 px-2 rounded border bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 border-gray-300 dark:border-gray-500 transition-colors" title={`Add ${m.name}`} > <InlineMath math={m.structure} /> ({m.name}) </button> ))}
             </div>
             <div className="mb-3 p-3 border border-dashed dark:border-gray-600 rounded min-h-[40px] bg-gray-50 dark:bg-gray-700 overflow-x-auto text-sm"> {/* Chain Display */}
                 <span className="text-xs font-semibold mr-2">Chain:</span>
                 {chain.length > 0 ? <InlineMath math={chainRepresentation} /> : <span className="italic text-gray-400">Empty</span>}
                 <span className="ml-2 text-xs">(DP = {chain.length})</span>
             </div>
             {feedback && <p className={`text-xs mb-2 ${showHint ? 'text-coral dark:text-gold' : ''}`}>{feedback}</p>} {/* Feedback */}
              <div className="flex justify-center space-x-4"> {/* Controls */}
                 <button onClick={resetChain} className="text-xs bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-inter font-semibold py-1 px-3 rounded transition-colors">Reset Chain</button>
             </div>
         </div>
    );
}


// --- Page Specific Data ---
const quizQuestions:  QuizQuestionProps[]= [ /* ... quiz questions ... */ ];
const trueFalseStatements: TrueFalseStatement[] = [ /* ... true/false statements ... */ ];
const builderMonomers: Monomer[] = [ /* ... monomer data ... */ ];
// --- KaTeX Constants ---
const katex_n = 'n'; /* ... other constants ... */

// --- Main Page Component ---
const PolymerizationReactionsPage = () => {
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
    // Overall structure remains the same
    <div className="bg-off-white text-dark-gray dark:bg-deep-navy dark:text-light-gray min-h-screen font-lora">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
            {/* ... Title ... */}
             <h1 className="text-4xl lg:text-5xl font-bold font-playfair mb-8 lg:mb-12 text-center">
                4.2 Polymerization Reactions
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">
                   {/* ... Text content for sections: Introduction, Addition Polymerization, Condensation Polymerization, Study Tips ... */}
                    {/* Make sure to use the helper components correctly here */}
                     {/* Example for image placeholders (replace with actual images if available) */}
                     {/* <div className="text-center my-4"> <img src="/path/to/image.png" alt="Description" className="inline-block max-w-xs h-auto"/> </div> */}
                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                    {/* Use the helper components here - THIS IS WHERE THE ERROR WAS */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="e1hfaDDHcuk" title="Video: Polymerization Explained (Addition & Condensation)"/>
                    </div>
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <YouTubeEmbed videoId="uQ1RrHVO0BA" title="Video: Addition Polymerization Mechanism"/>
                         <MiniCheckQuestion
                            question="What happens to the double bond in ethylene monomers during polyethylene formation?"
                            correctAnswer="It breaks, and the electrons form single bonds to link adjacent monomer units."
                            explanation="The pi bond of the C=C double bond opens up to allow sigma bond formation between monomers."
                        />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <YouTubeEmbed videoId="0jhDem_IA44" title="Video: Condensation Polymerization (Nylon Example)"/>
                          <MiniCheckQuestion
                             question="What small molecule is typically eliminated when forming Nylon 6,6 from a diamine and a dicarboxylic acid?"
                             correctAnswer="Water (H₂O)."
                             explanation="The -NH₂ group of the diamine reacts with the -COOH group of the diacid, forming an amide linkage (-CONH-) and releasing water."
                         />
                    </div>
                     <PolymerBuilder title="Interactive Polymer Builder" monomers={builderMonomers} />
                     <TrueFalseExercise title="Polymerization Facts: True or False?" statements={trueFalseStatements} />
                 </aside>
            </div>

            {/* ... Quiz Button ... */}
             <div className='flex justify-center items-center mt-12 lg:mt-16'> <button onClick={() => setShowQuiz(true)} className="w-full sm:w-1/2 lg:w-1/3 bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-3 px-6 rounded-lg transition-colors text-lg shadow-md" > Test Your Polymerization Knowledge! </button> </div>
        </main>

         {/* ... Quiz Modal ... */}
         {showQuiz && ( <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"> <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700"> <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button> <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Polymerization Quiz</h2> <div className="space-y-6 font-inter"> {quizQuestions.map((q, index) => ( <QuizQuestion key={index} /* questionNumber={index + 1} */ question={q.question} options={q.options} correctAnswer={q.correctAnswer} hint={q.hint} selectedAnswer={selectedAnswers[index]} showResults={showResults} onSelectAnswer={(answerIndex: number) => handleAnswerSelect(index, answerIndex)} /> ))} </div> <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4"> {!showResults ? ( <button onClick={handleSubmit} className="w-full sm:w-auto bg-teal hover:bg-opacity-80 dark:bg-mint dark:text-deep-navy text-white font-bold font-inter py-2 px-6 rounded transition-colors disabled:opacity-50" disabled={selectedAnswers.includes(null)}> Submit Answers </button> ) : <div/>} <button onClick={resetQuiz} className="w-full sm:w-auto bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-2 px-6 rounded transition-colors"> Close Quiz </button> </div> {showResults && ( <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center"> <h3 className="text-xl font-bold font-playfair mb-2 text-dark-gray dark:text-light-gray">Quiz Results</h3> <p className="text-lg font-inter text-dark-gray dark:text-light-gray"> You got <strong className="text-teal dark:text-mint">{score}</strong> out of <strong className="text-teal dark:text-mint">{quizQuestions.length}</strong> correct! </p> <p className="text-2xl font-bold font-inter mt-1 text-dark-gray dark:text-light-gray"> ({((score / quizQuestions.length) * 100).toFixed(0)}%) </p> </div> )} </div> </div> )}
    </div>
  );
}

// Assign display name
PolymerizationReactionsPage.displayName = 'PolymerizationReactionsPage';

export default PolymerizationReactionsPage;
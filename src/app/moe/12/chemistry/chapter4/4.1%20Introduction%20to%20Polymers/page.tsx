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
    const [answers, setAnswers] = useState<{ [key: number]: boolean | null }>({}); // { statementId: userAnswer (true/false) }
    const [feedback, setFeedback] = useState<{ [key: number]: 'correct' | 'incorrect' | null }>({});
    const [showAllFeedback, setShowAllFeedback] = useState(false);

    const handleAnswer = (id: number, answer: boolean) => {
        setAnswers(prev => ({ ...prev, [id]: answer }));
        // Provide immediate feedback if desired, or wait for Check All
        // const correct = statements.find(s => s.id === id)?.isTrue === answer;
        // setFeedback(prev => ({ ...prev, [id]: correct ? 'correct' : 'incorrect' }));
        setShowAllFeedback(false); // Reset overall feedback if changing an answer
    };

    const checkAllAnswers = () => {
        const newFeedback: { [key: number]: 'correct' | 'incorrect' | null } = {};
        statements.forEach(statement => {
            if (answers[statement.id] !== null && answers[statement.id] !== undefined) {
                newFeedback[statement.id] = (answers[statement.id] === statement.isTrue) ? 'correct' : 'incorrect';
            } else {
                 newFeedback[statement.id] = null; // Not answered
            }
        });
        setFeedback(newFeedback);
        setShowAllFeedback(true);
    };

     const resetExercise = () => {
        setAnswers({});
        setFeedback({});
        setShowAllFeedback(false);
    };

    return (
        <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md font-inter">
            <h4 className="text-lg font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">{title}</h4>
            <div className="space-y-4">
                {statements.map((item) => (
                    <div key={item.id} className={`p-3 border rounded ${feedback[item.id] === 'correct' ? 'border-teal bg-mint/20' : feedback[item.id] === 'incorrect' ? 'border-red-500 bg-coral/20' : 'border-gray-300 dark:border-gray-600'}`}>
                        <p className="text-sm mb-2 text-dark-gray dark:text-light-gray">{item.statement}</p>
                        <div className="flex space-x-3">
                             <button
                                onClick={() => handleAnswer(item.id, true)}
                                className={`text-xs px-3 py-1 rounded border transition-colors ${answers[item.id] === true ? 'bg-teal/80 text-white border-teal' : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500'}`}
                            >
                                True
                            </button>
                             <button
                                onClick={() => handleAnswer(item.id, false)}
                                className={`text-xs px-3 py-1 rounded border transition-colors ${answers[item.id] === false ? 'bg-coral/80 text-white border-coral' : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500'}`}
                             >
                                False
                             </button>
                        </div>
                         {/* Show explanation only after checking all */}
                         {showAllFeedback && feedback[item.id] === 'incorrect' && (
                            <p className="text-xs mt-2 text-red-700 dark:text-coral">
                                <strong className="font-semibold">Explanation:</strong> {item.explanation} (Correct answer was: {item.isTrue ? 'True' : 'False'})
                            </p>
                         )}
                         {showAllFeedback && feedback[item.id] === 'correct' && (
                             <p className="text-xs mt-2 text-green-700 dark:text-mint font-semibold">Correct!</p>
                         )}
                          {showAllFeedback && feedback[item.id] === null && (
                             <p className="text-xs mt-2 text-gray-500 italic">Not answered.</p>
                         )}
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


// --- Page Specific Data ---
const quizQuestions = [
  { question: "What is the definition of a polymer?", options: ["A single, very large molecule", "A molecule built from many repeating smaller units (monomers)", "A mixture of different small molecules", "A type of crystal"], correctAnswer: 1, hint: "The name 'polymer' comes from Greek 'poly' (many) and 'meros' (parts)." },
  { question: "The small, repeating units that make up a polymer are called:", options: ["Oligomers", "Isomers", "Monomers", "Dimers"], correctAnswer: 2, hint: "Think 'mono' meaning one unit." },
  { question: "Which of the following is a natural polymer?", options: ["Polyethylene", "PVC", "Cellulose (in wood/cotton)", "Nylon"], correctAnswer: 2, hint: "Cellulose is produced by plants." },
  { question: "Which molecule is the monomer for polyethylene?", options: ["Glucose", "Ethylene (Ethene)", "Amino Acid", "Styrene"], correctAnswer: 1, hint: "Poly-ethylene literally means 'many ethylenes'." },
  { question: "Proteins are biological polymers made from which type of monomer?", options: ["Sugars", "Nucleotides", "Amino Acids", "Fatty Acids"], correctAnswer: 2, hint: "Amino acids link together via peptide bonds to form protein chains." },
  { question: "The term 'Degree of Polymerization' (DP) refers to:", options: ["The temperature at which polymerization occurs", "The number of repeating monomer units in a polymer chain", "The molar mass of the monomer", "The type of catalyst used"], correctAnswer: 1, hint: "It indicates how many 'mers' are linked together." },
  { question: "If a polymer chain is highly branched, it tends to form:", options: ["A perfectly linear structure", "A crystalline solid", "A complex, interconnected 3D network", "Individual small rings"], correctAnswer: 2, hint: "Branching prevents chains from packing neatly and leads to network formation." },
  { question: "What is an oligomer?", options: ["A polymer with only one type of monomer", "A very high molecular weight polymer", "A molecule with a small number of repeating monomer units (less than ~100)", "A branched polymer"], correctAnswer: 2, hint: "'Oligo-' means 'few'." }
];

const trueFalseStatements: TrueFalseStatement[] = [
    { id: 1, statement: "All polymers are man-made synthetic materials.", isTrue: false, explanation: "Many polymers are natural, like cellulose, starch, proteins, and DNA." },
    { id: 2, statement: "The repeating unit in a polymer is always identical to the monomer it was made from.", isTrue: false, explanation: "While often true (like polyethylene from ethylene), sometimes the repeat unit slightly differs due to the polymerization reaction (e.g., condensation polymers lose small molecules like water)." },
    { id: 3, statement: "A polymer molecule typically contains thousands or millions of atoms.", isTrue: true, explanation: "Polymers are macromolecules, formed by linking many monomers, resulting in very high molar masses." },
    { id: 4, statement: "The properties of a polymer depend only on the type of monomer used.", isTrue: false, explanation: "Properties also depend heavily on chain length (DP), branching, cross-linking, and arrangement (crystallinity)." },
    { id: 5, statement: "Glucose is a polymer.", isTrue: false, explanation: "Glucose is a monomer; polysaccharides like starch and cellulose are polymers made *from* glucose monomers." }
];

// --- KaTeX Constants ---
// (Minimal needed for this section)
const katex_Glucose = 'C_6H_{12}O_6';
const katex_Ethylene = 'C_2H_4'; // or CH₂=CH₂
const katex_AminoAcid = 'NH_2{-}CHR{-}COOH'; // Generic amino acid


// --- Main Page Component ---
const IntroductionToPolymersPage = () => { // Renamed component
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
                4.1 Introduction to Polymers {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column: Conceptual explanations */}
                <article className="lg:col-span-7 space-y-6">

                    {/* What are Polymers? */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             The World of Giant Molecules
                         </h2>
                         <p className="leading-relaxed">
                           Imagine building structures with tiny bricks. Now imagine linking thousands, even millions, of those bricks together in long chains or complex networks. That's the fundamental idea behind <strong className="text-teal dark:text-teal font-semibold">polymers</strong>.
                         </p>
                         <p className="mt-3 leading-relaxed">
                           The word "polymer" comes from Greek: <span className="italic text-coral dark:text-gold">poly</span> (meaning "many") and <span className="italic text-coral dark:text-gold">meros</span> (meaning "parts"). Polymers are <strong className="text-teal dark:text-teal font-semibold">macromolecules</strong> – very large molecules composed of many small, repeating structural units.
                         </p>
                          {/* Visualization Point */}
                          <div className="mt-4 p-3 bg-yellow-100 dark:bg-soft-yellow/20 border-l-4 border-yellow-500 dark:border-soft-yellow rounded">
                             <p className="font-semibold font-inter text-sm text-yellow-800 dark:text-soft-yellow">Visualize This:</p>
                             <p className="text-sm font-inter text-dark-gray dark:text-light-gray mt-1">Think of a long freight train. The entire train is the polymer. Each individual boxcar is the repeating unit, called a <strong className="text-teal dark:text-teal">monomer</strong>.</p>
                          </div>
                    </section>

                    {/* Monomers and Repeat Units */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Monomers: The Building Blocks
                         </h2>
                         <p className="leading-relaxed">
                            The small molecules that link together to form a polymer are called <strong className="text-teal dark:text-teal font-semibold">monomers</strong> ("mono" meaning "one"). The process of linking monomers is called <strong className="text-coral dark:text-gold">polymerization</strong>.
                         </p>
                          <p className="mt-3 leading-relaxed">
                             Examples:
                             <ul className="list-disc list-outside ml-6 space-y-1 mt-2 text-sm">
                                <li><strong className="font-semibold">Ethylene (<InlineMath math={katex_Ethylene}/>)</strong> monomers link up to form the polymer <strong className="text-teal dark:text-teal">Polyethylene</strong> (used in plastic bags, bottles).</li>
                                 <li><strong className="font-semibold">Glucose (<InlineMath math={katex_Glucose}/>)</strong> monomers link up to form natural polymers like <strong className="text-teal dark:text-teal">Cellulose</strong> (wood, cotton) and <strong className="text-teal dark:text-teal">Starch</strong>.</li>
                                 <li><strong className="font-semibold">Amino Acids (<InlineMath math={katex_AminoAcid}/>)</strong> monomers link up via peptide bonds to form <strong className="text-teal dark:text-teal">Proteins</strong> (essential biological molecules).</li>
                             </ul>
                         </p>
                         <p className="mt-3 leading-relaxed">
                            The <strong className="text-coral dark:text-gold">repeating unit</strong> within the polymer chain usually corresponds closely to the original monomer structure.
                         </p>
                     </section>

                     {/* Polymer Size and Structure */}
                      <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Polymer Size and Structure
                         </h2>
                          <p className="leading-relaxed">
                             Polymers are large! Their size is often described by:
                              <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                  <li><strong className="font-semibold">Molar Mass:</strong> Can range from thousands to millions of g/mol.</li>
                                  <li><strong className="font-semibold">Degree of Polymerization (DP):</strong> The number of monomer units in an average polymer chain. Typically, DP is greater than 100 for a substance to be considered a polymer (structures with fewer repeating units are called <strong className="text-coral dark:text-gold">oligomers</strong>). Molar Mass ≈ (Molar Mass of Repeat Unit) × DP.</li>
                              </ul>
                          </p>
                           <p className="mt-3 leading-relaxed">
                                Polymer chains aren't always simple straight lines:
                                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                     <li><strong className="font-semibold">Linear Polymers:</strong> Monomers linked end-to-end in a single chain.</li>
                                     <li><strong className="font-semibold">Branched Polymers:</strong> Have side chains branching off the main polymer backbone.</li>
                                      <li><strong className="font-semibold">Cross-linked/Network Polymers:</strong> Chains are interconnected by covalent bonds, forming a large, rigid 3D network (e.g., vulcanized rubber, thermosetting plastics).</li>
                                </ul>
                           </p>
                           <p className="mt-3 leading-relaxed">
                               The structure (linear, branched, network) and chain length (DP) significantly influence the polymer's physical properties (strength, flexibility, melting point, solubility).
                           </p>
                      </section>


                      {/* Study Tips Section */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Visualization Tips
                         </h2>
                         <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                              <li><strong className="font-semibold">Visualize the Chain:</strong> Picture monomers as LEGO bricks linking together. Draw short chain segments (e.g., 3-4 units) for common polymers like polyethylene to see the repeating pattern.</li>
                              <li><strong className="font-semibold">Monomer vs. Polymer:</strong> Clearly distinguish the small building block (monomer) from the large resulting structure (polymer). Use flashcards with monomer name/structure on one side and polymer name/structure on the other.</li>
                               <li><strong className="font-semibold">Natural vs. Synthetic:</strong> Create two lists. Natural examples: cellulose, starch, protein, DNA, natural rubber. Synthetic examples: polyethylene, PVC, nylon, polyester, Teflon.</li>
                               <li><strong className="font-semibold">Degree of Polymerization (DP):</strong> Understand DP simply means "how many repeating units". Higher DP generally means higher molar mass and often increased strength/melting point.</li>
                               <li><strong className="font-semibold">Structure Dictates Properties:</strong> Think about how structure affects packing and interaction:
                                   <ul className="list-circle list-outside ml-6 mt-1 text-sm">
                                       <li>Linear chains can pack closely → often stronger, higher density (like HDPE).</li>
                                       <li>Branched chains pack poorly → often weaker, lower density (like LDPE).</li>
                                       <li>Network polymers are rigid and don't melt (thermosets).</li>
                                   </ul>
                               </li>
                               <li><strong className="font-semibold">Use Analogies:</strong> Train = Polymer, Boxcar = Monomer. Necklace = Polymer, Bead = Monomer. Wall = Polymer, Brick = Monomer.</li>
                           </ul>
                     </section>


                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                      {/* Panel 1: Intro to Polymers Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="rHxxLYzJ8w0" title="Video: What Are Polymers?"/>
                      </div>

                      {/* Panel 2: Monomer/Polymer Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Building Blocks Check</h3>
                           <MiniCheckQuestion
                              question="Styrene is a small molecule. Polystyrene is found in foam cups. Which is the monomer and which is the polymer?"
                              correctAnswer="Monomer: Styrene, Polymer: Polystyrene"
                              explanation="The prefix 'poly-' indicates the large molecule made from many 'styrene' repeating units."
                          />
                      </div>

                     {/* Panel 3: Natural Polymers Video */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="Q4Dm3XL34hE" title="Video: Natural Polymers (Cellulose, Starch, Protein)"/>
                      </div>

                      {/* Panel 4: Polymer Structure Visualization (Image/Simple Sim) */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-center">Visualizing Polymer Structures</h3>
                         <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Linear vs Branched vs Network</p>
                          {/* Placeholder for an image or interactive visualization */}
                           <div className="relative w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                              {/* Example using Next.js Image */}
                              {/* <Image src="/images/polymer-structures.png" alt="Diagram showing linear, branched, and cross-linked polymer chains" layout="fill" objectFit="contain" /> */}
                              <span className="text-gray-500 font-inter p-4 text-center">Placeholder: Image comparing Linear, Branched, and Network Polymer Structures</span>
                         </div>
                          <MiniCheckQuestion
                              question="Which type of polymer structure (linear, branched, or network) would likely result in a rigid, infusible material?"
                              correctAnswer="Network (or highly cross-linked)."
                              explanation="The extensive covalent cross-links between chains prevent them from moving past each other easily, leading to rigidity and preventing melting (thermoset behavior)."
                          />
                      </div>


                     {/* Panel 5: True/False Exercise */}
                      <TrueFalseExercise title="Polymer Facts: True or False?" statements={trueFalseStatements} />


                 </aside>
            </div>

             {/* Quiz Button */}
            <div className='flex justify-center items-center mt-12 lg:mt-16'>
                <button
                    onClick={() => setShowQuiz(true)}
                    className="w-full sm:w-1/2 lg:w-1/3 bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-bold font-inter py-3 px-6 rounded-lg transition-colors text-lg shadow-md"
                >
                    Test Your Polymer Basics!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Introduction to Polymers Quiz</h2>
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
IntroductionToPolymersPage.displayName = 'IntroductionToPolymersPage';

export default IntroductionToPolymersPage;
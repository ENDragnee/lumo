'use client';

import { InlineMath, BlockMath } from 'react-katex';
import { useState, ChangeEvent, Fragment } from 'react'; // Added Fragment
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

    const handleReveal = () => {
        setRevealed(true);
    };

    const handleHide = () => {
        setRevealed(false);
        setSelectedOption(null);
        setIsCorrect(null);
    }

  return (
    <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md">
      <p className="font-medium text-sm mb-3 font-inter text-dark-gray dark:text-light-gray">{question}</p>
      {options && options.length > 0 && !revealed && (
         <div className="space-y-2 mb-3">
              {options.map((option, index) => (
                  <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      className={`block w-full text-left text-sm p-2 rounded border font-inter transition-colors
                                  ${selectedOption === index ? (isCorrect ? 'bg-mint/30 border-teal' : 'bg-coral/30 border-red-500') : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'}
                                  text-dark-gray dark:text-light-gray`}
                  >
                      {`${String.fromCharCode(65 + index)}. ${option}`}
                  </button>
              ))}
          </div>
      )}
      {!options && !revealed && (
        <button
          onClick={handleReveal}
          className="text-xs bg-coral hover:bg-opacity-80 dark:bg-gold dark:text-deep-navy text-white font-inter font-semibold py-1 px-3 rounded transition-colors"
        >
          Check Answer
        </button>
      )}
      {revealed && (
        <div className="text-xs space-y-1 font-inter border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
           {options && isCorrect !== null && (
                <p className={`font-semibold ${isCorrect ? 'text-teal dark:text-mint' : 'text-coral dark:text-gold'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect.'}
                </p>
            )}
          <p className="text-dark-gray dark:text-light-gray"><strong className="text-teal dark:text-mint">Answer:</strong> {correctAnswer}</p>
          <p className="text-dark-gray dark:text-light-gray"><strong className="text-gray-600 dark:text-gray-400">Explanation:</strong> {explanation}</p>
           <button onClick={handleHide} className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 font-inter"> Hide/Reset </button>
        </div>
      )}
    </div>
  );
}

// Interactive Electrolysis Simulation Placeholder/Explanation
// (A full simulation is complex; this provides structure and links)
function ElectrolysisSimulator({ title, description, phetUrl }: {title: string, description: string, phetUrl: string}) {
  return (
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold font-inter mb-3 text-center">{title}</h3>
        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">{description}</p>
        <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
            <a href={phetUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open PhET Simulation (New Tab)</span>
            </a>
            {/* Placeholder for future embedded simulation if possible */}
            {/* <iframe src={phetUrl} ...></iframe> */}
        </div>
      </div>
  );
}


// --- Page Specific Data ---
const quizQuestions = [
  {
    "question": "What is electrical conductivity?",
    "options": ["Resistance to flow", "Ability to transmit electricity", "Storage of charge", "Generation of heat"],
    "correctAnswer": 1,
    "hint": "It measures how well a material allows electric current to pass through it."
  },
  {
    "question": "Metallic conduction involves the movement of:",
    "options": ["Ions", "Protons", "Delocalized electrons", "Neutrons"],
    "correctAnswer": 2,
    "hint": "Metals have a 'sea' of free electrons that carry charge."
  },
  {
    "question": "How does increasing temperature generally affect the conductivity of an electrolytic solution?",
    "options": ["Decreases conductivity", "Increases conductivity", "Has no effect", "Makes it zero"],
    "correctAnswer": 1,
    "hint": "Higher temperature increases ion mobility, thus increasing conductivity."
  },
  {
    "question": "What type of change accompanies electrolytic conduction?",
    "options": ["Physical change only", "Chemical change (reactions at electrodes)", "No change", "Phase change"],
    "correctAnswer": 1,
    "hint": "Electrolysis involves chemical decomposition driven by electricity."
  },
  {
    "question": "Which device converts chemical energy into electrical energy via spontaneous redox reactions?",
    "options": ["Electrolytic cell", "Galvanic (Voltaic) cell", "Capacitor", "Resistor"],
    "correctAnswer": 1,
    "hint": "This type of electrochemical cell produces electricity, like a battery."
  },
  {
    "question": "Which device uses electrical energy to drive non-spontaneous redox reactions?",
    "options": ["Electrolytic cell", "Galvanic (Voltaic) cell", "Fuel cell", "Battery"],
    "correctAnswer": 0,
    "hint": "Electrolysis requires an external power source to force a chemical change."
  },
  {
    "question": "Preferential discharge means that if multiple types of cations reach the cathode:",
    "options": ["All cations are discharged equally", "Only the most concentrated cation is discharged", "The cation that is *easiest* to reduce (lower in electrochemical series / higher reduction potential) is discharged", "No cations are discharged"],
    "correctAnswer": 2,
    "hint": "The electrochemical series helps predict which ion requires less energy to gain electrons."
  },
  {
    "question": "Which factor affects which ion gets preferentially discharged at an electrode?",
    "options": ["Position in electrochemical series", "Concentration of the ions", "Nature of the electrode (inert vs active)", "All of the above"],
    "correctAnswer": 3,
    "hint": "Multiple factors influence the outcome of electrolysis."
  },
  {
    "question": "During the electrolysis of dilute sulfuric acid (H₂SO₄) using inert electrodes, what gas is produced at the anode?",
    "options": ["Hydrogen (H₂)", "Oxygen (O₂)", "Sulfur dioxide (SO₂)", "Sulfur trioxide (SO₃)"],
    "correctAnswer": 1,
    "hint": "At the anode (oxidation), water (or OH⁻) is oxidized in preference to sulfate ions, producing O₂."
  },
   {
    "question": "During the electrolysis of concentrated aqueous NaCl using inert electrodes, what is preferentially discharged at the anode?",
    "options": ["Na⁺ ions", "Cl⁻ ions", "OH⁻ ions (from water)", "H⁺ ions (from water)"],
    "correctAnswer": 1,
    "hint": "Due to high concentration (and overpotential effects), Cl⁻ is oxidized to Cl₂ gas in preference to OH⁻ being oxidized to O₂."
  }
];

// --- KaTeX String Constants ---
const katex_H2O = 'H_2O';
const katex_H_plus = 'H^+';
const katex_OH_minus = 'OH^-';
const katex_SO4_2minus = 'SO_4^{2-}';
const katex_electron = 'e^-';
const katex_H2 = 'H_2';
const katex_O2 = 'O_2';
const katex_Cathode_Dilute_Acid = `4${katex_H_plus}(aq) + 4${katex_electron} \\rightarrow 2${katex_H2}(g)`; // or 2H₂O + 2e⁻ → H₂ + 2OH⁻
const katex_Anode_Dilute_Acid = `2${katex_H2O}(l) \\rightarrow ${katex_O2}(g) + 4${katex_H_plus}(aq) + 4${katex_electron}`; // or 4OH⁻ → O₂ + 2H₂O + 4e⁻

// --- Main Page Component ---
const ElectrolysisAqueousPage = () => { // Renamed component
  // --- State Variables ---
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // --- Quiz Handlers ---
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (showResults) return;
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleSubmit = () => {
    const correctCount = selectedAnswers.reduce((count: number, answer: number | null, index: number) => {
      if (answer === null) return count;
      return count + (answer === quizQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
    setScore(correctCount);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setShowResults(false);
    setSelectedAnswers(new Array(quizQuestions.length).fill(null));
    setScore(0);
  }

  // --- Component Render ---
   return (
    <div className="bg-off-white text-dark-gray dark:bg-deep-navy dark:text-light-gray min-h-screen font-lora">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
            <h1 className="text-4xl lg:text-5xl font-bold font-playfair mb-8 lg:mb-12 text-center">
                2.2 Electrolysis of Aqueous Solutions {/* Updated Title */}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                {/* Left Column */}
                <article className="lg:col-span-7 space-y-6">

                    {/* Introduction & Conductor Types */}
                    <section>
                         <h2 className="text-3xl font-semibold font-playfair mt-6 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Conductivity: How Substances Transmit Electricity
                         </h2>
                         <p className="leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Electrical conductivity</strong> is the measure of a material's ability to allow electric current to flow. Materials that permit current flow are <strong className="text-teal dark:text-teal font-semibold">conductors</strong>. There are two main types:
                         </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">1. Electronic (Metallic) Conductors</h3>
                          <ul className="list-disc list-outside ml-6 space-y-1 text-sm">
                             <li>Examples: Metals (copper, iron), alloys (brass), graphite.</li>
                             <li>Mechanism: Flow of mobile, <strong className="text-coral dark:text-gold">delocalized electrons</strong> within the material structure.</li>
                             <li>Characteristics: No chemical change occurs; only energy transfer. Conductivity generally <strong className="text-coral dark:text-gold">decreases</strong> as temperature increases (due to increased atomic vibrations hindering electron flow).</li>
                          </ul>
                           <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">2. Electrolytic Conductors</h3>
                            <ul className="list-disc list-outside ml-6 space-y-1 text-sm">
                             <li>Examples: Molten ionic compounds, aqueous solutions of acids, bases, and salts (electrolytes).</li>
                             <li>Mechanism: Movement of mobile <strong className="text-coral dark:text-gold">ions</strong> (cations and anions) towards oppositely charged electrodes.</li>
                             <li>Characteristics: Conduction is accompanied by <strong className="text-coral dark:text-gold">chemical changes</strong> (decomposition/reactions at electrodes) and transfer of matter. Conductivity generally <strong className="text-coral dark:text-gold">increases</strong> as temperature increases (due to increased ion mobility).</li>
                          </ul>
                    </section>

                    {/* Electrochemical Cells Intro */}
                    <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Electrochemical Cells
                         </h2>
                         <p className="leading-relaxed">
                             These devices interconvert chemical and electrical energy.
                             <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                                <li><strong className="text-teal dark:text-teal font-semibold">Galvanic (Voltaic) Cells:</strong> Use spontaneous chemical reactions to <strong className="text-coral dark:text-gold">generate</strong> electrical energy (e.g., batteries).</li>
                                 <li><strong className="font-semibold text-teal dark:text-mint">Electrolytic Cells:</strong> Use external electrical energy to <strong className="text-coral dark:text-gold">drive</strong> non-spontaneous chemical reactions (e.g., electrolysis).</li>
                             </ul>
                         </p>
                    </section>

                    {/* Electrolysis & Preferential Discharge */}
                     <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Electrolysis of Aqueous Solutions
                         </h2>
                         <p className="leading-relaxed">
                            <strong className="text-teal dark:text-teal font-semibold">Electrolysis</strong> is the process of using direct electric current (DC) to drive an otherwise non-spontaneous chemical reaction, typically decomposing a substance (the electrolyte). In aqueous solutions, things get interesting because <strong className="text-coral dark:text-gold">water itself can be oxidized or reduced</strong>, competing with the dissolved ions.
                         </p>
                          <h3 className="text-xl font-semibold font-playfair mt-4 mb-2">Preferential Discharge</h3>
                          <p className="leading-relaxed">
                             When multiple types of cations are attracted to the cathode (negative electrode) and multiple types of anions are attracted to the anode (positive electrode), only <strong className="text-teal dark:text-teal">one type of ion</strong> will typically be discharged (gain or lose electrons) preferentially at each electrode. This is governed by:
                           </p>
                            <ol className="list-decimal list-outside ml-6 space-y-1 mt-2 font-inter text-sm">
                               <li><strong className="font-semibold text-coral dark:text-gold">Position in Electrochemical Series (Reactivity/Potential):</strong> Ions that are easier to reduce (cations lower in series/higher reduction potential) are discharged preferentially at the cathode. Ions that are easier to oxidize (anions lower in series/lower oxidation potential) are discharged preferentially at the anode.</li>
                               <li><strong className="font-semibold">Concentration:</strong> Higher concentration of an ion increases its chance of being discharged, sometimes overriding the electrochemical series position (especially for anions like Cl⁻ vs OH⁻).</li>
                                <li><strong className="font-semibold">Nature of Electrode:</strong> Inert electrodes (platinum, graphite) don't participate. Active electrodes (copper, silver) can themselves be oxidized at the anode instead of anions.</li>
                           </ol>
                     </section>

                     {/* Example: Dilute H2SO4 */}
                      <section>
                           <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                            Example: Electrolysis of Dilute H₂SO₄ (Inert Electrodes)
                         </h2>
                          <p className="leading-relaxed">
                            Ions present: From H₂SO₄ → <InlineMath math={`H^+(aq)`}/>, <InlineMath math={`SO_4^{2-}(aq)`}/>. From H₂O → <InlineMath math={`H^+(aq)`}/>, <InlineMath math={`OH^-(aq)`}/>. (Effectively, H₂O, H⁺, OH⁻, SO₄²⁻).
                          </p>
                           <ul className="list-disc list-outside ml-6 space-y-2 mt-2">
                               <li><strong className="font-semibold">At Cathode (Reduction):</strong> Both H⁺ (from acid) and H⁺ (from water) can be reduced. The reaction is the reduction of H⁺:
                                   <BlockMath math={katex_Cathode_Dilute_Acid}/>
                                   (Hydrogen gas is produced).
                               </li>
                                <li><strong className="font-semibold">At Anode (Oxidation):</strong> Both OH⁻ (from water) and SO₄²⁻ can be oxidized. It is much easier to oxidize OH⁻ (or water itself) than the stable sulfate ion:
                                   <BlockMath math={katex_Anode_Dilute_Acid}/>
                                   (Oxygen gas is produced).
                               </li>
                           </ul>
                            <p className="mt-3 leading-relaxed">
                                Overall effect: Electrolysis of water, producing H₂ and O₂ gas. The concentration of H₂SO₄ increases as water is consumed.
                            </p>
                      </section>

                     {/* Study Tips Section */}
                     <section>
                          <h2 className="text-3xl font-semibold font-playfair mt-8 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                             Study & Memorization Tips
                         </h2>
                         <ul className="list-disc list-outside ml-6 space-y-3 mt-2">
                             <li><strong className="font-semibold">Conductor Types:</strong> Metallic = Electron flow, no chemical change, conductivity ↓ with Temp. Electrolytic = Ion flow, chemical change, conductivity ↑ with Temp.</li>
                              <li><strong className="font-semibold">Electrolysis Definition:</strong> Using electricity to force a non-spontaneous chemical change (decomposition).</li>
                              <li><strong className="font-semibold">Electrodes:</strong> Anode = Oxidation (Anions attracted), Cathode = Reduction (Cations attracted). (Mnemonic: An Ox, Red Cat).</li>
                               <li><strong className="font-semibold">Aqueous Solutions - The Water Factor:</strong> ALWAYS consider the possibility of H₂O being oxidized (<InlineMath math={`2H_2O \\rightarrow O_2 + 4H^+ + 4e^-`}/>) or reduced (<InlineMath math={`2H_2O + 2e^- \\rightarrow H_2 + 2OH^-`}/>).</li>
                               <li><strong className="font-semibold">Preferential Discharge Rules:</strong>
                                   <ol className="list-decimal list-outside ml-6 mt-1 text-sm">
                                       <li>Position in Series: Easier to reduce/oxidize wins. (Need to know relative positions of common ions and water).</li>
                                       <li>Concentration: High concentration can override series position (esp. halides vs OH⁻).</li>
                                        <li>Electrode Type: Active electrodes can interfere.</li>
                                   </ol>
                               </li>
                                <li><strong className="font-semibold">Practice Examples:</strong> Work through electrolysis of different aqueous solutions (NaCl(aq) conc. vs dilute, CuSO₄(aq) with inert vs copper electrodes) to apply the rules.</li>
                           </ul>
                     </section>


                </article>

                {/* Right Column */}
                 <aside className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                      {/* Panel 1: Conduction Types Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="r3zZbXLNxFQ" title="Video: Metallic vs Electrolytic Conduction"/>
                     </div>

                     {/* Panel 2: Electrochemical Cells Video */}
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <YouTubeEmbed videoId="LQrbJEFzI_w" title="Video: Galvanic vs Electrolytic Cells"/>
                     </div>

                      {/* Panel 3: Preferential Discharge Mini Question */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-semibold font-inter mb-3 text-blue-700 dark:text-blue-300">Preferential Discharge Check</h3>
                           <MiniCheckQuestion
                              question="In the electrolysis of aqueous copper(II) sulfate (CuSO₄) with inert electrodes, which cation is preferentially discharged at the cathode: Cu²⁺ or H⁺ (from water)?"
                              correctAnswer="Cu²⁺ ions."
                              explanation="Copper is lower than Hydrogen in the electrochemical series, meaning Cu²⁺ ions are more easily reduced (gain electrons) than H⁺ ions (or water)."
                          />
                      </div>

                      {/* Panel 4: Electrolysis Simulation */}
                     <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold font-inter mb-3 text-center">Explore: Electrolysis Simulation</h3>
                        <p className="text-sm text-center mb-4 font-inter text-dark-gray dark:text-light-gray">Visualize ion movement and electrode reactions.</p>
                         <div className="relative w-full overflow-hidden aspect-video border dark:border-gray-600 rounded bg-black">
                            {/* Link to PhET or other relevant sim */}
                            <a href="https://phet.colorado.edu/sims/html/electrolysis/latest/electrolysis_en.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors">
                                <span className="text-light-gray font-inter font-semibold p-4 text-center">Click to Open PhET: Electrolysis (New Tab)</span>
                            </a>
                             {/* Placeholder for future embedding
                             <iframe src="https://..." ...></iframe> */}
                        </div>
                    </div>

                     {/* Panel 5: Reactivity Series Mini Question */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                         <h3 className="text-xl font-semibold font-inter mb-3 text-green-700 dark:text-green-300">Reactivity Check</h3>
                          <MiniCheckQuestion
                             question="Based on reactivity, would you expect Zinc metal (Zn) to displace Silver ions (Ag⁺) from a silver nitrate solution (AgNO₃)?"
                             correctAnswer="Yes."
                             explanation="Zinc is higher (more reactive) than silver in the reactivity series. Therefore, zinc metal will oxidize (Zn → Zn²⁺ + 2e⁻) and reduce silver ions (Ag⁺ + e⁻ → Ag)."
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
                    Test Your Electrolysis Knowledge!
                </button>
            </div>
        </main>

         {/* Quiz Modal */}
        {showQuiz && (
             <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-off-white dark:bg-deep-navy p-6 sm:p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl border dark:border-gray-700">
                 <button onClick={resetQuiz} className="absolute top-3 right-3 text-dark-gray dark:text-light-gray hover:text-coral dark:hover:text-gold text-2xl" aria-label="Close quiz">×</button>
                 <h2 className="text-2xl font-bold font-playfair mb-6 text-center text-dark-gray dark:text-light-gray">Electrolysis Quiz</h2>
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
ElectrolysisAqueousPage.displayName = 'ElectrolysisAqueousPage';

export default ElectrolysisAqueousPage;
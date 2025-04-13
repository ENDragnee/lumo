'use client';

import { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import QuizQuestion from '@/components/QuizQuestion';
import 'katex/dist/katex.min.css';

const quizQuestions = [
  {
    "question": "What is the primary difference between a Galvanic (Voltaic) cell and an Electrolytic cell?",
    "options": [
      "Galvanic cells use electrical energy to drive non-spontaneous reactions, while electrolytic cells release energy.",
      "Galvanic cells release energy from spontaneous reactions, while electrolytic cells use electrical energy to drive non-spontaneous reactions.",
      "Galvanic cells do not use a salt bridge, while electrolytic cells do.",
      "Galvanic cells require high temperatures to operate, while electrolytic cells work at room temperature."
    ],
    "correctAnswer": 1,
    "hint": "A Galvanic cell produces electrical energy from spontaneous reactions, while an Electrolytic cell requires electrical energy to drive non-spontaneous reactions."
  },
  {
    "question": "What is the role of the salt bridge in a Galvanic cell?",
    "options": [
      "To prevent the flow of electrons between the two half-cells.",
      "To complete the electrical circuit by allowing ion flow between the half-cells.",
      "To act as the cathode in the cell.",
      "To increase the concentration of ions in the solution."
    ],
    "correctAnswer": 1,
    "hint": "The salt bridge allows the flow of ions between the half-cells, maintaining the electrical neutrality of each half-cell."
  },
  {
    "question": "In the Daniell cell, which metal undergoes oxidation?",
    "options": [
      "Copper",
      "Zinc",
      "Platinum",
      "Hydrogen"
    ],
    "correctAnswer": 1,
    "hint": "Zinc loses electrons and undergoes oxidation at the anode in the Daniell cell."
  },
  {
    "question": "Which component is commonly used as the reference electrode for measuring standard electrode potentials?",
    "options": [
      "Platinum electrode",
      "Copper electrode",
      "Standard Hydrogen Electrode (SHE)",
      "Zinc electrode"
    ],
    "correctAnswer": 2,
    "hint": "The Standard Hydrogen Electrode (SHE) is used as the reference with a potential of 0 V."
  },
  {
    "question": "What is the Nernst equation used for in the context of voltaic cells?",
    "options": [
      "To calculate the mass of the cathode material.",
      "To determine the cell potential when concentrations deviate from standard conditions.",
      "To determine the voltage of the salt bridge.",
      "To balance the half-reactions in the electrochemical process."
    ],
    "correctAnswer": 1,
    "hint": "The Nernst equation helps calculate the cell potential based on ion concentrations and other conditions."
  },
  {
    "question": "What happens when the concentration of Cu²⁺ ions is increased in a voltaic cell?",
    "options": [
      "The cell potential decreases.",
      "The cell potential increases.",
      "The oxidation half-reaction rate increases.",
      "The salt bridge becomes ineffective."
    ],
    "correctAnswer": 1,
    "hint": "Increasing the concentration of Cu²⁺ ions will shift the equilibrium, leading to a higher cell potential."
  },
  {
    "question": "Which metal is used in the standard hydrogen electrode (SHE)?",
    "options": [
      "Copper",
      "Gold",
      "Platinum",
      "Zinc"
    ],
    "correctAnswer": 2,
    "hint": "The standard hydrogen electrode uses a platinum electrode, which is inert and does not participate in the reaction."
  },
  {
    "question": "In the example cell, Zn(s) | Zn²⁺(1M) || H⁺(1M) | H₂(1 atm) | Pt(s), which electrode is the anode?",
    "options": [
      "Zinc electrode",
      "Hydrogen electrode",
      "Platinum electrode",
      "Copper electrode"
    ],
    "correctAnswer": 0,
    "hint": "The zinc electrode undergoes oxidation and is the anode in the cell."
  },
  {
    "question": "What is the standard reduction potential of zinc in a Daniell cell?",
    "options": [
      "0.76 V",
      "1.10 V",
      "-0.76 V",
      "0.34 V"
    ],
    "correctAnswer": 2,
    "hint": "Zinc has a standard reduction potential of -0.76 V, which is used to calculate the cell potential."
  },
  {
    "question": "In a fuel cell, what is the overall reaction for the combination of hydrogen and oxygen?",
    "options": [
      "2H₂(g) + O₂(g) → 2H₂O(l)",
      "H₂(g) + O₂(g) → H₂O(g)",
      "2H₂(g) + O₂(g) → 2H₂O(g)",
      "H₂(g) + O₂(g) → 2H₂O(l)"
    ],
    "correctAnswer": 0,
    "hint": "The overall reaction in a hydrogen-oxygen fuel cell is the formation of water from hydrogen and oxygen gases."
  }
]

export default function VoltaicCells() {
  const [showQuiz, setShowQuiz] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0); 
  
    const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
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
  return (
    <div className="px-6 sm:px-6 sm:text-xs md:text-base py-6 max-w-4xl mx-auto text-justify">
      <h1 className="text-3xl font-bold mb-6">2.5 Voltaic Cells</h1>

      <p>
        After completing this subunit, you will be able to understand what makes a Galvanic cell different from an electrolytic cell.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Construction of Voltaic Cells (Zn-Cu Voltaic Cell)</h2>
      <p>
        When a piece of zinc metal is placed in a CuSO<sub>4</sub> solution, Zn is oxidized to Zn<sup>2+</sup> ions while Cu<sup>2+</sup> ions are reduced to metallic copper.
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>{'Zn(s) + Cu^{2+}(aq) \\rightarrow Zn^{2+}(aq) + Cu(s)'}</BlockMath>
      </div>
      <p>
        The electrons are transferred directly from the reducing agent (Zn) to the oxidizing agent (Cu<sup>2+</sup>) in solution. However, if we physically separate the oxidizing agent from the reducing agent, the transfer of electrons can take place via an external conducting medium (a metal wire). As the reaction progresses, it sets up a constant flow of electrons and hence generates electricity (producing electrical work such as driving an electric motor).
      </p>
      <p>
        The experimental apparatus for generating electricity through the use of a spontaneous reaction is called a galvanic cell or voltaic cell. The essential components of a galvanic cell include a zinc bar immersed in a ZnSO<sub>4</sub> solution and a copper bar immersed in a CuSO<sub>4</sub> solution.
      </p>
      <p>
        The cell operates on the principle that the oxidation of Zn to Zn<sup>2+</sup> and the reduction of Cu<sup>2+</sup> to Cu can be made to take place simultaneously in separate locations with the transfer of electrons between them occurring through an external wire.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">The Daniell Cell</h2>
      <p>
        This particular arrangement of electrodes (Zn and Cu) and solutions (ZnSO<sub>4</sub> and CuSO<sub>4</sub>) is called the Daniell cell. By definition, the anode in a galvanic cell is the electrode at which oxidation occurs, and the cathode is the electrode at which reduction occurs. The half-cell reactions for the Daniell cell are:
      </p>

      <ul className="list-disc ml-6 overflow-x-auto text-wrap text-xs">
        <li>Oxidation: <BlockMath>{'Zn(s) \\rightarrow Zn^{2+}(aq) + 2e^{-}'}</BlockMath></li>
        <li>Reduction: <BlockMath>{'Cu^{2+}(aq) + 2e^{-} \\rightarrow Cu(s)'}</BlockMath></li>
        <li>Overall Reaction: <BlockMath>{'Zn(s) + Cu^{2+}(aq) \\rightarrow Zn^{2+}(aq) + Cu(s)'}</BlockMath></li>
      </ul>

      <p>
        Zinc tends to lose electrons more readily than copper, so zinc atoms in the zinc electrode lose electrons to produce zinc ions. These electrons flow through the external circuit to the copper electrode, where they react with the copper ions in that half-cell to deposit copper metal atoms. The net result is that zinc metal reacts with copper ions to produce zinc ions and copper metal, and electric current flows through the external circuit.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Salt Bridge</h2>
      <p>
        To complete the electrical circuit, the solutions must be connected by a conducting medium, known as a salt bridge. This is typically an inverted U-tube containing an inert electrolyte solution (such as KCl, KNO<sub>3</sub>, or NH<sub>4</sub>NO<sub>3</sub>) whose ions will not react with other ions in solution or with the electrodes.
      </p>

      <p>
        During the course of the overall redox reaction, electrons flow externally from the anode (Zn electrode) through the wire to the cathode (Cu electrode). In the solution, cations (Zn<sup>2+</sup>, Cu<sup>2+</sup>, K<sup>+</sup>) move toward the cathode, while anions (SO<sub>4</sub><sup>2-</sup>, Cl<sup>-</sup>) move toward the anode.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Cell Diagram (Cell Notation)</h2>
      <p>
        The conventional notation for representing the components of a voltaic or galvanic cell is the cell diagram. For example, the cell notation for the Daniell cell shown is:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>{'Zn(s) | Zn^{2+}(aq) || Cu^{2+}(aq) | Cu(s)'}</BlockMath>
      </div>
      <p>
        In this notation, the components of the anode compartment (oxidation half-cell) are written to the left of the components of the cathode compartment (reduction half-cell).
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Measuring Standard Electrode Potentials</h2>
      <p>
        A cell potential is a measure of the driving force of the cell reaction. This reaction occurs as separate half-reactions: an oxidation half-reaction and a reduction half-reaction. The general forms of these half-reactions are:
      </p>
      <ul className="list-disc ml-6 overflow-x-auto text-wrap text-xs">
        <li>Oxidation (Anode): <BlockMath>{'Reducing Species \\rightarrow Oxidized Species + ne^{-}'}</BlockMath></li>
        <li>Reduction (Cathode): <BlockMath>{'Oxidized Species + ne^{-} \\rightarrow Reducing Species'}</BlockMath></li>
      </ul>
      <p>
        The standard reduction potential for the hydrogen electrode is defined as zero, and the hydrogen electrode serves as the reference for determining the relative potentials of other electrodes.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Standard Hydrogen Electrode (SHE)</h2>
      <p>
        The standard hydrogen electrode consists of a platinum electrode with hydrogen gas at 1 atm bubbling through it, immersed in 1 M hydrochloric acid. The half-reaction for the hydrogen electrode is:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>{'2H^{+}(1M) + 2e^{-} \\rightarrow H_2(1 atm), E^0 = 0V'}</BlockMath>
      </div>

      <h1 className="text-3xl font-bold mb-6">Voltaic Cells</h1>
      <p>
        We can use the SHE to measure the potentials of other kinds of electrodes. To find an unknown standard electrode potential (E<sub>0</sub>), we construct a voltaic cell consisting of this reference half-cell and the unknown half-cell. Since E<sub>0</sub> is zero, the overall cell potential is determined by the unknown electrode's potential.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Voltaic Cell Construction</h2>
      <p>
        Depending on the unknown half-cell, the reference half-cell can be the anode or the cathode:
      </p>
      <ul className="list-disc ml-6">
        <li>
          When H<sub>2</sub> is oxidized, the reference half-cell is the anode, and reduction occurs at the unknown half-cell:
          <div className='overflow-x-auto text-wrap text-xs'>
            <BlockMath>
              {`E_\\text{cell} = E_\\text{cathode} - E_\\text{anode} = E_\\text{unknown} - E_\\text{reference} = E_\\text{unknown} - 0.00V = E_\\text{unknown}`}
            </BlockMath>
          </div>
        </li>
        <li>
          When H<sub>2</sub> is reduced, the reference half-cell is the cathode, and oxidation occurs at the unknown half-cell:
          <div className='overflow-x-auto text-wrap text-xs'>
            <div className='overflow-x-auto text-wrap text-xs'>
              <BlockMath>
                {`E_\\text{cell} = E_\\text{reference} - E_\\text{unknown} = 0.00V - E_\\text{unknown} = -E_\\text{unknown}`}
              </BlockMath>
            </div>
          </div>
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Example: Zn(s) | Zn<sup>2+</sup> (1M) || H<sup>+</sup> (1M) | H<sub>2</sub> (1 atm) | Pt(s)</h2>
      <p>
        Figure 2.11 shows a voltaic cell that has the Zn(s) | Zn<sup>2+</sup> half-reaction in one compartment and the H<sup>+</sup> | H<sub>2</sub> half-reaction in the other. The zinc electrode is negative relative to the hydrogen electrode, so we know that the zinc is being oxidized and is the anode, and the SHE is the cathode.
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>
          {`Zn(s) | Zn^{2+}(1M) || H^{+}(1M) | H_2(1 atm) | Pt(s)`}
        </BlockMath>
      </div>

      <p>
        The EMF of the cell at 25°C is 0.76 V, and we can write the half-cell reactions as follows:
      </p>
      <ul className="list-disc ml-6">
        <li>Anode (Oxidation): Zn(s) → Zn<sup>2+</sup> (1M) + 2e<sup>-</sup></li>
        <li>Cathode (Reduction): 2H<sup>+</sup> (1M) + 2e<sup>-</sup> → H<sub>2</sub> (1M)</li>
        <li>Overall Reaction: Zn(s) + 2H<sup>+</sup> (1M) → Zn<sup>2+</sup> (1M) + H<sub>2</sub> (1M)</li>
      </ul>

      <p>
        By convention, the standard EMF of the cell, E<sub>0</sub>, which is composed of contributions from both the anode and the cathode, is given by:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>
          {`E_\\text{cell} = E_\\text{cathode} - E_\\text{anode} = E_\\text{Zn2+/Zn} - E_\\text{H+/H2} = 0.76 V = 0.00 V - E_\\text{Zn2+/Zn}`}
        </BlockMath>
      </div>
      <p>
        Therefore, the standard reduction potential of zinc, E<sub>0</sub><sub>Zn2+/Zn</sub>, is -0.76 V. Note that we write the reaction as a reduction, even though it occurs in reverse as oxidation.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Example: Cu<sup>2+</sup> | Cu Half-Cell</h2>
      <p>
        Similarly, the standard reduction potential of copper can be obtained using a cell with a copper electrode and a SHE. In this case, the copper electrode is the cathode, as its mass increases during the operation of the cell.
      </p>
      <BlockMath>
        {`Pt(s) | H_2(1 atm) | H^{+}(1M) || Cu^{2+}(1M) | Cu(s)`}
      </BlockMath>
      <ul className="list-disc ml-6">
        <li>Anode (Oxidation): H<sub>2</sub> (1 atm) → 2H<sup>+</sup> (1M) + 2e<sup>-</sup></li>
        <li>Cathode (Reduction): Cu<sup>2+</sup> (1M) + 2e<sup>-</sup> → Cu(s)</li>
        <li>Overall Reaction: H<sub>2</sub> (1 atm) + Cu<sup>2+</sup> (1M) → 2H<sup>+</sup> (1M) + Cu(s)</li>
      </ul>
      <p>
        The EMF of the cell is 0.34 V, so we can calculate the standard reduction potential of copper:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>
          {`E_\\text{cell} = E_\\text{Cu2+/Cu} - E_\\text{H+/H2} = 0.34 V`}
        </BlockMath>
      </div>
      <p>
        Thus, the standard reduction potential of copper, E<sub>0</sub><sub>Cu2+/Cu</sub>, is 0.34 V.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">The Daniell Cell</h2>
      <p>
        For the Daniell cell, we can write the half-cell reactions:
      </p>
      <ul className="list-disc ml-6">
        <li>Anode (Oxidation): Zn(s) → Zn<sup>2+</sup> (1M) + 2e<sup>-</sup></li>
        <li>Cathode (Reduction): Cu<sup>2+</sup> (1M) + 2e<sup>-</sup> → Cu(s)</li>
        <li>Overall Reaction: Zn(s) + Cu<sup>2+</sup> (1M) → Zn<sup>2+</sup> (1M) + Cu(s)</li>
      </ul>
      <p>
        The EMF of the cell is:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>
          {`E_\\text{cell} = E_\\text{cathode} - E_\\text{anode} = 0.34 V - (-0.76 V) = 1.10 V`}
        </BlockMath>
      </div>
      <p>
        This positive value indicates that the reaction is spontaneous.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Effect of Concentration on EMF</h2>
      <p>
        The EMF of a voltaic cell can change with the concentration of the electrolyte solutions. For example, we use the Nernst equation to account for this effect. The Nernst equation gives the relationship between the electrode potentials and the concentration of the electrolyte solutions.
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>
          {`E = E_0 - 0.0592 log Q`}
        </BlockMath>
      </div>
      <p>
        This equation shows that as the concentration of products increases and the concentration of reactants decreases, the cell potential will decrease, eventually reaching zero at equilibrium.
      </p>

      <h1 className="text-3xl font-bold mb-6">Voltaic Cells and Electrochemical Reactions</h1>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Anode and Cathode Reactions</h2>
      <p>
        The anode reaction is given by:
      </p>
      <div>
        <BlockMath>{`Cu(s) → Cu^{2+} (aq; 0.1 M) + 2e^{-}`}</BlockMath>
      </div>

      <p>
        The cathode reaction is:
      </p>
      <div className='v'>
        <BlockMath>{`Cu^{2+} (aq; 1.0 M) + 2e^{-} → Cu(s)`}</BlockMath>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-4">Overall Cell Reaction</h3>
      <p>
        The overall cell reaction is the sum of the half-reactions:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>{`Cu^{2+} (aq; 1.0 M) → Cu^{2+} (aq; 0.1 M)`}</BlockMath>
      </div>
      <p>
        The cell potential at the initial concentrations of 0.10 M (dilute) and 1.0 M (concentrated), with \(n = 2\), is obtained from the Nernst equation:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>{`E = E^\\circ - \\frac{RT}{nF} \\ln Q`}</BlockMath>
      </div>
      <p>
        Substituting the values:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>{`E_{\text{cell}} = 0 V - \left( 0.0592 \, V \times (-1.00) \right)`}</BlockMath>
        <BlockMath>{`E_{\text{cell}} = 0.0296 V`}</BlockMath>
      </div>

      <h2 className="text-2xl font-semibold mt-6 mb-4">How a Concentration Cell Works</h2>
      <p>
        In the anode (dilute) half-cell, copper atoms give up electrons, forming Cu<sup>2+</sup> ions that increase the concentration of the solution. In the cathode (concentrated) half-cell, Cu<sup>2+</sup> ions gain electrons and form solid copper, making the solution less concentrated. The cell potential decreases until equilibrium is reached, when the concentration of Cu<sup>2+</sup> is the same in both half-cells.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-4">Nernst Equation for pH Determination</h3>
      <p>
        The pH of a solution can be accurately determined by measuring the cell potential using the Nernst equation. In a typical experiment, a hydrogen electrode is used with a test solution, and the cell is connected to a standard zinc electrode:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>{`Zn(s) | Zn^{2+} (1M) || H^+ (test solution) | H_2 (1 atm) | Pt`}</BlockMath>
      </div>
      <p>
        The cell reaction is:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>{`Zn(s) + 2H^+ (test solution) → Zn^{2+} (1M) + H_2 (1 atm)`}</BlockMath>
      </div>
      <p>
        The cell potential is related to the hydrogen-ion concentration of the test solution:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
      <BlockMath>{`E_{\text{cell}} = 0.76 V - 0.0592 \times \frac{1}{2} \log \left( \frac{1}{[H^+]^2} \right)`}</BlockMath>
      </div>
      <p>
        Rearranging the equation for pH, we get:
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>{`pH = 0.76 - \frac{E_{\text{cell}}}{0.0592}`}</BlockMath>
      </div>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Comparison of Galvanic and Electrolytic Cells</h2>
      <table className="table-auto w-full text-sm mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Galvanic Cell / Voltaic Cell</th>
            <th className="px-4 py-2">Electrolytic Cell</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">Energy released by spontaneous redox reaction is converted to electrical energy.</td>
            <td className="border px-4 py-2">Electrical energy is used to drive non-spontaneous redox reactions.</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Anode is negatively charged, cathode is positively charged.</td>
            <td className="border px-4 py-2">Anode is positively charged, cathode is negatively charged.</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Electrons originate from the species that undergoes oxidation.</td>
            <td className="border px-4 py-2">Electrons originate from an external source.</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Applications of Electrochemical Cells</h2>
      <p>
        Batteries, such as galvanic or voltaic cells, are essential for providing electrical power. Fuel cells, which operate continuously using fuel, are a variant of electrochemical cells.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-4">Fuel Cells</h3>
      <p>
        A fuel cell differs from a battery because it operates with a continuous supply of reactants. For example, a hydrogen-oxygen fuel cell consists of hydrogen and oxygen gases, with a proton-exchange membrane (PEM) to transfer protons between electrodes.
      </p>
      <div>
        <BlockMath>{`Anode: H_2(g) → 2H^+ (aq) + 2e^{-}`}</BlockMath>
        <BlockMath>{`Cathode: O_2(g) + 4H^+ (aq) + 4e^{-} → 2H_2O(g)`}</BlockMath>
        <BlockMath>{`Overall: 2H_2(g) + O_2(g) → 2H_2O(l)`}</BlockMath>
      </div>

      <p>
        Fuel cells are used in various applications, including power for lighting, emergency generators, communications equipment, and vehicles.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Corrosion of Metals</h2>
      <p>
        Corrosion is the deterioration of metals through electrochemical processes. Iron corrosion, or rusting, occurs when iron is exposed to moisture and oxygen, forming iron oxide. The process involves both an anodic region (oxidation) and a cathodic region (reduction).
      </p>
      <div className='overflow-x-auto text-wrap text-xs'>
        <BlockMath>{`Anodic region (oxidation): Fe(s) → Fe^{2+} (aq) + 2e^{-}`}</BlockMath>
        <BlockMath>{`Cathodic region (reduction): O_2(g) + 4H^+ (aq) + 4e^{-} → 2H_2O`}</BlockMath>
        <BlockMath>{`Overall reaction: 2Fe(s) + O_2(g) + 4H^+ (aq) → 2Fe^{2+} (aq) + 2H_2O(l)`}</BlockMath>
      </div>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Protecting Against Corrosion</h2>
      <p>
        Various methods are used to protect metals from corrosion, such as coating them with paint or alloying them with more resistant metals like chromium in stainless steel.
      </p>
      <div className='flex justify-center items-center'>
          <button 
            onClick={() => setShowQuiz(true)}
            className="w-1/2 h-1/2 mt-6 bg-slate-400 hover:bg-slate-500 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Take Quiz
          </button>
        </div>

      {showQuiz && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-[#242424] p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => {
                setShowQuiz(false);
                setShowResults(false);
                setSelectedAnswers(new Array(quizQuestions.length).fill(null));
              }}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Projectile Motion Quiz</h2>
            <div className="space-y-6">
              {quizQuestions.map((q, index) => (
                <QuizQuestion
                  key={index}
                  question={q.question}
                  options={q.options}
                  correctAnswer={q.correctAnswer}
                  hint={q.hint}
                  selectedAnswer={selectedAnswers[index]}
                  showResults={showResults}
                  onSelectAnswer={(answerIndex) => handleAnswerSelect(index, answerIndex)}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              {!showResults && (
                <button 
                  onClick={handleSubmit}
                  className="bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Submit
                </button>
              )}
              <button 
                onClick={() => {
                  setShowQuiz(false);
                  setShowResults(false);
                  setSelectedAnswers(new Array(quizQuestions.length).fill(null));
                }}
                className="bg-red-500 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Close
              </button>
            </div>
            {showResults && (
              <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="text-xl font-bold mb-2 dark:text-white">Quiz Results</h3>
                <p className="dark:text-white">
                  You got {score} out of {quizQuestions.length} questions correct! 
                  ({((score / quizQuestions.length) * 100).toFixed(1)}%)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

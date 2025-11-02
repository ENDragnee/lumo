import React from 'react'
import Flashcard from "@/components/Flashcard"
const flashcardQuestions = [
    {
      question: "What is a polymerization reaction?",
      answer: "It is the chemical change by which monomer units combine to form a polymer."
    },
    {
      question: "What is the key feature of monomers in polymerization reactions?",
      answer: "Monomers must have two or more functional groups, giving them the capacity to form chemical bonds to at least two other monomer molecules."
    },
    {
      question: "What is addition polymerization?",
      answer: "It is a chain reaction that adds new monomer units to the growing polymer molecule one at a time, typically involving unsaturated monomers."
    },
    {
      question: "How does the molecular formula of a polymer compare to its monomer?",
      answer: "The molecular formula of a polymer is 'n' times that of the monomer, and double bonds in the monomer are converted to single bonds in the polymer."
    },
    {
      question: "What is an example of a polymer made by addition polymerization?",
      answer: "Polyethylene, formed from ethylene monomers, and polystyrene, formed from styrene monomers."
    },
    {
      question: "What are the three steps of addition polymerization?",
      answer: "1. Chain initiation step, 2. Chain propagation step, 3. Chain termination step."
    },
    {
      question: "What happens during the chain initiation step?",
      answer: "A reactive initiator molecule reacts with a monomer, forming a reactive center that starts the polymer chain."
    },
    {
      question: "What happens during the chain propagation step?",
      answer: "Monomers add to the growing chain, transferring the reactive center to the chain end."
    },
    {
      question: "What happens during the chain termination step?",
      answer: "The polymerization process stops when the reactive center is neutralized."
    },
    {
      question: "What is condensation polymerization?",
      answer: "It is a reaction where monomer molecules combine with the release of by-products like water or methanol, forming step-growth polymers."
    },
    {
      question: "What are examples of condensation polymers?",
      answer: "Nylon 66, formed from hexamethylene diamine and adipic acid, and Dacron, formed from terephthalic acid and ethylene glycol."
    },
    {
      question: "What are some applications of Dacron?",
      answer: "Dacron is used in synthetic fibers, durable fabrics, bottles, and packaging materials."
    },
    {
      question: "What are some applications of Nylon?",
      answer: "Nylon is used in parachutes, ropes, stockings, hair combs, rugs, and automobile tires."
    }
  ];
  

const page = () => {
  return (
    <div className="px-6 py-10 max-w-4xl mx-auto text-justify">
      {flashcardQuestions.map((flashcard, index) => (
        <Flashcard key={index} question={flashcard.question} answer={flashcard.answer} />
      ))}
    </div>
  )
}

export default page
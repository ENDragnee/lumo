import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

const Page: React.FC = () => {
  return (
    <div className="px-6 py-10 max-w-4xl mx-auto text-justify">
      <h1 className="text-3xl font-bold mb-6">
        Which one is a Brønsted-Lowry Acid and which one is a Brønsted-Lowry Base?
      </h1>
      <p className="mb-4">
        In 1923, J. N. Brønsted in Denmark and T. M. Lowry in Great Britain
        independently proposed a new acid-base theory. They pointed out that
        acid–base reactions can be seen as proton-transfer reactions and that
        acids and bases can be defined in terms of this proton (H) transfer.
      </p>
      <p className="mb-4">
        According to their concept:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>An acid is a proton donor.</li>
        <li>A base is a proton acceptor.</li>
      </ul>
      <p className="mb-4">
        Let’s use the Brønsted–Lowry theory to describe the ionization of
        ammonia in an aqueous solution:
      </p>
      <p className="mb-4">
        In this reaction, water acts as an acid. It gives up a proton (H<sup>+</sup>) to NH<sub>3</sub>, a base. As a result of this transfer, the polyatomic ions NH<sub>4</sub><sup>+</sup> and OH<sup>−</sup> are formed—the same ions produced by the ionization of the hypothetical NH<sub>4</sub>OH in the Arrhenius theory.
      </p>
      <p className="mb-4">
        However, these cannot be called Arrhenius bases since, in aqueous
        solution, they do not dissociate to form OH<sup>−</sup>. The advantage of this definition is that it is not limited to aqueous solutions.
      </p>
      <p className="mb-4">
        Brønsted-Lowry acids and bases always occur in pairs, called conjugate
        acid-base pairs.
      </p>
    </div>
  );
};

export default Page;

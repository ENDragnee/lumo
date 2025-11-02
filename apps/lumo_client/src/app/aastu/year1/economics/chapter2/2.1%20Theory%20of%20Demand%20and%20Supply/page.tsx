import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const TheoryofDemandandSupply: React.FC = () => {
  return (
    <div className="px-6 py-10 max-w-4xl mx-auto text-justify">
      {/* Section Title */}
      <h1 className="text-3xl font-bold mb-6">
        2.1.1 Demand Schedule, Demand Curve, and Demand Function
      </h1>

      {/* Introduction */}
      <p className="mb-4">
        The relationship between price and the quantity of a commodity purchased can be
        represented using a table (schedule), a curve, or an equation.
      </p>

      {/* Demand Schedule */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">Demand Schedule</h2>
      <p className="mb-4">
        A demand schedule is a table that shows the quantities of a commodity an individual
        consumer purchases at various price levels. Below is an example of an individual
        household's demand schedule for oranges per week:
      </p>

      <table className="table-auto border-collapse border border-gray-400 w-full text-center mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 px-4 py-2">Combination</th>
            <th className="border border-gray-400 px-4 py-2">Price (Birr/kg)</th>
            <th className="border border-gray-400 px-4 py-2">Quantity Demanded (kg/week)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 px-4 py-2">A</td>
            <td className="border border-gray-400 px-4 py-2">5</td>
            <td className="border border-gray-400 px-4 py-2">5</td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-2">B</td>
            <td className="border border-gray-400 px-4 py-2">4</td>
            <td className="border border-gray-400 px-4 py-2">7</td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-2">C</td>
            <td className="border border-gray-400 px-4 py-2">3</td>
            <td className="border border-gray-400 px-4 py-2">9</td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-2">D</td>
            <td className="border border-gray-400 px-4 py-2">2</td>
            <td className="border border-gray-400 px-4 py-2">11</td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-2">E</td>
            <td className="border border-gray-400 px-4 py-2">1</td>
            <td className="border border-gray-400 px-4 py-2">13</td>
          </tr>
        </tbody>
      </table>

      {/* Demand Curve */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">Demand Curve</h2>
      <p className="mb-4">
        The demand curve is a graphical representation of the relationship between price and
        quantity demanded. For example, in the graph, prices of oranges are shown on the <em>OY</em> 
        axis, and quantities demanded on the <em>OX</em> axis. As the price decreases, the
        quantity demanded increases, illustrating an inverse relationship.
      </p>

      {/* Demand Function */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">Demand Function</h2>
      <p className="mb-4">
        The demand function is a mathematical expression of the relationship between price and
        quantity demanded, assuming all other factors remain constant (<em>ceteris paribus</em>).
        It is expressed as:
      </p>
      <BlockMath math="Q_d = f(P)" />
      <p className="mb-4">
        Where <InlineMath math="Q_d" /> represents quantity demanded, and <InlineMath math="P" /> 
        is the price of the commodity. For example, suppose the demand function is:
      </p>
      <BlockMath math="Q = 15 - 2P" />
      <p className="mb-4">
        To calculate the value of <InlineMath math="a" />, substitute known values from the demand
        schedule, such as at point A or B.
      </p>
      <BlockMath math="7 = a - 2(4), \, \text{so} \, a = 15" />
      <p className="mb-4">Thus, the demand function is:</p>
      <BlockMath math="Q = 15 - 2P" />

      {/* Market Demand */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">Market Demand</h2>
      <p className="mb-4">
        Market demand is derived by horizontally adding the quantities demanded by all
        individual consumers at each price level. For example:
      </p>

      <table className="table-auto border-collapse border border-gray-400 w-full text-center mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 px-4 py-2">Price</th>
            <th className="border border-gray-400 px-4 py-2">Consumer 1</th>
            <th className="border border-gray-400 px-4 py-2">Consumer 2</th>
            <th className="border border-gray-400 px-4 py-2">Consumer 3</th>
            <th className="border border-gray-400 px-4 py-2">Market Demand</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 px-4 py-2">5</td>
            <td className="border border-gray-400 px-4 py-2">5</td>
            <td className="border border-gray-400 px-4 py-2">7</td>
            <td className="border border-gray-400 px-4 py-2">2</td>
            <td className="border border-gray-400 px-4 py-2">14</td>
          </tr>
        </tbody>
      </table>

      <p className="mb-4">
        For a market with 100 identical buyers, the market demand function becomes:
      </p>
      <BlockMath math="P = 10 - \frac{Q}{2}" />
      <BlockMath math="Q_m = 2000 - 200P" />
      {/* Section Title */}
      <h1 className="text-3xl font-bold mb-6">2.1.2 Determinants of Demand</h1>

      {/* Introduction */}
      <p className="mb-4">
        The demand for a product is influenced by several factors. These factors are commonly
        referred to as demand shifters. Unlike the price of the product, which causes movement
        along the demand curve, changes in these factors result in shifts of the demand curve.
      </p>

      {/* List of Determinants */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">Factors Influencing Demand</h2>
      <ol className="list-decimal ml-6 mb-6">
        <li className="mb-2">
          <strong>Price of the product:</strong> The price directly affects the quantity demanded,
          causing movement along the demand curve.
        </li>
        <li className="mb-2">
          <strong>Taste or preference:</strong> A favorable change in consumer preferences
          increases demand, shifting the demand curve rightward.
        </li>
        <li className="mb-2">
          <strong>Income of the consumer:</strong> Income determines whether goods are
          classified as normal or inferior:
          <ul className="list-disc ml-6 mb-4">
            <li>
              <strong>Normal goods:</strong> Demand increases as income rises.
            </li>
            <li>
              <strong>Inferior goods:</strong> Demand decreases as income rises.
            </li>
          </ul>
        </li>
        <li className="mb-2">
          <strong>Price of related goods:</strong> Related goods can be substitutes or
          complements:
          <ul className="list-disc ml-6 mb-4">
            <li>
              <strong>Substitute goods:</strong> Demand for one increases when the price of the
              other rises (e.g., tea and coffee).
            </li>
            <li>
              <strong>Complementary goods:</strong> Demand for one decreases when the price of
              the other rises (e.g., cars and fuel).
            </li>
          </ul>
        </li>
        <li className="mb-2">
          <strong>Consumer expectations:</strong> Expectations about future prices or income can
          influence demand. For instance, if prices are expected to rise, current demand increases.
        </li>
        <li className="mb-2">
          <strong>Number of buyers:</strong> An increase in the number of buyers in the market
          raises the market demand.
        </li>
      </ol>

      {/* Changes in Demand */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">Changes in Demand</h2>
      <p className="mb-4">
        A change in demand occurs when any factor other than the product's price changes.
        This causes the entire demand curve to shift:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          <strong>Increase in demand:</strong> The demand curve shifts rightward when buyers
          choose to purchase more at any given price.
        </li>
        <li>
          <strong>Decrease in demand:</strong> The demand curve shifts leftward when buyers
          choose to purchase less at any given price.
        </li>
      </ul>

      {/* Graph Description */}
      <p className="mb-4">
        For example, when demand increases, the curve shifts upward (from <InlineMath math="D_0" /> to 
        <InlineMath math="D_1" />). When demand decreases, the curve shifts downward (to 
        <InlineMath math="D_2" />).
      </p>
      <BlockMath math="\text{Price} \quad \text{Quantity} \quad \text{D}_0 \quad \text{D}_1 \quad \text{D}_2" />

      {/* Table: Individual and Market Demand */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">
        Numerical Example of Individual and Market Demand
      </h2>
      <table className="table-auto border-collapse border border-gray-400 w-full text-center mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 px-4 py-2">Price</th>
            <th className="border border-gray-400 px-4 py-2">Consumer 1</th>
            <th className="border border-gray-400 px-4 py-2">Consumer 2</th>
            <th className="border border-gray-400 px-4 py-2">Consumer 3</th>
            <th className="border border-gray-400 px-4 py-2">Market Demand</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 px-4 py-2">8</td>
            <td className="border border-gray-400 px-4 py-2">0</td>
            <td className="border border-gray-400 px-4 py-2">0</td>
            <td className="border border-gray-400 px-4 py-2">0</td>
            <td className="border border-gray-400 px-4 py-2">0</td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-2">5</td>
            <td className="border border-gray-400 px-4 py-2">3</td>
            <td className="border border-gray-400 px-4 py-2">5</td>
            <td className="border border-gray-400 px-4 py-2">1</td>
            <td className="border border-gray-400 px-4 py-2">9</td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-2">3</td>
            <td className="border border-gray-400 px-4 py-2">5</td>
            <td className="border border-gray-400 px-4 py-2">7</td>
            <td className="border border-gray-400 px-4 py-2">2</td>
            <td className="border border-gray-400 px-4 py-2">14</td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-2">0</td>
            <td className="border border-gray-400 px-4 py-2">7</td>
            <td className="border border-gray-400 px-4 py-2">9</td>
            <td className="border border-gray-400 px-4 py-2">4</td>
            <td className="border border-gray-400 px-4 py-2">20</td>
          </tr>
        </tbody>
      </table>

      {/* Conclusion */}
      <p className="mb-4">
        In conclusion, demand is influenced by various factors. While price causes movement
        along the demand curve, the other factors shift the demand curve either upward
        (increase) or downward (decrease).
      </p>
      <h1 className="text-3xl font-bold mb-6">2.1.3 Elasticity of Demand</h1>
      <p className="mb-6">
        In economics, elasticity is a crucial concept used to analyze the quantitative relationship
        between price and quantity purchased or sold. Elasticity measures the responsiveness of a
        dependent variable to changes in an independent variable. Accordingly, we have the concepts
        of elasticity of demand and elasticity of supply.
      </p>
      <p className="mb-6">
        Elasticity of demand refers to the degree of responsiveness of quantity demanded of a good
        to a change in its price, income, or the price of related goods. Commonly, there are three
        kinds of demand elasticity: price elasticity, income elasticity, and cross elasticity.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">i. Price Elasticity of Demand</h2>
      <p className="mb-6">
        Price elasticity of demand indicates how consumers react to changes in price. It is computed
        as:
      </p>
      <BlockMath math="E_d = \frac{\% \Delta Q_d}{\% \Delta P}" />
      <p className="mb-6">
        Where:
        <ul className="list-disc ml-6">
          <li>
            <InlineMath math="\Delta Q_d" />: Change in quantity demanded
          </li>
          <li>
            <InlineMath math="\Delta P" />: Change in price
          </li>
        </ul>
      </p>

      <h3 className="text-xl font-semibold mt-4">a. Point Price Elasticity</h3>
      <p className="mb-6">
        This is calculated at a specific point on a demand curve:
      </p>
      <BlockMath math="E_d = \frac{\Delta Q}{Q_0} \times \frac{P_0}{\Delta P}" />
      <p className="mb-6">
        On a straight-line demand curve, elasticity differs at every point. This method is ideal for
        small changes in price and quantity demanded.
      </p>

      <h3 className="text-xl font-semibold mt-4">b. Arc Price Elasticity</h3>
      <p className="mb-6">
        Arc elasticity is used when there are larger changes in price and quantity. It measures
        elasticity over a segment of the demand curve:
      </p>
      <BlockMath math="E_d = \frac{\Delta Q}{\text{Midpoint of } Q} \div \frac{\Delta P}{\text{Midpoint of } P}" />
      <p className="mb-6">
        Example: Suppose the price of a commodity falls from Br. 5 to Br. 4, and the quantity
        demanded increases from 100 to 110 units:
      </p>
      <BlockMath math="E_d = \frac{110 - 100}{(110 + 100)/2} \div \frac{5 - 4}{(5 + 4)/2} = -\frac{7}{3}" />
      <p className="mb-6">
        The elasticity is negative due to the law of demand, but we often refer to its absolute value.
      </p>

      <h3 className="text-xl font-semibold mt-4">Determinants of Price Elasticity</h3>
      <ul className="list-disc ml-6 mb-6">
        <li>Availability of substitutes: More substitutes make demand more elastic.</li>
        <li>
          Time: In the long run, demand becomes more elastic as consumers adjust their behavior.
        </li>
        <li>
          Proportion of income spent: Goods that constitute a smaller share of income tend to have
          inelastic demand.
        </li>
        <li>
          Importance of the commodity: Necessities (e.g., salt) are inelastic, while luxury goods
          (e.g., gold) are elastic.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">ii. Income Elasticity of Demand</h2>
      <p className="mb-6">
        Income elasticity measures how demand responds to income changes:
      </p>
      <BlockMath math="E_I = \frac{\% \Delta Q}{\% \Delta I}" />
      <p className="mb-6">
        Categories:
        <ul className="list-disc ml-6">
          <li>
            <InlineMath math="E_I > 1" />: Luxury goods
          </li>
          <li>
            <InlineMath math="0 < E_I < 1" />: Necessities
          </li>
          <li>
            <InlineMath math="E_I < 0" />: Inferior goods
          </li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">iii. Cross-Price Elasticity of Demand</h2>
      <p className="mb-6">
        Cross-price elasticity measures how the quantity demanded of one good responds to a price
        change in another good:
      </p>
      <BlockMath math="E_{xy} = \frac{\% \Delta Q_x}{\% \Delta P_y}" />
      <p className="mb-6">
        Categories:
        <ul className="list-disc ml-6">
          <li>
            <InlineMath math="E_{xy} > 0" />: Substitute goods
          </li>
          <li>
            <InlineMath math="E_{xy} < 0" />: Complementary goods
          </li>
          <li>
            <InlineMath math="E_{xy} = 0" />: Unrelated goods
          </li>
        </ul>
      </p>

      <h1 className="text-3xl font-bold mb-6">2.1.3 Elasticity of Demand</h1>
      <p className="mb-6">
        In economics, elasticity is a crucial concept used to analyze the quantitative relationship
        between price and quantity purchased or sold. Elasticity measures the responsiveness of a
        dependent variable to changes in an independent variable. Accordingly, we have the concepts
        of elasticity of demand and elasticity of supply.
      </p>
      <p className="mb-6">
        Elasticity of demand refers to the degree of responsiveness of quantity demanded of a good
        to a change in its price, income, or the price of related goods. Commonly, there are three
        kinds of demand elasticity: price elasticity, income elasticity, and cross elasticity.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">i. Price Elasticity of Demand</h2>
      <p className="mb-6">
        Price elasticity of demand indicates how consumers react to changes in price. It is computed
        as:
      </p>
      <BlockMath math="E_d = \frac{\% \Delta Q_d}{\% \Delta P}" />
      <p className="mb-6">
        Where:
        <ul className="list-disc ml-6">
          <li>
            <InlineMath math="\Delta Q_d" />: Change in quantity demanded
          </li>
          <li>
            <InlineMath math="\Delta P" />: Change in price
          </li>
        </ul>
      </p>

      <h3 className="text-xl font-semibold mt-4">a. Point Price Elasticity</h3>
      <p className="mb-6">
        This is calculated at a specific point on a demand curve:
      </p>
      <BlockMath math="E_d = \frac{\Delta Q}{Q_0} \times \frac{P_0}{\Delta P}" />
      <p className="mb-6">
        On a straight-line demand curve, elasticity differs at every point. This method is ideal for
        small changes in price and quantity demanded.
      </p>

      <h3 className="text-xl font-semibold mt-4">b. Arc Price Elasticity</h3>
      <p className="mb-6">
        Arc elasticity is used when there are larger changes in price and quantity. It measures
        elasticity over a segment of the demand curve:
      </p>
      <BlockMath math="E_d = \frac{\Delta Q}{\text{Midpoint of } Q} \div \frac{\Delta P}{\text{Midpoint of } P}" />
      <p className="mb-6">
        Example: Suppose the price of a commodity falls from Br. 5 to Br. 4, and the quantity
        demanded increases from 100 to 110 units:
      </p>
      <BlockMath math="E_d = \frac{110 - 100}{(110 + 100)/2} \div \frac{5 - 4}{(5 + 4)/2} = -\frac{7}{3}" />
      <p className="mb-6">
        The elasticity is negative due to the law of demand, but we often refer to its absolute value.
      </p>

      <h3 className="text-xl font-semibold mt-4">Determinants of Price Elasticity</h3>
      <ul className="list-disc ml-6 mb-6">
        <li>Availability of substitutes: More substitutes make demand more elastic.</li>
        <li>
          Time: In the long run, demand becomes more elastic as consumers adjust their behavior.
        </li>
        <li>
          Proportion of income spent: Goods that constitute a smaller share of income tend to have
          inelastic demand.
        </li>
        <li>
          Importance of the commodity: Necessities (e.g., salt) are inelastic, while luxury goods
          (e.g., gold) are elastic.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">ii. Income Elasticity of Demand</h2>
      <p className="mb-6">
        Income elasticity measures how demand responds to income changes:
      </p>
      <BlockMath math="E_I = \frac{\% \Delta Q}{\% \Delta I}" />
      <p className="mb-6">
        Categories:
        <ul className="list-disc ml-6">
          <li>
            <InlineMath math="E_I > 1" />: Luxury goods
          </li>
          <li>
            <InlineMath math="0 < E_I < 1" />: Necessities
          </li>
          <li>
            <InlineMath math="E_I < 0" />: Inferior goods
          </li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">iii. Cross-Price Elasticity of Demand</h2>
      <p className="mb-6">
        Cross-price elasticity measures how the quantity demanded of one good responds to a price
        change in another good:
      </p>
      <BlockMath math="E_{xy} = \frac{\% \Delta Q_x}{\% \Delta P_y}" />
      <p className="mb-6">
        Categories:
        <ul className="list-disc ml-6">
          <li>
            <InlineMath math="E_{xy} > 0" />: Substitute goods
          </li>
          <li>
            <InlineMath math="E_{xy} < 0" />: Complementary goods
          </li>
          <li>
            <InlineMath math="E_{xy} = 0" />: Unrelated goods
          </li>
        </ul>
      </p>
    </div>
  );
}

export default TheoryofDemandandSupply;

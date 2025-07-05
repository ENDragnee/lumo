'use client';

import { useState, ReactNode, ChangeEvent } from 'react';
import {
    Home,
    FileText,
    CircleDollarSign,
    MinusCircle,
    Building,
    Calculator,
    ArrowRight,
    Landmark,
    Lightbulb,
    HelpCircle,
    ClipboardPenLine,
    BookMarked
} from 'lucide-react';

// --- i18n Content Object (1-to-1 with PDF pages 19-43) ---
const content = {
    am: {
        title: "ክፍል ሁለት: የቤት ኪራይ ገቢ ግብር (ሠንጠረዥ “ለ“)",
        langButton: "English",

        impositionTitle: "2.1. የቤት ኪራይ ገቢ ግብር ስለመጣል",
        impositionRules: [
            "ግብሩ በየዓመቱ በሚገኝ ገቢ ላይ ይጣላል።",
            "ግብሩ የሚጣለው ለግለሰብ እና ለድርጅት በተለያዩ መጣኔዎች ነው።",
            "ግብሩ ቤት ወይም ህንፃ በማከራየት ገቢ በሚያገኝ ሰው ላይ ይጣላል።",
            "ታክሱ ሊጣል የሚችለው በግብር ዘመኑ ታክስ የሚከፈልበት ገቢ ከተገኘ ነው።"
        ],

        rentalIncomeTitle: "2.2. የቤት ኪራይ ገቢ",
        taxableRentalIncomeDef: "ግብር የሚከፈልበት የኪራይ ገቢ የሚባለው፣ በግብር ዓመቱ ግብር ከፋዩ ቤት በማከራየት ካገኘው ጠቅላላ ዓመታዊ ገቢ ላይ ለግብር ከፋዩ የተፈቀደው ጠቅላላ ወጪ ተቀናሽ ተደርጎ የሚቀረው ገቢ ነው።",
        grossIncomeIncludes: "ቤት በማከራየት የሚገኝ ጠቅላላ ገቢ የሚከተሉትን ይጨምራል፦",
        grossIncomeItems: [
            "የኪራይ ዋጋ ጭማሪን (premium) እና ተመሳሳይ ክፍያዎችን ጨምሮ በኪራይ ውሉ መሠረት ግብር ከፋዩ በግብር ዓመቱ የሚያገኘው ማናቸውም የገንዘብ መጠን፤",
            "ተከራይ አከራዩን በመወከል በግብር ዓመቱ ለሌሎች የሚከፍላቸው ክፍያዎች፤",
            "ለጉዳት ማስተካከያ ይሆን ዘንድ ግብር ከፋዩ የያዘውና ያልተጠቀመበት ለግብር ከፋዩ ገቢ የተደረገው ማናቸውም ገቢ፤",
            "ግብር ከፋዩ ቤቱን ያከራየው ከዕቃዎች ጋር በሚሆንበት ጊዜ ያገኘው ጠቅላላ ገቢ ከዕቃዎቹ የተገኘውን የኪራይ ገቢም ያጠቃልላል።"
        ],

        deductibleExpensesTitle: "2.3. ተቀናሽ የሚደረጉ ወጪዎች",
        noBooksTitle: "የሂሳብ መዝገብ የመያዝ ግዴታ ለሌለበት ግብር ከፋይ",
        noBooksItems: [
            "ታክስን ሳይጨምር ለመሬቱ ወይም ከተከራየው ቤት ጋር በተገናኘ ግብር ከፋዩ ለከተማ አስተዳደር የከፈላቸው ክፍያዎች፤",
            "ከቤት ዕቃና ከመሣሪያ ኪራይ ከሚገኘው ጠቅላላ ገንዘብ ላይ 50% (ለማደሻ፣ መጠገኛና ለእርጅና መተኪያ)።"
        ],
        withBooksTitle: "የሂሳብ መዝገብ የመያዝ ግዴታ ላለበት ግብር ከፋይ",
        withBooksItems: [
            "ገቢውን ለማግኘት የወጣና በግብር ከፋዩ የተከፈለ አስፈላጊ የሆኑ ወጪዎች (ዋስትና ለመስጠት እና ሥራውን ለማስቀጠል የወጡ)።",
            "የመሬት ኪራይ፣ የጥገና ወጪ፣ የእርጅና ቅናሽ፣ ወለድና የመድን አረቦን።",
            "ለፍጆታ (ውሃ፣ ስልክ፣ መብራት) በውሉ መሰረት በተከራይ የሚሸፈኑ ወጪዎች፣ ደረሰኝ ከቀረበ።",
            "የኪራይ ቤቱና መኖሪያው በአንድ ቆጣሪ የሚጠቀሙ ከሆነ ለነዚህ የወጣው ወጪ 75% ተቀናሽ ይደረጋል።",
            "ለማስታወቂያ የወጣ ወጪ (ለመገናኛ ብዙሃን ከሆነ ሙሉ በሙሉ፣ ለሌላ ዝግጅት ከሆነ ከጠቅላላ ገቢ 3% ያልበለጠ)።",
            "ለኪራይ የተገነባ ህንፃ ባይከራይም ለኪራይ ዝግጁ ከሆነ የእርጅና ቅናሹ እንደ ወጪ ይያዛል።"
        ],
        toggleButton: "ለማየት ጠቅ ያድርጉ",

        taxRateTitle: "2.4. የኪራይ ገቢ ግብር ማስከፈያ መጣኔ",
        rateForBodies: "ለድርጅቶች የኪራይ ገቢ ግብር መጣኔ 30% (ሰላሳ በመቶ) ነው።",
        rateForIndividuals: "ለግለሰቦች በሠንጠረዥ 1 መሰረት ከ10% እስከ 35% በሚደርስ መጣኔ ግብር ይከፍላሉ።",
        calculatorTitle: "የግለሰብ የኪራይ ገቢ ግብር ማስያ",
        annualIncomeLabel: "ዓመታዊ የኪራይ ገቢ ያስገቡ (ብር)",
        calculateButton: "አስላ",
        taxResultTitle: "የግብር ስሌት ውጤት",
        taxPayable: "የሚከፈል ግብር",
        incomeBracket: "የገቢ ደረጃ",
        taxRate: "የግብር መጣኔ",
        deductibleAmount: "ተቀናሽ",
        
        subleaserTitle: "2.5. የተከራይ አከራዮች",
        subleaserIncomeDef: "የተከራይ አከራይ ግብር የሚከፈልበት ገቢ ማለት በግብር ዓመቱ ከተቀበለው ጠቅላላ የኪራይ ገቢ ላይ ለዋናው አከራይ የሚከፍለው ኪራይ እና ገቢውን ለማግኘት ያወጣቸው ሌሎች ወጪዎች ከተቀነሱ በኋላ የሚቀረው ገንዘብ ነው።",
        subleaserLiability: "ተከራይ የተከራየውን ቤት መልሶ እንዲያከራይ የሚፈቅድ የቤት ባለቤት፣ ተከራዩ ግብሩን ሳይከፍል ቢቀር፣ ስለእርሱ ሆኖ ግብሩን የመክፈል ኃላፊነት ይኖርበታል።",

        foreignIncomeTitle: "2.6. ከውጭ ሀገር የቤት ኪራይ የሚገኝ ገቢ",
        foreignIncomeText: "በኢትዮጵያ ነዋሪ የሆነ ግብር ከፋይ በውጭ አገር ባገኘው የኪራይ ገቢ ግብር ይከፍላል። የተጣራ የውጭ አገር ኪራይ ገቢ ማለት ከተገኘው ጠቅላላ ገቢ ላይ ተቀናሽ ወጪዎች ከተቀነሰ በኋላ ያለው ነው።",

        lossCarryForwardTitle: "2.7. የቤት ኪራይ ኪሣራዎች",
        lossCarryForwardText: "አንድ ቤት አከራይ ለአንድ የግብር አመት የደረሰበትን ኪሳራ ተካክሶ እስከሚያልቅ ድረስ ለ5 አመታት ማሸጋገር ይችላል። ይህን ማድረግ የሚችለው በግብር ከፋይነት ዘመኑ ሁለት ጊዜ ብቻ ነው።",
        
        quizTitle: "የሙከራ ጥያቄ",
        quizQuestion: "ወ/ሮ ትሁን 500,000 ብር ዓመታዊ ገቢ ከምታከራየው የንግድ ማዕከል ታገኛለች። ለዋናው አከራይ 300,000 ብር ትከፍላለች። በተጨማሪ 50,000 ብር ለፓርቲሽን እና 20,000 ብር ለማስዋቢያ አውጥታለች። ግብር የሚከፈልበት ገቢዋን አስሉ።",
        quizAnswer: "ጠቅላላ ገቢ: 500,000 ብር። ተቀናሽ ወጪዎች: (ለዋና አከራይ) 300,000 + (ፓርቲሽን) 50,000 + (ማስዋቢያ) 20,000 = 370,000 ብር። ግብር የሚከፈልበት ገቢ = 500,000 - 370,000 = 130,000 ብር።",
    },
    en: {
        title: "Part Two: Rental Income Tax (Schedule 'B')",
        langButton: "አማርኛ",

        impositionTitle: "2.1. Imposition of Rental Income Tax",
        impositionRules: [
            "The tax is imposed on income earned annually.",
            "The tax is imposed at different rates for individuals and bodies.",
            "The tax is imposed on any person who earns income from renting out a building.",
            "Tax can only be imposed if taxable income is generated during the tax period."
        ],

        rentalIncomeTitle: "2.2. Rental Income",
        taxableRentalIncomeDef: "Taxable rental income is the income remaining after deducting total allowable expenses from the gross annual income a taxpayer earns from renting out a building in a tax year.",
        grossIncomeIncludes: "Gross income from renting out a building includes the following:",
        grossIncomeItems: [
            "Any amount of money the taxpayer receives in the tax year under a rental agreement, including lease premiums and similar payments;",
            "Payments made by the lessee on behalf of the lessor during the tax year;",
            "Any amount received by the taxpayer as compensation for damages that was held and not used;",
            "If the taxpayer rents out the building with furniture, the gross income includes the rental income derived from the furniture."
        ],

        deductibleExpensesTitle: "2.3. Deductible Expenses",
        noBooksTitle: "For a taxpayer not obligated to keep books of account",
        noBooksItems: [
            "Payments made by the taxpayer to a city administration in relation to the land or rented building, excluding taxes;",
            "50% of the gross income from the rental of furnishings and equipment (for repairs, maintenance, and depreciation)."
        ],
        withBooksTitle: "For a taxpayer obligated to keep books of account",
        withBooksItems: [
            "Necessary expenses incurred by the taxpayer to earn the income (to secure and maintain the business).",
            "Land lease, repair costs, depreciation, interest, and insurance premiums.",
            "Utility costs (water, phone, electricity) covered by the lessee as per the contract, if receipts are provided.",
            "If the rental and residential parts use a single meter, 75% of these costs can be deducted.",
            "Advertising expenses (100% if to media outlets, not exceeding 3% of gross income for other events).",
            "Depreciation for a building constructed for rent is deductible as an expense if it is ready for rent, even if not yet rented."
        ],
        toggleButton: "Click to view",

        taxRateTitle: "2.4. Rental Income Tax Rate",
        rateForBodies: "The rental income tax rate for bodies is 30%.",
        rateForIndividuals: "Individuals pay tax at a progressive rate from 10% to 35% according to Table 1.",
        calculatorTitle: "Individual Rental Tax Calculator",
        annualIncomeLabel: "Enter Annual Rental Income (ETB)",
        calculateButton: "Calculate",
        taxResultTitle: "Tax Calculation Result",
        taxPayable: "Tax Payable",
        incomeBracket: "Income Bracket",
        taxRate: "Tax Rate",
        deductibleAmount: "Deduction",

        subleaserTitle: "2.5. Sub-lessors",
        subleaserIncomeDef: "A sub-lessor's taxable income is the amount remaining after deducting the rent paid to the main lessor and other expenses incurred to earn the income from the total rent received.",
        subleaserLiability: "A building owner who permits a lessee to sub-lease shall be liable for the payment of the tax if the lessee fails to pay.",

        foreignIncomeTitle: "2.6. Foreign-source Rental Income",
        foreignIncomeText: "A resident of Ethiopia is liable for tax on rental income sourced from abroad. Net foreign rental income is the amount after deducting allowable expenses from gross income.",

        lossCarryForwardTitle: "2.7. Rental Business Losses",
        lossCarryForwardText: "A lessor can carry forward a loss incurred in a tax year for up to 5 years until it is fully absorbed. This can only be done twice during their time as a taxpayer.",
        
        quizTitle: "Test Question",
        quizQuestion: "W/ro Tuhun earns 500,000 ETB annual income from sub-leasing a commercial center. She pays 300,000 ETB to the main lessor. She also spent 50,000 ETB for partitions and 20,000 ETB for decoration. Calculate her taxable income.",
        quizAnswer: "Gross Income: 500,000 ETB. Deductible Expenses: (to main lessor) 300,000 + (partition) 50,000 + (decoration) 20,000 = 370,000 ETB. Taxable Income = 500,000 - 370,000 = 130,000 ETB."
    }
};

const individualTaxBrackets = [
    { from: 0, to: 7200, rate: 0, deduction: 0 },
    { from: 7201, to: 19800, rate: 0.10, deduction: 720 },
    { from: 19801, to: 38400, rate: 0.15, deduction: 1710 },
    { from: 38401, to: 63000, rate: 0.20, deduction: 3630 },
    { from: 63001, to: 93600, rate: 0.25, deduction: 6780 },
    { from: 93601, to: 130800, rate: 0.30, deduction: 11460 },
    { from: 130801, to: Infinity, rate: 0.35, deduction: 18000 }
];


// --- Helper Components ---

const Section = ({ title, icon, children }: { title: string, icon: ReactNode, children: ReactNode }) => (
    <div className="mb-12">
        <div className="flex items-center mb-4 border-b-2 border-blue-200 pb-2">
            <div className="text-blue-600 mr-3">{icon}</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="space-y-4 text-gray-700 leading-relaxed pl-2">{children}</div>
    </div>
);

const ToggleSection = ({ title, children, lang }: { title: string, children: ReactNode, lang: 'am'|'en' }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-200 rounded-lg">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100"
            >
                <span>{title}</span>
                <span className="text-sm text-blue-600">{content[lang].toggleButton}</span>
            </button>
            {isOpen && <div className="p-4 bg-white border-t">{children}</div>}
        </div>
    );
};

const TaxCalculator = ({ lang }: { lang: 'am' | 'en' }) => {
    const t = content[lang];
    const [income, setIncome] = useState<string>('');
    const [result, setResult] = useState<{ tax: number, bracket: any } | null>(null);

    const calculateTax = () => {
        const annualIncome = parseFloat(income);
        if (isNaN(annualIncome) || annualIncome < 0) return;

        const bracket = individualTaxBrackets.find(b => annualIncome >= b.from && (b.to === Infinity || annualIncome <= b.to));
        if (bracket) {
            const tax = (annualIncome * bracket.rate) - bracket.deduction;
            setResult({ tax: Math.round(tax * 100) / 100, bracket });
        }
    };
    
    return (
        <div className="p-6 my-8 bg-blue-50 border-t-4 border-blue-400 rounded-b-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4"><Calculator className="mr-2"/>{t.calculatorTitle}</h3>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                    type="number"
                    value={income}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setIncome(e.target.value)}
                    placeholder={t.annualIncomeLabel}
                    className="flex-grow w-full p-2 border border-gray-300 rounded-md"
                />
                <button onClick={calculateTax} className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700">
                    {t.calculateButton}
                </button>
            </div>
            {result && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-bold text-lg">{t.taxResultTitle}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-sm">
                        <div><strong>{t.incomeBracket}:</strong> {result.bracket.from.toLocaleString()} - {result.bracket.to === Infinity ? 'Over' : result.bracket.to.toLocaleString()}</div>
                        <div><strong>{t.taxRate}:</strong> {result.bracket.rate * 100}%</div>
                        <div><strong>{t.deductibleAmount}:</strong> {result.bracket.deduction.toLocaleString()} ETB</div>
                        <div className="sm:col-span-2 text-lg font-bold text-green-700">{t.taxPayable}: {result.tax.toLocaleString()} ETB</div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Chapter Component ---

export default function RentalIncomeTaxChapter() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const [showQuizAnswer, setShowQuizAnswer] = useState(false);
    const t = content[lang];

    const toggleLanguage = () => {
        setLang(lang === 'am' ? 'en' : 'am');
    };

    return (
        <div className="font-sans bg-gray-100 p-4 sm:p-6 md:p-8">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg">
                <header className="bg-blue-700 text-white p-6 rounded-t-lg relative">
                    <div className="flex items-center">
                        <Home className="h-10 w-10 mr-4" />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1>
                        </div>
                    </div>
                    <button onClick={toggleLanguage} className="absolute top-4 right-4 bg-white text-blue-700 font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-100">
                        {t.langButton}
                    </button>
                </header>

                <main className="p-6 md:p-10">
                    <Section title={t.impositionTitle} icon={<FileText />}>
                        <ul className="list-disc list-inside space-y-2">{t.impositionRules.map((r, i) => <li key={i}>{r}</li>)}</ul>
                    </Section>

                    <Section title={t.rentalIncomeTitle} icon={<CircleDollarSign />}>
                        <p className="p-3 bg-gray-50 rounded-md">{t.taxableRentalIncomeDef}</p>
                        <h4 className="font-semibold">{t.grossIncomeIncludes}</h4>
                        <ul className="list-decimal list-inside space-y-2">{t.grossIncomeItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
                    </Section>
                    
                    <Section title={t.deductibleExpensesTitle} icon={<MinusCircle />}>
                        <div className="space-y-4">
                            <ToggleSection title={t.noBooksTitle} lang={lang}>
                                <ul className="list-disc list-inside space-y-2">{t.noBooksItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
                            </ToggleSection>
                            <ToggleSection title={t.withBooksTitle} lang={lang}>
                                <ul className="list-disc list-inside space-y-2">{t.withBooksItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
                            </ToggleSection>
                        </div>
                    </Section>

                    <Section title={t.taxRateTitle} icon={<Building />}>
                        <p className="font-semibold">{t.rateForBodies}</p>
                        <p>{t.rateForIndividuals}</p>
                        <TaxCalculator lang={lang} />
                    </Section>

                    <Section title={t.subleaserTitle} icon={<Building />}>
                        <p>{t.subleaserIncomeDef}</p>
                        <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400"><p>{t.subleaserLiability}</p></div>
                    </Section>

                    <div className="my-10 p-6 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{t.quizTitle}</h3>
                        <p className="font-semibold text-gray-800 flex items-start"><HelpCircle className="h-5 w-5 mr-2 mt-1 flex-shrink-0"/>{t.quizQuestion}</p>
                        <button onClick={() => setShowQuizAnswer(!showQuizAnswer)} className="text-sm text-blue-600 hover:underline mt-2">
                            {showQuizAnswer ? "Hide Answer" : "Show Answer"}
                        </button>
                        {showQuizAnswer && <p className="mt-2 p-3 bg-green-50 rounded-md border border-green-200 flex items-start"><Lightbulb className="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-green-600"/>{t.quizAnswer}</p>}
                    </div>
                </main>
            </div>
        </div>
    );
}

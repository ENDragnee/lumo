'use client';

import { useState, ReactNode } from 'react';
import {
    Home,
    FileText,
    TrendingDown,
    Building,
    Calculator,
    BookOpen,
    HelpCircle,
    Lightbulb,
    FileMinus,
    FilePlus,
    Landmark
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object (1-to-1 with PDF pages 19-43) ---
const content = {
    am: {
        title: "ክፍል ሁለት: የቤት ኪራይ ገቢ ግብር (ሠንጠረዥ “ለ“)",
        langButton: "English",

        section2_1_Title: "2.1. የቤት ኪራይ ገቢ ግብር ስለመጣል",
        impositionRules: [
            "ግብሩ በየዓመቱ በሚገኝ ገቢ ላይ ይጣላል።",
            "ግብሩ የሚጣለው ለግለሰብ እና ለድርጅት በተለያዩ መጣኔዎች ነው።",
            "ግብሩ ቤት ወይም ህንፃ በማከራየት ገቢ በሚያገኝ ሰው ላይ ይጣላል።",
            "ታክሱ ሊጣል የሚችለው በግብር ዘመኑ ታክስ የሚከፈልበት ገቢ ከተገኘ ነው።"
        ],
        
        section2_2_Title: "2.2. የቤት ኪራይ ገቢ",
        rentalIncomeDefinition: "ግብር የሚከፈልበት የኪራይ ገቢ የሚባለው በግብር ዓመቱ ግብር ከፋዩ ቤት በማከራየት ካገኘው ጠቅላላ ዓመታዊ ገቢ ላይ ለግብር ከፋዩ የተፈቀደው ጠቅላላ ወጪ ተቀናሽ ተደርጎ የሚቀረው ገቢ ነው።",
        grossIncomeIncludes: [
            "የኪራይ ዋጋ ጭማሪን (premium)።",
            "ተመሳሳይ ክፍያዎችን ጨምሮ በኪራይ ውሉ መሠረት ግብር ከፋዩ በግብር ዓመቱ የሚያገኘው ማናቸውም የገንዘብ መጠን።",
            "ተከራይ አከራዩን በመወከል በግብር ዓመቱ ለሌሎች የሚከፍላቸው ክፍያዎች።",
            "ለጉዳት ማስተካከያ ተብሎ ተይዞ ያልተተጠቀመበትና ለግብር ከፋዩ ገቢ የተደረገው ማናቸውም ገቢ።",
            "ግብር ከፋዩ ቤቱን ከዕቃዎች ጋር ካከራየ፣ ጠቅላላ ገቢው ከዕቃዎቹ የተገኘውን የኪራይ ገቢም ያጠቃልላል።"
        ],

        section2_3_Title: "2.3. ተቀናሽ የሚደረጉ ወጪዎች",
        deductibleTabs: {
            noBooks: "የሂሳብ መዝገብ ለሌለው",
            withBooks: "የሂሳብ መዝገብ ላለው"
        },
        noBooksDeductions: [
            "ታክስን ሳይጨምር ለመሬቱ ወይም ከተከራየው ቤት ጋር በተገናኘ ግብር ከፋዩ ለከተማ አስተዳደር የከፈላቸው ክፍያዎች።",
            "ከቤት ዕቃና ከመሣሪያ ኪራይ ከሚገኘው ጠቅላላ ገንዘብ ላይ 50% (ለማደሻ፣ መጠገኛ እና ለእርጅና መተኪያ)።"
        ],
        withBooksDeductions: [
            "ገቢውን ለማግኘት፣ ዋስትና ለመስጠት እና ሥራውን ለማስቀጠል የወጡና በግብር ከፋዩ የተከፈሉ አስፈላጊ ወጪዎች።",
            "የመሬት ኪራይ፣ የጥገና ወጪ፣ የእርጅና ቅናሽ፣ ወለድና የመድን አረቦን።",
            "የውሃ፣ የስልክ፣ የመብራት ወጪዎች በውሉ ላይ በተከራይ እንዲከፈሉ ከተገለጸና ደረሰኝ ከቀረበ።",
            "የኪራይ ቤቱና መኖሪያው አንድ ቆጣሪ የሚጠቀሙ ከሆነ ከጠቅላላ ወጪው 75% ተቀናሽ ይደረጋል።",
            "የማስታወቂያ ወጪ ለመገናኛ ብዙሃን ከሆነ ሙሉ በሙሉ፣ ለሌላ ዝግጅት ከሆነ ከጠቅላላ ገቢው 3% ያልበለጠ።",
            "ለኪራይ የተዘጋጀ ህንፃ ባይከራይም የእርጅና ቅናሹ እንደ ወጪ ይያዛል።",
            "ለእርጅና ቅናሽ መነሻ የሚሆነው የግንባታ ወይም የግዢ ዋጋ ሲሆን፣ ይህ ከሌለ 70% የገበያ ዋጋ ይሆናል።"
        ],

        section2_4_Title: "2.4. የኪራይ ገቢ ግብር ማስከፈያ መጣኔ",
        taxRates: {
            body: "ለድርጅቶች የኪራይ ገቢ ግብር መጣኔ 30% (ሰላሳ በመቶ)።",
            individual: "ለግለሰቦች ከ10% እስከ 35% በሚደርስ መጣኔ ግብር ይከፍላሉ።"
        },
        taxBracketsTitle: "2.4.1. የግለሰብ የኪራይ ገቢ ግብር መጣኔ",
        taxTableHeaders: ["ግብር የሚከፈልበት የኪራይ ገቢ (በዓመት)", "የግብር መጣኔ", "ተቀናሽ (ብር)"],
        taxBrackets: [
            ["0 - 7,200", "0%", "0"],
            ["7,201 - 19,800", "10%", "720"],
            ["19,801 - 38,400", "15%", "1,710"],
            ["38,401 - 63,000", "20%", "3,630"],
            ["63,001 - 93,600", "25%", "6,780"],
            ["93,601 - 130,800", "30%", "11,460"],
            ["ከ 130,801 በላይ", "35%", "18,000"]
        ],

        otherTopicsTitle: "ሌሎች ተዛማጅ ርዕሶች",
        otherTopics: {
            sublessor: { title: "2.5. የተከራይ አከራዮች", text: "የተከራይ አከራይ ታክስ የሚከፈልበት ገቢ ማለት ከተቀበለው ጠቅላላ ኪራይ ላይ ለዋናው አከራይ የከፈለው ኪራይና ሌሎች ወጪዎች ተቀንሶ የሚቀረው ነው። ዋናው አከራይ ለተከራዩ ግብር ክፍያ ተጠያቂ ሊሆን ይችላል።" },
            foreignIncome: { title: "2.6. ከውጭ ሀገር የሚገኝ የኪራይ ገቢ", text: "በኢትዮጵያ ነዋሪ የሆነ ግብር ከፋይ በውጭ ሀገር ባገኘው የኪራይ ገቢ ላይ ግብር ይከፍላል።" },
            losses: { title: "2.7. የቤት ኪራይ ኪሣራዎች", text: "አንድ አከራይ የደረሰበትን ኪሳራ እስከ 5 ዓመታት ድረስ ማሸጋገር ይችላል። ይህን ማድረግ የሚችለው በግብር ከፋይነት ዘመኑ ሁለት ጊዜ ብቻ ነው።" },
            notification: { title: "2.8. ስለ አዲስ የሚከራይ ቤት ማሳወቅ", text: "አዲስ ቤት ሲጠናቀቅ ወይም ሲከራይ ባለቤቱና ኮንትራክተሩ በ1 ወር ውስጥ ለቀበሌ/ከተማ አስተዳደር ማሳወቅ አለባቸው።" },
            estimation: { title: "2.9. የኪራይ ገቢ ግምት አወሳሰን", text: "የኪራይ ገቢ በውል፣ በገበያ ዋጋ ወይም በሌላ መረጃ ተመስርቶ በባለስልጣኑ ሊገመት ይችላል። ለደረጃ 'ሀ' እና 'ለ' በግምት ሲወሰን 65% ገቢው ታክስ የሚከፈልበት ይሆናል።" }
        },
        
        caseStudyTitle: "የሙከራ ጥያቄ",
        caseStudyScenario: "ወ/ሮ ትሁን ባንተ የተባለች ግለሰብ አንድ የንግድ ማእከል ተከራይታ የምታከራይ ስትሆን ከምታከራየው አጠቃላይ የአመት ገቢዋ 500,000 ብር ታገኛለች። ለአንድ ዓመት ለዋና አከራዩ የምትከፍለው 300,000 ብር ነው። አከራይዋ ገቢውን ለማግኘት ቤቱን ለፓርቲሽን 50,000 ብር እና ለማስዋቢያ 20,000 ብር አውጥታለች።",
        question1: "1. ግብር የሚከፈልበትን ገቢ አስሉ።",
        question2: "2. በዚህ ኪራይ ላይ የተጨማሪ እሴት ታክስ (VAT) ይሰበሰባል? ወይስ ተርን ኦቨር ታክስ (TOT)? ለምን?",
        showSolution: "መፍትሄ አሳይ",
        hideSolution: "መፍትሄ ደብቅ",
        solution: {
            q1Calc: "ጠቅላላ ገቢ: 500,000 ብር\nተቀናሽ ወጪዎች:\n  - ለዋና አከራይ የተከፈለ: 300,000\n  - የፓርቲሽን ወጪ: 50,000\n  - የማስዋቢያ ወጪ: 20,000\n  - ጠቅላላ ወጪ: 370,000 ብር\n\nግብር የሚከፈልበት ገቢ = 500,000 - 370,000 = 130,000 ብር",
            q2Answer: "የተጨማሪ እሴት ታክስ (VAT) አይሰበሰብም። የንግድ ቦታ ኪራይ ለVAT ተገዥ ቢሆንም፣ አመታዊ ገቢው (500,000 ብር) ለVAT ምዝገባ ከሚያስፈልገው የ1,000,000 ብር ገደብ በታች ነው። ስለዚህ፣ በምትኩ 2% ተርን ኦቨር ታክስ (TOT) ትከፍላለች።"
        }
    },
    en: {
        title: "Part Two: Rental Income Tax (Schedule 'B')",
        langButton: "አማርኛ",

        section2_1_Title: "2.1. About Imposing Rental Income Tax",
        impositionRules: [
            "The tax is imposed annually on income.",
            "The tax is imposed on individuals and bodies at different rates.",
            "The tax is imposed on any person who earns income from renting houses or buildings.",
            "The tax is imposable if taxable income is earned during the tax period."
        ],

        section2_2_Title: "2.2. Rental Income",
        rentalIncomeDefinition: "Taxable rental income is defined as the net income remaining after deducting total allowable expenses from the gross annual income a taxpayer earns from renting out a house in a tax year.",
        grossIncomeIncludes: [
            "Rent premium.",
            "Any other monetary amount the taxpayer receives in the tax year as per the lease agreement, including similar payments.",
            "Payments made by the lessee on behalf of the lessor to third parties during the tax year.",
            "Any deposit held by the lessor for damages that is not used and becomes income to the lessor.",
            "If the taxpayer rents out the house with furniture, the gross income includes the rental income from the furniture."
        ],
        
        section2_3_Title: "2.3. Deductible Expenses",
        deductibleTabs: {
            noBooks: "For Taxpayers without Bookkeeping",
            withBooks: "For Taxpayers with Bookkeeping"
        },
        noBooksDeductions: [
            "Payments made by the taxpayer to the city administration related to the land or rented house, excluding tax.",
            "50% of income from renting furnishings/equipment."
        ],
        withBooksDeductions: [
            "Necessary expenses to earn, secure, and maintain the income.",
            "Land lease, repair costs, depreciation allowance, interest, and insurance premiums.",
            "Costs of water, telephone, and electricity if specified in the contract to be paid by the lessee and a receipt is provided.",
            "If the rental property and residence share a single meter, 75% of the total expense is deductible.",
            "Advertising expenses are fully deductible if paid to mass media, otherwise limited to 3% of gross income.",
            "Depreciation for a building prepared for rent can be claimed even if it is not rented.",
            "The cost base for depreciation is the purchase/construction cost, or if unavailable, 70% of the market value."
        ],

        section2_4_Title: "2.4. Rental Income Tax Rates",
        taxRates: {
            body: "The rental income tax rate for bodies is 30% (thirty percent).",
            individual: "Individuals pay tax at rates ranging from 10% to 35%."
        },
        taxBracketsTitle: "2.4.1. Individual Rental Income Tax Brackets",
        taxTableHeaders: ["Taxable Rental Income (Per Annum)", "Tax Rate", "Deduction (ETB)"],
        taxBrackets: [
            ["0 - 7,200", "0%", "0"],
            ["7,201 - 19,800", "10%", "720"],
            ["19,801 - 38,400", "15%", "1,710"],
            ["38,401 - 63,000", "20%", "3,630"],
            ["63,001 - 93,600", "25%", "6,780"],
            ["93,601 - 130,800", "30%", "11,460"],
            ["Over 130,801", "35%", "18,000"]
        ],
        
        otherTopicsTitle: "Other Related Topics",
        otherTopics: {
            sublessor: { title: "2.5. Sub-lessors", text: "A sub-lessor's taxable income is the gross rent received minus the rent paid to the primary lessor and other expenses. The primary lessor may be held liable for the sub-lessor's tax payment." },
            foreignIncome: { title: "2.6. Rental Income from Foreign Sources", text: "A resident of Ethiopia is liable to pay tax on rental income earned from foreign sources." },
            losses: { title: "2.7. Rental Losses", text: "A lessor can carry forward a loss for up to 5 years. This can only be done twice during their time as a taxpayer." },
            notification: { title: "2.8. Notification of a New Rental Property", text: "Upon completion or rental of a new building, the owner and contractor must notify the local administration within one month." },
            estimation: { title: "2.9. Assessment by Estimation", text: "Rental income can be estimated by the authority based on contracts, current market prices, etc. For Category 'A' and 'B' taxpayers under estimation, 65% of the gross income is considered taxable." }
        },
        
        caseStudyTitle: "Test Question",
        caseStudyScenario: "Ms. Tuhun Bante, an individual, rents a commercial center and sub-leases it, earning a gross annual income of ETB 500,000. She pays ETB 300,000 per year to the primary lessor. To earn this income, she spent ETB 50,000 on partitions and ETB 20,000 on decorations.",
        question1: "1. Calculate the taxable income.",
        question2: "2. Is Value Added Tax (VAT) collected on this rent? Or Turnover Tax (TOT)? Why?",
        showSolution: "Show Solution",
        hideSolution: "Hide Solution",
        solution: {
            q1Calc: "Gross Income: ETB 500,000\nDeductible Expenses:\n  - Rent paid to primary lessor: 300,000\n  - Partition cost: 50,000\n  - Decoration cost: 20,000\n  - Total Expenses: ETB 370,000\n\nTaxable Income = 500,000 - 370,000 = ETB 130,000",
            q2Answer: "Value Added Tax (VAT) is not collected. Although rental of commercial property is a vatable service, the annual turnover (ETB 500,000) is below the VAT registration threshold of ETB 1,000,000. Therefore, she will pay 2% Turnover Tax (TOT) instead."
        }
    }
};

// --- Helper Components ---

const Section = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => (
    <div className="mb-8">
        <div className="flex items-center mb-3 border-b pb-2">
            <div className="text-blue-600 mr-3">{icon}</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="space-y-3 text-gray-700 leading-relaxed">{children}</div>
    </div>
);

const CaseStudyQuiz = ({ lang }: { lang: 'am' | 'en' }) => {
    const [showSolution, setShowSolution] = useState(false);
    const t = content[lang];
    
    return (
        <div className="my-6 p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{t.caseStudyTitle}</h3>
            <p className="text-gray-600 mb-3 italic">{t.caseStudyScenario}</p>
            <div className="font-semibold text-gray-800 space-y-2">
                <p>{t.question1}</p>
                <p>{t.question2}</p>
            </div>
            <button
                onClick={() => setShowSolution(!showSolution)}
                className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
                {showSolution ? t.hideSolution : t.showSolution}
            </button>
            {showSolution && (
                <div className="mt-3 p-3 bg-green-50 whitespace-pre-wrap font-mono text-sm">
                    <h4 className="font-sans font-bold text-lg mb-2 text-green-800">Solution:</h4>
                    <p className="font-sans font-semibold text-green-700">Answer to Question 1:</p>
                    <p>{t.solution.q1Calc}</p>
                    <p className="font-sans font-semibold text-green-700 mt-4">Answer to Question 2:</p>
                    <p className="font-sans whitespace-normal">{t.solution.q2Answer}</p>
                </div>
            )}
        </div>
    );
};


// --- Main Chapter Component ---

export default function RentalIncomeTaxChapter() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const [activeTab, setActiveTab] = useState('withBooks');
    const t = content[lang];

    const toggleLanguage = () => {
        setLang(lang === 'am' ? 'en' : 'am');
    };

    return (
        <div className="font-sans p-2 sm:p-4">
            <div className="max-w-full mx-auto">
                <header className="py-4 border-b relative">
                    <div className="flex items-center">
                        <Home className="h-8 w-8 mr-3" />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1>
                        </div>
                    </div>
                    <button onClick={toggleLanguage} className="absolute top-4 right-4 text-gray-800 font-semibold py-2 px-4 text-sm">
                        {t.langButton}
                    </button>
                </header>

                <main className="py-4">
                    <Section title={t.section2_1_Title} icon={<Landmark />}>
                        <ul className="list-disc list-inside space-y-2">
                            {t.impositionRules.map((rule, i) => <li key={i}>{rule}</li>)}
                        </ul>
                    </Section>
                    
                    <Section title={t.section2_2_Title} icon={<FileText />}>
                        <p className="font-medium">{t.rentalIncomeDefinition}</p>
                        <h4 className="font-bold mt-3">Gross income includes:</h4>
                         <ul className="list-disc list-inside space-y-2">
                            {t.grossIncomeIncludes.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </Section>

                    <Section title={t.section2_3_Title} icon={<TrendingDown />}>
                         <div className="flex border-b">
                            <button onClick={() => setActiveTab('withBooks')} className={`py-2 px-4 -mb-px ${activeTab === 'withBooks' ? 'border-b-2 border-blue-500 font-semibold text-blue-600' : 'text-gray-500'}`}>
                                {t.deductibleTabs.withBooks}
                            </button>
                            <button onClick={() => setActiveTab('noBooks')} className={`py-2 px-4 -mb-px ${activeTab === 'noBooks' ? 'border-b-2 border-blue-500 font-semibold text-blue-600' : 'text-gray-500'}`}>
                                {t.deductibleTabs.noBooks}
                            </button>
                         </div>
                         <div className="p-3">
                             {activeTab === 'withBooks' && <ul className="list-disc list-inside space-y-2">{t.withBooksDeductions.map((item, i) => <li key={i}>{item}</li>)}</ul>}
                             {activeTab === 'noBooks' && <ul className="list-disc list-inside space-y-2">{t.noBooksDeductions.map((item, i) => <li key={i}>{item}</li>)}</ul>}
                         </div>
                    </Section>
                    
                    <Section title={t.section2_4_Title} icon={<Calculator />}>
                        <p>{t.taxRates.body}</p>
                        <p>{t.taxRates.individual}</p>
                        <h4 className="font-bold text-lg mt-3">{t.taxBracketsTitle}</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr>{t.taxTableHeaders.map(h => <th key={h} className="py-2 px-4 border-b text-left font-semibold">{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {t.taxBrackets.map((row, i) => <tr key={i}><td className="py-2 px-4 border-b">{row[0]}</td><td className="py-2 px-4 border-b">{row[1]}</td><td className="py-2 px-4 border-b">{row[2]}</td></tr>)} 
                                </tbody>
                            </table>
                        </div>
                    </Section>

                    <Section title={t.otherTopicsTitle} icon={<BookOpen />}>
                        <div className="space-y-3">
                            {Object.values(t.otherTopics).map(topic => (
                                <div key={topic.title} className="p-2">
                                    <h4 className="font-bold text-gray-800">{topic.title}</h4>
                                    <p className="text-sm">{topic.text}</p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <CaseStudyQuiz lang={lang} />
                    <ChapterNavigation previous="/content/686e8e6223afc16ef4f670a5" next="/content/686e8e6323afc16ef4f670ab" lang={lang} />
                </main>
            </div>
        </div>
    );
}

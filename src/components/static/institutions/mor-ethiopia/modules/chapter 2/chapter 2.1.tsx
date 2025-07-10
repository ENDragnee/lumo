'use client';

import { useState, ReactNode } from 'react';
import {
    Briefcase,
    FileText,
    CircleDollarSign,
    Percent,
    MinusCircle,
    TrendingDown,
    Calculator,
    Lightbulb,
    HelpCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object ---
const content = {
    am: {
        title: "ክፍል ሦስት: የንግድ ስራ ገቢ ግብር (ሰንጠረዥ ሐ)",
        langButton: "English",

        taxableIncomeTitle: "3.1. ግብር የሚከፈልበት የንግድ ስራ ገቢ",
        taxableIncomeDef: "ግብር የሚከፈልበት የንግድ ስራ ገቢ የሚባለው በግብር ዓመቱ ከተገኘው ጠቅላላ የንግድ ስራ ገቢ ላይ በህግ የተፈቀዱ ወጪዎች ተቀንሰው የሚገኘው የተጣራ የገቢ መጠን ነው።",
        ifrsNote: "ግብር የሚከፈልበት የንግድ ስራ ገቢ የሚወሰነው በአለም አቀፍ የፋይናንስ ሪፖርት አቀራረብ ደረጃዎች (IFRS) መሠረት በሚዘጋጀው የትርፍና ኪሳራ መግለጫ ላይ በመመስረት ሲሆን፣ የገቢ ግብር አዋጅ፣ ደንብ እና መመሪያዎች እንደተጠበቁ ሆነው ነው።",

        businessIncomeTitle: "3.2. የንግድ ስራ ገቢ",
        businessIncomeItems: [
            "ግብር ከፋዩ ዕቃዎችን በማስተላለፍ እና አገልግሎቶችን በመስጠት (መቀጠርን ሳይጨምር) የሚያገኘውን የገንዘብ መጠን ጨምሮ በግብር ዓመቱ ከንግድ ስራ ያገኘው ጠቅላላ የገንዘብ መጠን፤",
            "የንግድ ስራ ሃብትን በማስተላለፍ የሚገኝ የገንዘብ መጠን፤",
            "የግብር ከፋዩ ገቢ ተደርገው የተወሰዱ ሌሎች ማናቸውም ገቢዎች፤",
            "የካፒታል ንብረት የሆነን የንግድ ስራ ሃብት በማስተላለፍ በሚገኝ ጥቅም።"
        ],
        
        taxRateTitle: "3.3. የንግድ ስራ ገቢ ግብር ማስከፈያ መጣኔ",
        rateForBodies: "በድርጅቶች የሚከፈለው የንግድ ስራ ገቢ ግብር መጣኔ 30% (ሰላሳ በመቶ) ነው።",
        rateForIndividuals: "የግለሰቦች ግብር ማስከፈያ መጣኔዎች በሠንጠረዥ 2 መሰረት ከ10% እስከ 35% መጣኔ ግብር ይከፍላሉ።",
        calculatorTitle: "የግለሰብ የንግድ ገቢ ግብር ማስያ",
        annualIncomeLabel: "ዓመታዊ የንግድ ገቢ ያስገቡ (ብር)",
        
        deductibleExpensesTitle: "3.4. ተቀናሽ የሚደረጉ ወጪዎች",
        deductibleGeneral: "ገደቦች እንደተጠበቁ ሆኖ、 ገቢዎችን ለማግኘት、 ለንግዱ ስራ ዋስትና ለመስጠትና ለማስቀጠል በግብር ከፋዩ የተደረጉ አስፈላጊ ወጪዎች ተቀናሽ ይሆናሉ።",
        deductions: [
            { title: "የንግድ ዕቃ ወጪ", text: "በግብር ዓመቱ ለተሸጠ የንግድ ዕቃ (trading stock) የወጣ ወጪ።" },
            { title: "የእርጅና ቅናሽ", text: "ዋጋቸው ለሚቀንስ የንግድ ስራ ሃብቶችና ግዙፋዊ ህልውና ለሌላቸው ሃብቶች የሚታሰብ ጠቅላላ የእርጅና ቅናሽ።" },
            { title: "የኪሣራ ተቀናሽ", text: "የንግድ ዕቃን ሳይጨምር、 ግብር ከፋዩ በዓመቱ የንግድ ስራ ሃብትን በማስተላለፍ የገጠመው ኪሣራ።" },
            { title: "የህክምና ወጪ", text: "በሠራተኛው የጤና ዕቅድ መሰረት ቀጣሪ ለሠራተኛው ለሕክምና አገልግሎት የሚያወጣው ወጪ።" },
            { title: "የወለድ ወጪ", text: "ብድሩ የንግድ ገቢ ለማግኘት የዋለ ከሆነ እና ከተፈቀደለት የፋይናንስ ተቋም የተገኘ ከሆነ የሚከፈል ወለድ።" },
            { title: "የበጎ አድራጎት ስጦታ", text: "ለበጎ አድራጎት የተደረገ ስጦታ፣ ከግብር ከሚከፈልበት ገቢ እስከ 10% ድረስ።" },
            { title: "የማይሰበሰብ ዕዳ", text: "ዕዳው ቀደም ሲል እንደ ገቢ ከተመዘገበ እና ለማስከፈል ህጋዊ እርምጃ ተወስዶ ካልተሳካ።" }
        ],

        nonDeductibleTitle: "3.10. ተቀናሽ የማይደረጉ ወጪዎች እና ኪሳራዎች",
        nonDeductibleItems: [
            "የካፒታልነት ባህርይ ያላቸው ወጪዎች።",
            "የኩባንያ አክሲዮን ወይም የሽርክና ማህበር ካፒታል ለማሳደግ የሚወጣ ወጪ።",
            "ከተቀጣሪው የወር ደመወዝ 15% በላይ በፈቃደኝነት የሚደረግ የጡረታ/ፕሮቪደንት ፈንድ መዋጮ።",
            "የአክሲዮን ድርሻ እና የትርፍ ድርሻ ክፍፍል።",
            "በመድን፣ በካሳ ወይም በዋስትና ውል የተመለሰ ወይም ሊመለስ የሚችል ወጪ/ኪሳራ።",
            "ህግ ወይም ውል በመጣስ የሚጣል የገንዘብ ቅጣት ወይም ካሳ።",
            "ግብር ከፋዩ ለራሱ የሚያወጣው የግል ወጪ።",
            "የገቢ ግብር ወይም ተመላሽ የሚደረግ ተ.እ.ታ።",
            "ለመዝናኛ የሚወጣ ወጪ (ከተወሰኑ ዘርፎች በስተቀር)።",
            "ከበጎ አድራጎት ውጭ የሚደረግ ስጦታ ወይም እርዳታ።"
        ],
        
        lossCarryForwardTitle: "3.9. ኪሳራ",
        lossCarryForwardText: "ኪሳራ ለማሸጋገር የሚቻለው ኪሳራው ከደረሰበት ዓመት ቀጥሎ ላሉት አምስት ዓመታት ነው። የሚፈቀደውም ለሁለት የግብር አመታት ብቻ የደረሰ ኪሳራ ነው።",
        
        quizTitle: "የሙከራ ጥያቄዎች",
        q1: "ስንት አይነት የዕርጅና ቅናሽ ዘዴዎች አሉ? ዘርዝሩ።",
        a1: "ሁለት አይነት ናቸው፡ 1) ቀጥተኛ የእርጅና ቅናሽ ዘዴ እና 2) ዋጋው እየቀነሰ የሚሄድ የእርጅና ቅናሽ ዘዴ።",
        q2: "አንድ ሃብት 1.5 ሚሊዮን ብር ሆኖ የአገልግሎት ዘመኑ 5 ዓመት እና የእርጅና መጣኔው 10% ቢሆን፣ በቀጥተኛ ዘዴ ሲሰላ በአምስተኛው ዓመት መጨረሻ የሃብቱ ዋጋ ስንት ይሆናል?",
        a2: "ዓመታዊ ቅናሽ = 1,500,000 * 10% = 150,000 ብር። ጠቅላላ ቅናሽ በ5 ዓመት = 150,000 * 5 = 750,000 ብር። ቀሪ ዋጋ = 1,500,000 - 750,000 = 750,000 ብር።",
        q3: "ሙሉ ለሙሉ እና በገደብ ተቀናሽ የሚደረጉ የንግድ ስራ ወጪዎችን ዘርዝሩ።",
        a3: "ሙሉ ለሙሉ: ለመገናኛ ብዙሃን የሚከፈል ማስታወቂያ። በገደብ: ለበጎ አድራጎት የሚሰጥ ስጦታ (እስከ 10% የ taxable ገቢ)፣ ለምግብና መጠለያ የሚደረግ የጉዞ ወጪ (እስከ 1000 ብር በቀን)።",

        showAnswer: "መልስ አሳይ",
        hideAnswer: "መልስ ደብቅ"
    },
    en: {
        title: "Part Three: Business Income Tax (Schedule C)",
        langButton: "አማርኛ",

        taxableIncomeTitle: "3.1. Taxable Business Income",
        taxableIncomeDef: "Taxable business income is the net income amount obtained after deducting legally permitted expenses from the gross business income earned in the tax year.",
        ifrsNote: "Taxable business income is determined based on the profit and loss statement prepared in accordance with International Financial Reporting Standards (IFRS), subject to the provisions of the Income Tax Proclamation, regulations, and directives.",

        businessIncomeTitle: "3.2. Business Income",
        businessIncomeItems: [
            "The total amount of money a taxpayer receives from business activities during the tax year, including amounts from transferring goods and rendering services (excluding employment).",
            "The amount of money received from transferring a business asset.",
            "Any other income considered as the taxpayer's income.",
            "Gain on the disposal of a business asset that is a capital asset."
        ],
        
        taxRateTitle: "3.3. Business Income Tax Rate",
        rateForBodies: "The business income tax rate payable by bodies is 30%.",
        rateForIndividuals: "The tax rates for individuals are progressive from 10% to 35% according to Table 2.",
        calculatorTitle: "Individual Business Tax Calculator",
        annualIncomeLabel: "Enter Annual Business Income (ETB)",

        deductibleExpensesTitle: "3.4. Deductible Expenses",
        deductibleGeneral: "Subject to limitations, necessary expenses incurred by the taxpayer to generate, secure, and maintain business income are deductible.",
        deductions: [
            { title: "Cost of Trading Stock", text: "The cost of trading stock sold during the tax year." },
            { title: "Depreciation Allowance", text: "The total depreciation allowance for the taxpayer's depreciable assets and intangible assets." },
            { title: "Loss on Disposal", text: "The loss on disposal of a business asset (other than trading stock) by the taxpayer during the year." },
            { title: "Medical Expenses", text: "Medical expenses incurred by an employer for an employee under a health plan." },
            { title: "Interest Expense", text: "Interest incurred on a loan if the loan was used to generate business income and obtained from a recognized financial institution." },
            { title: "Charitable Donations", text: "Donations made to charitable causes, up to 10% of the taxable income." },
            { title: "Bad Debts", text: "A debt that was previously included in income and for which legal action to collect has been unsuccessful." }
        ],

        nonDeductibleTitle: "3.10. Non-Deductible Expenses and Losses",
        nonDeductibleItems: [
            "Expenses of a capital nature.",
            "Expenses incurred to increase the capital of a company or partnership.",
            "Voluntary pension or provident fund contributions exceeding 15% of the employee's monthly salary.",
            "An expense or loss that is recoverable by insurance, indemnity, or warranty.",
            "Fines or penalties for violation of any law or contract.",
            "Personal consumption expenses of the taxpayer.",
            "Income tax or recoverable VAT.",
            "Entertainment expenses (with exceptions for certain sectors).",
            "Donations or gifts other than to charitable causes."
        ],

        lossCarryForwardTitle: "3.9. Losses",
        lossCarryForwardText: "A loss can be carried forward for the five consecutive years following the year the loss was incurred. This is only permitted for losses incurred in two tax years.",

        quizTitle: "Test Questions",
        q1: "How many types of depreciation methods are there? List them.",
        a1: "There are two types: 1) Straight-line depreciation method, and 2) Declining-balance depreciation method.",
        q2: "If an asset costs 1.5 million ETB with a useful life of 5 years and a depreciation rate of 10%, what will be its book value at the end of the fifth year using the straight-line method?",
        a2: "Annual Depreciation = 1,500,000 * 10% = 150,000 ETB. Total Depreciation in 5 years = 150,000 * 5 = 750,000 ETB. Remaining Book Value = 1,500,000 - 750,000 = 750,000 ETB.",
        q3: "List some business expenses that are fully deductible and some that are deductible with limits.",
        a3: "Fully deductible: Advertising paid to mass media. Deductible with limits: Charitable donations (up to 10% of taxable income), travel expenses for food and lodging (up to 1000 ETB per day).",

        showAnswer: "Show Answer",
        hideAnswer: "Hide Answer"
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
    <div className="mb-8">
        <div className="flex items-center mb-3 border-b border-gray-300 pb-2">
            <div className="text-blue-600 mr-3">{icon}</div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="space-y-3 text-gray-800 leading-loose pl-2">{children}</div>
    </div>
);

const AccordionItem = ({ title, children, icon }: { title: string, children: ReactNode, icon: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3 text-left font-semibold text-gray-800"
            >
                <div className="flex items-center">
                    {icon} <span className="ml-3">{title}</span>
                </div>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
            {isOpen && <div className="p-3">{children}</div>}
        </div>
    );
};

const QuizQuestion = ({ q, a, lang }: { q: string, a: string, lang: 'am' | 'en' }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="mb-4">
            <p className="font-semibold text-gray-800 flex items-start text-lg"><HelpCircle className="h-5 w-5 mr-2 mt-1 flex-shrink-0"/>{q}</p>
            <button onClick={() => setShow(!show)} className="text-base text-blue-600 hover:underline mt-2">
                {show ? content[lang].hideAnswer : content[lang].showAnswer}
            </button>
            {show && <p className="mt-2 p-3 flex items-start text-lg"><Lightbulb className="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-green-600"/>{a}</p>}
        </div>
    );
};

// --- Main Chapter Component ---

export default function BusinessIncomeTaxChapter() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const [income, setIncome] = useState<string>('');
    const [result, setResult] = useState<{ tax: number } | null>(null);
    const t = content[lang];

    const toggleLanguage = () => setLang(lang === 'am' ? 'en' : 'am');

    const calculateTax = () => {
        const annualIncome = parseFloat(income);
        if (isNaN(annualIncome) || annualIncome < 0) return;
        const bracket = individualTaxBrackets.find(b => annualIncome >= b.from && (b.to === Infinity || annualIncome <= b.to));
        if (bracket) {
            const tax = (annualIncome * bracket.rate) - bracket.deduction;
            setResult({ tax: Math.round(tax * 100) / 100 });
        }
    };

    return (
        <div className="font-sans p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <header className="p-6 border-b relative">
                    <div className="flex items-center">
                        <Briefcase className="h-10 w-10 mr-4" />
                        <div><h1 className="text-3xl md:text-4xl font-bold">{t.title}</h1></div>
                    </div>
                    <button onClick={toggleLanguage} className="absolute top-4 right-4 bg-gray-200 text-gray-800 font-semibold py-2 px-4 text-sm">{t.langButton}</button>
                </header>

                <main className="p-6">
                    <Section title={t.taxableIncomeTitle} icon={<FileText />}>
                        <p className="text-lg">{t.taxableIncomeDef}</p>
                        <p className="p-3 text-base">{t.ifrsNote}</p>
                    </Section>

                    <Section title={t.businessIncomeTitle} icon={<CircleDollarSign />}>
                        <ul className="list-disc list-inside space-y-2 text-lg">{t.businessIncomeItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
                    </Section>

                    <Section title={t.taxRateTitle} icon={<Percent />}>
                        <p className="font-semibold text-lg">{t.rateForBodies}</p>
                        <p className="text-lg">{t.rateForIndividuals}</p>
                        <div className="p-6 my-8">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center mb-4"><Calculator className="mr-2"/>{t.calculatorTitle}</h3>
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder={t.annualIncomeLabel} className="flex-grow w-full p-2 border border-gray-300" />
                                <button onClick={calculateTax} className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-6 hover:bg-blue-700">Calculate</button>
                            </div>
                            {result && <div className="mt-4 p-4 font-bold text-xl text-green-700">Tax Payable: {result.tax.toLocaleString()} ETB</div>}
                        </div>
                    </Section>

                    <Section title={t.deductibleExpensesTitle} icon={<MinusCircle />}>
                        <p className="text-lg">{t.deductibleGeneral}</p>
                        <div className="space-y-2">
                            {t.deductions.map((item, i) => (
                                <AccordionItem key={i} title={item.title} icon={<CircleDollarSign className="text-green-600" />}>
                                    <p className="text-lg">{item.text}</p>
                                </AccordionItem>
                            ))}
                        </div>
                    </Section>

                    <Section title={t.nonDeductibleTitle} icon={<MinusCircle color="red" />}>
                         <ul className="list-disc list-inside space-y-2 text-red-800 p-4 text-lg">
                            {t.nonDeductibleItems.map((item, i) => <li key={i}>{item}</li>)}
                         </ul>
                    </Section>

                    <Section title={t.lossCarryForwardTitle} icon={<TrendingDown />}>
                        <p className="p-3 text-lg">{t.lossCarryForwardText}</p>
                    </Section>
                    
                    <div className="my-10 p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.quizTitle}</h3>
                        <QuizQuestion q={t.q1} a={t.a1} lang={lang} />
                        <QuizQuestion q={t.q2} a={t.a2} lang={lang} />
                        <QuizQuestion q={t.q3} a={t.a3} lang={lang} />
                    </div>
                    <ChapterNavigation previous="/content/686e8e6223afc16ef4f6709f" next="/content/686e8e6223afc16ef4f670a5" lang={lang} />
                </main>
            </div>
        </div>
    );
}

'use client';

import { useState, ReactNode } from 'react';
import {
    Home,
    FileText,
    CircleDollarSign,
    MinusCircle,
    ChevronDown,
    ChevronUp,
    Calculator,
    Info,
    Book,
    BookMarked,
    PlayCircle,
    Lightbulb
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object (1-to-1 with PDF slides 12-18) ---
const content = {
    am: {
        title: "የቤት ኪራይ ገቢ ግብር እንዴት እንደሚጣል",
        langButton: "English",

        imposition: {
            title: "2.1 የግብር አጣጣል መርሆዎች",
            rules: [
                "ግብሩ በየዓመቱ በሚገኝ ገቢ ላይ ይጣላል።",
                "ግብሩ ለግለሰብ እና ለድርጅት በተለያዩ መጣኔዎች ይጣላል።",
                "ግብሩ ቤት ወይም ህንፃ በማከራየት ገቢ በሚያገኝ ሰው ላይ ይጣላል።",
                "ታክሱ ሊጣል የሚችለው በግብር ዘመኑ ታክስ የሚከፈልበት ገቢ ሲገኝ ብቻ ነው።"
            ]
        },
        rentalIncome: {
            title: "2.2 የቤት ኪራይ ገቢ ምንነት",
            taxableDefTitle: "ግብር የሚከፈልበት የኪራይ ገቢ",
            taxableDefText: "ከጠቅላላ ዓመታዊ የኪራይ ገቢ ላይ የተፈቀዱ ወጪዎች ተቀንሰው የሚቀረው የተጣራ ገቢ ነው።",
            grossDefTitle: "ጠቅላላ የኪራይ ገቢ",
            grossDefText: "ጠቅላላ ገቢ ከኪራይ በተጨማሪ ተያያዥ ክፍያዎችን ያጠቃልላል።",
            grossItems: [
                "የኪራይ ክፍያ፣ የዋጋ ጭማሪ (premium) እና ተመሳሳይ ክፍያዎች።",
                "ተከራይ አከራዩን ወክሎ የሚከፍላቸው ክፍያዎች።",
                "ለጉዳት ማካካሻ ተይዞ ገቢ የተደረገ ገንዘብ።",
                "ከቤት ዕቃዎች ጋር አብሮ ሲከራይ ከዕቃዎቹ የተገኘ ገቢ።"
            ]
        },
        deductibles: {
            title: "2.3 ተቀናሽ የሚደረጉ ወጪዎች",
            noBooksTitle: "የሂሳብ መዝገብ ለማይዙ",
            noBooksItems: [
                { text: "ለከተማ አስተዳደር የተከፈሉ ክፍያዎች (ከታክስ ውጭ)።", tooltip: "ይህ ለመሬት ወይም ለተከራየው ቤት ይዞታ የተከፈሉ የአገልግሎት ክፍያዎችን ያካትታል።" },
                { text: "ከቤት ዕቃና ከመሣሪያ ኪራይ ገቢ 50%።", tooltip: "ይህ ወጪ ለማደሻ፣ ለመጠገኛ እና ለእርጅና መተኪያ የሚሆን አንድ ወጥ ተቀናሽ ነው።" }
            ],
            withBooksTitle: "የሂሳብ መዝገብ ለሚይዙ",
            withBooksItems: [
                { text: "ገቢውን ለማግኘት፣ ዋስትና ለመስጠት እና ሥራውን ለማስቀጠል የወጡ አስፈላጊ ወጪዎች።", tooltip: "ይህ እንደ ጥገና፣ ወለድ፣ መድን እና ሌሎች ቀጥተኛ ወጪዎችን ያጠቃልላል። ዝርዝር መረጃ በሚቀጥሉት ክፍሎች ይቀርባል።" }
            ]
        },
        calculator: {
            title: "የታክስ መሰረት ማስያ",
            grossIncomeLabel: "ጠቅላላ ዓመታዊ የኪራይ ገቢ",
            deductionsLabel: "ጠቅላላ ተቀናሽ ወጪዎች",
            taxableIncomeLabel: "ግብር የሚከፈልበት ገቢ (የታክስ መሰረት)",
            runExampleButton: "ምሳሌ አሳይ",
            exampleTooltip: "የናሙና ቁጥሮችን በመጠቀም ስሌቱን ለማየት ይጫኑ"
        }
    },
    en: {
        title: "How Rental Income Tax Arises",
        langButton: "አማርኛ",

        imposition: {
            title: "2.1 Principles of Tax Imposition",
            rules: [
                "The tax is imposed on income earned annually.",
                "The tax is imposed at different rates for individuals and for bodies.",
                "The tax is imposed on any person who earns income from renting out a building.",
                "Tax can only be imposed if taxable income is generated during the tax period."
            ]
        },
        rentalIncome: {
            title: "2.2 Understanding Rental Income",
            taxableDefTitle: "Taxable Rental Income",
            taxableDefText: "The net income remaining after deducting allowable expenses from the gross annual rental income.",
            grossDefTitle: "Gross Rental Income",
            grossDefText: "Gross income includes rent payments plus any related fees.",
            grossItems: [
                "Rent payments, lease premiums, and similar fees.",
                "Payments made by the lessee on behalf of the lessor.",
                "Compensation for damages recognized as income.",
                "Income from renting out furnishings along with the building."
            ]
        },
        deductibles: {
            title: "2.3 Deductible Expenses",
            noBooksTitle: "For Taxpayers without Bookkeeping",
            noBooksItems: [
                { text: "Fees paid to city administration (excluding tax).", tooltip: "This includes service fees related to the land or building lease." },
                { text: "50% of income from renting furnishings/equipment.", tooltip: "This is a standard deduction to cover repairs, maintenance, and depreciation." }
            ],
            withBooksTitle: "For Taxpayers with Bookkeeping",
            withBooksItems: [
                { text: "Necessary expenses to earn, secure, and maintain the income.", tooltip: "This includes costs like repairs, interest, insurance, and other direct expenses. More details are in subsequent sections." }
            ]
        },
        calculator: {
            title: "Taxable Base Calculator",
            grossIncomeLabel: "Gross Annual Rental Income",
            deductionsLabel: "Total Deductible Expenses",
            taxableIncomeLabel: "Taxable Income (Tax Base)",
            runExampleButton: "Run Example",
            exampleTooltip: "Click to see a calculation with sample numbers"
        }
    }
};

// --- Helper Components ---

const SectionToggle = ({ title, icon, children, startOpen = false }: { title: string, icon: ReactNode, children: ReactNode, startOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(startOpen);
    return (
        <div className="mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-2 text-left font-bold text-lg text-gray-800"
            >
                <div className="flex items-center">
                    <div className="text-blue-600 mr-3">{icon}</div>
                    {title}
                </div>
                {isOpen ? <ChevronUp className="h-6 w-6 text-gray-500" /> : <ChevronDown className="h-6 w-6 text-gray-500" />}
            </button>
            {isOpen && <div className="py-4">{children}</div>}
        </div>
    );
};

const InfoTooltip = ({ text }: { text: string }) => (
    <div className="relative inline-block ml-2 group">
        <Info className="h-4 w-4 text-blue-500 cursor-pointer" />
        <div className="absolute bottom-full mb-2 w-64 p-2 text-sm text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {text}
        </div>
    </div>
);

// --- Main Module Component ---
export default function HowRentalTaxArisesModule() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const [grossIncome, setGrossIncome] = useState<number>(150000);
    const [deductions, setDeductions] = useState<number>(30000);
    const t = content[lang];

    const taxableIncome = grossIncome - deductions;

    const runExample = () => {
        setGrossIncome(150000);
        setDeductions(30000);
    };

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
                    {/* Taxable Base Calculator */}
                    <div className="p-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center mb-3"><Calculator className="mr-2" />{t.calculator.title}</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            {/* Inputs and Slider */}
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="gross-income" className="block text-sm font-medium text-gray-700">{t.calculator.grossIncomeLabel}</label>
                                    <input type="number" id="gross-income" value={grossIncome} onChange={(e) => setGrossIncome(Number(e.target.value))} className="mt-1 w-full p-2 border border-gray-300" />
                                    <input type="range" min="0" max="500000" step="1000" value={grossIncome} onChange={(e) => setGrossIncome(Number(e.target.value))} className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div>
                                    <label htmlFor="deductions" className="block text-sm font-medium text-gray-700">{t.calculator.deductionsLabel}</label>
                                    <input type="number" id="deductions" value={deductions} onChange={(e) => setDeductions(Number(e.target.value))} className="mt-1 w-full p-2 border border-gray-300" />
                                </div>
                            </div>
                            
                            {/* Result */}
                            <div className="text-center p-4">
                                <h3 className="text-base font-semibold text-gray-600">{t.calculator.taxableIncomeLabel}</h3>
                                <p className="text-3xl font-bold text-green-600 mt-1">
                                    {taxableIncome.toLocaleString()} <span className="text-xl">ETB</span>
                                </p>
                                <div className="mt-3 relative group">
                                    <button onClick={runExample} className="text-gray-700 font-semibold py-2 px-4 text-sm flex items-center justify-center mx-auto">
                                        <PlayCircle className="mr-2 h-5 w-5"/>{t.calculator.runExampleButton}
                                    </button>
                                    <div className="absolute bottom-full mb-2 w-48 text-center p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        {t.calculator.exampleTooltip}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <SectionToggle title={t.imposition.title} icon={<FileText />}>
                        <ul className="list-disc list-inside space-y-2 p-2">{t.imposition.rules.map((rule, i) => <li key={i}>{rule}</li>)}</ul>
                    </SectionToggle>

                    <SectionToggle title={t.rentalIncome.title} icon={<CircleDollarSign />}>
                        <DefinitionToggle title={t.rentalIncome.taxableDefTitle}><p>{t.rentalIncome.taxableDefText}</p></DefinitionToggle>
                        <div className="mt-2">
                            <DefinitionToggle title={t.rentalIncome.grossDefTitle}>
                                <ul className="list-decimal list-inside space-y-2 mt-2">{t.rentalIncome.grossItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
                            </DefinitionToggle>
                        </div>
                    </SectionToggle>
                    
                    <SectionToggle title={t.deductibles.title} icon={<MinusCircle />}>
                        <div className="space-y-4">
                            <div className="p-2">
                                <h3 className="font-bold text-lg text-blue-800 flex items-center mb-2"><Book className="mr-2"/>{t.deductibles.noBooksTitle}</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {t.deductibles.noBooksItems.map((item, i) => <li key={i}>{item.text}<InfoTooltip text={item.tooltip} /></li>)}
                                </ul>
                            </div>
                            <div className="p-2">
                                <h3 className="font-bold text-lg text-green-800 flex items-center mb-2"><BookMarked className="mr-2"/>{t.deductibles.withBooksTitle}</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {t.deductibles.withBooksItems.map((item, i) => <li key={i}>{item.text}<InfoTooltip text={item.tooltip} /></li>)}
                                </ul>
                            </div>
                        </div>
                    </SectionToggle>
                    <ChapterNavigation previous="/content/686e8e6223afc16ef4f670a2" next="/content/686e8e6323afc16ef4f670a8" lang={lang} />
                </main>
            </div>
        </div>
    );
}

const DefinitionToggle = ({ title, children }: { title: string, children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-t">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-3 text-left font-semibold text-gray-700"
                aria-expanded={isOpen}
            >
                <span className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-3 text-yellow-500"/>
                    {title}
                </span>
                
                {isOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
            </button>

            {isOpen && (
                <div className="pb-3">
                    {children}
                </div>
            )}
        </div>
    );
};

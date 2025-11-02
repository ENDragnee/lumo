// Suggested file path: /src/components/static/mor/WithholdingTaxIntroModule.tsx
'use client';

import { useState, ReactNode } from 'react';
import {
    BookOpen,
    Target,
    ClipboardCheck, 
    Globe,
    Briefcase,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    BookMarked
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object ---
const content = {
    am: {
        moduleTitle: "ሞጁል ሦስት: ከተከፋይ ሂሳቦች ላይ ታክስ ቀንሶ የማስቀረት ሥርዓት",
        langButton: "English",
        footer: "የታክስ ህግ ዕውቀት ለህግ አክባሪነት መሠረት ነው።",

        part1Title: "ክፍል አንድ: አጠቃላይ ሁኔታ",
        mainObjectiveTitle: "ዋና ዓላማ",
        mainObjective: "ግብር ከፋዮች/ደንበኞች ከተከፋይ ሂሳብ ላይ ግብር ቀንሶ ስለማስቀረት ያለውን መሠረታዊ የህግ ድንጋጌዎችና አስተዳደራዊ ሥነ-ስርዓቶች ላይ ግንዛቤ በመፍጠር፣ መብታቸውን እንዲያስከብሩና ግዴታቸውን እንዲወጡ ማድረግ።",
        specificObjectivesTitle: "ዝርዝር ዓላማዎች",
        specificObjectives: [
            "ስለ ቅድመ ግብር (withholding tax) ምንነትና ዓይነቶች መግለጽ።",
            "ግብር ቀንሰው ገቢ የማድረግ ግዴታ ያለባቸው ሰዎች መቼ፣ ከማን፣ እና እንዴት ግብር ቀንሰው ገቢ ማድረግ እንዳለባቸው መገንዘብ።",
            "ግብር ቀንሶ የመያዝ ግዴታ የማይመለከታቸውን ሰዎች እና ግብይቶች መዘርዘር።",
            "ግብርን ቀንሶ አለማስቀረት የሚያስከትለውን ውጤት ማብራራት።"
        ],
        scopeTitle: "የስልጠናው ወሰን",
        scopeText: "ይህ ስልጠና በዋናነት በሚከተሉት ህጎች ላይ ይመሰረታል፡ የፌዴራል ገቢ ግብር አዋጅ ቁ. 979/2008፣ የታክስ አስተዳደር አዋጅ ቁ. 983/2008、 ስለ ቅድመ ግብር ክፍያ ሥርዓት መመሪያ ቁ. 2/2011、 እና ሌሎች ተያያዥ መመሪያዎች።",

        definitionsTitle: "ትርጓሜዎች",
        definitions: [
            { term: "ገቢ (Income):", desc: "መደበኛ ያልሆነን ጨምሮ ከማንኛውም ምንጭ በጥሬ ገንዘብ ወይም በዓይነት የተገኘ ወይም በማንኛውም መንገድ ለግብር ከፋዩ የተከፈለ፣ በስሙ የተያዘለት ወይም የተቀበለው ማንኛውም የኢኮኖሚ ጥቅም ነው።" },
            { term: "ግብር ተቀናሽ የሚደረግበት ገቢ (Income Subject to Withholding):", desc: "ከመቀጠር ከሚገኝ ገቢ፣ ለነዋሪና ነዋሪ ላልሆኑ ሰዎች ከሚፈጸሙ ክፍያዎች、 ወደ አገር ከሚገቡ ለንግድ ከሚውሉ ዕቃዎች፣ እና ከሀገር ውስጥ ክፍያዎች/አገልግሎቶች ላይ የሚገኝ ገቢ ነው።" },
            { term: "ያልተከፋፈለ ትርፍ (Undistributed Profits):", desc: "የአንድ ድርጅት የሂሳብ ጊዜ ካለቀ በኋላ ባሉት 12 ወራት ውስጥ ለባለአክሲዮኖች ያልተከፋፈለ ወይም የኩባንያውን ካፒታል ለማሳደግ ያልዋለ የተጣራ ትርፍ ነው።" },
            { term: "የጉምሩክ ዋጋ (CIF - Cost, Insurance, and Freight):", desc: "የዕቃዎች መሸጫ ዋጋ፣ የመድን፣ የማጓጓዣ እና ሌሎች ተያያዥ ወጪዎችን ጨምሮ ዕቃውን እስከ ኢትዮጵያ የመጀመሪያ መግቢያ በር ለማድረስ የወጣው ጠቅላላ ዋጋ ነው።" }
        ],

        part2Title: "ክፍል ሁለት: ከተከፋይ ሂሳቦች ላይ ግብርን ቀንሶ ስለማስቀረት",
        withholdingFromEmploymentTitle: "ከመቀጠር ከሚገኝ ገቢ ላይ ግብርን ቀንሶ ስለማስቀረት",
        withholdingFromEmploymentRule: "ማንኛውም ቀጣሪ ለሰራተኛው ከመቀጠር የሚገኝ ገቢ ሲከፍል፣ ከጠቅላላ ክፍያው (ደመወዝ፣ ከታክስ ነፃ ያልሆኑ አበሎች፣ እና በዓይነት የሚገኙ ጥቅማጥቅሞች) ላይ ከ10% እስከ 35% ባለው ተንሸራታች መጣኔ መሰረት ግብር ቀንሶ የማስቀረት እና ለባለስልጣኑ ገቢ የማድረግ ግዴታ አለበት።"
    },
    en: {
        moduleTitle: "Module Three: The System of Withholding Tax from Payable Accounts",
        langButton: "አማርኛ",
        footer: "Knowledge of tax law is the foundation for compliance.",

        part1Title: "Part One: General Situation",
        mainObjectiveTitle: "Main Objective",
        mainObjective: "To create awareness among taxpayers/clients about the fundamental legal provisions and administrative procedures of withholding tax, enabling them to exercise their rights and fulfill their obligations.",
        specificObjectivesTitle: "Specific Objectives",
        specificObjectives: [
            "To define the meaning and types of advance tax (withholding tax).",
            "To understand who has the obligation to withhold tax, and when, from whom, and how to do so.",
            "To list the persons and transactions exempt from the withholding obligation.",
            "To explain the consequences of failing to withhold tax."
        ],
        scopeTitle: "Scope of the Training",
        scopeText: "This training is primarily based on the following laws: Federal Income Tax Proclamation No. 979/2008, Tax Administration Proclamation No. 983/2008, Directive No. 2/2011 on the Advance Tax Payment System, and other related directives.",

        definitionsTitle: "Definitions",
        definitions: [
            { term: "Income:", desc: "Any economic benefit, whether regular or irregular, derived from any source, in cash or in kind, and includes any payment, credit, or receipt by the taxpayer." },
            { term: "Income Subject to Withholding:", desc: "Income from employment, payments made to residents and non-residents, imported goods for trade, and domestic payments/service fees." },
            { term: "Undistributed Profits:", desc: "The net profit of a body that is not distributed to shareholders or reinvested to increase the company's capital within 12 months after the end of the accounting period." },
            { term: "Customs Value (CIF - Cost, Insurance, and Freight):", desc: "The total value for bringing goods to the first port of entry in Ethiopia, including the selling price of the goods, insurance, freight, and other related costs." }
        ],

        part2Title: "Part Two: Withholding Tax from Payable Accounts",
        withholdingFromEmploymentTitle: "Withholding Tax from Employment Income",
        withholdingFromEmploymentRule: "Any employer, when paying employment income to an employee, has the obligation to withhold tax from the total payment (salary, non-exempt allowances, and taxable benefits in kind) based on the progressive rates from 10% to 35%, and remit it to the authority."
    }
};


// --- Helper Components ---
const Section = ({ title, icon, children }: { title: string, icon: ReactNode, children: ReactNode }) => (
    <section className="mb-8">
        <div className="flex items-center mb-3 border-b border-gray-300 pb-2">
            {icon}
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 ml-3">{title}</h2>
        </div>
        <div className="space-y-3 text-gray-800 leading-loose">
            {children}
        </div>
    </section>
);

const AccordionItem = ({ title, children, defaultOpen = false }: { title: string, children: ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3 text-left font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none"
            >
                <span className="flex items-center text-lg sm:text-xl"><Lightbulb className="h-5 w-5 mr-3 text-yellow-500" />{title}</span>
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {isOpen && <div className="p-3 text-gray-800">{children}</div>}
        </div>
    );
};

const InfoCard = ({ title, items, icon }: { title: string, items: string[], icon: ReactNode }) => (
    <div className="p-2 h-full">
        <h3 className="font-semibold text-xl text-gray-800 flex items-center mb-2">{icon}{title}</h3>
        <ul className="list-disc list-inside space-y-1 mt-2 pl-2 text-gray-800">
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    </div>
);


// --- Main Component ---
export default function WithholdingTaxIntroModule() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const t = content[lang];

    const toggleLanguage = () => {
        setLang(lang === 'am' ? 'en' : 'am');
    };

    return (
        <div className="font-sans p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <header className="text-gray-800 p-4 border-b flex items-center justify-between">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">{t.moduleTitle}</h1>
                    <button
                        onClick={toggleLanguage}
                        className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-all duration-300"
                        aria-label="Toggle language"
                    >
                        <Globe className="h-6 w-6" />
                    </button>
                </header>

                <main className="p-4 sm:p-6">
                    {/* Part One: General Situation */}
                    <Section title={t.part1Title} icon={<BookOpen className="h-7 w-7 mr-3 text-blue-600" />}>
                        <div className="p-2">
                            <h3 className="font-semibold text-xl sm:text-2xl text-gray-800 flex items-center mb-2"><Target className="h-6 w-6 mr-2" />{t.mainObjectiveTitle}</h3>
                            <p className="text-gray-800">{t.mainObjective}</p>
                        </div>
                        <div className="mt-6">
                            <InfoCard 
                                title={t.specificObjectivesTitle}
                                items={t.specificObjectives} 
                                icon={<ClipboardCheck className="h-6 w-6 mr-2 text-green-600" />}
                            />
                        </div>
                        
                        <div className="mt-8 space-y-3">
                            <AccordionItem title={t.scopeTitle}>
                                <p>{t.scopeText}</p>
                            </AccordionItem>
                             <AccordionItem title={t.definitionsTitle}>
                                 <ul className="space-y-2">
                                    {t.definitions.map(def => <li key={def.term}><strong className="text-gray-800">{def.term}</strong> {def.desc}</li>)}
                                </ul>
                            </AccordionItem>
                        </div>
                    </Section>

                     {/* Part Two: Withholding System */}
                    <Section title={t.part2Title} icon={<BookMarked className="h-7 w-7 mr-3 text-blue-600" />}>
                         <div className="p-2">
                            <h3 className="font-semibold text-xl sm:text-2xl text-gray-800 flex items-center mb-2"><Briefcase className="h-6 w-6 mr-3 text-indigo-600" />{t.withholdingFromEmploymentTitle}</h3>
                            <p className="text-gray-800">{t.withholdingFromEmploymentRule}</p>
                        </div>
                    </Section>

                </main>
                <ChapterNavigation previous="/content/686e8e6623afc16ef4f670d5" next="/content/686e8e6623afc16ef4f670d5" lang={lang} isPassed={true} />
                <footer className="text-center text-gray-600 text-sm p-3 border-t">
                    <p>{t.footer}</p>
                </footer>
            </div>
        </div>
    );
}

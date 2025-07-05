
'use client';

import { useState, ReactNode } from 'react';
import {
    BookOpen,
    List,
    Target,
    ListChecks,
    Clock,
    BookMarked,
    HelpCircle,
    Scale,
    Globe,
    MapPin,
    User,
    Building,
    Briefcase
} from 'lucide-react';

// --- i18n Content Object (1-to-1 with PDF pages 3-18) ---
const content = {
    am: {
        moduleTitle: "ከንግድ ስራ እና ከኪራይ ገቢ የሚገኝ ግብር",
        chapterTitle: "ክፍል አንድ: አጠቃላይ ሁኔታ",
        langButton: "English",

        tocTitle: "የሰነዱ ይዘት",
        tocItems: [
            "ክፍል አንድ: አጠቃላይ ሁኔታ",
            "ክፍል ሁለት: የቤት ኪራይ ገቢ ግብር",
            "ክፍል ሦስት: የንግድ ስራ ገቢ ግብር",
            "ክፍል አራት: የሂሳብ መዝገብ አያያዝ",
            "ክፍል አምስት: ድርጅትን በመቆጣጠር ረገድ የሚደረግ ለውጥ"
        ],

        objectiveSectionTitle: "1.1. ዓላማ",
        mainObjectiveTitle: "1.1.1. ዋና ዓላማ",
        mainObjectiveText: "ከሥልጠናው በኋላ ሠልጣኞች፣ የገቢ ግብር የሚከፈልባቸውን የሰንጠረዥ “ለ“ (የኪራይ ገቢ ግብር) እና የሰንጠረዥ “ሐ“ (የንግድ ሥራ ገቢ ግብር) ግብሮች በታክስ ሕግ በተቀመጠው አሠራር መሠረት አሳውቀው መክፈል እንዳለባቸው በውይይት ይረዳሉ።",
        specificObjectivesTitle: "1.1.2. ዝርዝር ዓላማዎች",
        specificObjectives: [
            "የኪራይ ገቢ ግብር መጣኔዎችን በማስላት ያሳያሉ።",
            "በገቢ ግብር አዋጅ የተካተቱትን የሰንጠረዥ “ለ“ ገቢዎችን ምንነት ይገልጻሉ።",
            "የማይሰበሰብ እዳ በተቀናሽነት ሊያዝ የሚችለው ምን ምን መስፈርቶች ሲሟሉ እንደሆነ ያብራራሉ።",
            "በአንድ የግብር ዘመን ኪሳራ የገጠመው ሰው ኪሳራውን የሚያሸጋግረው ለስንት አመታት እንደሆነ ይገልጻሉ።",
            "ለረጅም ጊዜ ከተደረገ ውል ጋር ተያይዞ ግብር ከፋዩ ኪሳራ ቢያጋጥመው ኪሳራውን እንዴት እንደሚያሸጋግር ያብራራሉ።",
            "የንግድ ስራ ከተቋረጠ በኋላ በሚገኝ ገቢ ላይ ግብር እንዴት እንደሚወሰን ያስረዳሉ።",
            "ከግብር መሸሽ (tax avoidance) እና ግብር መሰወር (tax evasion) መካከል ያለውን ልዩነት ያብራራሉ።",
            "የዕርጅና ቅናሽ ዘዴዎችን እና ስሌቶችን በምሳሌ ያስረዳሉ።"
        ],

        durationSectionTitle: "1.2. ሥልጠናው የሚወስደው ጊዜ",
        trainingDuration: "ይህን ሥልጠና ለማሠልጠን 18 ሰዓት ይጠይቃል።",

        definitionsSectionTitle: "1.3. ትርጓሜ",
        definitionsIntro: "ቁልፍ ቃላት ትርጓሜ (ለማየት ካርዱን ይጫኑ)፦",
        definitions: [
            { term: "የንግድ ስራ", definition: "በተከታታይ ወይም ለአጭር ጊዜ ለትርፍ የሚከናወን ማንኛውም የኢንዱስትሪ፣ የንግድ፣ የሙያ፣ ወይም ቮኬሽናል ስራ ሲሆን፣ ተቀጣሪ ለቀጣሪው የሚሰጠውን አገልግሎት ወይም ቤት ማከራየትን አይጨምርም። በንግድ ህግ መሰረት እውቅና የተሰጠው ማንኛውም ስራ እና የኩባንያዎች ስራም ይካተታል።" },
            { term: "ግብር የሚከፈልበት የኪራይ ገቢ", definition: "በግብር ዓመቱ ግብር ከፋዩ ቤት በማከራየት ካገኘው ጠቅላላ ዓመታዊ ገቢ ላይ የተፈቀደው ጠቅላላ ወጪ ተቀናሽ ተደርጎ የሚቀረው ገቢ ነው።" },
            { term: "የንግድ ስራ ሃብት", definition: "የንግድ ስራ በማከናወን ሂደት በሙሉ ወይም በከፊል የንግድ ስራ ገቢ ለማግኘት የተያዘ ወይም ጥቅም ላይ የዋለ ሀብት ነው።" },
            { term: "ራሱን የቻለ ስራ ተቋራጭ", definition: "ስራውን በአመዛኙ በራሱ የመምራት እና የመቆጣጠር ስልጣን በሚሰጠው ውል መሰረት አገልግሎት የሚሰጥ ግለሰብ ነው።" },
            { term: "የቴክኒክ ክፍያ", definition: "ለቴክኒካዊ፣ ሙያዊ፣ ወይም ለማማከር አገልግሎት የሚከፈል ክፍያ ነው።" },
            { term: "የንግድ እቃ", definition: "ማንኛውም የተመረተ፣ የተፈበረከ፣ የተገዛ፣ ወይም ለማምረት/ለመሸጥ/ለመለወጥ በማናቸውም ሁኔታ የተገኘ ዕቃ፤ በማምረት ሂደት ውስጥ ጥቅም ላይ የሚውል ጥሬ ዕቃ ወይም አላቂ ዕቃ።" }
        ],
        
        taxingPowerSectionTitle: "1.4. ታክስ የመጣልና የማስከፈል ሥልጣን",
        taxingPowerText: "ከታክስ የሚሰበሰብ ገቢ ለመንግስት ህልውና አስፈላጊ ስለሆነ፣ ታክስ የመጣልና የማስከፈል ሥልጣን ለመንግስት ብቻ የተሰጠ ነው። ይህ ሥልጣን ለግለሰብ ወይም ለሌላ አካል አይሰጥም።",
        taxingPrinciples: "የፌደራል የገቢ ግብር አዋጅ በሁለት መሠረታዊ የታክስ አጣጣል መሠረቶች (ወሰኖች) ላይ የተመሰረተ ነው፡",
        principleResidency: "ነዋሪነትን መሠረት ማድረግ",
        principleSource: "የገቢ ምንጭን መሠረት ማድረግ",

        scopeSectionTitle: "1.5. የታክስ ህጉ ተፈጻሚነት ወሰን",
        scopeText: "የኢትዮጵያ ነዋሪ የሆኑ ሰዎች በዓለም ዙሪያ በሚያገኙት ገቢ፣ እንዲሁም ኢትዮጵያ ነዋሪ ያልሆኑ ሰዎች በኢትዮጵያ ምንጭ ገቢ ላይ ግብር ይጣልባቸዋል።",
        residencyTitle: "ሀ. ነዋሪነት",
        residentIndividualTitle: "ነዋሪ የሆነ ግለሰብ",
        residentIndividualItems: [
            "ኢትዮጵያ ውስጥ ቋሚ የመኖሪያ አድራሻ (domicile) ያለው፤",
            "በመንግስት ተመድቦ በውጭ አገር የሚሠራ ኢትዮጵያዊ ዜጋ፤",
            "በኢትዮጵያ ውስጥ በአንድ ዓመት ጊዜ ውስጥ በተከታታይ ወይም በመመላለስ ከ183 ቀናት በላይ የኖረ ግለሰብ።"
        ],
        residentEntityTitle: "ነዋሪ የሆነ ድርጅት",
        residentEntityItems: [
            "ኢትዮጵያ ውስጥ የተቋቋመ/የተመሠረተ፤",
            "ወሳኝ የሆነ የሥራ አመራር የሚሰጥበት ሥፍራ ኢትዮጵያ ውስጥ ያለው።"
        ],
        sourceTitle: "ለ. የገቢ ምንጭ",
        sourceText: "በኢትዮጵያ ነዋሪ የሆነ ሰው በኢትዮጵያ ውስጥ የሚያፈራው የንግድ ሥራ ገቢ የኢትዮጵያ ምንጭ ገቢ ነው።",
        nonResidentSourceTitle: "ኢትዮጵያ ውስጥ ነዋሪ ያልሆነ ሰው",
        nonResidentSourceItems: [
            "በቋሚነት በሚሠራ ድርጅት አማካኝነት ኢትዮጵያ ውስጥ ከሚያካሂደው የንግድ ሥራ የሚያገኘው ገቢ፤",
            "በቋሚው ድርጅት ከሚተላለፉት ጋር ተመሳሳይ የሆኑ ዕቃዎችን በቀጥታ በማስተላለፍ የሚያገኘው ገቢ፤",
            "ከቋሚው ድርጅት ሥራዎች ጋር ተመሳሳይ የሆኑ ሌሎች የንግድ ሥራዎች።"
        ],
    },
    en: {
        moduleTitle: "Tax on Income from Business and Rental",
        chapterTitle: "Part One: General Situation",
        langButton: "አማርኛ",

        tocTitle: "Table of Contents",
        tocItems: [
            "Part One: General Situation",
            "Part Two: Rental Income Tax",
            "Part Three: Business Income Tax",
            "Part Four: Bookkeeping",
            "Part Five: Change in Control of an Entity"
        ],
        
        objectiveSectionTitle: "1.1. Objective",
        mainObjectiveTitle: "1.1.1. Main Objective",
        mainObjectiveText: "After the training, trainees will understand through discussion that they must declare and pay tax on Schedule 'B' (Rental Income Tax) and Schedule 'C' (Business Income Tax) according to the procedures set out in the tax law.",
        specificObjectivesTitle: "1.1.2. Specific Objectives",
        specificObjectives: [
            "Calculate and demonstrate rental income tax rates.",
            "Define the types of income included under Schedule 'B' of the Income Tax Proclamation.",
            "Explain the conditions under which bad debt can be deducted.",
            "State for how many years a person who has incurred a loss in a tax period can carry it forward.",
            "Explain how a taxpayer carries forward a loss if it arises from a long-term contract.",
            "Explain how tax is assessed on income received after the cessation of a business.",
            "Explain the difference between tax avoidance and tax evasion.",
            "Explain depreciation methods and calculations with examples."
        ],
        
        durationSectionTitle: "1.2. Training Duration",
        trainingDuration: "This training requires 18 hours to complete.",

        definitionsSectionTitle: "1.3. Definitions",
        definitionsIntro: "Definitions of key terms (click the card to view):",
        definitions: [
            { term: "Business", definition: "Any industrial, commercial, professional, or vocational activity performed for profit, whether continuous or short-term, but does not include employment services or renting of buildings. It also includes any activity recognized as a trade by the Commercial Code and any activity of a company." },
            { term: "Taxable Rental Income", definition: "The income remaining after deducting the total allowable expenses from the gross annual income a taxpayer earns from renting out a building in a tax year." },
            { term: "Business Asset", definition: "An asset held or used in the course of conducting a business, in whole or in part, to generate business income." },
            { term: "Independent Contractor", definition: "An individual who provides services under a contract that gives them substantial autonomy to direct and control their work." },
            { term: "Technical Fee", definition: "A payment for technical, professional, or consultancy services." },
            { term: "Trading Stock", definition: "Any goods produced, manufactured, purchased, or otherwise acquired for manufacture, sale, or exchange; includes any raw or consumable materials used in the production process." }
        ],

        taxingPowerSectionTitle: "1.4. Power to Impose and Collect Tax",
        taxingPowerText: "Since revenue collected from taxes is essential for the existence of a government, the power to impose and collect tax is granted exclusively to the government. This power is not given to individuals or other entities.",
        taxingPrinciples: "The Federal Income Tax Proclamation is based on two fundamental principles of taxation:",
        principleResidency: "Based on Residency",
        principleSource: "Based on Source of Income",

        scopeSectionTitle: "1.5. Scope of Application of the Tax Law",
        scopeText: "Residents of Ethiopia are taxed on their worldwide income, while non-residents are taxed on their Ethiopian-source income.",
        residencyTitle: "A. Residency",
        residentIndividualTitle: "Resident Individual",
        residentIndividualItems: [
            "A person who has a domicile in Ethiopia;",
            "An Ethiopian citizen who is a government employee assigned to work abroad;",
            "An individual who is present in Ethiopia, continuously or intermittently, for more than 183 days in a one-year period."
        ],
        residentEntityTitle: "Resident Body",
        residentEntityItems: [
            "A body that is incorporated or formed in Ethiopia;",
            "A body whose place of effective management is in Ethiopia."
        ],
        sourceTitle: "B. Source of Income",
        sourceText: "Business income derived by a resident of Ethiopia is considered Ethiopian-source income.",
        nonResidentSourceTitle: "Non-resident Person",
        nonResidentSourceItems: [
            "Income derived from a business conducted in Ethiopia through a permanent establishment;",
            "Income from the direct transfer of goods similar to those transferred by the permanent establishment;",
            "Other business activities similar to those conducted by the permanent establishment."
        ]
    }
};

// --- Helper Components ---

const Section = ({ title, icon, children }: { title: string, icon: ReactNode, children: ReactNode }) => (
    <div className="mb-10">
        <div className="flex items-center mb-4 border-b-2 border-blue-200 pb-2">
            <div className="text-blue-600 mr-3">{icon}</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="space-y-4 text-gray-700 leading-relaxed pl-2">
            {children}
        </div>
    </div>
);

const DefinitionCard = ({ term, definition }: { term: string, definition: string }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div className="w-full h-48 bg-transparent rounded-lg cursor-pointer [perspective:1000px]" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-500 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                <div className="absolute w-full h-full flex flex-col justify-center items-center bg-blue-50 border-2 border-blue-200 rounded-lg p-4 [backface-visibility:hidden]">
                    <Briefcase className="h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-lg font-semibold text-center text-blue-800">{term}</p>
                </div>
                <div className="absolute w-full h-full flex flex-col justify-center bg-green-50 border-2 border-green-300 rounded-lg p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <p className="text-sm text-center text-gray-800">{definition}</p>
                </div>
            </div>
        </div>
    );
};

// --- Main Chapter Component ---

export default function IncomeTaxModuleChapterOne() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const t = content[lang];

    const toggleLanguage = () => {
        setLang(lang === 'am' ? 'en' : 'am');
    };

    return (
        <div className="font-sans bg-gray-100 p-4 sm:p-6 md:p-8">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg">
                <header className="bg-blue-700 text-white p-6 rounded-t-lg relative">
                    <div className="flex items-center">
                        <BookOpen className="h-10 w-10 mr-4" />
                        <div>
                            <p className="text-blue-200 text-sm">{t.moduleTitle}</p>
                            <h1 className="text-2xl md:text-3xl font-bold">{t.chapterTitle}</h1>
                        </div>
                    </div>
                    <button onClick={toggleLanguage} className="absolute top-4 right-4 bg-white text-blue-700 font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-100 transition-colors">
                        {t.langButton}
                    </button>
                </header>

                <main className="p-6 md:p-10">
                    {/* Table of Contents */}
                    <Section title={t.tocTitle} icon={<List />}>
                        <ul className="list-disc list-inside space-y-1">
                            {t.tocItems.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </Section>

                    {/* Objectives */}
                    <Section title={t.objectiveSectionTitle} icon={<Target />}>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{t.mainObjectiveTitle}</h3>
                            <p>{t.mainObjectiveText}</p>
                        </div>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="font-bold text-lg text-gray-900 mb-3">{t.specificObjectivesTitle}</h3>
                            <ul className="list-decimal list-inside space-y-2">
                                {t.specificObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                            </ul>
                        </div>
                    </Section>
                    
                    {/* Duration */}
                    <Section title={t.durationSectionTitle} icon={<Clock />}>
                        <p className="text-lg font-medium">{t.trainingDuration}</p>
                    </Section>

                    {/* Definitions */}
                    <Section title={t.definitionsSectionTitle} icon={<BookMarked />}>
                        <p className="mb-6 text-gray-600">{t.definitionsIntro}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {t.definitions.map((def, i) => <DefinitionCard key={i} term={def.term} definition={def.definition} />)}
                        </div>
                    </Section>

                    {/* Taxing Power */}
                    <Section title={t.taxingPowerSectionTitle} icon={<Scale />}>
                        <p>{t.taxingPowerText}</p>
                        <div className="mt-4 p-4 bg-blue-50 border-t-4 border-blue-400 rounded-b-lg">
                            <h4 className="font-semibold text-gray-800">{t.taxingPrinciples}</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>{t.principleResidency}</li>
                                <li>{t.principleSource}</li>
                            </ul>
                        </div>
                    </Section>

                    {/* Scope of Application */}
                    <Section title={t.scopeSectionTitle} icon={<Globe />}>
                        <p className="mb-6">{t.scopeText}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Residency */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4"><MapPin className="mr-2"/>{t.residencyTitle}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold flex items-center mb-2"><User className="mr-2 h-5 w-5"/>{t.residentIndividualTitle}</h4>
                                        <ul className="list-disc list-inside text-sm space-y-1 pl-2">{t.residentIndividualItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold flex items-center mb-2"><Building className="mr-2 h-5 w-5"/>{t.residentEntityTitle}</h4>
                                        <ul className="list-disc list-inside text-sm space-y-1 pl-2">{t.residentEntityItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
                                    </div>
                                </div>
                            </div>
                            {/* Source */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4"><Globe className="mr-2"/>{t.sourceTitle}</h3>
                                <p className="text-sm mb-4">{t.sourceText}</p>
                                <div>
                                    <h4 className="font-semibold flex items-center mb-2"><User className="mr-2 h-5 w-5"/>{t.nonResidentSourceTitle}</h4>
                                    <ul className="list-disc list-inside text-sm space-y-1 pl-2">{t.nonResidentSourceItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
                                </div>
                            </div>
                        </div>
                    </Section>
                </main>
            </div>
        </div>
    );
}

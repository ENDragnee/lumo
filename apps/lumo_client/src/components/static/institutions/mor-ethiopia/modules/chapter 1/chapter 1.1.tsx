'use client';

import { useState, ReactNode } from 'react';
import {
    BookOpen,
    Target,
    ListChecks,
    Users,
    Globe,
    FileText,
    BookMarked,
    HelpCircle,
    CheckCircle,
    BookCopy
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object (1-to-1 with PDF pages 4-8) ---
const content = {
    am: {
        title: "ክፍል አንድ: አጠቃላይ ሁኔታ",
        langButton: "English",

        objectiveSectionTitle: "1.1. ዓላማ",
        mainObjectiveTitle: "ዋና ዓላማ",
        mainObjectiveText: "በታክስ አስተዳደር ህግ መሰረት ስለ ታክስ ከፋይ ምዝገባ እና ስረዛ መወያየት እና መግለጽ።",
        specificObjectivesTitle: "ዝርዝር ዓላማዎች",
        specificObjectives: [
            "ስለታክስ ከፋይ ምዝገባ፤ ስለታክስ ከፋይ መለያ ቁጥር አሰጣጥ፣ አጠቃቀም እና ስረዛን፤ የምዝገባ ቦታ እንዲሁም ዋና ዋና ቃላት ትርጉም መግለጽ።",
            "ለታክስ ከፋይነት የመመዝገብ ግዴታ ያለበትን ሰው እንዲሁም ማሟላት የሚገባቸውን ቅድመ ሁኔታዎች መዘርዘር።",
            "የታክስ ከፋይ ምዝገባ የሚከናወንበትን የምዝገባ ቦታ መግለጽ።",
            "ባለሥልጣኑ ታክስ ከፋዩን ከምዝገባ የሚሰርዝባቸውን ምክንያቶች ማብራራት።",
            "ባለሥልጣኑ ምን ምን ሁኔታዎች ሲያጋጥሙ የጽሑፍ ማስጠንቀቂያ በመስጠት የአንድን ሰው የታክስ ከፋይ መለያ ቁጥር ሊሰርዝ እንደሚችል መለየት።",
            "ግብር ከፋዩ ከሚያከናውነው የንግድ እንቅስቃሴ ጋር የሚያደርጋቸውን ለውጦች ለግብር ባለሥልጣኑ ስለሚያሳውቅበት ሁኔታ መግለጽ።",
            "ከታክስ ምዝገባ፣ ስረዛ፣ እና ከግብር ከፋይ ግዴታዎች ጋር የተያያዙ ህጋዊ ውጤቶችን መግለጽ።"
        ],

        scopeSectionTitle: "1.2. ወሰን",
        documentCoverageTitle: "የሰነዱ ሽፋን",
        laws: [
            "አዋጅ 983/2008",
            "ደንብ 407/2009",
            "መመሪያ 3/2011",
            "መመሪያ 143/2011",
            "መመሪያ 147/2011"
        ],
        participantsTitle: "የሥልጠና ተሳታፊዎች",
        participantsText: "ግብር ከፋዩና በግብር ከፋዩ ድርጅት ውስጥ የሚሰሩ ሰራተኞች የስልጠናው ተሳታፊዎች ሲሆኑ እንደ አስፈላጊነቱ ሌሎች ግለሰቦችን እና ድርጅቶችን ይጨምራል።",

        definitionsSectionTitle: "1.3. ትርጓሜ",
        definitionsIntro: "በዚህ ምዕራፍ ውስጥ ጥቅም ላይ የዋሉ ቁልፍ ቃላት ትርጓሜዎች (ለማየት ካርዱን ይጫኑ)፦",
        definitions: [
            { term: "የታክስ ከፋይ ምዝገባ", definition: "ታክስ የመክፈል ግዴታ ያለበትን ሰው በታክስ አስተዳደሩ የውሂብ ጎታ ውስጥ በይፋ የማስፈር ሂደት።" },
            { term: "የታክስ ከፋይ መለያ ቁጥር (TIN)", definition: "እያንዳንዱን ግብር ከፋይ ለይቶ ለማወቅ በግብር ባለስልጣን የሚሰጥ ልዩ ቁጥር።" },
            { term: "ተቀጽላ የታክስ ከፋይ መለያ ቁጥር", definition: "ከአንድ በላይ በሆኑ ቦታዎች ወይም የንግድ ዘርፎች ላይ ለሚሰራ አንድ ግብር ከፋይ ከዋናው TIN ጋር ተያይዞ የሚሰጥ ተጨማሪ መለያ።" },
            { term: "የፀና የንግድ ሥራ ፈቃድ", definition: "አንድ ሰው ወይም ድርጅት በህጋዊ መንገድ የንግድ ሥራ እንዲያከናውን የሚያስችል ጊዜው ያላለፈበት ኦፊሴላዊ ሰነድ።" },
            { term: "የማንነት አካላዊ መረጃ (Biometric Data)", definition: "አንድን ሰው באופן ልዩ ለመለየት የሚያገለግሉ እንደ የጣት አሻራ ያሉ አካላዊ ባህሪያት መረጃዎች።" },
            { term: "የንግድ ማህበር", definition: "እንደ አክሲዮን ማህበር ወይም የግል ኃ/የተ/የግ/ማህበር ያለ የንግድ ሥራ ለማከናወን በህግ የተቋቋመ አካል ።" }
        ]
    },
    en: {
        title: "Part One: General Situation",
        langButton: "አማርኛ",

        objectiveSectionTitle: "1.1. Objective",
        mainObjectiveTitle: "Main Objective",
        mainObjectiveText: "To discuss and explain taxpayer registration and cancellation in accordance with the Tax Administration Proclamation.",
        specificObjectivesTitle: "Specific Objectives",
        specificObjectives: [
            "To explain taxpayer registration; issuance, use, and cancellation of a Taxpayer Identification Number (TIN); registration location, and the definition of key terms.",
            "To list the persons obligated to register for tax purposes and the prerequisites they must fulfill.",
            "To describe the location where taxpayer registration is carried out.",
            "To explain the reasons for which the Authority may cancel a taxpayer's registration.",
            "To identify the circumstances under which the Authority may issue a written warning to cancel a person's TIN.",
            "To describe the procedure for a taxpayer to notify the tax authority of changes related to their business activities.",
            "To explain the legal consequences related to tax registration, cancellation, and taxpayer obligations."
        ],

        scopeSectionTitle: "1.2. Scope",
        documentCoverageTitle: "Document Coverage",
        laws: [
            "Proclamation No. 983/2008",
            "Regulation No. 407/2009",
            "Directive No. 3/2011",
            "Directive No. 143/2011",
            "Directive No. 147/2011"
        ],
        participantsTitle: "Training Participants",
        participantsText: "The participants of this training are taxpayers and employees working in the taxpayer's organization, and as necessary, it may include other individuals and organizations.",

        definitionsSectionTitle: "1.3. Definitions",
        definitionsIntro: "Definitions of key terms used in this chapter (click the card to view):",
        definitions: [
            { term: "Taxpayer Registration", definition: "The process of officially entering a person liable to pay tax into the tax administration's database." },
            { term: "Taxpayer Identification Number (TIN)", definition: "A unique number issued by the tax authority to identify each taxpayer." },
            { term: "Supplementary TIN", definition: "An additional identifier issued in conjunction with the primary TIN for a taxpayer who operates in more than one location or business sector." },
            { term: "Valid Business License", definition: "A current, official document that permits a person or entity to legally conduct business." },
            { term: "Biometric Data", definition: "Information on physical characteristics, such as fingerprints, used to uniquely identify an individual." },
            { term: "Business Association", definition: "A legally established entity for conducting business, such as a Share Company or a Private Limited Company (PLC)." }
        ]
    }
};

// --- Helper Components ---

const Section = ({ title, icon, children }: { title: string, icon?: ReactNode, children: ReactNode }) => (
    <div className="mb-10">
        <div className="flex items-center mb-4 border-b-2 border-blue-200 pb-2">
            {icon && <div className="text-blue-600 mr-3">{icon}</div>}
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
        <div 
                        className="w-full h-40 cursor-pointer transform transition-transform duration-500 [perspective:1000px]"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-500 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                {/* Front of the card */}
                <div className="absolute w-full h-full flex flex-col justify-center items-center bg-blue-50 p-4 [backface-visibility:hidden]">
                    <HelpCircle className="h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-lg font-semibold text-center text-blue-800">{term}</p>
                </div>
                {/* Back of the card */}
                <div className="absolute w-full h-full flex flex-col justify-center items-center bg-green-50 rounded-lg p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <p className="text-sm text-center text-gray-800">{definition}</p>
                </div>
            </div>
        </div>
    );
};


// --- Main Chapter Component ---

export default function TaxRegistrationChapterOne() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const t = content[lang];

    const toggleLanguage = () => {
        setLang(lang === 'am' ? 'en' : 'am');
    };

    return (
        <div className="font-sans bg-white p-4 sm:p-6 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Chapter Header */}
                <header className="bg-blue-700 text-white p-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <BookOpen className="h-10 w-10 mr-4" />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1>
                        </div>
                    </div>
                    <button 
                        onClick={toggleLanguage}
                        className="p-2 rounded-full bg-white text-blue-700 hover:bg-blue-100 transition-colors"
                        aria-label="Toggle language"
                    >
                        <Globe className="h-6 w-6" />
                    </button>
                </header>

                <main className="p-4">
                    {/* 1.1 Objective Section */}
                    <Section title={t.objectiveSectionTitle}>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-bold text-lg text-gray-900 flex items-center mb-2">
                                <Target className="h-5 w-5 mr-2 text-blue-600"/>
                                {t.mainObjectiveTitle}
                            </h3>
                            <p>{t.mainObjectiveText}</p>
                        </div>
                        
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-bold text-lg text-gray-900 flex items-center mb-3">
                                <ListChecks className="h-5 w-5 mr-2 text-blue-600"/>
                                {t.specificObjectivesTitle}
                            </h3>
                            <ul className="space-y-3">
                                {t.specificObjectives.map((obj, i) => (
                                    <li key={i} className="flex items-start">
                                        <CheckCircle className="h-5 w-5 mr-3 mt-1 text-green-500 flex-shrink-0" />
                                        <span>{obj}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Section>

                    {/* 1.2 Scope Section */}
                    <Section title={t.scopeSectionTitle}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-bold text-lg text-gray-900 flex items-center mb-3">
                                    <FileText className="h-5 w-5 mr-2 text-blue-600"/>
                                    {t.documentCoverageTitle}
                                </h3>
                                <ul className="list-disc list-inside space-y-2 pl-2">
                                    {t.laws.map((law, i) => <li key={i}>{law}</li>)}
                                </ul>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-bold text-lg text-gray-900 flex items-center mb-3">
                                    <Users className="h-5 w-5 mr-2 text-blue-600"/>
                                    {t.participantsTitle}
                                </h3>
                                <p>{t.participantsText}</p>
                            </div>
                        </div>
                    </Section>

                    {/* 1.3 Definitions Section */}
                    <Section title={t.definitionsSectionTitle}>
                        <p className="mb-6 text-gray-600">{t.definitionsIntro}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {t.definitions.map((def, i) => (
                                <DefinitionCard key={i} term={def.term} definition={def.definition} />
                            ))}
                        </div>
                    </Section>
                    <ChapterNavigation next="/content/686e8e6123afc16ef4f67099" lang={lang} />
                </main>
            </div>
        </div>
    );
}

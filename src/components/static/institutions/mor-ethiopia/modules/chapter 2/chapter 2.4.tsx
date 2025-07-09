'use client';

import { useState, ReactNode } from 'react';
import {
    TrendingDown,
    FileCheck,
    FileX,
    Megaphone,
    Landmark,
    Building,
    Calculator,
    GitMerge,
    ArrowRight,
    User,
    Globe,
    RefreshCw
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object (1-to-1 with PDF pages 24-34) ---
const content = {
    am: {
        title: "2.3. ተቀናሽ የሚደረጉ ወጪዎች",
        langButton: "English",
        deductibleTabs: {
            noBooks: "የሂሳብ መዝገብ ለሌለው",
            withBooks: "የሂሳብ መዝገብ ላለው"
        },
        noBooksDeductions: [
            "ታክስን ሳይጨምር ለመሬቱ ወይም ከተከራየው ቤት ጋር በተገናኘ ግብር ከፋዩ ለከተማ አስተዳደር የከፈላቸው ክፍያዎች።",
            "ከቤት ዕቃና ከመሣሪያ ኪራይ ከሚገኘው ጠቅላላ ገንዘብ ላይ 50% (ሃምሳ በመቶ)፣ (ለቤቶች፣ ለቤት ዕቃና መሳሪያ ማደሻ፣ መጠገኛና ለእርጅና መተኪያ የሚሆን)።"
        ],
        withBooksDeductions: [
            "ገቢውን ለማግኘት የወጣና በግብር ከፋዩ የተከፈለ አስፈላጊ የሆኑ ወጪዎች (ገቢውን ለማግኘት፣ ዋስትና ለመስጠት እና ሥራውን ለማስቀጠል)።",
            "ቤቱ ያረፈበት የመሬት ኪራይ፣ የጥገና ወጪ፣ የእርጅና ቅናሽ፣ ወለድና የመድን አረቦን።",
            "በነፃ ወይም በኪራይ የያዘው ቤት ስም የሚከፈል የውሃ፣ የስልክ፣ የመብራት ወጪዎች በውሉ ተከራይ እንዲከፈሉ ከተገለጸና ወጪው ስለመውጣቱ ደረሰኝ ከቀረበ።"
        ],
        detailedRulesTitle: "የተወሰኑ የወጪ አይነቶች ዝርዝር ህጎች",
        detailedRules: [
            {
                icon: Calculator,
                title: "የጋራ መገልገያዎች",
                text: "የኪራይ ቤቱ እና የመኖሪያው ቤት በአንድ የመብራት፣ የስልክ፣ የውሃ ቆጣሪ የሚጠቀሙ ከሆነ ለነዚህ የወጣው ወጪ 75 በመቶ በወጪነት ተቀናሽ ሊያዝ ይችላል።"
            },
            {
                icon: Landmark,
                title: "የብድር ወለድ",
                points: [
                    "በብድር ለተገኘ ወለድ ክፍያ በወጪነት የሚያዘው ለኪራይ አገልግሎት በዋለው መጠን ልክ ነው።",
                    "ለኪራይ የሚያስገነባው ህንጻ ብድር የተወሰደ ከሆነ፣ ህንጻው እስኪገነባ ድረስ ያለው ወለድ የህንጻው ዋጋ ሆኖ በእርጅና ቅናሽ ይታሰባል፤ ከተጠናቀቀ በኋላ ግን በወጪነት ይፈቀዳል።"
                ]
            },
            {
                icon: Megaphone,
                title: "የማስታወቂያ ወጪ",
                points: [
                    "የኪራይ አገልግሎቱን ለማስተዋወቅ የሚወጣ ወጪ፡ በተለያየ ዝግጅት ላይ ከሆነ ከጠቅላላ ኪራይ ገቢ 3 በመቶ ያልበለጠ ተቀናሽ ይሆናል።",
                    "ለመገናኛ ብዙሃን ወይም ለማስታወቂያ ድርጅት ከሆነ ሙሉ በሙሉ ተቀናሽ ይሆናል።"
                ]
            },
            {
                icon: Building,
                title: "የእርጅና ቅናሽ",
                points: [
                    "ለኪራይ የተገነባ ህንጻ ለሌላ ዓላማ እስካልዋለ ድረስ፣ ዝግጁ ከሆነበት ጊዜ ጀምሮ ባይከራይም የእርጅና ቅናሹ እንደ ወጪ ይያዛል።",
                    "አንድ ህንጻ ለኪራይ እና ለሌላ አገልግሎት ከዋለ፣ የእርጅና ቅናሹ እንደ አጠቃቀሙ ስፋት ተለይቶ መቅረብ አለበት።",
                    "ለእርጅና ቅናሽ መነሻ የሚሆነው የተገዛበት/የተሰራበት ዋጋ ነው። ይህ ከሌለ 70% የገበያ ዋጋ ይሆናል።",
                    "የተጨማሪ እሴት ታክስ በግብዓትነት የተካካሰለት ከሆነ፣ ያ መጠን ከእርጅና ቅናሽ መነሻ ዋጋ ላይ መቀነስ አለበት።",
                    "በታክስ ከፋዩ ስም ላልተመዘገቡ ሀብቶች የእርጅና ቅናሽ አይፈቀድም።",
                    "በባል ወይም በሚስት ስም ለተመዘገበ ህንጻ፣ ሁለቱም ከተስማሙ ተቀናሽ ሊጠየቅበት ይችላል።"
                ]
            }
        ],
        flowchart: {
            title: "የታክስ ግዴታ ፍሰት ሰንጠረዥ",
            q1: "በኢትዮጵያ ነዋሪ ነዎት?",
            q2: "የገቢዎ ምንጭ ከየት ነው?",
            yes: "አዎ",
            no: "አይ",
            ethiopia: "ከኢትዮጵያ",
            abroad: "ከውጭ",
            outcome1: "ውጤት: በዓለም ዙሪያ ባገኙት ገቢ ላይ ግብር ይከፍላሉ። (Worldwide Income Taxation)",
            outcome2: "ውጤት: ከኢትዮጵያ ምንጭ ባገኙት ገቢ ላይ ብቻ ግብር ይከፍላሉ። (Territorial Taxation)",
            reset: "እንደገና ጀምር"
        }
    },
    en: {
        title: "2.3. Deductible Expenses",
        langButton: "አማርኛ",
        deductibleTabs: {
            noBooks: "For Taxpayers without Books of Account",
            withBooks: "For Taxpayers with Books of Account"
        },
        noBooksDeductions: [
            "Payments made by the taxpayer to the city administration related to the land or the rented house, excluding taxes.",
            "50% (fifty percent) of the gross income from renting out furniture and equipment (for renovation, repair, and depreciation replacement)."
        ],
        withBooksDeductions: [
            "Necessary expenses incurred and paid by the taxpayer to earn the income (to earn, secure, and maintain it).",
            "Land rent on which the house is built, repair costs, depreciation allowance, interest, and insurance premiums.",
            "Costs for water, telephone, and electricity if the contract specifies payment by the tenant and proof of expense is provided."
        ],
        detailedRulesTitle: "Specific Rules for Certain Expense Types",
        detailedRules: [
            {
                icon: Calculator,
                title: "Shared Utilities",
                text: "If the rental property and the residence use a single meter for electricity, telephone, or water, 75 percent of the expense incurred for these can be claimed as a deduction."
            },
            {
                icon: Landmark,
                title: "Interest on Loans",
                points: [
                    "Interest paid on a loan is deductible only to the extent the loan was used for the rental service.",
                    "If a loan is taken to construct a rental building, the interest paid until completion is capitalized as part of the building's cost (for depreciation); interest paid after completion is deductible as an expense."
                ]
            },
            {
                icon: Megaphone,
                title: "Advertising Costs",
                points: [
                    "Costs to promote the rental service: if for various events, the deduction is limited to 3% of the total rental income.",
                    "If paid to mass media or an advertising agency, it is fully deductible."
                ]
            },
            {
                icon: Building,
                title: "Depreciation Allowance",
                points: [
                    "A building constructed for rent is eligible for depreciation from the time it is ready for service, even if not yet rented, as long as it's not used for another purpose.",
                    "If a building is used for both rental and other services, the depreciation must be apportioned based on the area used for each.",
                    "The cost base for depreciation is its purchase/construction cost. If this is not available, it is calculated as 70% of the market value.",
                    "If input VAT on the asset has been claimed, that amount must be deducted from the depreciation cost base.",
                    "Depreciation is not allowed for assets not registered in the taxpayer's name.",
                    "For an asset registered in a spouse's name, depreciation can be claimed if there is a mutual agreement."
                ]
            }
        ],
        flowchart: {
            title: "Tax Obligation Flowchart",
            q1: "Are you a resident of Ethiopia?",
            q2: "What is your source of income?",
            yes: "Yes",
            no: "No",
            ethiopia: "From Ethiopia",
            abroad: "From Abroad",
            outcome1: "Result: You are taxed on your worldwide income.",
            outcome2: "Result: You are taxed only on your Ethiopian-source income.",
            reset: "Reset"
        }
    }
};

// --- Helper Components ---
const Section = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => (
    <div className="mb-8">
        <div className="flex items-center mb-3">
            <div className="text-gray-600 mr-3">{icon}</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="space-y-3 text-gray-700 leading-relaxed">{children}</div>
    </div>
);

const RuleCard = ({ rule }: { rule: { icon: React.ElementType, title: string, text?: string, points?: string[] } }) => {
    const Icon = rule.icon;
    return (
        <div className="p-3">
            <h4 className="font-bold text-lg text-blue-700 flex items-center mb-2">
                <Icon className="h-5 w-5 mr-2" />
                {rule.title}
            </h4>
            {rule.text && <p className="text-gray-600">{rule.text}</p>}
            {rule.points && (
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {rule.points.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
            )}
        </div>
    );
};

const Flowchart = ({ lang }: { lang: 'am' | 'en' }) => {
    const t = content[lang].flowchart;
    const [residency, setResidency] = useState<string | null>(null);
    const [source, setSource] = useState<string | null>(null);

    const handleReset = () => {
        setResidency(null);
        setSource(null);
    };

    const getOutcome = () => {
        if (residency === 'yes') return t.outcome1;
        if (residency === 'no' && source) return t.outcome2;
        return '';
    };

    const outcome = getOutcome();

    return (
        <Section title={t.title} icon={<GitMerge className="h-6 w-6" />}>
            <div className="p-4 relative">
                <button onClick={handleReset} className="absolute top-2 right-2 p-1.5">
                    <RefreshCw className="h-4 w-4 text-gray-600" />
                </button>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    {/* Step 1: Residency */}
                    <div className="text-center">
                        <h4 className="font-semibold">{t.q1}</h4>
                        <div className="flex space-x-2 mt-2">
                            <button onClick={() => setResidency('yes')} disabled={!!residency} className={`px-4 py-2 rounded-md ${residency === 'yes' ? 'bg-blue-600 text-white' : 'border disabled:opacity-50'}`}>{t.yes}</button>
                            <button onClick={() => setResidency('no')} disabled={!!residency} className={`px-4 py-2 rounded-md ${residency === 'no' ? 'bg-blue-600 text-white' : 'border disabled:opacity-50'}`}>{t.no}</button>
                        </div>
                    </div>

                    {residency && <ArrowRight className="h-6 w-6 text-gray-400 transform md:rotate-0 rotate-90" />}

                    {/* Step 2: Income Source (Only for non-residents) */}
                    {residency === 'no' && (
                        <div className="text-center">
                            <h4 className="font-semibold">{t.q2}</h4>
                            <div className="flex space-x-2 mt-2">
                                <button onClick={() => setSource('ethiopia')} disabled={!!source} className={`px-4 py-2 rounded-md ${source === 'ethiopia' ? 'bg-blue-600 text-white' : 'border disabled:opacity-50'}`}>{t.ethiopia}</button>
                                <button onClick={() => setSource('abroad')} disabled={!!source} className={`px-4 py-2 rounded-md ${source === 'abroad' ? 'bg-blue-600 text-white' : 'border disabled:opacity-50'}`}>{t.abroad}</button>
                            </div>
                        </div>
                    )}
                </div>

                {outcome && (
                    <div className="mt-6 p-4 text-green-800 text-center font-bold">
                        {outcome}
                    </div>
                )}
            </div>
        </Section>
    );
};


// --- Main Chapter Component ---
export default function RentalDeductibleExpensesChapter() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const [activeTab, setActiveTab] = useState('withBooks');
    const t = content[lang];

    const toggleLanguage = () => {
        setLang(lang === 'am' ? 'en' : 'am');
        setActiveTab('withBooks');
    };

    return (
        <div className="font-sans p-2 sm:p-4">
            <div className="max-w-full mx-auto">
                <header className="py-4 border-b relative">
                    <div className="flex items-center">
                        <TrendingDown className="h-8 w-8 mr-3" />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1>
                        </div>
                    </div>
                    <button onClick={toggleLanguage} className="absolute top-4 right-4 text-gray-800 font-semibold py-2 px-4 text-sm">
                        {t.langButton}
                    </button>
                </header>

                <main className="py-4">
                    {/* Tabbed interface for deductible categories */}
                    <div className="mb-6">
                        <div className="flex border-b">
                            <button onClick={() => setActiveTab('withBooks')} className={`flex items-center py-2 px-3 text-sm font-medium ${activeTab === 'withBooks' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>
                                <FileCheck className="h-5 w-5 mr-2" /> {t.deductibleTabs.withBooks}
                            </button>
                            <button onClick={() => setActiveTab('noBooks')} className={`flex items-center py-2 px-3 text-sm font-medium ${activeTab === 'noBooks' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>
                                <FileX className="h-5 w-5 mr-2" /> {t.deductibleTabs.noBooks}
                            </button>
                        </div>
                        <div className="p-3">
                            {activeTab === 'withBooks' && <ul className="list-disc list-inside space-y-2 text-gray-700">{t.withBooksDeductions.map((item, i) => <li key={i}>{item}</li>)}</ul>}
                            {activeTab === 'noBooks' && <ul className="list-disc list-inside space-y-2">{t.noBooksDeductions.map((item, i) => <li key={i}>{item}</li>)}</ul>}
                        </div>
                    </div>

                    {/* Detailed Rules Section */}
                    <Section title={t.detailedRulesTitle} icon={<User className="h-6 w-6" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {t.detailedRules.map((rule, i) => <RuleCard key={i} rule={rule} />)}
                        </div>
                    </Section>

                    {/* Flowchart Component */}
                    <Flowchart lang={lang} />
                    <ChapterNavigation previous="/content/686e8e6323afc16ef4f670a8" next="/content/686e8e6323afc16ef4f670ae" lang={lang} />
                </main>
            </div>
        </div>
    );
}

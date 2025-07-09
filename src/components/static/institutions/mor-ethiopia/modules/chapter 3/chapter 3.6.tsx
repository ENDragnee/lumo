// Suggested file path: /src/components/static/mor/WithholdingAgentsAndExemptionsModule.tsx
'use client';

import { useState, ReactNode } from 'react';
import {
    UserCheck,
    Briefcase,
    Hotel,
    Factory,
    ShieldOff,
    FileText,
    Calendar,
    ListChecks,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    Gavel,
    BookOpen,
    Hospital,
    Truck,
    Droplet,
    Sailboat,
    Landmark,
    Globe,
    Users,
    Building2
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object ---
const content = {
    am: {
        moduleTitle: "ግብር ቀንሶ የማስቀረት ግዴታ ያለባቸው ግለሰቦች፣ ነጻ የሆኑ ግብይቶች እና የውክልና ሀላፊነቶች",
        langButton: "English",
        footer: "የታክስ ህግ ዕውቀት ለህግ አክባሪነት መሠረት ነው።",
        note: "ማስታወሻ",

        individualAgentsTitle: "3.3.5 ግብር ቀንሰው የማስቀረት ግዴታ ያለባቸው ግለሰብ ግብር ከፋዮች",
        turnoverBasedRule: {
            title: "በሽያጭ መጠን ላይ የተመሰረተ ግዴታ",
            desc: "የደረጃ 'ሀ' ግብር ከፋይ የሆነና ባለፉት ሶስት ተከታታይ አመታት በአማካኝ 10 ሚሊዮን ብርና ከዚያ በላይ ጠቅላላ ገቢ ያስመዘገበ ማንኛውም ግለሰብ ግብር ከፋይ።"
        },
        sectorBasedRule: {
            title: "የዓመታዊ ገቢያቸው መጠን ከግምት ውጪ ግዴታ የተጣለባቸው (የደረጃ 'ሀ' ብቻ)",
            list: [
                "ማንኛውም ባለ ኮከብ ሆቴል ወይም ሪዞርት",
                "ከ1-4 ደረጃ ያላቸው ስራ ተቋራጮች",
                "ማንኛውም የሪል እስቴት አልሚ",
                "የምግብ አምራች ኢንዱስትሪዎች",
                "በኢትዮጵያ ምርት ገበያ ግዥ የሚፈጽም ማንኛውም ግለሰብ (ለምርት ገበያ ግብይቱ ብቻ)",
                "ሆስፒታሎች፣ ከፍተኛ እና ከዚያ በላይ ደረጃ ያላቸው ክሊኒኮች፣ ዩኒቨርሲቲዎችና ኮሌጆች",
                "ከአምራች ኢንዱስትሪዎች ምርት ተረክቦ የሚያከፋፍል ማንኛውም ግለሰብ"
            ]
        },

        exemptionsTitle: "3.3.6 ከ2% የቅድመ ግብር ነጻ የሆኑ ግብይቶች",
        exemptionsIntro: "ግብር ቀንሶ የመያዝ ስርዓት በሚከተሉት ግብይቶች ላይ ተፈጻሚ አይሆንም፡",
        exemptionsList: [
            { item: "የሰው ወይም የእንስሳት ህክምና አገልግሎት፤ የመደበኛ ትምህርት አገልግሎት (ስልጠናን አይጨምርም)", icon: Hospital },
            { item: "የፋይናንስ አገልግሎት (ባንክ የደንበኛን ንብረት ሲሸጥ ከሚቀበለው ክፍያ በስተቀር)", icon: Landmark },
            { item: "የኤሌክትሪክ፣ የውሃ (የታሸገን ሳይጨምር) እና የቴሌኮም አገልግሎት", icon: Droplet },
            { item: "የየብስ፣ የአየር፣ የባህር እና የባቡር ትራንስፖርት አገልግሎት (ኪራይን አይጨምርም)", icon: Truck },
            { item: "ከገቢ ግብር ነጻ መብት የተሰጣቸው ኢንቨስተሮች በነጻነት ጊዜያቸው የሚያቀርቡት ዕቃ ወይም አገልግሎት", icon: Factory },
            { item: "የነዳጅ አቅርቦት (ቅባትና ዘይቶችን አይጨምርም)", icon: Droplet },
            { item: "የፋብሪካ ምርት ያልሆነ (የአርብቶ አደር እና የአርሶ አደር የግብርና እና የእንስሳት ውጤት)", icon: Briefcase },
            { item: "በመንግስት መ/ቤቶች የሚቀርቡ ዕቃዎችና አገልግሎቶች", icon: Landmark },
            { item: "በዲፕሎማቲክ ስምምነቶች መሰረት ለተቋቋሙ ዓለም አቀፍ ድርጅቶችና ኤምባሲዎች የሚፈጸም ክፍያ", icon: Globe },
            { item: "ለትርፍ ባልተቋቋሙ ድርጅቶች የሚቀርቡ ዕቃዎችና አገልግሎቶች (በንግድ መልክ ከሚያቀርቡት በስተቀር)", icon: Users },
            { item: "በገቢ ግብር ህግ መሰረት ከግብር ነጻ የሆነ ገቢ (የሠንጠረዥ 'ሠ' ገቢዎች)", icon: FileText },
            { item: "የባህር ትራንስፖርትና ሎጅስቲክስ አገልግሎት ድርጅት ለሚሰጠው አገልግሎት የሚፈጸም ክፍያ", icon: Sailboat },
            { item: "የመኖሪያ ቤት ሽያጭ", icon: Building2 },
            { item: "በሰው ጉልበት የሚከናወን ዕቃ የመጫን እና የማውረድ አገልግሎት", icon: Users }
        ],
        
        agentDutiesTitle: "3.3.7 ግብር ቀንሶ የማስቀረት ግዴታ ያለበት ወኪል ተግባርና ኃላፊነት",
        dutiesList: [
            { 
                title: "ግብርን በወቅቱ ገቢ ማድረግ", 
                desc: "በወሩ ውስጥ ቀንሶ ያስቀረውን ጠቅላላ ግብር፣ ወሩ ካለቀበት ቀን ጀምሮ ባሉት 30 ቀናት ውስጥ ለባለስልጣኑ ገቢ ማድረግ አለበት።",
                icon: Calendar 
            },
            { 
                title: "ዝርዝር መረጃ ማቅረብ", 
                desc: "ግብሩን ገቢ ሲያደርግ፣ ክፍያ የተፈጸመለትን እያንዳንዱን ሰው/ድርጅት ስም፣ TIN፣ የተከፈለውን ጠቅላላ ገንዘብ፣ እና የተቀነሰውን ግብር የሚያሳይ ዝርዝር በባለስልጣኑ ቅጽ መሰረት ማቅረብ አለበት።",
                icon: ListChecks 
            },
            { 
                title: "መዝገብ መያዝ", 
                desc: "ግብር ቀንሶ ሲያስቀር የከፋዩን ስም፣ አድራሻ፣ እና TIN በመጠቀም መመዝገብ እና ሂሳቡን በአግባቡ መያዝ አለበት።",
                icon: BookOpen 
            },
            { 
                title: "ደረሰኝ መስጠት", 
                desc: "ግብር ለተቀነሰበት ሰው/ድርጅት ተከታታይ ቁጥር ያለው ህጋዊ ደረሰኝ መስጠት አለበት።",
                icon: FileText 
            }
        ]
    },
    en: {
        moduleTitle: "Obligated Individual Agents, Exempt Transactions, and Agent Responsibilities",
        langButton: "አማርኛ",
        footer: "Knowledge of tax law is the foundation for compliance.",
        note: "Note",
        
        individualAgentsTitle: "3.3.5 Individual Taxpayers Obligated to Withhold Tax",
        turnoverBasedRule: {
            title: "Obligation Based on Turnover",
            desc: "Any Category 'A' individual taxpayer who has registered an average annual gross income of 10 million ETB or more over the last three consecutive years."
        },
        sectorBasedRule: {
            title: "Obligation Regardless of Annual Income (Category 'A' only)",
            list: [
                "Any star-rated hotel or resort",
                "Contractors of Grade 1-4",
                "Any real estate developer",
                "Food manufacturing industries",
                "Any individual making purchases through the Ethiopia Commodity Exchange (for ECX transactions only)",
                "Hospitals, high-level and above clinics, universities, and colleges",
                "Any individual who distributes products received from manufacturing industries"
            ]
        },

        exemptionsTitle: "3.3.6 Transactions Exempt from 2% Advance Withholding Tax",
        exemptionsIntro: "The withholding tax system does not apply to the following transactions:",
        exemptionsList: [
            { item: "Human or veterinary medical services; formal education services (excluding training)", icon: Hospital },
            { item: "Financial services (excluding payments a bank receives when selling a client's property)", icon: Landmark },
            { item: "Electricity, water (excluding bottled water), and telecom services", icon: Droplet },
            { item: "Land, air, sea, and rail transport services (excluding rental)", icon: Truck },
            { item: "Goods or services supplied by investors with income tax exemption during their exemption period", icon: Factory },
            { item: "Supply of petroleum (excluding lubricants and oils)", icon: Droplet },
            { item: "Non-factory products (agricultural and livestock products from pastoralists and farmers)", icon: Briefcase },
            { item: "Goods and services supplied by government bodies", icon: Landmark },
            { item: "Payments made to international organizations and embassies established under diplomatic agreements", icon: Globe },
            { item: "Goods and services supplied by non-profit organizations (excluding their commercial activities)", icon: Users },
            { item: "Income exempt from tax under the law (Schedule 'E' incomes)", icon: FileText },
            { item: "Payments for services rendered by the Ethiopian Shipping and Logistics Services Enterprise", icon: Sailboat },
            { item: "Sale of a residential house", icon: Building2 },
            { item: "Manual labor services for loading and unloading goods", icon: Users }
        ],

        agentDutiesTitle: "3.3.7 Duties and Responsibilities of a Withholding Agent",
        dutiesList: [
            { 
                title: "Timely Remittance of Tax", 
                desc: "Must remit the total tax withheld during a month to the authority within 30 days from the end of that month.",
                icon: Calendar 
            },
            { 
                title: "Submission of Detailed Information", 
                desc: "When remitting the tax, the agent must submit a detailed list showing the name, TIN, total amount paid, and tax withheld for each person/entity, using the form provided by the authority.",
                icon: ListChecks 
            },
            { 
                title: "Record Keeping", 
                desc: "Must keep proper records when withholding tax, using the payee's name, address, and TIN.",
                icon: BookOpen 
            },
            { 
                title: "Issuing a Receipt", 
                desc: "Must issue a legal, sequentially numbered receipt to the person/entity from whom tax was withheld.",
                icon: FileText 
            }
        ]
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


// --- Main Component ---
export default function WithholdingAgentsAndExemptionsModule() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const t = content[lang];

    const toggleLanguage = () => {
        setLang(lang === 'am' ? 'en' : 'am');
    };

    return (
        <div className="font-sans p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <header className="text-gray-800 p-4 border-b flex items-center justify-between">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">{t.moduleTitle}</h1>
                    <button
                        onClick={toggleLanguage}
                        className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 text-sm"
                    >
                        {t.langButton}
                    </button>
                </header>

                <main className="p-4 sm:p-6">
                    {/* Individual Withholding Agents */}
                    <Section title={t.individualAgentsTitle} icon={<UserCheck className="h-7 w-7 mr-3 text-blue-600" />}>
                        <div className="p-3">
                             <h4 className="font-semibold text-blue-800 text-xl">{t.turnoverBasedRule.title}</h4>
                            <p className="text-blue-700 text-base sm:text-lg">{t.turnoverBasedRule.desc}</p>
                        </div>
                        <AccordionItem title={t.sectorBasedRule.title} defaultOpen={true}>
                            <ul className="list-disc list-inside space-y-2 p-2 text-base sm:text-lg">
                                {t.sectorBasedRule.list.map(item => <li key={item}>{item}</li>)}
                            </ul>
                        </AccordionItem>
                    </Section>

                    {/* Exemptions */}
                    <Section title={t.exemptionsTitle} icon={<ShieldOff className="h-7 w-7 mr-3 text-green-600" />}>
                        <p className="text-base sm:text-lg">{t.exemptionsIntro}</p>
                        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {t.exemptionsList.map(ex => {
                                const Icon = ex.icon;
                                return (
                                <div key={ex.item} className="flex items-center p-3">
                                    <Icon className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                                    <span className="text-base text-gray-700">{ex.item}</span>
                                </div>
                            )})}                        </div>
                    </Section>

                     {/* Agent Duties */}
                    <Section title={t.agentDutiesTitle} icon={<Gavel className="h-7 w-7 mr-3 text-blue-600" />}>
                        <div className="space-y-3">
                            {t.dutiesList.map(duty => {
                                const Icon = duty.icon;
                                return (
                                <div key={duty.title} className="p-3">
                                    <h4 className="font-semibold text-xl text-gray-800 flex items-center mb-1">
                                        <Icon className="h-5 w-5 mr-3 text-blue-600"/>
                                        {duty.title}
                                    </h4>
                                    <p className="pl-8 text-gray-700 text-base sm:text-lg">{duty.desc}</p>
                                </div>
                            )})}                        </div>
                    </Section>
                    <ChapterNavigation previous='/content/686e8e6823afc16ef4f670e4' next='/content/686e8e6823afc16ef4f670ea' lang={lang} />

                </main>
                
                <footer className="text-center text-gray-600 text-sm p-3 border-t">
                    <p>{t.footer}</p>
                </footer>
            </div>
        </div>
    );
}

'use client';

import { useState, ReactNode } from 'react';
import {
    PackageX,
    Globe,
    HardHat,
    Hotel,
    Gavel,
    Users
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object ---
const content = {
    am: {
        title: "ልዩ ተቀናሽ ወጪዎች: የምርት ብክነት እና መዝናኛ",
        langButton: "English",
        footer: "የታክስ ህግ ዕውቀት ለህግ አክባሪነት መሠረት ነው።",

        wastageTitle: "የምርት ብክነት ወጪ",
        wastageRule: "በምርት ዝግጅትና አቅርቦት ሂደት ውስጥ በተፈጥሮ ወይም በሂደት ምክንያት ለሚከሰት ብክነት የሚወጣው ወጪ በተቀናሽነት ሊያዝ ይችላል።",
        wastageExamplesTitle: "የብክነት ምሳሌዎች:",
        wastageExamples: [
            "በብጣሪ እና በሽርፍራፊ (Scraps and fragments)",
            "ሰሊጥ እና ኑግ በትነት (Evaporation of sesame and noug)",
            "ነዳጅ በማቅለጥ ሂደት (Fuel loss during liquefaction)",
            "ቡና በቆይታ ጊዜ ክብደት መቀነስ (Weight loss of coffee over time)"
        ],
        wastageCondition: "ይህ ወጪ ተቀናሽ የሚሆነው፣ የብክነቱ መጠን በሚመለከተው የመንግስት አካል በጸደቀ ሳይንሳዊ ጥናት የተረጋገጠ ሲሆን ብቻ ነው።",

        entertainmentTitle: "የመዝናኛ ወጪ (ለሰራተኞች የሚቀርብ ምግብና መጠጥ)",
        entertainmentIntro: "ለሰራተኞች በነጻ የሚቀርብ ምግብና መጠጥ ወጪ በተወሰነ ገደብ ውስጥ ተቀናሽ ይደረጋል። ገደቡ እንደየስራው ዘርፍ ይለያያል፡",
        
        entertainmentRule1: {
            title: "ለማዕድን፣ ማኑፋክቸሪንግ እና ግብርና/ሆርቲካልቸር ዘርፎች",
            icon: HardHat,
            desc: "በእነዚህ ዘርፎች የተሰማራ ቀጣሪ ለሰራተኞቹ በነጻ ለሚያቀርበው ምግብና መጠጥ የሚያወጣው ወጪ ተቀናሽ ይሆናል።",
            limit: "30%",
            limitDesc: "ነገር ግን፣ በወር ውስጥ የሚወጣው ወጪ በዚያው ወር ለሰራተኞቹ ከተከፈለው ጠቅላላ የደሞዝ ወጪ ከ30% መብለጥ የለበትም።"
        },
        entertainmentRule2: {
            title: "ለሆቴሎች፣ ሬስቶራንቶች እና ሌሎች የምግብ አገልግሎት ሰጪዎች",
            icon: Hotel,
            desc: "እነዚህ ተቋማት ለራሳቸው ሰራተኞች ለሚያቀርቡት ምግብና መጠጥ የሚያወጡት ወጪ ተቀናሽ ይሆናል።",
            limit: "20%",
            limitDesc: "ነገር ግን፣ በወር ውስጥ የሚወጣው ወጪ በዚያው ወር ለሰራተኞቹ ከተከፈለው ጠቅላላ የደሞዝ ወጪ ከ20% መብለጥ የለበትም።"
        }
    },
    en: {
        title: "Special Deductible Costs: Product Wastage and Entertainment",
        langButton: "አማርኛ",
        footer: "Knowledge of tax law is the foundation for compliance.",

        wastageTitle: "Product Wastage/Spoilage Cost",
        wastageRule: "Costs incurred for product wastage that occurs naturally or as part of the process during preparation and supply can be claimed as a deduction.",
        wastageExamplesTitle: "Examples of Wastage:",
        wastageExamples: [
            "Scraps and fragments",
            "Evaporation of sesame and noug",
            "Fuel loss during liquefaction processes",
            "Weight loss of coffee over time"
        ],
        wastageCondition: "This cost is only deductible if the amount of wastage is verified by a scientific study approved by the relevant government authority.",

        entertainmentTitle: "Entertainment Cost (Food & Drink for Employees)",
        entertainmentIntro: "The cost of free food and drink provided to employees is deductible within specific limits. The limits vary by industry sector:",

        entertainmentRule1: {
            title: "For Mining, Manufacturing, and Agriculture/Horticulture Sectors",
            icon: HardHat,
            desc: "An employer in these sectors can deduct the cost of free food and drink provided to their employees.",
            limit: "30%",
            limitDesc: "However, the monthly deductible expense cannot exceed 30% of the total gross salary paid to those employees for that month."
        },
        entertainmentRule2: {
            title: "For Hotels, Restaurants, and Other Food Service Providers",
            icon: Hotel,
            desc: "These establishments can deduct the cost of food and drink they provide to their own employees.",
            limit: "20%",
            limitDesc: "However, the monthly deductible expense cannot exceed 20% of the total gross salary paid to those employees for that month."
        }
    }
};


// --- Helper Components ---
const Section = ({ title, icon, children }: { title: string, icon: ReactNode, children: ReactNode }) => (
    <section className="mb-8">
        <div className="flex items-center mb-3 border-b pb-2">
            {icon}
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 ml-3">{title}</h2>
        </div>
        <div className="space-y-3 text-gray-800 leading-loose">
            {children}
        </div>
    </section>
);

const RuleCard = ({ rule, lang }: { rule: any, lang: 'am' | 'en' }) => {
    const Icon = rule.icon;
    return (
        <div className="p-4 flex flex-col md:flex-row items-start md:items-center">
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-center mx-auto md:mx-0 md:mr-6 mb-4 md:mb-0">
                <span className="text-4xl sm:text-5xl font-bold text-blue-600">{rule.limit}</span>
            </div>
            <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-start">
                    <Icon className="h-6 w-6 mr-3 text-blue-600 flex-shrink-0 mt-1" />
                    <span>{rule.title}</span>
                </h3>
                <p className="mt-2 text-gray-700 text-lg">{rule.desc}</p>
                <p className="mt-2 text-gray-800 font-semibold text-lg">{rule.limitDesc}</p>
            </div>
        </div>
    );
};


// --- Main Component ---
export default function WastageAndEntertainmentCostModule() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const t = content[lang];

    const toggleLanguage = () => {
        setLang(lang === 'am' ? 'en' : 'am');
    };

    return (
        <div className="font-sans p-2 sm:p-4">
            <div className="max-w-full mx-auto">
                <header className="py-4 border-b relative">
                    <h1 className="text-3xl sm:text-4xl font-bold">{t.title}</h1>
                    <button
                        onClick={toggleLanguage}
                        className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-all duration-300"
                        aria-label="Toggle language"
                    >
                        <Globe className="h-6 w-6" />
                    </button>
                </header>

                <main className="p-4 sm:p-6">
                    {/* Product Wastage Cost */}
                    <Section title={t.wastageTitle} icon={<PackageX className="h-7 w-7 mr-3 text-blue-600" />}>
                        <p className="text-lg">{t.wastageRule}</p>
                        <div className="p-3">
                            <h4 className="font-semibold text-gray-700 text-xl">{t.wastageExamplesTitle}</h4>
                            <ul className="list-disc list-inside space-y-1 mt-2 pl-2 text-gray-700 text-lg">
                                {t.wastageExamples.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <div className="mt-4 p-3">
                            <h4 className="font-bold flex items-center text-xl"><Gavel className="h-5 w-5 mr-2" />{lang === 'am' ? 'የተቀናሽነት ቅድመ ሁኔታ' : 'Condition for Deduction'}</h4>
                            <p className="mt-1 text-lg">{t.wastageCondition}</p>
                        </div>
                    </Section>

                    {/* Entertainment Cost */}
                    <Section title={t.entertainmentTitle} icon={<Users className="h-7 w-7 mr-3 text-blue-600" />}>
                        <p className="text-lg sm:text-xl">{t.entertainmentIntro}</p>
                        <div className="mt-6 space-y-6">
                            <RuleCard rule={t.entertainmentRule1} lang={lang} />
                            <RuleCard rule={t.entertainmentRule2} lang={lang} />
                        </div>
                    </Section>
                </main>
                
                <footer className="text-center text-gray-600 text-sm p-3 border-t">
                    <p>{t.footer}</p>
                </footer>
                <ChapterNavigation previous="/content/686e8e6423afc16ef4f670bd" next="/content/686e8e6523afc16ef4f670c3" lang={lang} />
            </div>
        </div>
    );
}

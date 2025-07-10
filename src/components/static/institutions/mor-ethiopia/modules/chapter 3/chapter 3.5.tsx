// Suggested file path: /src/components/static/mor/WithholdingAgentsModule.tsx
'use client';

import { useState, ReactNode } from 'react';
import {
    Wrench,
    HardHat,
    Landmark,
    Building2,
    Users,
    ChevronDown,
    ChevronUp,
    Lightbulb,
    Gavel,
    ShoppingCart
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object ---
const content = {
    am: {
        moduleTitle: "ልዩ የግብር አያያዝ እና ግብር ቀንሶ የማስቀረት ግዴታ ያለባቸው አካላት",
        langButton: "English",
        footer: "የታክስ ህግ ዕውቀት ለህግ አክባሪነት መሠረት ነው።",
        
        repairServicesTitle: "3.3.2 ለጥገና ወይም ለእድሳት አገልግሎት የሚፈጸም ክፍያ",
        repairIntro: "ለጥገናና እድሳት አገልግሎት ክፍያ ሲፈጸም የቅድመ ግብር አያያዙ እንደየአሰራሩ ይለያያል፡",
        repairScenario1: {
            title: "ሁኔታ 1: አገልግሎት ሰጪው መለዋወጫውን ሲገዛ ገዢው ወጪውን ሲተካለት",
            desc: "የጥገና አገልግሎት ሰጪው መለዋወጫ ዕቃዎችን በራሱ ገዝቶ ሲያቀርብ እና አገልግሎት ገዢው የዕቃውን ወጪ በደረሰኝ መሰረት ለብቻው ሲተካለት፣ የ2% ቅድመ ግብር ተቀናሽ የሚደረገው ከአገልግሎት ክፍያው ላይ ብቻ ነው።",
            example: "ለምሳሌ፣ ለአገልግሎቱ 5,000 ብር እና ለመለዋወጫ 15,000 ብር ቢከፈል፣ 2% የሚቀነሰው ከ5,000 ብሩ ላይ ብቻ ነው (ገደቡን ካለፈ)። ለመለዋወጫው ክፍያ ላይ ቅድመ ግብር አይቀነስም።"
        },
        repairScenario2: {
            title: "ሁኔታ 2: አገልግሎት ሰጪው ዕቃውንና አገልግሎቱን አንድ ላይ አጠቃሎ ሲሸጥ",
            desc: "አገልግሎት ሰጪው ዕቃውንና አገልግሎቱን አንድ ላይ አጠቃሎ አንድ ዋጋ ሲያቀርብ፣ የ2% ቅድመ ግብሩ ከጠቅላላ ክፍያው ላይ ተቀንሶ ገቢ መደረግ አለበት።",
            note: "የጥገናና እድሳት አገልግሎት የተሽከርካሪ፣ የፋብሪካ ማሽኖች (ሎደር፣ ግሬደር)፣ እና ሌሎች መሳርያዎች ጥገናን ይጨምራል።"
        },
        
        constructionServicesTitle: "3.3.3 የኮንስትራክሽን አገልግሎት ግዥን በሚመለከት",
        constructionIntro: "ለኮንስትራክሽን ስራ ክፍያ ሲፈጸም፣ የ2% ቅድመ ግብሩ የሚሰላው ከጠቅላላ ክፍያው ላይ ሳይሆን፣ በስራው አይነት መሰረት በተወሰነ መቶኛ (percentage) ላይ ነው። ይህም የእቃውን ወጪ ግምት ውስጥ ለማስገባት ነው።",
        constructionRates: {
            title: "ግብር የሚሰላበት የክፍያ መቶኛ",
            items: [
                { type: "የህንጻ ግንባታ", rate: "45%" },
                { type: "የመንገድ ግንባታ - ጠጠር", rate: "72%" },
                { type: "የመንገድ ግንባታ - አስፋልት (Gravel Asphalt Concrete)", rate: "65%" },
                { type: "የመንገድ ግንባታ - አስፋልት (Gravel Double Surface)", rate: "60%" },
                { type: "የመንገድ ማሻሻያ (Rehabilitation)", rate: "40%" },
                { type: "የድልድይ ስራ", rate: "55%" },
                { type: "የመጠጥ ውሃ ፕሮጀክት ሲቪል ስራ", rate: "50%" }
            ]
        },
        constructionExample: "ምሳሌ: ለአንድ የህንጻ ግንባታ ፕሮጀክት 1,000,000 ብር ቢከፈል። ቅድመ ግብሩ የሚሰላው ከ 1,000,000 ብር * 45% = 450,000 ብር ላይ ነው። የሚቀነሰው ግብር 450,000 * 2% = 9,000 ብር ይሆናል።",
        
        withholdingAgentsTitle: "3.3.4 ግብር ቀንሰው የማስቀረት ግዴታ ያለባቸው ሰዎች/ድርጅቶች",
        agentCategories: {
            legalEntities: {
                title: "በህግ የሰውነት መብት የተሰጣቸው ድርጅቶች",
                icon: Building2,
                list: ["የአክሲዮን ማህበር", "ኃላፊነቱ የተወሰነ የግል ማህበር", "የሽርክና ማህበር", "የህብረት ስራ ማህበር"]
            },
            government: {
                title: "የመንግስት መ/ቤቶች",
                icon: Landmark,
                list: ["የፌዴራል፣ የክልል፣ እና የከተማ አስተዳደር የመንግስት መ/ቤቶች"]
            },
            nonProfit: {
                title: "ለትርፍ ያልተቋቋሙ ድርጅቶች",
                icon: Users,
                list: ["የሃይማኖት ድርጅቶች", "ማህበራት", "መንግስታዊ ያልሆኑ ድርጅቶች (NGOs)"]
            },
            ecx: {
                title: "የኢትዮጵያ ምርት ገበያ (ECX)",
                icon: ShoppingCart,
                list: ["በምርት ገበያው በኩል በሚከናወን ግብይት ላይ ገዥውን በመወከል"]
            }
        }
    },
    en: {
        moduleTitle: "Special Tax Treatment and Obligated Withholding Agents",
        langButton: "አማርኛ",
        footer: "Knowledge of tax law is the foundation for compliance.",
        
        repairServicesTitle: "3.3.2 Payments for Repair or Renovation Services",
        repairIntro: "The withholding tax treatment for repair and renovation services varies depending on the arrangement:",
        repairScenario1: {
            title: "Scenario 1: Buyer Reimburses the Service Provider for Spare Parts",
            desc: "When a service provider buys spare parts and the buyer reimburses the cost separately based on a receipt, the 2% withholding tax is deducted only from the payment for the service fee.",
            example: "For example, if the payment is 5,000 ETB for the service and 15,000 ETB for the parts, the 2% is withheld only from the 5,000 ETB (if it exceeds the threshold). No withholding tax is applied to the reimbursement for parts."
        },
        repairScenario2: {
            title: "Scenario 2: Service Provider Invoices for Parts and Service Together",
            desc: "If the service provider offers a single, bundled price for both the parts and the service, the 2% withholding tax must be deducted from the total payment amount.",
            note: "Repair and renovation services include the maintenance of vehicles, factory machinery (loaders, graders), and other equipment."
        },
        
        constructionServicesTitle: "3.3.3 Regarding Purchase of Construction Services",
        constructionIntro: "When making payments for construction work, the 2% withholding tax is not calculated on the total payment. Instead, it is calculated on a specific percentage of the payment, which varies by the type of work. This is to account for the cost of materials.",
        constructionRates: {
            title: "Applicable Payment Percentage for Tax Calculation",
            items: [
                { type: "Building Construction", rate: "45%" },
                { type: "Road Construction - Gravel", rate: "72%" },
                { type: "Road Construction - Gravel Asphalt Concrete", rate: "65%" },
                { type: "Road Construction - Gravel Double Surface", rate: "60%" },
                { type: "Road Rehabilitation", rate: "40%" },
                { type: "Bridge Work", rate: "55%" },
                { type: "Drinking Water Project Civil Works", rate: "50%" }
            ]
        },
        constructionExample: "Example: If a payment of 1,000,000 ETB is made for a building construction project. The advance tax is calculated on 1,000,000 ETB * 45% = 450,000 ETB. The tax to be withheld is 450,000 * 2% = 9,000 ETB.",
        
        withholdingAgentsTitle: "3.3.4 Persons/Entities Obligated to Withhold Tax",
        agentCategories: {
            legalEntities: {
                title: "Entities with Legal Personality",
                icon: Building2,
                list: ["Share Company", "Private Limited Company (PLC)", "Partnership", "Cooperative Society"]
            },
            government: {
                title: "Government Bodies",
                icon: Landmark,
                list: ["Federal, Regional, and City Administration government bodies"]
            },
            nonProfit: {
                title: "Non-Profit Organizations",
                icon: Users,
                list: ["Religious organizations", "Associations", "Non-Governmental Organizations (NGOs)"]
            },
            ecx: {
                title: "Ethiopia Commodity Exchange (ECX)",
                icon: ShoppingCart,
                list: ["On behalf of the buyer for transactions conducted through the exchange"]
            }
        }
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

const AgentCard = ({ category }: { category: any }) => {
    const Icon = category.icon;
    return (
         <div className="p-3">
            <h4 className="font-semibold text-xl text-gray-800 flex items-center mb-2">
                <Icon className="h-6 w-6 mr-3 text-blue-600" />
                {category.title}
            </h4>
            <ul className="list-disc list-inside pl-4 text-gray-700 text-base sm:text-lg">
                {category.list.map((item: string, i: number) => <li key={i}>{item}</li>)}
            </ul>
        </div>
    );
};

// --- Main Component ---
export default function WithholdingAgentsModule() {
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
                    {/* Repair Services */}
                    <Section title={t.repairServicesTitle} icon={<Wrench className="h-7 w-7 mr-3 text-blue-600" />}>
                        <p className="text-base sm:text-lg">{t.repairIntro}</p>
                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                            <div className="p-3">
                                <h3 className="font-semibold text-xl">{t.repairScenario1.title}</h3>
                                <p className="mt-2 text-base">{t.repairScenario1.desc}</p>
                                <p className="mt-2 p-2 text-blue-700 text-base"><strong>{lang === 'am' ? 'ምሳሌ፡' : 'Example:'}</strong> {t.repairScenario1.example}</p>
                            </div>
                            <div className="p-3">
                                <h3 className="font-semibold text-xl">{t.repairScenario2.title}</h3>
                                <p className="mt-2 text-base">{t.repairScenario2.desc}</p>
                                <p className="mt-2 p-2 text-gray-600 text-base"><strong>{lang === 'am' ? 'ማስታወሻ፡' : 'Note:'}</strong> {t.repairScenario2.note}</p>
                            </div>
                        </div>
                    </Section>

                    {/* Construction Services */}
                    <Section title={t.constructionServicesTitle} icon={<HardHat className="h-7 w-7 mr-3 text-blue-600" />}>
                        <p className="text-base sm:text-lg">{t.constructionIntro}</p>
                        <AccordionItem title={t.constructionRates.title} defaultOpen={true}>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-4">
                                {t.constructionRates.items.map(item => (
                                    <div key={item.type} className="p-3 text-center">
                                        <p className="font-semibold text-gray-700 text-base sm:text-lg">{item.type}</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-blue-600">{item.rate}</p>
                                    </div>
                                ))}
                            </div>
                        </AccordionItem>
                        <div className="mt-4 p-3 text-yellow-800 text-base sm:text-lg">
                             <p><strong>{lang === 'am' ? 'ምሳሌ፡' : 'Example:'}</strong> {t.constructionExample}</p>
                        </div>
                    </Section>

                    {/* Withholding Agents */}
                    <Section title={t.withholdingAgentsTitle} icon={<Gavel className="h-7 w-7 mr-3 text-blue-600" />}>
                        <div className="grid md:grid-cols-2 gap-4">
                           <AgentCard category={t.agentCategories.legalEntities} />
                           <AgentCard category={t.agentCategories.government} />
                           <AgentCard category={t.agentCategories.nonProfit} />
                           <AgentCard category={t.agentCategories.ecx} />
                        </div>
                    </Section>
                    <ChapterNavigation previous="/content/686e8e6723afc16ef4f670e1" next="/content/686e8e6823afc16ef4f670e7" lang={lang} />

                </main>
                
                <footer className="text-center text-gray-600 text-sm p-3 border-t">
                    <p>{t.footer}</p>
                </footer>
            </div>
        </div>
    );
}

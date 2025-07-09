// Suggested file path: /src/components/static/mor/AdvanceTaxOnImportsModule.tsx
'use client';

import { useState, ReactNode } from 'react';
import {
    ShieldCheck,
    Ship,
    Globe,
    Calculator,
    Lightbulb,
    FileText,
    Info
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object ---
const content = {
    am: {
        moduleTitle: "ክፍል ሦስት: ቅድመ ታክስ (Withholding Tax)",
        langButton: "English",
        footer: "የታክስ ህግ ዕውቀት ለህግ አክባሪነት መሠረት ነው።",
        
        purposeTitle: "3.1 የቅድመ ታክስ ዓላማ",
        purposes: [
            {
                title: "የልማት መፋጠን",
                desc: "መንግስት ግብርን በበጀት አመቱ መጨረሻ ከመሰብሰብ ይልቅ ገቢ በተገኘበት ወቅት አስቀድሞ በመሰብሰብ የልማት ስራዎችን ለማፋጠን ይጠቀምበታል።",
                icon: Lightbulb
            },
            {
                title: "የታክስ ስወራን መከላከል",
                desc: "ገዢው ከሻጩ ክፍያ ላይ ግብር ቀንሶ ሲያስቀር፣ ሻጩ ሊደብቀው የሚችለውን ግብር ገዢው አስቀድሞ ለመንግስት ያስገባል። ይህ እንደ አንድ የመረጃ ምንጭ ሆኖ የታክስ ስወራን (tax evasion) ለመከላከል ይረዳል።",
                icon: ShieldCheck
            }
        ],

        importTaxTitle: "3.2 ዕቃዎች ወደ አገር ሲገቡ ስለሚከፈል ቅድመ ግብር",
        importTaxRule: "ማንኛውም ሰው ለንግድ የሚውሉ ዕቃዎችን ወደ አገር ሲያስገባ፣ የዕቃዎቹን የጉምሩክ ዋጋ (CIF) መሰረት በማድረግ 3% የንግድ ስራ ገቢ ግብር በቅድሚያ ለባለስልጣኑ ይከፍላል።",
        importTaxNote: "ይህ የ3% ቅድመ ግብር የሚሰበሰበው በጉምሩክ ኮሚሽን ቅርንጫፍ ጽ/ቤቶች በኩል ነው።",
        
        cifDefinition: {
            title: "የጉምሩክ ዋጋ (CIF) ምንድን ነው?",
            desc: "CIF ማለት 'Cost, Insurance, and Freight' ማለት ሲሆን፣ የሚከተሉትን ወጪዎች ድምር ነው፡",
            components: [
                "የዕቃው መግዣ ዋጋ (Cost of Goods)",
                "የመድን ዋስትና ወጪ (Insurance)",
                "የማጓጓዣ ወጪ (Freight/Transportation)"
            ]
        },

        calculationExampleTitle: "የስሌት ምሳሌ",
        exampleScenario: "አንድ አስመጪ የ2018 ሞዴል Toyota Corolla መኪና ከውጭ አስገብቷል እንበል።",
        exampleData: {
            costOfCar: "የመኪናው መግዣ ዋጋ: 6,000 ዶላር (በ 1 ዶላር = 40 ብር ሲመነዘር = 240,000 ብር)",
            transportation: "የማጓጓዣ ወጪ: 50,000 ብር",
            insurance: "የመድን ወጪ: 1,000 ብር"
        },
        calculationSteps: {
            step1: {
                title: "ደረጃ 1: ጠቅላላ የጉምሩክ ዋጋን (CIF) ማስላት",
                calculation: "240,000 (የዕቃ ዋጋ) + 50,000 (የማጓጓዣ) + 1,000 (የመድን) = 291,000 ብር"
            },
            step2: {
                title: "ደረጃ 2: የ3% ቅድመ ታክስን ማስላት",
                calculation: "291,000 (CIF ዋጋ) * 3% = 8,730.00 ብር"
            }
        },
        exampleConclusion: "ስለዚህ አስመጪው ለዚህ መኪና 8,730.00 ብር የቅድመ ግብር በጉምሩክ በኩል ይከፍላል ማለት ነው።"
    },
    en: {
        moduleTitle: "Part Three: Advance Tax (Withholding Tax)",
        langButton: "አማርኛ",
        footer: "Knowledge of tax law is the foundation for compliance.",

        purposeTitle: "3.1 Purpose of Advance Tax",
        purposes: [
            {
                title: "Accelerating Development",
                desc: "Instead of waiting until the end of the fiscal year, the government collects tax in advance when income is generated, which helps to speed up development projects.",
                icon: Lightbulb
            },
            {
                title: "Preventing Tax Evasion",
                desc: "When a buyer withholds tax from a seller's payment, they are remitting tax that the seller might otherwise conceal. This acts as an information source and helps to prevent tax evasion.",
                icon: ShieldCheck
            }
        ],

        importTaxTitle: "3.2 Advance Tax on Imported Goods",
        importTaxRule: "Any person importing goods for trade must pay 3% of the customs value (CIF) of the goods as an advance business income tax.",
        importTaxNote: "This 3% advance tax is collected through the Customs Commission's branch offices.",

        cifDefinition: {
            title: "What is Customs Value (CIF)?",
            desc: "CIF stands for 'Cost, Insurance, and Freight'. It is the sum of the following costs:",
            components: [
                "Cost of the Goods",
                "Insurance cost",
                "Freight/Transportation cost"
            ]
        },

        calculationExampleTitle: "Calculation Example",
        exampleScenario: "Suppose an importer brings in a 2018 model Toyota Corolla.",
        exampleData: {
            costOfCar: "Cost of the car: $6,000 (exchanged at $1 = 40 ETB = 240,000 ETB)",
            transportation: "Transportation cost: 50,000 ETB",
            insurance: "Insurance cost: 1,000 ETB"
        },
        calculationSteps: {
            step1: {
                title: "Step 1: Calculate the Total Customs Value (CIF)",
                calculation: "240,000 (Cost) + 50,000 (Transportation) + 1,000 (Insurance) = 291,000 ETB"
            },
            step2: {
                title: "Step 2: Calculate the 3% Advance Tax",
                calculation: "291,000 (CIF Value) * 3% = 8,730.00 ETB"
            }
        },
        exampleConclusion: "Therefore, the importer will pay 8,730.00 ETB as advance tax at customs for this car."
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

// --- Main Component ---
export default function AdvanceTaxOnImportsModule() {
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
                    {/* Purpose of Advance Tax */}
                    <Section title={t.purposeTitle} icon={<Info className="h-7 w-7 mr-3 text-blue-600" />}>
                        <div className="grid md:grid-cols-2 gap-4">
                            {t.purposes.map((purpose, i) => {
                                const Icon = purpose.icon;
                                return (
                                    <div key={i} className="p-3">
                                        <h3 className="font-semibold text-xl text-gray-800 flex items-center mb-2">
                                            <Icon className="h-6 w-6 mr-3 text-blue-600" />
                                            {purpose.title}
                                        </h3>
                                        <p className="text-gray-700 text-base">{purpose.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </Section>

                    {/* Advance Tax on Imports */}
                    <Section title={t.importTaxTitle} icon={<Ship className="h-7 w-7 mr-3 text-blue-600" />}>
                        <div className="p-3">
                            <p className="text-blue-800 text-lg sm:text-xl">{t.importTaxRule}</p>
                        </div>
                        <p className="text-base text-gray-600">{t.importTaxNote}</p>
                    </Section>

                    {/* Calculation Example */}
                    <Section title={t.calculationExampleTitle} icon={<Calculator className="h-7 w-7 mr-3 text-blue-600" />}>
                        <div className="p-3">
                            <p className="font-semibold text-lg sm:text-xl mb-4">{t.exampleScenario}</p>
                            
                            <div className="mb-6 p-3 text-base sm:text-lg">
                                <h4 className="font-semibold text-gray-700 flex items-center mb-2"><FileText className="h-5 w-5 mr-2" />{lang==='am'?'የግብይቱ መረጃ':'Transaction Data'}</h4>
                                <ul className="list-disc list-inside pl-2 text-gray-700">
                                    <li>{t.exampleData.costOfCar}</li>
                                    <li>{t.exampleData.transportation}</li>
                                    <li>{t.exampleData.insurance}</li>
                                </ul>
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-gray-700 text-xl">{t.calculationSteps.step1.title}</h4>
                                    <p className="mt-1 text-gray-700 text-base sm:text-lg">{t.cifDefinition.desc}</p>
                                    <ul className="text-base list-inside list-disc pl-4 text-gray-600">
                                        {t.cifDefinition.components.map(c => <li key={c}>{c}</li>)}
                                    </ul>
                                    <code className="block mt-2 p-3 text-lg sm:text-xl font-mono text-center">{t.calculationSteps.step1.calculation}</code>
                                </div>
                                <div>
                                     <h4 className="font-semibold text-gray-700 text-xl">{t.calculationSteps.step2.title}</h4>
                                     <code className="block mt-1 p-3 text-lg sm:text-xl font-mono text-center text-blue-800">{t.calculationSteps.step2.calculation}</code>
                                </div>
                            </div>

                             <p className="mt-6 text-center font-bold text-xl sm:text-2xl text-green-700 p-3">{t.exampleConclusion}</p>
                        </div>
                    </Section>
                    <ChapterNavigation previous='/content/686e8e6723afc16ef4f670de' next='/content/686e8e6823afc16ef4f670e4' lang={lang} />
                </main>
                
                <footer className="text-center text-gray-600 text-sm p-3 border-t">
                    <p>{t.footer}</p>
                </footer>
            </div>
        </div>
    );
}

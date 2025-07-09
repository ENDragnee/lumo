'use client';

import { useState, ReactNode } from 'react';
import {
    BookCopy,
    Landmark,
    Users,
    ChevronDown,
    ChevronUp,
    Lightbulb,
    FileSignature,
    Gavel,
    TrendingDown,
    Building2,
    Pickaxe,
    ArrowRightLeft,
    Percent,
    FileText,
    ShieldAlert
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object ---
const content = {
    am: {
        title: "ምዕራፍ አምስት: የድርጅት ቁጥጥር ለውጥ፣ መልሶ ማደራጀት እና የማዕድን ግብር",
        langButton: "English",
        footer: "የታክስ ህግ ዕውቀት ለህግ አክባሪነት መሠረት ነው።",
        
        reorgAndControlTitle: "የድርጅት ቁጥጥር ለውጥ እና መልሶ ማደራጀት",
        changeOfControlTitle: "ድርጅትን በመቆጣጠር ረገድ የሚደረግ ለውጥ",
        changeOfControlRule: "አንድ ድርጅት የደረሰበትን ኪሣራ ወደሚቀጥለው ዓመት ማሸጋገር የሚችለው፣ የኩባንያውን ከ50% በላይ የሆነውን የባለቤትነት ድርሻ በኪሣራው ዓመት እና በሚሸጋገርበት ዓመት ውስጥ የያዘው ሰው ተመሳሳይ ከሆነ ብቻ ነው።",

        reorganizationTitle: "የኩባንያ እንደገና መደራጀት",
        reorganizationIntro: "እንደገና መደራጀት ከሚከተሉት ሁኔታዎች አንዱ ሲከሰት ነው፡",
        reorganizationItems: [
            "ከሁለት በላይ ነዋሪ ኩባንያዎች ሲዋሃዱ።",
            "አንድ ድርጅት የሌላውን ድርጅት ከ50% በላይ ድርሻ ሲይዝ።",
            "እንደገና በሚደራጀው ድርጅት ውስጥ አባል የሆኑ ሁለት ድርጅቶች አንዱ የሌላውን ከ50% በላይ የሆነ የአክሲዮን ድርሻ ሲይዙ (የድምጽ ተሳትፎ ብቻ የሚያስገኝ እና ልዩ መብት የሌለው)።"
        ],
        
        miningTaxTitle: "የማዕድንና የነዳጅ ስራዎች ገቢ ግብር",
        miningIntroTitle: "ለምን ልዩ አያያዝ አስፈለገው?",
        miningIntroReasons: [
            "የገቢ ምንጩ ሊተካ የማይችል የሀገር የተፈጥሮ ሀብት በመሆኑ።",
            "ስራው ከፍተኛ ስጋት (Risk) እና ከፍተኛ ወጪ የሚጠይቅ በመሆኑ።",
            "የፈለጋ ስራው ረጅም ጊዜ የሚወስድ እና ውጤቱ እርግጠኛ ያልሆነ በመሆኑ (Uncertainty)።",
            "የመንግስት ልዩ ፈቃድ፣ ቁጥጥር እና ተሳትፎ ያለበት በመሆኑ።"
        ],
        miningTaxRateTitle: "የግብር መጣኔ",
        miningTaxRateRule: "በማዕድን እና ነዳጅ ስራዎች ላይ የተሰማሩ ባለፈቃዶች እና ስራ ተቋራጮች ላይ የሚጣለው የንግድ ስራ ገቢ ግብር 25% ነው።",
        miningSubcontractorTitle: "የንዑስ ስራ ተቋራጮች ታክስ",
        miningSubcontractorRule: "ባለፈቃዱ በኢትዮጵያ ነዋሪ ላልሆነ ንዑስ ስራ ተቋራጭ ከሚፈጽመው ክፍያ ላይ የሞቢላይዜሽንና ዲሞቢላይዜሽን ወጪዎችን ቀንሶ በሚቀረው መጠን ላይ 10% ግብር ቀንሶ ገቢ ማድረግ አለበት።",
        miningSubcontractorExemption: "ልዩ ሁኔታ: የነዳጅ ንዑስ ስራ ተቋራጮች ከዚህ የ10% ግብር ነጻ ናቸው።",

        miningDeductionsTitle: "ተቀናሽ የሚደረጉ ልዩ ወጪዎች",
        miningDeductionsItems: [
            "ኪሳራን እስከ 10 ዓመት ድረስ ማሸጋገር ይቻላል (ከአጠቃላይ 5 ዓመት ይለያል)።",
            "የፍለጋ ወጪ (Exploration cost)።",
            "የማልሚያ ወጪ (Development cost)።",
            "የመልሶ ማቋቋሚያ ወጪ (Rehabilitation cost)።",
            "የኢንቨስትመንት ተቀናሽ (Investment deduction) እስከ 5% ድረስ ይፈቀዳል።"
        ],

        transferOfRightsTitle: "የማዕድን ወይም የነዳጅ መብት ስለማስተላለፍ",
        directTransferTitle: "ቀጥተኛ ዝውውር (Direct Transfer)",
        directTransferRule: "መብት ሲተላለፍ በሻጭና ገዢ መካከል የጽሁፍ 'የማስተላለፍ ስምምነት' መኖር አለበት።",
        recaptureRuleTitle: "የተቀናሽ ወጪን መልሶ እንደ ገቢ መያዝ (Recapture Rule)",
        recaptureRuleDesc: "አንድ መብት አስተላላፊ ቀደም ሲል ላወጣቸው ወጪዎች ተቀናሽ አድርጎ ከነበረ፣ መብቱን ሲያስተላልፍ ያገኘው ተቀናሽ በሙሉ ተመላሽ እንደተደረገ ወጪ ተቆጥሮ በዝውውሩ ዓመት እንደተገኘ ገቢ ታክስ ይከፈልበታል።",
        
        indirectTransferTitle: "በተዘዋዋሪ መንገድ ስለማስተላለፍ (Indirect Transfer)",
        indirectTransferRule: "የባለፈቃዱ ወይም የስራ ተቋራጩ ድርጅት ዋና ባለቤትነት ከ10% በላይ ከተለወጠ (ለምሳሌ தாய் ኩባንያው ከተሸጠ)፣ ለውጡን ወዲያውኑ ለባለስልጣኑ በጽሁፍ ማሳወቅ ግዴታ ነው።"
    },
    en: {
        title: "Chapter Five: Change of Control, Reorganization, and Mining Tax",
        langButton: "አማርኛ",
        footer: "Knowledge of tax law is the foundation for compliance.",

        reorgAndControlTitle: "Change of Control and Reorganization",
        changeOfControlTitle: "Change in Controlling Interest",
        changeOfControlRule: "An entity can only carry forward a loss if the same person holds more than 50% of the ownership interest during both the year the loss was incurred and the year it is carried forward to.",

        reorganizationTitle: "Company Reorganization",
        reorganizationIntro: "Reorganization occurs under one of the following conditions:",
        reorganizationItems: [
            "The merger of two or more resident companies.",
            "One entity acquires more than 50% of the shares of another entity.",
            "In a reorganization, two member entities where one holds more than 50% of the shares of the other (with only voting rights and no special privileges)."
        ],
        
        miningTaxTitle: "Income Tax on Mining and Petroleum Operations",
        miningIntroTitle: "Why is there special treatment?",
        miningIntroReasons: [
            "The source of income is a non-renewable national resource.",
            "The work is high-risk and requires high capital expenditure.",
            "Exploration is a long-term process with an uncertain outcome (Uncertainty).",
            "It requires a special government license, control, and participation."
        ],
        miningTaxRateTitle: "Tax Rate",
        miningTaxRateRule: "The business income tax imposed on licensees and contractors engaged in mining and petroleum operations is 25%.",
        miningSubcontractorTitle: "Tax on Subcontractors",
        miningSubcontractorRule: "The licensee must withhold 10% tax from payments made to a non-resident subcontractor, after deducting mobilization and demobilization costs.",
        miningSubcontractorExemption: "Exception: Petroleum subcontractors are exempt from this 10% tax.",

        miningDeductionsTitle: "Special Deductible Expenses",
        miningDeductionsItems: [
            "Losses can be carried forward for up to 10 years (differs from the general 5-year rule).",
            "Exploration cost.",
            "Development cost.",
            "Rehabilitation cost.",
            "An investment deduction of up to 5% is allowed."
        ],

        transferOfRightsTitle: "Transfer of Mining or Petroleum Rights",
        directTransferTitle: "Direct Transfer",
        directTransferRule: "When a right is transferred, there must be a written 'transfer agreement' between the seller and buyer.",
        recaptureRuleTitle: "Recapture Rule",
        recaptureRuleDesc: "When a transferor sells a right for which they previously claimed deductions, the total amount of those deductions is treated as recovered and is included as taxable income in the year of the transfer.",
        
        indirectTransferTitle: "Indirect Transfer",
        indirectTransferRule: "If there is a change of more than 10% in the ultimate ownership of the licensee or contractor (e.g., if the parent company is sold), they must immediately notify the authority in writing."
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

const AccordionItem = ({ title, children }: { title: string, children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
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

const InfoCard = ({ title, items, icon, intro }: { title: string, items: string[], icon: ReactNode, intro?: string }) => (
    <div className="p-2 h-full">
        <h4 className="font-bold text-lg text-gray-800 flex items-center mb-2">{icon}{title}</h4>
        {intro && <p className="mb-3 text-base text-gray-600">{intro}</p>}
        <ul className="list-disc list-inside space-y-2 mt-2 pl-2 text-gray-700">
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    </div>
);


// --- Main Component ---
export default function CorporateAndMiningTaxModule() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const t = content[lang];

    const toggleLanguage = () => {
        setLang(lang === 'am' ? 'en' : 'am');
    };

    return (
        <div className="font-sans p-4 sm:p-6">
            <div className="max-w-full mx-auto">
                <header className="p-6 relative">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">{t.title}</h1>
                    <button
                        onClick={toggleLanguage}
                        className="absolute top-4 right-4 text-gray-800 font-semibold py-2 px-4 text-sm hover:bg-gray-100 transition-all duration-300"
                    >
                        {t.langButton}
                    </button>
                </header>

                <main className="p-4 sm:p-6">
                    {/* Reorganization and Control */}
                    <Section title={t.reorgAndControlTitle} icon={<Building2 className="h-7 w-7 mr-3 text-blue-600" />}>
                        <div className="p-3">
                            <h3 className="font-bold flex items-center mb-2 text-lg"><Gavel className="h-5 w-5 mr-2" />{t.changeOfControlTitle}</h3>
                            <p>{t.changeOfControlRule}</p>
                        </div>
                        <div className="mt-4">
                            <InfoCard 
                                title={t.reorganizationTitle} 
                                intro={t.reorganizationIntro}
                                items={t.reorganizationItems} 
                                icon={<Users className="h-6 w-6 mr-2 text-indigo-600" />}
                            />
                        </div>
                    </Section>

                    {/* Mining & Petroleum Tax */}
                    <Section title={t.miningTaxTitle} icon={<Pickaxe className="h-7 w-7 mr-3 text-gray-700" />}>
                        <AccordionItem title={t.miningIntroTitle}>
                             <ul className="list-disc list-inside space-y-2 pl-2">
                                {t.miningIntroReasons.map((item, i) => <li key={i}>{item}</li>)}
                             </ul>
                        </AccordionItem>
                        
                        <div className="mt-4 p-3">
                            <h3 className="font-bold text-green-800 flex items-center text-lg"><Percent className="h-5 w-5 mr-2" />{t.miningTaxRateTitle}</h3>
                            <p className="text-lg text-green-700">{t.miningTaxRateRule}</p>
                        </div>

                        <div className="mt-4 p-3">
                            <h3 className="font-semibold text-lg">{t.miningSubcontractorTitle}</h3>
                            <p className="mt-2">{t.miningSubcontractorRule}</p>
                             <p className="mt-2 text-sm text-gray-500"><em>({t.miningSubcontractorExemption})</em></p>
                        </div>
                        
                        <div className="mt-4">
                             <InfoCard 
                                title={t.miningDeductionsTitle}
                                items={t.miningDeductionsItems} 
                                icon={<TrendingDown className="h-6 w-6 mr-2 text-red-600" />}
                            />
                        </div>
                    </Section>

                    {/* Transfer of Rights */}
                    <Section title={t.transferOfRightsTitle} icon={<ArrowRightLeft className="h-7 w-7 mr-3 text-purple-600" />}>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg sm:text-xl mb-2">{t.directTransferTitle}</h3>
                                <p>{t.directTransferRule}</p>
                            </div>
                            <div className="p-3 text-yellow-800">
                                <h4 className="font-bold flex items-center"><ShieldAlert className="h-5 w-5 mr-2"/>{t.recaptureRuleTitle}</h4>
                                <p className="mt-1">{t.recaptureRuleDesc}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg sm:text-xl mb-2">{t.indirectTransferTitle}</h3>
                                <p>{t.indirectTransferRule}</p>
                            </div>
                        </div>
                    </Section>
                    <ChapterNavigation previous='/content/686e8e6623afc16ef4f670cc' next='/content/686e8e6623afc16ef4f670d2' lang={lang} />
                </main>
                
                <footer className="text-center text-gray-600 text-sm p-3 border-t">
                    <p>{t.footer}</p>
                </footer>
            </div>
        </div>
    );
}

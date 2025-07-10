'use client';

import { useState, ReactNode } from 'react';
import {
    ClipboardX,
    TrendingDown,
    Globe,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    Info,
    XOctagon,
    ShieldOff
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object ---
const content = {
    am: {
        title: "የማይሰበሰብ ዕዳ፣ የኪሳራ ማሸጋገር እና ተቀናሽ የማይሆኑ ወጪዎች",
        langButton: "English",
        footer: "የታክስ ህግ ዕውቀት ለህግ አክባሪነት መሠረት ነው።",

        badDebtTitle: "የማይሰበሰብ ዕዳን በወጪነት ስለመያዝ",
        badDebtIntro: "አንድ ዕዳ የማይሰበሰብ ሆኖ በወጪነት ተቀናሽ ሊደረግ የሚችለው የሚከተሉት አራት መስፈርቶች ሲሟሉ ነው፡",
        badDebtConditions: [
            "ዕዳው ቀደም ሲል በግብር ከፋዩ መዝገብ ላይ እንደ 'ገቢ' ሆኖ ተመዝግቦ የነበረ ከሆነ።",
            "ዕዳውን ለማስከፈል አስፈላጊ የሆኑ ሁሉም የህግ እርምጃዎች ተወስደው ሳይሳኩ ሲቀሩ።",
            "ዕዳው ከግብር ከፋዩ የሂሳብ መዝገብ ላይ ሙሉ በሙሉ የተሰረዘ (written-off) ከሆነ።",
            "በወጪነት የሚቀነሰው የዕዳ መጠን ከሂሳብ መዝገብ ከተሰረዘው መጠን መብለጥ የለበትም።"
        ],

        lossCarryForwardTitle: "ኪሳራን ስለማሸጋገር",
        lossCarryForwardRules: [
            "ኪሳራን ማሸጋገር የሚቻለው ኪሳራው ከደረሰበት ዓመት ቀጥሎ ላሉት አምስት (5) ተከታታይ ዓመታት ነው።",
            "ኪሳራን በወጪነት ለመያዝ የሚፈቀደው ለሁለት (2) የግብር ዓመታት የደረሰ ኪሳራ ብቻ ነው።",
            "አንድ ግብር ከፋይ ከአንድ የግብር ዓመት በላይ ኪሳራ ካጋጠመው፣ መጀመሪያ የተከሰተውን ኪሳራ በቅድሚያ መቀነስ አለበት።"
        ],
        
        financialInstitutionsTitle: "ልዩ ድንጋጌዎች ለባንኮች እና ለመድን ኩባንያዎች",
        banksProvisionTitle: "የባንኮች የኪሳራ መጠባበቂያ",
        banksProvisionRule: "አንድ ባንክ ለብድር ኪሳራ የያዘው የመጠባበቂያ ሂሳብ በኢትዮጵያ ብሔራዊ ባንክ የጥንቃቄ መሥፈርት እና በፋይናንስ ሪፖርት አቀራረብ ደረጃዎች (IFRS) መሰረት የተሰላ ከሆነ፣ ከመጠባበቂያ ሂሳቡ መጠን ሰማንያ በመቶ (80%) በተቀናሽ ወጪነት ይያዝለታል።",
        insuranceProvisionTitle: "የመድን ኩባንያዎች መጠባበቂያ",
        insuranceProvisionRules: {
            general: "ጠቅላላ መድን (General Insurance): ጊዜው ላላለፈ ስጋት (unexpired risk) የተያዘው የመጠባበቂያ ሂሳብ፣ በሂሳብ አያያዝ ደረጃዎች መሰረት የተሰላ እስከሆነ ድረስ፣ በዓመቱ መጨረሻ ላይ የሚታየው ቀሪ የመጠባበቂያ ሂሳብ ሙሉ በሙሉ በተቀናሽ ወጪነት ይያዛል።",
            life: "የህይወት መድን (Life Insurance): የህይወት መድን ንግድ ስራ ግብር የሚከፈልበት ገቢ የሚሰላው በህጉ በተቀመጠው ልዩ ቀመር መሰረት ነው።"
        },
        
        nonDeductibleTitle: "ተቀናሽ የማይደረጉ ወጪዎች እና ኪሳራዎች",
        nonDeductibleIntro: "የሚከተሉት ወጪዎችና ኪሳራዎች ከታክስ የሚከፈልበት ገቢ ላይ ተቀናሽ አይደረጉም፡",
        nonDeductibleItems: [
            "የካፒታልነት ባህርይ ያላቸው ወጪዎች (ለምሳሌ የንብረት ግዢ)።",
            "የኩባንያን ካፒታል ለማሳደግ የሚወጡ ወጪዎች።",
            "ከአንድ ሰራተኛ ወርሃዊ ደሞዝ ከ15% በላይ የሆነ በፈቃደኝነት የሚደረግ የጡረታ ወይም የፕሮቪደንት ፈንድ መዋጮ።",
            "የአክሲዮን ድርሻ እና የትርፍ ድርሻ ክፍፍል።",
            "በመድን፣ በካሳ ወይም በዋስትና ውል የተመለሰ ወይም ሊመለስ የሚችል ወጪ ወይም ኪሳራ።",
            "ህግን ወይም ውልን በመጣስ የሚከፈል የገንዘብ ቅጣት ወይም ካሳ።",
            "ለወደፊት ለሚከሰቱ ወጪዎች ወይም ኪሳራዎች የሚያዝ የመጠባበቂያ ሂሳብ።",
            "የግብር ከፋዩ የግል ወጪ።",
            "የተከፈለ የገቢ ግብር ወይም ተመላሽ የሚደረግ የተጨማሪ እሴት ታክስ (VAT)።",
            "ለመዝናኛ የሚወጣ ወጪ (በህግ ከተፈቀዱት በስተቀር)።",
            "ከበጎ አድራጎት ውጪ የሚሰጥ ስጦታ ወይም እርዳታ።",
            "አንድን የንግድ ስራ ሀብት ለተዛማጅ ወገን (related party) ሲያስተላልፉ የሚደርስ ኪሳራ።"
        ]
    },
    en: {
        title: "Bad Debts, Loss Carry-Forward, and Non-Deductible Expenses",
        langButton: "አማርኛ",
        footer: "Knowledge of tax law is the foundation for compliance.",

        badDebtTitle: "Claiming Bad Debts as an Expense",
        badDebtIntro: "A debt can be deducted as a bad debt expense only if all of the following four conditions are met:",
        badDebtConditions: [
            "The amount of the debt was previously included in the taxpayer's 'Income' record.",
            "All necessary legal actions have been taken to collect the debt without success.",
            "The debt has been completely written off from the taxpayer's books of account.",
            "The amount deducted as an expense cannot exceed the amount written off from the books."
        ],

        lossCarryForwardTitle: "Carrying Forward Losses",
        lossCarryForwardRules: [
            "A loss can be carried forward for five (5) consecutive years following the year the loss was incurred.",
            "Only losses incurred in two (2) tax years are permitted to be carried forward and claimed as an expense.",
            "If a taxpayer incurs losses in more than one tax year, the loss from the earliest year must be deducted first."
        ],
        
        financialInstitutionsTitle: "Special Provisions for Banks and Insurance Companies",
        banksProvisionTitle: "Bank's Provision for Losses",
        banksProvisionRule: "If a bank's provision for loan losses is calculated according to the prudential requirements of the National Bank of Ethiopia and complies with IFRS, eighty percent (80%) of the provision amount is allowed as a deductible expense.",
        insuranceProvisionTitle: "Insurance Companies' Provisions",
        insuranceProvisionRules: {
            general: "General Insurance: A provision for unexpired risks is fully deductible as an expense at the end of the year, provided it is calculated in accordance with accounting standards.",
            life: "Life Insurance: The taxable income for life insurance business is calculated according to a special formula set out in the law."
        },
        
        nonDeductibleTitle: "Non-Deductible Expenses and Losses",
        nonDeductibleIntro: "The following expenses and losses are not deductible from taxable income:",
        nonDeductibleItems: [
            "Expenses of a capital nature (e.g., purchase of an asset).",
            "Expenses incurred to increase a company's capital.",
            "Voluntary pension or provident fund contributions exceeding 15% of an employee's monthly salary.",
            "Dividends and distribution of profits.",
            "An expense or loss that is recoverable under an insurance policy, indemnity, or guarantee.",
            "Fines or penalties for the violation of any law or contract.",
            "A provision or reserve for future expenses or losses.",
            "The personal expenses of the taxpayer.",
            "Income tax paid or refundable Value Added Tax (VAT).",
            "Entertainment expenses (except as permitted by law).",
            "Donations or gifts, other than to charity.",
            "A loss incurred on the transfer of a business asset to a related person."
        ]
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

const InfoList = ({ title, items, icon, intro }: { title: string, items: string[], icon: ReactNode, intro?: string }) => (
    <div className="p-2 h-full">
        <h3 className="font-semibold text-xl text-gray-800 flex items-center mb-2">{icon}{title}</h3>
        {intro && <p className="mb-3 text-base text-gray-700">{intro}</p>}
        <ul className="list-decimal list-inside space-y-2 mt-2 pl-2 text-gray-800 text-lg">
            {items.map((item, i) => <li key={i}>{item}</li>)}]
        </ul>
    </div>
);


// --- Main Component ---
export default function DebtAndLossModule() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const t = content[lang];

    const toggleLanguage = () => {
        setLang(lang === 'am' ? 'en' : 'am');
    };

    return (
        <div className="font-sans p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <header className="p-6 border-b flex items-center justify-between">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">{t.title}</h1>
                    <button
                        onClick={toggleLanguage}
                        className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-all duration-300"
                        aria-label="Toggle language"
                    >
                        <Globe className="h-6 w-6" />
                    </button>
                </header>

                <main className="p-4 sm:p-6">
                    {/* Bad Debt & Loss Carry Forward */}
                    <div className="grid lg:grid-cols-2 gap-4 mb-8">
                        <InfoList
                            title={t.badDebtTitle}
                            intro={t.badDebtIntro}
                            items={t.badDebtConditions}
                            icon={<ClipboardX className="h-6 w-6 mr-2 text-red-600" />}
                        />
                        <InfoList
                            title={t.lossCarryForwardTitle}
                            items={t.lossCarryForwardRules}
                            icon={<TrendingDown className="h-6 w-6 mr-2 text-red-600" />}
                        />
                    </div>

                    {/* Financial Institutions */}
                    <Section title={t.financialInstitutionsTitle} icon={<Globe className="h-7 w-7 mr-3 text-blue-600" />}>
                        <div className="p-3 text-blue-800">
                            <h3 className="font-bold flex items-center mb-2 text-xl"><Info className="h-5 w-5 mr-2" />{t.banksProvisionTitle}</h3>
                            <p className="text-lg">{t.banksProvisionRule}</p>
                        </div>
                        <AccordionItem title={t.insuranceProvisionTitle}>
                            <div className="space-y-3 text-lg">
                                <p><strong className="text-gray-800">{lang === 'am' ? 'ጠቅላላ መድን፡' : 'General Insurance:'}</strong> {t.insuranceProvisionRules.general}</p>
                                <p><strong className="text-gray-800">{lang === 'am' ? 'የህይወት መድን፡' : 'Life Insurance:'}</strong> {t.insuranceProvisionRules.life}</p>
                            </div>
                        </AccordionItem>
                    </Section>

                    {/* Non-Deductible Expenses */}
                    <Section title={t.nonDeductibleTitle} icon={<XOctagon className="h-7 w-7 mr-3 text-red-700" />}>
                        <p className="text-lg">{t.nonDeductibleIntro}</p>
                        <div className="mt-4 grid sm:grid-cols-2 gap-x-4 gap-y-1">
                            {t.nonDeductibleItems.map((item, i) => (
                                <div key={i} className="flex items-start">
                                    <ShieldOff className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                                    <span className="text-lg">{item}</span>
                                </div>
                            ))}
                        </div>
                    </Section>
                </main>
                
                <footer className="text-center text-gray-600 text-sm p-3 border-t">
                    <p>{t.footer}</p>
                </footer>
                <ChapterNavigation previous="/content/686e8e6523afc16ef4f670c0" next="/content/686e8e6523afc16ef4f670c6" lang={lang} />
            </div>
        </div>
    );
}

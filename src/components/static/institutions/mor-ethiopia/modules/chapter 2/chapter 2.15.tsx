'use client';

import { useState, ReactNode } from 'react';
import {
    BookCopy,
    FileSignature,
    ClipboardEdit,
    Check,
    X,
    Gavel,
    AlertTriangle,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    Globe,
    Landmark,
    FileSearch,
    Receipt,
    Scale
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';
// --- i18n Content Object ---
const content = {
    am: {
        title: "የታክስ መግለጫ ማስተካከያ፣ ውድቅ ማድረግ እና ልዩ ደንቦች",
        langButton: "English",
        footer: "የታክስ ህግ ዕውቀት ለህግ አክባሪነት መሠረት ነው።",

        longTermContractsTitle: "ለረጅም ጊዜ የሚቆዩ ውሎች",
        longTermContracts: {
            percentageOfCompletion: "የሂሳብ መዝገቡን በተሰብሳቢና ተከፋይ ሂሳብ (accrual basis) ለሚይዝ ግብር ከፋይ፣ ከረጅም ጊዜ ውል የሚገኝ ገቢና ወጪ የሚታሰበው በውሉ የመጠናቀቅ መቶኛ (percentage of completion) ዘዴ ነው።",
            lossCarryBack: "በውሉ የመጨረሻ ዓመት ኪሳራ የደረሰበት ግብር ከፋይ እና የንግድ ስራውን ያቆመ ከሆነ፣ ኪሳራውን ወደ ኋላ ተመልሶ በአምናው የግብር ዓመት ገቢ ላይ በተቀናሽነት እንዲያዝለት ይደረጋል።"
        },
        
        declarationsTitle: "የታክስ መግለጫ አያያዝ",
        adjustmentsTitle: "መግለጫው የሚስተካከልባቸው ሁኔታዎች",
        adjustmentsIntro: "ግብር ከፋዩ ያቀረበው የሂሳብ መዝገብ መሰረታዊ ጉድለት ከሌለው ነገር ግን የሚከተሉት ስህተቶች ከተገኙበት፣ መዝገቡ ውድቅ ሳይደረግ በማስተካከል ግብሩ ይወሰናል፡",
        adjustmentConditions: [
            "በሙሉ ወይም በከፊል ያልተገለጸ ገቢ ሲገኝ",
            "በደረሰኝ ላይ የተሰበሰበው ገቢና በመግለጫው ላይ የሰፈረው ገቢ ሲለያይ",
            "ለተጨማሪ እሴት ታክስ (VAT/TOT) ከታወጀው ገቢ ጋር ልዩነት ሲኖር",
            "የተገለጸው ያልተሸጠ እቃ (stock) ዋጋ ከቆጠራ ውጤት ጋር ሲለያይ",
            "ህጋዊ ባልሆነ ወይም ባልተመዘገበ የውል ሰነድ ላይ የተመሰረተ ወጪ ሲቀርብ (ለምሳሌ የኪራይ ውል)",
            "ያልተገለጸ ገንዘብ በባንክ ሒሳብ ውስጥ ሲገኝ እና የንግድ ስራ ገቢ አለመሆኑን ማረጋገጥ ሳይቻል ሲቀር"
        ],
        rejectionTitle: "መግለጫው ውድቅ የሚደረግባቸው ሁኔታዎች",
        rejectionIntro: "የሒሳብ መግለጫ በሚከተሉት ምክንያቶች ተቀባይነት ሊያጣ ይችላል፡",
        rejectionConditions: [
            "ግብር ከፋዩ ወይም ባለሙያው የመግለጫውን ትክክለኛነት በተገቢ ማስረጃ ሳያረጋግጥ ሲቀር",
            "ባለስልጣኑ ባልፈቀደው ወይም ህጋዊ ባልሆነ ደረሰኝ ተጠቅሞ የተዘጋጀ ሲሆን",
            "እንደ IFRS ያሉትን የሪፖርት አቀራረብ ደረጃዎች መከተል ሲገባው ሳይከተል ሲቀር"
        ],
        rejectionConsequence: "መዘዙ፡ መግለጫው ውድቅ ሲደረግ ታክሱ በግምት ይወሰናል። ነገር ግን፣ ግብር ከፋዩ መግለጫ ስላቀረበ 'መዝገብ ባለመያዝ' ቅጣት አይጣልበትም።",

        rejectedExpenseRuleTitle: "የወጪ ማስረጃ ውድቅ ሲሆን ስለሚደረግ ተቀናሽ",
        rejectedExpenseRule: "የቀረበው የወጪ ማስረጃ ተቀባይነት ባያገኝም፣ ወጪው ለንግድ ስራው አስፈላጊ እንደነበር ከተረጋገጠ ሙሉ በሙሉ ከመሰረዝ ይልቅ፡",
        expenseRuleItems: [
            "ለቋሚ ንብረት ግዢ ከሆነ፣ ከገበያ ዋጋው 70% በወጪነት ይያዛል።",
            "ለሌሎች እቃዎችና አገልግሎቶች ከሆነ፣ ከገበያ ዋጋቸው 65% በወጪነት ይያዛል።",
            "ይህ ህግ ህገ-ወጥ ወይም የውሸት (fraudulent) ለሆኑ ደረሰኞች ተፈጻሚ አይሆንም።"
        ],
        
        evidenceNoticeTitle: "ማስረጃ እንዲቀርብ ስለሚሰጥ ማስታወቂያ",
        evidenceNotice: "ባለስልጣኑ ለታክስ አወሳሰን የሚጠቅም ማንኛውንም ማስረጃ ከግብር ከፋዩ ወይም ከሌላ ሰው ሊጠይቅ ይችላል።",
        noticeRules: [
            "ማስታወቂያው የሚፈለገውን ማስረጃ አይነትና ጊዜ መግለጽ አለበት።",
            "ለማስረጃ አቀራረብ የሚሰጠው ጊዜ ከ10 ቀን ያነሰ መሆን የለበትም (ለተደጋጋሚ ጥያቄ ካልሆነ በስተቀር)።",
            "ማስታወቂያው ለግብር ከፋዩ መድረስ ካልቻለ በንግድ ወይም በመኖሪያ አድራሻው ግድግዳ ላይ ይለጠፋል።"
        ],

        forexTitle: "የውጪ ምንዛሪ እና የዋጋ ልዩነት አያያዝ",
        forexIntro: "በውጭ ምንዛሪ የሚደረጉ ግብይቶች በብር መገለጽ አለባቸው። ልዩነቶች እንደሚከተለው ይመዘገባሉ፡",
        forexRules: [
            "ለማስመጣት (Import): በብድር ደብዳቤ (LC) መክፈቻ እና እቃው ሲገባ በነበረው የምንዛሪ ተመን መካከል ያለው ልዩነት ይመዘገባል።",
            "ለመላክ (Export): በጉምሩክ መግለጫ እና በባንክ በተላከው ገንዘብ መካከል ያለው የምንዛሪ ልዩነት ይመዘገባል።",
            "የጉምሩክ ግምት (Customs Valuation): የዕቃው መግዣ ዋጋ የሚወሰነው በጉምሩክ በተተመነው ዋጋ እና በግዢ ደረሰኙ (invoice) መካከል ባለው ህጋዊ አሰራር መሰረት ነው።"
        ],

        loansTitle: "በግብር ዘመኑ ስለተገኙ ብድሮች",
        loanRules: [
            "ብድሩ በባንክ በኩል የተላለፈ መሆን አለበት።",
            "ብድሩ ለንግድ ስራ እንቅስቃሴ መዋሉን የማስረዳት ኃላፊነት የተበዳሪው (ግብር ከፋዩ) ነው።",
            "ባለስልጣኑ የቀረበውን ማስረጃ መሰረት በማድረግ ብድሩ ለንግድ ስራ መዋሉን ወይም አለመዋሉን ያጣራል።"
        ]
    },
    en: {
        title: "Tax Declaration Adjustments, Rejections, and Special Rules",
        langButton: "አማርኛ",
        footer: "Knowledge of tax law is the foundation for compliance.",

        longTermContractsTitle: "Long-Term Contracts",
        longTermContracts: {
            percentageOfCompletion: "For a taxpayer using the accrual basis of accounting, income and expenses from a long-term contract are recognized based on the percentage of completion method.",
            lossCarryBack: "If a taxpayer incurs a loss in the final year of a contract and has ceased business operations, the loss can be carried back and deducted against the income of the preceding tax year."
        },
        
        declarationsTitle: "Handling of Tax Declarations",
        adjustmentsTitle: "Conditions for Adjusting a Declaration",
        adjustmentsIntro: "If a taxpayer's submitted books of account do not have fundamental defects but contain the following errors, the tax will be determined by adjusting the records rather than rejecting them:",
        adjustmentConditions: [
            "Discovery of fully or partially undeclared income.",
            "A discrepancy between the total income collected via receipts and the income declared.",
            "A difference exists when compared to the income declared for VAT/TOT.",
            "The value of declared closing stock differs from the physical inventory count.",
            "An expense is based on an illegal or unregistered contract document (e.g., a rental agreement).",
            "Unexplained funds are found in a bank account and cannot be proven to be non-business income."
        ],
        rejectionTitle: "Conditions for Rejecting a Declaration",
        rejectionIntro: "A financial statement may be rejected for the following reasons:",
        rejectionConditions: [
            "When the taxpayer or their professional fails to substantiate the accuracy of the declaration with proper evidence.",
            "When it is prepared using unauthorized or illegal receipts.",
            "When it fails to comply with required reporting standards like IFRS."
        ],
        rejectionConsequence: "Consequence: When a declaration is rejected, the tax is determined by estimation. However, the penalty for 'failure to keep records' is not applied, as the taxpayer did submit a declaration.",

        rejectedExpenseRuleTitle: "Deduction for Rejected Proof of Expenditure",
        rejectedExpenseRule: "Even if the evidence for an expense is rejected, if it is confirmed that the expense was necessary for the business, instead of disallowing it completely:",
        expenseRuleItems: [
            "For the purchase of a fixed asset, 70% of its market value is allowed as a deductible expense.",
            "For other goods and services, 65% of their market value is allowed as a deductible expense.",
            "This rule does not apply to illegal or fraudulent receipts."
        ],
        
        evidenceNoticeTitle: "Notice to Provide Evidence",
        evidenceNotice: "The Authority may request any information relevant to tax assessment from the taxpayer or any other person.",
        noticeRules: [
            "The notice must specify the type of evidence and the time frame.",
            "The time given to provide evidence shall not be less than 10 days (unless it is a repeated request).",
            "If the notice cannot be delivered to the taxpayer, it shall be posted on the wall of their business or residential premises."
        ],

        forexTitle: "Handling of Foreign Exchange and Price Differences",
        forexIntro: "Transactions in foreign currency must be stated in Birr. Differences are to be recorded as follows:",
        forexRules: [
            "For Imports: The difference in the exchange rate between the time of opening a Letter of Credit (LC) and the time the goods enter the country must be recorded.",
            "For Exports: The exchange rate difference between the customs declaration value and the amount transferred via the bank must be recorded.",
            "Customs Valuation: The cost base of goods is determined according to the legal procedure involving the customs-assessed value and the purchase invoice."
        ],

        loansTitle: "About Loans Obtained During the Tax Year",
        loanRules: [
            "The loan must be transacted through a bank.",
            "The burden of proof to show that the loan was used for business activities lies with the borrower (taxpayer).",
            "The Authority will verify whether the loan was used for business purposes based on the evidence provided."
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
export default function TaxDeclarationAndAuditModule() {
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
                    {/* Long-Term Contracts */}
                    <Section title={t.longTermContractsTitle} icon={<FileSignature className="h-7 w-7 mr-3 text-blue-600" />}>
                        <p>{t.longTermContracts.percentageOfCompletion}</p>
                        <div className="mt-4 p-3">
                           <p><strong>{lang === 'am' ? 'ልዩ የኪሳራ ህግ፡' : 'Special Loss Rule:'}</strong> {t.longTermContracts.lossCarryBack}</p>
                        </div>
                    </Section>

                    {/* Declaration Handling */}
                    <Section title={t.declarationsTitle} icon={<ClipboardEdit className="h-7 w-7 mr-3 text-blue-600" />}>
                        <div className="grid lg:grid-cols-2 gap-4">
                            <InfoCard 
                                title={t.adjustmentsTitle} 
                                intro={t.adjustmentsIntro}
                                items={t.adjustmentConditions} 
                                icon={<Check className="h-6 w-6 mr-2 text-green-600" />} 
                            />
                            <div>
                                <InfoCard 
                                    title={t.rejectionTitle} 
                                    intro={t.rejectionIntro}
                                    items={t.rejectionConditions} 
                                    icon={<X className="h-6 w-6 mr-2 text-red-600" />} 
                                />
                                <div className="mt-4 p-4 text-red-800">
                                    <p><strong>{lang === 'am' ? 'ማስታወሻ፡' : 'Note:'}</strong> {t.rejectionConsequence}</p>
                                </div>
                            </div>
                        </div>
                    </Section>

                     {/* Special Rules */}
                    <Section title={lang === 'am' ? "ልዩ የአሰራር ደንቦች" : "Special Procedural Rules"} icon={<Gavel className="h-7 w-7 mr-3 text-blue-600" />}>
                        <AccordionItem title={t.rejectedExpenseRuleTitle}>
                            <p>{t.rejectedExpenseRule}</p>
                            <ul className="list-decimal list-inside space-y-2 mt-3 pl-4">
                                {t.expenseRuleItems.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </AccordionItem>
                        <AccordionItem title={t.evidenceNoticeTitle}>
                            <p>{t.evidenceNotice}</p>
                             <ul className="list-disc list-inside space-y-2 mt-3 pl-4">
                                {t.noticeRules.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </AccordionItem>
                    </Section>
                    
                    {/* Forex and Loans */}
                    <Section title={lang === 'am' ? "የፋይናንስ ግብይቶች" : "Financial Transactions"} icon={<Scale className="h-7 w-7 mr-3 text-blue-600" />}>
                        <div className="grid lg:grid-cols-2 gap-4">
                            <InfoCard 
                                title={t.forexTitle}
                                intro={t.forexIntro}
                                items={t.forexRules}
                                icon={<Globe className="h-6 w-6 mr-2 text-teal-600" />}
                            />
                             <InfoCard 
                                title={t.loansTitle}
                                items={t.loanRules}
                                icon={<Landmark className="h-6 w-6 mr-2 text-indigo-600" />}
                            />
                        </div>
                    </Section>
                    <ChapterNavigation previous='/content/686e8e6523afc16ef4f670c9' next='/content/686e8e6623afc16ef4f670cf' lang={lang}/>
                </main>
                
                <footer className="text-center text-gray-600 text-sm p-3 border-t">
                    <p>{t.footer}</p>
                </footer>
            </div>
        </div>
    );
}

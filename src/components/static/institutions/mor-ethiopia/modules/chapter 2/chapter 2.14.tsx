'use client';

import { useState, ReactNode } from 'react';
import {
    BookCopy,
    CalendarDays,
    FileText,
    ListChecks,
    HardDrive,
    Landmark,
    ShieldCheck,
    Gavel,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    Link,
    Building,
    ShoppingCart,
    FileSpreadsheet,
    Computer,
    FileSignature,
    PenSquare,
    Calculator
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object ---
const content = {
    am: {
        title: "ምዕራፍ አራት: የሂሳብ መዝገብ አያያዝ እና የሂሳብ ዓመት",
        langButton: "English",
        footer: "የታክስ ህግ ዕውቀት ለህግ አክባሪነት መሠረት ነው።",
        youtubeLink: "https://www.youtube.com/watch?v=NquuY41FrrA",

        fiscalYearTitle: "የሂሳብ ዓመት (Fiscal Year)",
        fiscalYearDesc: "የራሱን የሂሳብ አመት እንደ ግብር አመት እንዲጠቀም ፈቃድ ለተሰጠው ግለሰብና ድርጅት፣ የሂሳብ ዓመት ማለት የግብር ከፋዩ ዓመታዊ የፋይናንስ ሂሳብ ሚዛን (Balancesheet) በሚዘጋጅበት ጊዜ የሚጠናቀቀው የአስራ ሁለት ወራት ጊዜ ነው።",

        obligationTitle: "የታክስ ሒሳብ መዝገብ ስለመያዝ ግዴታ",
        obligationItems: {
            catA_B: "የደረጃ 'ሀ' እና 'ለ' ግብር ከፋዮች ለእያንዳንዱ ሠንጠረዥ (ለምሳሌ ኪራይ፣ ንግድ) ራሱን የቻለ የሒሳብ መዝገብ እና መግለጫ መያዝ አለባቸው።",
            catC: "በፈቃደኝነት የሒሳብ መዝገብ የሚይዝ የደረጃ 'ሐ' ግብር ከፋይ ራሱን የቻለ የሒሳብ መዝገብ እና መግለጫ መያዝ አለበት።",
            capitalAsset: "የካፒታል ሀብት በማስተላለፍ ገቢ የሚያገኝ ሰው፣ ስለሚተላለፈው ሀብት የሒሳብ መዝገብ መያዝ አለበት።"
        },
        capitalAssetRecordTitle: "የካፒታል ሀብት ሲተላለፍ የሚያዝ መረጃ",
        capitalAssetRecordItems: [
            "የተገኘበትን ቀን እና ዋጋ",
            "ሀብቱን ለማሻሻል የወጣ ማንኛውም ወጪ",
            "የማስተላለፊያ ዋጋ",
            "የማዕድን ወይም የነዳጅ ሀብት ከሆነ፣ መብቱን የሚያሳይ ሙሉ መረጃ",
            "በስጦታ፣ በእርዳታ ወይም በድርሻ ሲተላለፍ የተቀባዩ ግዴታ ስለመከናወኑ የሚገልጽ መዝገብ"
        ],
        
        requiredDocsTitle: "የሂሳብ መዝገብ ለማዘጋጀት የሚያስፈልጉ ሰነዶች",
        docTypes: {
            basic: {
                title: "መሰረታዊ ሰነዶች",
                items: [
                    "የታክስ ከፋይ መለያ ቁጥር (TIN) ሰርተፍኬት",
                    "የተጨማሪ እሴት ታክስ (VAT) ምዝገባ ሰርተፍኬት (ካለ)",
                    "የንግድ ምዝገባና ፈቃድ",
                    "የተርንኦቨር ታክስ (TOT) እና ኤክሳይስ ታክስ ሰነዶች (ካለ)"
                ]
            },
            transactional: {
                title: "የግብይት እና የፋይናንስ ሰነዶች",
                items: [
                    "ህጋዊ የግብይት ደረሰኞች እና የሽያጭ መመዝገቢያ መሳሪያ ውጤቶች (ጆርናል፣ ዜድ ሪፖርት)",
                    "የሰራተኞች የደሞዝ ክፍያ ዝርዝር (ፔሮል)",
                    "የብድር ስምምነቶች፣ የባንክ መግለጫዎች እና የክፍያ ማረጋገጫዎች",
                    "በሶስተኛ ወገን የሚረጋገጡ ማስረጃዎች (የውል ስምምነቶች፣ የክብደት ልኬት ማስረጃ)",
                    "የካሳ ክፍያ ወይም የታክስ እፎይታ ማረጋገጫዎች"
                ]
            }
        },
        
        inventoryTitle: "የንግድ እቃ ቆጠራ (Stock Inventory)",
        inventoryDesc: "የንግድ ዕቃዎች በነጠላ ወይም በጥቅል (ለምሳሌ በደርዘን፣ በኩንታል) በወጥነት መመዝገብ አለባቸው። የመለኪያ አሀድ ሲቀየር ለባለስልጣኑ በ30 ቀን ውስጥ ማሳወቅ ያስፈልጋል። በቆጠራ እና በሽያጭ ጊዜ የሚመዘገበው ስም ተመሳሳይ መሆን አለበት።",

        fixedAssetRegisterTitle: "የቋሚ ንብረት (Fixed Assets) መዝገብ",
        fixedAssetRegisterDesc: "ግብር ከፋዩ እንደየንብረቱ አይነት እና አገልግሎት የቋሚ ንብረት መዝገብ ሊኖረው ይገባል። መዝገቡ የሚከተሉትን መያዝ አለበት:",
        fixedAssetRegisterItems: [
            "እያንዳንዱ ንብረት የተገዛበት ቀን እና ዋጋ",
            "የንብረቱን ዋጋ ከ20% በላይ የጨመረ ማንኛውም የማሻሻያ ወጪ",
            "በዓመቱ መጨረሻ ያለው የተጣራ የመዝገብ ዋጋ (Net Book Value)",
            "የእያንዳንዱ ንብረት የተጠራቀመ የእርጅና ቅናሽ (Accumulated Depreciation)",
            "ለኢንቨስትመንት ፕሮጀክት የወጣ ወጪ የሚመዘገብበት የተለየ ሌጀር (ledger)"
        ],

        debtPayablesTitle: "የዕዳ እና የተከፋይ ሒሳቦች መዝገብ",
        debtPayablesDesc: "የብድር መዝገቦች የሚከተሉትን ማካተት አለባቸው:",
        debtPayablesItems: [
            "የብድር ስምምነት፣ የአበዳሪው ሙሉ መረጃ፣ እና የአከፋፈል ሁኔታ",
            "የቀረበ የዋስትና (collateral) መረጃ",
            "ብድሩ ለንግድ ስራ መዋሉን የሚያሳይ ማስረጃ",
            "የቴምብር ቀረጥ መከፈሉን የሚያረጋግጥ ማስረጃ"
        ],
        stampDutyWarning: "ትኩረት: የቴምብር ቀረጥ ያልተከፈለበት የውል ሰነድ በፍርድ ቤት ወይም በታክስ አስተዳደር ተቀባይነት እንዲኖረው፣ ህጉ የሚጠይቀውን ቀረጥ በእጥፍ መክፈል ያስፈልጋል።",

        financialStatementsTitle: "የሒሳብ መግለጫ ይዘቶች",
        financialStatementsItems: [
            "የሀብት እና የዕዳ መግለጫ (Balance Sheet)",
            "የትርፍና ኪሣራ መግለጫ (Profit and Loss Statement)",
            "የጥሬ ገንዘብ ፍሰት መግለጫ (Cash Flow Statement)",
            "የካፒታል ለውጥ መግለጫ (Change of Capital Statement)",
            "ለአምራቾች: የምርት ሂደት መግለጫ (Production Statement) እና የወጪ መግለጫ (Cost of Goods Manufactured)"
        ],

        simplifiedAccountingTitle: "ቀለል ያለ የሂሳብ አያያዝ ዘዴ",
        simplifiedAccountingDesc: "የደረጃ 'ለ' እና በፈቃደኝነት መዝገብ የሚይዙ የደረጃ 'ሐ' ግብር ከፋዮች ይህንን ዘዴ መጠቀም ይችላሉ። የሂሳብ መግለጫቸው የሚከተሉትን ማካተት አለበት:",
        simplifiedAccountingItems: [
            "የቋሚ ንብረቶች ዝርዝር (ብዛት፣ አይነት፣ ዋጋ)",
            "በዓመቱ ሙሉ በሙሉ የእርጅና ቅናሽ የተደረገላቸው ንብረቶች ዝርዝር",
            "በዓመቱ የተወገዱ ወይም የተሸጡ ንብረቶች ዝርዝር",
            "የዓመቱ መጀመሪያ እና መዝጊያ የሸቀጥ ክምችት (Opening/Closing Stock)",
            "የግዢና ሽያጭ ዝርዝር ከነደረሰኞቻቸው"
        ],
        mseNote: "ማስታወሻ: አነስተኛ እና ጥቃቅን ኢንተርፕራይዞች (MSEs) እንደ ደረጃ 'ሀ' ግብር ከፋይ የተሟላ የሂሳብ መዝገብ እንዲይዙ ይደረጋል።",

        longTermContractsTitle: "ለረጅም ጊዜ የሚቆዩ ውሎች",
        longTermContractsDesc: "የሂሳብ መዝገቡን በተሰብሳቢና ተከፋይ ሂሳብ (accrual basis) ዘዴ ለሚይዝ ግብር ከፋይ፣ ከረጅም ጊዜ ውል የሚገኝ ገቢና ወጪ የሚታሰበው በውሉ የመጠናቀቅ መቶኛ (percentage of completion) ዘዴ ነው።"
    },
    en: {
        title: "Chapter Four: Bookkeeping and Fiscal Year",
        langButton: "አማርኛ",
        footer: "Knowledge of tax law is the foundation for compliance.",
        youtubeLink: "https://www.youtube.com/watch?v=NquuY41FrrA",

        fiscalYearTitle: "Fiscal Year",
        fiscalYearDesc: "For an individual or entity permitted to use its own accounting year as its tax year, the 'fiscal year' is the twelve-month period that ends on the date its annual financial statements (Balance Sheet) are prepared.",

        obligationTitle: "Obligation to Keep Books of Account",
        obligationItems: {
            catA_B: "Category 'A' and 'B' taxpayers must keep separate books of account and statements for each schedule (e.g., rental, business).",
            catC: "A Category 'C' taxpayer who voluntarily keeps books of account must maintain separate accounts and statements.",
            capitalAsset: "A person who earns income from the transfer of a capital asset must keep accounting records regarding that asset."
        },
        capitalAssetRecordTitle: "Information to Record for Capital Asset Transfers",
        capitalAssetRecordItems: [
            "The date of acquisition and cost",
            "Any expenditure incurred for improvements",
            "The transfer price (consideration received)",
            "For mining or petroleum rights, full information showing the right",
            "Records showing the fulfillment of obligations by the recipient in cases of transfer by gift, inheritance, or share contribution"
        ],

        requiredDocsTitle: "Documents Required for Preparing Books of Account",
        docTypes: {
            basic: {
                title: "Basic Documents",
                items: [
                    "Taxpayer Identification Number (TIN) certificate",
                    "Value Added Tax (VAT) registration certificate (if applicable)",
                    "Business registration and license",
                    "Turnover Tax (TOT) and Excise Tax documents (if applicable)"
                ]
            },
            transactional: {
                title: "Transactional & Financial Documents",
                items: [
                    "Legal transaction receipts and sales recording machine outputs (journal, Z-report)",
                    "Employee payroll records",
                    "Loan agreements, bank statements, and payment confirmations",
                    "Third-party verifiable evidence (contracts, weight measurement slips)",
                    "Proof of compensation payments or tax exemptions"
                ]
            }
        },

        inventoryTitle: "Stock Inventory",
        inventoryDesc: "Trading stock must be recorded consistently, either individually or in bulk (e.g., by dozen, quintal). If the unit of measure is changed, the authority must be notified within 30 days. The name of the item must be consistent between inventory records and sales records.",

        fixedAssetRegisterTitle: "Fixed Asset Register",
        fixedAssetRegisterDesc: "A taxpayer must maintain a fixed asset register, categorized by asset type and service. The register must include:",
        fixedAssetRegisterItems: [
            "The acquisition date and cost of each asset",
            "Any improvement cost that increases the asset's value by more than 20%",
            "The net book value at the end of the year",
            "The accumulated depreciation for each asset",
            "A separate ledger for expenditures on investment projects"
        ],

        debtPayablesTitle: "Record of Debts and Payables",
        debtPayablesDesc: "Loan records must include:",
        debtPayablesItems: [
            "The loan agreement, full information of the lender, and mode of payment",
            "Information on any collateral provided",
            "Proof that the loan was used for business purposes",
            "Evidence of stamp duty payment"
        ],
        stampDutyWarning: "Attention: For a contract document that has not had stamp duty paid on it to be admissible in court or by the tax administration, double the required duty must be paid.",

        financialStatementsTitle: "Contents of Financial Statements",
        financialStatementsItems: [
            "Balance Sheet",
            "Profit and Loss Statement",
            "Cash Flow Statement",
            "Statement of Changes in Equity (Capital)",
            "For manufacturers: Production Statement and Statement of Cost of Goods Manufactured"
        ],

        simplifiedAccountingTitle: "Simplified Accounting Method",
        simplifiedAccountingDesc: "Category 'B' taxpayers and Category 'C' taxpayers who voluntarily keep records may use this method. Their financial statements must include:",
        simplifiedAccountingItems: [
            "A list of fixed assets (quantity, type, cost)",
            "A list of assets fully depreciated during the year",
            "A list of assets disposed of or sold during the year",
            "Opening and Closing Stock",
            "Details of purchases and sales with corresponding receipts"
        ],
        mseNote: "Note: Micro and Small Enterprises (MSEs) are required to maintain full books of account like Category 'A' taxpayers.",

        longTermContractsTitle: "Long-Term Contracts",
        longTermContractsDesc: "For a taxpayer who uses the accrual basis of accounting, income and expenses from a long-term contract are recognized based on the percentage of completion of the contract."
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

const InfoCard = ({ title, items, icon }: { title: string, items: (string|ReactNode)[], icon: ReactNode }) => (
    <div className="p-2 h-full">
        <h4 className="font-bold text-lg text-gray-800 flex items-center mb-2">{icon}{title}</h4>
        <ul className="list-disc list-inside space-y-2 mt-2 pl-2 text-gray-600">
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    </div>
);

// --- Main Component ---
export default function BookkeepingModule() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const t = content[lang];

    const toggleLanguage = () => {
        setLang(lang === 'am' ? 'en' : 'am');
    };

    return (
        <div className="font-sans p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <header className="p-6 relative">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">{t.title}</h1>
                    <div className="text-center mt-2">
                         <a href={t.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 inline-flex items-center text-sm">
                            <Link className="h-4 w-4 mr-2" />
                            {lang === 'am' ? 'ተጨማሪ ቪዲዮ' : 'Watch Video Supplement'}
                        </a>
                    </div>
                    <button
                        onClick={toggleLanguage}
                        className="absolute top-4 right-4 text-gray-800 font-semibold py-2 px-4 text-sm hover:bg-gray-100 transition-all duration-300"
                    >
                        {t.langButton}
                    </button>
                </header>

                <main className="p-4 sm:p-6">
                    {/* Fiscal Year and Obligation */}
                    <Section title={t.fiscalYearTitle} icon={<CalendarDays className="h-7 w-7 mr-3 text-blue-600" />}>
                        <p>{t.fiscalYearDesc}</p>
                    </Section>

                    <Section title={t.obligationTitle} icon={<PenSquare className="h-7 w-7 mr-3 text-blue-600" />}>
                         <div className="space-y-3">
                            <p><strong className='text-gray-800'>- {lang === 'am' ? 'ደረጃ "ሀ" እና "ለ":' : 'Category "A" & "B":'}</strong> {t.obligationItems.catA_B}</p>
                            <p><strong className='text-gray-800'>- {lang === 'am' ? 'ደረጃ "ሐ":' : 'Category "C":'}</strong> {t.obligationItems.catC}</p>
                            <p><strong className='text-gray-800'>- {lang === 'am' ? 'የካፒታል ሀብት:' : 'Capital Assets:'}</strong> {t.obligationItems.capitalAsset}</p>
                        </div>
                    </Section>

                    {/* Required Documents */}
                    <Section title={t.requiredDocsTitle} icon={<ListChecks className="h-7 w-7 mr-3 text-blue-600" />}>
                        <div className="grid md:grid-cols-2 gap-4">
                            <InfoCard title={t.docTypes.basic.title} items={t.docTypes.basic.items} icon={<FileText className="h-5 w-5 mr-2 text-indigo-500" />} />
                             <InfoCard title={t.docTypes.transactional.title} items={t.docTypes.transactional.items} icon={<Landmark className="h-5 w-5 mr-2 text-indigo-500" />} />
                        </div>
                    </Section>

                    {/* Specific Record Types */}
                    <AccordionItem title={lang==='am' ? "የተለያዩ የመዝገብ አይነቶች ዝርዝር" : "Details of Specific Record Types"} defaultOpen={true}>
                        <div className='space-y-4 p-2 sm:p-4'>
                            <InfoCard title={t.capitalAssetRecordTitle} items={t.capitalAssetRecordItems} icon={<Building className="h-5 w-5 mr-2 text-purple-500" />} />
                            <InfoCard title={t.fixedAssetRegisterTitle} items={t.fixedAssetRegisterItems} icon={<HardDrive className="h-5 w-5 mr-2 text-purple-500" />} />
                            <InfoCard title={t.inventoryTitle} items={[t.inventoryDesc]} icon={<ShoppingCart className="h-5 w-5 mr-2 text-purple-500" />} />
                            <InfoCard title={t.debtPayablesTitle} items={[...t.debtPayablesItems, <div className='mt-3 p-3 text-yellow-800'><strong className='flex items-center'><Gavel className='h-4 w-4 mr-2' />{lang==='am'?'የቴምብር ቀረጥ ማስጠንቀቂያ':'Stamp Duty Warning'}:</strong> {t.stampDutyWarning}</div>]} icon={<ShieldCheck className="h-5 w-5 mr-2 text-purple-500" />} />
                        </div>
                    </AccordionItem>
                    
                    {/* Financial Statements */}
                     <Section title={t.financialStatementsTitle} icon={<FileSpreadsheet className="h-7 w-7 mr-3 text-green-600" />}>
                         <InfoCard title={lang==='am' ? "ዋና ዋና መግለጫዎች" : "Core Statements"} items={t.financialStatementsItems} icon={<FileSpreadsheet className="h-5 w-5 mr-2 text-green-500" />} />
                     </Section>
                    
                     {/* Simplified Accounting & Long-Term Contracts */}
                    <Section title={lang==='am' ? "ልዩ የአሰራር ዘዴዎች" : "Special Methods & Contracts"} icon={<Calculator className="h-7 w-7 mr-3 text-orange-600" />}>
                        <AccordionItem title={t.simplifiedAccountingTitle}>
                            <p>{t.simplifiedAccountingDesc}</p>
                            <ul className='list-decimal list-inside space-y-2 mt-3 pl-4'>
                                {t.simplifiedAccountingItems.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                             <p className='mt-3 p-3 text-blue-800'><strong>{t.mseNote}</strong></p>
                        </AccordionItem>
                        <AccordionItem title={t.longTermContractsTitle}>
                            <p>{t.longTermContractsDesc}</p>
                        </AccordionItem>
                    </Section>
                    <ChapterNavigation previous='/content/686e8e6523afc16ef4f670c6' next='/content/686e8e6623afc16ef4f670cc' lang={lang}/>
                </main>
                
                <footer className="text-center text-gray-600 text-sm p-3 border-t">
                    <p>{t.footer}</p>
                </footer>
            </div>
        </div>
    );
}

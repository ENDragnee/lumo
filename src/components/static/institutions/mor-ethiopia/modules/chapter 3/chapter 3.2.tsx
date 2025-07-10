// Suggested file path: /src/components/static/mor/WithholdingTaxRulesExplainedModule.tsx
'use client';

import { useState, ReactNode } from 'react';
import {
    Percent,
    Globe,
    Landmark,
    TrendingUp,
    Briefcase,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    Gavel,
    ShieldPlus,
    Coins,
    Users
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object ---
const content = {
    am: {
        moduleTitle: "ከተከፋይ ሂሳቦች ላይ ግብር ቀንሶ ስለማስቀረት ዝርዝር ደንቦች",
        langButton: "English",
        footer: "የታክስ ህግ ዕውቀት ለህግ አክባሪነት መሠረት ነው።",
        note: "ማስታወሻ",
        example: "ምሳሌ",
        rule: "ደንብ",

        // Employment
        employmentTitle: "2.1 ከመቀጠር ከሚገኝ ገቢ ላይ ግብርን ቀንሶ ስለማስቀረት",
        employerDuty: "ማንኛውም ቀጣሪ ለሰራተኛው ከመቀጠር የሚገኝ ገቢ ሲከፍል፣ ከጠቅላላ ክፍያው (ደመወዝ፣ ከታክስ ነፃ ያልሆኑ አበሎች፣ እና በዓይነት የሚገኙ ጥቅማጥቅሞች) ላይ ከ10% እስከ 35% ባለው ተንሸራታች መጣኔ መሰረት ግብር ቀንሶ የማስቀረት እና ለባለስልጣኑ ገቢ የማድረግ ግዴታ አለበት።",
        selfWithholdingTitle: "ከራስ ገቢ ላይ ግብር ቀንሶ ስለመያዝ (Self-Withholding)",
        selfWithholdingRule: "በዓለም አቀፍ ድርጅት፣ በውጭ ኤምባሲ፣ ወይም ግብር ቀንሶ የማስቀረት ግዴታ በሌለበት ሌላ ቀጣሪ ተቀጥሮ የሚሰራ ሰው፣ ከሚቀበለው ገቢ ላይ ግብር ቀንሶ የመያዝና የማሳወቅ ግዴታ አለበት።",

        // Non-Resident Rates
        nonResidentRatesTitle: "2.2 በኢትዮጵያ ነዋሪ ላልሆነ ሰው/ድርጅት የሚከፈል ግብር መጣኔ",
        nonResidentRates: [
            { item: "ከመድን አረቦንና ከሮያሊቲ ጠቅላላ ክፍያ ላይ", rate: "5%" },
            { item: "ከትርፍ ድርሻና ከወለድ ጠቅላላ ገቢ ላይ", rate: "10%" },
            { item: "ከስራ አመራር ክፍያና ከቴክኒክ አገልግሎት ጠቅላላ ክፍያ ላይ", rate: "15%" },
            { item: "የመዝናኛ አገልግሎት ሰጪዎች ግብር", rate: "10%" },
            { item: "የዓለም አቀፍ አየር ትራንስፖርት ድርጅቶች ግብር", rate: "3%" },
            { item: "የማዕድንና ፔትሮሊየም ገቢ ግብር", rate: "25%" },
        ],
        
        // Resident Rates
        residentRatesTitle: "2.3 በኢትዮጵያ ነዋሪ ለሆኑ ወይም በቋሚነት ለሚሰሩ ድርጅቶች",
        residentRates: [
            { item: "ሮያሊቲ", rate: "5%" },
            { item: "የትርፍ ድርሻ", rate: "10%" },
            { item: "ከተቀማጭ ገንዘብ ወለድ ግብር", rate: "5%" },
            { item: "ከሌላ ማናቸውም ሁኔታ ከሚገኝ ወለድ ግብር", rate: "10%" },
            { item: "ከዕድል ሙከራ የሚገኝ ገቢ ግብር", rate: "15%" },
            { item: "ሀብትን አልፎ አልፎ በማከራየት የሚገኝ ገቢ (መሬት፣ ቤት፣ ተንቀሳቃሽ ሀብት)", rate: "15%" },
        ],
        
        // Capital Gains Tax
        capitalGainsSectionTitle: "የካፒታል ሀብቶችን በማስተላለፍ በሚገኝ ጥቅም ላይ የሚጣል ግብር",
        capitalGainsRatesTitle: "የካፒታል ጥቅም ግብር መጣኔዎች",
        capitalGainsRates: [
            { item: "ምድብ 'ሀ' (የማይንቀሳቀስ ሀብት - ህንጻ፣ መሬት ወዘተ)", rate: "15%" },
            { item: "ምድብ 'ለ' (አክሲዮን ወይም ቦንድ)", rate: "30%" }
        ],
        capitalGainsFormulaExplainedTitle: "የካፒታል ጥቅም ስሌት በቀላል አገላለጽ",
        capitalGainsFormulaIntro: "አንድን ንብረት (ለምሳሌ ህንጻ ወይም አክሲዮን) ስንሸጥ የምናገኘውን ትርፍ ለሁለት እንከፍለዋለን። አንደኛው ክፍል 'የካፒታል ጥቅም' ተብሎ ለብቻው ግብር ይከፈልበታል፤ ሁለተኛው ክፍል ደግሞ ከመደበኛ የንግድ ወይም የኪራይ ስራችን ጋር ተደምሮ ይታሰባል። ይህንን ለመለየት የሚከተለውን ቀላል ስሌት እንጠቀማለን።",
        
        formulaStep1Title: "ደረጃ 1: ጠቅላላ ትርፍን መለየት",
        formulaStep1: "በመጀመሪያ ንብረቱን ከሸጥንበት ዋጋ ላይ ስንገዛው ያወጣነውን ወጪ እንቀንሳለን። ይህ 'ጠቅላላ ትርፍ' ይሰጠናል።",
        formulaStep1Calc: "ጠቅላላ ትርፍ = የተሸጠበት ዋጋ (ሀ) - የተገዛበት ዋጋ (ለ)",
        
        formulaStep2Title: "ደረጃ 2: የእርጅና ቅናሽ ልዩነትን መለየት (ለህንጻና መሳርያዎች)",
        formulaStep2: "በሂሳብ መዝገብ ላይ በየአመቱ ለንብረቱ 'የእርጅና ቅናሽ' እናደርጋለን። ይህንን ቅናሽ ከመደበኛ ገቢያችን ላይ ስንቀንስ ቆይተናል። ስለዚህ፣ ትርፉ ሲሰላ ይህ የተቀነሰው የእርጅና መጠን ተመልሶ ከመደበኛ የንግድ ወይም ኪራይ ገቢ ጋር መደመር አለበት።",
        formulaStep2Calc: "ከመደበኛ ገቢ ጋር የሚደመረው ክፍል (ሠ) = የተገዛበት ዋጋ (ለ) - አሁን ያለው የመዝገብ ዋጋ (ሐ)",

        formulaStep3Title: "ደረጃ 3: ለካፒታል ጥቅም ግብር የሚሆነውን ትርፍ መለየት",
        formulaStep3: "ከጠቅላላው ትርፍ ላይ የእርጅና ቅናሽ ልዩነቱን እና የግሽበት ማስተካከያውን ስንቀንስ የምናገኘው ውጤት 'የካፒታል ጥቅም' ይባላል። ግብር የሚከፈለው በዚህ ላይ ነው።",
        formulaStep3Calc: "የካፒታል ጥቅም (ረ) = ጠቅላላ ትርፍ - (የእርጅና ቅናሽ ልዩነት (ሠ) + የግሽበት ማስተካከያ (መ))",
        
        formulaSimplifiedTitle: "የህጉ ቀመር ማብራሪያ (ረ = ሀ - (ለ + መ) እና ሠ = ለ - ሐ)",
        formulaKeys: {
            title: "የቀመር ቁልፍ ቃላት:",
            keys: [
                { key: "ሀ", value: "የሽያጭ ዋጋ (Consideration Received): ንብረቱን የሸጥንበት ጠቅላላ ገንዘብ።" },
                { key: "ለ", value: "የግዢ ዋጋ (Cost of Asset): ንብረቱን ስንገዛው ያወጣነው የመጀመሪያ ወጪ እና ለማሻሻል ያወጣነውን ወጪ ይጨምራል።" },
                { key: "ሐ", value: "የተጣራ የመዝገብ ዋጋ (Net Book Value): ንብረቱ በሂሳብ መዝገባችን ላይ ያለው የአሁኑ ዋጋ (የግዢ ዋጋ ሲቀነስ የተጠራቀመ የእርጅና ቅናሽ)።" },
                { key: "መ", value: "የግሽበት ማስተካከያ (Inflation Adjustment): ገንዘብ በጊዜ ሂደት ስለሚቀንስ፣ ይህ ማስተካከያ የግዢ ዋጋችንን ከአሁኑ የገንዘብ ዋጋ ጋር ያመዛዝናል።" },
                { key: "ሠ", value: "ከመደበኛ ገቢ ጋር የሚደመር/የሚቀነስ ክፍል፡ ቀደም ሲል በእርጅና ቅናሽ መልክ የተቀነሰውን ወጪ የሚወክል ነው። ይህ ክፍል ወደ መደበኛ የንግድ ወይም የኪራይ ገቢ ተመልሶ ይደመራል።" },
                { key: "ረ", value: "ግብር የሚከፈልበት የካፒታል ጥቅም (Taxable Capital Gain): ከላይ ያሉትን ስሌቶች ካጠናቀቅን በኋላ ለብቻው በ15% ወይም በ30% ግብር የሚከፈልበት የተጣራ ትርፍ ነው።" }
            ]
        },
        evidenceTitle: "ለካፒታል ጥቅም ስሌት የሚያስፈልጉ ማስረጃዎች",
        evidenceItems: [
            "የሂሳብ መዝገብ ለሚይዝ: የሀብቱን ግዢ ዋጋ፣ የግዢ ጊዜ፣ እና የተጠራቀመ የእርጅና ቅናሽ የሚያሳይ ሰነድ።",
            "የሂሳብ መዝገብ ለማይይዝ: በባለሙያ የተገመተ የግዢ ዋጋ። ይህ ከሌለ ወጪው 'ዜሮ' ተደርጎ ይወሰዳል።",
            "የሽያጭ ውል: በሰነዶች ማረጋገጫ የጸደቀ እና ዋጋው ከገበያ ዋጋ ጋር ተመጣጣኝ የሆነ።"
        ],
        
        // Undistributed Profits
        undistributedProfitsSectionTitle: "2.4 ባልተከፋፈለ ትርፍ ላይ የሚጣል ግብር",
        undistributedProfitsRule: "አንድ ድርጅት ካገኘው የተጣራ ትርፍ ላይ ግብር ከከፈለ በኋላ፣ ትርፉን ለባለአክሲዮኖች ካላከፋፈለ ወይም ካፒታሉን ለማሳደግ ካላዋለው፣ ባልተከፋፈለው ትርፍ ላይ 10% ግብር ይከፍላል።",
        exemptionCondition: "ድርጅቱ የሂሳብ ጊዜው ካለቀ በኋላ ባሉት 12 ወራት ውስጥ ትርፉን ተጠቅሞ ካፒታሉን ካሳደገ፣ ከዚህ ግብር ነጻ ይሆናል።",
        filingDeadline: "ባልተከፋፈለ ትርፍ ላይ የሚከፈለውን ግብር፣ የ12 ወሩ ጊዜ ካለቀ በኋላ ባሉት ሁለት ወራት ውስጥ አስታውቆ መክፈል አለበት።",
        evidenceForExemption: "ከግብር ነጻ ለመሆን፣ የካፒታል ማደጉን ከንግድና ኢንዱስትሪ ሚኒስቴር ወይም ከሌላ አግባብነት ያለው አካል ማስረጃ ማቅረብ ያስፈልጋል።",
        consequencesTitle: "ያለመታዘዝ ውጤት",
        consequences: [
            "በጊዜው ግብሩን ያላስታወቀና ያልከፈለ ድርጅት፣ ከፍሬ ግብሩ በተጨማሪ አስተዳደራዊ መቀጫና ወለድ ይጣልበታል።",
            "ካፒታሉን አሳድጎ ነገር ግን በህጉ መሰረት ያላስታወቀ ድርጅት፣ ለእያንዳንዱ የዘገየበት የታክስ ጊዜ ብር 10,000 አስተዳደራዊ መቀጫ ብቻ ይጣልበታል።"
        ],
        
        // Special Entities
        specialEntitiesTitle: "የልዩ አካላት አያያዝ",
        taxHolidayEntity: "በግብር እፎይታ ላይ ያለ ድርጅት ያገኘውን ትርፍ ካላከፋፈለ ወይም ካፒታሉን ካላሳደገ፣ 10% ባልተከፋፈለ ትርፍ ላይ ግብር የመክፈል ግዴታ አለበት።",
        cooperatives: "የህብረት ሥራ ማህበራት ከትርፋቸው 30% ለካፒታል ማሳደጊያ ካዋሉ በኋላ ለግለሰብ ላልሆኑ አባላት የሚያከፋፍሉት የትርፍ ድርሻ ከግብር ነጻ ነው። ለግለሰብ አባላት የሚከፈለው ግን የትርፍ ድርሻ ግብር ይከፈልበታል።",

        // Other Withholding
        otherWithholdingTitle: "ሌሎች የታክስ አይነቶች",
        repatriatedProfit: "በቋሚነት ኢትዮጵያ ውስጥ የሚሰራ ድርጅት ለውጭ ባለቤቱ ከሚልከው ትርፍ ላይ 10% ግብር ይከፈላል።",
        exemptIncomeRule: "በሌሎች ሰንጠረዦች (ሀ, ለ, ሐ, መ) መሰረት ከገቢ ግብር ነጻ የሆነ ማንኛውም ገቢ ያገኘ ሰው፣ በጠቅላላ ገቢው ላይ 15% ግብር የመክፈል ግዴታ አለበት (ይህ ለየት ያሉ ሁኔታዎችን ይመለከታል)።"
    },
    en: {
        moduleTitle: "Detailed Rules on Withholding Tax from Payable Accounts",
        langButton: "አማርኛ",
        footer: "Knowledge of tax law is the foundation for compliance.",
        note: "Note",
        example: "Example",
        rule: "Rule",

        // Employment
        employmentTitle: "2.1 Withholding Tax from Employment Income",
        employerDuty: "Any employer, when paying employment income, must withhold tax from the total payment (salary, non-exempt allowances, benefits in kind) based on the progressive rates from 10% to 35% and remit it to the authority.",
        selfWithholdingTitle: "Self-Withholding from Own Income",
        selfWithholdingRule: "A person employed by an international organization, a foreign embassy, or any other employer not obligated to withhold tax, has the duty to self-withhold tax from their income and declare it.",

        // Non-Resident Rates
        nonResidentRatesTitle: "2.2 Tax Rates for Payments to Non-Residents",
        nonResidentRates: [
            { item: "From gross payments for insurance premiums and royalties", rate: "5%" },
            { item: "From gross income from dividends and interest", rate: "10%" },
            { item: "From gross payments for management and technical service fees", rate: "15%" },
            { item: "Tax on entertainment service providers", rate: "10%" },
            { item: "Tax on international air transport organizations", rate: "3%" },
            { item: "Income tax on mining and petroleum operations", rate: "25%" },
        ],
        
        // Resident Rates
        residentRatesTitle: "2.3 Withholding for Residents or Permanent Establishments",
        residentRates: [
            { item: "Royalty", rate: "5%" },
            { item: "Dividend", rate: "10%" },
            { item: "Interest on deposits", rate: "5%" },
            { item: "Interest from any other source", rate: "10%" },
            { item: "Income from games of chance (lotteries, etc.)", rate: "15%" },
            { item: "Income from casual rental of assets (land, building, movable property)", rate: "15%" },
        ],
        
        // Capital Gains Tax
        capitalGainsSectionTitle: "Tax on Gain from Transfer of Capital Assets",
        capitalGainsRatesTitle: "Capital Gains Tax Rates",
        capitalGainsRates: [
            { item: "Category 'A' (Immovable assets - buildings, land, etc.)", rate: "15%" },
            { item: "Category 'B' (Shares or bonds)", rate: "30%" }
        ],
        capitalGainsFormulaExplainedTitle: "Explaining the Capital Gains Formula Simply",
        capitalGainsFormulaIntro: "When we sell an asset (like a building or shares), we split the profit into two parts. One part is called 'Capital Gain' and is taxed separately. The other part is combined with our regular business or rental income. We use the following simple calculation to separate them.",
        
        formulaStep1Title: "Step 1: Identify the Total Profit",
        formulaStep1: "First, we subtract the original purchase cost from the selling price. This gives us the 'Total Profit'.",
        formulaStep1Calc: "Total Profit = Selling Price (A) - Purchase Cost (B)",
        
        formulaStep2Title: "Step 2: Identify the Depreciation Difference (for buildings, equipment etc.)",
        formulaStep2: "On our books, we have been taking 'depreciation' on the asset each year. This depreciation was deducted from our regular income. Therefore, when calculating the profit, this previously deducted depreciation amount must be added back to our regular business or rental income.",
        formulaStep2Calc: "Amount to be added to regular income (E) = Purchase Cost (B) - Current Book Value (C)",

        formulaStep3Title: "Step 3: Identify the Profit Subject to Capital Gains Tax",
        formulaStep3: "When we subtract the depreciation difference and an inflation adjustment from the Total Profit, the result is the 'Capital Gain'. This is the amount that gets taxed separately.",
        formulaStep3Calc: "Capital Gain (F) = Total Profit - (Depreciation Difference (E) + Inflation Adjustment (D))",

        formulaSimplifiedTitle: "The Law's Formula Explained (F = A - (B + D) and E = B - C)",
        formulaKeys: {
            title: "Key to the Formula:",
            keys: [
                { key: "A", value: "Consideration Received: The total amount of money for which the asset was sold." },
                { key: "B", value: "Cost of Asset: The original cost to acquire the asset, including any improvement costs." },
                { key: "C", value: "Net Book Value: The current value of the asset on the accounting books (Cost minus accumulated depreciation)." },
                { key: "D", value: "Inflation Adjustment: Since money loses value over time, this adjustment balances the original cost against today's money value." },
                { key: "E", value: "Amount to be added/subtracted from regular income: This represents the total depreciation that was previously deducted. This amount is added back to the regular business or rental income." },
                { key: "F", value: "Taxable Capital Gain: After all calculations, this is the net profit that is taxed separately at 15% or 30%." }
            ]
        },
        evidenceTitle: "Evidence Required for Capital Gains Calculation",
        evidenceItems: [
            "For a taxpayer who keeps books: Documents showing the asset's cost, acquisition date, and accumulated depreciation.",
            "For a taxpayer who does not keep books: An appraised value of the acquisition cost from an expert. Without this, the cost is considered 'zero'.",
            "Sales Contract: Authenticated by the relevant authority and with a price comparable to market value."
        ],
        
        // Undistributed Profits
        undistributedProfitsSectionTitle: "2.4 Tax on Undistributed Profits",
        undistributedProfitsRule: "An entity is subject to a 10% tax on its after-tax net profit if it is not distributed to shareholders or reinvested to increase its capital.",
        exemptionCondition: "The entity is exempt if, within 12 months after its accounting period ends, it uses the profit to increase its capital or its members' share value.",
        filingDeadline: "The tax on undistributed profits must be declared and paid within two months after the end of the 12-month period.",
        evidenceForExemption: "To be exempt, proof of capital increase from the Ministry of Trade and Industry or another relevant body is required.",
        consequencesTitle: "Consequences of Non-Compliance",
        consequences: [
            "Failure to declare and pay the tax on time results in administrative penalties and interest in addition to the principal tax.",
            "An entity that increases capital but fails to notify the authority as required will only be subject to an administrative penalty of 10,000 ETB for each delayed tax period."
        ],
        
        // Special Entities
        specialEntitiesTitle: "Treatment of Special Entities",
        taxHolidayEntity: "An entity in a tax holiday period is still obligated to pay the 10% tax on undistributed profits if it does not distribute them or use them to increase capital.",
        cooperatives: "A cooperative society, after setting aside 30% of its profit for capital increase, can distribute dividends to non-individual members tax-free. Dividends paid to individual members are subject to dividend tax.",

        // Other Withholding
        otherWithholdingTitle: "Other Tax Types",
        repatriatedProfit: "A permanent establishment in Ethiopia pays 10% tax on profits repatriated to its foreign head office.",
        exemptIncomeRule: "A person who earns income that is exempt from income tax under Schedules A, B, C, or D is obligated to pay 15% tax on that gross income (this applies to specific, exceptional cases)."
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

const RateTable = ({ title, items, icon }: { title: string, items: { item: string, rate: string }[], icon: ReactNode }) => (
    <div className="p-2 h-full">
        <h3 className="font-semibold text-xl text-gray-800 flex items-center mb-3">{icon}{title}</h3>
        <div className="space-y-2">
            {items.map((row, i) => (
                <div key={i} className="flex justify-between items-center p-2">
                    <span className="text-base text-gray-700 flex-1 mr-2">{row.item}</span>
                    <span className="font-bold text-blue-600 px-3 py-1 text-base">{row.rate}</span>
                </div>
            ))}
        </div>
    </div>
);


// --- Main Component ---
export default function WithholdingTaxRulesExplainedModule() {
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
                    {/* Employment Tax */}
                    <Section title={t.employmentTitle} icon={<Briefcase className="h-7 w-7 mr-3 text-indigo-600" />}>
                        <p className="text-lg">{t.employerDuty}</p>
                        <div className="mt-4 p-3">
                             <h4 className="font-semibold text-indigo-800 flex items-center mb-2 text-xl"><Users className="h-5 w-5 mr-2" />{t.selfWithholdingTitle}</h4>
                            <p className="text-indigo-700 text-lg">{t.selfWithholdingRule}</p>
                        </div>
                    </Section>

                    {/* Withholding Rates */}
                    <div className="grid lg:grid-cols-2 gap-4 mb-8">
                        <RateTable title={t.nonResidentRatesTitle} items={t.nonResidentRates} icon={<Globe className="h-6 w-6 mr-2 text-blue-600" />} />
                        <RateTable title={t.residentRatesTitle} items={t.residentRates} icon={<Landmark className="h-6 w-6 mr-2 text-blue-600" />} />
                    </div>

                    {/* Capital Gains */}
                    <Section title={t.capitalGainsSectionTitle} icon={<TrendingUp className="h-7 w-7 mr-3 text-green-600" />}>
                         <RateTable title={t.capitalGainsRatesTitle} items={t.capitalGainsRates} icon={<Percent className="h-6 w-6 mr-2 text-green-600" />} />
                         <AccordionItem title={t.capitalGainsFormulaExplainedTitle} defaultOpen={true}>
                             <p className='mb-4 text-lg'>{t.capitalGainsFormulaIntro}</p>
                             <div className="space-y-3 p-2 sm:p-4">
                                 <div>
                                    <h4 className="font-semibold text-gray-700 text-xl">{t.formulaStep1Title}</h4>
                                    <p className="text-base">{t.formulaStep1}</p>
                                    <code className="block mt-1 p-2 text-base sm:text-lg">{t.formulaStep1Calc}</code>
                                 </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-700 text-xl">{t.formulaStep2Title}</h4>
                                    <p className="text-base">{t.formulaStep2}</p>
                                     <code className="block mt-1 p-2 text-base sm:text-lg">{t.formulaStep2Calc}</code>
                                 </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-700 text-xl">{t.formulaStep3Title}</h4>
                                    <p className="text-base">{t.formulaStep3}</p>
                                     <code className="block mt-1 p-2 text-base sm:text-lg">{t.formulaStep3Calc}</code>
                                 </div>
                             </div>
                         </AccordionItem>
                         <AccordionItem title={t.formulaSimplifiedTitle}>
                              <ul className="space-y-2 mt-2 text-base sm:text-lg">
                                {t.formulaKeys.keys.map(k => <li key={k.key}><strong className="font-mono text-blue-700 text-xl mr-2">{k.key}</strong> {k.value}</li>)}
                             </ul>
                         </AccordionItem>
                         <AccordionItem title={t.evidenceTitle}>
                             <ul className="list-disc list-inside space-y-2 pl-2 text-lg">
                                {t.evidenceItems.map((item, i) => <li key={i}>{item}</li>)}
                             </ul>
                         </AccordionItem>
                    </Section>
                    
                     {/* Undistributed Profits */}
                     <Section title={t.undistributedProfitsSectionTitle} icon={<Coins className="h-7 w-7 mr-3 text-yellow-600" />}>
                         <p className="text-lg sm:text-xl">{t.undistributedProfitsRule}</p>
                         <div className="mt-4 p-3 text-green-800">
                             <h4 className="font-bold flex items-center text-xl"><ShieldPlus className="h-5 w-5 mr-2" />{lang === 'am' ? 'ከግብር ነጻ የሚሆንበት ሁኔታ' : 'Condition for Exemption'}</h4>
                             <p className="mt-1 text-lg">{t.exemptionCondition}</p>
                         </div>
                         <p className="mt-4 text-lg"><strong>{lang === 'am' ? 'የማስታወቂያ ጊዜ፡' : 'Filing Deadline:'}</strong> {t.filingDeadline}</p>
                         <AccordionItem title={t.consequencesTitle}>
                             <ul className="list-disc list-inside space-y-2 pl-2 text-lg">
                                {t.consequences.map((item, i) => <li key={i}>{item}</li>)}
                             </ul>
                         </AccordionItem>
                     </Section>

                      {/* Special Entities & Other */}
                      <Section title={lang==='am'?'ሌሎች ልዩ ደንቦች':'Other Special Rules'} icon={<Gavel className="h-7 w-7 mr-3 text-gray-600" />}>
                        <AccordionItem title={t.specialEntitiesTitle}>
                            <p className="text-lg"><strong>{lang==='am'?'የግብር እፎይታ፡':'Tax Holiday:'}</strong> {t.taxHolidayEntity}</p>
                            <p className="mt-2 text-lg"><strong>{lang==='am'?'የህብረት ስራ ማህበራት፡':'Cooperatives:'}</strong> {t.cooperatives}</p>
                        </AccordionItem>
                         <AccordionItem title={t.otherWithholdingTitle}>
                            <p className="text-lg"><strong>{lang==='am'?'የሚላክ ትርፍ፡':'Repatriated Profit:'}</strong> {t.repatriatedProfit}</p>
                            <p className="mt-2 text-lg"><strong>{lang==='am'?'ከግብር ነጻ የሆነ ገቢ፡':'Exempt Income:'}</strong> {t.exemptIncomeRule}</p>
                        </AccordionItem>
                      </Section>
                      <ChapterNavigation previous='/content/686e8e6723afc16ef4f670d8' next='/content/686e8e6723afc16ef4f670de' lang={lang} />
                </main>
                
                <footer className="text-center text-gray-600 text-sm p-3 border-t">
                    <p>{t.footer}</p>
                </footer>
            </div>
        </div>
    );
}

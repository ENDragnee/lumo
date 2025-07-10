'use client';

import { useState, ReactNode } from 'react';
import {
    Globe,
    Handshake,
    Scale,
    ShieldBan,
    PowerOff,
    Link,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    Gavel,
    TrendingDown,
    TrendingUp,
    Info
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';  

// --- i18n Content Object ---
const content = {
    am: {
        title: "ዓለም አቀፍ ግብር፣ ስምምነቶች እና ልዩ የአሰራር ደንቦች",
        langButton: "English",
        footer: "የታክስ ህግ ዕውቀት ለህግ አክባሪነት መሠረት ነው።",

        internationalTaxTitle: "ዓለም አቀፍ ግብር (International Tax)",
        foreignTaxCreditTitle: "የውጭ ሀገር ታክስ ማካካሻ (Foreign Tax Credit)",
        foreignTaxCreditRules: [
            "በኢትዮጵያ ነዋሪ የሆነ ሰው በውጭ ሀገር ከንግድ ስራ ገቢ አግኝቶ ግብር ከከፈለ፣ በውጭ ሀገር የከፈለው ግብር እዚህ ከሚከፍለው ላይ እንዲካካስለት ይደረጋል።",
            "የሚካካሰው የታክስ መጠን ከሁለቱ ዝቅተኛውን ይበልጥ አይችልም፡ 1) በውጭ ሀገር የተከፈለው ትክክለኛ ግብር፣ ወይም 2) በዚያው ገቢ ላይ በኢትዮጵያ ህግ መሰረት የሚከፈለው ግብር።",
            "ማካካሻው የሚፈቀደው ግብር ከፋዩ ገቢው ከተገኘበት የግብር ዓመት ቀጥሎ ባሉት ሁለት ዓመታት ውስጥ ግብሩን ከፍሎ ሲያረጋግጥ ነው።"
        ],
        foreignLossesTitle: "የውጭ ሀገር የንግድ ስራ ኪሳራዎች",
        foreignLossesRule: "ከውጭ ሀገር የንግድ ስራ ገቢን ለማግኘት የወጣ ወጪ ተቀናሽ የሚደረገው ከውጭ ሀገር ገቢ ላይ ብቻ ነው። በውጭ ሀገር ያጋጠመን ኪሳራ ከውጭ በሚገኝ ገቢ ላይ ብቻ እስከ 5 ዓመት ድረስ በማካካስ ማሸጋገር ይቻላል።",

        taxTreatiesTitle: "የግብር ስምምነቶች (Tax Treaties)",
        taxTreatiesPurpose: "'የግብር ስምምነት' ማለት ተደራራቢ ግብርን ለማስቀረት እና ሆን ተብሎ የሚደረግን የግብር ስወራ (Tax Evasion) ለመከላከል የሚደረግ ዓለም አቀፍ ስምምነት ነው።",
        treatyPrecedenceRule: "በኢትዮጵያ ህግ እና በግብር ስምምነቱ መካከል አለመጣጣም ከተፈጠረ፣ የስምምነቱ ድንጋጌ ተፈጻሚነት ይኖረዋል።",
        treatyLimitationTitle: "ልዩ ገደብ (Anti-Abuse Rule)",
        treatyLimitation: "ይሁንና፣ በስምምነቱ ተጠቃሚ ለመሆን ብቻ የተቋቋመ እና በሌላ ሀገር ነዋሪ ከ50% በላይ ባለቤትነት የተያዘበት ድርጅት፣ የታክስ ነጻ መብትን ወይም የተቀነሰ የታክስ መጣኔን መጠቀም አይችልም።",

        currencyConversionTitle: "የገንዘብ ምንዛሬ",
        currencyConversionRules: [
            "በውጭ ምንዛሪ የተፈጸሙ ሁሉም ግብይቶች (ገቢም ሆነ ወጪ) በብር መገለጽ አለባቸው።",
            "ልወጣው መካሄድ ያለበት፣ ግብይቱ በሂሳብ መዝገብ በሚመዘገብበት ቀን በኢትዮጵያ ብሄራዊ ባንክ በነበረው ይፋዊ የምንዛሬ ተመን መሰረት ነው።",
            "ባለስልጣኑ ከምንዛሬ የሚገኝ ትርፍና ኪሳራ የሚሰላበትን ዝርዝር መመሪያ ያወጣል።"
        ],

        antiAvoidanceTitle: "ከግብር ለመሸሽ የሚደረጉ ጥረቶችን መከላከል",
        antiAvoidanceIntro: "ባለስልጣኑ የታክስ መሰረቱን ለመጠበቅ የሚከተሉትን እርምጃዎች ሊወስድ ይችላል፡",
        antiAvoidanceSchemes: {
            title: "የተለመዱ ዘዴዎች",
            items: [
                "ገቢን መከፋፈል (Income Splitting): ታክስን ለመቀነስ ገቢን ዝቅተኛ ታክስ በሚከፍሉ ተዛማጅ ወገኖች መካከል መከፋፈል።",
                "የማሸጋገሪያ ዋጋ (Transfer Pricing): በተዛማጅ ኩባንያዎች መካከል በሚደረግ ግብይት ላይ ከገበያ ዋጋ ውጪ የሆነ ዋጋ በመጠቀም ትርፍን ወደ ዝቅተኛ ታክስ ቀጠና ማሸጋገር።"
            ]
        },
        armsLengthPrinciple: "የገበያ ዋጋ መርህ (Arm's Length Principle): በተዛማጅ ወገኖች መካከል የተደረገ ግብይት በገበያ ዋጋ መርህ ያልተመራ ሆኖ ከተገኘ፣ ባለስልጣኑ ትክክለኛውን የገበያ ዋጋ መሰረት በማድረግ ገቢን፣ ጥቅምን፣ ወይም ኪሳራን እንደገና ሊደለድል ይችላል።",
        youtubeLink: "https://www.youtube.com/watch?v=fc8zAuMjtuc",

        businessCessationTitle: "የንግድ ስራ ከተቋረጠ በኋላ ስለሚገኝ ገቢ",
        cessationIntro: "አንድ የንግድ ስራ ከተቋረጠ በኋላ በእጅ ላይ ያሉ ንብረቶች ሲሸጡ ግብር የሚከፈልበት ሁኔታ እንደሚከተለው ነው፡",
        cessationRules: [
            "የተሸጠበትን ዋጋ ማረጋገጥ ካልተቻለ፣ እቃው የተገዛበት ዋጋ እንደ ሽያጭ ዋጋ ተወስዶ ግብሩ ይወሰናል።",
            "ለሌላ መዝገብ ለሚይዝ ግብር ከፋይ ከተሸጠ፣ ገዢው በሚያዘጋጀው የግዥ ማረጋገጫ ሰነድ (Purchase Voucher) መሰረት ዋጋው ይወሰናል።",
            "የመጨረሻ ሽያጭ ዋጋ ከታወቀ፣ ታክሱ የሚሰላው ከተሸጠበት ዋጋ ላይ የንብረቱ የመዝገብ ዋጋ (Book Value) ተቀንሶ በሚገኘው ልዩነት ላይ ነው።",
            "ግብር ከፋዩ ንግድ ካቋረጠ በኋላ እቃ ሲሸጥ የተርን ኦቨር ታክስ (TOT) ሰብስቦ የመክፈል ግዴታ አለበት።",
            "ድርጅቱን ሲዘጋ በእጁ ያሉትን እቃዎች ዝርዝር ቆጥሮ ለታክስ ባለስልጣኑ ማሳወቅ አለበት።"
        ]
    },
    en: {
        title: "International Tax, Treaties, and Special Procedural Rules",
        langButton: "አማርኛ",
        footer: "Knowledge of tax law is the foundation for compliance.",

        internationalTaxTitle: "International Tax",
        foreignTaxCreditTitle: "Foreign Tax Credit",
        foreignTaxCreditRules: [
            "A resident of Ethiopia who has paid tax on foreign-source business income is entitled to a tax credit.",
            "The credit cannot exceed the lesser of: 1) The actual foreign tax paid, or 2) The Ethiopian tax payable on that same income.",
            "The credit is allowed only if the taxpayer substantiates the payment of foreign tax within two years following the end of the tax year in which the income was derived."
        ],
        foreignLossesTitle: "Foreign Business Losses",
        foreignLossesRule: "Expenses incurred in deriving foreign-source business income are deductible only against foreign-source income. A loss from foreign operations can be carried forward for up to 5 years and offset only against future foreign-source income.",

        taxTreatiesTitle: "Tax Treaties",
        taxTreatiesPurpose: "A 'tax treaty' is an international agreement designed to avoid double taxation and prevent tax evasion.",
        treatyPrecedenceRule: "If there is a conflict between Ethiopian law and a tax treaty, the provisions of the treaty shall have effect.",
        treatyLimitationTitle: "Special Limitation (Anti-Abuse Rule)",
        treatyLimitation: "However, an entity that is majority-owned (more than 50%) by a non-resident and established primarily to benefit from the treaty cannot claim tax exemptions or reduced tax rates provided by it.",

        currencyConversionTitle: "Currency Conversion",
        currencyConversionRules: [
            "All transactions (income or expenses) conducted in a foreign currency must be stated in Ethiopian Birr.",
            "The conversion must be made using the official exchange rate of the National Bank of Ethiopia on the date the transaction is recorded in the books of account.",
            "The Authority will issue a directive on how to calculate gains and losses from currency exchange."
        ],

        antiAvoidanceTitle: "Preventing Tax Avoidance",
        antiAvoidanceIntro: "The Authority may take the following measures to protect the tax base:",
        antiAvoidanceSchemes: {
            title: "Common Schemes",
            items: [
                "Income Splitting: Dividing income among related parties in lower tax brackets to reduce the overall tax burden.",
                "Transfer Pricing: Using non-market prices in transactions between related companies to shift profits to low-tax jurisdictions."
            ]
        },
        armsLengthPrinciple: "Arm's Length Principle: If a transaction between related parties is not conducted at arm's length (market value), the Authority can re-allocate the income, benefits, or losses based on the correct market price.",
        youtubeLink: "https://www.youtube.com/watch?v=fc8zAuMjtuc",

        businessCessationTitle: "Income Earned After Cessation of Business",
        cessationIntro: "When assets on hand are sold after a business ceases operations, tax is imposed as follows:",
        cessationRules: [
            "If the selling price cannot be verified, the purchase price of the goods is treated as the sales price for tax purposes.",
            "If sold to another taxpayer who keeps records, the price is determined by the Purchase Voucher prepared by the buyer.",
            "If the final selling price is known, the tax is calculated on the difference between the selling price and the asset's Book Value.",
            "A taxpayer selling goods after ceasing business is obligated to collect and remit Turnover Tax (TOT).",
            "Upon closing the business, the taxpayer must conduct an inventory count of goods on hand and report it to the tax authority."
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
export default function InternationalAndSpecialRulesModule() {
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
                    {/* International Tax */}
                    <Section title={t.internationalTaxTitle} icon={<Globe className="h-7 w-7 mr-3 text-blue-600" />}>
                        <div className="grid lg:grid-cols-2 gap-4">
                            <InfoCard 
                                title={t.foreignTaxCreditTitle} 
                                items={t.foreignTaxCreditRules} 
                                icon={<TrendingUp className="h-6 w-6 mr-2 text-green-600" />}
                            />
                            <InfoCard 
                                title={t.foreignLossesTitle} 
                                items={[t.foreignLossesRule]}
                                icon={<TrendingDown className="h-6 w-6 mr-2 text-red-600" />}
                            />
                        </div>
                    </Section>

                    {/* Tax Treaties */}
                    <Section title={t.taxTreatiesTitle} icon={<Handshake className="h-7 w-7 mr-3 text-blue-600" />}>
                        <p>{t.taxTreatiesPurpose}</p>
                        <p className="mt-2">{t.treatyPrecedenceRule}</p>
                        <div className="mt-4 p-3 text-red-800">
                            <h4 className="font-bold flex items-center"><Gavel className="h-5 w-5 mr-2" />{t.treatyLimitationTitle}</h4>
                            <p className="mt-1">{t.treatyLimitation}</p>
                        </div>
                    </Section>

                    {/* Currency Conversion */}
                     <Section title={t.currencyConversionTitle} icon={<Scale className="h-7 w-7 mr-3 text-blue-600" />}>
                         <InfoCard 
                            title={lang === 'am' ? "የልወጣ ደንቦች" : "Conversion Rules"}
                            items={t.currencyConversionRules}
                            icon={<Info className="h-5 w-5 mr-2 text-indigo-500" />}
                        />
                     </Section>

                    {/* Anti-Avoidance */}
                    <Section title={t.antiAvoidanceTitle} icon={<ShieldBan className="h-7 w-7 mr-3 text-blue-600" />}>
                         <AccordionItem title={lang === 'am' ? "ዝርዝር ደንቦችን ለማየት ይጫኑ" : "Click to see detailed rules"}>
                            <p className="mb-4">{t.antiAvoidanceIntro}</p>
                            <div className="p-3 mb-4">
                                <h4 className="font-semibold text-lg">{t.antiAvoidanceSchemes.title}</h4>
                                <ul className="list-decimal list-inside space-y-2 mt-2 pl-2">
                                    {t.antiAvoidanceSchemes.items.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div className="p-3 text-yellow-800">
                                <h4 className="font-bold">{t.armsLengthPrinciple}</h4>
                            </div>
                            <div className="text-center mt-4">
                                <a href={t.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 inline-flex items-center font-semibold">
                                    <Link className="h-4 w-4 mr-2" />
                                    {lang === 'am' ? 'ተጨማሪ መረጃ በቪዲዮ' : 'Watch Video for More Info'}
                                </a>
                            </div>
                         </AccordionItem>
                    </Section>

                    {/* Business Cessation */}
                    <Section title={t.businessCessationTitle} icon={<PowerOff className="h-7 w-7 mr-3 text-blue-600" />}>
                         <InfoCard 
                            title={lang === 'am' ? "የአፈጻጸም ደንቦች" : "Implementation Rules"}
                            intro={t.cessationIntro}
                            items={t.cessationRules}
                            icon={<Info className="h-5 w-5 mr-2 text-gray-500" />}
                        />
                    </Section>
                    <ChapterNavigation previous='/content/686e8e6623afc16ef4f670cf' next='/content/686e8e6623afc16ef4f670d5' lang={lang} />

                </main>
                
                <footer className="text-center text-gray-600 text-sm p-3 border-t">
                    <p>{t.footer}</p>
                </footer>
            </div>
        </div>
    );
}

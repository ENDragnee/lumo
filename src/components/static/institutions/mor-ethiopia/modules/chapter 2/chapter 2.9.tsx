'use client';

import { useState, ReactNode } from 'react';
import { Heart, TrendingDown, Building, Wrench, Video, BarChart2, Calculator, Info, RefreshCw, Play, GitCompareArrows, Lightbulb, FileText, Percent } from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object (1-to-1 with PDF slides 60-74, plus explanations) ---
const content = {
    am: {
        title: "ልዩ ተቀናሽ ወጪዎች: ስጦታ እና የእርጅና ቅናሽ",
        langButton: "English",

        donationSection: {
            title: "3.4.3. ለበጎ አድራጎት ዓላማ የተደረገ ስጦታ",
            rule: "ለበጎ አድራጎት ድርጅቶች ወይም ለተመሳሳይ ዓላማዎች የሚደረግ ስጦታ፣ ከግብር ከሚከፈልበት ገቢ ላይ እስከ 10% ድረስ ተቀናሽ ይደረጋል።",
            explanation: "ይህ ማለት አንድ ድርጅት ትርፉን ካሰላ በኋላ፣ ለተፈቀደለት የበጎ አድራጎት ተቋም ከሰጠ፣ የሰጠውን ገንዘብ (እስከ 10% የትርፉ) እንደ ወጪ በመቁጠር የሚከፍለውን ግብር ሊቀንስ ይችላል።"
        },

        depreciationSection: {
            title: "3.4.4. የተፈቀዱ የእርጅና ቅናሽ",
            intro: "ግብር ከፋዩ ገቢውን ለማስገኘት በግብር ዓመቱ ጥቅም ላይ ላዋሉ ዋጋቸው ለሚቀንስ ሀብቶች (Depreciable Assets) እና ግዙፋዊ ህልዎት ለሌላቸው የንግድ ሥራ ሀብቶች (Intangible Assets) የእርጅና ቅናሽ ማድረግ ይፈቀድለታል።",
            explanationTitle: "ይህ ምን ማለት ነው?",
            explanation: "ንግድዎ የሚጠቀምባቸው እንደ መኪና፣ ኮምፒውተር፣ ወይም ህንጻ ያሉ ንብረቶች በጊዜ ሂደት ያረጃሉ፤ ዋጋቸውም ይቀንሳል። ይህንን የዋጋ ቅናሽ 'የእርጅና ቅናሽ' እንለዋለን። መንግስት ይህንን የዋጋ ቅናሽ እንደ አመታዊ ወጪ እንድትቆጥሩት ይፈቅድልዎታል፤ ይህም የሚከፍሉትን ግብር ይቀንሳል።",
            depreciableAssetDef: {
                title: "“ዋጋው የሚቀንስ ሀብት” (Depreciable Asset) ማለት ምን ማለት ነው?",
                points: [
                    "ከአንድ ዓመት በላይ የሚያገለግል፤",
                    "በአገልግሎት ወይም በጊዜ ሂደት ዋጋው የሚቀንስ፤",
                    "እና ለንግድ ስራ ገቢ ለማግኘት ጥቅም ላይ የዋለ (እንደ ህንጻ፣ መኪና፣ ማሽን)።"
                ]
            },
            assetTransferRule: "አንድ ግብር ከፋይ ሙሉ የእርጅና ቅናሽ ተጠቅሞ የጨረሰበትን ሀብት ግንኙነት ላለው ሰው (ለምሳሌ በቤተሰብ ወይም በድርጅት ቁጥጥር) ካስተላለፈ፣ ተቀባዩ ሰው ለዚያ ሀብት ተጨማሪ የእርጅና ቅናሽ መጠየቅ አይችልም።",
            methodsTitle: "3.4.4.3. የእርጅና ቅናሽ ስሌት ዘዴዎች",
            methodsIntro: "የእርጅና ቅናሽን ለማስላት በዋናነት ሁለት ዘዴዎች አሉ፦",
            methods: ["ቀጥተኛ ዘዴ", "ዋጋው እየቀነሰ የሚሄድ ዘዴ"],
            youtubeLink: "https://www.youtube.com/watch?v=_pas1ETbrj8",
            youtubeText: "የቪዲዮ ማብራሪያ ይመልከቱ"
        },
        
        straightLineSection: {
            title: "3.4.4.4. ቀጥተኛ የእርጅና ቅናሽ ዘዴ (Straight-Line Method)",
            explanation: "ይህ ዘዴ የሀብቱን ጠቅላላ ዋጋ ለአገልግሎት ዘመኑ በእኩልነት በመክፈል በየአመቱ ተመሳሳይ መጠን ያለው የእርጅና ቅናሽ ያስችላል።",
            formula: "አመታዊ ቅናሽ = (የሀብቱ ዋጋ) / (የአገልግሎት ዘመን በአመት)",
            useCases: "በዚህ ዘዴ ብቻ መሰላት ያለባቸው:",
            items: ["ግዙፋዊ ህልዎት የሌላቸው ሀብቶች (ለምሳሌ የፈጠራ መብት)", "በማይንቀሳቀስ ሀብት ላይ የሚደረግ ማሻሻያ"]
        },
        
        decliningBalanceSection: {
            title: "3.4.4.7. ዋጋው እየቀነሰ የሚሄድ ዘዴ (Declining-Balance Method)",
            explanation: "ይህ ዘዴ በየአመቱ መጀመሪያ ላይ ባለው የሀብቱ ቀሪ የመዝገብ ዋጋ (Net Book Value) ላይ የተወሰነ መቶኛ (rate) በማባዛት የእርጅና ቅናሹን ያሰላል። ይህም በመጀመሪያዎቹ አመታት ከፍተኛ ቅናሽ እንዲኖርና ከጊዜ ወደ ጊዜ እንዲቀንስ ያደርገዋል።",
            formula: "አመታዊ ቅናሽ = (የአመቱ መጀመሪያ ቀሪ የመዝገብ ዋጋ) * (የቅናሽ መጣኔ %)",
            thresholdRule: "የሀብቱ ቀሪ ዋጋ ከ2,000 ብር በታች ከሆነ፣ ሙሉ በሙሉ እንደ ወጪ ተቀንሶ ይያዛል።"
        },

        improvementSection: {
            title: "3.5.2. በማሻሻያዎች ላይ የሚደረግ ቅናሽ",
            rule: "ግብር ከፋይ ዋጋው በሚቀንስ ሀብት ላይ ላደረገው የጥገና ወይም ማሻሻያ ወጪ ተቀናሽ ይፈቀድለታል።",
            limit: "ነገር ግን፣ የሚፈቀደው ተቀናሽ በዓመቱ መጨረሻ ላይ ካለው የሀብቱ ቀሪ የመዝገb ዋጋ 20% መብለጥ የለበትም። ከ20% በላይ የሆነው ወጪ የሀብቱ ዋጋ ላይ ተጨምሮ በሚቀጥሉት አመታት በእርጅና ቅናሽ ይያዛል።"
        },

        depreciationSimulator: {
            title: "የእርጅና ቅናሽ ዘዴዎች ማነፃፀሪያ",
            instructions: "የአንድን ሀብት መረጃ በማስገባት ሁለቱ የእርጅና ቅናሽ ዘዴዎች እንዴት እንደሚለያዩ በተግባር ይመልከቱ።",
            assetCost: "የሀብቱ ጠቅላላ ዋጋ",
            rate: "የቅናሽ መጣኔ (%) (ለዋጋው እየቀነሰ ዘዴ)",
            calculate: "አስላ",
            reset: "እንደገና ጀምር",
            year: "አመት",
            slMethod: "ቀጥተኛ ዘዴ",
            dbMethod: "ዋጋው እየቀነሰ የሚሄድ ዘዴ",
            openingValue: "የመጀመሪያ ዋጋ",
            depreciation: "የአመቱ ቅናሽ",
            closingValue: "የመጨረሻ ዋጋ",
            slExplanation: "ቅናሽ = {cost} / 5 = {annualDep}",
            dbExplanation: "ቅናሽ = {openingValue} * {rate}% = {annualDep}",
            resultsTitle: "የስሌት ውጤቶች"
        }
    },
    en: {
        title: "Special Deductions: Donations & Depreciation",
        langButton: "አማርኛ",

        donationSection: {
            title: "3.4.3. Donations for Charitable Purposes",
            rule: "Donations to charitable organizations or for similar purposes are deductible up to 10% of the taxable income.",
            explanation: "This means that after a company calculates its profit, if it donates to an approved charity, it can treat the donated amount (up to 10% of its profit) as an expense, thereby reducing its taxable income."
        },

        depreciationSection: {
            title: "3.4.4. Allowed Depreciation Allowance",
            intro: "A taxpayer is allowed a depreciation allowance for the decline in value of their Depreciable Assets and Intangible Assets used to generate income during the tax year.",
            explanationTitle: "What does this mean?",
            explanation: "Assets your business uses, like cars, computers, or buildings, get older and lose value over time. This loss in value is called 'depreciation'. The government allows you to count this depreciation as an annual expense, which lowers the amount of tax you have to pay.",
            depreciableAssetDef: {
                title: "What is a \"Depreciable Asset\"?",
                points: [
                    "Has a useful life of more than one year;",
                    "Is likely to lose value due to wear and tear or obsolescence;",
                    "And is used to generate business income (e.g., building, car, machinery)."
                ]
            },
            assetTransferRule: "If a taxpayer disposes of a fully depreciated asset to a related person (e.g., family or through corporate control), the recipient cannot claim any further depreciation on that asset.",
            methodsTitle: "3.4.4.3. Depreciation Calculation Methods",
            methodsIntro: "There are two primary methods for calculating depreciation:",
            methods: ["Straight-Line Method", "Declining-Balance Method"],
            youtubeLink: "https://www.youtube.com/watch?v=_pas1ETbrj8",
            youtubeText: "Watch Video Explanation"
        },
        
        straightLineSection: {
            title: "3.4.4.4. Straight-Line Method",
            explanation: "This method evenly spreads the cost of the asset over its useful life, resulting in the same depreciation amount each year.",
            formula: "Annual Depreciation = (Asset Cost) / (Useful Life in Years)",
            useCases: "Must be calculated using this method only:",
            items: ["Intangible assets (e.g., patents)", "Improvements to immovable property"]
        },
        
        decliningBalanceSection: {
            title: "3.4.4.7. Declining-Balance Method",
            explanation: "This method applies a fixed percentage rate to the asset's remaining book value at the start of each year. This results in higher depreciation in the early years and less over time.",
            formula: "Annual Depreciation = (Opening Net Book Value) * (Depreciation Rate %)",
            thresholdRule: "If the remaining book value of an asset falls below ETB 2,000, it can be fully expensed at once."
        },

        improvementSection: {
            title: "3.5.2. Depreciation on Improvements",
            rule: "A taxpayer is allowed a deduction for expenses on repairs or improvements to a depreciable asset.",
            limit: "However, the deduction cannot exceed 20% of the asset's net book value at the end of the year. Any cost exceeding 20% is added to the asset's cost and depreciated in future years."
        },

        depreciationSimulator: {
            title: "Depreciation Methods Comparator",
            instructions: "Enter an asset's information to see how the two depreciation methods work in practice.",
            assetCost: "Total Asset Cost",
            rate: "Rate (%) (for Declining Balance)",
            calculate: "Calculate",
            reset: "Reset",
            year: "Year",
            slMethod: "Straight-Line Method",
            dbMethod: "Declining-Balance Method",
            openingValue: "Opening Value",
            depreciation: "Depreciation",
            closingValue: "Closing Value",
            slExplanation: "Depr. = {cost} / 5 = {annualDep}",
            dbExplanation: "Depr. = {openingValue} * {rate}% = {annualDep}",
            resultsTitle: "Calculation Results"
        }
    }
};

// --- Helper Components ---
const Section = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => (
    <div className="mb-8"><div className="flex items-center mb-3"><div className="text-gray-600 mr-3">{icon}</div><h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2></div><div className="space-y-3 text-gray-700 leading-relaxed">{children}</div></div>
);

const DepreciationSimulator = ({ lang }: { lang: 'am' | 'en' }) => {
    const t = content[lang].depreciationSimulator;
    const [inputs, setInputs] = useState({ cost: '1000000', rate: '25' });
    const [results, setResults] = useState<any[]>([]);

    const handleCalculate = () => {
        const cost = parseFloat(inputs.cost) || 0;
        const life = 5; // Fixed life for this example
        const rate = (parseFloat(inputs.rate) || 0) / 100;

        const annualDepSL = cost / life;
        let bookValueSL = cost;
        let bookValueDB = cost;

        const newResults = Array.from({ length: life }, (_, i) => {
            const openingSL = bookValueSL;
            bookValueSL -= annualDepSL;
            
            const openingDB = bookValueDB;
            const annualDepDB = openingDB * rate;
            bookValueDB -= annualDepDB;

            return {
                year: i + 1,
                sl: { opening: openingSL, dep: annualDepSL, closing: bookValueSL },
                db: { opening: openingDB, dep: annualDepDB, closing: bookValueDB },
            };
        });
        setResults(newResults);
    };

    const handleReset = () => {
        setInputs({ cost: '1000000', rate: '25' });
        setResults([]);
    };

    return (
        <Section title={t.title} icon={<GitCompareArrows />}>
            <div className="p-3">
                <p className="text-sm text-gray-600 mb-3">{t.instructions}</p>
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <input type="number" value={inputs.cost} onChange={e => setInputs({...inputs, cost: e.target.value})} placeholder={t.assetCost} className="p-2 border"/>
                    <input type="number" value={inputs.rate} onChange={e => setInputs({...inputs, rate: e.target.value})} placeholder={t.rate} className="p-2 border"/>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleCalculate} className="px-4 py-2 bg-blue-600 text-white text-sm hover:bg-blue-700 flex items-center gap-2"><Play size={16}/>{t.calculate}</button>
                    <button onClick={handleReset} className="px-4 py-2 bg-gray-600 text-white text-sm hover:bg-gray-700 flex items-center gap-2"><RefreshCw size={16}/>{t.reset}</button>
                </div>

                {results.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-bold text-lg mb-2">{t.resultsTitle}</h3>
                        <div className="grid lg:grid-cols-2 gap-4">
                            {/* Straight-Line Results */}
                            <div className="p-3">
                                <h4 className="font-bold text-center mb-2">{t.slMethod}</h4>
                                <table className="w-full text-xs text-center">
                                    <thead><tr><th>{t.year}</th><th>{t.openingValue}</th><th>{t.depreciation}</th><th>{t.closingValue}</th></tr></thead>
                                    <tbody>{results.map(r => (<tr key={r.year} className="border-t">
                                        <td className="p-1 font-semibold">{r.year}</td><td>{r.sl.opening.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                                        <td className="text-red-600">({r.sl.dep.toLocaleString(undefined, {maximumFractionDigits: 0})})</td>
                                        <td className="font-bold">{r.sl.closing.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                                    </tr>))}</tbody>
                                </table>
                            </div>
                            {/* Declining-Balance Results */}
                             <div className="p-3">
                                <h4 className="font-bold text-center mb-2">{t.dbMethod}</h4>
                                <table className="w-full text-xs text-center">
                                    <thead><tr><th>{t.year}</th><th>{t.openingValue}</th><th>{t.depreciation}</th><th>{t.closingValue}</th></tr></thead>
                                    <tbody>{results.map(r => (<tr key={r.year} className="border-t">
                                        <td className="p-1 font-semibold">{r.year}</td><td>{r.db.opening.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                                        <td className="text-red-600">({r.db.dep.toLocaleString(undefined, {maximumFractionDigits: 0})})</td>
                                        <td className="font-bold">{r.db.closing.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                                    </tr>))}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Section>
    );
};


// --- Main Chapter Component ---
export default function DepreciationAndDonationsChapter() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const t = content[lang];
    const toggleLanguage = () => setLang(lang === 'am' ? 'en' : 'am');

    return (
        <div className="font-sans p-2 sm:p-4">
            <div className="max-w-full mx-auto">
                <header className="py-4 border-b relative">
                    <div className="flex items-center"><TrendingDown className="h-8 w-8 mr-3" /><div><h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1></div></div>
                    <button onClick={toggleLanguage} className="absolute top-4 right-4 text-gray-800 font-semibold py-2 px-4 text-sm">{t.langButton}</button>
                </header>
                <main className="py-4">
                    <Section title={t.donationSection.title} icon={<Heart />}>
                        <div className="p-3">
                            <p className="text-green-800 font-semibold">{t.donationSection.rule}</p>
                            <p className="text-sm text-green-700 mt-2">{t.donationSection.explanation}</p>
                        </div>
                    </Section>
                    
                    <Section title={t.depreciationSection.title} icon={<Building />}>
                        <p>{t.depreciationSection.intro}</p>
                        <div className="p-3">
                            <h4 className="font-bold flex items-center text-blue-800"><Lightbulb className="h-5 w-5 mr-2" />{t.depreciationSection.explanationTitle}</h4>
                            <p className="mt-1 text-sm text-blue-700">{t.depreciationSection.explanation}</p>
                        </div>
                        <div className="mt-3 p-3">
                            <h4 className="font-bold">{t.depreciationSection.depreciableAssetDef.title}</h4>
                            <ul className="list-disc list-inside space-y-1 mt-2">{t.depreciationSection.depreciableAssetDef.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
                        </div>
                    </Section>

                    <Section title={t.depreciationSection.methodsTitle} icon={<BarChart2 />}>
                        <p>{t.depreciationSection.methodsIntro}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-3">
                                <h4 className="font-bold">{t.straightLineSection.title}</h4>
                                <p className="text-sm mt-1">{t.straightLineSection.explanation}</p>
                            </div>
                            <div className="p-3">
                                <h4 className="font-bold">{t.decliningBalanceSection.title}</h4>
                                <p className="text-sm mt-1">{t.decliningBalanceSection.explanation}</p>
                            </div>
                        </div>
                         <a href={t.depreciationSection.youtubeLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm"><Video size={16}/>{t.depreciationSection.youtubeText}</a>
                    </Section>
                    
                    <DepreciationSimulator lang={lang} />

                    <Section title={t.improvementSection.title} icon={<Wrench />}>
                        <p>{t.improvementSection.rule}</p>
                        <div className="p-3">
                            <h4 className="font-bold flex items-center"><Percent className="h-4 w-4 mr-2" />Limit</h4>
                            <p className="mt-1 text-sm">{t.improvementSection.limit}</p>
                        </div>
                    </Section>
                    <ChapterNavigation previous="/content/686e8e6423afc16ef4f670b7" next="/content/686e8e6423afc16ef4f670bd" lang={lang} />
                </main>
            </div>
        </div>
    );
}

'use client';

import { useState, ReactNode } from 'react';
import {
    Megaphone,
    Percent,
    CheckCircle,
    BarChart3,
    Calculator,
    User,
    Building,
    TrendingDown,
    Play
} from 'lucide-react';

// --- i18n Content Object (1-to-1 with PDF pages 75-76) ---
const content = {
    am: {
        title: "3.6. የማስታወቂያ ወጪ",
        langButton: "English",
        ruleTitle: "ተቀናሽ የሚደረጉ የማስታወቂያ ወጪዎች",
        mainRule: "ግብር ከፋይ ምርቱን ወይም አገልግሎቱን ለማስተዋወቅ በተለያዩ ዝግጅቶች ላይ የሚያደርገው የማስተዋወቅ ስራ በገንዘብ፣ በምርት ወይም በአገልግሎት የሚፈጽመው ክፍያ በወጪ ተቀናሽ የሚያዘው ከጠቅላላ ገቢው 3% (ሶስት በመቶ) ባልበለጠ መጠን ብቻ ነው።",
        exceptionRule: "ለመገናኛ ብዙሀን ወይም ለማስታወቂያ ድርጅት የሚከፍለው ክፍያ ሙሉ በሙሉ በወጪ ተቀናሽነት ይያዛል።",
        simulator: {
            title: "የግብር ማስከፈያ ማስያ (Simulator)",
            instructions: "የተጣራ ዓመታዊ ትርፍዎን ያስገቡ እና ለግለሰብ እና ለድርጅት የሚከፈለውን ግብር ለማየት 'አስላ' የሚለውን ይጫኑ።",
            netProfitLabel: "የተጣራ ዓመታዊ ትርፍ ያስገቡ",
            calculateButton: "ግብር አስላ",
            resultsTitle: "የግብር ስሌት ውጤቶች",
            individualTax: "የግለሰብ ግብር",
            corporateTax: "የድርጅት ግብር",
            breakdownTitle: "የግለሰብ ግብር ስሌት ዝርዝር",
            taxableAt: "ግብር የሚከፈልበት"
        }
    },
    en: {
        title: "3.6. Advertising Costs",
        langButton: "አማርኛ",
        ruleTitle: "Deductible Advertising Costs",
        mainRule: "When a taxpayer incurs costs for promoting their products or services at various events, whether paid in cash, product, or service, the deductible amount is limited to a maximum of 3% of their total revenue.",
        exceptionRule: "Payments made to mass media or advertising agencies are fully deductible as an expense.",
        simulator: {
            title: "Tax Bracket Simulator",
            instructions: "Enter your net annual profit and click 'Calculate' to see the tax due for an individual versus a corporation.",
            netProfitLabel: "Enter Net Annual Profit",
            calculateButton: "Calculate Tax",
            resultsTitle: "Tax Calculation Results",
            individualTax: "Individual Tax",
            corporateTax: "Corporate Tax",
            breakdownTitle: "Individual Tax Bracket Breakdown",
            taxableAt: "Taxable at"
        }
    }
};

// --- Helper Components ---
const Section = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => (
    <div className="mb-12">
        <div className="flex items-center mb-4 border-b-2 border-gray-200 pb-2">
            <div className="text-gray-600 mr-3">{icon}</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="space-y-4 text-gray-700 leading-relaxed pl-2">{children}</div>
    </div>
);

// --- Tax Bracket Data (from previous modules) ---
const taxBrackets = [
    { min: 0, max: 7200, rate: 0, deduction: 0 },
    { min: 7201, max: 19800, rate: 0.10, deduction: 720 },
    { min: 19801, max: 38400, rate: 0.15, deduction: 1710 },
    { min: 38401, max: 63000, rate: 0.20, deduction: 3630 },
    { min: 63001, max: 93600, rate: 0.25, deduction: 6780 },
    { min: 93601, max: 130800, rate: 0.30, deduction: 11460 },
    { min: 130801, max: Infinity, rate: 0.35, deduction: 18000 }
];

const TaxBracketSimulator = ({ lang }: { lang: 'am' | 'en' }) => {
    const t = content[lang].simulator;
    const [profitInput, setProfitInput] = useState('');
    const [results, setResults] = useState<{
        individual: number;
        corporate: number;
        chartData: { bracket: string; taxableAmount: number; taxPaid: number }[];
    } | null>(null);

    const handleCalculate = () => {
        const profit = parseFloat(profitInput.replace(/,/g, ''));
        if (isNaN(profit) || profit < 0) {
            setResults(null);
            return;
        }

        // Corporate Tax Calculation
        const corporateTax = profit * 0.30;

        // Individual Tax Calculation
        const applicableBracket = taxBrackets.find(b => profit >= b.min && profit <= b.max)!;
        const individualTax = (profit * applicableBracket.rate) - applicableBracket.deduction;

        // Chart Data Calculation
        let remainingProfit = profit;
        const chartData = taxBrackets.map(b => {
            if (remainingProfit <= 0) return { bracket: `${b.rate * 100}%`, taxableAmount: 0, taxPaid: 0 };
            
            const bracketRange = b.max === Infinity ? Infinity : (b.max - b.min + 1);
            const taxableAmountInBracket = Math.min(remainingProfit, bracketRange);
            const taxPaidInBracket = taxableAmountInBracket * b.rate;
            
            remainingProfit -= taxableAmountInBracket;
            
            return {
                bracket: `${b.rate * 100}%`,
                taxableAmount: taxableAmountInBracket,
                taxPaid: taxPaidInBracket
            };
        }).filter(d => d.taxableAmount > 0);

        setResults({
            individual: individualTax,
            corporate: corporateTax,
            chartData
        });
    };

    return (
        <Section title={t.title} icon={<Calculator />}>
            <div className="p-6 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-600 mb-4">{t.instructions}</p>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={profitInput}
                        onChange={(e) => setProfitInput(e.target.value)}
                        placeholder={t.netProfitLabel}
                        className="flex-grow p-2 border rounded-md"
                    />
                    <button onClick={handleCalculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                        <Play className="h-4 w-4 mr-2"/> {t.calculateButton}
                    </button>
                </div>

                {results && (
                    <div className="mt-6 space-y-6">
                        <h4 className="font-bold text-lg text-gray-800">{t.resultsTitle}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-lg shadow text-center">
                                <User className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                                <p className="text-sm text-gray-500">{t.individualTax}</p>
                                <p className="text-2xl font-bold text-gray-800">{results.individual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB</p>
                            </div>
                             <div className="p-4 bg-white rounded-lg shadow text-center">
                                <Building className="mx-auto h-8 w-8 text-green-500 mb-2" />
                                <p className="text-sm text-gray-500">{t.corporateTax}</p>
                                <p className="text-2xl font-bold text-gray-800">{results.corporate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB</p>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-bold text-lg text-gray-800 flex items-center mb-3"><BarChart3 className="h-5 w-5 mr-2" />{t.breakdownTitle}</h4>
                            <div className="space-y-2">
                                {results.chartData.map((data, i) => (
                                    <div key={i} className="flex items-center">
                                        <div className="w-24 text-right pr-4 text-sm font-medium">{data.taxableAmount.toLocaleString()} @ {data.bracket}</div>
                                        <div className="flex-grow bg-gray-200 rounded-full h-6">
                                            <div
                                                className={`bg-blue-${300 + i * 100} h-6 rounded-full text-white text-xs flex items-center justify-end pr-2`}
                                                style={{ width: `${(data.taxableAmount / parseFloat(profitInput.replace(/,/g, ''))) * 100}%` }}
                                            >
                                                {data.taxPaid.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <p className="text-xs text-right mt-1 text-gray-500">Amount Taxed in Each Bracket (Tax Paid in bar)</p>
                        </div>
                    </div>
                )}
            </div>
        </Section>
    );
};


// --- Main Chapter Component ---
export default function AdvertisingAndTaxSimChapter() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const t = content[lang];

    const toggleLanguage = () => setLang(lang === 'am' ? 'en' : 'am');

    return (
        <div className="font-sans bg-gray-100 p-4 sm:p-6 md:p-8">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg">
                <header className="bg-blue-700 text-white p-6 rounded-t-lg relative">
                    <div className="flex items-center">
                        <Megaphone className="h-10 w-10 mr-4 flex-shrink-0" />
                        <div><h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1></div>
                    </div>
                    <button onClick={toggleLanguage} className="absolute top-4 right-4 bg-white text-blue-700 font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-100">{t.langButton}</button>
                </header>

                <main className="p-6 md:p-10">
                    <Section title={t.ruleTitle} icon={<TrendingDown />}>
                        <div className="space-y-4">
                            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                                <h4 className="font-semibold flex items-center text-yellow-900"><Percent className="h-5 w-5 mr-2"/>Limited Deduction (3% Rule)</h4>
                                <p className="mt-1 text-gray-700">{t.mainRule}</p>
                            </div>
                             <div className="p-4 bg-green-50 border-l-4 border-green-400">
                                <h4 className="font-semibold flex items-center text-green-900"><CheckCircle className="h-5 w-5 mr-2"/>Full Deduction (Exception)</h4>
                                <p className="mt-1 text-gray-700">{t.exceptionRule}</p>
                            </div>
                        </div>
                    </Section>

                    <TaxBracketSimulator lang={lang} />
                </main>
            </div>
        </div>
    );
}

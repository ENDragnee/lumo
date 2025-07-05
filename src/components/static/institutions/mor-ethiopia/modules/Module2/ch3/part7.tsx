'use client';

import { useState, ReactNode } from 'react';
import {
    BarChart,
    Building,
    User,
    Calculator,
    Wand2,
    BookText,
    Store,
    Percent
} from 'lucide-react';

// --- i18n Content Object (1-to-1 with PDF slides 48-49) ---
const content = {
    am: {
        title: "3.3. የንግድ ስራ ገቢ ግብር ማስከፈያ መጣኔ",
        langButton: "English",
        taxRates: {
            body: {
                icon: Building,
                title: "ለድርጅቶች",
                text: "በድርጅቶች የሚከፈለው የንግድ ስራ ገቢ ግብር መጣኔ 30% (ሰላሳ በመቶ) ነው።"
            },
            individual: {
                icon: User,
                title: "ለግለሰቦች",
                text: "የግለሰቦች ግብር ማስከፈያ መጣኔዎች በሠንጠረዥ 2 መሰረት ከ10 እስከ 35 በመቶ መጣኔ ግብር ይከፍላሉ።"
            }
        },
        taxBracketsTitle: "3.3.1. የግለሰቦች ግብር ማስከፈያ መጣኔዎች",
        taxTableHeaders: ["ግብር የሚከፈልበት የንግድ ገቢ (በዓመት)", "የግብር መጣኔ", "ተቀናሽ (ብር)"],
        taxBrackets: [
            ["0 - 7,200", "0%", "0"],
            ["7,201 - 19,800", "10%", "720"],
            ["19,801 - 38,400", "15%", "1,710"],
            ["38,401 - 63,000", "20%", "3,630"],
            ["63,001 - 93,600", "25%", "6,780"],
            ["93,601 - 130,800", "30%", "11,460"],
            ["130,801 በላይ", "35%", "18,000"]
        ],
        wizard: {
            title: "ተግባራዊ መሳሪያ: የኪራይ ገቢ ግምት ማስያ",
            instructions: "ይህ መሳሪያ የኪራይ ገቢን በተለያዩ ዘዴዎች ለመገመት ይረዳል። ለንግድ ስራ ገቢ ሳይሆን ለኪራይ ገቢ ብቻ የሚሰራ መሆኑን ልብ ይበሉ።",
            mode1: "በውል መሰረት",
            mode2: "በገበያ መረጃ",
            mode3: "በጠፍጣፋ መጣኔ",
            contractAmount: "አመታዊ የኪራይ ውል መጠን (ብር)",
            marketRate: "የገበያ ዋጋ በካሬ ሜትር (በወር)",
            area: "የቦታው ስፋት (m²)",
            grossIncome: "ጠቅላላ አመታዊ ገቢ (ብር)",
            calculate: "አስላ",
            resultsTitle: "የግምት ውጤቶች ንጽጽር",
            estimatedTaxableIncome: "የተገመተ ግብር የሚከፈልበት ገቢ",
            result: "ውጤት",
            method: "ዘዴ"
        }
    },
    en: {
        title: "3.3. Business Income Tax Rates",
        langButton: "አማርኛ",
        taxRates: {
            body: {
                icon: Building,
                title: "For Bodies (Corporations)",
                text: "The business income tax rate payable by bodies is 30% (thirty percent)."
            },
            individual: {
                icon: User,
                title: "For Individuals",
                text: "The tax rates for individuals are progressive, from 10% to 35%, according to Schedule 2."
            }
        },
        taxBracketsTitle: "3.3.1. Individual Tax Brackets",
        taxTableHeaders: ["Taxable Business Income (Per Annum)", "Tax Rate", "Deduction (ETB)"],
        taxBrackets: [
            ["0 - 7,200", "0%", "0"],
            ["7,201 - 19,800", "10%", "720"],
            ["19,801 - 38,400", "15%", "1,710"],
            ["38,401 - 63,000", "20%", "3,630"],
            ["63,001 - 93,600", "25%", "6,780"],
            ["93,601 - 130,800", "30%", "11,460"],
            ["Over 130,801", "35%", "18,000"]
        ],
        wizard: {
            title: "Practical Tool: Rental Income Estimation Wizard",
            instructions: "This tool helps estimate rental income using different methods. Note that this applies to RENTAL income, not business income.",
            mode1: "Based on Contract",
            mode2: "Based on Market Data",
            mode3: "Flat-Rate Method",
            contractAmount: "Annual Rental Contract Amount (ETB)",
            marketRate: "Market Rate per m² (Monthly)",
            area: "Area (m²)",
            grossIncome: "Gross Annual Income (ETB)",
            calculate: "Calculate",
            resultsTitle: "Estimation Results Comparison",
            estimatedTaxableIncome: "Estimated Taxable Income",
            result: "Result",
            method: "Method"
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

const EstimationWizard = ({ lang }: { lang: 'am' | 'en' }) => {
    const t = content[lang].wizard;
    const [mode, setMode] = useState<'contract' | 'market' | 'flat'>('contract');
    const [inputs, setInputs] = useState({ contract: '', rate: '', area: '', gross: '' });
    const [results, setResults] = useState<{ [key: string]: number | null }>({ contract: null, market: null, flat: null });

    const handleCalculate = () => {
        const contractAmount = parseFloat(inputs.contract) || 0;
        const marketRate = parseFloat(inputs.rate) || 0;
        const area = parseFloat(inputs.area) || 0;
        const grossIncome = parseFloat(inputs.gross) || 0;

        setResults({
            contract: contractAmount > 0 ? contractAmount : null,
            market: marketRate > 0 && area > 0 ? marketRate * area * 12 : null,
            flat: grossIncome > 0 ? grossIncome * 0.65 : null
        });
    };

    return (
        <Section title={t.title} icon={<Wand2 />}>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-4">{t.instructions}</p>
                
                {/* Mode Selection */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <button onClick={() => setMode('contract')} className={`px-3 py-2 text-sm rounded-md flex items-center gap-2 ${mode === 'contract' ? 'bg-blue-600 text-white' : 'bg-white border'}`}><BookText size={16}/>{t.mode1}</button>
                    <button onClick={() => setMode('market')} className={`px-3 py-2 text-sm rounded-md flex items-center gap-2 ${mode === 'market' ? 'bg-blue-600 text-white' : 'bg-white border'}`}><Store size={16}/>{t.mode2}</button>
                    <button onClick={() => setMode('flat')} className={`px-3 py-2 text-sm rounded-md flex items-center gap-2 ${mode === 'flat' ? 'bg-blue-600 text-white' : 'bg-white border'}`}><Percent size={16}/>{t.mode3}</button>
                </div>

                {/* Input Fields */}
                <div className="space-y-3 mb-4 p-4 bg-white rounded-md border">
                    {mode === 'contract' && <input type="number" value={inputs.contract} onChange={e => setInputs({...inputs, contract: e.target.value})} placeholder={t.contractAmount} className="w-full p-2 border rounded-md"/>}
                    {mode === 'market' && <div className="grid md:grid-cols-2 gap-3"><input type="number" value={inputs.rate} onChange={e => setInputs({...inputs, rate: e.target.value})} placeholder={t.marketRate} className="p-2 border rounded-md"/><input type="number" value={inputs.area} onChange={e => setInputs({...inputs, area: e.target.value})} placeholder={t.area} className="p-2 border rounded-md"/></div>}
                    {mode === 'flat' && <input type="number" value={inputs.gross} onChange={e => setInputs({...inputs, gross: e.target.value})} placeholder={t.grossIncome} className="w-full p-2 border rounded-md"/>}
                </div>
                <button onClick={handleCalculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t.calculate}</button>

                {/* Results Comparison */}
                {(results.contract || results.market || results.flat) && (
                    <div className="mt-6">
                        <h4 className="font-bold text-lg mb-2">{t.resultsTitle}</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                            {results.contract && <div className="p-3 border rounded-md bg-white"><p className="text-xs font-semibold text-gray-500">{t.mode1}</p><p className="text-xl font-bold">{results.contract.toLocaleString()} <span className="text-sm font-normal">ብር</span></p></div>}
                            {results.market && <div className="p-3 border rounded-md bg-white"><p className="text-xs font-semibold text-gray-500">{t.mode2}</p><p className="text-xl font-bold">{results.market.toLocaleString()} <span className="text-sm font-normal">ብር</span></p></div>}
                            {results.flat && <div className="p-3 border rounded-md bg-white"><p className="text-xs font-semibold text-gray-500">{t.mode3}</p><p className="text-xl font-bold">{results.flat.toLocaleString()} <span className="text-sm font-normal">ብር</span></p><p className="text-xs text-gray-500">({t.estimatedTaxableIncome})</p></div>}
                        </div>
                    </div>
                )}
            </div>
        </Section>
    );
};


// --- Main Chapter Component ---
export default function BusinessTaxRatesChapter() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const t = content[lang];

    const toggleLanguage = () => setLang(lang === 'am' ? 'en' : 'am');

    return (
        <div className="font-sans bg-gray-100 p-4 sm:p-6 md:p-8">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg">
                <header className="bg-blue-700 text-white p-6 rounded-t-lg relative">
                    <div className="flex items-center">
                        <BarChart className="h-10 w-10 mr-4 flex-shrink-0" />
                        <div><h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1></div>
                    </div>
                    <button onClick={toggleLanguage} className="absolute top-4 right-4 bg-white text-blue-700 font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-100">{t.langButton}</button>
                </header>

                <main className="p-6 md:p-10">
                    <div className="grid md:grid-cols-2 gap-8 mb-10">
                        {Object.values(t.taxRates).map(rate => {
                            const Icon = rate.icon;
                            return (
                                <div key={rate.title} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-bold text-lg text-blue-800 flex items-center mb-2"><Icon className="h-5 w-5 mr-2" />{rate.title}</h3>
                                    <p>{rate.text}</p>
                                </div>
                            )
                        })}
                    </div>
                    
                    <Section title={t.taxBracketsTitle} icon={<Calculator />}>
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="min-w-full bg-white text-sm">
                                <thead className="bg-gray-100"><tr>{t.taxTableHeaders.map(h => <th key={h} className="py-3 px-4 text-left font-semibold text-gray-600">{h}</th>)}</tr></thead>
                                <tbody>{t.taxBrackets.map((row, i) => <tr key={i} className="hover:bg-gray-50 border-t"><td className="py-2 px-4">{row[0]}</td><td className="py-2 px-4">{row[1]}</td><td className="py-2 px-4">{row[2]}</td></tr>)}</tbody>
                            </table>
                        </div>
                    </Section>

                    <EstimationWizard lang={lang} />
                </main>
            </div>
        </div>
    );
}

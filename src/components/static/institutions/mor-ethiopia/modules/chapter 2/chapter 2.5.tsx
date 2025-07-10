'use client';

import { useState, ReactNode } from 'react';
import {
    Percent,
    Calculator,
    ShieldAlert,
    Users,
    Globe,
    TrendingDown,
    CalendarClock,
    Info,
    Play,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object (1-to-1 with PDF pages 35-43) ---
const content = {
    am: {
        title: "የኪራይ ገቢ ግብር መጣኔ እና ተዛማጅ ህጎች",
        langButton: "English",

        section2_4_Title: "2.4. የኪራይ ገቢ ግብር ማስከፈያ መጣኔ",
        taxRates: {
            body: "ለድርጅቶች የኪራይ ገቢ ግብር መጣኔ 30% (ሰላሳ በመቶ)።",
            individual: "ለግለሰቦች በሠንጠረዥ 1 መሰረት ከ10 እስከ 35 በመቶ በሚደርስ መጣኔ ግብር ይከፍላሉ።"
        },
        taxBracketsTitle: "2.4.1. ለግለሰብ የኪራይ ገቢ ግብር መጣኔ",
        taxTableHeaders: ["ግብር የሚከፈልበት የኪራይ ገቢ (በዓመት)", "የግብር መጣኔ", "ተቀናሽ (ብር)"],
        taxBrackets: [
            ["0 - 7,200", "0%", "0"],
            ["7,201 - 19,800", "10%", "720"],
            ["19,801 - 38,400", "15%", "1,710"],
            ["38,401 - 63,000", "20%", "3,630"],
            ["63,001 - 93,600", "25%", "6,780"],
            ["93,601 - 130,800", "30%", "11,460"],
            ["ከ 130,801 በላይ", "35%", "18,000"]
        ],

        section2_5_Title: "2.5. የተከራይ አከራዮች",
        sublessorDef: "የተከራይ አከራይ በግብር ዓመቱ ያገኘው ግብር የሚከፈልበት ገቢ ነው የሚባለው፣ ከተቀበለው ጠቅላላ የኪራይ ገቢ ላይ ለዋናው አከራይ የሚከፍለው ኪራይ እና ገቢውን ለማግኘት ያወጣቸው ሌሎች ወጪዎች ከተቀነሱ በኋላ የሚቀረው ገንዘብ ነው።",
        sublessorLiability: "ተከራይ የተከራየውን ቤት መልሶ እንዲያከራይ የሚፈቅድ የቤት ባለቤት፣ ተከራዩ ግብሩን ሳይከፍል ቢቀር ስለእርሱ ሆኖ ግብሩን የመክፈል ኃላፊነት ይኖርበታል።",

        section2_6_Title: "2.6. ከውጭ ሀገር የቤት ኪራይ የሚገኝ ገቢ",
        foreignIncomeRule: "በኢትዮጵያ ነዋሪ የሆነ ግብር ከፋይ በውጭ አገር ባገኘው የኪራይ ገቢ ግብር ይከፍላል። የተጣራ የውጭ አገር ኪራይ ገቢ ማለት ከተገኘው ጠቅላላ ኪራይ ላይ ተቀናሽ ወጪዎች ከተቀነሰ በኋላ ያለው ነው።",

        section2_7_Title: "2.7. የቤት ኪራይ ኪሣራዎች",
        lossCarryForward: [
            "አንድ ቤት አከራይ ለአንድ የግብር አመት የደረሰበትን ኪሳራ፣ ኪሳራው ተካክሶ እስከሚያልቅ ድረስ ለ 5 አመታት ኪሳራውን ማሸጋገር ይችላል።",
            "አንድ አከራይ በግብር ከፋይነት ዘመኑ ኪሳራን ማሸጋገር የሚችለው ሁለት ጊዜ ብቻ ይሆናል።"
        ],
        
        section2_8_Title: "2.8. የሚከራይ አዲስ ቤትን ስለማሳወቅ",
        notificationRule: "የሚሰራው ቤት እንደተጠናቀቀ ወይም ተከራይቶ ከሆነ፣ ስራ ተቋራጩ እና የቤቱ ባለቤት ከቤቱ ኪራይ በሚገኘው ገቢ ላይ ግብር መክፈል ያለበትን ሰው አድራሻ በአንድ ወር ጊዜ ውስጥ ለቀበሌ/ለከተማ አስተዳደሩ ማስታወቅ አለባቸው። መረጃው የደረሰው አካልም ለባለስልጣኑ መግለጽ አለበት።",

        section2_9_Title: "2.9. የኪራይ ገቢ ግምት አወሳሰን",
        estimationRule: "የኪራይ ገቢ ግብር በግምት የሚወሰነው በውል፣ በወቅታዊ የገበያ መረጃ、 በአካባቢ መረጃ、 ወዘተ. መሰረት ነው። ለደረጃ “ሀ” እና “ለ” በግምት ሲወሰን、 የጠቅላላ ኪራይ ገቢ 35% እንደ ወጪ ተይዞ 65% ግብር የሚከፈልበት ገቢ ይሆናል።",

        caseStudy: {
            title: "የሙከራ ጥያቄ",
            scenario: "ወ/ሮ ትሁን ባንተ የተባለች ግለሰብ አንድ የንግድ ማእከል ተከራይታ የምታከራይ ስትሆን ከምታከራየው አጠቃላይ የአመት ገቢዋ 500,000 ብር ታገኛለች፡፡ ለአንድ ዓመት ለዋና አከራዩ የምትከፍለው 300,000 ብር ነው፡፡ አከራይዋ ገቢውን ለማግኘት ቤቱን ለፓርቲሽን 50,000 ብር እና ለማስዋቢያ 20,000 ብር አውጥታለች፡፡",
            q1: "1. ግብር የሚከፈልበትን ገቢ አስሉ።",
            q2: "2. በዚህ ኪራይ ላይ የተጨማሪ እሴት ታክስ ይሰበሰባል ወይስ አይሰበሰብም? ለምን? ተርን ኦቨር ታክስስ?",
        },
        simulator: {
            title: "የኪሳራ ማሸጋገር ማስያ (Simulator)",
            instructions: "ለእያንዳንዱ አመት ትርፍ ወይም ኪሳራ በተገቢው ሳጥን ውስጥ ያስገቡ እና 'አስላ' የሚለውን ይጫኑ።",
            year: "አመት",
            profit: "ትርፍ",
            loss: "(ኪሳራ)",
            lossUsed: "ጥቅም ላይ የዋለ ኪሳራ",
            taxableIncome: "ግብር የሚከፈልበት ገቢ",
            calculate: "አስላ",
            reset: "እንደገና ጀምር"
        }
    },
    en: {
        title: "Rental Income Tax Rates & Related Rules",
        langButton: "አማርኛ",

        section2_4_Title: "2.4. Rental Income Tax Rate",
        taxRates: {
            body: "The rental income tax rate for bodies is 30% (thirty percent).",
            individual: "For individuals, tax is paid at rates ranging from 10% to 35% according to Schedule 1."
        },
        taxBracketsTitle: "2.4.1. Individual Rental Income Tax Brackets",
        taxTableHeaders: ["Taxable Rental Income (Per Annum)", "Tax Rate", "Deduction (ETB)"],
        taxBrackets: [
            ["0 - 7,200", "0%", "0"],
            ["7,201 - 19,800", "10%", "720"],
            ["19,801 - 38,400", "15%", "1,710"],
            ["38,401 - 63,000", "20%", "3,630"],
            ["63,001 - 93,600", "25%", "6,780"],
            ["93,601 - 130,800", "30%", "11,460"],
            ["Over 130,801", "35%", "18,000"]
        ],

        section2_5_Title: "2.5. Sub-lessors",
        sublessorDef: "The taxable income of a sub-lessor for a tax year is the remaining amount after deducting the rent paid to the primary lessor and other expenses incurred to earn the income from the total rent received.",
        sublessorLiability: "A property owner who permits a lessee to sub-lease the property shall be liable for the payment of the tax if the lessee fails to pay.",

        section2_6_Title: "2.6. Rental Income from Foreign Countries",
        foreignIncomeRule: "A resident of Ethiopia is liable to pay tax on rental income earned from a foreign country. Net foreign rental income is the amount remaining after deducting allowable expenses from the gross rental income.",

        section2_7_Title: "2.7. Rental Losses",
        lossCarryForward: [
            "A lessor can carry forward a loss incurred in a tax year for up to 5 years until the loss is fully offset.",
            "A lessor can carry forward a loss only twice during their time as a taxpayer."
        ],
        
        section2_8_Title: "2.8. Notification of a New Rental Building",
        notificationRule: "Upon completion or rental of a new building, the contractor and the owner must notify the local administration (Kebele/City) of the person liable to pay tax on the rental income within one month. The receiving body must then inform the Authority.",

        section2_9_Title: "2.9. Assessment of Rental Income by Estimation",
        estimationRule: "Rental income tax may be assessed by estimation based on contracts, current market data, local information, etc. For Category 'A' and 'B' taxpayers assessed by estimation, 35% of the gross rental income is treated as an expense, making 65% the taxable income base.",

        caseStudy: {
            title: "Test Question",
            scenario: "Ms. Tuhun Bante, an individual, rents a commercial center and sub-leases it, earning a gross annual income of ETB 500,000. She pays ETB 300,000 per year to the primary lessor. To earn this income, she spent ETB 50,000 on partitions and ETB 20,000 on decorations.",
            q1: "1. Calculate the taxable income.",
            q2: "2. Is VAT collected on this rent, or not? Why? What about Turnover Tax?",
        },
        simulator: {
            title: "Loss Carry-Forward Simulator",
            instructions: "Enter a profit or loss in the appropriate column for each year and click 'Calculate'.",
            year: "Year",
            profit: "Profit",
            loss: "(Loss)",
            lossUsed: "Loss Used",
            taxableIncome: "Taxable Income",
            calculate: "Calculate",
            reset: "Reset"
        }
    }
};

const Section = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => (
    <div className="mb-8">
        <div className="flex items-center mb-3 border-b pb-2">
            <div className="text-gray-600 mr-3">{icon}</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="space-y-3 text-gray-700 leading-relaxed">{children}</div>
    </div>
);


// --- Main Chapter Component ---
export default function RentalRatesAndLossesChapter() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const t = content[lang];

    const toggleLanguage = () => setLang(lang === 'am' ? 'en' : 'am');

    return (
        <div className="font-sans p-2 sm:p-4">
            <div className="max-w-full mx-auto">
                <header className="py-4 border-b relative">
                    <div className="flex items-center">
                        <Percent className="h-8 w-8 mr-3" />
                        <div><h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1></div>
                    </div>
                    <button onClick={toggleLanguage} className="absolute top-4 right-4 text-gray-800 font-semibold py-2 px-4 text-sm">{t.langButton}</button>
                </header>

                <main className="py-4">
                    <Section title={t.section2_4_Title} icon={<Calculator />}>
                        <p>{t.taxRates.body}</p>
                        <p>{t.taxRates.individual}</p>
                        <h4 className="font-bold text-lg mt-3">{t.taxBracketsTitle}</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead><tr>{t.taxTableHeaders.map(h => <th key={h} className="py-2 px-4 border-b text-left font-semibold">{h}</th>)}</tr></thead>
                                <tbody>{t.taxBrackets.map((row, i) => <tr key={i}><td className="py-2 px-4 border-b">{row[0]}</td><td className="py-2 px-4 border-b">{row[1]}</td><td className="py-2 px-4 border-b">{row[2]}</td></tr>)}</tbody>
                            </table>
                        </div>
                    </Section>

                    <Section title={t.section2_5_Title} icon={<Users />}>
                        <p>{t.sublessorDef}</p>
                        <div className="p-3">
                            <h4 className="font-bold flex items-center"><AlertCircle className="h-5 w-5 mr-2" />Landlord Liability</h4>
                            <p className="mt-1">{t.sublessorLiability}</p>
                        </div>
                    </Section>

                    <Section title={t.section2_6_Title} icon={<Globe />}><p>{t.foreignIncomeRule}</p></Section>
                    
                    <Section title={t.section2_7_Title} icon={<TrendingDown />}>
                        <ul className="list-disc list-inside space-y-2">{t.lossCarryForward.map((rule, i) => <li key={i}>{rule}</li>)}</ul>
                    </Section>
                    
                    <LossCarryForwardSimulator lang={lang} />
                    
                    <Section title={t.section2_8_Title} icon={<Info />}><p>{t.notificationRule}</p></Section>
                    <Section title={t.section2_9_Title} icon={<Info />}><p>{t.estimationRule}</p></Section>
                    
                     <div className="my-6 p-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{t.caseStudy.title}</h3>
                        <p className="text-gray-600 mb-3 italic">{t.caseStudy.scenario}</p>
                        <div className="font-semibold text-gray-800 space-y-2">
                            <p>{t.caseStudy.q1}</p>
                            <p>{t.caseStudy.q2}</p>
                        </div>
                    </div>
                    <ChapterNavigation previous="/content/686e8e6323afc16ef4f670ab" next="/content/686e8e6323afc16ef4f670b1" lang={lang} />
                </main>
            </div>
        </div>
    );
}

const LossCarryForwardSimulator = ({ lang }: { lang: 'am' | 'en' }) => {
    const t = content[lang].simulator;

    const createInitialState = () => Array.from({ length: 5 }, (_, i) => ({
        id: i,
        year: i + 1,
        profitInput: '',
        lossInput: '',
        lossUsed: 0,
        taxableIncome: 0
    }));

    const [years, setYears] = useState(createInitialState());

    const handleInputChange = (id: number, value: string, type: 'profit' | 'loss') => {
        const newYears = years.map(year => {
            if (year.id === id) {
                if (type === 'profit') {
                    return { ...year, profitInput: value, lossInput: '' };
                } else {
                    return { ...year, lossInput: value, profitInput: '' };
                }
            }
            return year;
        });
        setYears(newYears);
    };
    
    const handleReset = () => {
        setYears(createInitialState());
    };

    const handleCalculate = () => {
        let lossPool: { amount: number; yearsLeft: number }[] = [];
        const calculatedYears = years.map(yearData => {
            let pl = 0;
            const profitValue = parseFloat(yearData.profitInput);
            const lossValue = parseFloat(yearData.lossInput);

            if (!isNaN(lossValue) && lossValue > 0) {
                pl = -lossValue;
            } else if (!isNaN(profitValue) && profitValue > 0) {
                pl = profitValue;
            }

            let lossUsed = 0;
            let taxableIncome = 0;

            if (pl < 0) {
                lossPool.push({ amount: -pl, yearsLeft: 5 });
                taxableIncome = 0;
            } else {
                taxableIncome = pl;
                lossPool = lossPool.filter(loss => loss.yearsLeft > 0);

                for (let loss of lossPool) {
                    if (taxableIncome > 0) {
                        const amountToUse = Math.min(taxableIncome, loss.amount);
                        loss.amount -= amountToUse;
                        taxableIncome -= amountToUse;
                        lossUsed += amountToUse;
                    }
                }
                lossPool = lossPool.filter(loss => loss.amount > 0);
            }
            
            lossPool.forEach(loss => loss.yearsLeft--);

            return { ...yearData, lossUsed, taxableIncome };
        });
        setYears(calculatedYears);
    };
    
    const totalAvailableLoss = years.reduce((acc, year) => {
        const lossValue = parseFloat(year.lossInput);
        if (!isNaN(lossValue) && lossValue > 0) {
             return acc + lossValue - year.lossUsed;
        }
        return acc - year.lossUsed;
    }, 0);


    return (
        <Section title={t.title} icon={<CalendarClock />}>
            <div className="p-3">
                <p className="text-sm text-gray-600 mb-3">{t.instructions}</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left">
                            <tr className="text-left">
                                <th className="p-2">{t.year}</th>
                                <th className="p-2 text-green-700">{t.profit}</th>
                                <th className="p-2 text-red-700">{t.loss}</th>
                                <th className="p-2">{t.lossUsed}</th>
                                <th className="p-2">{t.taxableIncome}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {years.map(year => (
                                <tr key={year.id} className="border-b">
                                    <td className="p-2 font-semibold">{year.year}</td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            value={year.profitInput}
                                            onChange={(e) => handleInputChange(year.id, e.target.value, 'profit')}
                                            className="w-full p-1 border"
                                            placeholder="5000"
                                        />
                                    </td>
                                    <td className="p-2">
                                         <input
                                            type="number"
                                            value={year.lossInput}
                                            onChange={(e) => handleInputChange(year.id, e.target.value, 'loss')}
                                            className="w-full p-1 border"
                                            placeholder="2000"
                                        />
                                    </td>
                                    <td className="p-2 text-red-600 font-medium">{year.lossUsed > 0 ? `(${year.lossUsed.toLocaleString()})` : '0'}</td>
                                    <td className="p-2 font-bold text-green-700">{year.taxableIncome.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button onClick={handleCalculate} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"><Play className="h-4 w-4 mr-2"/>{t.calculate}</button>
                    <button onClick={handleReset} className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 flex items-center"><RefreshCw className="h-4 w-4 mr-2"/>{t.reset}</button>
                </div>
            </div>
        </Section>
    );
};

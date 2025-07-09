'use client';

import { useState, ReactNode } from 'react';
import {
    MinusSquare,
    CheckSquare,
    ShoppingCart,
    Heart,
    Utensils,
    Building,
    Lightbulb,
    HelpCircle,
    X
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object (1-to-1 with PDF slides 50-59) ---
const content = {
    am: {
        title: "3.4. ተቀናሽ የሚደረጉ ወጪዎች",
        langButton: "English",
        
        generalDeductiblesTitle: "አጠቃላይ ተቀናሽ የሚደረጉ ወጪዎች",
        generalDeductibles: [
            "ገደቦች እንደተጠበቁ ሆነው፣ ገቢዎችን ለማግኘት፣ ለንግዱ ስራ ዋስትና ለመስጠትና የንግድ ስራውን ለማስቀጠል በግብር ከፋዩ በግብር ዓመቱ የተደረጉ አስፈላጊ ወጪዎች።",
            "በግብር ዓመቱ ለተሸጠ የንግድ ዕቃ (trading stock) የወጣ ወጪ።",
            "በንግድ ስራው ላይ ሲውሉ ዋጋቸው የሚቀንስ የንግድ ስራ ሃብቶችና ግዙፋዊ ህልውና ለሌላቸው የንግድ ስራ ሃብቶች በግብር ዓመቱ የሚታሰበው ጠቅላላ የእርጅና ቅናሽ።",
            "የንግድ ዕቃን ሳይጨምር፣ ግብር ከፋዩ በዓመቱ ውስጥ የንግድ ስራ ሃብትን በማስተላለፍ የገጠመው ኪሣራ።",
            "በሠራተኛው የጤና ዕቅድ መሰረት ቀጣሪ በተቀጣሪ ስም የሚከፍለውን የጤና መድን አረቦን ጨምሮ ለሠራተኛው የሕክምና አገልግሎት የሚያወጣው ወጪ።"
        ],
        
        specificDeductiblesTitle: "3.4.1. ዝርዝር ተቀናሽ ወጪዎች",

        exercise: {
            sharedUtilities: {
                title: "የጋራ መገልገያዎች ወጪ",
                scenario: "አንድ ግብር ከፋይ ለንግድ ድርጅቱ እና ለመኖሪያ ቤቱ የሚጠቀምበት አንድ የውሃ ቆጣሪ አለው። ወርሃዊ የውሃ ክፍያ 1,200 ብር ነው። በወጪነት ተቀናሽ ሊያዝለት የሚችለው የገንዘብ መጠን ስንት ነው?",
                hint: "ደንቡ እንደሚለው፣ ለጋራ መገልገያ ከወጣው ወጪ 75% ብቻ ተቀናሽ ይሆናል።",
                calculation: "1,200 ብር * 75% = 900 ብር",
                unit: "ብር"
            },
            representation: {
                title: "የውክልና ወጪ (Representation Expense)",
                scenario: "አንድ ድርጅት በግብር ዓመቱ 2,000,000 ብር ጠቅላላ ገቢ አግኝቷል። ለውክልና ወጪዎች (ለምሳሌ ለእንግዶች መስተንግዶ) 250,000 ብር አውጥቷል። በህግ ተቀናሽ የሚፈቀድለት ከፍተኛው የውክልና ወጪ ስንት ነው?",
                hint: "የውክልና ወጪ ከጠቅላላ ገቢው 10% መብለጥ የለበትም።",
                calculation: "2,000,000 ብር * 10% = 200,000 ብር",
                unit: "ብር"
            },
            interestOnLoan: {
                title: "የብድር ወለድ",
                scenario: "አንድ ግብር ከፋይ ለህንጻ ግንባታ 500,000 ብር ብድር ወስዷል። ግንባታው ከመጠናቀቁ በፊት 30,000 ብር ወለድ ከፍሏል። ግንባታው ከተጠናቀቀ በኋላ ደግሞ 25,000 ብር ወለድ ከፍሏል። በዚህ ዓመት እንደ ወጪ ተቀናሽ የሚሆነው ስንት ነው?",
                hint: "ግንባታው ከመጠናቀቁ በፊት የተከፈለ ወለድ የህንጻው ዋጋ አካል (capitalized) ይሆናል፤ ከተጠናቀቀ በኋላ የተከፈለው ግን በቀጥታ እንደ ወጪ ይቀነሳል።",
                calculation: "25,000 ብር (ከተጠናቀቀ በኋላ የተከፈለው ብቻ)",
                unit: "ብር"
            },
            showHint: "መርጃ አሳይ",
            checkAnswer: "መልስ አረጋግጥ",
            correct: "ትክክል!",
            incorrect: "እንደገና ሞክር።"
        }
    },
    en: {
        title: "3.4. Deductible Expenses",
        langButton: "አማርኛ",
        
        generalDeductiblesTitle: "General Deductible Expenses",
        generalDeductibles: [
            "Subject to limitations, any necessary expenses incurred by the taxpayer during the tax year in deriving, securing, and maintaining business income.",
            "The cost of trading stock sold during the tax year.",
            "The total amount of depreciation allowance for the taxpayer's depreciable assets and intangible assets for the tax year.",
            "Loss on disposal of a business asset (other than trading stock) by the taxpayer during the year.",
            "Expenditure incurred in providing medical services to an employee, including health insurance premiums paid by the employer under the employee's health plan."
        ],

        specificDeductiblesTitle: "3.4.1. Specific Deductible Expenses",

        exercise: {
            sharedUtilities: {
                title: "Shared Utilities Expense",
                scenario: "A taxpayer uses a single water meter for their business and their residence. The monthly water bill is ETB 1,200. What is the maximum deductible amount for this expense?",
                hint: "The rule states that only 75% of the cost for a shared utility is deductible.",
                calculation: "ETB 1,200 * 75% = ETB 900",
                unit: "ETB"
            },
            representation: {
                title: "Representation Expense",
                scenario: "A company earned a gross income of ETB 2,000,000 in a tax year. It spent ETB 250,000 on representation expenses (e.g., entertaining clients). What is the maximum legally deductible representation expense?",
                hint: "Representation expense is capped at 10% of the gross income.",
                calculation: "ETB 2,000,000 * 10% = ETB 200,000",
                unit: "ETB"
            },
            interestOnLoan: {
                title: "Interest on Loan",
                scenario: "A taxpayer took a loan of ETB 500,000 to construct a building. Before completion, they paid ETB 30,000 in interest. After completion, they paid ETB 25,000 in interest. What amount is deductible as an expense this year?",
                hint: "Interest paid before completion is capitalized (becomes part of the asset's cost). Only interest paid after completion is directly expensed.",
                calculation: "ETB 25,000 (Only the portion paid after completion)",
                unit: "ETB"
            },
            showHint: "Show Hint",
            checkAnswer: "Check Answer",
            correct: "Correct!",
            incorrect: "Try again."
        }
    }
};

// --- Helper Components ---
const Section = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => (
    <div className="mb-8">
        <div className="flex items-center mb-3">
            <div className="text-gray-600 mr-3">{icon}</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="space-y-3 text-gray-700 leading-relaxed">{children}</div>
    </div>
);

const FillInTheBlanksExercise = ({ exerciseData, lang, onExerciseComplete }: { exerciseData: any, lang: 'am' | 'en', onExerciseComplete: (passed: boolean) => void }) => {
    const t = content[lang].exercise;
    const [userInput, setUserInput] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const checkAnswer = () => {
        const correctAnswer = parseFloat(exerciseData.calculation.replace(/[^0-9.]/g, ''));
        const userAnswer = parseFloat(userInput);
        const correct = userAnswer === correctAnswer;
        setIsCorrect(correct);
        onExerciseComplete(correct);
    };

    return (
        <div className="p-3">
            <h4 className="font-bold text-lg text-blue-700 mb-2">{exerciseData.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{exerciseData.scenario}</p>
            
            <div className="flex items-center gap-2 mb-2">
                <input
                    type="number"
                    value={userInput}
                    onChange={(e) => {
                        setUserInput(e.target.value);
                        setIsCorrect(null);
                    }}
                    className={`w-full p-2 border ${isCorrect === true ? 'border-green-500' : ''} ${isCorrect === false ? 'border-red-500' : ''}`}
                    placeholder="..."
                />
                <span className="font-semibold">{exerciseData.unit}</span>
            </div>

            <div className="flex flex-wrap gap-2 items-center mb-3">
                <button onClick={checkAnswer} className="px-3 py-1 bg-blue-600 text-white text-sm hover:bg-blue-700">{t.checkAnswer}</button>
                <button onClick={() => setShowHint(!showHint)} className="px-3 py-1 bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 flex items-center gap-1">
                    <Lightbulb size={14} /> {t.showHint}
                </button>
                {isCorrect === true && <span className="text-green-600 font-semibold">{t.correct}</span>}
                {isCorrect === false && <span className="text-red-600 font-semibold">{t.incorrect}</span>}
            </div>
            
            {showHint && (
                <div className="p-2 text-sm text-yellow-800">
                    <strong>Hint:</strong> {exerciseData.hint}
                </div>

            )}
        </div>
    );
};

// --- Main Chapter Component ---
export default function BusinessDeductibleExpensesChapter() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const [sharedUtilitiesPassed, setSharedUtilitiesPassed] = useState(false);
    const [representationPassed, setRepresentationPassed] = useState(false);
    const [interestOnLoanPassed, setInterestOnLoanPassed] = useState(false);

    const t = content[lang];

    const toggleLanguage = () => setLang(lang === 'am' ? 'en' : 'am');

    // Determine if all exercises are passed
    const allExercisesPassed = sharedUtilitiesPassed && representationPassed && interestOnLoanPassed;

    return (
        <div className="font-sans p-2 sm:p-4">
            <div className="max-w-full mx-auto">
                <header className="py-4 border-b relative">
                    <div className="flex items-center">
                        <MinusSquare className="h-8 w-8 mr-3" />
                        <div><h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1></div>
                    </div>
                    <button onClick={toggleLanguage} className="absolute top-4 right-4 text-gray-800 font-semibold py-2 px-4 text-sm">{t.langButton}</button>
                </header>

                <main className="py-4">
                    <Section title={t.generalDeductiblesTitle} icon={<CheckSquare />}>
                        <ul className="space-y-3">
                            {t.generalDeductibles.map((rule, i) => (
                                <li key={i} className="flex items-start p-2">
                                    <ShoppingCart className="h-5 w-5 mr-3 mt-1 text-green-600 flex-shrink-0"/>
                                    <span>{rule}</span>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title={t.specificDeductiblesTitle} icon={<Building />}>
                        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                            <FillInTheBlanksExercise exerciseData={t.exercise.sharedUtilities} lang={lang} onExerciseComplete={setSharedUtilitiesPassed} />
                            <FillInTheBlanksExercise exerciseData={t.exercise.representation} lang={lang} onExerciseComplete={setRepresentationPassed} />
                            <FillInTheBlanksExercise exerciseData={t.exercise.interestOnLoan} lang={lang} onExerciseComplete={setInterestOnLoanPassed} />
                             {/* You can add more exercises here for other rules like donations, entertainment, etc. */}
                             <div className="p-3">
                                 <h4 className="font-bold text-lg text-blue-700 mb-2 flex items-center"><Heart className="h-5 w-5 mr-2" />Donations & Entertainment</h4>
                                 <p className="text-sm text-gray-600">Other specific rules apply for donations (up to 10% of taxable income) and entertainment expenses in certain sectors (mining, manufacturing). These also have their own calculation logic.</p>
                             </div>
                        </div>
                    </Section>
                    <ChapterNavigation previous="/content/686e8e6423afc16ef4f670b4" next="/content/686e8e6423afc16ef4f670ba" lang={lang} isPassed={allExercisesPassed} />
                </main>
            </div>
        </div>
    );
}

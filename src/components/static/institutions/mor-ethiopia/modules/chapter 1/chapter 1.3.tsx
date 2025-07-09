'use client';

import { useState, ReactNode } from 'react';
import {
    Hash,
    CheckCircle,
    Info,
    AlertTriangle,
    FileText,
    Key,
    Globe,
    UserCheck,
    XCircle,
    Award,
    ThumbsUp,
    ThumbsDown
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object (1-to-1 with PDF pages 32-35) ---
const content = {
    am: {
        title: "ክፍል ሶስት: ስለታክስ ከፋይ መለያ ቁጥር አሰጣጥ",
        langButton: "English",

        section3_1_Title: "3.1. የታክስ ከፋይ መለያ ቁጥር ስለመሰጠት",
        issuanceRules: [
            "አንድ ታክስ ከፋይ ከአንድ መለያ ቁጥር በላይ ሊኖረው አይችልም። ከ1 በላይ በሆኑ ክልሎች/የከተማ አስተዳደር በንግድ ሥራ/ቤት በማከራየት ሥራ ላይ ተሠማርቶ ገቢ የሚያገኝ ሰው ተቀጽላ ያለው መለያ ቁጥር ሊሰጠው ይችላል።",
            "መለያ ቁጥር በመያዝ ብቻ የታክስ ግዴታ እንዲወጣ አይጠየቅም።",
            "መለያ ቁጥሩ በተለያዩ ምክንያቶች ከተበላሸና በጽሑፍ ካመለከተ፣ የተበላሸውን መልሶ ነባሩን መለያ ቁጥር የያዘ የምስክር ወረቀት ታትሞ ይሰጠዋል።"
        ],

        section3_2_Title: "3.2. የታክስ ከፋይ መለያ ቁጥር አጠቃቀም",
        usageRules: [
            "መለያ ቁጥር በታክስ ሕግ መሠረት በሚዘጋጅ ሰነድ ላይ መገለጽ ይኖርበታል።",
            "ታክስ ከፋዩ ታክስ ቀንሶ የማስቀረት ግዴታ ላለበት ሰው ክፍያዎች በሚፈጽምበት ጊዜ መለያ ቁጥሩን ማሳወቅ አለበት።",
            "የንግድ ሥራ ለመሥራት ፈቃድ እንዲሰጠው ማመልከቻ የሚያቀርብ ታክስ ከፋይ፣ ፈቃድ ለሚሰጠው ባለሥልጣን የታክስ ከፋይ መለያ ቁጥሩን መስጠት አለበት።",
            "የንግድ/የሥራ ፈቃድ የሚሰጥ የመንግሥት አካል/ተቋም ታክስ ከፋዩ መለያ ቁጥሩን ሳያቀርብ ፈቃድ መስጠት አይችልም።",
            "ፈቃዱን በሚያድስበት ጊዜ የታክስ ከፋይ መለያ ቁጥር ማቅረብ የሚጠበቅበት፣ የመጀመሪያው የፈቃድ ማመልከቻ ከቀረበ ወዲህ የታክስ ከፋይ መለያ ቁጥሩ የተቀየረ እንደሆነ ብቻ ነው።",
            "መለያ ቁጥር ለተሰጠው ሰው ብቻ የሚያገለግል ስለሆነ ከታክስ ወኪል ውጭ በሌላ ሰው ጥቅም ላይ ሊውል አይችልም።"
        ],
        
        section3_3_Title: "3.3. የታክስ ከፋይ መለያ ቁጥርን ስለመሰረዝ",
        cancellationReasonsTitle: "ባለሥልጣኑ በሚከተሉት ምክንያቶች የTIN ቁጥርን ሊሰርዝ ይችላል፡",
        cancellationReasons: [
            "እውነተኛ ባልሆነ ማንነት መለያ ቁጥሩ ከተሰጠ፤",
            "ታክስ ከፋዩ ከአንድ በላይ የታክስ ከፋይ መለያ ቁጥር ከያዘ፤",
            "ታክስ ከፋዩ ማንኛውንም ገቢ የሚያገኝበትን ሥራ ሲያቆም።"
        ],

        quiz: {
            quizTitle: "የአጠቃቀም ሁኔታዎች ሙከራ",
            quizIntro: "ከዚህ በታች ያለውን ሁኔታ አንብበው ትክክለኛውን ምላሽ ይምረጡ።",
            scenario: "ቤዛ የተባለች ሥራ ፈጣሪ አዲስ የልብስ መሸጫ ሱቅ ከፍታለች። ፈቃድ ለማውጣት ወደ ንግድ ቢሮ ስትሄድ ምን ማድረግ አለባት?",
            options: [
                "የንግድ ስሟን ብቻ መንገር አለባት።",
                "የታክስ ከፋይ መለያ ቁጥሯን (TIN) ለፈቃድ ሰጪው ባለሥልጣን ማሳየት አለባት።",
                "ጓደኛዋን ወክላ ፈቃድ ማውጣት ትችላለች።"
            ],
            correctOptionIndex: 1,
            feedback: {
                correct: "ትክክል ነው! የንግድ ፈቃድ ለማውጣት የታክስ ከፋይ መለያ ቁጥርን ማቅረብ የግድ ነው። ይህ ህጋዊ አሰራርን መከተሏን ያሳያል።",
                incorrect: "ትክክል አይደለም። ደንቡ እንደሚለው፣ ማንኛውም የንግድ ፈቃድ አመልካች የራሱን የታክስ ከፋይ መለያ ቁጥር ማቅረብ አለበት።"
            }
        }
    },
    en: {
        title: "Part Three: About Issuance of TIN",
        langButton: "አማርኛ",

        section3_1_Title: "3.1. About the Issuance of a Taxpayer Identification Number",
        issuanceRules: [
            "A taxpayer cannot have more than one identification number. A person who is engaged in business/rental activities and earns income in more than one region/city administration may be issued a supplementary identification number.",
            "Holding an identification number alone does not require the fulfillment of tax obligations.",
            "If the identification number is damaged for various reasons and the taxpayer applies in writing, a new certificate bearing the original identification number will be printed and issued after returning the damaged one."
        ],

        section3_2_Title: "3.2. Usage of the Taxpayer Identification Number",
        usageRules: [
            "The identification number must be stated on documents prepared in accordance with tax law.",
            "The taxpayer must notify their identification number to a person who has the duty to withhold tax when making payments.",
            "A taxpayer applying for a license to conduct business must provide their Taxpayer Identification Number to the licensing authority.",
            "A government body/institution that issues business/work licenses cannot issue a license if the taxpayer does not provide their identification number.",
            "When renewing a license, providing the Taxpayer Identification Number is only required if the TIN has changed since the initial application was submitted.",
            "The identification number is for the exclusive use of the person to whom it is issued and cannot be used by another person, except for a tax agent."
        ],
        
        section3_3_Title: "3.3. About Cancelling the Taxpayer Identification Number",
        cancellationReasonsTitle: "The Authority may cancel a TIN for the following reasons:",
        cancellationReasons: [
            "If the identification number was issued based on a false identity;",
            "If the taxpayer holds more than one Taxpayer Identification Number;",
            "When the taxpayer ceases any income-generating activity."
        ],
        
        quiz: {
          quizTitle: "Usage Scenario Test",
          quizIntro: "Read the scenario below and choose the correct response.",
          scenario: "An entrepreneur named Beza has opened a new clothing boutique. What must she do when she goes to the trade bureau to get her license?",
          options: [
              "She only needs to state her business name.",
              "She must present her Taxpayer Identification Number (TIN) to the licensing official.",
              "She can get the license on behalf of her friend."
          ],
          correctOptionIndex: 1,
          feedback: {
              correct: "Correct! Providing a TIN is mandatory to obtain a business license. This shows she is following the legal procedure.",
              incorrect: "Incorrect. The rule states that any applicant for a business license must provide their own Taxpayer Identification Number."
          }
        }
    }
};

// --- Helper Components ---

const Section = ({ title, icon, children }: { title: string, icon: ReactNode, children: ReactNode }) => (
    <div className="mb-10">
        <div className="flex items-center mb-4 border-b-2 border-blue-200 pb-2">
            <div className="text-blue-600 mr-3">{icon}</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="space-y-4 text-gray-700 leading-relaxed pl-2">
            {children}
        </div>
    </div>
);

const RuleItem = ({ children, icon }: { children: ReactNode, icon: ReactNode }) => (
    <li className="flex items-start p-3 bg-gray-50">
        <div className="mr-3 mt-1 flex-shrink-0">{icon}</div>
        <span>{children}</span>
    </li>
);

const ScenarioQuiz = ({ lang, onQuizComplete }: { lang: 'am' | 'en', onQuizComplete: (passed: boolean) => void }) => {
    const t = content[lang].quiz;
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleOptionClick = (index: number) => {
        setSelectedOption(index);
        setShowFeedback(true);
        const isCorrect = index === t.correctOptionIndex;
        if (isCorrect) {
            onQuizComplete(true);
        }
    };

    const isCorrect = selectedOption === t.correctOptionIndex;

    return (
        <div className="my-10 p-6 bg-blue-50 rounded-r-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{t.quizTitle}</h3>
            <p className="text-gray-600 mb-4">{t.quizIntro}</p>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-800">{t.scenario}</p>
                <div className="mt-4 space-y-3">
                    {t.options.map((option:any, index:any) => (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(index)}
                            disabled={showFeedback}
                            className={`w-full text-left p-3 border rounded-lg transition-all duration-200 flex items-center
                                ${showFeedback && selectedOption === index ? 
                                    (isCorrect ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400') : 
                                    'bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                                }
                                ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}
                            `}
                        >
                            <div className="flex-grow">{option}</div>
                            {showFeedback && selectedOption === index && (
                                isCorrect ? <ThumbsUp className="h-5 w-5 text-green-600" /> : <ThumbsDown className="h-5 w-5 text-red-600" />
                            )}
                        </button>
                    ))}
                </div>
                {showFeedback && (
                    <div className={`mt-4 p-4 rounded-md ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isCorrect ? t.feedback.correct : t.feedback.incorrect}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Chapter Component ---

export default function TaxRegistrationChapterThree() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const [quizPassed, setQuizPassed] = useState(false);
    const t = content[lang];

    const toggleLanguage = () => {
        setLang(lang === 'am' ? 'en' : 'am');
    };

    return (
        <div className="font-sans bg-white p-4 sm:p-6 md:p-8">
            <div className="max-w-5xl mx-auto">
                <header className="bg-blue-700 text-white p-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <Hash className="h-10 w-10 mr-4 flex-shrink-0" />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1>
                        </div>
                    </div>
                    <button 
                        onClick={toggleLanguage}
                        className="p-2 rounded-full bg-white text-blue-700 hover:bg-blue-100 transition-colors"
                        aria-label="Toggle language"
                    >
                        <Globe className="h-6 w-6" />
                    </button>
                </header>

                <main className="p-4">
                    {/* Section 3.1: Issuance */}
                    <Section title={t.section3_1_Title} icon={<Key />}>
                        <ul className="space-y-3">
                            {t.issuanceRules.map((rule, i) => (
                                <RuleItem key={i} icon={<Info className="h-5 w-5 text-blue-500" />}>
                                    {rule}
                                </RuleItem>
                            ))}
                        </ul>
                    </Section>

                    {/* Section 3.2: Usage */}
                    <Section title={t.section3_2_Title} icon={<UserCheck />}>
                        <ul className="space-y-3">
                            {t.usageRules.map((rule, i) => (
                                <RuleItem key={i} icon={<CheckCircle className="h-5 w-5 text-green-600" />}>
                                    {rule}
                                </RuleItem>
                            ))}
                        </ul>
                    </Section>
                    
                    {/* Interactive Quiz */}
                    <ScenarioQuiz lang={lang} onQuizComplete={setQuizPassed} />

                    {/* Section 3.3: Cancellation */}
                    <Section title={t.section3_3_Title} icon={<XCircle />}>
                         <div className="p-4 bg-red-50 rounded-lg">
                             <h4 className="font-bold text-lg text-red-800 mb-3">{t.cancellationReasonsTitle}</h4>
                             <ul className="space-y-3">
                                {t.cancellationReasons.map((reason, i) => (
                                    <RuleItem key={i} icon={<AlertTriangle className="h-5 w-5 text-red-600" />}>
                                        {reason}
                                    </RuleItem>
                                ))}
                            </ul>
                        </div>
                    </Section>
                    <ChapterNavigation previous="/content/686e8e6123afc16ef4f67099" next="/content/686e8e6223afc16ef4f6709f" isPassed={quizPassed} lang={lang} />
                </main>
            </div>
        </div>
    );
}

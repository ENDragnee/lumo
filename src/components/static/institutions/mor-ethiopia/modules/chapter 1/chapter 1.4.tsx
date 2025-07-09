'use client';

import { useState, ReactNode } from 'react';
import {
    FileX2,
    Gavel,
    AlertTriangle,
    Bell,
    Clock,
    Globe,
    UserX,
    MessageSquareWarning,
    HelpCircle,
    Lightbulb,
    CheckSquare,
    DollarSign,
    ShieldAlert
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object (1-to-1 with PDF pages 37-42) ---
const content = {
    am: {
        title: "ምዕራፍ 4: ምዝገባን ስለመሰረዝና ስለ ቅጣቶች",
        langButton: "English",

        sectionCancellationTitle: "2.5. ምዝገባን ስለመሰረዝ",
        cancellationRules: [
            "የመመዝገብ ግዴታ ሲቋረጥ ምዝገባው እንዲሰረዝለት ለባለሥልጣኑ የሚያመለክት ሲሆን፣ በ30 ቀናት ወይም ባለሥልጣኑ በሚሰጠው ተጨማሪ ጊዜ ውስጥ መቅረብ አለበት።",
            "ባለሥልጣኑም በ90 ቀናት ውስጥ የመጨረሻ ኦዲት ሊያደርግ ይችላል።",
            "የአንድ ሰው ምዝገባ መሰረዝ በሌላ ታክስ ሕግ ለአንድ የተለየ ታክስ ዓላማ ሲባል የተደረገ ምዝገባ መሰረዝንም ይጨምራል።",
            "አንድ ሰው ምዝገባ እንዲሰረዝለት ጥያቄ ካላቀረበ፣ ባለሥልጣኑ ይህ ሰው ሥራውን ሙሉ በሙሉ ማቆሙን፣ መሞቱን፣ ወይም መፍረሱን ሲያረጋግጥ ለታክስ ከፋዩ ወይም እንደራሴው የጽሑፍ ማስታወቂያ በመስጠት ምዝገባውን ይሰርዛል።"
        ],
        
        quiz4Title: "ሙከራ አራት",
        quiz4Question: "ባለሥልጣኑ ታክስ ከፋዩን ከምዝገባ የሚሰርዝባቸው ምክንያቶችን ጥቀሱ።",
        quiz4Answer: "ባለሥልጣኑ አንድን ታክስ ከፋይ ከምዝገባ የሚሰርዘው በሁለት ዋና ዋና መንገዶች ነው፡ 1) ታክስ ከፋዩ ራሱ ግዴታው ሲቋረጥ ሲያመለክት፣ ወይም 2) ባለሥልጣኑ በራሱ ተነሳሽነት ታክስ ከፋዩ ሥራ ማቆሙን፣ መሞቱን (ለግለሰብ) ወይም መፍረሱን (ለድርጅት) ሲያረጋግጥ ነው።",
        showAnswer: "መልስ አሳይ",
        hideAnswer: "መልስ ደብቅ",

        sectionPenaltiesTitle: "ክፍል 6: አስተዳደራዊ እና የወንጀል ቅጣቶች",

        subsectionAdminPenaltiesTitle: "6.1. አስተዳደራዊ ቅጣቶች",
        adminPenaltyRegistration: {
            title: "ከምዝገባ እና ስረዛ ጋር የተያያዙ ቅጣቶች",
            items: [
                "በታክስ ከፋይነት መመዝገብ ሲገባው ያልተመዘገበ እንደሆነ: መከፈል ያለበትን ታክስ 25% መቀጮ እንዲከፍል ይደረጋል። በዚህ ጊዜ ውስጥ የሚከፈል ግብር ከሌለ ለየወሩ 1,000 ብር ቅጣት ይከፍላል።",
                "ከግብር ከፋይነት እንዲሰረዝ ያልጠየቀ: ለየወሩ 1,000 ብር ይቀጣል።"
            ]
        },
        adminPenaltyTIN: {
            title: "በታክስ ከፋይ መለያ ቁጥር (TIN) የሚጣል ቅጣት",
            items: [
                "መለያ ቁጥሩን ሰነድ ላይ ሳይገልጽ የቀረ: መለያ ቁጥር ባልተገለጸበት በእያንዳንዱ ሰነድ 3,000 ብር ቅጣት ይከፍላል።",
                "TIN አሳልፎ የሰጠም ሆነ የሌላን የተጠቀመ: 10,000 ብር ይቀጣል።",
                "ከላይ በተጠቀሱት ድርጊቶች ምክንያት የተገኘው የገንዘብ ጥቅም ከ10,000 ብር የሚበልጥ ከሆነ፣ የሚከፍለው የገንዘብ ቅጣት መጠን ካገኘው ጥቅም ጋር እኩል ይሆናል።"
            ]
        },

        subsectionCriminalLiabilityTitle: "6.2. የወንጀል ተጠያቂነት",
        criminalLiabilityText: "ማንኛውም ሰው ከአንድ በላይ የታክስ ከፋይ መለያ ቁጥር ለመውሰድ የሞከረ፣ የታክስ ከፋይ መለያ ቁጥሩን ሌላ ሰው እንዲጠቀምበት የሰጠ ወይም የሌላን ሰው የታክስ ከፋይ መለያ ቁጥር የተጠቀመ እንደሆነ በ20,000 ብር መቀጮ እና ከ1 እስከ 3 ዓመት በሚደርስ ቀላል እሥራት ይቀጣል።"
    },
    en: {
        title: "Chapter 4: Registration Cancellation & Penalties",
        langButton: "አማርኛ",

        sectionCancellationTitle: "2.5. About Cancelling Registration",
        cancellationRules: [
            "When the obligation to be registered ceases, the taxpayer must apply to the Authority for cancellation of the registration within 30 days or a further period allowed by the Authority.",
            "The Authority may conduct a final audit within 90 days.",
            "The cancellation of a person's registration also implies the cancellation of a registration made for a specific tax purpose under another tax law.",
            "If a person has not applied for cancellation, the Authority may cancel the registration by giving written notice to the taxpayer or their representative upon being satisfied that the person has ceased all business, passed away, or been dissolved."
        ],

        quiz4Title: "Test Four",
        quiz4Question: "State the reasons for which the Authority may cancel a taxpayer's registration.",
        quiz4Answer: "The Authority can cancel a registration in two main ways: 1) When the taxpayer applies for cancellation after their obligation ceases, or 2) On its own initiative, when the Authority confirms that the taxpayer has ceased business, died (for an individual), or been dissolved (for an entity).",
        showAnswer: "Show Answer",
        hideAnswer: "Hide Answer",

        sectionPenaltiesTitle: "Part 6: Administrative and Criminal Penalties",

        subsectionAdminPenaltiesTitle: "6.1. Administrative Penalties",
        adminPenaltyRegistration: {
            title: "Penalties related to Registration and Cancellation",
            items: [
                "Failure to register when required: A penalty of 25% of the tax due. If no tax is payable for the period, a penalty of 1,000 ETB for each month of the failure.",
                "Failure to apply for cancellation of registration: A penalty of 1,000 ETB for each month of the failure."
            ]
        },
        adminPenaltyTIN: {
            title: "Penalties for TIN Misuse",
            items: [
                "Failure to state the TIN on a document: A penalty of 3,000 ETB for each such failure.",
                "Giving away or using another's TIN: A penalty of 10,000 ETB.",
                "If the financial gain from the above acts exceeds 10,000 ETB, the penalty amount will be equal to the gain."
            ]
        },

        subsectionCriminalLiabilityTitle: "6.2. Criminal Liability",
        criminalLiabilityText: "Any person who attempts to obtain more than one Taxpayer Identification Number, gives their TIN for another person's use, or uses another person's TIN shall be punished with a fine of 20,000 ETB and with simple imprisonment for a term of 1 to 3 years."
    }
};

// --- Helper Components ---

const Section = ({ title, icon, children }: { title: string, icon: ReactNode, children: ReactNode }) => (
    <div className="mb-12">
        <div className="flex items-center mb-4 border-b-2 border-blue-200 pb-2">
            <div className="text-blue-600 mr-3">{icon}</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="space-y-4 text-gray-700 leading-relaxed pl-2">
            {children}
        </div>
    </div>
);

const Quiz = ({ title, question, answer, lang }: { title: string, question: string, answer: string, lang: 'am' | 'en' }) => {
    const [showAnswer, setShowAnswer] = useState(false);
    const t = content[lang];

    return (
        <div className="my-10 p-6 bg-yellow-50">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
            <p className="font-semibold text-gray-800 flex items-start">
                <HelpCircle className="h-5 w-5 mr-2 mt-1 flex-shrink-0"/>{question}
            </p>
            <button onClick={() => setShowAnswer(!showAnswer)} className="text-sm text-blue-600 hover:underline mt-2">
                {showAnswer ? t.hideAnswer : t.showAnswer}
            </button>
            {showAnswer && (
                <p className="mt-2 p-3 bg-green-50 flex items-start">
                    <Lightbulb className="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-green-600"/>{answer}
                </p>
            )}
        </div>
    );
};

// --- Main Chapter Component ---

export default function TaxRegistrationPenaltiesChapter() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const t = content[lang];

    const toggleLanguage = () => {
        setLang(lang === 'am' ? 'en' : 'am');
    };

    return (
        <div className="font-sans bg-white p-4 sm:p-6 md:p-8">
            <div className="max-w-5xl mx-auto">
                <header className="bg-blue-700 text-white p-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <Gavel className="h-10 w-10 mr-4 flex-shrink-0" />
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
                    {/* Cancellation Section */}
                    <Section title={t.sectionCancellationTitle} icon={<FileX2 />}>
                        <ul className="space-y-3">
                            {t.cancellationRules.map((rule, i) => (
                                <li key={i} className="flex items-start p-3 bg-gray-50 rounded-md">
                                    <CheckSquare className="h-5 w-5 mr-3 mt-1 text-blue-500 flex-shrink-0" />
                                    <span>{rule}</span>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    {/* Quiz Four */}
                    <Quiz title={t.quiz4Title} question={t.quiz4Question} answer={t.quiz4Answer} lang={lang} />

                    {/* Penalties Section */}
                    <Section title={t.sectionPenaltiesTitle} icon={<ShieldAlert />}>
                        {/* Administrative Penalties */}
                        <div className="p-5 bg-yellow-50 rounded-lg">
                            <h3 className="text-xl font-bold text-yellow-900 flex items-center mb-3">
                                <AlertTriangle className="h-6 w-6 mr-2" />
                                {t.subsectionAdminPenaltiesTitle}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">{t.adminPenaltyRegistration.title}</h4>
                                    <ul className="space-y-2 list-disc list-inside">
                                        {t.adminPenaltyRegistration.items.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">{t.adminPenaltyTIN.title}</h4>
                                     <ul className="space-y-2 list-disc list-inside">
                                        {t.adminPenaltyTIN.items.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Criminal Liability */}
                        <div className="mt-8 p-5 bg-red-100 rounded-lg">
                             <h3 className="text-xl font-bold text-red-900 flex items-center mb-3">
                                <Gavel className="h-6 w-6 mr-2" />
                                {t.subsectionCriminalLiabilityTitle}
                            </h3>
                            <p className="text-red-800 leading-relaxed">{t.criminalLiabilityText}</p>
                        </div>
                    </Section>
                    <ChapterNavigation previous="/content/686e8e6223afc16ef4f6709c" next="/content/686e8e6223afc16ef4f670a2" lang={lang} />
                </main>
            </div>
        </div>
    );
}

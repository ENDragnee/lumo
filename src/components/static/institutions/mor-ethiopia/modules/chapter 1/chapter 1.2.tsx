'use client';

import { useState, ReactNode } from 'react';
import {
    ClipboardList,
    FileText,
    Users,
    User,
    Building,
    Landmark,
    HeartHandshake,
    Church,
    Globe,
    BookUser,
    University,
    KeyRound,
    AlertTriangle,
    MapPin,
    UserCheck,
    BellRing,
    ChevronRight,
    HelpCircle,
    Lightbulb
} from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- i18n Content Object (1-to-1 with PDF pages 9-31) ---
const content = {
    am: {
        title: "ክፍል ሁለት: ለታክስ ከፋይነት ስለመመዝገብ",
        langButton: "English",
        
        section2_1_Title: "2.1. ለታክስ ከፋይነት የመመዝገብ ግዴታ ያለባቸው ሰዎች",
        obligationIntro: "አስቀድሞ የተመዘገበ ካልሆነ በስተቀር በታክስ ሕግ መሠረት ታክስ የመክፈል ኃላፊነት ያለበት ሰው በባለሥልጣኑ ዘንድ ለመመዝገብ ማመልከት አለበት፡፡",
        exemptionText: "ይህ በሰንጠረዥ “መ” መሰረት ገቢ ያገኘን በኢትዮጵያ ነዋሪ ያልሆነ ግለሰብ ወይም ድርጅትን እና አጠቃላይ ከሰንጠረዥ “መ” ጋር በተያያዘ ግብር የሚከፈልበት ገቢ ብቻ ያለው ግለሰብ ላይ ተፈጻሚ አይሆንም።",
        obligatedPartiesTitle: "የመመዝገብ ግዴታ ያለባቸው ወገኖች ዝርዝር:",
        obligatedParties: [
            "በንግድ ወይም በሙያ ሥራ (መቀጠርን ሳይጨምር) ገቢ የሚያገኝ",
            "ቤት ማከራየት ገቢ የሚያገኝ ግለሰብ",
            "ተቀጣሪ",
            "የመንግስት የልማት ድርጅት",
            "የመንግስት ባለበጀት መስሪያ ቤት",
            "መንግስታዊ ያልሆኑ ድርጅቶች",
            "የሃይማኖት ተቋማት",
            "በኢትዮጵያ ነዋሪ ያልሆነ ኩባንያ በቋሚነት የሚሰራ ድርጅት",
            "የወጪ መጋራት ተጠቃሚዎች",
            "በጋራ ሃብትነት ያልተመዘገበ ሃብት ያላቸው ሰዎች",
            "ባለ ልዩ መብት",
            "በመንግስታት መካከል በሚደረግ ስምምነት/በጽ/ቤት ማቋቋሚያ ስምምነት የሚቋቋም ድርጅት",
            "የኩባንያ አክሲዮን ባለድርሻ"
        ],
        employerNote: "ቀጣሪው ለተቀጣሪው በሚያመለክትበት ጊዜ የማንነት መለያ በተቀጣሪው መቅረብ አለበት። ቀጣሪው እንዲመዘገብ ያላደረገው ተቀጣሪ ካለበት የመመዝገብ ግዴታ ነጻ ሊያወጣው አይችልም።",
        timingNote: "ሥራውን ከመጀመሩ ወይም ገቢ ከማግኘቱ በፊት ለታክስ ከፋይነት ለመመዝገብ የምዝገባ ማመልከቻ ማቅረብ አለበት።",
        applicationProcessTitle: "የማመልከቻ ሂደት",
        applicationProcess: [
            "ማመልከቻው ባለሥልጣኑ ባጸደቀው ቅጽ መሠረት፣ የጣት አሻራ መለያን ጨምሮ የግለሰቡን ማንነት ከሚያረጋግጥ የሰነድ ማስረጃ ጋር መቅረብ አለበት።",
            "ማመልከቻው ግዴታው ከተጀመረበት ቀን አንስቶ በ21 ቀናት ውስጥ ወይም ባለሥልጣኑ በፈቀደው ተጨማሪ ጊዜ ውስጥ መቅረብ አለበት።",
            "ባለሥልጣኑ ማመልከቻውን ያልተቀበለው ከሆነ፣ ማመልከቻው ከቀረበበት ቀን ጀምሮ ባሉት 14 ቀናት ውስጥ በጽሑፍ ያሳውቃል።"
        ],

        section2_2_Title: "2.2. ማሟላት ያለበት ቅድመ ሁኔታ",
        prerequisitesIntro: "በምዝገባ ወቅት በሁሉም ተመዝጋቢዎች ላይ ተፈጻሚ የሚሆኑ ተግባራት:",
        generalPrerequisites: [
            "በባለሥልጣኑ የተዘጋጀውንና በሚገባ የተሞላውን ቅጽ መሙላት",
            "ወቅታዊ ወይም የታደሰ የነዋሪነት መታወቂያ/ፓስፖርት/የታደሰ መንጃ ፍቃድ",
            "ከ6 ወር ወዲህ የተነሳ ጉርድ ፎቶግራፍ"
        ],
        specificPrerequisitesTitle: "እንደ ተመዝጋቢው አይነት የሚለያዩ ቅድመ ሁኔታዎች:",
        prerequisiteCategories: [
            { type: "ግለሰብ", icon: User, items: ["የተዘጋጀውን ቅጽ ሞልቶ ማቅረብና የማንነት አካላዊ መረጃ መስጠት፤", "የነዋሪነት መታወቂያ፣ ፓስፖርት ወይም የታደሰ መንጃ ፍቃድ፤"] },
            { type: "የንግድ ማህበር", icon: Building, items: ["የተዘጋጀውን የማመልከቻ ቅጽ፤", "በሕግ ሥልጣን በተሰጠው አካል የፀደቀ የማህበር መመስረቻ ጽሑፍና መተዳደሪያ ደንብ፤", "የስራ ቦታ የባለቤትነት ማረጋገጫ ወይም በውልና ማስረጃ የፀደቀ የኪራይ ውል፤", "አመልካቹ ወኪል ከሆነ ሕጋዊ የውክልና ማስረጃ።"] },
            { type: "የመንግስት የልማት ድርጅት", icon: Landmark, items: ["ድርጅቱ የተቋቋመበት ሕግ፤", "የድርጅቱ ሥራ አስኪያጅ የምደባ ደብዳቤ፤", "የዋና ሥራ አስኪያጅ ፎቶግራፍ እና የታክስ ከፋይ መለያ ቁጥር፤", "አመልካቹ ወኪል ከሆነ ሕጋዊ የውክልና ማስረጃ።"] },
            { type: "መንግስታዊ ያልሆኑ ድርጅቶች", icon: HeartHandshake, items: ["የተዘጋጀውን ቅጽ፤", "በሕግ ሥልጣን በተሰጠው አካል የፀደቀ የመመስረቻ ጽሑፍና መተዳደሪያ ደንብ፤", "የሥራ አስኪያጅ የምደባ ደብዳቤ፤", "የስራአስኪያጁ ወቅታዊ የማንነት መግለጫ።"] },
            { type: "የሃይማኖት ተቋማት", icon: Church, items: ["የተዘጋጀውን ቅጽ፤", "አግባብ ባለው የመንግሥት አካል የተሰጠ የምዝገባ የምስክር ወረቀት፤", "ተቋሙን የሚወክል ሰው ሕጋዊ የውክልና ማስረጃ፤", "የበላይ ኃላፊ ወይም ተወካይ የማንነት መገለጫ።"] },
            { type: "ነዋሪ ያልሆነ ኩባንያ", icon: Globe, items: ["የተዘጋጀውን ቅጽ፤", "ኩባንያው በውጪ ሀገር የተመሠረተበት የምስክር ወረቀት፤", "በኢትዮጵያ የሚሠራበትን ቦታ አድራሻ የሚገልጽ ሰነድ፤", "የዋና ስራአስኪያጁ የማንነት መገለጫ።"] },
            { type: "የወጪ መጋራት ተማሪዎች", icon: University, items: ["የተዘጋጀውን ቅጽ፤", "የማንነት አካላዊ መረጃ መስጠት፤", "በሚማርበት ዩኒቨርስቲ የታደሰ መታወቂያ ካርድ ማቅረብ።"] },
            { type: "ሌሎች", icon: BookUser, items: ["የጋራ ሀብት ከሆነ በውክልና የተረጋገጠ የሰነድ ማስረጃ፤", "ባለልዩ መብት ከሆነ ከውጭ ጉዳይ ሚኒስቴር የተረጋገጠ ማስረጃ፤", "የግለሰብ የማንነት መግለጫ።"] }
        ],
        quiz1Title: "ሙከራ አንድ",
        quiz1Question: "አንድ ሰው ለታክስ ከፋይነት ለመመዝገብ ምን ምን ቅድመ-ሁኔታዎችን ማሟላት አለበት?",
        quiz1Answer: "መልሱ እንደ ተመዝጋቢው አይነት ይለያያል። ለምሳሌ ሁሉም ተመዝጋቢዎች የተሞላ ቅጽ፣ መታወቂያ እና ፎቶ ማቅረብ ሲገባቸው፣ እንደ የንግድ ማህበር ያሉ አካላት ደግሞ ተጨማሪ የመመስረቻ ጽሑፍ እና የኪራይ ውል ማቅረብ ይጠበቅባቸዋል።",
        
        section2_3_Title: "2.3. የምዝገባ ቦታ",
        locationGeneral: "ታክስ ከፋዩ ነዋሪ በሆነበት ወይም የንግድ ሥራውን በሚያከናውንበት ስፍራ ባለው የታክስ ቅርንጫፍ ነው።",
        locationLegalEntity: "ሕጋዊ ሰውነት ያለው ድርጅት መመዝገብ ያለበት ዋና መሥሪያ ቤቱ በሚገኝበት አካባቢ ነው።",
        locationMultipleRegionsAlert: "ከአንድ በላይ በሆነ ክልል ወይም ከተማ አስተዳደር ውስጥ በንግድ ሥራ የተሠማራ ወይም ቤት በማከራየት ገቢ የሚያገኝ ግለሰብ ወይም ድርጅት ገቢውን ባገኘበት መመዝገብ አለበት።",
        locationSameRegion: "በአንድ ክልል ወይም ከተማ አስተዳደር ውስጥ በተለያየ ቦታ የሚሰራ ከሆነ መመዝገብ ያለበት ዋና መሥሪያ ቤቱ በሚገኝበት ቦታ ነው።",
        locationAddressNote: "በተለያዩ ቦታዎች የሚሰራ ከሆነ በምዝገባ ማመልከቻ ቅፅ ላይ የሁሉንም አድራሻ እና የንግድ ዓይነት ዝርዝር መሙላት አለበት።",
        
        section2_4_Title: "2.4. የታክስ ከፋይ ምዝገባ ልዩ ሁኔታዎች",
        specialCases: [
            { title: "ለአካለ መጠን ያልደረሰ ልጅ", text: "አመልካቹ ለአካለ መጠን ያልደረሰ ልጅ ሞግዚት በሚሆንበት ጊዜ፤ ልዩ የማንነት አካላዊ መረጃ እንዲሰጥ በማድረግ በልጁ ስም ይመዘገባል። የማስተዳደር ኃላፊነቱ ግን የሞግዚቱ ይሆናል።", icon: UserCheck },
            { title: "ያልተመዘገበን ሰው መመዝገብ", text: "መመዝገብ ሲኖርበት ያልተመዘገበን ሰው ባለሥልጣኑ ሊመዘግብ የሚችል ሲሆን፣ በ10 ቀናት ውስጥ ታክስ ከፋዩ በአካል ቀርቦ እንዲመዘገብ በደብዳቤ ጥሪ ሊያደርግለት ይችላል።", icon: BellRing },
            { title: "የኤሌክትሮኒክስ ምዝገባ", text: "ባለሥልጣኑ በኤሌክትሮኒክስ ዘዴ ሊመዘገብ ይችላል።", icon: ClipboardList },
            { title: "በውጭ የሚኖሩ ኢትዮጵያውያን", text: "በውጪ ሀገር የሚኖር ኢትዮጵያዊ ዜግነት ያለው ሰው በአካባቢው በሚገኝ የኢትዮጵያ ኢምባሲ ወይም ቆንስላ በአካል በመገኘት የማንነት አካላዊ መረጃ በመስጠት መመዝገብ ይችላል።", icon: Globe }
        ],

        quiz2Title: "ሙከራ ሁለት",
        quiz2Question1: "የታክስ ከፋይ ምዝገባ የሚከናወንበትን የምዝገባ ቦታ ግለጹ?",
        quiz2Answer1: "ምዝገባ የሚካሄደው ግብር ከፋዩ በሚኖርበት ወይም ስራውን በሚያከናውንበት አካባቢ ባለው የግብር ቅርንጫፍ ነው። ህጋዊ ሰውነት ያላቸው ድርጅቶች ዋና መስሪያ ቤታቸው በሚገኝበት ይመዘገባሉ።",
        quiz2Question2: "በታክስ ምዝገባ በልዩ ሁኔታዎች የሚስተናገዱት እነማን ናቸው?",
        quiz2Answer2: "በልዩ ሁኔታ የሚስተናገዱት: 1) በሞግዚት ስር ያሉ ለአቅመ አዳም ያልደረሱ ልጆች፣ 2) በራሳቸው ጊዜ ያልተመዘገቡና በባለስልጣኑ የሚመዘገቡ ሰዎች፣ 3) በኤሌክትሮኒክስ ዘዴ የሚመዘገቡ፣ እና 4) በውጭ አገር ሆነው በኢምባሲ/ቆንስላ የሚመዘገቡ ኢትዮጵያውያን ናቸው።",

        showAnswer: "መልስ አሳይ",
        hideAnswer: "መልስ ደብቅ"
    },
    en: {
        title: "Part Two: About Taxpayer Registration",
        langButton: "አማርኛ",

        section2_1_Title: "2.1. Persons Obligated to Register for Taxpayer Status",
        obligationIntro: "Unless already registered, a person who is liable to pay tax under a tax law must apply to the Authority for registration.",
        exemptionText: "This shall not apply to a non-resident individual or entity who has received income subject to tax under Schedule 'D' and an individual whose only taxable income is related to Schedule 'D'.",
        obligatedPartiesTitle: "List of Obligated Parties:",
        obligatedParties: [
            "Anyone earning income from business or profession (excluding employment)",
            "An individual earning rental income",
            "Employee",
            "Public Development Enterprise",
            "Government Budgetary Institution",
            "Non-Governmental Organizations (NGOs)",
            "Religious Institutions",
            "A non-resident company with a permanent establishment in Ethiopia",
            "Cost-sharing beneficiaries",
            "Persons with unregistered joint property",
            "Persons with special privileges",
            "An organization established by inter-governmental agreement",
            "A shareholder of a company"
        ],
        employerNote: "When the employer applies on behalf of the employee, the identity document must be provided by the employee. An employer's failure to register an employee does not absolve the employee of their registration obligation.",
        timingNote: "The registration application must be submitted before starting the business or earning income.",
        applicationProcessTitle: "Application Process",
        applicationProcess: [
            "The application must be in the form approved by the Authority and must be accompanied by documentary evidence confirming the person's identity, including fingerprint identification.",
            "The application must be filed within 21 days from the date the obligation to register arises, or within a further period allowed by the Authority.",
            "If the Authority rejects the application, it shall notify the applicant in writing within 14 days from the date of the application."
        ],
        
        section2_2_Title: "2.2. Prerequisites to be Fulfilled",
        prerequisitesIntro: "Requirements applicable to all applicants during registration:",
        generalPrerequisites: [
            "Filling out the form prepared and duly completed by the Authority",
            "A current or renewed resident ID / passport / renewed driver's license",
            "A passport-sized photograph taken within the last 6 months"
        ],
        specificPrerequisitesTitle: "Specific prerequisites based on applicant type:",
        prerequisiteCategories: [
            { type: "Individual", icon: User, items: ["Submit the completed form and provide biometric identity data;", "Resident ID, passport, or renewed driver's license."] },
            { type: "Business Association", icon: Building, items: ["The completed application form;", "Memorandum and articles of association approved by the legally authorized body;", "Proof of ownership of the business premises or a rental agreement authenticated by the Document Authentication and Registration Agency;", "If the applicant is an agent, a legal power of attorney."] },
            { type: "Public Development Enterprise", icon: Landmark, items: ["The law establishing the enterprise;", "The appointment letter of the enterprise's manager;", "The general manager's photograph and Taxpayer Identification Number;", "If the applicant is an agent, a legal power of attorney."] },
            { type: "NGOs", icon: HeartHandshake, items: ["The completed form;", "Memorandum and articles of association approved by the legally authorized body;", "The manager's appointment letter;", "The manager's current identity document."] },
            { type: "Religious Institutions", icon: Church, items: ["The completed form;", "A registration certificate issued by the relevant government body;", "A legal power of attorney for the person representing the institution;", "Identity document of the head or representative."] },
            { type: "Non-resident Company", icon: Globe, items: ["The completed form;", "The company's certificate of incorporation from its country of origin;", "A document specifying the address of the permanent establishment in Ethiopia;", "The identity document of the general manager."] },
            { type: "Cost-Sharing Students", icon: University, items: ["The completed form;", "Provide biometric identity data;", "Submit a renewed ID card from their university."] },
            { type: "Others", icon: BookUser, items: ["For joint property, an authenticated power of attorney document;", "For persons with special privileges, a confirmation from the Ministry of Foreign Affairs;", "Individual's identity document."] }
        ],
        quiz1Title: "Test One",
        quiz1Question: "What are the prerequisites a person must fulfill to register for tax purposes?",
        quiz1Answer: "The answer varies by applicant type. For example, all applicants must provide a completed form, ID, and photo. Entities like business associations must also provide additional documents like articles of association and a rental agreement.",

        section2_3_Title: "2.3. Registration Location",
        locationGeneral: "Registration is at the tax branch office in the area where the taxpayer resides or conducts their business.",
        locationLegalEntity: "A legal entity must register in the area where its head office is located.",
        locationMultipleRegionsAlert: "An individual or entity engaged in business or earning rental income in more than one region or city administration must register where the income is earned.",
        locationSameRegion: "If operating in different places within the same region or city administration, registration should be at the location of the head office.",
        locationAddressNote: "If operating in various locations, the details of all addresses and business types must be filled out on the registration application form.",
        
        section2_4_Title: "2.4. Special Cases for Taxpayer Registration",
        specialCases: [
            { title: "Minor Children", text: "When the applicant is a guardian for a minor, registration is done in the minor's name after providing the guardian's unique biometric data. The administrative responsibility, however, lies with the guardian.", icon: UserCheck },
            { title: "Registering an Unregistered Person", text: "The Authority can register a person who should have registered but failed to do so. It can issue a summons for the taxpayer to appear in person within 10 days to complete the registration.", icon: BellRing },
            { title: "Electronic Registration", text: "The Authority may register taxpayers using electronic means.", icon: ClipboardList },
            { title: "Ethiopians Living Abroad", text: "An Ethiopian citizen living abroad can register by appearing in person at a nearby Ethiopian embassy or consulate to provide their biometric identity data.", icon: Globe }
        ],

        quiz2Title: "Test Two",
        quiz2Question1: "Describe the location where taxpayer registration is carried out.",
        quiz2Answer1: "Registration is done at the tax branch where the taxpayer lives or works. Legal entities register where their head office is located.",
        quiz2Question2: "Who are those handled under special circumstances in tax registration?",
        quiz2Answer2: "Those handled under special circumstances are: 1) Minors under guardianship, 2) Persons who fail to self-register and are registered by the authority, 3) Those registered electronically, and 4) Ethiopians registering abroad via embassies/consulates.",
        
        showAnswer: "Show Answer",
        hideAnswer: "Hide Answer"
    }
};

// --- Helper Components ---

const Section = ({ title, icon, children }: { title: string, icon: ReactNode, children: ReactNode }) => (
    <div className="mb-12">
        <div className="flex items-center mb-4 border-b-2 border-blue-200 pb-2">
            <div className="text-blue-600 mr-3">{icon}</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="space-y-6 text-gray-700 leading-relaxed pl-2">
            {children}
        </div>
    </div>
);

const Quiz = ({ title, q1, a1, q2, a2, lang }: { title: string, q1: string, a1: string, q2?: string, a2?: string, lang: 'am' | 'en' }) => {
    const [showAnswer1, setShowAnswer1] = useState(false);
    const [showAnswer2, setShowAnswer2] = useState(false);
    const t = content[lang];

    return (
        <div className="my-10 p-6 bg-yellow-50">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
            {/* Question 1 */}
            <div className="mb-4">
                <p className="font-semibold text-gray-800 flex items-start"><HelpCircle className="h-5 w-5 mr-2 mt-1 flex-shrink-0"/>{q1}</p>
                <button onClick={() => setShowAnswer1(!showAnswer1)} className="text-sm text-blue-600 hover:underline mt-2">{showAnswer1 ? t.hideAnswer : t.showAnswer}</button>
                {showAnswer1 && <p className="mt-2 p-3 bg-green-50 flex items-start"><Lightbulb className="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-green-600"/>{a1}</p>}
            </div>
            {/* Question 2 (optional) */}
            {q2 && a2 && (
                <div>
                    <p className="font-semibold text-gray-800 flex items-start"><HelpCircle className="h-5 w-5 mr-2 mt-1 flex-shrink-0"/>{q2}</p>
                    <button onClick={() => setShowAnswer2(!showAnswer2)} className="text-sm text-blue-600 hover:underline mt-2">{showAnswer2 ? t.hideAnswer : t.showAnswer}</button>
                    {showAnswer2 && <p className="mt-2 p-3 bg-green-50 flex items-start"><Lightbulb className="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-green-600"/>{a2}</p>}
                </div>
            )}
        </div>
    );
};


// --- Main Chapter Component ---

export default function TaxRegistrationChapterTwo() {
    const [lang, setLang] = useState<'am' | 'en'>('am');
    const [activeTab, setActiveTab] = useState(0);
    const t = content[lang];

    const toggleLanguage = () => {
        setLang(lang === 'am' ? 'en' : 'am');
        setActiveTab(0); // Reset tab on language change to avoid index issues
    };

    return (
        <div className="font-sans bg-white p-4 sm:p-6 md:p-8">
            <div className="max-w-5xl mx-auto">
                <header className="bg-blue-700 text-white p-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <ClipboardList className="h-10 w-10 mr-4 flex-shrink-0" />
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
                    {/* Section 2.1 */}
                    <Section title={t.section2_1_Title} icon={<FileText />}>
                        <p>{t.obligationIntro}</p>
                        <div className="p-3 bg-blue-50 rounded-md text-sm">{t.exemptionText}</div>
                        <h4 className="font-bold text-lg mt-4">{t.obligatedPartiesTitle}</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                            {t.obligatedParties.map((party, i) => <li key={i} className="flex items-start"><ChevronRight className="h-5 w-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0"/><span>{party}</span></li>)}
                        </ul>
                        <div className="mt-6 p-4 bg-gray-100">
                            <p className="mb-2">{t.employerNote}</p>
                            <p className="font-semibold">{t.timingNote}</p>
                        </div>
                        <h4 className="font-bold text-lg mt-6">{t.applicationProcessTitle}</h4>
                        <ul className="space-y-2 list-decimal list-inside">
                            {t.applicationProcess.map((step, i) => <li key={i}>{step}</li>)}
                        </ul>
                    </Section>

                    {/* Section 2.2 */}
                    <Section title={t.section2_2_Title} icon={<Users />}>
                        <div className="p-4 bg-gray-50 rounded-lg">
                             <h4 className="font-bold text-lg">{t.prerequisitesIntro}</h4>
                             <ul className="list-disc list-inside space-y-1 mt-2">
                                 {t.generalPrerequisites.map((req, i) => <li key={i}>{req}</li>)}
                             </ul>
                        </div>
                        <div className="mt-6">
                            <h4 className="font-bold text-lg mb-3">{t.specificPrerequisitesTitle}</h4>
                             {/* Tabs for Specific Prerequisites */}
                             <div className="flex flex-col">
                                 <div className="flex flex-wrap border-b border-gray-200">
                                     {t.prerequisiteCategories.map((cat, index) => {
                                         const Icon = cat.icon;
                                         return (
                                             <button
                                                 key={index}
                                                 onClick={() => setActiveTab(index)}
                                                 className={`flex items-center py-3 px-4 text-sm font-medium -mb-px border-b-2 transition-colors duration-200 ${activeTab === index ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                             >
                                                 <Icon className="h-5 w-5 mr-2"/> {cat.type}
                                             </button>
                                         )
                                     })}
                                 </div>
                                 <div className="mt-4 p-4 bg-gray-50">
                                     <ul className="space-y-2">
                                         {t.prerequisiteCategories[activeTab].items.map((item, i) => (
                                             <li key={i} className="flex items-start"><ChevronRight className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0"/><span>{item}</span></li>
                                         ))}
                                     </ul>
                                 </div>
                             </div>
                        </div>
                    </Section>

                    <Quiz title={t.quiz1Title} q1={t.quiz1Question} a1={t.quiz1Answer} lang={lang} />
                    
                    {/* Section 2.3 */}
                    <Section title={t.section2_3_Title} icon={<MapPin />}>
                        <p>{t.locationGeneral}</p>
                        <p>{t.locationLegalEntity}</p>
                        <div className="p-4 bg-red-50 text-red-800">
                            <p className="flex items-start"><AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0"/><span>{t.locationMultipleRegionsAlert}</span></p>
                        </div>
                        <p>{t.locationSameRegion}</p>
                        <p className="font-medium">{t.locationAddressNote}</p>
                    </Section>

                    {/* Section 2.4 */}
                    <Section title={t.section2_4_Title} icon={<KeyRound />}>
                        <div className="space-y-4">
                            {t.specialCases.map((sc, i) => {
                                const Icon = sc.icon;
                                return (
                                <div key={i} className="p-4 hover:shadow-md transition-shadow">
                                    <h4 className="font-bold text-lg flex items-center mb-2"><Icon className="h-5 w-5 mr-2 text-blue-600"/>{sc.title}</h4>
                                    <p>{sc.text}</p>
                                </div>
                            )})}
                        </div>
                    </Section>

                    <Quiz title={t.quiz2Title} q1={t.quiz2Question1} a1={t.quiz2Answer1} q2={t.quiz2Question2} a2={t.quiz2Answer2} lang={lang} />
                    <ChapterNavigation previous="/content/686e8e6123afc16ef4f67096" next="/content/686e8e6223afc16ef4f6709c" lang={lang} />
                </main>
            </div>
        </div>
    );
}

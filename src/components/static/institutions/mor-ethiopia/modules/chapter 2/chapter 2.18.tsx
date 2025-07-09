'use client';

import { useState } from 'react';
import { BookCheck, FileQuestion, Send, CheckCircle, XCircle } from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- Expanded Quiz Data ---
const quizData = {
    multipleChoice: {
        title: "ክፍል አንድ፡ የባለብዙ ምርጫ ጥያቄዎች",
        instructions: "መመሪያ፡ ከቀረቡት አማራጮች ውስጥ ትክክለኛውን መልስ ይምረጡ።",
        questions: [
            { q: 'በታክስ ሕጉ መሠረት የሂሳብ መዝገብ የመያዝ ግዴታ ያለባቸው እነማን ናቸው?', options: ['የደረጃ "ሐ" ግብር ከፋዮች ብቻ', 'የደረጃ "ሀ" እና "ለ" ግብር ከፋዮች', 'ሁሉም የንግድ ድርጅቶች ያለ ምንም ልዩነት', 'ዓመታዊ ገቢያቸው ከ500,000 ብር በላይ የሆኑ ብቻ'], correct: 1 },
            { q: "አንድ ድርጅት ያቀረበው የወጪ ማስረጃ (ደረሰኝ) በታክስ ባለስልጣኑ ውድቅ ቢደረግበት ነገር ግን ወጪው ለንግዱ አስፈላጊ እንደሆነ ከታመነ፣ ለዕቃና አገልግሎት ግዢ በወጪነት ሊያዝለት የሚችለው...", options: ["ከገበያ ዋጋው 100%", "ከገበያ ዋጋው 50%", "ከገበያ ዋጋው 65%", "ምንም ሊያዝለት አይችልም"], correct: 2 },
            { q: "ለረጅም ጊዜ በሚቆይ ውል (ለምሳሌ በኮንስትራክሽን) ላይ የተሰማራ ድርጅት ገቢውን በሂሳብ መዝገቡ ላይ የሚያስመዘግበው በየትኛው ዘዴ ነው?", options: ["ውሉ ሙሉ በሙሉ ሲጠናቀቅ", "በየዓመቱ በተጠናቀቀው የሥራ መቶኛ ልክ (Percentage of Completion)", "ጥሬ ገንዘብ በተቀበለበት ጊዜ ብቻ", "በቅድሚያ ክፍያ (Advance Payment) ላይ ተመስርቶ"], correct: 1 },
            { q: "አንድ የብድር ስምምነት ለታክስ ወጪ ቅነሳ ተቀባይነት እንዲኖረው ወሳኝ የሆነው ቅድመ ሁኔታ ምንድን ነው?", options: ["የብድር ስምምነቱ በጠበቃ መረጋገጡ", "በስምምነቱ ላይ የቴምብር ቀረጥ መከፈሉ", "ብድሩ ከፋይናንስ ተቋም ብቻ መገኘቱ", "የወለድ መጠኑ ከ10% በታች መሆኑ"], correct: 1 },
            { q: "አንድ ድርጅት በውጭ ሀገር ከፍሎት የመጣን የገቢ ግብር በኢትዮጵያ ታክስ ላይ ለማካካስ (Foreign Tax Credit) ሲጠይቅ፣ ሊካካስለት የሚችለው ከፍተኛው መጠን...", options: ["በውጭ ሀገር የተከፈለው ሙሉ ታክስ", "በኢትዮጵያ ህግ መሠረት ለዚያ ገቢ የሚከፈለው ታክስ", "ከሁለቱ (ከሀ እና ለ) ያነሰው መጠን", "ከሁለቱ (ከሀ እና ለ) የበለጠው መጠን"], correct: 2 },
            { q: "በኢትዮጵያ እና በሌላ ሀገር መካከል የግብር ስምምነት (Tax Treaty) ካለ እና ከሀገር ውስጥ ህግ ጋር ግጭት ከተፈጠረ የትኛው ተፈጻሚ ይሆናል?", options: ["የሀገር ውስጥ የግብር ሕጉ", "የግብር ስምምነቱ ድንጋጌ", "ሁለቱም ተፈጻሚ አይሆኑም", "ጉዳዩ በፍርድ ቤት ይወሰናል"], correct: 1 },
            { q: "አንድ የንግድ ድርጅት ሥራውን ካቋረጠ በኋላ በእጁ ያሉትን የንግድ ዕቃዎች ሲሸጥ፣ ግብር የሚከፈልበት ትርፍ የሚሰላው እንዴት ነው?", options: ["ከሽያጭ ዋጋው ላይ ምንም ሳይቀነስ", "ከሽያጭ ዋጋው ላይ የዕቃዎቹን የመዝገብ ዋጋ (Book Value) በመቀነስ", "ከሽያጭ ዋጋው ላይ 50% በመቀነስ", "ሥራ ስላቆመ ከግብር ነፃ ነው"], correct: 1 },
            { q: "አንድ ድርጅት ያጋጠመውን ኪሳራ ወደሚቀጥለው ዓመት ለማሸጋገር፣ በኪሳራው ዓመት እና በሚሸጋገርበት ዓመት መካከል የድርጅቱ የባለቤትነት ድርሻ ቢያንስ ምን ያህል በመቶ በተመሳሳይ ሰው እጅ መቆየት አለበት?", options: ["25%", "100%", "51%", "50%"], correct: 3 },
            { q: "የሂሳብ አያያዝ ሶፍትዌር የሚጠቀም ግብር ከፋይ ለታክስ ባለስልጣኑ ምን የማቅረብ ግዴታ አለበት?", options: ["የሶፍትዌሩን መግዣ ዋጋ ደረሰኝ", "የሶፍትዌሩን የአጠቃቀም ማንዋል (User Manual)", "የሶፍትዌር ባለሙያውን የብቃት ማረጋገጫ", "ምንም ግዴታ የለበትም"], correct: 1 },
            { q: "ከሚከተሉት ውስጥ የካፒታል ሀብት (Capital Asset) ዝውውር ሲኖር በሂሳብ መዝገብ መያዝ ከሚገባቸው መረጃዎች ውስጥ የማይካተተው የትኛው ነው?", options: ["ሀብቱ የተገኘበት ቀንና ዋጋ", "ሀብቱን ለማሻሻል የወጣ ወጪ", "ሀብቱን የሸጠው ሰራተኛ ስም", "ሀብቱ የተላለፈበት (የተሸጠበት) ዋጋ"], correct: 2 },
            { q: "በማዕድንና ነዳጅ ሥራ ላይ ለተሰማራ ድርጅት የተፈቀደው የገቢ ግብር መጣኔ ስንት ነው?", options: ["30%", "35%", "25%", "10%"], correct: 2 },
            { q: 'በታክስ ሕጉ መሠረት "ከግብር መሸሽ" (Tax Avoidance) እና "ግብር መሰወር" (Tax Evasion) መካከል ያለው መሠረታዊ ልዩነት ምንድን ነው?', options: ["ሁለቱም አንድ ዓይነት ትርጉም አላቸው", "መሸሽ ሕጋዊช่องทางን መጠቀም ሲሆን፣ መሰወር ሕገ-ወጥ ድርጊት ነው", "መሰወር ሕጋዊ ሲሆን፣ መሸሽ ሕገ-ወጥ ነው", "ልዩነታቸው በገንዘቡ መጠን ላይ ነው"], correct: 1 },
            { q: "አንድ ድርጅት ከፋይናንስ ተቋም ውጭ በብድር ያገኘው ገንዘብ በምን መልክ መተላለፍ አለበት?", options: ["በጥሬ ገንዘብ", "በባንክ በኩል", "በዕቃ መልክ", "ምንም ገደብ የለውም"], correct: 1 },
            { q: 'የደረጃ "ለ" ግብር ከፋይ ሊጠቀምበት የሚችለው የሂሳብ አያያዝ ዘዴ የቱ ነው?', options: ["የተሟላ የሂሳብ አያያዝ ዘዴ ብቻ", "ቀለል ያለ የሂሳብ አያያዝ ዘዴ", "የሂሳብ መዝገብ መያዝ አይጠበቅበትም", "በግምት ብቻ"], correct: 1 },
            { q: "የውጭ ምንዛሬን ወደ ብር በመቀየር የሚመጣን የትርጉም ትርፍ ወይም ኪሳራ (Translation Gain/Loss) ለማስላት መነሻ የሚሆነው የትኛው የምንዛሬ ተመን ነው?", options: ["የጥቁር ገበያ ተመን", "የኢትዮጵያ ብሔራዊ ባንክ ተመን", "የአውሮፓ ማዕከላዊ ባንክ ተመን", "የግብር ከፋዩ ምርጫ"], correct: 1 },
            { q: "አንድ የንግድ ድርጅት የሰራተኞቹን የደመወዝ ወጪ (Payroll) በተቀናሽነት ለማስያዝ የግድ ማቅረብ ያለበት ሰነድ ምንድን ነው?", options: ["የሰራተኞቹን የቅጥር ውል", "የሰራተኞቹን ሙሉ ስም እና የደመወዝ መጠን የያዘ ዝርዝር (ፔሮል)", "የድርጅቱን የሰው ሀይል መመሪያ", "የሰራተኞቹን የትምህርት ማስረጃ"], correct: 1 },
            { q: "በማዕድን ሥራ ላይ የተሰማራ ድርጅት ያጋጠመውን ኪሳራ ለስንት ዓመታት ማሸጋገር ይችላል?", options: ["5 ዓመት", "2 ዓመት", "10 ዓመት", "ኪሳራ ማሸጋገር አይችልም"], correct: 2 },
            { q: 'በገቢ ግብር ሕጉ መሠረት "የማሸጋገሪያ ዋጋ" (Transfer Pricing) ደንብ ዓላማው ምንድን ነው?', options: ["በዝምድና ባላቸው ኩባንያዎች መካከል የሚደረግ የዋጋ ማዛባትን ለመቆጣጠር", "የገበያ ዋጋን ለመወሰን", "የውጭ ምንዛሬን ለመቆጣጠር", "የዋጋ ንረትን ለመቀነስ"], correct: 0 },
            { q: "የሂሳብ መግለጫ ውድቅ ሲደረግበት፣ ታክስ የሚወሰነው...", options: ["በፍርድ ቤት ውሳኔ", "በቀድሞው ዓመት ክፍያ ላይ ተመስርቶ", "በግምት", "ለዚያ ዓመት ታክስ አይከፈልም"], correct: 2 },
            { q: "በውጭ ሀገር የንግድ ስራ ኪሳራ የገጠመው ነዋሪ የሆነ ግብር ከፋይ፣ ኪሳራውን...", options: ["በኢትዮጵያ ውስጥ ካገኘው ገቢ ጋር ማካካስ ይችላል", "በውጭ ሀገር ካገኘው ገቢ ላይ ብቻ ነው ማካካስ የሚችለው", "ኪሳራው ምንም ዓይነት የታክስ ቅናሽ አያስገኝለትም", "ለበጎ አድራጎት እንደተሰጠ ይቆጠራል"], correct: 1 },
            { q: "የሂሳብ መዝገብ የሚያዘጋጅ ባለሙያ ብቃቱ የሚረጋገጠው በምንድን ነው?", options: ["በድርጅቱ ዋና ሥራ አስፈጻሚ ውሳኔ", "ከታወቀ የትምህርት ተቋም በቂ የሂሳብ ትምህርት ያለው መሆኑ", "ቢያንስ 10 ዓመት የሥራ ልምድ ሲኖረው", "ለ እና ሐ"], correct: 1 },
            { q: "አንድ ድርጅት ከዋና ሥራው በተጨማሪ ቤት የሚያከራይ ከሆነ የሂሳብ መግለጫውን እንዴት ማዘጋጀት አለበት?", options: ["ሁሉንም ገቢና ወጪ በአንድ ላይ በመደመር", "ለእያንዳንዱ የሥራ ዘርፍ (ለኪራይ እና ለዋና ሥራው) በተናጠል አዘጋጅቶ ከዚያም ጠቅልሎ ማቅረብ", "የኪራይ ገቢውን ብቻ ሪፖርት ማድረግ", "የዋና ሥራውን ብቻ ሪፖርት ማድረግ"], correct: 1 },
            { q: "ታክስ ባለስልጣኑ ከአንድ ግብር ከፋይ ተጨማሪ መረጃ ሲጠይቅ ለመረጃው አቀራረብ የሚሰጠው ጊዜ ከስንት ቀን ያነሰ መሆን የለበትም? (ለመጀመሪያ ጊዜ ሲጠየቅ)", options: ["3 ቀናት", "7 ቀናት", "10 ቀናት", "30 ቀናት"], correct: 2 },
            { q: "በሁለትና ከዚያ በላይ የሆኑ ነዋሪ ኩባንያዎች ሲዋሃዱ (Merger)፣ ይህ ሂደት በታክስ ሕጉ እንደ...", options: ["የኩባንያ እንደገና መደራጀት (Reorganization) ይቆጠራል", "የኩባንያ መዘጋት (Liquidation) ይቆጠራል", "የንብረት ሽያጭ ይቆጠራል", "ከታክስ ሕጉ ጋር ግንኙነት የለውም"], correct: 0 },
            { q: "በውጭ ምንዛሪ የሚፈጸም ግብይት በሂሳብ መዝገብ ላይ ሲሰፍር ወደ ብር መቀየር ያለበት መቼ ነው?", options: ["በዓመቱ መጨረሻ", "ግብይቱ በተፈጸመበት ቀን ባለው የምንዛሬ ተመን", "ገንዘቡ ወደ ባንክ ሲገባ", "በግብር ከፋዩ አመቺ በሆነ ጊዜ"], correct: 1 },
            { q: "አንድ ሥራ ተቋራጭ ለመንግስት መ/ቤት የኮንስትራክሽን አገልግሎት ሲሰጥ የውል ስምምነቱ...", options: ["የግድ መመዝገብ አለበት", "መመዝገብ አያስፈልገውም", "የቴምብር ቀረጥ ብቻ መክፈል አለበት", "በውሉ ዋጋ ይወሰናል"], correct: 1 },
            { q: "አንድ ድርጅት ኪሳራውን ወደሚቀጥለው ዓመት ካሸጋገረ በኋላ፣ በሁለተኛው ዓመት ትርፍ ካገኘ、 የዚያን ዓመት ታክስ ሲያሰላ...", options: ["ሙሉ ትርፉ ላይ ታክስ ይከፍላል", "ካገኘው ትርፍ ላይ የተሸጋገረውን ኪሳራ ቀንሶ በቀሪው ላይ ታክስ ይከፍላል", "ኪሳራ ስለነበረው ለዚያ ዓመት ታክስ አይከፍልም", "የኪሳራውን ግማሽ ብቻ ነው የሚቀንሰው"], correct: 1 },
            { q: "አንድ የንግድ ድርጅት የካፒታል መጠን መግለጫ ሲያዘጋጅ ምንን ማካተት አለበት?", options: ["የተከፈለ እና ያልተከፈለ የካፒታል መጠን", "ያልተከፋፈለ የተጣራ ትርፍ", "የባለአክሲዮኖች ዝርዝር", "ሀ እና ለ"], correct: 3 },
            { q: "የማዕድን ፍለጋ ወጪ (Exploration cost) በታክስ ስሌት ወቅት እንዴት ይታያል?", options: ["ተቀናሽ የማይደረግ ወጪ ነው", "ሙሉ በሙሉ በዚያው ዓመት ተቀናሽ ይደረጋል", "በተፈቀደው ደንብ መሠረት ተቀናሽ የሚደረግ ወጪ ነው", "በገቢነት ይመዘገባል"], correct: 2 },
            { q: "የሂሳብ መግለጫ ላይ ያልተገለጸ ገቢ መኖሩ በኦዲት ሲረጋገጥ፣ ታክስ ባለስልጣኑ ምን እርምጃ ይወስዳል?", options: ["የሂሳብ መግለጫውን ሙሉ በሙሉ ውድቅ ያደርጋል", "መግለጫውን በማስተካከል (adjust) ያልተገለጸውን ገቢ ጨምሮ ታክስ ይወስናል", "ለግብር ከፋዩ የጽሑፍ ማስጠንቀቂያ ብቻ ይሰጣል", "ጉዳዩን ወደ ፍርድ ቤት ይመራዋል"], correct: 1 }
        ]
    },
    trueFalse: {
        title: "ክፍል ሁለት፡ የእውነት/ሐሰት ጥያቄዎች",
        instructions: "መመሪያ፡ የሚከተሉትን ሀሳቦች በማንበብ ትክክል ከሆኑ \"እውነት\" ስህተት ከሆኑ ደግሞ \"ሐሰት\" በማለት ይመልሱ።",
        questions: [
            { q: "ለረጅም ጊዜ ውል ሥራ ኪሳራ የገጠመውና ሥራውን ያቆመ ድርጅት ኪሳራውን ወደኋላ (Carry-back) በመውሰድ ከአምናው ትርፍ ላይ ማካካስ ይችላል።", correct: true },
            { q: "ከመንግስት መስሪያ ቤቶች ጋር የሚደረጉ የቤት ኪራይ ውሎች ለታክስ ተቀባይነት እንዲኖራቸው የግድ መመዝገብ አለባቸው።", correct: false },
            { q: "የታክስ ባለስልጣኑ አንድን የሂሳብ መግለጫ ውድቅ ካደረገው፣ ግብር ከፋዩ መዝገብ ባለመያዙ በተጨማሪነት ይቀጣል።", correct: false },
            { q: "በሁለት ዝምድና ባላቸው ኩባንያዎች መካከል የሚደረግ የንብረት ዝውውር ከገበያ ዋጋ በታች ከሆነ፣ የታክስ ባለስልጣኑ የገበያ ዋጋን ተጠቅሞ ታክሱን ሊወስን ይችላል።", correct: true },
            { q: "የማዕድን ሥራ ንዑስ ተቋራጮች (sub-contractors) ከሚከፈላቸው ክፍያ ላይ 10% ተቀናሽ ታክስ ይደረግባቸዋል።", correct: true },
            { q: "ግብር ከፋዩ በውጭ ሀገር ያጋጠመውን ኪሳራ በኢትዮጵያ ውስጥ ካገኘው ትርፍ ጋር ማቀናነስ ይችላል።", correct: false },
            { q: 'የደረጃ "ሐ" ግብር ከፋይ በፈቃደኝነት የሂሳብ መዝገብ መያዝ አይችልም።', correct: false },
            { q: "የውጭ ምንዛሬ ግብይት የሚፈጽም ድርጅት የገንዘቡን መጠን በብር መግለጽ አይጠበቅበትም።", correct: false },
            { q: "አነስተኛና ጥቃቅን ኢንተርፕራይዞች እንደ ግለሰብ ታክስ ከፋይ ተቆጥረው እንደየደረጃቸው የሂሳብ መዝገብ ይይዛሉ።", correct: true },
            { q: "በህገ-ወጥ ደረሰኝ ላይ የተመሰረተ የሂሳብ መግለጫ በታክስ ባለስልጣኑ ተቀባይነት ይኖረዋል።", correct: false }
        ]
    },
    submitButton: "መልሶችን አስገባ",
    resultsTitle: "የፈተና ውጤትዎ",
    scoreText: "ከጠቅላላው",
    correctAnswers: "ትክክለኛ መልሶች"
};

type McqAnswers = (number | null)[];
type TfAnswers = (boolean | null)[];

// --- Main Component ---
export default function ComprehensiveFinalExamExpanded() {
    const [mcqAnswers, setMcqAnswers] = useState<McqAnswers>(Array(quizData.multipleChoice.questions.length).fill(null));
    const [tfAnswers, setTfAnswers] = useState<TfAnswers>(Array(quizData.trueFalse.questions.length).fill(null));
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const totalQuestions = quizData.multipleChoice.questions.length + quizData.trueFalse.questions.length;

    const handleMcqChange = (qIndex: number, optionIndex: number) => {
        if (isSubmitted) return;
        const newAnswers = [...mcqAnswers];
        newAnswers[qIndex] = optionIndex;
        setMcqAnswers(newAnswers);
    };

    const handleTfChange = (qIndex: number, answer: boolean) => {
        if (isSubmitted) return;
        const newAnswers = [...tfAnswers];
        newAnswers[qIndex] = answer;
        setTfAnswers(newAnswers);
    };

    const sendResultsToServer = (results: object) => {
        console.log("Sending results to server...", results);
        // This is where you would place your fetch or axios call
        // For example:
        // fetch('/api/quiz-results', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(results)
        // }).catch(error => console.error("API Call Failed:", error));
    };

    const handleSubmit = () => {
        let currentScore = 0;
        quizData.multipleChoice.questions.forEach((q, index) => {
            if (mcqAnswers[index] === q.correct) currentScore++;
        });
        quizData.trueFalse.questions.forEach((q, index) => {
            if (tfAnswers[index] === q.correct) currentScore++;
        });
        
        setScore(currentScore);
        setIsSubmitted(true);

        const resultsPayload = {
            userId: 'user-xyz-789', // Example static user ID
            score: currentScore,
            total: totalQuestions,
            mcqResponses: mcqAnswers,
            tfResponses: tfAnswers,
            timestamp: new Date().toISOString(),
        };
        sendResultsToServer(resultsPayload);
    };

    return (
        <div className="font-sans p-4 sm:p-8">
            <div className="max-w-full mx-auto">
                <header className="p-6">
                    <div className="flex items-center">
                        <BookCheck className="h-8 sm:h-10 w-8 sm:w-10 mr-4"/>
                        <h1 className="text-2xl sm:text-3xl font-bold">ሁሉን አቀፍ የማጠቃለያ ፈተና</h1>
                    </div>
                </header>

                {isSubmitted && (
                    <div className="p-4 sm:p-6 text-center sticky top-0 z-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-yellow-900">{quizData.resultsTitle}</h2>
                        <p className="text-3xl sm:text-4xl font-bold my-2 text-yellow-800">{score} <span className="text-xl sm:text-2xl font-normal">/ {totalQuestions}</span></p>
                    </div>
                )}
                
                <main className="p-4 sm:p-6 md:p-8">
                    {/* Multiple Choice Section */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center"><FileQuestion className="mr-3 text-blue-500 h-6 w-6" />{quizData.multipleChoice.title}</h2>
                        <p className="text-sm text-gray-600 mb-6">{quizData.multipleChoice.instructions}</p>
                        <div className="space-y-8">
                            {quizData.multipleChoice.questions.map((q, qIndex) => (
                                <div key={`mcq-${qIndex}`} className={`p-3 sm:p-4 border ${isSubmitted ? (mcqAnswers[qIndex] === q.correct ? 'border-green-400' : 'border-red-400') : 'border-gray-200'}`}>
                                    <p className="font-semibold mb-3 text-base">{qIndex + 1}. {q.q}</p>
                                    <div className="space-y-2">
                                        {q.options.map((option, oIndex) => {
                                            const isSelected = mcqAnswers[qIndex] === oIndex;
                                            const isCorrect = q.correct === oIndex;
                                            return (
                                                <label key={oIndex} className={`flex items-center p-3 border transition-colors text-sm sm:text-base ${!isSubmitted ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'} ${isSelected && !isSubmitted ? 'bg-blue-100 border-blue-500' : 'border-gray-300'} ${isSubmitted && isCorrect ? 'border-green-500 bg-green-100' : ''}`}>
                                                    <input type="radio" name={`mcq-${qIndex}`} checked={isSelected} onChange={() => handleMcqChange(qIndex, oIndex)} disabled={isSubmitted} className="h-4 w-4 text-blue-600 focus:ring-blue-500"/>
                                                    <span className="ml-3 flex-grow">{option}</span>
                                                    {isSubmitted && isCorrect && <CheckCircle className="ml-auto h-5 w-5 text-green-600"/>}
                                                    {isSubmitted && isSelected && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-red-600"/>}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* True/False Section */}
                    <section className="mt-12">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center"><FileQuestion className="mr-3 text-blue-500 h-6 w-6" />{quizData.trueFalse.title}</h2>
                        <p className="text-sm text-gray-600 mb-6">{quizData.trueFalse.instructions}</p>
                        <div className="space-y-6">
                            {quizData.trueFalse.questions.map((q, qIndex) => (
                                <div key={`tf-${qIndex}`} className={`p-3 sm:p-4 border ${isSubmitted ? (tfAnswers[qIndex] === q.correct ? 'border-green-400' : 'border-red-400') : 'border-gray-200'}`}>
                                    <p className="font-semibold mb-3 text-base">{quizData.multipleChoice.questions.length + qIndex + 1}. {q.q}</p>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                        <label className={`w-full flex items-center justify-center p-3 border font-bold ${!isSubmitted ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'} ${tfAnswers[qIndex] === true && !isSubmitted ? 'bg-blue-100 border-blue-500' : 'border-gray-300'} ${isSubmitted && q.correct === true ? 'border-green-500 bg-green-100' : ''}`}>
                                            <input type="radio" name={`tf-${qIndex}`} checked={tfAnswers[qIndex] === true} onChange={() => handleTfChange(qIndex, true)} disabled={isSubmitted} className="opacity-0 w-0 h-0" />
                                            እውነት
                                            {isSubmitted && q.correct === true && <CheckCircle className="ml-auto h-5 w-5 text-green-600"/>}
                                            {isSubmitted && tfAnswers[qIndex] === true && !q.correct && <XCircle className="ml-auto h-5 w-5 text-red-600"/>}
                                        </label>
                                        <label className={`w-full flex items-center justify-center p-3 border font-bold ${!isSubmitted ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'} ${tfAnswers[qIndex] === false && !isSubmitted ? 'bg-blue-100 border-blue-500' : 'border-gray-300'} ${isSubmitted && q.correct === false ? 'border-green-500 bg-green-100' : ''}`}>
                                            <input type="radio" name={`tf-${qIndex}`} checked={tfAnswers[qIndex] === false} onChange={() => handleTfChange(qIndex, false)} disabled={isSubmitted} className="opacity-0 w-0 h-0" />
                                            ሐሰት
                                            {isSubmitted && q.correct === false && <CheckCircle className="ml-auto h-5 w-5 text-green-600"/>}
                                            {isSubmitted && tfAnswers[qIndex] === false && q.correct && <XCircle className="ml-auto h-5 w-5 text-red-600"/>}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                    {!isSubmitted && (
                        <div className="mt-10">
                            <button onClick={handleSubmit} className="w-full flex items-center justify-center py-3 sm:py-4 px-6 bg-blue-600 text-white font-bold text-base sm:text-lg hover:bg-blue-700 disabled:bg-gray-400" disabled={mcqAnswers.includes(null) || tfAnswers.includes(null)}>
                                <Send className="mr-3" />
                                {quizData.submitButton}
                            </button>
                        </div>
                    )}
                    <ChapterNavigation previous='/content/686e8e6623afc16ef4f670d2' next='/content/686e8e6723afc16ef4f670d8' lang={'en'} />
                </main>
            </div>
        </div>
    );
}

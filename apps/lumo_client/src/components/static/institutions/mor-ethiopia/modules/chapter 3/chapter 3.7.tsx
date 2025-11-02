// Suggested file path: /src/components/static/mor/WithholdingTaxFinalExam.tsx
'use client';

import { useState } from 'react';
import { BookCheck, FileQuestion, Send, CheckCircle, XCircle } from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- Expanded Quiz Data ---
const quizData = {
    multipleChoice: {
        title: "ክፍል አንድ፡ ምርጫ ጥያቄዎች",
        instructions: "መመሪያ፡ ከቀረቡት አማራጮች ውስጥ ትክክለኛውን መልስ ይምረጡ።",
        questions: [
            { q: "አንድ ድርጅት ለዕቃ አቅርቦት ከብር 10,000 በላይ ክፍያ ሲፈጽም፣ የአቅራቢውን የግብር ከፋይ መለያ ቁጥር (TIN) እና የፀና የንግድ ፈቃድ ማቅረብ ካልቻለ፣ ከክፍያው ላይ ቀንሶ ማስቀረት ያለበት የግብር መጣኔ ስንት ነው?", options: ["2%", "10%", "30%", "15%"], correct: 2 },
            { q: "በኢትዮጵያ ነዋሪ ላልሆነ ድርጅት ለሚከፈል የቴክኒክ አገልግሎት (Technical Service) ክፍያ ላይ የሚቀነሰው የግብር መጣኔ ስንት ነው?", options: ["5%", "10%", "15%", "30%"], correct: 2 },
            { q: "አንድ ኩባንያ ያገኘውን የተጣራ ትርፍ በአክሲዮን ድርሻ መልክ ሳያከፋፍል ወይም ካፒታሉን ሳያሳድግ ከቆየ የሚጣልበት 'ያልተከፋፈለ ትርፍ' ግብር መጣኔ ስንት ነው?", options: ["5%", "10%", "15%", "30%"], correct: 1 },
            { q: "ወደ ሀገር ውስጥ ለንግድ ለሚገባ ዕቃ ላይ የሚከፈለው 3% የቅድሚያ ግብር (withholding tax) የሚሰላው በምን ዋጋ ላይ ተመስርቶ ነው?", options: ["በዕቃው መግዣ ዋጋ (FOB) ላይ ብቻ", "በዕቃው የጉምሩክ ዋጋ (CIF - Cost, Insurance, and Freight) ላይ", "በዕቃው የመጨረሻ መሸጫ ዋጋ ላይ", "በትራንስፖርት ወጪ ላይ ብቻ"], correct: 1 },
            { q: "ከሚከተሉት ክፍያዎች ውስጥ 2% የቅድሚያ ግብር ተቀናሽ የማይደረግበት የቱ ነው?", options: ["ከ12,000 ብር በላይ የሆነ የዕቃ ግዢ", "5,000 ብር የሆነ የአገልግሎት ክፍያ", "2,500 ብር የሆነ የአገልግሎት ክፍያ", "ለኮንስትራክሽን ሥራ የተከፈለ 1,000,000 ብር"], correct: 2 },
            { q: "አንድ ድርጅት የሂሳብ ዓመቱ ካለቀ በኋላ 'ያልተከፋፈለ ትርፍ' ግብር ሳይጣልበት ትርፉን ለካፒታል ማሳደጊያነት ለማዋል የሚሰጠው የጊዜ ገደብ ምን ያህል ነው?", options: ["6 ወራት", "2 ወራት", "12 ወራት", "24 ወራት"], correct: 2 },
            { q: "አንድ ድርጅት ለሌላ ድርጅት የአክሲዮን ትርፍ ድርሻ (Dividend) ሲከፍል፣ ቀንሶ ማስቀረት ያለበት የግብር መጠን ስንት ነው?", options: ["5%", "10%", "15%", "30%"], correct: 1 },
            { q: "ግብር ቀንሶ የማስቀረት ግዴታ ያለበት ከፋይ፣ የቀነሰውን ታክስ ለባለስልጣኑ ገቢ ማድረግ ያለበት መቼ ነው?", options: ["ወዲያውኑ በዚያው ቀን", "ወሩ አልቆ በሚቀጥሉት 7 ቀናት ውስጥ", "ወሩ አልቆ በሚቀጥሉት 30 ቀናት ውስጥ", "በግብር ዓመቱ መጨረሻ"], correct: 2 },
            { q: "ለህንጻ ግንባታ ኮንትራት ክፍያ ሲፈጸም 2% የቅድሚያ ግብር የሚሰላው...", options: ["ከጠቅላላ የክፍያ መጠን ላይ", "ከመለዋወጫ ዕቃ ዋጋ ላይ ብቻ", "ከጠቅላላ ክፍያው 45% ላይ", "ከጠቅላላ ክፍያው 55% ላይ"], correct: 3 },
            { q: "ከሚከተሉት ግብይቶች ውስጥ የቅድሚያ ግብር ቀንሶ የማስቀረት ስርዓት ተፈጻሚ የማይሆንበት የቱ ነው?", options: ["የኦዲት አገልግሎት ግዢ", "የጥሬ ዕቃ ግዢ", "የኤሌክትሪክና የውሃ አገልግሎት ክፍያ", "የቢሮ ኪራይ አገልግሎት"], correct: 2 },
            { q: "በኢትዮጵያ ነዋሪ ላልሆነ ሰው ለሚከፈል የሮያሊቲ (Royalty) ክፍያ የሚቀነሰው ግብር ስንት በመቶ ነው?", options: ["5%", "10%", "15%", "2%"], correct: 0 },
            { q: "አንድ ድርጅት ከባንክ ላስቀመጠው ገንዘብ የሚያገኘው ወለድ ላይ የሚከፈለው ግብር ስንት ነው?", options: ["10%", "15%", "5%", "ከታክስ ነፃ ነው"], correct: 2 },
            { q: "አንድ ድርጅት ታክስ ቀንሶ የማስቀረት ግዴታውን ባለመወጣቱ የሚጣለው ቅጣት ምን ያህል ነው?", options: ["ሊቀነስ ከነበረው ታክስ 5%", "ሊቀነስ ከነበረው ታክስ 10%", "ሊቀነስ ከነበረው ታክስ 100%", "2,000 ብር ቋሚ ቅጣት"], correct: 2 },
            { q: "የካፒታል ሀብት ከሆነው አክሲዮን (ምድብ 'ለ') ሽያጭ በሚገኝ ትርፍ ላይ የሚከፈለው ግብር መጣኔ ስንት ነው?", options: ["15%", "25%", "30%", "10%"], correct: 2 },
            { q: "ግብር ከፋይ ከዓመታዊ ገቢው ላይ በቅድሚያ ተቀንሶ የተያዘበትን ታክስ እንዴት ይጠቀምበታል?", options: ["ሙሉ በሙሉ ተመላሽ ይደረግለታል", "ለመንግስት እንደ ስጦታ ይቆጠራል", "በመጨረሻ ከሚከፍለው የዓመት ገቢ ግብር ላይ እንደክፍያ (Credit) ያካክስበታል", "ምንም ጥቅም የለውም"], correct: 2 },
            { q: "ከሚከተሉት ውስጥ ታክስ ቀንሶ የማስቀረት ግዴታ ያለበት የትኛው ነው?", options: ['የደረጃ "ሐ" ግብር ከፋይ', "መንግስታዊ ያልሆነ ድርጅት (NGO)", "ማንኛውም ግለሰብ", "ሁሉም መልስ ናቸው"], correct: 1 },
            { q: "አንድ ኩባንያ ከዕድል ሙከራ (ለምሳሌ ሎተሪ) ላሸነፈ ሰው ክፍያ ሲፈጽም ቀንሶ ማስቀረት ያለበት ግብር ስንት ነው?", options: ["10%", "15%", "25%", "35%"], correct: 1 },
            { q: "ለጥገና አገልግሎት ክፍያ ሲፈጸም አገልግሎት ሰጪው ለመለዋወጫ ዕቃ ያወጣውን ወጪ በደረሰኝ አስደግፎ ለብቻው ካቀረበ፣ 2% ቅድሚያ ግብር የሚሰላው በምን ላይ ነው?", options: ["በጠቅላላ ክፍያው (ዕቃ + አገልግሎት) ላይ", "በመለዋወጫ ዕቃው ዋጋ ላይ ብቻ", "በአገልግሎት ዋጋው ላይ ብቻ", "በሁለቱም ላይ ተነጣጥሎ ይሰላል"], correct: 2 },
            { q: "አንድ ድርጅት ታክስ ቀንሶ የማስቀረት ግዴታውን ባለመወጣቱ ምክንያት የድርጅቱ ዋና ሥራ አስኪያጅና የሂሳብ ሹም እያንዳንዳቸው የሚቀጡት ቅጣት ስንት ነው?", options: ["10,000 ብር", "5,000 ብር", "2,000 ብር", "ምንም አይቀጡም፣ ድርጅቱ ብቻ ነው የሚቀጣው"], correct: 2 },
            { q: "አቅራቢው ታክስ እንዳይቀነስበት በማሰብ ዕቃ ወይም አገልግሎት ለመሸጥ ፈቃደኛ ካልሆነ የሚጣለው ቅጣት ስንት ነው?", options: ["2,000 ብር", "5,000 ብር", "10,000 ብር", "20,000 ብር"], correct: 2 },
            { q: "ለዓለም አቀፍ የአየር ትራንስፖርት አገልግሎት ለሚከፈል ክፍያ ላይ የሚቀነሰው ግብር ስንት ነው?", options: ["2%", "3%", "5%", "ከታክስ ነፃ ነው"], correct: 1 },
            { q: "የሂሳብ መዝገብ የማይይዝ ግብር ከፋይ፣ በቅድሚያ የተከፈለበትን ታክስ ከዓመታዊ የግብር ግምቱ ላይ...", options: ["መቀነስ አይችልም", "ማስረጃ ካቀረበ መቀነስ ይችላል", "ግማሹን ብቻ ነው መቀነስ የሚችለው", "በሚቀጥለው ዓመት ይቀነስለታል"], correct: 1 },
            { q: "የህብረት ሥራ ማህበር ለግለሰብ ላልሆኑ አባላቱ (ለምሳሌ ሌላ ኩባንያ) የሚያከፋፍለው የትርፍ ድርሻ...", options: ["10% ታክስ ይከፈልበታል", "30% ታክስ ይከፈልበታል", "ከትርፍ ድርሻ ግብር ነፃ ነው", "5% ታክስ ይከፈልበታል"], correct: 2 },
            { q: "ከቅድመ ግብር ጋር በተያያዘ ግብር ከፋዩ ለከፋዩ መስጠት ያለበት ሰነድ ምንድን ነው?", options: ["የንግድ ፈቃድ ኮፒ", "የግብር ከፋይ መለያ ቁጥር (TIN)", "የፀና የንግድ ፈቃድ", "ሁሉም መልስ ናቸው"], correct: 3 },
            { q: "በቅድሚያ የተከፈለ ታክስ ከዓመታዊ ግብሩ በላይ ሆኖ ሲገኝ ግብር ከፋዩ ምን ማድረግ ይችላል?", options: ["ልዩነቱ ለመንግስት ገቢ ይሆናል", "ተመላሽ እንዲደረግለት መጠየቅ ይችላል", "ለቀጣይ ዓመት ታክስ ክፍያ ማስተላለፍ ይችላል", "ለ እና ሐ"], correct: 3 },
            { q: "የቅድሚያ ግብር (Withholding Tax) ዋነኛ ዓላማ ምንድን ነው?", options: ["የግብር መሰወርን መከላከልና የመንግስትን የገንዘብ ፍሰት ማፋጠን", "አነስተኛ ንግዶችን መቅጣት", "የዋጋ ንረትን መቆጣጠር", "የውጭ ምንዛሬን መቆጣጠር"], correct: 0 },
            { q: "ከሰው ጉልበት ውጪ ለሚከናወን የዕቃ ጭነትና ማውረድ አገልግሎት የተከፈለ 15,000 ብር ላይ የሚቀነሰው ግብር ስንት ነው?", options: ["2%", "30%", "ምንም አይቀነስም", "10%"], correct: 0 },
            { q: "የካፒታል ሀብት ከሆነው የማይንቀሳቀስ ንብረት (ህንጻ) ሽያጭ በሚገኝ ትርፍ ላይ የሚከፈለው ግብር መጣኔ ስንት ነው?", options: ["10%", "15%", "30%", "እንደ ገቢው መጠን ይለያያል"], correct: 1 },
            { q: "አንድ የግብር እፎይታ ላይ ያለ ድርጅት ያገኘውን ትርፍ ካላከፋፈለ ወይም በካፒታል መልክ ካላዋለው...", options: ["ከግብር ነፃ ስለሆነ ምንም አይከፍልም", "10% ያልተከፋፈለ ትርፍ ግብር ይከፍላል", "የእፎይታ ጊዜው እስኪያልቅ ይጠብቃል", "5% ቅጣት ይከፍላል"], correct: 1 },
            { q: "የቅድሚያ ክፍያ (Advance Payment) ለዕቃና አገልግሎት ግዥ ሲፈጸም...", options: ["2% ቅድሚያ ግብር ይቀነስበታል", "30% ቅድሚያ ግብር ይቀነስበታል", "የቅድሚያ ግብር ተቀናሽ አይደረግበትም", "እንደ ውሉ ዓይነት ይወሰናል"], correct: 2 },
        ]
    },
    trueFalse: {
        title: "ክፍል ሁለት፡ የእውነት/ሐሰት ጥያቄዎች",
        instructions: "መመሪያ፡ የሚከተሉትን ሀሳቦች በማንበብ ትክክል ከሆኑ \"እውነት\" ስህተት ከሆኑ ደግሞ \"ሐሰት\" በማለት ይመልሱ።",
        questions: [
            { q: "በዓለም አቀፍ ድርጅት ውስጥ ተቀጥሮ የሚሰራ ኢትዮጵያዊ ከደመወዙ ላይ ታክስ ቀንሶ የማስያዝ ግዴታ በራሱ ላይ ይወድቃል።", correct: true },
            { q: "ግብር ቀንሶ የማስቀረት ግዴታ ያለበት ድርጅት ለፋይናንስ አገልግሎት (ለምሳሌ ለባንክ) ለሚከፍለው ክፍያ ላይ 2% ቀንሶ ማስቀረት አለበት።", correct: false },
            { q: "አንድ ድርጅት ለሰራተኛው ደመወዝ ሲከፍል፣ ከጠቅላላ ደመወዙ ላይ 2% የቅድሚያ ግብር ቀንሶ ማስቀረት አለበት።", correct: false },
            { q: "ከ3,000 ብር በታች ለሆነ የአገልግሎት ክፍያ የቅድሚያ ግብር የመቀነስ ግዴታ የለም።", correct: true },
            { q: "የቅድሚያ ግብር ተቀናሽ የሚደረገው ከተጨማሪ እሴት ታክስ (VAT) ጭምር ካለው ጠቅላላ የክፍያ መጠን ላይ ነው።", correct: false },
            { q: 'በሀገር ውስጥ ለሚፈጸም ክፍያ የቅድሚያ ግብር ቀንሶ የማስቀረት ግዴታ በሁሉም የደረጃ "ሀ" ግብር ከፋዮች ላይ ተፈጻሚ ይሆናል።', correct: false },
            { q: "የሂሳብ መዝገብ ያልያዘ ግብር ከፋይ ከካፒታል ሀብት ሽያጭ የሚያገኘው ጥቅም ሲሰላለት፣ ሀብቱን ለማግኘት ያወጣው ወጪ ዜሮ እንደሆነ ይቆጠራል።", correct: true },
            { q: "ግብር ቀንሶ ያስቀረ ድርጅት፣ ታክሱ ለተቀነሰበት ወገን ደረሰኝ የመስጠት ግዴታ የለበትም።", correct: false },
            { q: "የህብረት ሥራ ማህበር ለሁሉም አባላቱ የሚያከፋፍለው የትርፍ ድርሻ ከታክስ ነፃ ነው።", correct: false },
            { q: "በውጭ ምንዛሬ ለተገኘ ገቢ ታክሱም በውጭ ምንዛሬ መከፈል አለበት።", correct: false }
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
export default function WithholdingTaxFinalExam() {
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
        // fetch('/api/submit-withholding-quiz', {
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
        window.scrollTo(0, 0); // Scroll to top to show results

        const resultsPayload = {
            userId: 'user-withholding-123', // Example static user ID
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
            <div className="max-w-6xl mx-auto">
                <header className="p-6 border-b">
                    <div className="flex items-center">
                        <BookCheck className="h-8 sm:h-10 w-8 sm:w-10 mr-4"/>
                        <h1 className="text-3xl sm:text-4xl font-bold">withholding tax እና ተያያዥ ጉዳዮች ፈተና</h1>
                    </div>
                </header>

                {isSubmitted && (
                    <div className="p-4 sm:p-6 text-center sticky top-0 z-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-900">{quizData.resultsTitle}</h2>
                        <p className="text-4xl sm:text-5xl font-bold my-2 text-yellow-800">{score} <span className="text-3xl font-normal">/ {totalQuestions}</span></p>
                    </div>
                )}
                
                <main className="p-4 sm:p-6">
                    {/* Multiple Choice Section */}
                    <section>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center"><FileQuestion className="mr-3 text-blue-500 h-6 w-6" />{quizData.multipleChoice.title}</h2>
                        <p className="text-base text-gray-600 mb-6">{quizData.multipleChoice.instructions}</p>
                        <div className="space-y-6">
                            {quizData.multipleChoice.questions.map((q, qIndex) => (
                                <div key={`mcq-${qIndex}`} className={`p-3 sm:p-4 border ${isSubmitted ? (mcqAnswers[qIndex] === q.correct ? 'border-green-400' : 'border-red-400') : 'border-gray-300'}`}>
                                    <p className="font-semibold mb-3 text-lg">{qIndex + 1}. {q.q}</p>
                                    <div className="space-y-2">
                                        {q.options.map((option, oIndex) => {
                                            const isSelected = mcqAnswers[qIndex] === oIndex;
                                            const isCorrect = q.correct === oIndex;
                                            return (
                                                <label key={oIndex} className={`flex items-center p-3 border transition-colors text-base sm:text-lg ${!isSubmitted ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'} ${isSelected && !isSubmitted ? 'bg-blue-100 border-blue-500' : 'border-gray-300'} ${isSubmitted && isCorrect ? '!border-green-500 !bg-green-100' : ''}`}>
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
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center"><FileQuestion className="mr-3 text-blue-500 h-6 w-6" />{quizData.trueFalse.title}</h2>
                        <p className="text-base text-gray-600 mb-6">{quizData.trueFalse.instructions}</p>
                        <div className="space-y-4">
                            {quizData.trueFalse.questions.map((q, qIndex) => (
                                <div key={`tf-${qIndex}`} className={`p-3 sm:p-4 border ${isSubmitted ? (tfAnswers[qIndex] === q.correct ? 'border-green-400' : 'border-red-400') : 'border-gray-300'}`}>
                                    <p className="font-semibold mb-3 text-lg">{quizData.multipleChoice.questions.length + qIndex + 1}. {q.q}</p>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                        <label className={`w-full flex items-center justify-center p-3 border font-bold ${!isSubmitted ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'} ${tfAnswers[qIndex] === true && !isSubmitted ? 'bg-blue-100 border-blue-500' : 'border-gray-300'} ${isSubmitted && q.correct === true ? '!border-green-500 !bg-green-100' : ''}`}>
                                            <input type="radio" name={`tf-${qIndex}`} checked={tfAnswers[qIndex] === true} onChange={() => handleTfChange(qIndex, true)} disabled={isSubmitted} className="opacity-0 w-0 h-0" />
                                            እውነት
                                            {isSubmitted && q.correct === true && <CheckCircle className="ml-auto h-5 w-5 text-green-600"/>}
                                            {isSubmitted && tfAnswers[qIndex] === true && !q.correct && <XCircle className="ml-auto h-5 w-5 text-red-600"/>}
                                        </label>
                                        <label className={`w-full flex items-center justify-center p-3 border font-bold ${!isSubmitted ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'} ${tfAnswers[qIndex] === false && !isSubmitted ? 'bg-blue-100 border-blue-500' : 'border-gray-300'} ${isSubmitted && q.correct === false ? '!border-green-500 !bg-green-100' : ''}`}>
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
                    <ChapterNavigation previous='/content/686e8e6823afc16ef4f670e7' lang={'en'} />
                </main>
            </div>
        </div>
    );
}

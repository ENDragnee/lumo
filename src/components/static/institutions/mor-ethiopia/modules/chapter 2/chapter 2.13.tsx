'use client';

import { useState } from 'react';
import { BookCheck, FileQuestion, Send, CheckCircle, XCircle, Globe } from 'lucide-react';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';

// --- Quiz Data ---
const quizData = {
    multipleChoice: {
        title: "ክፍል አንድ፡ የባለብዙ ምርጫ ጥያቄዎች",
        instructions: "መመሪያ፡ ከቀረቡት አማራጮች ውስጥ ትክክለኛውን መልስ ይምረጡ።",
        questions: [
            { q: 'በኢትዮጵያ የገቢ ግብር አዋጅ መሠረት "ነዋሪ" የሆነ ግለሰብ ግብር የሚከፍለው በምን ዓይነት ገቢ ላይ ነው?', options: ["በኢትዮጵያ ውስጥ ብቻ ባገኘው ገቢ ላይ", "በውጭ ሀገር ብቻ ባገኘው ገቢ ላይ", "በዓለም ዙሪያ በሚያገኘው ገቢ ላይ", "ከንግድ ሥራ በሚገኝ ገቢ ላይ ብቻ"], correct: 2 },
            { q: 'አንድ ድርጅት (ኃ.የተ.የግ.ማ ወይም አክሲዮን ማህበር) ከቤት ኪራይ በሚያገኘው ገቢ ላይ የሚከፍለው የግብር መጣኔ ስንት በመቶ ነው?', options: ["10%", "35%", "30%", "በገቢው መጠን ይለያያል"], correct: 2 },
            { q: "የሂሳብ መዝገብ የመያዝ ግዴታ የሌለበት ግለሰብ የቤት ዕቃዎችን ጨምሮ ቤቱን አከራይቶ ከሚያገኘው ጠቅላላ የኪራይ ገቢ ላይ ለጥገና፣ ለእርጅና እና ለመሳሰሉት በወጪነት ተቀናሽ የሚደረግለት ስንት በመቶ ነው?", options: ["100%", "75%", "30%", "50%"], correct: 3 },
            { q: "በቤት ኪራይ ሥራ ላይ የተሰማራ ግብር ከፋይ ያጋጠመውን ኪሳራ ለስንት ተከታታይ ዓመታት ማሸጋገር ይችላል?", options: ["2 ዓመት", "5 ዓመት", "10 ዓመት", "ኪሳራ ማሸጋገር አይቻልም"], correct: 1 },
            { q: "በአንድ የንግድ ድርጅት ላይ የሚጣለው የንግድ ሥራ ገቢ ግብር መጣኔ ስንት ነው?", options: ["25%", "30%", "35%", "እንደ ትርፉ መጠን ይለያያል"], correct: 1 },
            { q: "አንድ ድርጅት ለበጎ አድራጎት ዓላማ ያደረገው ስጦታ በተቀናሽ ወጪነት ሊያዝለት የሚችለው ከፍተኛው መጠን ምን ያህል ነው?", options: ["ከጠቅላላ ገቢው 10%", "ከግብር ከሚከፈልበት ገቢው 10%", "ከጠቅላላ ገቢው 5%", "ምንም ገደብ የለውም"], correct: 1 },
            { q: "የማይዳሰሱ ሀብቶች (Intangible Assets) የእርጅና ቅናሽ ሲሰላ በየትኛው ዘዴ መሆን አለበት?", options: ["ዋጋው እየቀነሰ በሚሄድ ዘዴ", "በቀጥተኛ ዘዴ", "በሁለቱም መጠቀም ይቻላል", "የእርጅና ቅናሽ አይሰላላቸውም"], correct: 1 },
            { q: "ኮምፒውተሮች፣ ሶፍትዌሮች እና የመረጃ ማከማቻ መሣሪያዎች ዋጋው እየቀነሰ በሚሄድ ዘዴ ሲሰላላቸው የእርጅና ቅናሽ መጣኔያቸው ስንት ነው?", options: ["15%", "20%", "25%", "30%"], correct: 2 },
            { q: "ከሚከተሉት ወጪዎች ውስጥ ተቀናሽ የማይደረገው የትኛው ነው?", options: ["የሰራተኞች ደመወዝ", "የቢሮ ኪራይ", "ሕግን በመጣስ የተከፈለ የገንዘብ ቅጣት", "ለንግድ ሥራ የዋለ የብድር ወለድ"], correct: 2 },
            { q: "አንድ ግብር ከፋይ ለመኖሪያ ቤቱና ለንግድ ድርጅቱ አንድ የውሃ ቆጣሪ የሚጠቀም ከሆነ፣ ከውሃ ፍጆታ ወጪ ውስጥ ለንግድ ስራው በወጪነት ማስያዝ የሚችለው ምን ያህል ነው?", options: ["100%", "50%", "75%", "25%"], correct: 2 },
            { q: '"የማይሰበሰብ ዕዳ" በወጪነት ተቀናሽ እንዲሆን ከተፈለገ መሟላት ካለባቸው መስፈርቶች አንዱ የቱ ነው?', options: ["ዕዳው ከአንድ ዓመት በላይ የቆየ መሆኑ", "ዕዳውን ለማስከፈል አስፈላጊ የህግ እርምጃ ተወስዶ ያልተሳካ መሆኑ", "ተበዳሪው መክሰሩን በቃል መግለጹ", "ሁሉም መልስ ናቸው"], correct: 1 },
            { q: "አንድ ግለሰብ የንግድ ሥራ ባለሀብት ከ25 ኪሎ ሜትር በላይ ተጉዞ ለሚያከናውነው ሥራ ለምግብና ለመኝታ በቀን ሊፈቀድለት የሚችለው ከፍተኛው የውሎ አበል መጠን ስንት ነው?", options: ["500 ብር", "1000 ብር", "2000 ብር", "ገደብ የለውም፣ በደረሰኝ ይያዛል"], correct: 1 },
            { q: "አንድ ድርጅት ለሰራተኛው ከሚከፍለው ወርሃዊ ደመወዝ በተጨማሪ በፈቃደኝነት ለጡረታ ወይም ፕሮቪደንት ፈንድ የሚያደርገው መዋጮ ተቀናሽ የሚሆነው እስከ ስንት በመቶ ሲሆን ነው?", options: ["10%", "15%", "20%", "25%"], correct: 1 },
            { q: "በንግድ ሥራ ላይ የተሰማራ ግብር ከፋይ ያጋጠመውን ኪሳራ በህይወት ዘመኑ ስንት ጊዜ ብቻ ነው ማሸጋገር የሚችለው?", options: ["አንድ ጊዜ", "ሁለት ጊዜ", "አምስት ጊዜ", "ገደብ የለውም"], correct: 1 },
            { q: '"የውክልና ወጪ" (Representation Expenditure) ተቀናሽ ሊሆን የሚችለው እስከ ስንት በመቶ ነው?', options: ["ከሽያጭ 1%", "ከትርፍ 5%", "ከጠቅላላ ገቢ 10%", "ገደብ የለውም"], correct: 2 },
            { q: 'አንድ ግለሰብ በኢትዮጵያ ውስጥ "ነዋሪ" ተብሎ እንዲቆጠር በአንድ ዓመት ጊዜ ውስጥ ቢያንስ ለስንት ቀናት መቆየት አለበት?', options: ["90 ቀናት", "120 ቀናት", "183 ቀናት", "365 ቀናት"], correct: 2 },
            { q: "ተከራይ አከራይ (Sub-lessor) የሆነ ሰው ግብር የሚከፈልበትን ገቢ ሲያሰላ ከሚያገኘው ጠቅላላ ኪራይ ላይ ተቀናሽ የሚያደርገው የትኛውን ነው?", options: ["ለዋናው አከራይ የሚከፍለውን ኪራይ", "ገቢውን ለማግኘት ያወጣቸውን ሌሎች ወጪዎች", "ለዋናው አከራይ የሚከፍለውን ኪራይ ብቻ", "ሀ እና ለ መልስ ናቸው"], correct: 3 },
            { q: "ህንፃዎችን በቀጥተኛ የእርጅና ቅናሽ ዘዴ ሲሰላ መጣኔው ስንት ነው?", options: ["5%", "10%", "15%", "20%"], correct: 0 },
            { q: "የንግድ ሥራ ፍቺ ውስጥ የማይካተተው የትኛው ነው?", options: ["የኢንዱስትሪ ሥራ", "የሙያ አገልግሎት", "ተቀጣሪ ለቀጣሪው የሚሰጠው አገልግሎት", "የንግድ ሥራ"], correct: 2 },
            { q: "በዲዛይን ለውጥ ምክንያት የፈረሰ ህንፃ ቀሪ የመዝገብ ዋጋ (Net Book Value) በታክስ ስሌት ወቅት እንዴት ይታያል?", options: ["ተቀናሽ የማይደረግ ኪሳራ ነው", "በወጪነት ተቀናሽ ይደረጋል", "በከፊል ተቀናሽ ይደረጋል", "ወደ አዲሱ ህንፃ ዋጋ ላይ ይደመራል"], correct: 1 },
            { q: "ለማስታወቂያ የሚወጣ ወጪ በተለያዩ ዝግጅቶች ላይ ሲሆን ተቀናሽ የሚሆነው ከጠቅላላ ገቢው ስንት በመቶ ሳይበልጥ ሲቀር ነው?", options: ["1%", "3%", "5%", "10%"], correct: 1 },
            { q: "ለማስታወቂያ የሚወጣው ወጪ ለመገናኛ ብዙሃን ወይም ለማስታወቂያ ድርጅት የተከፈለ ከሆነ እንዴት ይታያል?", options: ["3% ብቻ ተቀናሽ ይሆናል", "50% ተቀናሽ ይሆናል", "በሙሉ ተቀናሽ ይሆናል", "ምንም ተቀናሽ አይሆንም"], correct: 2 },
            { q: "ለኪራይ የተገነባ ህንፃ አገልግሎት ለመስጠት ዝግጁ ሆኖ ነገር ግን ሳይከራይ ከቀረ፣ የእርጅና ቅናሹ እንዴት ይታሰባል?", options: ["ህንፃው ስላልተከራየ የእርጅና ቅናሽ አይታሰብለትም", "ለኪራይ እንደዋለ ተቆጥሮ የእርጅና ቅናሹ በወጪነት ይያዛል", "የእርጅና ቅናሹ ግማሽ ብቻ ይያዛል", "ለሚቀጥለው ዓመት ይተላለፋል"], correct: 1 },
            { q: "የንግድ ሥራ ሀብትን ለማሻሻል የወጣ ወጪ በዚያው ዓመት ሙሉ በሙሉ ተቀናሽ የሚሆነው ከሀብቱ ቀሪ የመዝገብ ዋጋ ስንት በመቶ ያልበለጠ ሲሆን ነው?", options: ["10%", "20%", "50%", "100%"], correct: 1 },
            { q: 'በግብር ሕጉ መሠረት "የንግድ ዕቃ" (Trading Stock) ምንን አይጨምርም?', options: ["የተመረተ ዕቃ", "ለሽያጭ የተገዛ ዕቃ", "ጥሬ ዕቃ", "ለጭነት ወይም ለስራ የሚያገለግሉ እንስሳት"], correct: 3 },
            { q: "የንግድ ሥራ ገቢን ለማስላት መነሻ የሚሆነው የትኛው የፋይናንስ ሪፖርት ነው?", options: ["የሂሳብ ሚዛን", "የጥሬ ገንዘብ ፍሰት መግለጫ", "የትርፍና ኪሳራ መግለጫ", "ሁሉም መልስ ናቸው"], correct: 2 },
            { q: "ኢትዮጵያ ነዋሪ ያልሆነ ድርጅት በኢትዮጵያ ውስጥ ያለው ቋሚ መቋቋሚያ ለድርጅቱ ዋና መ/ቤት ጥቅም ያወጣውን ትክክለኛ ወጪ...", options: ["በወጪነት ማስያዝ አይችልም", "በወጪነት ማስያዝ ይችላል", "ግማሹን ብቻ ነው የሚያስይዘው", "በገቢነት ይመዘገባል"], correct: 1 },
            { q: "አንድ ግለሰብ ከቤት ኪራይ ዓመታዊ 90,000 ብር ታክስ የሚከፈልበት ገቢ ቢያገኝ የሚከፍለው የግብር መጣኔ ስንት በመቶ ነው?", options: ["20%", "25%", "30%", "15%"], correct: 1 },
            { q: "አዲስ የሚከራይ ቤት ሥራው ሲጠናቀቅ የማሳወቅ ግዴታ ያለበት ማነው?", options: ["የቤቱ ባለቤት ብቻ", "ሥራ ተቋራጩ ብቻ", "የቤቱ ባለቤት እና ሥራ ተቋራጩ", "ቀበሌ/የከተማ አስተዳደሩ"], correct: 2 },
            { q: "ከሚከተሉት ውስጥ የካፒታልነት ባህሪ ያለው ወጪ (Capital Expenditure) የቱ ነው?", options: ["የሰራተኛ ደመወዝ", "አዲስ ማሽን መግዛት", "የኤሌክትሪክ ክፍያ", "የጥገና ወጪ (ከ20% በታች የሆነ)"], correct: 1 }
        ]
    },
    trueFalse: {
        title: "ክፍል ሁለት፡ የእውነት/ሐሰት ጥያቄዎች",
        instructions: "መመሪያ፡ የሚከተሉትን ሀሳቦች በማንበብ ትክክል ከሆኑ \"እውነት\" ስህተት ከሆኑ ደግሞ \"ሐሰት\" በማለት ይመልሱ።",
        questions: [
            { q: "የንግድ ሥራ ኪሳራን ለ10 ተከታታይ ዓመታት ማሸጋገር ይቻላል።", correct: false },
            { q: 'የኢትዮጵያ መንግስት ሰራተኛ ሆኖ በውጭ ሀገር ተመድቦ የሚሰራ ግለሰብ ለታክስ አከፋፈል "ነዋሪ" ተብሎ አይቆጠርም።', correct: false },
            { q: "የአንድ ድርጅት የንግድ ሥራ ገቢ ግብር መጣኔ 30% ሲሆን፣ የግለሰብ ነጋዴ ከፍተኛው የግብር መጣኔ 35% ነው።", correct: true },
            { q: "በመድን፣ በካሳ ወይም በዋስትና ውል መሠረት የተመለሰ ወይም ሊመለስ የሚችል ኪሳራ በወጪነት ተቀናሽ ማድረግ ይቻላል።", correct: false },
            { q: "የቤት ኪራይ ገቢ ግብር የሚጣለው በየወሩ በሚገኝ ገቢ ላይ ተመስርቶ ነው።", correct: false },
            { q: "የተከራይ አከራይ (Sub-lessor) ለዋናው አከራይ የሚከፍለው የኪራይ ገንዘብ በወጪነት አይያዝለትም።", correct: false },
            { q: "አንድ የንግድ ድርጅት ለራሱ ለግል ፍጆታ ያወጣው ወጪ እንደ ንግድ ወጪ ተቀናሽ ይደረጋል።", correct: false },
            { q: "የግብር ከፋዩ የሂሳብ መዝገብ መያዝ ግዴታ ከሌለበትና ከቤት ዕቃ ጋር አብሮ ካከራየ、 ከቤት ዕቃው ከሚያገኘው ገቢ ላይ 50% በወጪነት ተቀናሽ ይደረግለታል።", correct: true },
            { q: "ታክስን ሳይጨምር ለመሬቱ ወይም ለተከራየው ቤት ለከተማ አስተዳደር የተከፈሉ ክፍያዎች ከኪራይ ገቢ ላይ ተቀናሽ የሚደረጉ ወጪዎች ናቸው።", correct: true },
            { q: "የአክሲዮን ድርሻ ክፍፍል (Dividend) ለድርጅቱ እንደተቀናሽ ወጪ ይያዛል።", correct: false }
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
export default function ComprehensiveFinalExam() {
    const [mcqAnswers, setMcqAnswers] = useState<McqAnswers>(Array(quizData.multipleChoice.questions.length).fill(null));
    const [tfAnswers, setTfAnswers] = useState<TfAnswers>(Array(quizData.trueFalse.questions.length).fill(null));
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [lang, setLang] = useState<'am' | 'en'>('am');

    const totalQuestions = quizData.multipleChoice.questions.length + quizData.trueFalse.questions.length;

    const handleMcqChange = (qIndex: number, optionIndex: number) => {
        const newAnswers = [...mcqAnswers];
        newAnswers[qIndex] = optionIndex;
        setMcqAnswers(newAnswers);
    };

    const handleTfChange = (qIndex: number, answer: boolean) => {
        const newAnswers = [...tfAnswers];
        newAnswers[qIndex] = answer;
        setTfAnswers(newAnswers);
    };

    const sendResultsToServer = (results: object) => {
        console.log("Sending results to server...", results);
        // Replace this with your actual API call
        // fetch('/api/submit-quiz', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(results),
        // })
        // .then(response => response.json())
        // .then(data => console.log('Server response:', data))
        // .catch(error => console.error('Error submitting results:', error));
    };

    const handleSubmit = () => {
        let currentScore = 0;
        
        quizData.multipleChoice.questions.forEach((q, index) => {
            if (mcqAnswers[index] === q.correct) {
                currentScore++;
            }
        });
        
        quizData.trueFalse.questions.forEach((q, index) => {
            if (tfAnswers[index] === q.correct) {
                currentScore++;
            }
        });
        
        setScore(currentScore);
        setIsSubmitted(true);

        const resultsPayload = {
            userId: 'user123', // Example user ID
            score: currentScore,
            totalQuestions,
            mcqAnswers,
            tfAnswers,
            submittedAt: new Date().toISOString()
        };
        sendResultsToServer(resultsPayload);
    };

    // Removed duplicate setLang function to avoid identifier conflict.

    return (
        <div className="font-sans p-4 sm:p-8">
            <div className="max-w-full mx-auto">
                <header className="py-4 border-b relative">
                    <div className="flex items-center">
                        <BookCheck className="h-8 sm:h-10 w-8 sm:w-10 mr-4"/>
                        <h1 className="text-2xl sm:text-3xl font-bold">ሁሉን አቀፍ የማጠቃለያ ፈተና</h1>
                    </div>
                    <button onClick={() => setLang(lang === 'am' ? 'en' : 'am')} className="absolute top-4 right-4 p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors" aria-label="Toggle language"><Globe className="h-6 w-6" /></button>
                </header>

                {isSubmitted && (
                    <div className="p-4 sm:p-6 text-center">
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
                                <div key={qIndex} className={`p-3 sm:p-4 border ${isSubmitted ? (mcqAnswers[qIndex] === q.correct ? 'border-green-400' : 'border-red-400') : 'border-gray-200'}`}>
                                    <p className="font-semibold mb-3 text-base">{qIndex + 1}. {q.q}</p>
                                    <div className="space-y-2">
                                        {q.options.map((option, oIndex) => {
                                            const isSelected = mcqAnswers[qIndex] === oIndex;
                                            const isCorrect = q.correct === oIndex;
                                            return (
                                                <label key={oIndex} className={`flex items-center p-3 border transition-colors text-sm sm:text-base ${isSubmitted ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100'} ${isSelected && !isSubmitted ? 'bg-blue-100 border-blue-500' : 'border-gray-300'} `}>
                                                    <input type="radio" name={`mcq-${qIndex}`} checked={isSelected} onChange={() => handleMcqChange(qIndex, oIndex)} disabled={isSubmitted} className="h-4 w-4 text-blue-600 focus:ring-blue-500"/>
                                                    <span className="ml-3">{option}</span>
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
                                <div key={qIndex} className={`p-3 sm:p-4 border ${isSubmitted ? (tfAnswers[qIndex] === q.correct ? 'border-green-400' : 'border-red-400') : 'border-gray-200'}`}>
                                    <p className="font-semibold mb-3 text-base">{quizData.multipleChoice.questions.length + qIndex + 1}. {q.q}</p>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                        <label className={`w-full flex items-center justify-center p-3 border font-bold ${isSubmitted ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100'} ${tfAnswers[qIndex] === true && !isSubmitted ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}>
                                            <input type="radio" name={`tf-${qIndex}`} checked={tfAnswers[qIndex] === true} onChange={() => handleTfChange(qIndex, true)} disabled={isSubmitted} className="opacity-0 w-0 h-0" />
                                            እውነት
                                            {isSubmitted && q.correct === true && <CheckCircle className="ml-auto h-5 w-5 text-green-600"/>}
                                            {isSubmitted && tfAnswers[qIndex] === true && !q.correct && <XCircle className="ml-auto h-5 w-5 text-red-600"/>}
                                        </label>
                                        <label className={`w-full flex items-center justify-center p-3 border font-bold ${isSubmitted ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100'} ${tfAnswers[qIndex] === false && !isSubmitted ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}>
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
                            <button onClick={handleSubmit} className="w-full flex items-center justify-center py-3 px-6 sm:py-4 bg-blue-600 text-white font-bold text-base sm:text-lg hover:bg-blue-700">
                                <Send className="mr-3" />
                                {quizData.submitButton}
                            </button>
                        </div>
                    )}
                    <ChapterNavigation previous='/content/686e8e6523afc16ef4f670c3' next='/content/686e8e6523afc16ef4f670c9' lang={lang}/>
                </main>
            </div>
        </div>
    );
}

// components/QuizDisplay.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you use Shadcn UI
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Example for MCQs later
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // For free-form answers
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface QuizQuestion {
    question: string;
    answer: string;
    // options?: string[]; // For MCQs
}

interface QuizData {
    _id: string;
    userId: string;
    contentId: string;
    quizData: QuizQuestion[];
    createdAt: string;
    updatedAt: string;
}

interface QuizDisplayProps {
    contentId: string | null;
}

type QuizState = 'idle' | 'loading' | 'active' | 'results' | 'error' | 'no_quiz';

export function QuizDisplay({ contentId }: QuizDisplayProps) {
    const [quizState, setQuizState] = useState<QuizState>('idle');
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [score, setScore] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const fetchQuiz = useCallback(async (forceRegenerate = false) => {
        if (!contentId) return;

        setQuizState('loading');
        setErrorMsg('');
        setQuiz(null); // Clear previous quiz data
        setUserAnswers({});
        setCurrentQuestionIndex(0);
        setScore(null);

        try {
            // TODO: Add forceRegenerate param to API if needed later
            const response = await fetch(`/api/quiz?contentId=${contentId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch quiz');
            }

            if (!data.quiz || !data.quiz.quizData || data.quiz.quizData.length === 0) {
                 console.log('No quiz data received or quiz is empty.');
                 // This case could happen if generation failed silently or content was too short
                 setQuizState('no_quiz');
                 setErrorMsg('Could not generate a quiz for this content.');
                 return;
            }

            setQuiz(data.quiz);
            setQuizState('idle'); // Ready to start
            console.log("Quiz loaded:", data.quiz);

        } catch (err: any) {
            console.error('Error fetching quiz:', err);
            setErrorMsg(err.message || 'An unknown error occurred.');
            setQuizState('error');
        }
    }, [contentId]);

    // Fetch quiz when contentId changes
    useEffect(() => {
        if (contentId) {
            fetchQuiz();
        } else {
            // Reset if contentId becomes null
            setQuizState('idle');
            setQuiz(null);
            setErrorMsg('');
        }
        // Intentionally disable exhaustive-deps for fetchQuiz,
        // as we only want it to re-run when contentId changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentId]);

    // Function to update progress
    const updateProgress = async (status: 'in-progress' | 'completed', finalScore?: number) => {
       if (!contentId || !quiz) return;
       try {
           const progressValue = finalScore !== undefined ? finalScore : (status === 'in-progress' ? 0 : undefined); // Calculate progress value, default to 0 if starting

           // Ensure progress is defined before sending
           if (progressValue === undefined) {
               console.warn("Progress value is undefined, skipping update.");
               return;
           }

           const response = await fetch(`/api/progress`, {
               method: 'POST', // *** CORRECTED: Use POST method as defined in the API route ***
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                   contentId: contentId,
                   contentType: 'quiz',
                   status: status, // Let the API derive status from progress if needed, but sending it can work too
                   progress: progressValue, // Send calculated progress (score or 0 for start)
                   // quizId: quiz._id // Optional: Send quiz ID for reference if your API uses it
               }),
           });
           if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' })); // Add catch for non-JSON errors
                throw new Error(errorData.error || `Failed to update progress (${response.status})`);
           }
           console.log(`Progress updated via POST for status: ${status}`);
           // const updatedData = await response.json(); // Optionally use the response data
       } catch (error: any) {
           console.error('Failed to update progress:', error);
           toast.error(`Failed to update progress: ${error.message}`);
       }
   };


    const handleStartQuiz = () => {
        if (quiz && quiz.quizData.length > 0) {
            setUserAnswers({});
            setCurrentQuestionIndex(0);
            setScore(null);
            setQuizState('active');
             updateProgress('in-progress', 0); // Mark as started with 0 progress
        }
    };

    const handleAnswerChange = (value: string) => {
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: value,
        }));
    };

    const handleNextQuestion = () => {
        if (quiz && currentQuestionIndex < quiz.quizData.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmitQuiz = () => {
        if (!quiz) return;
        let correctAnswers = 0;
        quiz.quizData.forEach((q, index) => {
            // Simple case-insensitive comparison, trim whitespace
            const userAnswer = userAnswers[index]?.trim().toLowerCase();
            const correctAnswer = q.answer.trim().toLowerCase();
            if (userAnswer === correctAnswer) {
                correctAnswers++;
            }
        });
        const calculatedScore = Math.round((correctAnswers / quiz.quizData.length) * 100);
        setScore(calculatedScore);
        setQuizState('results');
        updateProgress('completed', calculatedScore); // Mark as completed with score
        toast.success(`Quiz finished! Your score: ${calculatedScore}%`);
    };

    const handleRetry = () => {
        // Option 1: Just reset state to retake the same questions
        setUserAnswers({});
        setCurrentQuestionIndex(0);
        setScore(null);
        setQuizState('active');
        updateProgress('in-progress', 0); // Mark as restarted with 0 progress

        // Option 2: Fetch a potentially new quiz (if you want regeneration)
        // fetchQuiz();
    };

    // --- Render Logic ---

    if (!contentId) {
        return null; // Don't render if there's no content ID
    }

    if (quizState === 'loading') {
        return (
            <div className="mt-8 flex items-center justify-center p-6 border rounded-lg shadow-sm bg-card text-card-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading Quiz...</span>
            </div>
        );
    }

     if (quizState === 'error') {
         return (
             <div className="mt-8 p-6 border border-destructive rounded-lg shadow-sm bg-destructive/10 text-destructive-foreground">
                 <p className="font-semibold">Error loading quiz:</p>
                 <p>{errorMsg}</p>
                 <Button variant="outline" size="sm" onClick={() => fetchQuiz()} className="mt-4">
                     <RefreshCw className="h-4 w-4 mr-2" /> Try Again
                 </Button>
             </div>
         );
     }

     if (quizState === 'no_quiz') {
         return (
             <div className="mt-8 p-6 border rounded-lg shadow-sm bg-muted text-muted-foreground">
                 <p>{errorMsg || 'No quiz is available for this content at the moment.'}</p>
                  {/* Optionally add a button to try generating again */}
                 {/* <Button variant="outline" size="sm" onClick={() => fetchQuiz(true)} className="mt-4">
                     <RefreshCw className="h-4 w-4 mr-2" /> Try to Generate
                 </Button> */}
             </div>
         );
     }

     if (quizState === 'idle' && quiz) {
         return (
             <div className="mt-8 flex flex-col items-center p-6 border rounded-lg shadow-sm bg-card text-card-foreground">
                 <h3 className="text-lg font-semibold mb-4">Ready to test your knowledge?</h3>
                 <p className="text-sm text-muted-foreground mb-4">A {quiz.quizData.length}-question quiz has been generated for this content.</p>
                 <Button onClick={handleStartQuiz}>Start Quiz</Button>
             </div>
         );
     }

    if (quizState === 'active' && quiz) {
        const currentQuestion = quiz.quizData[currentQuestionIndex];
        return (
            <Card className="mt-8 w-full shadow-lg">
                <CardHeader>
                    <CardTitle>Quiz Question {currentQuestionIndex + 1} of {quiz.quizData.length}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 font-medium text-base">{currentQuestion.question}</p>
                    {/* Input for the answer - Use RadioGroup for MCQs later */}
                    <Label htmlFor={`answer-${currentQuestionIndex}`} className="sr-only">Your Answer</Label>
                     <Textarea
                        id={`answer-${currentQuestionIndex}`}
                        placeholder="Type your answer here..."
                        value={userAnswers[currentQuestionIndex] || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(e.target.value)} // Explicit type added
                        className="min-h-[100px]" // Adjust size as needed
                    />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
                        Previous
                    </Button>
                    {currentQuestionIndex < quiz.quizData.length - 1 ? (
                        <Button onClick={handleNextQuestion}>Next</Button>
                    ) : (
                        <Button onClick={handleSubmitQuiz} variant="default">
                            Submit Quiz
                        </Button>
                    )}
                </CardFooter>
            </Card>
        );
    }

    if (quizState === 'results' && quiz && score !== null) {
        return (
            <Card className="mt-8 w-full shadow-lg">
                <CardHeader>
                    <CardTitle>Quiz Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-2xl font-bold mb-4">Your Score: {score}%</p>
                    <div className="space-y-4">
                        {quiz.quizData.map((q, index) => {
                            const userAnswer = userAnswers[index]?.trim() || '';
                            const correctAnswer = q.answer.trim();
                            const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
                            return (
                                <div key={index} className={`p-3 rounded-md border ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                                    <p className="font-semibold mb-1">{index + 1}. {q.question}</p>
                                    <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                        Your Answer: <span className={!userAnswer ? 'italic text-gray-500' : ''}>{userAnswer || 'No answer'}</span>
                                    </p>
                                    {!isCorrect && (
                                        <p className="text-sm text-blue-700">Correct Answer: {correctAnswer}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
                 <CardFooter className="flex justify-center">
                    <Button onClick={handleRetry} variant="secondary">
                         <RefreshCw className="h-4 w-4 mr-2" /> Retake Quiz
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return null; // Default case
}
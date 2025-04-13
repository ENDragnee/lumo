// components/QuizDisplay.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you use Shadcn UI
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Example for MCQs later
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // For free-form answers
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Interface for individual quiz questions within the quiz data
interface QuizQuestion {
    question: string;
    answer: string;
    // options?: string[]; // For MCQs later
}

// Interface for the overall quiz data structure fetched from the API
interface QuizData {
    _id: string;
    userId: string;
    contentId: string;
    quizData: QuizQuestion[];
    createdAt: string;
    updatedAt: string;
}

// Interface for the user progress data structure fetched from the API
interface IUserProgress {
    _id: string | null; // Can be null if it's the default "not started" object from GET /api/progress
    userId: string;
    contentId: string;
    contentType: 'lesson' | 'quiz';
    progress: number; // Score (0-100) for completed quizzes
    status: 'not-started' | 'in-progress' | 'completed';
    createdAt?: string; // Optional, depends on your API response
    updatedAt?: string; // Optional, depends on your API response
}


interface QuizDisplayProps {
    contentId: string | null;
}

// Updated state machine type to include progress loading
type QuizState = 'idle' | 'loading_quiz' | 'loading_progress' | 'active' | 'results' | 'error' | 'no_quiz';

export function QuizDisplay({ contentId }: QuizDisplayProps) {
    // Component State Hooks
    const [quizState, setQuizState] = useState<QuizState>('idle');
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [userProgress, setUserProgress] = useState<IUserProgress | null>(null); // State for fetched progress
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({}); // Stores answers for the current attempt
    const [score, setScore] = useState<number | null>(null); // Can be from current attempt or loaded progress
    const [errorMsg, setErrorMsg] = useState<string>('');

    // Function to fetch existing progress for the current user and content
    const fetchProgress = useCallback(async () => {
        if (!contentId) return;
        // This is typically called after quiz data is loaded successfully
        // setQuizState('loading_progress'); // State is set before calling this

        try {
            const response = await fetch(`/api/progress?contentId=${contentId}&contentType=quiz`);
            const data = await response.json();

            if (!response.ok) {
                // Log warning but don't block quiz functionality if progress fetch fails
                console.warn(`Failed to fetch progress: ${data.error || response.statusText}`);
                setUserProgress(null);
                setQuizState('idle'); // Proceed to idle state to allow starting the quiz
                return;
            }

            // Check if a valid progress record was returned (not just the default object)
            if (data.progress && data.progress._id) {
                 setUserProgress(data.progress);
                 // Check if the fetched progress is already completed
                 if (data.progress.status === 'completed') {
                     setScore(data.progress.progress); // Pre-fill score from saved progress
                     setUserAnswers({}); // Clear any stale answers if showing previous results
                     setQuizState('results'); // Go directly to the results view
                 } else {
                     // If progress exists but not completed (e.g., 'in-progress'), go to idle
                     // We could potentially restore answers here later if needed
                     setQuizState('idle');
                 }
            } else {
                // No progress record found or default "not-started" returned
                setUserProgress(null);
                setQuizState('idle'); // Go to idle state, ready to start fresh
            }

        } catch (err: any) {
            console.error('Error fetching progress:', err);
            // Allow quiz to proceed even if progress fetch fails
             setUserProgress(null);
             setQuizState('idle');
        }
    }, [contentId]); // Dependency: only contentId

    // Function to fetch the quiz data
    const fetchQuiz = useCallback(async (forceRegenerate = false) => {
        if (!contentId) return;

        // Reset states and start loading quiz
        setQuizState('loading_quiz');
        setErrorMsg('');
        setQuiz(null);
        setUserProgress(null);
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

            // Handle case where quiz generation failed or content was unsuitable
            if (!data.quiz || !data.quiz.quizData || data.quiz.quizData.length === 0) {
                 console.log('No quiz data received or quiz is empty.');
                 setQuizState('no_quiz');
                 setErrorMsg('Could not generate a quiz for this content.');
                 return;
            }

            // Quiz data loaded successfully
            setQuiz(data.quiz);
            console.log("Quiz loaded, now fetching progress...");

            // Transition state and fetch progress
            setQuizState('loading_progress');
            await fetchProgress(); // Chain the progress fetch

        } catch (err: any) {
            console.error('Error fetching quiz:', err);
            setErrorMsg(err.message || 'An unknown error occurred.');
            setQuizState('error');
        }
    // Include fetchProgress in dependency array because it's called within fetchQuiz
    }, [contentId, fetchProgress]);

    // Effect Hook: Fetch quiz when contentId changes
    useEffect(() => {
        if (contentId) {
            fetchQuiz();
        } else {
            // Reset component if contentId becomes null (e.g., navigating away)
            setQuizState('idle');
            setQuiz(null);
            setUserProgress(null);
            setErrorMsg('');
            setUserAnswers({});
            setCurrentQuestionIndex(0);
            setScore(null);
        }
        // Only re-run when contentId changes. fetchQuiz's dependencies are handled by useCallback.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentId]);

    // Function to update progress via the API
    const updateProgress = async (status: 'in-progress' | 'completed', currentScore?: number) => {
        if (!contentId || !quiz) return; // Need contentId and loaded quiz to update progress
        try {
            // Determine progress value: score if completed, 0 if starting/in-progress
            const progressValue = status === 'completed' ? (currentScore ?? 0) : 0;
 
            const response = await fetch(`/api/progress`, {
                method: 'POST', // Use POST as defined in the API route for upsert
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contentId: contentId,
                    contentType: 'quiz',
                    status: status, // Send the intended status explicitly
                    progress: progressValue, // Send the calculated progress value (score or 0)
                }),
            });
 
            if (!response.ok) {
                 // Try to parse error response from API
                 const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
                 throw new Error(errorData.error || `Failed to update progress (${response.status})`);
            }
 
            console.log(`Progress updated via POST for status: ${status}, progress: ${progressValue}`);
 
             // *** FIX: Only re-fetch progress AFTER completing the quiz ***
             if (status === 'completed') {
                 // Re-fetch progress after completion update to ensure UI reflects the latest saved state
                 // This is useful if the user might interact further after seeing results.
                await fetchProgress();
             }
             // *** No need to re-fetch progress immediately after setting 'in-progress' ***
 
        } catch (error: any) {
            console.error('Failed to update progress:', error);
            toast.error(`Failed to update progress: ${error.message}`);
            // Consider how to handle UI state if update fails (e.g., revert?)
        }
    };

    // Handler to start the quiz
    const handleStartQuiz = () => {
        if (quiz && quiz.quizData.length > 0) {
            setUserAnswers({}); // Clear answers from any previous attempt shown in results
            setCurrentQuestionIndex(0);
            setScore(null); // Clear any score from previous attempts/progress
            setQuizState('active');
             updateProgress('in-progress'); // Update status to 'in-progress', progress defaults to 0 in API call
        }
    };

    // Handler for changes in the answer input (Textarea)
    const handleAnswerChange = (value: string) => {
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: value,
        }));
    };

    // Handler for the "Next" button
    const handleNextQuestion = () => {
        if (quiz && currentQuestionIndex < quiz.quizData.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    // Handler for the "Previous" button
    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    // Handler for submitting the quiz
    const handleSubmitQuiz = () => {
        if (!quiz) return;
        let correctAnswers = 0;
        // Calculate score based on current userAnswers
        quiz.quizData.forEach((q, index) => {
            const userAnswer = userAnswers[index]?.trim().toLowerCase();
            const correctAnswer = q.answer.trim().toLowerCase();
            if (userAnswer === correctAnswer) {
                correctAnswers++;
            }
        });
        const calculatedScore = Math.round((correctAnswers / quiz.quizData.length) * 100);
        setScore(calculatedScore); // Update score state with the result of this attempt
        setQuizState('results'); // Move to results view
        updateProgress('completed', calculatedScore); // Update progress API with 'completed' status and score
        toast.success(`Quiz finished! Your score: ${calculatedScore}%`);
    };

    // Handler for the "Retake Quiz" button
    const handleRetry = () => {
        setUserAnswers({}); // Clear answers
        setCurrentQuestionIndex(0);
        setScore(null); // Clear score display
        setQuizState('active'); // Go back to the first question
        updateProgress('in-progress'); // Update status back to 'in-progress'
    };

    // --- Conditional Rendering Logic ---

    // Don't render anything if contentId is not provided
    if (!contentId) {
        return null;
    }

    // Loading states for quiz data or progress data
    if (quizState === 'loading_quiz' || quizState === 'loading_progress') {
        return (
            <div className="mt-8 flex items-center justify-center p-6 border rounded-lg shadow-sm bg-card text-card-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>{quizState === 'loading_quiz' ? 'Loading Quiz...' : 'Loading Progress...'}</span>
            </div>
        );
    }

    // Error state during loading
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

    // State when no quiz could be generated or found
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

    // Idle state: Quiz data is loaded, and progress is either non-existent or not 'completed'.
    // Show the "Start Quiz" button.
     if (quizState === 'idle' && quiz) {
         return (
             <div className="mt-8 flex flex-col items-center p-6 border rounded-lg shadow-sm bg-card text-card-foreground">
                 <h3 className="text-lg font-semibold mb-4">Ready to test your knowledge?</h3>
                 <p className="text-sm text-muted-foreground mb-4">A {quiz.quizData.length}-question quiz is available for this content.</p>
                 {/* We could add more complex logic here later for resuming 'in-progress' quizzes */}
                 <Button onClick={handleStartQuiz}>Start Quiz</Button>
             </div>
         );
     }

    // Active state: User is taking the quiz
    if (quizState === 'active' && quiz) {
        const currentQuestion = quiz.quizData[currentQuestionIndex];
        return (
            <Card className="mt-8 w-full shadow-lg">
                <CardHeader>
                    <CardTitle>Quiz Question {currentQuestionIndex + 1} of {quiz.quizData.length}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 font-medium text-base">{currentQuestion.question}</p>
                    {/* Input for the answer */}
                    <Label htmlFor={`answer-${currentQuestionIndex}`} className="sr-only">Your Answer</Label>
                     <Textarea
                        id={`answer-${currentQuestionIndex}`}
                        placeholder="Type your answer here..."
                        value={userAnswers[currentQuestionIndex] || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(e.target.value)}
                        className="min-h-[100px]"
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

    // Results state: Quiz finished or previously completed progress loaded
    if (quizState === 'results' && quiz && score !== null) {
        // Determine if results are from a fresh submission (userAnswers has data)
        // or from loaded progress (userAnswers is empty).
        const justSubmitted = Object.keys(userAnswers).length > 0;

        return (
            <Card className="mt-8 w-full shadow-lg">
                <CardHeader>
                    <CardTitle>Quiz Results</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Display score */}
                    <p className="text-center text-2xl font-bold mb-4">
                        {/* Adjust title based on how results were reached */}
                        {justSubmitted ? "Your Score:" : "Previously Completed Score:"} {score}%
                    </p>

                    {/* Show detailed answer review ONLY if the user just submitted */}
                    {justSubmitted && (
                         <div className="space-y-4 mt-6 border-t pt-4">
                             <h4 className="text-md font-semibold mb-2 text-center">Review Your Answers:</h4>
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
                    )}

                    {/* Show simpler message if viewing previously completed progress */}
                     {!justSubmitted && (
                         <p className="text-center text-muted-foreground text-sm mt-4">You previously completed this quiz.</p>
                    )}
                </CardContent>
                 <CardFooter className="flex justify-center mt-4">
                    {/* Always show Retake button in results view */}
                    <Button onClick={handleRetry} variant="secondary">
                         <RefreshCw className="h-4 w-4 mr-2" /> Retake Quiz
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    // Fallback return if none of the states match (should ideally not be reached)
    console.warn("QuizDisplay reached fallback return, current state:", quizState);
    return null;
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// --- ACTION & TYPE IMPORTS ---
import { getOrGenerateChallenge } from '@/app/actions/challenge'; // Import the new server action
// The interfaces below match the models/types, so they remain valid
import { IChallenge as ChallengeData } from '@/models/Challenge'; 
import { IScore as ScoreData } from '@/models/Score';
import { submitAndEvaluateChallenge, getScoreHistory } from '@/app/actions/score'; // Import score actions

interface QuizDisplayProps {
    contentId: string | null;
}

type QuizState = 'loading' | 'idle' | 'active' | 'submitting' | 'results' | 'error' | 'no_challenge';

export function QuizDisplay({ contentId }: QuizDisplayProps) {
    const [state, setState] = useState<QuizState>('loading');
    const [challenge, setChallenge] = useState<ChallengeData | null>(null);
    const [latestScore, setLatestScore] = useState<ScoreData | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [errorMsg, setErrorMsg] = useState<string>('');

    const fetchChallengeData = useCallback(async () => {
        if (!contentId) return;

        setState('loading');
        // Reset states
        setChallenge(null);
        setLatestScore(null);
        setUserAnswers({});
        setCurrentQuestionIndex(0);
        setErrorMsg('');

        try {
            // 1. Call the Server Action
            const loadedChallenge = await getOrGenerateChallenge(contentId);
            setChallenge(loadedChallenge);

            // 2. If completed, fetch the latest score
            if (loadedChallenge.status === 'completed') {
                const scores = await getScoreHistory(loadedChallenge._id.toString());
                if (scores.length > 0) {
                    setLatestScore(scores[0]);
                }
                setState('results');
            } else {
                setState('idle');
            }
        } catch (err: any) {
            console.error('Error loading challenge data:', err);
            setErrorMsg(err.message || 'An unknown error occurred.');
            setState('error');
        }
    }, [contentId]);

    useEffect(() => {
        if (contentId) {
            fetchChallengeData();
        }
    }, [contentId, fetchChallengeData]);

    const handleSubmitQuiz = async () => {
        if (!challenge) return;
        setState('submitting');
        
        const answersToSubmit = challenge.quizData.map((q, index) => ({
            question: q.question,
            answer: userAnswers[index] || '',
        }));

        try {
            const resultScore = await submitAndEvaluateChallenge({
                challengeId: challenge._id.toString(),
                userAnswers: answersToSubmit,
            });
            
            setLatestScore(resultScore);
            toast.success(`Quiz finished! Your AI-evaluated score: ${resultScore.score}%`);
            setState('results');

        } catch (error: any) {
            console.error('Failed to submit quiz:', error);
            toast.error(`Submission failed: ${error.message}`);
            setState('active');
        }
    };

    const handleStartQuiz = () => {
        setUserAnswers({});
        setCurrentQuestionIndex(0);
        setLatestScore(null);
        setState('active');
    };

    // --- Other handlers (handleAnswerChange, handleNext, handlePrev) remain the same ---
    const handleAnswerChange = (value: string) => setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: value }));
    const handleNextQuestion = () => {
        if (challenge && currentQuestionIndex < challenge.quizData.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };
    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };
    
    // --- RENDER LOGIC (No major changes needed, but updated labels) ---
    if (!contentId) return null;
    if (state === 'loading') return <div className="p-6 text-center"><Loader2 className="h-6 w-6 animate-spin inline-block" /> Loading Challenge...</div>;
    if (state === 'submitting') return <div className="p-6 text-center"><Loader2 className="h-6 w-6 animate-spin inline-block" /> AI is grading your answers...</div>;
    
    if (state === 'error' || state === 'no_challenge') {
        return <div className="p-4 border border-destructive bg-destructive/10">
            <p className="font-bold">{errorMsg}</p>
            <Button onClick={fetchChallengeData} variant="outline" size="sm" className="mt-2"><RefreshCw className="h-4 w-4 mr-2" />Try Again</Button>
        </div>;
    }

    if (state === 'idle' && challenge) {
        return <div className="p-6 text-center border rounded-lg">
            <h3 className="text-lg font-semibold">Ready to test your knowledge?</h3>
            <p className="text-sm text-muted-foreground mb-4">An AI-generated challenge with {challenge.quizData.length} questions is available.</p>
            <Button onClick={handleStartQuiz}>Start Challenge</Button>
        </div>;
    }
    
    if (state === 'active' && challenge) {
        const currentQuestion = challenge.quizData[currentQuestionIndex];
        return (
            <Card className="w-full">
                <CardHeader><CardTitle>Question {currentQuestionIndex + 1} of {challenge.quizData.length}</CardTitle></CardHeader>
                <CardContent>
                    <p className="font-medium mb-4">{currentQuestion.question}</p>
                    <Textarea placeholder="Type your answer..." value={userAnswers[currentQuestionIndex] || ''} onChange={(e) => handleAnswerChange(e.target.value)} />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>Previous</Button>
                    {currentQuestionIndex < challenge.quizData.length - 1 ? (
                        <Button onClick={handleNextQuestion}>Next</Button>
                    ) : (
                        <Button onClick={handleSubmitQuiz}>Submit for AI Grading</Button>
                    )}
                </CardFooter>
            </Card>
        );
    }
    
    if (state === 'results' && challenge && latestScore) {
        return (
            <Card className="w-full">
                <CardHeader><CardTitle>Challenge Results</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-center text-2xl font-bold">Your AI-Evaluated Score: {latestScore.score}%</p>
                    <div className="space-y-4 mt-6 border-t pt-4">
                        <h4 className="text-center font-semibold">Answer Review</h4>
                        {latestScore.answers.map((ans, index) => {
                            const originalQuestion = challenge.quizData.find(q => q.question === ans.question);
                            return (
                                <div key={index} className={`p-3 rounded-md border ${ans.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                                    <p className="font-semibold">{index + 1}. {ans.question}</p>
                                    <p className={`text-sm ${ans.isCorrect ? 'text-green-700' : 'text-red-700'}`}>Your Answer: <span className={!ans.userAnswer ? 'italic' : ''}>{ans.userAnswer || 'No answer'}</span></p>
                                    {!ans.isCorrect && (
                                        <p className="text-sm text-blue-700">Ideal Answer: {originalQuestion?.answer}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
                <CardFooter className="justify-center mt-4">
                    <Button onClick={handleStartQuiz} variant="secondary"><RefreshCw className="h-4 w-4 mr-2" />Retake Challenge</Button>
                </CardFooter>
            </Card>
        );
    }

    return null;
}

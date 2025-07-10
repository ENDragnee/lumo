// /app/api/score/route.ts

import { NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';
import mongoose, { Types } from 'mongoose';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Score, { IUserAnswer } from '@/models/Score';
import Challenge, { IChallenge, IChallengeQuestion } from '@/models/Challenge';

// --- Initialize Gemini Client for Scoring ---
const apiKey = process.env.GEMINI_API_KEY;
let scorerAI: GoogleGenerativeAI | null = null;
let scorerModel: any = null;

if (apiKey) {
    try {
        scorerAI = new GoogleGenerativeAI(apiKey);
        scorerModel = scorerAI.getGenerativeModel({
            model: "gemini-2.0-flash-latest",
            safetySettings: [ /* Safety settings as needed */ ],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.2 // Low temperature for consistent, analytical scoring
            },
        });
    } catch (e: any) {
        console.error("Failed to initialize Gemini for scoring:", e.message);
    }
} else {
    console.error("FATAL ERROR in score API: GEMINI_API_KEY is not set.");
}


// --- AI EVALUATION HELPER ---
/**
 * Evaluates a user's answers against the correct answers using Gemini.
 * @param challengeData The full challenge object containing questions and ideal answers.
 * @param userAnswers The user's submitted answers.
 * @returns A promise that resolves to the evaluated score and detailed answer feedback.
 */
async function evaluateAnswersWithAI(challengeData: IChallenge, userAnswers: Array<{ question: string; answer: string }>): Promise<{ finalScore: number; detailedAnswers: IUserAnswer[] }> {
    if (!scorerModel) {
        throw new Error("AI Scorer is not available.");
    }

    const evaluationPrompt = `
    You are an AI-powered grading assistant. Your task is to evaluate a user's answers for a quiz based on a provided set of ideal answers.
    You must be fair and flexible, accepting answers that are semantically correct even if they are not phrased identically to the ideal answer.

    **Instructions:**
    1.  Analyze the following list of questions, the user's answers, and the ideal answers.
    2.  For each question, determine if the user's answer is correct. A "correct" answer is one that captures the main point of the ideal answer, even with different wording. A blank answer is always incorrect.
    3.  Your entire response MUST be ONLY a single, valid JSON object.
    4.  The JSON object must have a key "evaluation" which is an array of objects.
    5.  Each object in the "evaluation" array must have three properties:
        - "question": string (The original question)
        - "userAnswer": string (The user's provided answer)
        - "isCorrect": boolean (Your determination of correctness)

    **Example Output Structure:**
    {
      "evaluation": [
        {
          "question": "What is the capital of France?",
          "userAnswer": "The capital city is Paris.",
          "isCorrect": true
        },
        {
          "question": "What is 2 + 2?",
          "userAnswer": "3",
          "isCorrect": false
        }
      ]
    }

    ---
    **Quiz Data to Evaluate:**

    ${JSON.stringify({
        questionsAndIdealAnswers: challengeData.quizData,
        userSubmissions: userAnswers
    }, null, 2)}
    ---

    Generate the JSON response now.
    `;

    try {
        const result = await scorerModel.generateContent(evaluationPrompt);
        const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            throw new Error("AI evaluation returned an empty response.");
        }
        
        const parsedResult = JSON.parse(responseText);
        const evaluation: IUserAnswer[] = parsedResult.evaluation;

        if (!Array.isArray(evaluation)) {
            throw new Error("AI evaluation result is not in the expected format.");
        }

        let correctCount = 0;
        evaluation.forEach(evalItem => {
            if (evalItem.isCorrect) {
                correctCount++;
            }
        });

        const totalQuestions = challengeData.quizData.length;
        const finalScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
        
        return { finalScore, detailedAnswers: evaluation };

    } catch (error: any) {
        console.error("Error during AI evaluation:", error.message);
        throw new Error("Failed to evaluate answers using AI.");
    }
}


interface SessionUser { id?: string; _id?: string; }
interface SubmitScoreRequestBody { challengeId: string; userAnswers: Array<{ question: string; answer: string }>; }

// --- POST Handler: Submit a Challenge, Evaluate with AI, and Save ---
export async function POST(request: Request) {
    if (!scorerModel) {
        return NextResponse.json({ error: "Service Unavailable: The scoring service is currently down." }, { status: 503 });
    }
    
    try {
        const session: Session | null = await getServerSession(authOptions);
        const userIdString = session?.user?.id ;
        if (!userIdString) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = new Types.ObjectId(userIdString);

        const body: SubmitScoreRequestBody = await request.json();
        const { challengeId: challengeIdParam, userAnswers } = body;
        if (!challengeIdParam || !userAnswers || !Array.isArray(userAnswers)) {
            return NextResponse.json({ error: 'Missing challengeId or userAnswers' }, { status: 400 });
        }
        const challengeId = new Types.ObjectId(challengeIdParam);

        await connectDB();
        const challenge: IChallenge | null = await Challenge.findById(challengeId).lean<IChallenge>();
        if (!challenge) {
            return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
        }
        if (challenge.userId.toString() !== userId.toString()) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        
        // 4. Evaluate Score with AI
        const { finalScore, detailedAnswers } = await evaluateAnswersWithAI(challenge, userAnswers);
        
        // 5. Save the Score Record
        const newScore = new Score({
            userId,
            challengeId,
            score: finalScore,
            answers: detailedAnswers,
        });
        await newScore.save();

        // 6. Update the Challenge status to 'completed'
        await Challenge.findByIdAndUpdate(challengeId, { $set: { status: 'completed' } });
        
        console.log(`AI-evaluated score of ${finalScore}% saved for challenge ${challengeId}`);

        // 7. Return the new score
        return NextResponse.json({ score: newScore.toObject() }, { status: 201 });

    } catch (error: any) {
        console.error('Error in POST /api/score:', error.message);
        return NextResponse.json({ error: error.message || 'Failed to submit score' }, { status: 500 });
    }
}

// --- GET Handler: Fetch Score History (NO CHANGES NEEDED) ---
export async function GET(request: Request) {
    // ... This function remains exactly the same as before ...
    try {
        const session: Session | null = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { searchParams } = new URL(request.url);
        const challengeIdParam = searchParams.get('challengeId');
        if (!challengeIdParam || !mongoose.Types.ObjectId.isValid(challengeIdParam)) {
            return NextResponse.json({ error: 'Invalid or missing challengeId parameter' }, { status: 400 });
        }
        await connectDB();
        const scores = await Score.find({ challengeId: new Types.ObjectId(challengeIdParam) }).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ scores: scores || [] }, { status: 200 });
    } catch (error: any) {
        console.error('Error in GET /api/score:', error);
        return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
    }
}

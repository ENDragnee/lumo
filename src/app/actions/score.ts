// /app/actions/score.ts (Updated)
'use server';

import { getServerSession } from 'next-auth';
import mongoose, { Types } from 'mongoose';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Score, { IScore, IUserAnswer } from '@/models/Score';
import Challenge, { IChallenge } from '@/models/Challenge';
import { calculateAndStorePerformance } from '@/app/actions/calculateAndStorePerformance'; // Ensure this path is correct

// --- Initialize Gemini Client for Scoring ---
const apiKey = process.env.GEMINI_API_KEY;
let scorerAI: GoogleGenerativeAI | null = null;
let scorerModel: any = null;

if (apiKey) {
    try {
        scorerAI = new GoogleGenerativeAI(apiKey);
        scorerModel = scorerAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.2, // Low temperature for consistent, analytical scoring
            },
        });
    } catch (e: any) {
        console.error("Failed to initialize Gemini for scoring:", e.message);
    }
} else {
    console.error("FATAL ERROR in score action: GEMINI_API_KEY is not set.");
}


// --- AI EVALUATION HELPER ---
/**
 * Evaluates user answers against ideal answers using Gemini AI.
 * @param challengeData The challenge document containing questions and ideal answers.
 * @param userAnswers The array of answers submitted by the user.
 * @returns A promise resolving to the final score and a detailed breakdown of answers.
 */
async function evaluateAnswersWithAI(
    challengeData: IChallenge, 
    userAnswers: Array<{ question: string; answer: string }>
): Promise<{ finalScore: number; detailedAnswers: IUserAnswer[] }> {
    if (!scorerModel) {
        throw new Error("AI Scorer is not available.");
    }
    
    const evaluationPrompt = `
    You are an expert AI grading assistant. Your task is to evaluate a user's answers for a quiz.
    Compare each user's answer to the corresponding "ideal answer". Be flexible with phrasing and synonyms, but strict on factual correctness.
    
    Your entire response MUST be ONLY a single, valid JSON object.
    This JSON object must have a single key: "evaluation".
    The value of "evaluation" must be an array of objects.
    Each object in the array must have exactly these three properties:
    1. "question": string (The original question text)
    2. "userAnswer": string (The user's submitted answer for that question)
    3. "isCorrect": boolean (Your evaluation: true if the user's answer is semantically correct, false otherwise)

    **Quiz Data to Evaluate:**
    ---
    ${JSON.stringify({
        questionsAndIdealAnswers: challengeData.quizData,
        userSubmissions: userAnswers
    }, null, 2)}
    ---
    Now, provide the JSON evaluation.
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
            throw new Error("AI evaluation result is not in the expected array format.");
        }

        // Validate that each item in the evaluation has the required fields.
        // This makes the system robust against malformed AI responses.
        const isValidEvaluation = evaluation.every(item => 
            typeof item.question === 'string' &&
            typeof item.userAnswer === 'string' &&
            typeof item.isCorrect === 'boolean'
        );

        if (!isValidEvaluation) {
            throw new Error("One or more items in the AI evaluation array has a missing or invalid property.");
        }

        const correctCount = evaluation.filter(evalItem => evalItem.isCorrect).length;
        const totalQuestions = challengeData.quizData.length;
        const finalScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
        
        // Return the validated and calculated data.
        return { finalScore, detailedAnswers: evaluation };

    } catch (error: any) {
        console.error("Error during AI evaluation:", error.message);
        console.error("Problematic AI Prompt:", evaluationPrompt);
        throw new Error("Failed to evaluate answers using AI.");
    }
}

// --- SERVER ACTIONS ---

interface SubmitPayload {
    challengeId: string;
    userAnswers: Array<{ question: string; answer: string }>;
}

/**
 * Server action to submit challenge answers, evaluate them with AI, and save the score.
 */
export async function submitAndEvaluateChallenge(payload: SubmitPayload): Promise<IScore> {
    if (!scorerModel) {
        throw new Error("Service Unavailable: The scoring service is currently down.");
    }
    
    const session = await getServerSession(authOptions);
    const userIdString = session?.user?.id;
    if (!userIdString) {
        throw new Error("Unauthorized: You must be logged in.");
    }
    
    const { challengeId, userAnswers } = payload;
    if (!challengeId || !mongoose.Types.ObjectId.isValid(challengeId) || !userAnswers) {
        throw new Error("Invalid Input: A valid challenge ID and answers are required.");
    }

    const userId = new Types.ObjectId(userIdString);
    const challengeObjectId = new Types.ObjectId(challengeId);

    try {
        await connectDB();
        const challenge: IChallenge | null = await Challenge.findById(challengeObjectId).lean<IChallenge>();
        if (!challenge) {
            throw new Error("Not Found: The challenge you are trying to submit to does not exist.");
        }
        if (challenge.userId.toString() !== userId.toString()) {
            throw new Error("Forbidden: You are not authorized to submit to this challenge.");
        }
        
        // --- CORE LOGIC CHANGE: Use AI for evaluation ---
        const { finalScore, detailedAnswers } = await evaluateAnswersWithAI(challenge, userAnswers);
        
        // Save the AI-evaluated Score Record
        const newScore = new Score({
            userId,
            challengeId: challengeObjectId,
            score: finalScore,
            answers: detailedAnswers, // Use the detailed, evaluated answers from the AI
        });
        await newScore.save();

        // Update the Challenge status
        await Challenge.findByIdAndUpdate(challengeObjectId, { $set: { status: 'completed' } });
        
        // Trigger the performance calculation after a successful submission
        await calculateAndStorePerformance(challenge.contentId.toString());

        console.log(`AI-evaluated score of ${finalScore}% saved for challenge ${challengeId}`);

        // Return a plain, serializable object for the client
        return JSON.parse(JSON.stringify(newScore.toObject()));

    } catch (error: any) {
        console.error('Error in submitAndEvaluateChallenge action:', error.message);
        // Re-throw the specific error message for the client to handle
        throw new Error(error.message || "An unexpected error occurred while submitting your score.");
    }
}


/**
 * Server action to fetch the score history for a given challenge.
 */
export async function getScoreHistory(challengeId: string): Promise<IScore[]> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }
    if (!challengeId || !mongoose.Types.ObjectId.isValid(challengeId)) {
        throw new Error("Invalid challenge ID provided.");
    }
    
    try {
        await connectDB();
        // Explicitly type the result of lean() to help TypeScript
        const scores = await Score.find({ challengeId: new Types.ObjectId(challengeId) })
            .sort({ createdAt: -1 })
            .lean<IScore[]>();
            
        return JSON.parse(JSON.stringify(scores || []));
    } catch (error: any) {
        console.error("Error in getScoreHistory action:", error.message);
        throw new Error("Failed to fetch score history.");
    }
}

// /app/actions/score.ts
'use server';

import { getServerSession } from 'next-auth';
import mongoose, { Types } from 'mongoose';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Score, { IScore, IUserAnswer } from '@/models/Score';
import Challenge, { IChallenge } from '@/models/Challenge';

// --- Initialize Gemini Client for Scoring ---
const apiKey = process.env.GEMINI_API_KEY;
let scorerAI: GoogleGenerativeAI | null = null;
let scorerModel: any = null;

if (apiKey) {
    try {
        scorerAI = new GoogleGenerativeAI(apiKey);
        scorerModel = scorerAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
            safetySettings: [ /* Safety settings as needed */ ],
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
async function evaluateAnswersWithAI(challengeData: IChallenge, userAnswers: Array<{ question: string; answer: string }>): Promise<{ finalScore: number; detailedAnswers: IUserAnswer[] }> {
    if (!scorerModel) {
        throw new Error("AI Scorer is not available.");
    }
    const evaluationPrompt = `
    You are an AI grading assistant. Evaluate the user's answers based on the provided ideal answers. Be flexible with phrasing. Your entire response MUST be ONLY a single, valid JSON object with a key "evaluation" which is an array of objects. Each object must have "question" (string), "userAnswer" (string), and "isCorrect" (boolean).

    **Quiz Data to Evaluate:**

    ${JSON.stringify({
        questionsAndIdealAnswers: challengeData.quizData,
        userSubmissions: userAnswers
    }, null, 2)}
    ---
    `;
    try {
        const result = await scorerModel.generateContent(evaluationPrompt);
        const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) throw new Error("AI evaluation returned an empty response.");
        
        const parsedResult = JSON.parse(responseText);
        const evaluation: IUserAnswer[] = parsedResult.evaluation;
        if (!Array.isArray(evaluation)) throw new Error("AI evaluation result is not in the expected format.");

        const correctCount = evaluation.filter(evalItem => evalItem.isCorrect).length;
        const totalQuestions = challengeData.quizData.length;
        const finalScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
        
        return { finalScore, detailedAnswers: evaluation };
    } catch (error: any) {
        console.error("Error during AI evaluation:", error.message);
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
 * @param payload The submission data containing challengeId and userAnswers.
 * @returns A promise that resolves to the newly created score object.
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
        
        // Evaluate Score with AI
        const { finalScore, detailedAnswers } = await evaluateAnswersWithAI(challenge, userAnswers);
        
        // Save the Score Record
        const newScore = new Score({
            userId,
            challengeId: challengeObjectId,
            score: finalScore,
            answers: detailedAnswers,
        });
        await newScore.save();

        // Update the Challenge status
        await Challenge.findByIdAndUpdate(challengeObjectId, { $set: { status: 'completed' } });
        
        console.log(`AI-evaluated score of ${finalScore}% saved for challenge ${challengeId}`);

        // Return a plain, serializable object
        return JSON.parse(JSON.stringify(newScore.toObject()));
    } catch (error: any) {
        console.error('Error in submitAndEvaluateChallenge action:', error.message);
        throw new Error(error.message || "An unexpected error occurred while submitting your score.");
    }
}


/**
 * Server action to fetch the score history for a given challenge.
 * @param challengeId The ID of the challenge to fetch scores for.
 * @returns A promise that resolves to an array of score objects.
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
        const scores = await Score.find({ challengeId: new Types.ObjectId(challengeId) })
            .sort({ createdAt: -1 })
            .lean<IScore[]>();
            
        return JSON.parse(JSON.stringify(scores || []));
    } catch (error: any) {
        console.error("Error in getScoreHistory action:", error.message);
        throw new Error("Failed to fetch score history.");
    }
}

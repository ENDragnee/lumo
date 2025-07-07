// src/app/api/challenge/[contentId]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose, { Types } from 'mongoose';
import connectDB from '@/lib/mongodb';
import Challenge, { IChallenge, IChallengeQuestion } from '@/models/Challenge'; // Use the Challenge model and its types
import Content from '@/models/Content';
import { extractTextFromCraftData } from '@/utils/craftjsUtils';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// --- Type Definitions ---
interface SessionUser {
    id?: string;
    _id?: string;
}

// --- Initialize Google AI Client (same as before) ---
const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
let model: any = null; // Using 'any' for simplicity with the SDK's complex types

if (apiKey) {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.6,
            },
        });
        console.log("Google Generative AI model initialized for challenges.");
    } catch (initError: any) {
        console.error("Failed to initialize Google Generative AI:", initError.message);
        genAI = null;
        model = null;
    }
} else {
    console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set for challenges.");
}


// --- AI Challenge Generation Helper Function ---
// This function is well-defined and only needs proper typing.
async function generateChallengeWithAI(title: string, contentText: string): Promise<IChallengeQuestion[] | null> {
    if (!model) {
        console.error("AI Model not initialized. Cannot generate challenge.");
        return null;
    }
    if (!contentText || contentText.trim().length < 50) {
        console.log('Content too short for challenge generation.');
        return null;
    }

    const truncatedContent = contentText.substring(0, 100000);
    const prompt = `
        You are an AI assistant creating a 5-question quiz.
        Based on the text (titled "${title}"), generate a valid JSON array.
        Each object in the array must have two string properties: "question" and "answer".
        Your ENTIRE response MUST be ONLY the JSON array. Do not include any other text or markdown.
        Content:
        ---
        ${truncatedContent}
        ---
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const aiResponseText = response?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponseText) {
            console.error("No valid response text found in the Gemini candidate.", JSON.stringify(response, null, 2));
            throw new Error('AI response text was empty.');
        }

        const parsedJson = JSON.parse(aiResponseText);
        
        // Validate the structure of the parsed JSON
        if (
            Array.isArray(parsedJson) &&
            parsedJson.length > 0 &&
            parsedJson.every(item =>
                typeof item === 'object' && item !== null &&
                'question' in item && typeof item.question === 'string' &&
                'answer' in item && typeof item.answer === 'string'
            )
        ) {
            return parsedJson as IChallengeQuestion[];
        } else {
            throw new Error('Parsed JSON is not a valid array of challenge questions.');
        }

    } catch (error: any) {
        console.error(`Error during Google Gemini API call for title "${title}":`, error.message);
        return null;
    }
}


// --- API Route Handler (GET Method) ---
export async function GET(request: Request, {params}: { params: Promise<{ contentId: string }> }) {
    if (!model) {
       return NextResponse.json({ error: 'Challenge generation service is unavailable' }, { status: 503 });
    }

    try {
        // 1. Authentication
        const session: Session | null = await getServerSession(authOptions);
        const sessionUser = session?.user as SessionUser | undefined;
        const userIdString = sessionUser?.id ?? sessionUser?._id;

        if (!userIdString) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = new Types.ObjectId(userIdString);

        // 2. Get and Validate Query Parameters
        const { contentId } = await params;
        if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
            return NextResponse.json({ error: 'Invalid or missing contentId' }, { status: 400 });
        }

        // 3. Database Connection
        await connectDB();

        // 4. Check for an Existing Challenge
        const existingChallenge = await Challenge.findOne({ userId, contentId }).lean<IChallenge>();

        if (existingChallenge) {
            console.log(`Existing challenge found for user ${userId} and content ${contentId}`);
            return NextResponse.json({ challenge: existingChallenge }, { status: 200 });
        }

        // 5. If no challenge exists, generate a new one
        console.log(`No existing challenge found. Generating new one for user ${userId}, content ${contentId}`);
        const contentData = await Content.findById(contentId).select('title data').lean();

        if (!contentData || !contentData.data) {
            return NextResponse.json({ error: 'Content not found for challenge generation' }, { status: 404 });
        }

        const title = contentData.title || 'Untitled Content';
        const textContent = extractTextFromCraftData(contentData.data);

        if (!textContent) {
            return NextResponse.json({ error: 'Could not extract text from content' }, { status: 400 });
        }

        // 6. Generate Challenge Data using AI Helper
        const generatedQuizData = await generateChallengeWithAI(title, textContent);

        if (!generatedQuizData) {
            return NextResponse.json({ error: 'Failed to generate challenge using AI' }, { status: 500 });
        }

        // 7. Save the Newly Generated Challenge
        const newChallenge = new Challenge({
            userId,
            contentId,
            quizData: generatedQuizData,
            challengeType: 'quiz', // Default type
            // status defaults to 'not-started' from schema
        });
        await newChallenge.save();
        console.log(`New challenge saved with ID: ${newChallenge._id}`);
        
        // 8. Return the Newly Created Challenge
        return NextResponse.json({ challenge: newChallenge.toObject() }, { status: 201 });

    } catch (error: any) {
        console.error('Error in GET /api/challenge:', error);
        // Handle race condition where two requests create the same challenge
        if (error.code === 11000) {
             return NextResponse.json({ error: 'A challenge for this content is already being created.' }, { status: 409 });
        }
        return NextResponse.json({
            error: 'Failed to fetch or generate challenge',
            details: process.env.NODE_ENV !== 'production' ? error.message : undefined
        }, { status: 500 });
    }
}

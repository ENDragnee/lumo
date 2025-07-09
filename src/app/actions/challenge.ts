// /lib/actions/challenge.ts
'use server';

import { getServerSession } from 'next-auth';
import mongoose, { Types } from 'mongoose';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Challenge, { IChallenge, IChallengeQuestion } from '@/models/Challenge';
import Content from '@/models/Content';
import { extractTextFromCraftData } from '@/utils/craftjsUtils';

// --- Re-initialize Gemini client within the action file ---
// This is necessary because environment variables are accessed on the server.
const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

if (apiKey) {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ],
            generationConfig: { responseMimeType: "application/json", temperature: 0.6 },
        });
    } catch (initError: any) {
        console.error("Failed to initialize Google Generative AI in challenge action:", initError.message);
        genAI = null;
        model = null;
    }
} else {
    console.error("FATAL ERROR in challenge action: GEMINI_API_KEY is not set.");
}

async function generateChallengeWithAI(title: string, contentText: string): Promise<IChallengeQuestion[] | null> {
    if (!model) {
        throw new Error("AI Model not initialized. Cannot generate challenge.");
    }
    // ... (The rest of the AI generation helper function is identical, no changes needed) ...
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

        if (!aiResponseText) throw new Error('AI response text was empty.');
        
        const parsedJson = JSON.parse(aiResponseText);
        if (Array.isArray(parsedJson) && parsedJson.length > 0 && parsedJson.every(item => 'question' in item && 'answer' in item)) {
            return parsedJson as IChallengeQuestion[];
        } else {
            throw new Error('Parsed JSON is not a valid array of challenge questions.');
        }
    } catch (error: any) {
        console.error(`Error during Gemini API call for title "${title}":`, error.message);
        return null;
    }
}


/**
 * Server action to get or generate a challenge for a specific content.
 * @param contentId The ID of the content to get a challenge for.
 * @returns A promise that resolves to the challenge object.
 */
export async function getOrGenerateChallenge(contentId: string): Promise<IChallenge> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized: You must be logged in.");
    }
    if (!model) {
        throw new Error("Service Unavailable: Challenge generation service is not working.");
    }
    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
        throw new Error("Invalid Input: A valid content ID is required.");
    }

    const userId = new Types.ObjectId(session.user.id);
    const contentObjectId = new Types.ObjectId(contentId);

    try {
        await connectDB();

        const existingChallenge = await Challenge.findOne({ userId, contentId: contentObjectId }).lean<IChallenge>();
        if (existingChallenge) {
            return JSON.parse(JSON.stringify(existingChallenge)); // Serialize for the client
        }

        console.log(`No existing challenge found. Generating new one for user ${userId}, content ${contentId}`);
        const contentData = await Content.findById(contentObjectId).select('title data').lean();
        if (!contentData?.data) {
            throw new Error("Not Found: Content data not found for challenge generation.");
        }

        const textContent = extractTextFromCraftData(contentData.data);
        if (!textContent) {
            throw new Error("Bad Request: Could not extract meaningful text from content.");
        }

        const generatedQuizData = await generateChallengeWithAI(contentData.title, textContent);
        if (!generatedQuizData) {
            throw new Error("Failed to generate challenge using AI.");
        }

        const newChallenge = new Challenge({
            userId,
            contentId: contentObjectId,
            quizData: generatedQuizData,
            challengeType: 'quiz',
        });
        await newChallenge.save();

        // Return a plain object, serialized for the boundary
        return JSON.parse(JSON.stringify(newChallenge.toObject()));

    } catch (error: any) {
        console.error("Error in getOrGenerateChallenge action:", error.message);
        if (error.code === 11000) {
            throw new Error("Conflict: A challenge for this content is already being created. Please try again.");
        }
        // Re-throw with a user-friendly message
        throw new Error(error.message || "An unexpected error occurred while handling the challenge.");
    }
}

// /app/api/quiz/route.ts

import { NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjust path as needed
import mongoose, { Types } from 'mongoose';
import connectDB from '@/lib/mongodb'; // Adjust path as needed
import Quiz from '@/models/Quiz'; // Adjust path as needed
import Progress from '@/models/Progress'; // Adjust path as needed
import SerializedData from '@/models/SerializedData'; // Adjust path as needed (or your content model)
import { extractTextFromCraftData } from '@/utils/craftjsUtils'; // Adjust path as needed
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
    GenerateContentResponse,
    Part // Make sure Part is imported if needed, though text is directly accessed here
} from "@google/generative-ai";

// --- Type Definitions ---

// Adjust based on your actual NextAuth session structure
interface SessionUser {
    id?: string;
    _id?: string; // Handle both common conventions
    // Add other user properties if needed (e.g., name, email)
}

// Structure for individual quiz questions in the database and AI response
interface QuizQuestion {
    question: string;
    answer: string;
    // options?: string[]; // Uncomment if you plan to add multiple-choice options later
}

// --- Initialize Google AI Client ---

const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
let model: any = null; // Using 'any' for simplicity, can be typed more strictly if desired

if (!apiKey) {
    console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");
    // Quiz generation will fail if requests are made. Consider throwing an error
    // during startup in a real application or having a dedicated health check.
} else {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest", // Or "gemini-1.5-pro-latest"
            // Optional Safety Settings (adjust thresholds as needed)
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ],
            generationConfig: {
                // Crucial for reliable parsing: Request JSON output directly
                responseMimeType: "application/json",
                temperature: 0.6, // Slightly less creative for factual quizzes
                maxOutputTokens: 1500, // Generous limit for ~5 Q&A pairs in JSON
                topP: 1, // Use default nucleus sampling
            },
        });
         console.log("Google Generative AI model initialized successfully.");
    } catch (initError: any) {
         console.error("Failed to initialize Google Generative AI:", initError.message);
         // Ensure model is null if initialization fails
         genAI = null;
         model = null;
    }
}

// --- AI Quiz Generation Helper Function ---

/**
 * Generates quiz questions and answers using Google Gemini AI.
 * @param title The title of the content.
 * @param contentText The extracted text content to base the quiz on.
 * @returns A promise that resolves to an array of QuizQuestion objects or null if generation fails.
 */
async function generateQuizWithAI(title: string, contentText: string): Promise<QuizQuestion[] | null> {
    if (!model) {
        console.error("Google AI Model not initialized. Cannot generate quiz.");
        return null; // Model must be available
    }
    if (!contentText || contentText.trim().length < 50) { // Basic content check
        console.log('Content too short for quiz generation.');
        return null;
    }

    const maxContentLengthChars = 100000;
    const truncatedContent = contentText.length > maxContentLengthChars
        ? contentText.substring(0, maxContentLengthChars) + '...'
        : contentText;

    const prompt = `
You are an AI assistant specialized in creating educational quizzes.
Based on the following content (titled "${title}"), generate exactly 5 distinct quiz questions with their corresponding answers.
Focus on the most important concepts, facts, and key takeaways presented in the text.
Each question should test understanding of the material.

Your response MUST be ONLY a valid JSON array of objects. Each object in the array must have exactly two keys:
1.  "question": A string containing the quiz question.
2.  "answer": A string containing the correct answer to the question.

Example Format:
[
  {
    "question": "What is the main topic discussed?",
    "answer": "The main topic is..."
  },
  {
    "question": "Identify a key concept.",
    "answer": "A key concept mentioned is..."
  }
]

Do NOT include any introductory text, explanations, concluding remarks, code block fences (\`\`\`json), or any other text outside the JSON array itself. Your entire output must be the JSON array.

Here is the content:
---
${truncatedContent}
---
`;

    try {
        console.log(`Generating quiz for title: "${title}" using Google Gemini.`);

        const result: GenerateContentResponse = await model.generateContent(prompt);

        // --- REVERT FIX: Access candidates via result.response ---
        // Access the response candidate safely using optional chaining
        // This now matches the logged structure.
        const candidate = result.candidates?.[0];

        // Check if a valid candidate and its text part exist
        if (!candidate?.content?.parts?.[0]?.text) {
            // --- REVERT FIX: Access promptFeedback via result.response ---
            const blockReason = result.promptFeedback?.blockReason;
            if (blockReason) {
                console.error(`Quiz generation blocked due to: ${blockReason}`);
                throw new Error(`Quiz generation failed due to safety settings (${blockReason}).`);
            }
            // --- REVERT FIX: Log result.response for clarity if error occurs ---
            console.error("No valid response text found in Gemini candidate parts. Raw response object:", JSON.stringify(result, null, 2));
            // Also log the full result to see if 'response' itself was missing
             console.error("Full result object:", JSON.stringify(result, null, 2));
            throw new Error('AI response text was empty or in an unexpected format.');
        }

        // Extract the text content from the response part
        const aiResponseText = candidate.content.parts[0].text;
        console.log("Raw AI Response Text:", aiResponseText); // This should now log the JSON string

        // --- Parse and Validate the JSON Response ---
        let validatedQuizData: QuizQuestion[] | null = null;

        try {
            const parsedJson: unknown = JSON.parse(aiResponseText); // Parse the extracted text

            if (Array.isArray(parsedJson)) {
                if (parsedJson.length > 0 &&
                    parsedJson.every(item =>
                        typeof item === 'object' && item !== null &&
                        'question' in item && typeof item.question === 'string' &&
                        'answer' in item && typeof item.answer === 'string'
                    )) {
                    validatedQuizData = parsedJson as QuizQuestion[];
                } else {
                    throw new Error('Parsed JSON array does not contain valid quiz question objects.');
                }
            }
            // (Keep the object-wrapping check just in case)
            else if (typeof parsedJson === 'object' && parsedJson !== null) {
                const arrayKey = Object.keys(parsedJson).find(key => Array.isArray((parsedJson as any)[key]));
                if (arrayKey) {
                    const potentialArray = (parsedJson as any)[arrayKey];
                    if (Array.isArray(potentialArray) && potentialArray.length > 0 &&
                        potentialArray.every(item =>
                            typeof item === 'object' && item !== null &&
                            'question' in item && typeof item.question === 'string' &&
                            'answer' in item && typeof item.answer === 'string'
                        )) {
                        validatedQuizData = potentialArray as QuizQuestion[];
                    }
                }
                if (!validatedQuizData) {
                    throw new Error("Parsed JSON is an object but doesn't contain a valid quiz array.");
                }
            } else {
                throw new Error("Parsed JSON is not an array or a recognized wrapper object.");
            }

            console.log("Successfully parsed and validated quiz data from Gemini.");
            return validatedQuizData;

        } catch (parseError: any) {
            console.error('Failed to parse or validate Google AI JSON response:', parseError.message);
            console.error('Problematic AI response string:', aiResponseText);
            return null;
        }

    } catch (error: any) {
        console.error('Error calling Google Gemini API or processing response:', error.message);
        // It's possible error objects from the SDK might have more details
        if (error.response) console.error("Gemini API Error Response:", error.response);
        if (error.details) console.error("Gemini API Error Details:", error.details);
        return null;
    }
}

// --- API Route Handler (GET Method) ---

export async function GET(request: Request) {
    // Verify AI model initialization before proceeding
    if (!genAI || !model) {
       console.warn("Attempted quiz API call, but AI model is not initialized.");
       return NextResponse.json({ error: 'Quiz generation service is unavailable (AI initialization failed)' }, { status: 503 }); // 503 Service Unavailable
    }

    try {
        // 1. Authentication and Authorization
        const session: Session | null = await getServerSession(authOptions);
        const sessionUser = session?.user as SessionUser | undefined;
        const userIdString = sessionUser?.id ?? sessionUser?._id; // Get user ID string

        if (!userIdString) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Convert string ID to Mongoose ObjectId
        const userId = new Types.ObjectId(userIdString);

        // 2. Get and Validate Query Parameters
        const { searchParams } = new URL(request.url);
        const contentIdParam = searchParams.get('contentId');

        if (!contentIdParam || !mongoose.Types.ObjectId.isValid(contentIdParam)) {
            return NextResponse.json({ error: 'Invalid or missing content ID parameter' }, { status: 400 });
        }
        // Convert string ID to Mongoose ObjectId
        const contentId = new Types.ObjectId(contentIdParam);

        // 3. Database Connection
        await connectDB();

        // 4. Check for Existing Quiz
        // Use .lean() for performance when only reading data
        const existingQuiz = await Quiz.findOne({ userId, contentId }).lean();

        if (existingQuiz) {
            console.log(`Existing quiz found for user ${userId} and content ${contentId}`);
            // Note: If you ever store quizData as stringified JSON (not recommended),
            // you would need to parse it here before returning.
            // e.g., if (typeof existingQuiz.quizData === 'string') {
            //   try { existingQuiz.quizData = JSON.parse(existingQuiz.quizData); } catch (e) { console.error("Failed to parse existing quiz data"); }
            // }
            return NextResponse.json({ quiz: existingQuiz }, { status: 200 });
        }

        // 5. Fetch Content Data (if no existing quiz)
        console.log(`No existing quiz found. Attempting to generate new quiz for user ${userId}, content ${contentId}`);
        // Adjust 'SerializedData' and '.select()' based on your actual content model schema
        const contentData = await SerializedData.findById(contentId).select('title data').lean();

        if (!contentData || !contentData.data) {
            console.warn(`Content data not found for ID: ${contentId}`);
            return NextResponse.json({ error: 'Content data not found for quiz generation' }, { status: 404 });
        }

        // Extract title and text content
        const title = contentData.title || 'Untitled Content'; // Provide default title
        const textContent = extractTextFromCraftData(contentData.data); // Extract text from CraftJS JSON

        if (!textContent) {
            console.warn(`Could not extract text from content ID: ${contentId}`);
            return NextResponse.json({ error: 'Could not extract meaningful text from content' }, { status: 400 });
        }

        // 6. Generate Quiz using AI Helper Function
        const generatedQuizData: QuizQuestion[] | null = await generateQuizWithAI(title, textContent);

        // Handle AI generation failure
        if (!generatedQuizData) {
            console.error(`Failed to generate quiz for content ID: ${contentId}`);
            // Distinguish between model init failure and generation failure
            if (!model) return NextResponse.json({ error: 'Quiz generation service unavailable' }, { status: 503 });
            return NextResponse.json({ error: 'Failed to generate quiz using AI' }, { status: 500 });
        }

        // 7. Save the Newly Generated Quiz
        const newQuiz = new Quiz({
            userId,
            contentId,
            quizData: generatedQuizData, // Save the validated array of objects directly
        });
        await newQuiz.save();
        console.log(`New quiz saved with ID: ${newQuiz._id} for user ${userId}, content ${contentId}`);

        // 8. Create or Update User Progress Record
        try {
             await Progress.findOneAndUpdate(
                 { userId, contentId, contentType: 'quiz' }, // Find criteria
                 { // Data to set on insert or update
                     $setOnInsert: { // Fields only set when creating the document
                         userId,
                         contentId,
                         contentType: 'quiz',
                         progress: 0, // Initial progress
                         status: 'not-started', // Quiz generated but not yet attempted
                         createdAt: new Date(),
                     },
                     // Add any fields to update on subsequent fetches if needed
                     // $set: { updatedAt: new Date() } // Timestamps: true handles this
                 },
                 {
                     upsert: true, // Create if document doesn't exist
                     new: true, // Return the modified document (optional)
                     setDefaultsOnInsert: true // Apply schema defaults on insert
                 }
             );
             console.log(`Progress record upserted for quiz content ${contentId}, user ${userId}.`);
        } catch (progressError: any) {
            // Log progress update error but don't fail the whole request
            console.error(`Failed to update progress for quiz content ${contentId}, user ${userId}:`, progressError.message);
        }


        // 9. Return the Newly Created Quiz
        // Fetch the saved quiz again using .lean() to return a plain object
        const savedQuiz = await Quiz.findById(newQuiz._id).lean();
        return NextResponse.json({ quiz: savedQuiz }, { status: 201 }); // 201 Created status

    } catch (error: any) {
        // Catch any unexpected errors during the process
        console.error('Error in GET /api/quiz:', error);
        // Return a generic server error response
        return NextResponse.json({
            error: 'Failed to fetch or generate quiz',
            // Optionally include details in non-production environments
            details: process.env.NODE_ENV !== 'production' ? error.message : undefined
        }, { status: 500 });
    }
}
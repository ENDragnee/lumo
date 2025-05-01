// /app/api/quiz/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjust path as needed
import mongoose, { Types } from 'mongoose';
import connectDB from '@/lib/mongodb'; // Adjust path as needed
import Quiz from '@/models/Quiz'; // Adjust path as needed
import Progress from '@/models/Progress'; // Adjust path as needed
import SerializedData from '@/models/SerializedData'; // Adjust path as needed (or your content model)
import { extractTextFromCraftData } from '@/utils/craftjsUtils'; // Adjust path as needed
import {
    GoogleGenerativeAI,
    HarmCategory,       // Keep these as they are likely runtime enums/objects
    HarmBlockThreshold  // used for configuration
} from "@google/generative-ai";

// --- Type Definitions (Removed - JavaScript is dynamically typed) ---
// Interfaces SessionUser and QuizQuestion removed.
// JSDoc can be used for documentation if desired.

/**
 * @typedef {object} SessionUser JS Equivalent documentation
 * @property {string} [id]
 * @property {string} [_id]
 */

/**
 * @typedef {object} QuizQuestion JS Equivalent documentation
 * @property {string} question
 * @property {string} answer
 * // @property {string[]} [options] // Uncomment if needed
 */

// --- Initialize Google AI Client ---

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null; // No type annotation
let model = null; // No type annotation

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
    } catch (initError) { // No type annotation for error
         console.error("Failed to initialize Google Generative AI:", initError.message);
         // Ensure model is null if initialization fails
         genAI = null;
         model = null;
    }
}

// --- AI Quiz Generation Helper Function ---

/**
 * Generates quiz questions and answers using Google Gemini AI.
 * @param {string} title The title of the content.
 * @param {string} contentText The extracted text content to base the quiz on.
 * @returns {Promise<QuizQuestion[] | null>} A promise that resolves to an array of QuizQuestion-like objects or null if generation fails.
 */
async function generateQuizWithAI(title, contentText) { // No type annotations for parameters or return
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
Your task is to generate exactly 5 distinct quiz questions with their corresponding answers, based on the provided text content (titled "${title}"). Focus on the most important concepts, facts, and key takeaways.

**Output Format Requirements:**
1.  Your **entire** response output MUST be **only** a single, valid JSON array.
2.  Do NOT include **any** text before or after the JSON array.
3.  Do NOT include explanations, introductions, summaries, or markdown formatting (like \`\`\`json or \`\`\`).
4.  The JSON array must contain exactly 5 objects.
5.  Each object in the array MUST have exactly two string properties: "question" and "answer".

**Example of the required JSON array structure:**
[
  {
    "question": "What is the core topic?",
    "answer": "The core topic is..."
  },
  {
    "question": "Define a specific term mentioned.",
    "answer": "The term is defined as..."
  }
]

**Content to Analyze:**
---
${truncatedContent}
---

Generate the JSON array now based *only* on the content provided above and adhering strictly to the format requirements.
`;

try {
    console.log(`Generating quiz for title: "${title}" using Google Gemini.`);

    // No type annotation for result
    const result = await model.generateContent(prompt);

    // --- Improved Response Validation ---

    // Log the full response structure *before* trying to access potentially missing parts
    console.log("Full result object received from Gemini:", JSON.stringify(result, null, 2));

        // *** FIX: Access the nested 'response' object first ***
        const responseData = result.response; // Access the 'response' field directly

        if (!responseData) {
                console.error("No 'response' field found in the Gemini result object.");
                console.error("Full result object (when 'response' field missing):", JSON.stringify(result, null, 2));
                throw new Error("AI result structure unexpected: missing 'response' field.");
        }

        // Check for prompt feedback first (often indicates blocking)
        // *** FIX: Access promptFeedback from responseData ***
        const promptFeedback = responseData.promptFeedback;
        if (promptFeedback?.blockReason) {
            console.error(`Quiz generation potentially blocked by safety filter. Reason: ${promptFeedback.blockReason}`);
            if (promptFeedback.safetyRatings) {
                console.error("Prompt Safety Ratings:", JSON.stringify(promptFeedback.safetyRatings));
            }
            return null; // Or handle as appropriate
        }

        // Now check the candidate structure
        const candidate = responseData.candidates?.[0];
        if (!candidate) {
            console.error("No candidates found in the Gemini response.response field.");
            // Log the responseData object if no candidate is found within it
            console.error("Full responseData object (when no candidate found):", JSON.stringify(responseData, null, 2));
            // Throwing an error here is correct as per your logic
            throw new Error("AI response did not contain any candidates in the expected location.");
        }

        // Check candidate finish reason (access relative to 'candidate' is correct)
        if (candidate.finishReason && candidate.finishReason !== 'STOP') {
            console.warn(`Candidate finished with reason: ${candidate.finishReason}.`);
            if (candidate.safetyRatings) {
                console.warn("Candidate Safety Ratings:", JSON.stringify(candidate.safetyRatings));
            }
            if (candidate.finishReason === 'SAFETY') {
                 console.error(`Quiz generation stopped due to safety filter (finishReason: ${candidate.finishReason}).`);
                // Explicitly return null or throw if it's a safety block
                return null; // Or throw new Error(...)
            }
           // Consider returning null or throwing for other non-STOP reasons too if needed
           // return null;
       }


        // Finally, check for the text part (access relative to 'candidate' is correct)
        const aiResponseText = candidate.content?.parts?.[0]?.text;

        if (!aiResponseText) {
            console.error("No valid response text found in the primary Gemini candidate part, despite candidate existing.");
            console.error("Candidate details:", JSON.stringify(candidate, null, 2));
            throw new Error('AI response text was empty or in an unexpected format.');
        }
        console.log("Raw AI Response Text:", aiResponseText);

        // --- Parse and Validate JSON (keep existing logic) ---
        let validatedQuizData = null; // No type annotation
        try {
            const parsedJson = JSON.parse(aiResponseText); // Type is unknown implicitly
            // ... (rest of your JSON parsing and validation logic remains the same) ...

            if (Array.isArray(parsedJson)) {
                if (parsedJson.length > 0 &&
                    parsedJson.every(item =>
                        typeof item === 'object' && item !== null &&
                        'question' in item && typeof item.question === 'string' &&
                        'answer' in item && typeof item.answer === 'string'
                    )) {
                    validatedQuizData = parsedJson; // Assign the validated array
                } else {
                    // Check if it's an empty array - might be valid if AI couldn't generate questions? Or should be an error?
                    if (parsedJson.length === 0) {
                        console.warn("AI returned an empty JSON array. Content might not have been suitable for 5 questions.");
                        // Decide how to handle: return empty array, null, or error?
                        // return []; // Option 1: Return empty
                        return null; // Option 2: Indicate failure to generate meaningful questions
                    }
                    throw new Error('Parsed JSON array does not contain valid quiz question objects.');
                }
            }
            // ... (rest of your object-wrapping check) ...
             else {
                // Added check for the specific wrapped object case mentioned in original logic (though not present in final TS code)
                // if (typeof parsedJson === 'object' && parsedJson !== null && Array.isArray(parsedJson.questions)) { ... }
                // If that check was relevant, re-add it here.
                throw new Error("Parsed JSON is not an array or a recognized wrapper object.");
            }


            console.log("Successfully parsed and validated quiz data from Gemini.");
            return validatedQuizData;

        } catch (parseError) { // No type annotation
            console.error('Failed to parse or validate Google AI JSON response:', parseError.message);
            console.error('Problematic AI response string:', aiResponseText);
            return null;
        }

    } catch (error) { // No type annotation
        // Log the error with more context
        console.error(`Error during Google Gemini API call or processing for title "${title}":`, error.message);
        // Check if it's an error object from the SDK which might have more details
        if (error instanceof Error && error.cause) {
            console.error("Underlying cause:", error.cause);
        }
        // Ensure the full response object was logged earlier if available
        // You might already have `result` logged from the initial log point inside the try block.
        return null;
        }
}

// --- API Route Handler (GET Method) ---

export async function GET(request) { // No type annotation for request
    // Verify AI model initialization before proceeding
    if (!genAI || !model) {
       console.warn("Attempted quiz API call, but AI model is not initialized.");
       return NextResponse.json({ error: 'Quiz generation service is unavailable (AI initialization failed)' }, { status: 503 }); // 503 Service Unavailable
    }

    try {
        // 1. Authentication and Authorization
        const session = await getServerSession(authOptions); // No type annotation
        const sessionUser = session?.user; // No type assertion
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
        // generatedQuizData will implicitly be an array or null
        const generatedQuizData = await generateQuizWithAI(title, textContent);

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
        } catch (progressError) { // No type annotation
            // Log progress update error but don't fail the whole request
            console.error(`Failed to update progress for quiz content ${contentId}, user ${userId}:`, progressError.message);
        }


        // 9. Return the Newly Created Quiz
        // Fetch the saved quiz again using .lean() to return a plain object
        const savedQuiz = await Quiz.findById(newQuiz._id).lean();
        return NextResponse.json({ quiz: savedQuiz }, { status: 201 }); // 201 Created status

    } catch (error) { // No type annotation
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
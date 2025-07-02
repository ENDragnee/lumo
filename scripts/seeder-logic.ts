// /scripts/seed-static-content.ts

// Step 1: Configure dotenv at the absolute top level.
// This runs BEFORE any other local modules are imported.
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
console.log('[Seeder] Environment variables loaded.');

// We define an async function to hold our logic.
const main = async () => {
  // Step 2: Now that the environment is loaded, we can safely import our modules.
  // These imports will now see the correct `process.env.DATABASE_URL`.
  const mongoose = await import('mongoose');
  const Content = (await import('../src/models/Content')).default;
  const dbConnect = (await import('../src/lib/mongodb')).default;

  // --- DEFINE YOUR STATIC PAGES HERE ---
  const staticPagesToSeed = [
    {
      title: "Welcome to the Platform!",
      contentType: 'static',
      data: 'welcome-page',
      thumbnail: '/thumbnails/default-welcome.png',
      description: "An introductory page to welcome new users to the platform and its features.",
      tags: ['getting-started', 'welcome', 'tutorial'],
      difficulty: 'easy' as const,
      isDraft: false,
      createdBy: new mongoose.Types.ObjectId('60d5ec49e0f3f62c8c4f5a01'), // !! PASTE A REAL USER ID HERE !!
    },
  ];

  console.log('[Seeder] Connecting to database...');
  await dbConnect();
  console.log('[Seeder] Database connected. Starting to seed static content...');

  let createdCount = 0;
  let skippedCount = 0;

  try {
    for (const pageData of staticPagesToSeed) {
      const existingContent = await Content.findOne({
        contentType: 'static',
        data: pageData.data,
      });

      if (existingContent) {
        console.log(`- Skipping: Content with key "${pageData.data}" already exists.`);
        skippedCount++;
      } else {
        console.log(`+ Creating: Content for "${pageData.title}"...`);
        // We need to cast the partial type to the full type for the model
        const newContent = new Content(pageData);
        await newContent.save();
        createdCount++;
      }
    }
  } catch (error) {
    console.error('❌ An error occurred during seeding:', error);
    // Disconnect on error
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log('\n--- Seeding Complete ---');
  console.log(`✅ Successfully created ${createdCount} new documents.`);
  console.log(`⏭️ Skipped ${skippedCount} existing documents.`);
  
  // IMPORTANT: Disconnect from the database to allow the script to exit.
  await mongoose.disconnect();
  console.log('[Seeder] Database connection closed.');
  process.exit(0); // Exit successfully
};

// Step 3: Call the main function to run the script.
main();

// /scripts/seed-institutions.ts

// Step 1: Configure dotenv at the absolute top level. This runs first.
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
console.log('[Institution Seeder] Environment variables loaded.');

// Step 2: Statically import all necessary modules and types at the top level.
// This is cleaner and solves the type import issue.
import User, { IUser } from '../src/models/User';

// Define an async function to hold the logic.
const main = async () => {
  // --- DATA DEFINITIONS ---

  const mongoose = await import('mongoose');
  const Institution = (await import('../src/models/Institution')).default;
  const InstitutionMember = (await import('../src/models/InstitutionMember')).default;
  const dbConnect = (await import('../src/lib/mongodb')).default;
  // !! CRITICAL !!: Find a real user's _id in your MongoDB `users` collection.
  // This user will be designated as the owner of the new institutions.
  // Example: '60d5ec49e0f3f62c8c4f5a01'
  const OWNER_USER_ID = '68664767cf8dfca2d23d3a72'; // <--- CHANGE THIS

  // Define the list of institutions you want to create.
  const institutionsToSeed = [
    {
      name: "Ministry of Revenue",
      initialAdminIds: [], // Add other user IDs here if you want them to be admins initially.
      portalKey: 'mor-ethiopia',
      subscriptionStatus: 'active' as const,
      branding: {
        logoUrl: '/logos/mor-ethiopia-logo.png',
        primaryColor: '#046c4e',
      },
    },
    {
      name: "Addis Ababa University",
      initialAdminIds: [],
      portalKey: 'aastu-ethiopia',
      subscriptionStatus: 'trialing' as const,
      branding: {
        logoUrl: '/logos/aau-logo.png',
        primaryColor: '#0033a0',
      },
    },
  ];

  // --- SEEDING LOGIC ---
  const seedInstitutions = async () => {
    let createdCount = 0;
    let skippedCount = 0;

    // --- Pre-flight Check ---
    // Ensure the owner user actually exists in the database before proceeding.
    // The `IUser` type is now correctly recognized from the static import at the top.
    const ownerExists = await User.findById(OWNER_USER_ID).lean() as IUser | null;
    
    if (!ownerExists) {
        console.error(`❌ FATAL ERROR: The specified owner user with ID "${OWNER_USER_ID}" was not found in the database.`);
        console.error("Please update the OWNER_USER_ID in the script with a valid user's _id.");
        return { created: 0, skipped: 0, error: true };
    }
    // The properties `name` and `email` are now correctly recognized.
    console.log(`[Institution Seeder] Verified owner user: ${ownerExists.name} (${ownerExists.email})`);

    for (const instData of institutionsToSeed) {
      const existingInst = await Institution.findOne({ name: instData.name }).lean();
      
      if (existingInst) {
        console.log(`- Skipping: Institution "${instData.name}" already exists.`);
        skippedCount++;
        continue;
      }
      
      console.log(`+ Creating Institution: "${instData.name}"...`);

      // 1. Prepare all necessary ObjectIDs
      const ownerId = new mongoose.Types.ObjectId(OWNER_USER_ID);
      const adminObjectIds = instData.initialAdminIds.map((id: string) => new mongoose.Types.ObjectId(id));
      
      const allAdminIds = [...new Set([ownerId, ...adminObjectIds])];
      const allMemberIds = [...allAdminIds];

      // 2. Create the main Institution document
      const newInstitution = new Institution({
        name: instData.name,
        owner: ownerId,
        admins: allAdminIds,
        members: allMemberIds,
        subscriptionStatus: instData.subscriptionStatus,
        branding: instData.branding,
      });
      await newInstitution.save();
      createdCount++;
      
      // 3. Create the crucial InstitutionMember records for portal access
      console.log(`  > Creating membership records for "${instData.name}"...`);
      
      await InstitutionMember.create({
        institutionId: newInstitution._id,
        userId: ownerId,
        role: 'owner',
        status: 'active',
      });
      console.log(`    - Created 'owner' role for user ${ownerId}`);

      for (const adminId of adminObjectIds) {
        if (adminId.equals(ownerId)) continue;
        
        await InstitutionMember.create({
          institutionId: newInstitution._id,
          userId: adminId,
          role: 'admin',
          status: 'active',
        });
        console.log(`    - Created 'admin' role for user ${adminId}`);
      }
    }
    return { created: createdCount, skipped: skippedCount, error: false };
  };

  // --- EXECUTION ---
  try {
    console.log('[Institution Seeder] Connecting to database...');
    await dbConnect();
    console.log('[Institution Seeder] Database connected.');

    const stats = await seedInstitutions();
    
    if (stats.error) {
        // Error message is already logged in the function.
    } else {
        console.log('\n--- Seeding Complete ---');
        console.log(`✅ Institutions: ${stats.created} created, ${stats.skipped} skipped.`);
    }

  } catch (error) {
    console.error('❌ An unexpected error occurred during seeding:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n[Institution Seeder] Database connection closed.');
  }
};

// Run the script
main();

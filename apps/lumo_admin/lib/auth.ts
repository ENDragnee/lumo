// @/lib/auth.ts

import { NextAuthOptions, User as NextAuthUser, Account, Profile } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { verifyPassword } from './password-utils';
import connectDB from "@/lib/mongodb";
import User, { IUser } from '@/models/User';
import Institution from '@/models/Institution'; // ✨ NEW: Import Institution model
import InstitutionMember from '@/models/InstitutionMember';
import Invitation from '@/models/Invitation';
import mongoose, { Types } from 'mongoose';

// --- Helper Function: generateUniqueUserTag ---
// (Your existing function remains here)
async function generateUniqueUserTag(name: string): Promise<string> {
    await connectDB();
    let baseTag = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15) || 'user';
    let userTag = baseTag;
    let counter = 1;
    while (await User.findOne({ userTag }).lean()) {
        const tagSuffix = String(counter);
        const maxBaseLength = 20 - tagSuffix.length;
        if (baseTag.length > maxBaseLength) {
             baseTag = baseTag.substring(0, maxBaseLength);
        }
        userTag = `${baseTag}${tagSuffix}`;
        counter++;
        if (counter > 1000) {
             console.error("Could not generate unique userTag after 1000 attempts for base:", baseTag);
             userTag = `${baseTag}${Date.now()}${Math.floor(Math.random() * 100)}`;
             if (await User.findOne({ userTag }).lean()) {
                throw new Error("Could not generate unique userTag even with fallback.");
             }
             break;
        }
    }
    return userTag;
}
// --- End Helper Function ---

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials.password) {
                throw new Error('Please provide both email and password.');
            }
            try {
                await connectDB();
                const existingUser = await User.findOne<IUser>({ email: credentials.email }).lean();

                if (!existingUser || !existingUser.password_hash) {
                    throw new Error('Invalid email or password.');
                }

                const isValid = await verifyPassword(credentials.password, existingUser.password_hash);
                if (!isValid) {
                    throw new Error('Invalid email or password.');
                }

                // ==========================================================
                // ✨ NEW: CHECK IF USER IS AN INSTITUTION ADMIN
                // ==========================================================
                // This is the core logic for the admin portal.
                const institution = await Institution.findOne({
                    // User is an admin if they are the owner OR in the admins array
                    $or: [{ owner: existingUser._id }, { admins: existingUser._id }]
                }).lean();

                if (!institution) {
                    // The user's credentials are correct, but they are not authorized
                    // to access any institution portal as an admin.
                    throw new Error('Access Denied: You are not an administrator of an institution.');
                }
                // ==========================================================

                if (!existingUser._id) {
                    throw new Error("Authentication failed: User data is incomplete.");
                }

                console.log(`Admin user ${existingUser.email} for institution ${institution.name} authenticated successfully.`);

                // If all checks pass, return the user object for NextAuth.
                return {
                    id: (existingUser._id as Types.ObjectId).toString(),
                    name: existingUser.name,
                    email: existingUser.email,
                };
            } catch (error: any) {
                console.error('Credentials Authorize Error:', error.message);
                // Re-throw the specific error message to be displayed on the client.
                throw new Error(error.message || 'An unexpected server error occurred.');
            }
        },
    }),
  ],

  session: { strategy: 'jwt' },

  pages: {
    signIn: '/auth/login', // Redirect users to your custom login page
    error: '/auth/login', // Redirect users to login page on error, error message will be in URL query
  },

  callbacks: {
    // --- signIn Callback (Your existing logic) ---
    async signIn({ user, account, profile }) {
      // Allow sign-in for credentials provider, as authorization happens in the `authorize` function.
      if (account?.provider === 'credentials') {
        return true;
      }

      // Handle OAuth providers (like Google)
      if (account?.provider === 'google') {
        try {
          await connectDB();

          // 1. Find or Create the User in your Database
          let dbUser = await User.findOne({ email: user.email });

          if (!dbUser && user.email && user.name) {
            // User does not exist, create a new one
            console.log(`New Google user detected: ${user.email}. Creating account.`);
            const userTag = await generateUniqueUserTag(user.name);
            
            dbUser = await new User({
              email: user.email,
              name: user.name,
              userTag: userTag,
              profileImage: user.image, // from Google profile
              provider: 'google',
              providerAccountId: user.id, // from Google profile
            }).save();
          }

          if (!dbUser) {
             console.error("Failed to find or create a user for OAuth sign-in.");
             return false; // Deny sign-in if user record is not available
          }

          // 2. Check for a Pending Invitation and Link the User
          const pendingInvite = await Invitation.findOne({
            email: dbUser.email,
            status: 'pending',
          });

          if (pendingInvite) {
            console.log(`Found pending invitation for ${dbUser.email}. Linking to institution ${pendingInvite.institutionId}`);
            
            // Create the official link between the user and the institution
            await InstitutionMember.create({
              institutionId: pendingInvite.institutionId,
              userId: dbUser._id,
              role: pendingInvite.role,
              status: 'active', // User is now an active member
            });

            // Update the invitation to prevent reuse
            pendingInvite.status = 'accepted';
            await pendingInvite.save();
          }

          // 3. Update the NextAuth user object with the MongoDB _id
          // This is crucial for the `jwt` and `session` callbacks.
          user.id = dbUser._id.toString();

          return true; // Allow the sign-in to proceed
        } catch (error) {
          console.error("Error during OAuth signIn callback:", error);
          return false; // Deny sign-in on any error
        }
      }

      return true; // Default to allow sign-in for other providers if any
    },

    // --- JWT Callback (Your existing logic) ---
    async jwt({ token, user }) {
        // Your existing JWT logic is good.
        if (user?.id) {
           token.id = user.id;
        }
        return token;
    },

    // --- Session Callback (Modified) ---
    async session({ session, token }) {
        // Add user ID to the session user object
        if (token.id && session.user) {
            session.user.id = token.id as string;
        }

        // This makes the institution's ID and name available globally
        // in the session, which is very useful for frontend components.
          if (token.id) {
            try {
                await connectDB();
                const userObjectId = new Types.ObjectId(token.id as string);
                
                // Find any institution where this user is an owner or admin
                const institution = await Institution.findOne({
                    $or: [{ owner: userObjectId }, { admins: userObjectId }]
                }).lean();

                if (institution) {
                    // Determine the user's specific role within this institution
                    let userRole: 'owner' | 'admin' = 'admin'; // Default to admin if found
                    if (institution.owner.equals(userObjectId)) {
                        userRole = 'owner';
                    }

                    // Attach the complete institution object, including the role, to the session
                    session.institution = {
                        id: institution._id.toString(),
                        name: institution.name,
                        portalKey: institution.portalKey,
                        role: userRole,
                    };
                }
            } catch (error) {
                console.error("Failed to add institution data to session:", error);
                delete session.institution;
            }
        }
        return session;
    },
  },

  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

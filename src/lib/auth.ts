// lib/auth.ts

import { NextAuthOptions, User as NextAuthUser, Account, Profile } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { verifyPassword } from './password-utils'; // Adjust path if needed
import connectDB from "@/lib/mongodb";
// Ensure IUser interface has _id: Types.ObjectId;
import User, { IUser } from '@/models/User';
import mongoose, { Types } from 'mongoose';
import { JWT } from 'next-auth/jwt';

// --- Helper Function: generateUniqueUserTag ---
// (Make sure this function is defined as provided in the previous response)
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
          authorization: { /* ... */ }
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
              email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // ... credentials auth logic ...
                 if (!credentials?.email || !credentials.password) { throw new Error('Missing credentials'); }
                 try {
                     await connectDB();
                     const existingUser = await User.findOne<IUser>({ email: credentials.email }).lean();
                     if (!existingUser) { throw new Error('Invalid credentials'); }
                     if (!existingUser.password_hash) { throw new Error('Invalid credentials'); } // Check for password
                     const isValid = await verifyPassword(credentials.password, existingUser.password_hash);
                     if (!isValid) { throw new Error('Invalid credentials'); }

                     // Ensure _id exists and assert type before returning
                     if (!existingUser._id) {
                         console.error("Credentials Auth: User found but missing _id:", existingUser.email);
                         throw new Error("Authentication failed: User data incomplete.");
                     }

                     return {
                         id: (existingUser._id as Types.ObjectId).toString(), // Assert type here too
                         name: existingUser.name,
                         email: existingUser.email,
                     };
                 } catch (error: any) {
                     console.error('Credentials Authorize Error:', error.message);
                     return null;
                 }
            },
        }),
  ],

   session: { strategy: 'jwt' },
   pages: { /* ... */ },

  callbacks: {
    // --- signIn Callback ---
    async signIn({ user, account, profile }: { user: NextAuthUser, account: Account | null, profile?: Profile }) {
      if (!account || !account.provider) { return false; }
      await connectDB();

      if (account.provider !== 'credentials') { // OAuth Flow
        try {
          const email = profile?.email;
          if (!email) { return false; }

          const existingUser = await User.findOne<IUser>({ email }).lean();

          if (existingUser) {
             // **FIX Error 1**: Check _id exists and assert its type for toString()
             if (!existingUser._id) {
                 console.error("OAuth SignIn: Existing user found but missing _id:", { email });
                 return false; // Cannot proceed without _id
             }
             // Assert _id is ObjectId before calling toString()
             const existingUserIdString = (existingUser._id as Types.ObjectId).toString();

             // Check if already linked
             if (existingUser.provider === account.provider && existingUser.providerAccountId === account.providerAccountId) {
                 user.id = existingUserIdString; // Ensure JWT gets the ID
                 return true;
             }

             // Link account if not linked to any provider yet
             if (!existingUser.provider || !existingUser.providerAccountId) {
                 await User.updateOne(
                     { _id: existingUser._id }, // Use the non-string _id for query
                     { $set: {
                         provider: account.provider as 'google',
                         providerAccountId: account.providerAccountId,
                         profileImage: existingUser.profileImage || profile?.image,
                       }
                     }
                 );
                 console.log(`Linked ${account.provider} account for existing user: ${email}`);
                 user.id = existingUserIdString; // Ensure JWT gets the ID
                 return true;
             } else {
                 // Account exists but is linked to a different provider
                 console.warn(`Sign-in attempt failed: Email ${email} already linked to ${existingUser.provider}.`);
                 return `/auth/error?error=OAuthAccountNotLinked`; // Redirect to error page
             }
          } else { // Create new OAuth user
             if (!profile?.name) { return false; }
             const uniqueUserTag = await generateUniqueUserTag(profile.name);
             const newUser = await User.create({
                 email: email,
                 name: profile.name,
                 profileImage: profile.image,
                 provider: account.provider,
                 providerAccountId: account.providerAccountId,
                 userTag: uniqueUserTag,
                 user_type: 'student',
             });
             if (!newUser?._id) { return false; }
             user.id = newUser._id.toString(); // Ensure JWT gets the ID
             return true;
          }
        } catch (error) {
          console.error(`Error during OAuth signIn callback (${account.provider}):`, error);
          return false;
        }
      } else { // Credentials Flow (already handled by authorize)
          return !!user?.id; // Allow if authorize returned a user object with an id
      }
    }, // End signIn Callback

    // --- JWT Callback ---
    async jwt({ token, user, account }: { token: JWT, user?: NextAuthUser, account?: Account | null }) {
        // Persist the Database User ID (_id string) to the token
        if (user?.id) {
           token.id = user.id;
        }

        // Add user details to token on initial sign-in (OAuth or Credentials)
        // Avoid DB lookup if details are already in token from subsequent requests
        if (account && user && token.email == null) { // Check if details are missing
             await connectDB();
             if (!token.id) {
                 console.error("JWT Callback: Cannot fetch user, token.id is missing.");
                 return token;
             }

             // **FIX Error 2**: Fetch user and use type assertion `as IUser`
             const dbUser = await User.findById(token.id).lean() as (IUser & {_id: Types.ObjectId}) | null; // Assert type here

             if (dbUser) {
                token.name = dbUser.name;
                token.email = dbUser.email;
                token.picture = dbUser.profileImage; // Standard JWT/Session field
                // Add other fields if needed: token.userTag = dbUser.userTag;
             } else {
                 console.error("JWT Callback: Could not find user in DB with ID:", token.id);
                 // Optionally clear potentially stale info if user deleted?
                 // delete token.name; delete token.email; delete token.picture;
             }
        }
        return token;
    }, // End JWT Callback

    // --- Session Callback ---
    async session({ session, token }: { session: any, token: JWT }) {
        if (session?.user) {
             // Add properties from token to session if they exist
             if (token.id) session.user.id = token.id as string;
             if (token.name) session.user.name = token.name as string;
             if (token.email) session.user.email = token.email as string;
             if (token.picture) session.user.image = token.picture as string; // Map picture to image
             // if (token.userTag) session.user.userTag = token.userTag; // Add other props
        }
        return session;
    }, // End Session Callback
  }, // End Callbacks

  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};
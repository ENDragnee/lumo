// lib/authOptions.ts (or lib/auth.ts)

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from './password-utils'; // Adjust path if needed
import connectDB from "@/lib/mongodb";
import User, { IUser } from '@/models/User'; // Import User model AND IUser interface
import { Types } from 'mongoose'; // Import Types

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'example@domain.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
             throw new Error('Missing credentials');
        }
        try {
          await connectDB();

          // Explicitly type the expected result of findOne and use .lean()
          // Use <IUser> to hint the structure. .lean() returns a plain object or null.
          const existingUser = await User.findOne<IUser>({ email: credentials.email }).lean();

          // This null check correctly narrows the type for TypeScript
          if (!existingUser) {
            console.log(`Auth attempt failed: User not found for email ${credentials.email}`);
            // Don't throw 'User not found' directly for security.
            throw new Error('Invalid credentials');
          }

          // --- Type checking should now pass below this line ---

          // Verify password using the property from the plain object
          const isValid = await verifyPassword(credentials.password, existingUser.password_hash);
          if (!isValid) {
             console.log(`Auth attempt failed: Invalid password for email ${credentials.email}`);
            throw new Error('Invalid credentials'); // Generic error
          }
          const userId = existingUser._id as Types.ObjectId;

          // Return the necessary user data for the session token
          // existingUser is now known to be an object matching IUser structure (without Document methods)
          return {
            id: userId.toString(), // _id is available on lean documents
            name: existingUser.name,
            email: existingUser.email,
            // Do NOT include password_hash or other sensitive data here
          };

        } catch (error: any) {
          console.error('Error during authorization:', error.message);
          // Returning null is the standard way to indicate failure in authorize
          // Throwing an error might also work depending on NextAuth version/config,
          // but returning null directs to the error page typically.
          return null;
          // Or re-throw a generic error if you want specific handling:
          // throw new Error('Authentication process failed');
        }
      },
    }),
  ],
  // ... rest of your authOptions (session, pages, callbacks) ...
   session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      // 'user' here is the object returned from 'authorize'
      if (user) {
        token.id = user.id;
        // You could add other safe details like name to the token if needed
        // token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // 'token' here is the JWT token from the 'jwt' callback
      if (token?.id && session.user) {
        session.user.id = token.id as string;
        // If you added name to the token, add it to session here too
        // session.user.name = token.name as string;
      }
      return session;
    },
  },
};

// If this file is ALSO handling the [...nextauth] route:
// import NextAuth from 'next-auth';
// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
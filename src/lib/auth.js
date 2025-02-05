import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from './password-utils'; // For password hashing (optional)
import connectDB from "@/lib/mongodb";
import User from '@/models/User';


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'example@domain.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await connectDB();

          const existingUser = await User.findOne({ email: credentials.email });

          if (existingUser === null) {
            throw new Error('User not found');
          }

          const user = existingUser;

          // Verify password (optional, implement hashing as needed)
          const isValid = await verifyPassword(credentials.password, user.password_hash);
          if (!isValid) {
            throw new Error('Invalid credentials');
          }
          const Response = {
            id: user._id,
            name: user.name,
            email: user.email,  
          };
          return {
            ...Response,
          };
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
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
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);

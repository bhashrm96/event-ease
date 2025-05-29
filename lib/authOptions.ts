// lib/authOptions.ts
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from './prisma'; // Adjust if needed

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Runs at sign in and whenever JWT is checked

      if (user) {
        token.id = user.id;
        token.role = user.role;
        // emailVerified is Date or null in Prisma User, convert to boolean
        token.emailVerified = user.emailVerified ? true : false;
      }

      return token;
    },

    async session({ session, token }) {
      // Runs when session is checked or created

      if (session.user && token) {
        // token.id can be string | undefined, so fallback to empty string or throw error as needed
        session.user.id = token.id ?? '';
        // role might be undefined, fallback to default role or ''
        session.user.role = token.role ?? 'EVENT_OWNER'; // fallback role
        // emailVerified is boolean | undefined, fallback false
        session.user.emailVerified = token.emailVerified ?? false;
      }

      return session;
    },

 async signIn({ user }) {
  return true;
},
  },
  session: {
    strategy: 'jwt',
  },
};

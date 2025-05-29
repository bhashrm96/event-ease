import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import bcrypt from "bcrypt";
import type { Session, User as NextAuthUser } from "next-auth";
import { PrismaClient, Role } from "@prisma/client";
import type { SessionStrategy } from "next-auth";

interface MyUser extends NextAuthUser {
  role: Role;
  id: string;
}

const sessionStrategy: SessionStrategy = "jwt";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.email,
          role: user.role as Role,
          emailVerified: null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      if (user) {
        const typedUser = user as MyUser;
        token.role = typedUser.role as Role;
        token.id = typedUser.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.role = token.role as Role;
if (session.user && token.id) {
  session.user.id = token.id;
}
      }
      return session;
    },
  },
  session: {
    strategy: sessionStrategy,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin", // ✅ Add this to catch login failures
  },
  secret: process.env.NEXTAUTH_SECRET,
};
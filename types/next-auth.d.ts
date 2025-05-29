import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: "ADMIN" | "STAFF" | "EVENT_OWNER";
      emailVerified: boolean; // added here as boolean for easy use in session
      image?: string | null;
    };
  }

  interface User {
    id: string;
    role: "ADMIN" | "STAFF" | "EVENT_OWNER";
    emailVerified: Date | null; // match Prisma schema type
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "ADMIN" | "STAFF" | "EVENT_OWNER";
    emailVerified?: boolean; // use boolean in JWT token for simpler checks
  }
}

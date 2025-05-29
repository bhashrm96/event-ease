// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "../authOptions";

// ✅ Export NextAuth handler for App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

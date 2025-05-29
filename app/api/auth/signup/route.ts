// app/api/signup/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, role } = body;

  if (!email || !password || !role) {
    return NextResponse.json(
      { error: "Email, password, and role are required." },
      { status: 400 }
    );
  }

  // Validate role
  if (!Object.values(Role).includes(role)) {
    return NextResponse.json(
      { error: "Invalid role provided." },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: "User with this email already exists." },
      { status: 409 }
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role
    },
  });

  return NextResponse.json({
    message: "User created successfully",
    user: { id: user.id, email: user.email, role: user.role },
  });
}

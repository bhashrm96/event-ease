// app/api/login/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  return NextResponse.json({ token, user: { id: user.id, email: user.email } });
}

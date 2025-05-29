import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/authOptions';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { UpdateUserData } from '@/types';

export async function PUT(
  req: NextRequest,
context: { params: Promise<{ id: string }> }
) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the current (admin) user from the DB
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

     const params = await context.params;
    const { id } = params;

    // Parse JSON body (update payload)
    const { email, role, password } = await req.json();

    // Validate required fields – email and role are required.
    if (!email || !role || !['EVENT_OWNER', 'STAFF'].includes(role)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Prepare the update data object. Include name if provided.
    const updatedData: UpdateUserData = {
      email,
      role
    };

    // If a password is provided (nonempty), hash it before updating.
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    // Update the user in the database using Prisma
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Edit user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

     const params = await context.params;
    const { id } = params;

    // Don't allow deleting another ADMIN
    const userToDelete = await prisma.user.findUnique({ where: { id } });

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (userToDelete.role === 'ADMIN') {
      return NextResponse.json({ error: 'Cannot delete ADMIN user' }, { status: 403 });
    }

    // Perform the deletion
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
     const params = await context.params;
    const { id } = params;

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/authOptions';

console.log("DATABASE_URL (Vercel check):", process.env.DATABASE_URL);
console.log("SECRET (Vercel check):", process.env.NEXTAUTH_SECRET);

export async function POST(req: NextRequest) {
  try {
    // Get session using next-auth method, pass authOptions (your next-auth config)
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user from your database by email to get their role and id
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Check role permission - only ADMIN and EVENT_OWNER can create events
    if (!['ADMIN', 'EVENT_OWNER'].includes(dbUser.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse request body JSON
    const { title, description, location, date, additionalFields } = await req.json();

    // Validate required fields
    if (!title || !location || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique slug
    const slugBase = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    let publicSlug = slugBase;
    let count = 1;
    while (await prisma.event.findUnique({ where: { publicSlug } })) {
      publicSlug = `${slugBase}-${count++}`;
    }

    // Create event linked to user by ownerId
    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        publicSlug,
        ownerId: dbUser.id,
        additionalFields: additionalFields || null,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Event creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Parse URL to get query params
    const url = new URL(req.url);
    const ownerId = url.searchParams.get('ownerId');

    // Define prisma query filter
    const whereFilter = ownerId ? { ownerId } : {};

    const events = await prisma.event.findMany({
      where: whereFilter,
      orderBy: { date: 'asc' },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Fetch events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

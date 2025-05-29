import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/authOptions';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Only allow ADMIN, STAFF, EVENT_OWNER
    if (!['ADMIN', 'STAFF', 'EVENT_OWNER'].includes(dbUser.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

     const params = await context.params;
    const { id } = params;

    const existingEvent = await prisma.event.findUnique({ where: { id } });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // If role is EVENT_OWNER, can update only own events
    if (dbUser.role === 'EVENT_OWNER' && existingEvent.ownerId !== dbUser.id) {
      return NextResponse.json({ error: 'Forbidden: Not your event' }, { status: 403 });
    }

    const { title, description, location, date, additionalFields } = await req.json();

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        location,
        date: date ? new Date(date) : undefined,
        additionalFields: additionalFields ?? null,
      },
    });

    return NextResponse.json({ event: updatedEvent }, { status: 200 });
  } catch (error) {
    console.error('Event update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Only ADMIN and EVENT_OWNER can delete (commonly STAFF shouldn't delete)
    if (!['ADMIN', 'EVENT_OWNER'].includes(dbUser.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

     const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const existingEvent = await prisma.event.findUnique({ where: { id } });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // If role is EVENT_OWNER, can delete only own events
    if (dbUser.role === 'EVENT_OWNER' && existingEvent.ownerId !== dbUser.id) {
      return NextResponse.json({ error: 'Forbidden: Not your event' }, { status: 403 });
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Event deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
   const params = await context.params;
  const { id } = params;

  console.log('Fetching event with ID:', id);

  if (!id) {
    return NextResponse.json({ error: 'Missing event ID' }, { status: 400 });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, email, eventId } = await req.json();

    if (!name || !email || !eventId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        name,
        email,
        eventId,
      },
    });

    return NextResponse.json({ rsvp }, { status: 201 });
  } catch (error) {
    console.error('RSVP POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('id');

  if (!eventId) {
    return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });
  }

  const rsvps = await prisma.rsvp.findMany({
    where: { eventId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ rsvps });
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'RSVP ID is required' }, { status: 400 });
    }

    const deletedRsvp = await prisma.rsvp.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'RSVP deleted', rsvp: deletedRsvp }, { status: 200 });
  } catch (error) {
    console.error('RSVP DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
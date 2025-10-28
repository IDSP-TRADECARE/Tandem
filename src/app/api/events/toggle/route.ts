import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db/index';
import { events } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { eventId, completed } = await request.json();

    // If it's a temporary event (starts with 'temp-'), just return success
    if (typeof eventId === 'string' && eventId.startsWith('temp-')) {
      return NextResponse.json({ success: true, eventId, completed });
    }

    // Update the event in database
    await db
      .update(events)
      .set({ completed, updatedAt: new Date() })
      .where(eq(events.id, eventId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling event:', error);
    return NextResponse.json(
      { error: 'Failed to toggle event' },
      { status: 500 }
    );
  }
}
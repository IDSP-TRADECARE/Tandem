import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db/index';
import { events, schedules } from '../../../../db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user';
    
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch events for today
    const todayEvents = await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.userId, userId),
          gte(events.date, today),
          lte(events.date, tomorrow)
        )
      );

    // If no events, generate from schedules
    if (todayEvents.length === 0) {
      const userSchedules = await db
        .select()
        .from(schedules)
        .where(eq(schedules.userId, userId));

      const generatedEvents = await generateEventsFromSchedules(userSchedules, today, userId);
      
      return NextResponse.json({ events: generatedEvents });
    }

    return NextResponse.json({ events: todayEvents });
  } catch (error) {
    console.error('Error fetching today events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

async function generateEventsFromSchedules(schedules: any[], date: Date, userId: string) {
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dayMap: Record<string, string> = {
    'SUN': 'SUN',
    'MON': 'MON',
    'TUE': 'TUE',
    'WED': 'WED',
    'THU': 'THU',
    'FRI': 'FRI',
    'SAT': 'SAT',
  };
  const todayCode = dayMap[dayOfWeek];

  const generatedEvents = [];

  for (const schedule of schedules) {
    if (schedule.workingDays.includes(todayCode)) {
      // Create work event
      generatedEvents.push({
        id: `temp-work-${schedule.id}`,
        userId,
        title: `Work: ${schedule.location || 'Work site'}`,
        type: 'work',
        date,
        timeFrom: schedule.timeFrom,
        timeTo: schedule.timeTo,
        location: schedule.location,
        notes: schedule.notes,
        completed: false,
        scheduleId: schedule.id,
      });

      // Check if childcare is needed (no childcare booked)
      // You can add logic here to check for actual childcare bookings
      generatedEvents.push({
        id: `temp-childcare-${schedule.id}`,
        userId,
        title: 'No Childcare Booked',
        type: 'childcare',
        date,
        timeFrom: schedule.timeFrom,
        timeTo: schedule.timeTo,
        location: '',
        notes: 'Need to book childcare',
        completed: false,
        scheduleId: schedule.id,
      });
    }
  }

  return generatedEvents;
}
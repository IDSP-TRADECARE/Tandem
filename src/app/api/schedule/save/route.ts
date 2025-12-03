import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { schedules } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { resolveWeek } from '@/lib/schedule/resolveWeek';

export async function POST(request: NextRequest) {
  console.log('🔐 Save route hit');

  const { userId } = await auth();
  console.log('👤 User ID:', userId);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  console.log('📦 Payload received:', JSON.stringify(payload, null, 2));

  // Always use daySchedules > NEVER trust root-level timeFrom/timeTo
  const dailyTimes = payload.daySchedules || {};
  console.log('🕐 Daily times:', JSON.stringify(dailyTimes, null, 2));

  // VALIDATION
  if (!payload.workingDays?.length) {
    return NextResponse.json(
      { error: 'Missing workingDays — AI or input failed.' },
      { status: 400 }
    );
  }

  if (!payload.daySchedules) {
    return NextResponse.json(
      { error: 'Missing daySchedules — AI or input failed.' },
      { status: 400 }
    );
  }

  // DEFAULTS FOR ROOT-LEVEL FIELDS
  // These DO NOT affect dailyTimes — they are just for DB compatibility!
  let defaultTimeFrom = '09:00';
  let defaultTimeTo = '17:00';

  const firstDay = payload.workingDays[0];
  const firstSchedule = payload.daySchedules[firstDay];

  if (firstSchedule?.timeFrom) defaultTimeFrom = firstSchedule.timeFrom;
  if (firstSchedule?.timeTo) defaultTimeTo = firstSchedule.timeTo;

  console.log('⏰ Root-level defaults:', {
    defaultTimeFrom,
    defaultTimeTo,
  });

  // Safety
  function safe(val: any, fallback: string) {
    return val && typeof val === 'string' && val.trim() !== '' ? val : fallback;
  }

  // WEEK RESOLUTION
  let weekOf;

  if (payload.weekStart) {
    console.log('📆 Using weekStart:', payload.weekStart);
    weekOf = payload.weekStart;
  } else if (payload.isNextWeek !== undefined) {
    console.log('📆 Using isNextWeek flag:', payload.isNextWeek);
    weekOf = resolveWeek(payload.isNextWeek);
  } else if (payload.weekOffset) {
    const isNext = payload.weekOffset === 'next';
    console.log('📆 Using weekOffset:', payload.weekOffset);
    weekOf = resolveWeek(isNext);
  } else {
    console.log('📆 No week data > current week');
    weekOf = resolveWeek(false);
  }

  console.log('📅 Final weekOf:', weekOf);

  // FINAL DATABASE PAYLOAD
  const baseValues = {
    title: payload.title ?? 'Schedule',
    workingDays: payload.workingDays,

    // Root-level (legacy) values > always safe fallbacks from first day's times
    timeFrom: safe(payload.timeFrom, defaultTimeFrom),
    timeTo: safe(payload.timeTo, defaultTimeTo),

    // Authoritative time structure
    dailyTimes,

    location: payload.location || null,
    notes: payload.notes || null,
    deletedDates: payload.deletedDates ?? [],
    weekOf,
  };

  let row;

  if (payload.id) {
    const [updated] = await db
      .update(schedules)
      .set(baseValues)
      .where(eq(schedules.id, payload.id))
      .returning();

    console.log('📌 Updated schedule:', updated);
    row = updated;
  } else {
    const [created] = await db
      .insert(schedules)
      .values({ userId, ...baseValues })
      .returning();

    console.log('🆕 Created schedule:', created);
    row = created;
  }

  return NextResponse.json({ success: true, schedule: row });
}

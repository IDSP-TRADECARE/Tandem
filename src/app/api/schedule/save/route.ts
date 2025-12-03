import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { schedules } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { resolveWeek } from '@/lib/schedule/resolveWeek';

export async function POST(request: NextRequest) {
  console.log('🔐 Save route hit');

  const { userId } = await auth();
  console.log('👤 User ID from auth():', userId);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  console.log('📦 Payload received:', JSON.stringify(payload, null, 2));

  const dailyTimes = payload.daySchedules || payload.dailyTimes || {};
  console.log('🕐 Daily times to save:', JSON.stringify(dailyTimes, null, 2));

  // -------- VALIDATION (VERY IMPORTANT) --------
  if (!payload.workingDays || payload.workingDays.length === 0) {
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

  // -------- Derive default times from first day --------
  let defaultTimeFrom = '09:00';
  let defaultTimeTo = '17:00';

  const firstDay = payload.workingDays[0];
  const firstSchedule = payload.daySchedules[firstDay];

  if (firstSchedule) {
    defaultTimeFrom = firstSchedule.timeFrom || defaultTimeFrom;
    defaultTimeTo = firstSchedule.timeTo || defaultTimeTo;
  }

  console.log('⏰ Default times:', { defaultTimeFrom, defaultTimeTo });

  function safeTime(val: any, fallback: string) {
    return val && typeof val === 'string' && val.trim() !== '' ? val : fallback;
  }

  // ---------------- WEEK RESOLUTION (supports all input types) ----------------

  // Manual input or PDF upload — weekStart comes from frontend resolveWeek()
  if (payload.weekStart) {
    console.log('📆 Using weekStart from payload:', payload.weekStart);
    var weekOf = payload.weekStart;
  }

  // Manual input or PDF upload — "next week" detected via notes
  else if (payload.isNextWeek !== undefined) {
    console.log('📆 Using isNextWeek flag:', payload.isNextWeek);
    weekOf = resolveWeek(payload.isNextWeek);
  }

  // Voice input — old logic based on weekOffset
  else if (payload.weekOffset) {
    const isNext = payload.weekOffset === 'next';
    console.log('📆 Using weekOffset for voice input:', payload.weekOffset);
    weekOf = resolveWeek(isNext);
  }

  // Default fallback — always resolve current week
  else {
    console.log('📆 No week data found — using current week');
    weekOf = resolveWeek(false);
  }

  console.log('📅 Final weekOf:', weekOf);

  // -------- FINAL DB PAYLOAD --------
  const baseValues = {
    title: payload.title ?? 'Schedule',
    workingDays: payload.workingDays,
    timeFrom: safeTime(payload.timeFrom, defaultTimeFrom),
    timeTo: safeTime(payload.timeTo, defaultTimeTo),
    location: payload.location || null,
    notes: payload.notes || null,
    deletedDates: payload.deletedDates ?? [],
    dailyTimes,
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
      .values({
        userId,
        ...baseValues,
      })
      .returning();

    console.log('🆕 Created schedule:', created);
    row = created;
  }

  return NextResponse.json({
    success: true,
    schedule: row,
  });
}

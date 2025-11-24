import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { schedules } from "../../../../db/schema";

export async function POST(request: NextRequest) {
  console.log('🔐 Save route hit');
  
  const { userId } = await auth();
  console.log('👤 User ID from auth():', userId);
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  
  console.log('📦 Payload received:', JSON.stringify(payload, null, 2));

  // Build daily_times from daySchedules if provided
  const dailyTimes = payload.daySchedules || {};
  
  console.log('🕐 Daily times to save:', JSON.stringify(dailyTimes, null, 2));
  
  // Get default times from first working day if daySchedules exists
  let defaultTimeFrom = "09:00";
  let defaultTimeTo = "17:00";
  
  if (payload.daySchedules && payload.workingDays && payload.workingDays.length > 0) {
    const firstDay = payload.workingDays[0];
    if (payload.daySchedules[firstDay]) {
      defaultTimeFrom = payload.daySchedules[firstDay].timeFrom;
      defaultTimeTo = payload.daySchedules[firstDay].timeTo;
    }
  }

  console.log('⏰ Default times:', { defaultTimeFrom, defaultTimeTo });

  // Inserting schedule into database
  const [created] = await db
    .insert(schedules)
    .values({
      userId,
      title: payload.title ?? "Schedule",
      workingDays: payload.workingDays ?? [],
      timeFrom: payload.timeFrom ?? defaultTimeFrom,
      timeTo: payload.timeTo ?? defaultTimeTo,
      location: payload.location ?? null,
      notes: payload.notes ?? null,
      deletedDates: payload.deletedDates ?? [],
      dailyTimes: dailyTimes, 
    })
    .returning();

  console.log('✅ Schedule created with ID:', created.id);
  console.log('💾 Saved dailyTimes:', created.dailyTimes);

  return NextResponse.json({
    success: true,
    scheduleId: created.id,
  });
}
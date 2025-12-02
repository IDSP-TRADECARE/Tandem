import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { schedules } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  console.log('🔐 Save route hit');
  
  const { userId } = await auth();
  console.log('👤 User ID from auth():', userId);
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  console.log('📦 Payload received:', JSON.stringify(payload, null, 2));

  const dailyTimes = payload.daySchedules || payload.dailyTimes || {};
  console.log('🕐 Daily times to save:', JSON.stringify(dailyTimes, null, 2));

  // Derive default times from first working day
  let defaultTimeFrom = "09:00";
  let defaultTimeTo = "17:00";

  if (payload.workingDays?.length && payload.daySchedules) {
    const firstDay = payload.workingDays[0];
    const firstSchedule = payload.daySchedules[firstDay];
    if (firstSchedule) {
      defaultTimeFrom = firstSchedule.timeFrom || defaultTimeFrom;
      defaultTimeTo = firstSchedule.timeTo || defaultTimeTo;
    }
  }

  console.log('⏰ Default times:', { defaultTimeFrom, defaultTimeTo });

  // Helper to avoid "" in TIME columns
  function safeTime(val: any, fallback: string) {
    return val && typeof val === "string" && val.trim() !== ""
      ? val
      : fallback;
  }

  // Helper function to get Monday of current week
  function getWeekStart(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().slice(0, 10); 
  }

  const weekOf = getWeekStart(new Date()); 

  const baseValues = {
    title: payload.title ?? "Schedule",
    workingDays: payload.workingDays ?? [],
    timeFrom: safeTime(payload.timeFrom, defaultTimeFrom),
    timeTo: safeTime(payload.timeTo, defaultTimeTo),
    location: payload.location || null,
    notes: payload.notes || null,
    deletedDates: payload.deletedDates ?? [],
    dailyTimes,
  };

  let row;

  if (payload.id) {
    const [updated] = await db
      .update(schedules)
      .set(baseValues)
      .where(eq(schedules.id, payload.id))
      .returning();

    console.log("📌 Updated schedule:", updated);
    row = updated;

  } else {
    const [created] = await db
      .insert(schedules)
      .values({
        userId,
        weekOf,  
        ...baseValues,
      })
      .returning();

    console.log("🆕 Created schedule:", created);
    row = created;
  }

  return NextResponse.json({
    success: true,
    schedule: row,
  });
}

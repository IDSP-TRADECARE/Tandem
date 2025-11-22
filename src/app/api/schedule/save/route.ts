import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { schedules } from "../../../../db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
  console.log('🔐 Save route hit');
  
  const { userId } = await auth();
  console.log('👤 User ID from auth():', userId);
  
  if (!userId) {
    console.error('❌ No userId - user not authenticated');
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  console.log('📦 Payload:', payload);

  // Insert schedule into database
  const [created] = await db
    .insert(schedules)
    .values({
      userId,
      title: payload.title ?? "Schedule",
      workingDays: payload.workingDays ?? [],
      timeFrom: payload.timeFrom ?? "08:00",
      timeTo: payload.timeTo ?? "17:00",
      location: payload.location ?? null,
      notes: payload.notes ?? null,
      deletedDates: payload.deletedDates ?? [],
    })
    .returning();

  console.log('✅ Schedule created:', created.id);

  return NextResponse.json({
    success: true,
    scheduleId: created.id,
  });
}
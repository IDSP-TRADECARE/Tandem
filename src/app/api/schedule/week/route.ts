import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { schedules } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userSchedules = await db
      .select({
        id: schedules.id,
        title: schedules.title,
        workingDays: schedules.workingDays,
        timeFrom: schedules.timeFrom,
        timeTo: schedules.timeTo,
        location: schedules.location,
        notes: schedules.notes,
        deletedDates: schedules.deletedDates,
        editedDates: schedules.editedDates, // CRITICAL: Include this!
      })
      .from(schedules)
      .where(eq(schedules.userId, userId));

    console.log(
      "📅 Fetching schedules for week - editedDates:",
      userSchedules.map((s) => ({ id: s.id, editedDates: s.editedDates }))
    );

    return NextResponse.json({ schedules: userSchedules });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}

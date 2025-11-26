import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { schedules } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [latest] = await db
      .select({
        id: schedules.id,
        title: schedules.title,
        workingDays: schedules.workingDays,
        timeFrom: schedules.timeFrom,
        timeTo: schedules.timeTo,
        location: schedules.location,
        notes: schedules.notes,
        deletedDates: schedules.deletedDates,
        editedDates: schedules.editedDates,
        dailyTimes: schedules.dailyTimes,
        updatedAt: schedules.updatedAt,
      })
      .from(schedules)
      .where(eq(schedules.userId, userId))
      .orderBy(desc(schedules.updatedAt))
      .limit(1);

    console.log("📅 Fetching LATEST schedule:", {
      id: latest?.id,
      dailyTimes: latest?.dailyTimes,
    });

    return NextResponse.json({ schedules: latest ? [latest] : [] });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}

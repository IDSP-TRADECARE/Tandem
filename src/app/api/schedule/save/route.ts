import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { schedules } from "../../../../db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schedule = await request.json();

    // Validate required fields
    if (
      !schedule.title ||
      !schedule.workingDays ||
      !schedule.timeFrom ||
      !schedule.timeTo
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert schedule into database
    const result = await db
      .insert(schedules)
      .values({
        userId,
        title: schedule.title,
        workingDays: schedule.workingDays,
        timeFrom: schedule.timeFrom,
        timeTo: schedule.timeTo,
        location: schedule.location || null,
        notes: schedule.notes || null,
        deletedDates: schedule.deletedDates ?? [],
      })
      .returning();

    return NextResponse.json({
      success: true,
      scheduleId: result[0].id,
    });
  } catch (error) {
    console.error("Error saving schedule:", error);
    return NextResponse.json(
      { error: "Failed to save schedule" },
      { status: 500 }
    );
  }
}

// Get user's schedules
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userSchedules = await db
      .select()
      .from(schedules)
      .where(eq(schedules.userId, userId))
      .orderBy(desc(schedules.createdAt));

    return NextResponse.json({ schedules: userSchedules });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}

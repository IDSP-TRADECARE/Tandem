import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { schedules } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { scheduleId, date, type } = await request.json();

    if (!scheduleId || !date || !type) {
      return NextResponse.json(
        { error: "Missing required fields: scheduleId, date, type" },
        { status: 400 }
      );
    }

    console.log(
      `🗑️ Deleting ${type} event for schedule ${scheduleId} on ${date}`
    );

    // Fetch the current schedule
    const [schedule] = await db
      .select()
      .from(schedules)
      .where(eq(schedules.id, scheduleId))
      .limit(1);

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    // Add the date to deletedDates array
    const currentDeletedDates = schedule.deletedDates || [];

    // Only add if not already in the array
    if (!currentDeletedDates.includes(date)) {
      const updatedDeletedDates = [...currentDeletedDates, date];

      await db
        .update(schedules)
        .set({
          deletedDates: updatedDeletedDates,
          updatedAt: new Date(),
        })
        .where(eq(schedules.id, scheduleId));

      console.log(
        `✅ Added ${date} to deletedDates for schedule ${scheduleId}`
      );
    }

    return NextResponse.json({
      success: true,
      message: `${type} event deleted successfully`,
    });
  } catch (error) {
    console.error("❌ Error deleting schedule event:", error);
    return NextResponse.json(
      {
        error: "Failed to delete event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

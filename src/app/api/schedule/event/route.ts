import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { schedules } from "@/db/schema";
import { eq } from "drizzle-orm";

// DELETE handler
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { scheduleId, date, type } = body as {
      scheduleId: string;
      date: string;
      type: string;
    };

    if (!scheduleId || !date || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(
      `🗑️ Deleting ${type} event for schedule ${scheduleId} on ${date}`
    );

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

    const deletedDates = (schedule.deletedDates || []) as string[];
    if (!deletedDates.includes(date)) {
      deletedDates.push(date);
    }

    await db
      .update(schedules)
      .set({
        deletedDates: deletedDates as unknown as string[],
        updatedAt: new Date(),
      })
      .where(eq(schedules.id, scheduleId));

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting schedule event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}

// PATCH handler
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { scheduleId, date, type, updates } = body as {
      scheduleId: string;
      date: string;
      type: string;
      updates: {
        title?: string;
        timeFrom?: string;
        timeTo?: string;
        location?: string;
        notes?: string;
      };
    };

    if (!scheduleId || !date || !type || !updates) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(
      `✏️ Editing ${type} event for schedule ${scheduleId} on ${date}`
    );

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

    const editedDates = (schedule.editedDates || {}) as Record<
      string,
      Record<
        string,
        {
          title?: string;
          timeFrom?: string;
          timeTo?: string;
          location?: string;
          notes?: string;
          updatedAt: string;
        }
      >
    >;

    if (!editedDates[date]) {
      editedDates[date] = {};
    }

    editedDates[date][type] = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await db
      .update(schedules)
      .set({
        editedDates: editedDates as unknown as Record<
          string,
          Record<
            string,
            {
              title?: string;
              timeFrom?: string;
              timeTo?: string;
              location?: string;
              notes?: string;
              updatedAt: string;
            }
          >
        >,
        updatedAt: new Date(),
      })
      .where(eq(schedules.id, scheduleId));

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
    });
  } catch (error) {
    console.error("❌ Error updating schedule event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

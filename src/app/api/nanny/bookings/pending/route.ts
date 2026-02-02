import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pendingNannyRequests } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function GET() {
  try {
    const user = await getCurrentUser();

    const rows = await db
      .select({
        date: pendingNannyRequests.date,
        status: pendingNannyRequests.status,
      })
      .from(pendingNannyRequests)
      .where(eq(pendingNannyRequests.userId, user.userId));

    return NextResponse.json({
      dates: rows
        .filter((row) => row.status === "pending")
        .map((row) => row.date),
    });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    const { date, status = "pending" } = await request.json();
    if (!date) {
      return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    await db
      .insert(pendingNannyRequests)
      .values({
        userId: user.userId,
        date,
        status,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [pendingNannyRequests.userId, pendingNannyRequests.date],
        set: { status, updatedAt: new Date() },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    const { date } = await request.json();
    if (!date) {
      return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    await db
      .delete(pendingNannyRequests)
      .where(
        and(
          eq(pendingNannyRequests.userId, user.userId),
          eq(pendingNannyRequests.date, date)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

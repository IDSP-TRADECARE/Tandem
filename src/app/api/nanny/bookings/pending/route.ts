import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { pendingNannyRequests } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      date: pendingNannyRequests.date,
      status: pendingNannyRequests.status,
    })
    .from(pendingNannyRequests)
    .where(eq(pendingNannyRequests.userId, userId));

  return NextResponse.json({
    dates: rows
      .filter((row) => row.status === "pending")
      .map((row) => row.date),
  });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date, status = "pending" } = await request.json();
  if (!date) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  await db
    .insert(pendingNannyRequests)
    .values({
      userId,
      date,
      status,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [pendingNannyRequests.userId, pendingNannyRequests.date],
      set: { status, updatedAt: new Date() },
    });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date } = await request.json();
  if (!date) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  await db
    .delete(pendingNannyRequests)
    .where(
      and(
        eq(pendingNannyRequests.userId, userId),
        eq(pendingNannyRequests.date, date)
      )
    );

  return NextResponse.json({ success: true });
}

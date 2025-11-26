// src/app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id?: string }> } // params is a Promise in app-router routes
) {
  try {
    const { id } = await params; // unwrap
    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    // clerkId is stored in users.clerkId per schema
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, id))
      .limit(1);

    if (!row) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the public fields we need
    return NextResponse.json({
      id: row.id,
      clerkId: row.clerkId,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      profilePicture: row.profilePicture,
      phone: row.phone,
      bio: row.bio,
    });
  } catch (err) {
    console.error("GET /api/users/[id] error", err);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
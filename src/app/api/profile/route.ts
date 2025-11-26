import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { firstName, lastName, bio, email, phone, profilePicture } = body;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Validate phone if provided
    if (phone) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      const cleanPhone = phone.replace(/[\s-()]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
      }
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (existingUser.length > 0) {
      await db
        .update(users)
        .set({
          firstName,
          lastName,
          email,
          phone,
          bio,
          profilePicture,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, userId));
    } else {
      await db.insert(users).values({
        clerkId: userId,
        firstName,
        lastName,
        email,
        phone,
        bio,
        profilePicture,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
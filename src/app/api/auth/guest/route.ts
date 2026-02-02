import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function POST() {
  try {
    // Generate a unique guest ID
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const guestId = `guest_${timestamp}_${randomNum}`;
    const guestEmail = `guest_${timestamp}_${randomNum}@tandem.guest`;
    
    // Create guest user in database
    const [newGuestUser] = await db
      .insert(users)
      .values({
        clerkId: guestId,
        email: guestEmail,
        firstName: 'Guest',
        lastName: 'User',
        isGuest: true,
        bio: 'Guest user account',
      })
      .returning();

    // Return the guest user info
    return NextResponse.json({
      success: true,
      user: {
        id: newGuestUser.id,
        clerkId: newGuestUser.clerkId,
        firstName: newGuestUser.firstName,
        lastName: newGuestUser.lastName,
        email: newGuestUser.email,
        isGuest: true,
      },
    });
  } catch (error) {
    console.error('Error creating guest user:', error);
    return NextResponse.json(
      { error: 'Failed to create guest user' },
      { status: 500 }
    );
  }
}

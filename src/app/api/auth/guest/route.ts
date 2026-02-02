import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { randomUUID } from 'node:crypto';

/**
 * Guest Login Endpoint
 * 
 * Creates a temporary anonymous user session for iframe/guest access.
 * Sets a session cookie that works in cross-origin iframe context.
 */
export async function POST() {
  try {
    // Generate a unique guest session ID and user ID
    const guestSessionId = randomUUID();
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

    // Create response with redirect to main app
    const response = NextResponse.json({
      success: true,
      user: {
        id: newGuestUser.id,
        clerkId: newGuestUser.clerkId,
        firstName: newGuestUser.firstName,
        lastName: newGuestUser.lastName,
        email: newGuestUser.email,
        isGuest: true,
      },
      sessionId: guestSessionId,
    });

    // Set guest session cookie with proper configuration for iframe context
    response.cookies.set('guest_session', guestSessionId, {
      httpOnly: true,
      secure: true, // Required for SameSite=None
      sameSite: 'none', // Required for cross-origin iframe
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Store guest user ID in a separate cookie for easy access
    response.cookies.set('guest_user_id', newGuestUser.clerkId, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error creating guest user:', error);
    return NextResponse.json(
      { error: 'Failed to create guest user' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if guest session exists
 */
export async function GET(request: Request) {
  try {
    const cookies = request.headers.get('cookie');
    const guestSession = cookies?.match(/guest_session=([^;]+)/)?.[1];
    const guestUserId = cookies?.match(/guest_user_id=([^;]+)/)?.[1];

    if (!guestSession || !guestUserId) {
      return NextResponse.json({ isGuest: false }, { status: 200 });
    }

    return NextResponse.json({
      isGuest: true,
      guestUserId,
      sessionId: guestSession,
    });
  } catch (error) {
    console.error('Error checking guest session:', error);
    return NextResponse.json(
      { error: 'Failed to check guest session' },
      { status: 500 }
    );
  }
}

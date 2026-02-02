import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { schedules, nannyShares } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

/**
 * Clear all user data (schedules and nanny shares)
 * Works even with expired sessions by reading userId directly from cookies
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Try to get userId from guest_user_id cookie
    const guestUserId = cookieStore.get('guest_user_id')?.value;
    
    if (!guestUserId) {
      return NextResponse.json(
        { error: 'No user session found' },
        { status: 401 }
      );
    }

    // Delete all schedules for this user
    const deletedSchedules = await db
      .delete(schedules)
      .where(eq(schedules.userId, guestUserId))
      .returning();

    // Delete all nanny shares created by this user
    const deletedShares = await db
      .delete(nannyShares)
      .where(eq(nannyShares.creatorId, guestUserId))
      .returning();

    // Clear the cookies
    cookieStore.delete('guest_session');
    cookieStore.delete('guest_user_id');

    return NextResponse.json({
      success: true,
      deleted: {
        schedules: deletedSchedules.length,
        nannyShares: deletedShares.length,
      },
      message: 'All data cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    return NextResponse.json(
      { error: 'Failed to clear data' },
      { status: 500 }
    );
  }
}

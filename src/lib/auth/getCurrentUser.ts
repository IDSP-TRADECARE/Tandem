import { auth } from '@clerk/nextjs/server';
import { getGuestSession } from './guestSession';

/**
 * Get the current user - either from Clerk auth or guest session
 * Use this in server components and API routes
 */
export async function getCurrentUser(): Promise<{
  userId: string;
  isGuest: boolean;
  clerkUser?: Awaited<ReturnType<typeof auth>>['userId'];
}> {
  // First check for Clerk authentication
  const { userId: clerkUserId } = await auth();
  
  if (clerkUserId) {
    return {
      userId: clerkUserId,
      isGuest: false,
      clerkUser: clerkUserId,
    };
  }

  // If no Clerk auth, check for guest session
  const guestSession = await getGuestSession();
  
  if (guestSession) {
    return {
      userId: guestSession.userId,
      isGuest: true,
    };
  }

  // No auth at all - this should rarely happen due to middleware protection
  throw new Error('No authentication found');
}

/**
 * Require user authentication (Clerk or Guest)
 * Throws if no auth is found
 */
export async function requireUser() {
  return getCurrentUser();
}

/**
 * Check if current user is a guest
 */
export async function isCurrentUserGuest(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user.isGuest;
  } catch {
    return false;
  }
}

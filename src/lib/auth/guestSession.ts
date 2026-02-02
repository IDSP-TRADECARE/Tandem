import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

/**
 * Guest Session Utilities
 * 
 * Helper functions for managing guest/anonymous user sessions.
 */

export interface GuestSession {
  sessionId: string;
  userId: string;
  isGuest: true;
}

/**
 * Check if a request has a valid guest session
 * Works in both middleware and API routes
 */
export function hasGuestSession(request: NextRequest): boolean {
  const guestSession = request.cookies.get('guest_session')?.value;
  const guestUserId = request.cookies.get('guest_user_id')?.value;
  
  return !!(guestSession && guestUserId);
}

/**
 * Get guest session from request cookies (for middleware)
 */
export function getGuestSessionFromRequest(request: NextRequest): GuestSession | null {
  const sessionId = request.cookies.get('guest_session')?.value;
  const userId = request.cookies.get('guest_user_id')?.value;
  
  if (!sessionId || !userId) {
    return null;
  }
  
  return {
    sessionId,
    userId,
    isGuest: true,
  };
}

/**
 * Get guest session from server component/API route (using next/headers)
 */
export async function getGuestSession(): Promise<GuestSession | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('guest_session')?.value;
  const userId = cookieStore.get('guest_user_id')?.value;
  
  if (!sessionId || !userId) {
    return null;
  }
  
  return {
    sessionId,
    userId,
    isGuest: true,
  };
}

/**
 * Check if user is a guest (has guest session but no Clerk auth)
 */
export async function isGuestUser(): Promise<boolean> {
  const guestSession = await getGuestSession();
  return guestSession !== null;
}

/**
 * Clear guest session cookies
 */
export async function clearGuestSession() {
  const cookieStore = await cookies();
  cookieStore.delete('guest_session');
  cookieStore.delete('guest_user_id');
}

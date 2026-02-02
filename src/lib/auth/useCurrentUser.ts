'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

/**
 * Unified hook that checks BOTH Clerk authentication AND guest sessions
 * Use this instead of useUser() to support guest users
 */
export function useCurrentUser() {
  const { user: clerkUser, isSignedIn: isClerkSignedIn, isLoaded } = useUser();
  const [hasGuestSession, setHasGuestSession] = useState<boolean | null>(null);
  const [guestUserId, setGuestUserId] = useState<string | null>(null);

  // Check for guest session
  useEffect(() => {
    fetch('/api/auth/guest', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setHasGuestSession(data.isGuest || false);
        if (data.isGuest && data.userId) {
          setGuestUserId(data.userId);
        }
      })
      .catch(() => {
        setHasGuestSession(false);
      });
  }, []);

  // Loading state - wait for both checks
  const isLoadingAuth = !isLoaded || hasGuestSession === null;

  // User is authenticated if EITHER Clerk OR guest
  const isAuthenticated = isClerkSignedIn || hasGuestSession;

  // Return unified user object
  const currentUser = clerkUser
    ? {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        imageUrl: clerkUser.imageUrl,
        isGuest: false,
      }
    : hasGuestSession && guestUserId
    ? {
        id: guestUserId,
        name: 'Guest User',
        imageUrl: '/profile/placeholderAvatar.png',
        isGuest: true,
      }
    : null;

  return {
    user: currentUser,
    isSignedIn: isAuthenticated,
    isLoaded: !isLoadingAuth,
    isGuest: hasGuestSession || false,
  };
}

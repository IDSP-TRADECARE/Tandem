'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [hasGuestSession, setHasGuestSession] = useState<boolean | null>(null);

  // Check for guest session
  useEffect(() => {
    fetch('/api/auth/guest', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setHasGuestSession(data.isGuest || false);
      })
      .catch(() => {
        setHasGuestSession(false);
      });
  }, []);

  useEffect(() => {
    // Wait for both Clerk and guest session checks to complete
    if (isLoaded && hasGuestSession !== null) {
      // If not signed in with Clerk AND no guest session, redirect to sign-in
      if (!isSignedIn && !hasGuestSession) {
        router.push('/sign-in');
      }
    }
  }, [isLoaded, isSignedIn, hasGuestSession, router]);

  // Show loading while checking auth
  if (!isLoaded || hasGuestSession === null) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children until signed in (Clerk OR guest)
  if (!isSignedIn && !hasGuestSession) {
    return null;
  }

  return <>{children}</>;
}
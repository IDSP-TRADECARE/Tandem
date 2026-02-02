'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Guest Mode Indicator Component
 * 
 * Displays a banner when user is in guest mode with option to sign up/sign in
 */
export function GuestModeIndicator() {
  const [isGuest, setIsGuest] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is in guest mode
    fetch('/api/auth/guest', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setIsGuest(data.isGuest || false);
      })
      .catch(() => {
        setIsGuest(false);
      });
  }, []);

  if (!isGuest || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">
              You're using <strong>Guest Mode</strong>. Your data won't be saved permanently.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/sign-up')}
              className="px-4 py-1.5 bg-white text-purple-600 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Create Account
            </button>
            <button
              onClick={() => router.push('/sign-in')}
              className="px-4 py-1.5 bg-transparent border border-white rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Dismiss"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

/**
 * Client-side hook to check if user is in guest mode
 */
export function useGuestMode() {
  const [isGuest, setIsGuest] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/guest', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setIsGuest(data.isGuest || false);
        setLoading(false);
      })
      .catch(() => {
        setIsGuest(false);
        setLoading(false);
      });
  }, []);

  return { isGuest, loading };
}

/**
 * Client-side guest session management
 */
export const guestSession = {
  /**
   * Check if current user is a guest
   */
  async isGuest(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/guest', {
        credentials: 'include',
      });
      const data = await response.json();
      return data.isGuest || false;
    } catch {
      return false;
    }
  },

  /**
   * Create a new guest session
   */
  async create(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error || 'Failed to create guest session' };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Get guest session info
   */
  async getInfo(): Promise<{
    isGuest: boolean;
    guestUserId?: string;
    sessionId?: string;
  }> {
    try {
      const response = await fetch('/api/auth/guest', {
        credentials: 'include',
      });
      return await response.json();
    } catch {
      return { isGuest: false };
    }
  },
};

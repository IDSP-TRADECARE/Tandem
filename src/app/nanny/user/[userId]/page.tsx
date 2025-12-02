/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileCard from '@/app/components/ui/nanny/cards/ProfileCard';
import NannyLayout from '@/app/components/ui/nanny/NannyLayout';
import { useUser } from '@clerk/nextjs';

type UserProfile = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  kids: Array<{ age?: string | number }>;
  location?: string;
  bio?: string;
  languages?: string[];
  certificates?: string[];
  isHost?: boolean;
};

export default function NannyUserPage({ params }: { params: Promise<{ userId: string }> }) {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ userId }) => {
      setUserId(userId);
    });
  }, [params]);

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        // Fetch user from Clerk
        const userRes = await fetch(`/api/users/${encodeURIComponent(userId)}`);
        if (!userRes.ok) throw new Error('Failed to fetch user');
        const userData = await userRes.json();

        // Fetch all shares to find where this user is a member or host
        const sharesRes = await fetch('/api/nanny/my-shares');
        const sharesData = await sharesRes.json();
        const shares = sharesData.shares || [];

        // Find shares where this user is involved
        const userShares = shares.filter((share: any) => 
          share.creatorId === userId || 
          share.members?.some((m: any) => m.userId === userId)
        );

        // Get member info from any share they're in
        const memberInfo = userShares.reduce((acc: any, share: any) => {
          const member = share.members?.find((m: any) => m.userId === userId);
          if (member) {
            return {
              kidsCount: member.kidsCount || acc.kidsCount || 0,
              location: share.location || acc.location,
            };
          }
          return acc;
        }, {});

        // Check if user is a host (creator) of any share
        const isHost = userShares.some((share: any) => share.creatorId === userId);

        // Build profile
        const userProfile: UserProfile = {
          id: userId,
          name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'User',
          avatarUrl: userData.profilePicture || userData.profile_picture || null,
          kids: Array.from({ length: memberInfo.kidsCount || 1 }, (_, i) => ({ age: '?' })),
          location: memberInfo.location || 'Location not set',
          bio: userData.bio || 'No bio yet.',
          languages: ['English'], // Could add to user profile in future
          certificates: [], // Could add to user profile in future
          isHost,
        };

        setProfile(userProfile);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        // Fallback profile
        setProfile({
          id: userId,
          name: 'User',
          avatarUrl: '/profile/placeholderAvatar.png',
          kids: [{ age: '?' }],
          location: 'Unknown',
          bio: 'No information available.',
          languages: ['English'],
          certificates: [],
          isHost: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleMessage = (targetId: string) => {
    if (!currentUser?.id) {
      window.location.href = '/sign-in';
      return;
    }
    // Create deterministic room id
    const pair = [currentUser.id, targetId].sort();
    const id = `${pair[0]}_${pair[1]}`;
    router.push(`/messages/direct/${encodeURIComponent(id)}`);
  };

  return (
    <NannyLayout>
      <div className="py-6">
        {loading ? (
          <div className="text-center text-sm text-neutral-500">Loading...</div>
        ) : profile ? (
          <ProfileCard
            id={profile.id}
            name={profile.name}
            avatarUrl={profile.avatarUrl}
            kids={profile.kids}
            location={profile.location}
            bio={profile.bio}
            languages={profile.languages}
            certificates={profile.certificates}
            isHost={profile.isHost}
            onMessage={handleMessage}
            onBack={() => router.back()}
          />
        ) : (
          <div className="text-center text-sm text-neutral-500">User not found</div>
        )}
      </div>
    </NannyLayout>
  );
}
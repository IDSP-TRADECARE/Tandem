'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileCard from '@/app/components/ui/nanny/cards/ProfileCard';
import NannyLayout from '@/app/components/ui/nanny/NannyLayout';

type MockUser = {
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

const MOCK_USERS: MockUser[] = [
  {
    id: 'user_matheus',
    name: 'Matheus Walkma',
    avatarUrl: '/profile/placeholderAvatar.png',
    kids: [{ age: '6' }, { age: '7' }],
    location: 'Burnaby',
    bio: "Hi! I'm Matheus, a woodworker in Burnaby. I have a daughter age 6 and a son age 7. Our family needs a nanny sometimes.",
    languages: ['English'],
    certificates: [],
    isHost: false,
  },
  {
    id: 'user_sandy',
    name: 'Sandy Wang',
    avatarUrl: '/profile/placeholderAvatar.png',
    kids: [{ age: '2' }],
    location: 'Vancouver',
    bio: "Hi! I'm Sandy, a metal worker in Burnaby. I'm looking for a group of parents who don't believe iPhones are good for kids.",
    languages: ['English', 'Cantonese'],
    certificates: ['First Aid'],
    isHost: true,
  },
  {
    id: 'user_stefan',
    name: 'Stefan Demeis',
    avatarUrl: '/profile/placeholderAvatar.png',
    kids: [{ age: '4' }],
    location: 'North Van',
    bio: 'Love helping with pickups and dropoffs.',
    languages: ['English'],
    certificates: [],
    isHost: false,
  },
];

export default function NannyUserPage({ params }: { params: Promise<{ userId: string }> }) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<MockUser | null>(null);

  useEffect(() => {
    // params is a Promise here in client page pattern
    params.then(({ userId }) => {
      setUserId(userId);
      // select a mock profile deterministically
      const p = getMockUser(userId);
      setProfile(p);
    });
  }, [params]);

  function getMockUser(id: string | null): MockUser {
    if (!id) return MOCK_USERS[0];
    // simple deterministic selection: find by id or pick by hashing last char
    const found = MOCK_USERS.find((u) => u.id === id);
    if (found) return found;
    const index = Math.abs([...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % MOCK_USERS.length;
    return MOCK_USERS[index];
  }

  const handleMessage = (targetId: string) => {
    // derive deterministic room id (sorted pair) so both users land in same room
    const localId = userId ?? 'anon';
    const pair = [localId, targetId].sort();
    const roomId = `${pair[0]}_${pair[1]}`;
    router.push(`/chat/${encodeURIComponent(roomId)}`);
  };

  return (
    <NannyLayout>
    <div className="py-6">
      {profile ? (
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
        <div className="text-center text-sm text-neutral-500">Loading...</div>
      )}
    </div>
    </NannyLayout>
  );
}
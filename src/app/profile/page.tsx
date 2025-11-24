'use client';

import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GradientBackgroundFull } from '../components/ui/backgrounds/GradientBackgroundFull';
import { BottomNav } from '../components/Layout/BottomNav';
import { HalfBackground } from '../components/ui/backgrounds/HalfBackground';

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const displayName = profile?.firstName && profile?.lastName 
    ? `${profile.firstName} ${profile.lastName}` 
    : user?.fullName || 'User';
  
  const userId = user?.id || 'user-id';
  const bio = profile?.bio || 'Not set';
  const profileImage = profile?.profilePicture || '/profile/placeholderAvatar.png';

  const menuItems = [
    { icon: '✏️', label: 'Edit Profile', onClick: () => router.push('/profile/edit') },
    { icon: '📍', label: 'Location', onClick: () => router.push('/profile/location') },
    { icon: '💼', label: 'Company', onClick: () => router.push('/profile/company') },
    { icon: '🌓', label: 'Light / Dark Mode', toggle: true },
    { icon: '❓', label: 'Help Center', onClick: () => router.push('/profile/help') },
    { icon: '🚪', label: 'Log Out', onClick: () => signOut() },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <GradientBackgroundFull>
      <div className="p-6 text-center">
        <h1 className="text-white text-2xl font-bold">My Profile</h1>
      </div>
      <HalfBackground>

          <div className="relative -mt-16 mb-4 text-center">
            <Image
              src={profileImage}
              alt="Profile"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full mx-auto border-4 border-white object-cover"
            />
          </div>

          <div className="rounded-3xl mx-4 p-6 text-center">
            <h2 className="text-2xl font-bold">{displayName}</h2>
            <p className="text-blue-500 text-sm">@{userId}</p>
            <p className="text-gray-600 mt-4 text-sm">{bio}</p>
          </div>

          <div className="px-4 mt-6 space-y-3">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full bg-blue-50 rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.toggle ? (
                  <div className="w-12 h-6 bg-blue-500 rounded-full"></div>
                ) : (
                  <span className="text-xl">›</span>
                )}
              </button>
            ))}
          </div>
        <BottomNav />
      </HalfBackground>
    </GradientBackgroundFull>
  );
}
'use client';

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

  const profileImage = '/profile/placeholderAvatar.png';
  const displayName = user?.fullName || 'User';
  const username = user?.username || 'username';
  const bio = "Hi! I'm Jane, a woodworker in Burnaby. I have a daughter age 6 and a son age 7. Our family needs a nanny sometimes.";

  const menuItems = [
    { icon: '✏️', label: 'Edit Profile', onClick: () => router.push('/profile/edit') },
    { icon: '📍', label: 'Location', onClick: () => router.push('/profile/location') },
    { icon: '💼', label: 'Company', onClick: () => router.push('/profile/company') },
    { icon: '🌓', label: 'Light / Dark Mode', toggle: true },
    { icon: '❓', label: 'Help Center', onClick: () => router.push('/profile/help') },
    { icon: '🚪', label: 'Log Out', onClick: () => signOut() },
  ];

  return (
    <GradientBackgroundFull>
        {/* Header */}
        <div className="p-6 text-center">
          <h1 className="text-white text-2xl font-bold">My Profile</h1>
        </div>
      <HalfBackground>
      <div className="min-h-screen flex flex-col pb-24">
          {/* Profile Picture */}
          <div className="relative -mt-15 inline-block">
            <Image
              src={profileImage}
              alt="Profile"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full mx-auto border-4 border-white"
            />
            <button className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
              ✏️
            </button>
          </div>

        {/* Profile Card */}
        <div className=" rounded-3xl -mt-8 mx-4 p-6 text-center relative">
          {/* Name and Username */}
          <h2 className="text-2xl font-bold mt-4">{displayName}</h2>
          <p className="text-blue-500 text-sm">@{username}</p>

          {/* Bio */}
          <p className="text-gray-600 mt-4 text-sm">{bio}</p>
        </div>
          

        {/* Menu Items */}
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

        {/* Bottom Navigation */}
      </div>
        <BottomNav />
      </HalfBackground>
    </GradientBackgroundFull>
  );
}
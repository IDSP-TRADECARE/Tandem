'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull'
import { ProfileHeader } from '@/app/components/ui/profile/header'
import { HalfBackground } from '@/app/components/ui/backgrounds/HalfBackground'
import { ScrollOption } from '@/app/components/ui/profile/scrollOption'
import { BottomNav } from '@/app/components/Layout/BottomNav'
import User from '@/app/components/ui/profile/User/user'

function Profile() {
    const { user } = useUser();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('darkMode') === 'true';
        setDarkMode(saved);
    }, []);

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

    const name = profile?.firstName && profile?.lastName 
        ? `${profile.firstName} ${profile.lastName}` 
        : user?.fullName || 'User';
    
    const bio = profile?.bio || 'Not set';
    const profileImage = profile?.profilePicture || '/profile/placeholderAvatar.png';

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const handleToggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', String(newMode));
    };

    return (
        <div className="min-h-screen flex flex-col">
          <GradientBackgroundFull
          background={darkMode ? '#122847' : undefined}
          >
            <div className="p-8 space-y-8 flex justify-start">
                <ProfileHeader title="My Profile" showBackButton={false} />
            </div> 

            <div className="flex justify-start fixed top-0 left-0 right-0 z-30 px-8" style={{ marginTop: '80px' }}>
              <User 
                name={name}
                username={`@${profile?.clerkId}` || '@username'}
                bio={bio}
                profileImage={profileImage}
              />
            </div>
      
            <HalfBackground 
              topPosition="140px"
              background={darkMode ? 'black' : undefined}
            >
              <div className="w-full flex justify-center px-4 sm:px-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)', paddingTop: '200px' }}>
                <ScrollOption 
                onToggleDarkMode={handleToggleDarkMode} 
                darkMode={darkMode}
                textColor = {darkMode ? 'white' : undefined}
                iconColor = {darkMode ? 'white' : undefined}
                />
              </div>
            </HalfBackground>

            <BottomNav />
          </GradientBackgroundFull>
        </div>
    );
}

export default Profile;
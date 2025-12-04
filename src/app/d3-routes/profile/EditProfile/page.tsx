'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull';
import { HalfBackground } from '@/app/components/ui/backgrounds/HalfBackground';
import { ProfileHeader } from '@/app/components/ui/profile/header';
import { ProfileForm } from '@/app/components/ui/profile/profileForm';
import User from '@/app/components/ui/profile/User/user';

export default function EditProfilePage() {
  const router = useRouter();
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const passwordDisplay = isPasswordHidden ? '***********' : '12345678';
  const passwordIcon = isPasswordHidden
    ? '/profile/ComponentIcon/Hide.svg'
    : '/profile/ComponentIcon/Show.svg';

  return (
    <GradientBackgroundFull>
      <div className="w-full px-4 sm:px-8 mt-6 sm:mt-6 flex justify-center">
        <ProfileHeader title="Edit Profile" onBack={() => router.push('/profile/MainProfile')} />
      </div>

      <div>

        <div>
          <User showBio={false} />
        </div>

        <HalfBackground topPosition="180px">
          <div className="mt-16 w-full h-full overflow-y-auto px-4 sm:px-6" style={{ maxHeight: 'calc(100vh - 230px)' }}>
            <ProfileForm
              passwordDisplay={passwordDisplay}
              passwordIcon={passwordIcon}
              onTogglePassword={() => setIsPasswordHidden((prev) => !prev)}
              onSave={() => router.push('/profile/MainProfile')}
            />
          </div>
        </HalfBackground>
      </div>
    </GradientBackgroundFull>
  );
}


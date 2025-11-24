'use client';

import { useRouter } from 'next/navigation';
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull';
import { HalfBackground } from '@/app/components/ui/backgrounds/HalfBackground';
import { ProfileHeader } from '@/app/components/ui/profile/header';
import { ProfileInput } from '@/app/components/ui/profile/input';
import { ActionButton } from '@/app/components/ui/profile/actionbtn';
import { BottomNav } from '@/app/components/Layout/BottomNav';

export default function EditCompanyPage() {
  const router = useRouter();

  return (
    <GradientBackgroundFull>
      <div className="p-8 mt-8 flex justify-center">
        <ProfileHeader title="Edit Company" onBack={() => router.push('/profile/MainProfile')} />
      </div>

      <HalfBackground topPosition="140px">
        <div className="w-full flex justify-center px-4">
          <div className="w-full max-w-[402px] px-2 py-10 space-y-6">
              <div className="flex flex-col space-y-6 ml-6" style={{ width: '368px' }}>
              <ProfileInput
                title="Company Name"
                input="BCIT Company"
                icon="/profile/ComponentIcon/Search.svg"
              />
              <ProfileInput title="Employee ID" input="A123458888" />
            </div>

            <div className="pt-2 flex justify-center">
              <ActionButton text="Save" onClick={() => router.push('/profile/MainProfile')} />
            </div>
          </div>
        </div>

        <BottomNav />
      </HalfBackground>
    </GradientBackgroundFull>
  );
}


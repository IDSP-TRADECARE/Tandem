'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull';
import { HalfBackground } from '@/app/components/ui/backgrounds/HalfBackground';
import { ProfileHeader } from '@/app/components/ui/profile/header';
import { ProfileInput } from '@/app/components/ui/profile/input';
import { ActionButton } from '@/app/components/ui/profile/actionbtn';
import { BottomNav } from '@/app/components/Layout/BottomNav';
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
      <div className="p-8 mt-8 flex justify-center">
        <ProfileHeader title="Edit Profile" onBack={() => router.push('/profile/MainProfile')} />
      </div>

      <div className="flex justify-center relative z-30 mt-[-20px] mb-[-40px]">
        <User showBio={false} />
      </div>

      <HalfBackground topPosition="180px">
        <div className="w-full flex justify-center px-4">
          <div className="w-full max-w-[402px] px-2 py-10 space-y-6">
            <div className="flex flex-col space-y-6 ml-6" style={{ width: '368px', marginTop: '100px' }}>
              <ProfileInput title="Name" input="Jane Doe" />

              <ProfileInput title="Bio" input="Hi ! I’m Jane, a woodworker in Burnaby. " />

              <ProfileInput title="Email Address" input="Tandem2025@gmail.com" />

            <div className="flex flex-col">
              <span
                style={{
                  fontFamily: 'Alan Sans',
                  fontSize: '20px',
                  fontWeight: 500,
                }}
                className="text-black mb-2"
              >
                Password
              </span>
              <div
                style={{
                  width: '335px',
                  borderBottom: '1px solid #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Omnes',
                    fontSize: '16px',
                    fontWeight: 400,
                  }}
                  className="text-black"
                >
                  {passwordDisplay}
                </span>
                <button
                  onClick={() => setIsPasswordHidden((prev) => !prev)}
                  className="p-1"
                  aria-label="Toggle password visibility"
                >
                  <img src={passwordIcon} alt="Toggle password" width={24} height={24} />
                </button>
              </div>
            </div>

            <ProfileInput title="Phone Number" input="+1 012 345 6789" />  
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


'use client';
import { useRouter } from 'next/navigation';
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull'
import { ProfileHeader } from '@/app/components/ui/profile/header'
import {HalfBackground} from '@/app/components/ui/backgrounds/HalfBackground'
import {ProfileCardCarousel} from '@/app/components/ui/profile/cardCarousel'
import {ActionButton} from '@/app/components/ui/profile/actionbtn'
import {OptionButton} from '@/app/components/ui/profile/optionbtn'
import { BottomNav } from '@/app/components/Layout/BottomNav'

function HelpCentre() {
  const router = useRouter();

  return (
    <GradientBackgroundFull>
        <div className="p-8 space-y-8 mt-0" >
            <ProfileHeader title="Help Centre" onBack={() => router.push('/profile')} />
        </div> 
      <HalfBackground topPosition="140px">
        <div className="p-8 space-y-8 pl-6">
          <h3 className="text-xl font-bold font-alan">Feature Guide</h3>
          <div className="ml-0.5 mr-0.5">
            <ProfileCardCarousel />
          </div>
          <div className="flex flex-col items-start space-y-8">
            <OptionButton
              icon="/profile/ComponentIcon/Privacy.svg"
              text="Privacy & Security"
              onClick={() => router.push('/profile/Privacy')}
            />
            <ActionButton
              className="font-medium font-alan"
              text="Contact Us"
              icon="/profile/ComponentIcon/Text Bubble.svg"
              onClick={() => router.push('/profile/ContactUs')}
            />
          </div>
        </div>
        <BottomNav />
    </HalfBackground>
  </GradientBackgroundFull>
);
}

export default HelpCentre;
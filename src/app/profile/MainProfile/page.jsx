'use client';
import { useRouter } from 'next/navigation';
import { GradientBackgroundFull } from '@/app/components/ui/backgrounds/GradientBackgroundFull'
import { ProfileHeader } from '@/app/components/ui/profile/header'
import {HalfBackground} from '@/app/components/ui/backgrounds/HalfBackground'
import {OptionButton} from '@/app/components/ui/profile/optionbtn'
import { BottomNav } from '@/app/components/Layout/BottomNav'
import { ToggleButton } from '@/app/components/ui/profile/togglebtn'

function MainProfile() {
  const router = useRouter();

  return (
    <GradientBackgroundFull>
        <div className="p-8 space-y-8 mt-8 flex justify-center" >
            <ProfileHeader title="My Profile" showBackButton={false} />
        </div> 
      <HalfBackground topPosition="140px">
        <div className="p-8 space-y-8">
          <div className="flex flex-col items-start space-y-6">
            <OptionButton
              icon="/profile/ComponentIcon/Edit.svg"
              text="Edit Profile"
              onClick={() => router.push('/profile/EditProfile')}
            />

            <OptionButton
              icon="/profile/ComponentIcon/Location.svg"
              text="Location"
              onClick={() => router.push('/profile/Location')}
            />  

            <OptionButton
              icon="/profile/ComponentIcon/Company.svg"
              text="Company"
              onClick={() => router.push('/profile/Company')}
            />

            <OptionButton
              icon="/profile/ComponentIcon/Mode.svg"
              text="Light/Dark Mode"
              rightComponent={<ToggleButton />}
            />

            <OptionButton
              icon="/profile/ComponentIcon/Help.svg"
              text="Help Centre"
              onClick={() => router.push('/profile/HelpCentre')}
            /> 

            <OptionButton
              icon="/profile/ComponentIcon/Logout.svg"
              text="Logout"
              onClick={() => router.push('/profile/Logout')}
            />  
 

          </div>
        </div>
        <BottomNav />
    </HalfBackground>
  </GradientBackgroundFull>
);
}

export default MainProfile;
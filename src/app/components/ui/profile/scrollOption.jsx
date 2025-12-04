'use client';
import { useRouter } from 'next/navigation';
import { OptionButton } from './optionbtn';
import { ToggleButton } from './togglebtn';
import { BottomNav } from '@/app/components/Layout/BottomNav';

export function ScrollOption() {
  const router = useRouter();

  return (
    <div className="w-full px-2 sm:px-4 pt-0 pb-24 space-y-6">
      <div className="flex flex-col space-y-4 w-full px-2 sm:px-0">
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
  );
}

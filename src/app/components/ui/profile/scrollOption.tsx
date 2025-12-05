'use client';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { OptionButton } from './optionbtn';
import { ToggleButton } from './togglebtn';

interface ScrollOptionProps {
  onToggleDarkMode?: () => void;
  darkMode?: boolean;
  textColor?: string;
  iconColor?: string;
}

export function ScrollOption({ onToggleDarkMode, darkMode, textColor, iconColor }: ScrollOptionProps) {
  const router = useRouter();
  const { signOut } = useClerk();

  return (
    <div className="w-full px-2 sm:px-4 pt-0 pb-24 space-y-6">
      <div className="flex flex-col space-y-4 w-full px-2 sm:px-0">
        <OptionButton
          icon="/profile/ComponentIcon/Edit.svg"
          text="Edit Profile"
          onClick={() => router.push('/profile/EditProfile')}
          textColor={textColor}
          iconColor={iconColor}
        />

        <OptionButton
          icon="/profile/ComponentIcon/Location.svg"
          text="Location"
          onClick={() => router.push('/profile/Location')}
          textColor={textColor}
          iconColor={iconColor}
        />  

        <OptionButton
          icon="/profile/ComponentIcon/Company.svg"
          text="Company"
          onClick={() => router.push('/profile/Company')}
          textColor={textColor}
          iconColor={iconColor}
        />

        <OptionButton
          icon="/profile/ComponentIcon/Mode.svg"
          text="Light/Dark Mode"
          rightComponent={
            <ToggleButton 
              defaultChecked={darkMode} 
              onChange={onToggleDarkMode ? () => onToggleDarkMode() : undefined}
            />
          }
          textColor={textColor}
          iconColor={iconColor}
        />

        <OptionButton
          icon="/profile/ComponentIcon/Help.svg"
          text="Help Centre"
          onClick={() => router.push('/profile/HelpCentre')}
          textColor={textColor}
          iconColor={iconColor}
        /> 

        <OptionButton
          icon="/profile/ComponentIcon/Logout.svg"
          text="Logout"
          onClick={() => signOut()}
          textColor={textColor}
          iconColor={iconColor}
        />  
      </div>
    </div>
  );
}

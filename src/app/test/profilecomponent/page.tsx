'use client';
import { OptionButton } from '../../components/ui/profile/optionbtn';
import { ActionButton } from '../../components/ui/profile/actionbtn';
import { ProfileInput } from '../../components/ui/profile/input';
import { ProfileHeader } from '../../components/ui/profile/header';
import { GradientBackgroundFull } from '../../components/ui/backgrounds/GradientBackgroundFull';

export default function ProfileComponentTest() {
  return (
    <GradientBackgroundFull>
      <div className="p-8 space-y-8">
        <ProfileHeader
          title="Edit Profile"
          onBack={() => console.log('Back clicked')}
        />
        
        <OptionButton
          icon="/profile/ComponentIcon/Edit.svg"
          text="Edit Profile"
          onClick={() => console.log('Edit Profile clicked')}
        />
        <br />
        <ActionButton
          text="Save"
          onClick={() => console.log('Logout clicked')}
        />

        <br />
        
        <ProfileInput
          title="Name"
          input="Jane Doe"
        />
      </div>
    </GradientBackgroundFull>
  );
}


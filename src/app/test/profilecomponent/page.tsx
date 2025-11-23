'use client';
import { OptionButton } from '../../components/ui/profile/optionbtn';
import { ActionButton } from '../../components/ui/profile/actionbtn';

export default function ProfileComponentTest() {
  return (
    <div className="p-8">
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
    </div>
  );
}


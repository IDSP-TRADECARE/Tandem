'use client';
import { useState } from 'react';
import { OptionButton } from '../../components/ui/profile/optionbtn';
import { ActionButton } from '../../components/ui/profile/actionbtn';
import { ProfileInput } from '../../components/ui/profile/input';
import { ProfileHeader } from '../../components/ui/profile/header';
import { ProfileCardCarousel } from '../../components/ui/profile/cardCarousel';
import { ToggleButton } from '../../components/ui/profile/togglebtn';
import { GradientBackgroundFull } from '../../components/ui/backgrounds/GradientBackgroundFull';
import { TextBox } from '../../components/ui/profile/textbox';
import { FeedbackPop } from '../../components/ui/profile/feedbackpop';

export default function ProfileComponentTest() {
  const [textValue, setTextValue] = useState('');
  const [open, setOpen] = useState(false);
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

        <ProfileCardCarousel />

        <ToggleButton
          defaultChecked={false}
          onChange={(checked) => console.log('Toggle:', checked)}
        />

        <TextBox
          placeholder="To help us improve, please describe your feedback as detailed as possible"
          value={textValue}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTextValue(e.target.value)}
        />
        <FeedbackPop open={open} onOpenChange={setOpen} />

      </div>
    </GradientBackgroundFull>
    
  );
}


'use client';
import { ProfileInput } from './input';
import { ActionButton } from './actionbtn';
import { BottomNav } from '@/app/components/Layout/BottomNav';

interface ProfileFormProps {
  passwordDisplay: string;
  passwordIcon: string;
  onTogglePassword: () => void;
  onSave: () => void;
}

export function ProfileForm({
  passwordDisplay,
  passwordIcon,
  onTogglePassword,
  onSave,
}: ProfileFormProps) {
  return (
    <div className="w-full px-2 sm:px-4 pt-12 pb-24 space-y-6">
      <div className="flex flex-col space-y-5 w-full mx-auto px-2 sm:px-0">
        <ProfileInput title="Name" input="Jane Doe" />

        <ProfileInput title="Bio" input="Hi ! I’m Jane, a woodworker in Burnaby. " />

        <ProfileInput title="Email Address" input="Tandem2025@gmail.com" />

        <div className="flex flex-col space-y-5">
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
          <div className="w-full border-b border-black flex items-center justify-between pb-2">
            <span className="text-black" style={{ fontFamily: 'Omnes', fontSize: '16px', fontWeight: 400 }}>
              {passwordDisplay}
            </span>
            <button
              onClick={onTogglePassword}
              className="p-1"
              aria-label="Toggle password visibility"
            >
              <img src={passwordIcon} alt="Toggle password" width={24} height={24} />
            </button>
          </div>
          <ProfileInput title="Phone Number" input="+1 012 345 6789" />  

          <div className="pt-4 flex justify-center">
            <ActionButton text="Save" onClick={onSave} />
          </div>
        </div>

        <div className="mt-8">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}


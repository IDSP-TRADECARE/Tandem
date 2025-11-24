'use client';
import { UserBio } from './userbio';
import { UserIcon } from './userIcon';

interface UserProps {
  showBio?: boolean;
}

export default function User({ showBio = true }: UserProps) {
  return (
    <div className="flex flex-col items-center relative" style={{ width: '420px' }}>
      <UserIcon />
      {showBio && (
        <div className="relative -mt-4 z-0">
          <UserBio />
        </div>
      )}
    </div>
  );
}


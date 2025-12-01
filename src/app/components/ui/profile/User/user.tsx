'use client';
import { UserBio } from './userbio';
import { UserIcon } from './userIcon';

interface UserProps {
  showBio?: boolean;
}

export default function User({ showBio = true }: UserProps) {
  return (
    <div className="w-full flex flex-col items-center relative">
      <UserIcon />
      {showBio && (
        <div className="relative -mt-4 z-0 w-full">
          <UserBio />
        </div>
      )}
    </div>
  );
}


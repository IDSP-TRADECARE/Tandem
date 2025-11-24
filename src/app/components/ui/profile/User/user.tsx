'use client';
import { UserBio } from './userbio';
import { UserIcon } from './userIcon';

export default function User() {
  return (
    <div className="flex flex-col items-center relative" style={{ width: '420px' }}>
      <UserIcon />
      <div className="relative -mt-4 z-0">
        <UserBio />
      </div>
    </div>
  );
}


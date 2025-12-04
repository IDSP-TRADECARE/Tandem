'use client';
import { UserBio } from './userbio';
import { UserIcon } from './userIcon';

interface UserProps {
  name: string;
  username: string;
  bio: string;
  profileImage: string;
}

export default function User({ name, username, bio, profileImage }: UserProps) {
  return (
    <div className="w-full flex flex-col items-center relative">
      <UserIcon profileImage={profileImage} name={name} username={username} />
      <div className="relative -mt-4 z-0 w-full">
        <UserBio bio={bio} />
      </div>
    </div>
  );
}


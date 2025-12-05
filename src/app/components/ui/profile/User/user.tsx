'use client';
import { UserBio } from './userbio';
import { UserIcon } from './userIcon';

interface UserProps {
  name: string;
  username: string;
  bio: string;
  profileImage: string;
  onEdit?: () => void;
  uploadingImage?: boolean;
}

export default function User({ name, username, bio, profileImage, onEdit, uploadingImage }: UserProps) {
  return (
    <div className="w-full flex flex-col items-center relative">
      <UserIcon profileImage={profileImage} name={name} username={username} onEdit={onEdit} uploadingImage={uploadingImage}/>
      <div className="relative -mt-4 z-0 w-full">
        <UserBio bio={bio} />
      </div>
    </div>
  );
}


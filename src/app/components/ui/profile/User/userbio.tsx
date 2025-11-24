'use client';
import React from 'react';

interface UserBioProps {
  bio?: string;
  onBioChange?: (bio: string) => void;
}

export function UserBio({ 
  bio = "Hi! I'm Jane, a woodworker in Burnaby. I have a daughter age 6 and a son age 7. Our family needs a nanny sometimes.",
  onBioChange
}: UserBioProps) {
  return (
    <div className="w-full">
      <textarea
        value={bio}
        onChange={(e) => onBioChange?.(e.target.value)}
        className="w-full p-2 rounded-lg bg-white text-black placeholder-neutral-300 border-none resize-none focus:outline-none focus:ring-2 focus:ring-primary-light"
        style={{
          fontFamily: 'Alan Sans',
          fontSize: '12px',
          lineHeight: '18px',
          minHeight: '150px',
          width: '368px',
          padding: '80px 20px 20px 20px',
          marginTop: '-100px',
          zIndex: 0
        }}
        placeholder="Add a bio..."
        readOnly={!onBioChange}
      />
    </div>
  );
}


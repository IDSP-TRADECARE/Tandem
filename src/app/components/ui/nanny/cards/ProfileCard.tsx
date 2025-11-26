'use client';

import React from 'react';
import Image from 'next/image';
import { FaPaperPlane } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

type Kid = { name?: string; age?: string | number };

interface Props {
  id: string;
  name: string;
  avatarUrl?: string | null;
  kids?: Kid[];
  location?: string;
  bio?: string;
  languages?: string[];
  certificates?: string[];
  isHost?: boolean;
  onMessage?: (id: string) => void;
  onBack?: () => void;
}

export default function ProfileCard({
  id,
  name,
  avatarUrl,
  kids = [],
  location,
  bio,
  languages = [],
  certificates = [],
  isHost = false,
  onMessage,
  onBack,
}: Props) {
  const router = useRouter();
  const avatar = avatarUrl ?? '/profile/placeholderAvatar.png';
  const kidsCount = kids.length;
  const ages = kids.map(k => k.age).filter(Boolean).join(', ');

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <button
            onClick={() => (onBack ? onBack() : router.back())}
            className="text-sm text-neutral-600"
            aria-label="Back"
          >
            ← Back
          </button>

          {isHost ? (
            <div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold">Host</div>
          ) : (
            <div />
          )}
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
            <Image src={avatar} alt={`${name} avatar`} width={128} height={128} className="object-cover" />
          </div>

          <h2 className="text-xl font-extrabold mb-2">{name}</h2>

          <div className="text-sm text-neutral-700 mb-3">
            <div>Kids: {kidsCount}</div>
            {ages && <div>Age: {ages}</div>}
          </div>

          {bio && <p className="text-sm text-neutral-700 mb-4">{bio}</p>}

          {location && <div className="text-sm text-neutral-500 mb-2">Location: {location}</div>}

          {languages.length > 0 && (
            <div className="text-sm text-neutral-500 mb-2">Languages: {languages.join(', ')}</div>
          )}

          {certificates.length > 0 && (
            <div className="text-sm text-neutral-500 mb-4">Certificates: {certificates.join(', ')}</div>
          )}

          <div className="mt-4 w-full flex items-center gap-3">
            <button
              onClick={() => onMessage?.(id)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-full font-semibold"
            >
              <FaPaperPlane />
              Message
            </button>

            {isHost ? (
              <button
                onClick={() => router.push('/nanny')}
                className="flex-none px-4 py-2 rounded-full border border-neutral-200 text-neutral-700"
              >
                Manage
              </button>
            ) : (
              <button
                onClick={() => router.push('/nanny')}
                className="flex-none px-4 py-2 rounded-full border border-neutral-200 text-neutral-700"
              >
                See shares
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
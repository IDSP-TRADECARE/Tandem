'use client';

import React from 'react';
import Image from 'next/image';
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa';

interface Props {
  id: string;
  name: string;
  avatarUrl?: string | null;
  kidsCount?: number;
  note?: string;
  createdAt?: string;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onSeeMore?: (id: string) => void;
}

export default function RequestMemberCard({
  id,
  name,
  avatarUrl,
  onAccept,
  onReject,
  onSeeMore,
}: Props) {
  const avatar = avatarUrl ?? '/profile/placeholderAvatar.png';

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm flex items-center gap-4 p-4">
      {/* avatar */}
      <div className="flex-none">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-100">
          <Image src={avatar} alt={`${name} avatar`} width={56} height={56} className="object-cover" />
        </div>
      </div>

      {/* name + see more */}
      <div className="flex-1 min-w-0">
        <div className="text-lg font-extrabold text-neutral-900 leading-tight truncate">
          {name}
        </div>

        <div className="mt-2">
          <button
            onClick={() => onSeeMore?.(id)}
            className="text-sm text-blue-600 underline"
            aria-label={`See more about ${name}`}
          >
            See more
          </button>
        </div>
      </div>

      {/* actions */}
      <div className="flex-none flex items-center gap-3">
        <button
          onClick={() => onReject?.(id)}
          aria-label={`Reject ${name}`}
          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none"
        >
          <FaTimesCircle className="w-5 h-5" />
        </button>

        <button
          onClick={() => onAccept?.(id)}
          aria-label={`Accept ${name}`}
          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none"
        >
          <FaCheckCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
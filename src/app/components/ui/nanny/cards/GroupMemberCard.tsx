// src/app/components/ui/nanny/cards/GroupMemberCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { HiOutlineChevronRight } from 'react-icons/hi';

interface Props {
  id: string;
  name: string;
  avatarUrl?: string | null;
  kidsCount?: number;
  kidAges?: string;
  onSeeMore?: (id: string) => void;
  compact?: boolean;
}

export default function GroupMemberCard({
  id,
  name,
  avatarUrl,
  kidsCount,
  kidAges,
  onSeeMore,
  compact = false,
}: Props) {
  const avatar = avatarUrl ?? '/profile/placeholderAvatar.png';

  return (
    <div
      className={`w-full flex items-center gap-4 ${compact ? 'py-2' : 'py-3'} px-0`}
      role="group"
      aria-label={`${name} member row`}
    >
      <div className="flex-none">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100">
          <Image src={avatar} alt={`${name} avatar`} width={48} height={48} className="object-cover" />
        </div>
      </div>

      <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
        <div className="truncate">
          <div className="font-semibold text-neutral-900 text-base truncate">{name}</div>
        </div>

        {/* always-visible kids/ages (no hidden/md-only) */}
        <div className="flex-none ml-4 flex items-center gap-6 text-sm text-neutral-700">
          <div>{kidsCount ?? 1} {kidsCount === 1 ? 'kid' : 'kids'}</div>
          {kidAges && <div>{kidAges}</div>}
        </div>

        <div className="ml-4 flex-none">
          <button
            onClick={() => onSeeMore?.(id)}
            className="flex items-center text-blue-600 hover:underline focus:outline-none"
            aria-label={`See more about ${name}`}
          >
            <span className="mr-1 text-sm">See more</span>
            <HiOutlineChevronRight className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
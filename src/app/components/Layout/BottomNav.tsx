'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface BottomNavProps {
  onUploadClick?: () => void;
}

export function BottomNav({ onUploadClick }: BottomNavProps) {
  const pathname = usePathname();

  const isActive = useCallback(
  (path: string) => pathname === path,
  [pathname]
);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6">
      <div className="bg-[#1e3a5f] rounded-full shadow-2xl px-8 py-4 relative">
        <div className="flex items-center justify-around">
          {/* Home */}
          <Link href="/" className="flex flex-col items-center gap-2 flex-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isActive('/') ? 'bg-white' : 'bg-transparent'
              }`}
            >
              <svg
                className={`w-6 h-6 ${
                  isActive('/') ? 'text-[#1e3a5f]' : 'text-white'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3"
                />
              </svg>
            </div>
            <span className="text-xs text-white font-medium">Home</span>
          </Link>

          {/* Calendar */}
          <Link href="/calendar" className="flex flex-col items-center gap-2 flex-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isActive('/calendar') ? 'bg-white' : 'bg-transparent'
              }`}
            >
              <svg
                className={`w-6 h-6 ${
                  isActive('/calendar') ? 'text-[#1e3a5f]' : 'text-white'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-xs text-white font-medium">Calendar</span>
          </Link>

          {/* Upload */}
          <button
            onClick={onUploadClick}
            className="flex flex-col items-center gap-2 flex-1"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isActive('/upload') ? 'bg-white' : 'bg-transparent'
              }`}
            >
              <svg
                className={`w-6 h-6 ${
                  isActive('/upload') ? 'text-[#1e3a5f]' : 'text-white'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span className="text-xs text-white font-medium">Upload</span>
          </button>

          {/* Profile */}
          <Link href="/profile" className="flex flex-col items-center gap-2 flex-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isActive('/profile') ? 'bg-white' : 'bg-transparent'
              }`}
            >
              <svg
                className={`w-6 h-6 ${
                  isActive('/profile') ? 'text-[#1e3a5f]' : 'text-white'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-xs text-white font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

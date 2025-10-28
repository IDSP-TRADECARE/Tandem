'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavProps {
  onUploadClick?: () => void;
}

export function BottomNav({ onUploadClick }: BottomNavProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      // Homepage is the schedule page
      return pathname === '/';
    } 
    return pathname === path;
  };

  // Check if we're on the upload page
  const isUploadPage = pathname === '/schedule/upload';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6">
      <div className="bg-[#3d5a80] rounded-full shadow-2xl px-6 py-5 relative">
        <div className="flex items-center justify-around">
          {/* Schedule */}
          <Link href="/" className="flex flex-col items-center gap-2 flex-1 focus:outline-none">
            <svg
              className={`w-7 h-7 ${
                isActive('/') ? 'text-white' : 'text-white/70'
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className={`text-xs font-medium ${
              isActive('/') ? 'text-white' : 'text-white/70'
            }`}>
              Schedule
            </span>
          </Link>

          {/* Upload */}
          <Link href="/schedule/upload" className="flex flex-col items-center gap-2 flex-1 focus:outline-none">
            <svg
              className={`w-7 h-7 ${
                isUploadPage ? 'text-white' : 'text-white/70'
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
            <span className={`text-xs font-medium ${
              isUploadPage ? 'text-white' : 'text-white/70'
            }`}>
              Upload
            </span>
          </Link>

          {/* Nanny Share */}
          <Link href="/nanny" className="flex flex-col items-center gap-2 flex-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isActive('/nanny') ? 'bg-white' : 'bg-transparent'
              }`}
            >
              <svg
                className={`w-6 h-6 ${
                  isActive('/nanny') ? 'text-[#1e3a5f]' : 'text-white'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <span className="text-xs text-white font-medium">Nanny</span>
          </Link>

          {/* Profile */}
          <Link href="/profile" className="flex flex-col items-center gap-2 flex-1 focus:outline-none">
            <svg
              className={`w-7 h-7 ${
                isActive('/profile') ? 'text-white' : 'text-white/70'
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className={`text-xs font-medium ${
              isActive('/profile') ? 'text-white' : 'text-white/70'
            }`}>
              Profile
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
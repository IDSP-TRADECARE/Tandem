'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavProps {
  onUploadClick?: () => void;
}

export function BottomNav({ onUploadClick }: BottomNavProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1e3a5f] shadow-lg z-50">
      <div className="relative px-6 pt-6 pb-8">
        <div className="flex items-center justify-around relative">
          {/* Home */}
          <Link href="/" className="flex flex-col items-center gap-1 flex-1">
            <svg 
              className={`w-6 h-6 ${isActive('/') ? 'text-[#c8ff00]' : 'text-white'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className={`text-xs font-medium ${isActive('/') ? 'text-[#c8ff00]' : 'text-white'}`}>
              Home
            </span>
          </Link>

          {/* Empty space for center button */}
          <div className="flex-1"></div>

          {/* Upload (Center Button) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-8">
            <button 
              onClick={onUploadClick}
              className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
            >
              <svg className="w-7 h-7 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <p className="text-xs text-white text-center mt-2 font-medium whitespace-nowrap">
              Upload<br/>Schedule
            </p>
          </div>

          {/* Profile */}
          <Link href="/profile" className="flex flex-col items-center gap-1 flex-1">
            <svg 
              className={`w-6 h-6 ${isActive('/profile') ? 'text-[#c8ff00]' : 'text-white'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className={`text-xs font-medium ${isActive('/profile') ? 'text-[#c8ff00]' : 'text-white'}`}>
              Profile
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
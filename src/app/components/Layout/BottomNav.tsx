'use client';

import { usePathname } from 'next/navigation';
import { NavContainer } from '@/app/components/ui/navbar/NavContainer';
import { NavItem } from '@/app/components/ui/navbar/NavItem';
import { NavIcons } from '@/app/components/ui/navbar/NavIcons';
import { NavLabel } from '@/app/components/ui/navbar/NavLabel';
import Image from 'next/image';
import Link from 'next/link';

// Export the mapping
export const navPositions: { [key: string]: number } = {
  '/calendar': 12.5,
  '/schedule/upload': 37.5,
  '/nanny': 62.5,
  '/profile': 87.5,
};

export function BottomNav() {
  const pathname = usePathname();

  const hrefArr = ['/calendar', '/schedule/upload', '/nanny', '/profile'];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname.startsWith('/calendar');
    }
    return pathname.startsWith(path);
  };

  return (
    <nav>
      <NavContainer>
        <NavItem
          href={hrefArr[0]}
          icon={<NavIcons.Schedule />}
          isActive={isActive('/')}
        />
        <NavLabel label="Calendar" href={hrefArr[0]} />

        <NavItem
          href={hrefArr[1]}
          icon={<NavIcons.Upload />}
          isActive={isActive('/schedule/upload')}
        />
        <NavLabel label="Upload" href={hrefArr[1]} />

        <NavItem
          href={hrefArr[2]}
          icon={<NavIcons.NannyShare />}
          isActive={isActive('/nanny')}
        />
        <NavLabel label="Nanny Share" href={hrefArr[2]} />

        <NavItem
          href={hrefArr[3]}
          icon={<NavIcons.Profile />}
          isActive={isActive('/profile')}
        />
        <NavLabel label="Profile" href={hrefArr[3]} />
      </NavContainer>

      {/* Nanny Book Button - only show on /calendar route */}
      {pathname === '/calendar' && (
        <Link 
          href="/nanny/book/form" 
          className="fixed bottom-24 right-6 z-50"
        >
          <Image 
            src="/schedule/nannyBookButton.svg" 
            alt="Book Nanny" 
            width={72} 
            height={72}
          />
        </Link>
      )}
    </nav>
  );
}
'use client';

import { usePathname } from 'next/navigation';
import { NavContainer } from '@/app/components/ui/navbar/NavContainer';
import { NavItem } from '@/app/components/ui/navbar/NavItem';
import { NavIcons } from '@/app/components/ui/navbar/NavIcons';
import { NavLabel } from '@/app/components/ui/navbar/NavLabel';

export function BottomNav() {
  const pathname = usePathname();

const posArr = [12.5, 37.5, 62.5, 87.5];
const hrefArr = ['/calendar', '/schedule/upload', '/nanny', '/profile'];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname.startsWith('/calendar');
    }
    return pathname.startsWith(path);
  };

  return (
    <NavContainer>
      <NavItem
        href={hrefArr[0]}
        icon={<NavIcons.Schedule />}
        isActive={isActive('/')}
      />
      <NavLabel label="Calendar" pos={posArr[0]} href={hrefArr[0]} />

      <NavItem
        href={hrefArr[1]}
        icon={<NavIcons.Upload />}
        isActive={isActive('/schedule/upload')}
      />
      <NavLabel label="Upload" pos={posArr[1]} href={hrefArr[1]} />

      <NavItem
        href={hrefArr[2]}
        icon={<NavIcons.NannyShare />}
        isActive={isActive('/nanny')}
      />
      <NavLabel label="Nanny Share" pos={posArr[2]} href={hrefArr[2]} />

      <NavItem
        href={hrefArr[3]}
        icon={<NavIcons.Profile />}
        isActive={isActive('/profile')}
      />
      <NavLabel label="Profile" pos={posArr[3]} href={hrefArr[3]} />

    </NavContainer>
  );
}
'use client';

import { usePathname } from 'next/navigation';
import { NavContainer } from '@/app/components/ui/navbar/NavContainer';
import { NavItem } from '@/app/components/ui/navbar/NavItem';
import { NavIcons } from '@/app/components/ui/navbar/NavIcons';

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname.startsWith('/calendar');
    }
    return pathname.startsWith(path);
  };

  return (
    <NavContainer>
      <NavItem
        href="/calendar"
        icon={<NavIcons.Schedule />}
        label="Schedule"
        isActive={isActive('/')}
      />

      <NavItem
        href="/schedule/upload"
        icon={<NavIcons.Upload />}
        label="Upload"
        isActive={isActive('/schedule/upload')}
      />

      <NavItem
        href="/nanny"
        icon={<NavIcons.NannyShare />}
        label="Nanny Share"
        isActive={isActive('/nanny')}
      />

      <NavItem
        href="/profile"
        icon={<NavIcons.Profile />}
        label="Profile"
        isActive={isActive('/profile')}
      />
    </NavContainer>
  );
}
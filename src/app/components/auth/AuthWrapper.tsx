'use client';

import { usePathname } from 'next/navigation';
import { AuthGuard } from './AuthGuard';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes that don't require authentication
  const publicRoutes = ['/boarding/features', '/sign-in', '/sign-up'];
  const isPublicRoute = pathname === '/' || publicRoutes.some(route => pathname?.startsWith(route));

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return <AuthGuard>{children}</AuthGuard>;
}
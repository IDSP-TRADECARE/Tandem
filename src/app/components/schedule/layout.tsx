'use client';

import React from 'react';
import { AuthGuard } from '@/app/components/auth/AuthGuard';

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
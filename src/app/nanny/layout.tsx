'use client';

import React from 'react';
import { AuthGuard } from '@/app/components/auth/AuthGuard';

export default function NannyLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
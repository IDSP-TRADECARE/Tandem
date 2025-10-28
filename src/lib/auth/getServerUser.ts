import { getAuth } from '@clerk/nextjs/server';

import { NextRequest } from 'next/server';

export function requireUser(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    const err = new Error('Unauthorized');
    err.name = 'Unauthorized';
    throw err;
  }
  return userId;
}
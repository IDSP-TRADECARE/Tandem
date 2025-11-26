import { auth } from '@clerk/nextjs/server';

/**
 * Return userId or throw.
 */
export async function requireUser() {
  const { userId } = await auth();
  if (!userId) {
    const err = new Error('Unauthorized');
    err.name = 'Unauthorized';
    throw err;
  }
  return userId;
}
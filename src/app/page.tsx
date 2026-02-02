import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getGuestSession } from '@/lib/auth/guestSession';

export default async function HomePage() {
  const { userId } = await auth();
  const guestSession = await getGuestSession();
  
  // If user is authenticated (Clerk OR guest), go to calendar
  if (userId || guestSession) {
    redirect('/calendar');
  } else {
    // Not authenticated at all, show boarding
    redirect('/boarding/features');
  }
}
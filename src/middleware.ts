import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { hasGuestSession } from '@/lib/auth/guestSession';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/auth/guest(.*)',
  '/api/auth/clear-data(.*)',
  '/boarding(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  // Allow public routes
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Check if user has a guest session
  const hasGuest = hasGuestSession(request);
  
  if (hasGuest) {
    // User is a guest, allow access
    return NextResponse.next();
  }

  // Not a guest, require Clerk authentication
  await auth.protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
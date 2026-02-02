# Guest User & Iframe Embedding Implementation

Complete implementation of guest/anonymous user support with iframe embedding capabilities for the Tandem Next.js app.

## Overview

This implementation allows:
1. **Guest Access**: Users can access the app without creating an account via "Continue as Guest"
2. **Iframe Embedding**: The app can be embedded in iframes from SDX24 or other authorized domains
3. **Cross-Origin Sessions**: Guest sessions work in cross-origin iframe contexts using SameSite=None cookies

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Access Flow                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Regular User (Clerk Auth)           Guest User              │
│         │                                  │                 │
│         ▼                                  ▼                 │
│   /sign-in page               /sign-in page                  │
│         │                                  │                 │
│         ▼                                  ▼                 │
│   Clerk SignIn            "Continue as Guest" button         │
│         │                                  │                 │
│         ▼                                  ▼                 │
│   Clerk Auth              POST /api/auth/guest               │
│         │                                  │                 │
│         ▼                                  ▼                 │
│   App Access              Create guest user + session        │
│         │                                  │                 │
│         └──────────────┬───────────────────┘                 │
│                        ▼                                     │
│                  Middleware Check                            │
│              (Clerk Auth OR Guest Session)                   │
│                        │                                     │
│                        ▼                                     │
│                   Full App Access                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Files Modified/Created

### 1. API Routes

#### [src/app/api/auth/guest/route.ts](src/app/api/auth/guest/route.ts)
- **POST**: Creates a guest user and sets session cookies
  - Generates unique guest ID and session ID
  - Creates guest user in database
  - Sets cookies with `SameSite=None` for iframe context
  - Returns session information
- **GET**: Checks if current request has a valid guest session

**Cookie Configuration**:
```typescript
{
  httpOnly: true,      // Prevents JavaScript access
  secure: true,        // HTTPS only (required for SameSite=None)
  sameSite: 'none',    // Allows cross-origin iframe usage
  path: '/',
  maxAge: 604800,      // 7 days
}
```

### 2. Authentication Utilities

#### [src/lib/auth/guestSession.ts](src/lib/auth/guestSession.ts)
Helper functions for guest session management:
- `hasGuestSession(request)` - Check if request has guest session (middleware)
- `getGuestSessionFromRequest(request)` - Get guest session from middleware
- `getGuestSession()` - Get guest session in server components/API routes
- `isGuestUser()` - Check if current user is a guest
- `clearGuestSession()` - Remove guest session cookies

#### [src/lib/auth/getCurrentUser.ts](src/lib/auth/getCurrentUser.ts)
Unified user authentication:
- `getCurrentUser()` - Returns current user (Clerk OR guest)
- `requireUser()` - Enforces authentication (throws if none)
- `isCurrentUserGuest()` - Check if current user is a guest

**Usage Example**:
```typescript
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

export async function GET() {
  const user = await getCurrentUser();
  
  if (user.isGuest) {
    // Handle guest user
    console.log('Guest user:', user.userId);
  } else {
    // Handle authenticated Clerk user
    console.log('Clerk user:', user.clerkUser);
  }
}
```

### 3. Middleware

#### [src/middleware.ts](src/middleware.ts)
Updated to support both Clerk auth AND guest sessions:

```typescript
export default clerkMiddleware(async (auth, request) => {
  // Allow public routes
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Check for guest session
  const hasGuest = hasGuestSession(request);
  if (hasGuest) {
    return NextResponse.next(); // Allow access
  }

  // Require Clerk auth
  await auth.protect();
});
```

**Public Routes**:
- `/sign-in/*` - Sign in page
- `/sign-up/*` - Sign up page
- `/api/webhooks/*` - Webhooks
- `/api/auth/guest/*` - Guest authentication
- `/boarding/*` - Onboarding

### 4. Sign-In Page

#### [src/app/sign-in/[[...sign-in]]/page.tsx](src/app/sign-in/[[...sign-in]]/page.tsx)
Added "Continue as Guest" button:
- Calls `/api/auth/guest` to create session
- Shows loading state during guest creation
- Redirects to main app on success
- Styled to match existing UI

### 5. UI Components

#### [src/app/components/auth/GuestModeIndicator.tsx](src/app/components/auth/GuestModeIndicator.tsx)
Visual indicator for guest mode:
- Displays banner at top of app when in guest mode
- Shows message: "You're using Guest Mode"
- Provides buttons to create account or sign in
- Can be dismissed by user

**Usage in Layout**:
```tsx
import { GuestModeIndicator } from '@/app/components/auth/GuestModeIndicator';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GuestModeIndicator />
        {children}
      </body>
    </html>
  );
}
```

### 6. Configuration

#### [next.config.ts](next.config.ts)
Added headers for iframe embedding:

```typescript
async headers() {
  return [{
    source: '/:path*',
    headers: [
      // CSP - Allow embedding from specific domains
      {
        key: 'Content-Security-Policy',
        value: "frame-ancestors 'self' http://localhost:3000 https://sdx24.com ..."
      },
      // Enable cross-origin credentials
      {
        key: 'Access-Control-Allow-Credentials',
        value: 'true'
      }
    ]
  }];
}
```

**Allowed Domains**:
- `http://localhost:3000` (development)
- `https://localhost:3000` (development)
- `http://localhost:3001` (alternative dev port)
- `https://localhost:3001` (alternative dev port)
- `https://sdx24.com` (production)
- `https://*.sdx24.com` (production subdomains)

## Database Schema

Guest users are stored in the `users` table with:
- `clerkId`: `guest_<timestamp>_<random>` (unique identifier)
- `email`: `guest_<timestamp>_<random>@tandem.guest`
- `firstName`: "Guest"
- `lastName`: "User"
- `isGuest`: `true` (boolean flag)

## Usage

### For End Users

1. **Regular Authentication**:
   - Visit `/sign-in`
   - Sign in with Clerk credentials
   - Full account with persistent data

2. **Guest Mode**:
   - Visit `/sign-in`
   - Click "Continue as Guest"
   - Temporary access without account
   - Can upgrade to full account anytime

### For Developers

#### Check Current User
```typescript
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

// In API route or server component
const user = await getCurrentUser();
console.log(user.userId);      // Clerk ID or guest ID
console.log(user.isGuest);     // true/false
```

#### Require Authentication
```typescript
import { requireUser } from '@/lib/auth/getCurrentUser';

// Throws if no auth
const user = await requireUser();
```

#### Check Guest Status
```typescript
import { isCurrentUserGuest } from '@/lib/auth/getCurrentUser';

if (await isCurrentUserGuest()) {
  // User is in guest mode
  // Maybe show upgrade prompt
}
```

#### Clear Guest Session
```typescript
import { clearGuestSession } from '@/lib/auth/guestSession';

await clearGuestSession();
// Redirect to sign-in
```

### For SDX24 Integration

Embed Tandem in an iframe:

```html
<!-- In SDX24 app -->
<iframe
  src="https://tandem-app.com/sign-in"
  width="100%"
  height="100%"
  style="border: none;"
  allow="clipboard-read; clipboard-write"
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
  title="Tandem App"
></iframe>
```

Users will see the sign-in page with the guest option. Once they click "Continue as Guest", the session cookies will be set and they'll have full access to the app within the iframe.

## Security Considerations

### Cookie Security
- ✅ `HttpOnly`: Prevents XSS attacks
- ✅ `Secure`: HTTPS only (production)
- ✅ `SameSite=None`: Required for cross-origin iframes
- ✅ Short expiration: 7 days
- ✅ Unique session IDs: UUID v4

### Iframe Security
- ✅ CSP `frame-ancestors`: Whitelist specific domains
- ✅ No `X-Frame-Options=DENY`: Allows controlled embedding
- ✅ Credentials isolation: Guest sessions don't access other users' data

### Guest User Limitations
Consider implementing:
- [ ] Rate limiting for guest user creation
- [ ] Session cleanup (delete old guest users)
- [ ] Feature restrictions for guests (optional)
- [ ] Data persistence warnings
- [ ] Upgrade prompts

## Testing

### Local Testing

1. **Test Guest Login**:
   ```bash
   npm run dev
   # Visit http://localhost:3000/sign-in
   # Click "Continue as Guest"
   # Should redirect to main app
   ```

2. **Test Iframe Embedding**:
   - Create a test HTML file:
   ```html
   <!DOCTYPE html>
   <html>
   <body>
     <iframe src="http://localhost:3000/sign-in" width="800" height="600"></iframe>
   </body>
   </html>
   ```
   - Open in browser (use a different port or domain)
   - Guest login should work in iframe

3. **Check Cookies**:
   - Open DevTools → Application → Cookies
   - Look for `guest_session` and `guest_user_id`
   - Verify `SameSite=None` and `Secure=true`

### Production Testing

1. Ensure HTTPS is enabled (required for SameSite=None)
2. Test from SDX24 production domain
3. Verify CSP headers in Network tab
4. Check cookie behavior in incognito/private mode

## Troubleshooting

### Cookies Not Set in Iframe

**Symptoms**: Guest login works on direct access but not in iframe

**Solutions**:
1. ✅ Verify HTTPS (SameSite=None requires secure context)
2. ✅ Check browser settings (some browsers block third-party cookies)
3. ✅ Verify parent domain is in CSP `frame-ancestors`
4. ✅ Check DevTools Console for cookie warnings

### Safari Cookie Issues

**Issue**: Safari blocks third-party cookies by default

**Solutions**:
- Ask users to allow cross-site tracking for your domain
- Consider alternative auth methods (postMessage, query params)
- Use subdomain approach if possible (e.g., app.tandem.com embedded in portal.tandem.com)

### Guest Users Can't Access Features

**Issue**: Guest users redirected to sign-in

**Solutions**:
1. Check middleware allows guest sessions
2. Verify `hasGuestSession()` is working
3. Check API routes don't explicitly require Clerk auth
4. Review `getCurrentUser()` usage

### CSP Blocking Iframe

**Symptoms**: "Refused to frame" error in console

**Solutions**:
1. Add parent domain to `frame-ancestors` in [next.config.ts](next.config.ts)
2. Clear browser cache
3. Verify CSP headers in Network tab (Headers)

## Migration Guide

If you have existing code that uses Clerk auth, update it to support guests:

### Before
```typescript
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  
  // Use userId...
}
```

### After
```typescript
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

export async function GET() {
  const user = await getCurrentUser();
  
  if (user.isGuest) {
    // Handle guest-specific logic
  }
  
  // Use user.userId (works for both Clerk and guest)
}
```

## Monitoring & Analytics

Consider tracking:
- Guest user creation rate
- Guest → registered user conversion rate
- Guest session duration
- Features used by guest users
- Iframe vs direct access ratios

## Future Enhancements

Potential improvements:
1. **Guest Data Migration**: Allow guests to upgrade and keep their data
2. **Feature Gates**: Limit certain features for guest users
3. **Session Extension**: Allow guests to extend session before expiry
4. **Guest Analytics**: Track guest behavior for conversion optimization
5. **Multi-App SSO**: Share guest sessions across multiple apps
6. **Persistent Guest Storage**: Optional local storage for guest data

## Environment Variables

Required (should already be set):
```env
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
DATABASE_URL=postgresql://...
```

Optional:
```env
# Custom session duration (seconds)
GUEST_SESSION_DURATION=604800  # 7 days

# Enable/disable guest mode
ENABLE_GUEST_MODE=true
```

## Support

For issues:
1. Check browser console for errors
2. Verify cookies in DevTools
3. Check Network tab for API responses
4. Review middleware logs
5. Test in different browsers

## References

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [MDN: SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [CSP frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)

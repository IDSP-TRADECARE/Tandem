# 🚀 Quick Start - Guest Mode & Iframe Embedding

This guide helps you quickly test and deploy the guest user and iframe embedding features.

## ✨ What's New

1. **Guest Mode**: Users can access the app without creating an account
2. **Iframe Embedding**: App can be embedded from SDX24 and other authorized domains
3. **Cross-Origin Sessions**: Works seamlessly in iframe contexts

## 🎯 Quick Test (Local)

### Option 1: Direct Access
```bash
npm run dev
# Open http://localhost:3000/sign-in
# Click "Continue as Guest"
```

### Option 2: Iframe Test
```bash
npm run dev
# Open http://localhost:3000/guest-iframe-test.html
# Click "Continue as Guest" in the iframe
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| [src/app/api/auth/guest/route.ts](src/app/api/auth/guest/route.ts) | Guest session API endpoint |
| [src/lib/auth/guestSession.ts](src/lib/auth/guestSession.ts) | Guest session utilities |
| [src/lib/auth/getCurrentUser.ts](src/lib/auth/getCurrentUser.ts) | Unified auth helper (Clerk + Guest) |
| [src/middleware.ts](src/middleware.ts) | Auth middleware (supports guests) |
| [src/app/sign-in/[[...sign-in]]/page.tsx](src/app/sign-in/[[...sign-in]]/page.tsx) | Sign-in page with guest button |
| [next.config.ts](next.config.ts) | Iframe headers configuration |

## 🔧 Configuration

### Add Guest Indicator (Optional)

Add to your main layout ([src/app/layout.tsx](src/app/layout.tsx)):

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

### Update Allowed Domains

Edit [next.config.ts](next.config.ts) to add more domains:

```typescript
'frame-ancestors': [
  "'self'",
  'https://your-domain.com',
  'https://*.your-domain.com',
]
```

## 💻 Usage in Code

### Get Current User (Clerk or Guest)
```typescript
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

export async function GET() {
  const user = await getCurrentUser();
  
  console.log(user.userId);   // Clerk ID or guest_xxx
  console.log(user.isGuest);  // true/false
}
```

### Check if Guest
```typescript
import { isCurrentUserGuest } from '@/lib/auth/getCurrentUser';

if (await isCurrentUserGuest()) {
  // Show upgrade prompt
}
```

## 🌐 Production Deployment

### Pre-Deploy Checklist

- [ ] Update CSP domains in [next.config.ts](next.config.ts)
- [ ] Ensure HTTPS is enabled (required for SameSite=None cookies)
- [ ] Test guest login on production
- [ ] Test iframe embedding from SDX24
- [ ] Verify cookies work in different browsers

### Environment Variables

Required (should already be set):
```env
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
DATABASE_URL=postgresql://...
```

## 🔍 Testing

### Check Guest Session
```bash
# After clicking "Continue as Guest"
# Open DevTools → Application → Cookies
# Look for:
# - guest_session (UUID)
# - guest_user_id (guest_xxx)
```

### Test Iframe Embedding
```html
<iframe src="https://your-tandem-app.com/sign-in" />
```

### Verify Headers
```bash
curl -I https://your-tandem-app.com
# Check for:
# Content-Security-Policy: frame-ancestors ...
# Access-Control-Allow-Credentials: true
```

## 🐛 Troubleshooting

### Guest button not working
- Check browser console for errors
- Verify `/api/auth/guest` returns 200
- Check database connection

### Cookies not set in iframe
- Ensure HTTPS (required for SameSite=None)
- Check parent domain in CSP
- Try different browser (Safari has strict policies)

### "Refused to frame" error
- Add parent domain to `frame-ancestors` in [next.config.ts](next.config.ts)
- Clear browser cache

## 📚 Documentation

- **Full Guide**: [GUEST_MODE_GUIDE.md](GUEST_MODE_GUIDE.md)
- **Iframe Embedding**: [IFRAME_EMBEDDING.md](IFRAME_EMBEDDING.md) (previous implementation)

## 🎨 UI Customization

### Customize Guest Button

Edit [src/app/sign-in/[[...sign-in]]/page.tsx](src/app/sign-in/[[...sign-in]]/page.tsx):

```tsx
<button className="your-custom-classes">
  Continue as Guest
</button>
```

### Customize Guest Banner

Edit [src/app/components/auth/GuestModeIndicator.tsx](src/app/components/auth/GuestModeIndicator.tsx)

## 📊 Analytics (Optional)

Track guest conversions:

```typescript
// In your analytics
if (user.isGuest) {
  analytics.track('guest_session_created');
}
```

## 🔐 Security Notes

- ✅ Guest sessions expire after 7 days
- ✅ HttpOnly cookies prevent XSS
- ✅ Secure flag requires HTTPS
- ✅ SameSite=None allows iframe usage
- ✅ CSP restricts embedding domains

## 🤝 Support

Need help? Check:
1. [GUEST_MODE_GUIDE.md](GUEST_MODE_GUIDE.md) - Complete documentation
2. Browser DevTools console
3. Network tab for API responses
4. Application tab for cookies

## ✅ Success Criteria

Your implementation works if:
- [x] "Continue as Guest" button appears on sign-in page
- [x] Clicking it creates a guest session and redirects to app
- [x] Guest users can access all routes
- [x] App loads in iframe from allowed domains
- [x] Guest sessions persist across page refreshes
- [x] Cookies have SameSite=None and Secure flags

---

**Ready to deploy!** 🎉

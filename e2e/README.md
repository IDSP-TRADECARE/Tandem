# E2E Testing with Playwright

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/guest-user.spec.ts
```

## Test Coverage

### Guest User Authentication (`e2e/guest-user.spec.ts`)

**Authentication Flow:**
- ✅ Create guest session via "Continue as Guest Preview" button
- ✅ Verify redirect to app after guest login
- ✅ Access profile page as guest user
- ✅ See "Clear All Data & Logout" button

**Schedule Features:**
- ✅ Access schedule upload page
- ✅ Voice input interface availability

**Nanny Sharing:**
- ✅ Access nanny sharing page
- ✅ Access nanny share creation page

**Session Management:**
- ✅ Clear data and logout functionality
- ✅ Session persistence across page reloads
- ✅ Cookie cleanup after logout

**Feature Parity:**
- ✅ Guest users see same navigation as Clerk users

## Test Environment

- **Framework:** Playwright
- **Browser:** Chromium
- **Base URL:** http://localhost:3000
- **Dev Server:** Automatically started before tests

## Writing New Tests

Tests are located in the `/e2e` directory. Follow this structure:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Test implementation
  });
});
```

## Debugging Tips

1. **View test results:** After running tests, open `playwright-report/index.html`
2. **Screenshots:** Automatically captured on test failure
3. **Traces:** Available for failed tests in the HTML report
4. **Debug mode:** Use `npm run test:e2e:debug` to step through tests

## CI/CD Integration

Tests can be run in CI with:
```bash
npm run test:e2e
```

Configure `CI=true` environment variable for optimized CI behavior.

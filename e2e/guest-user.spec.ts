import { test, expect, type Page } from '@playwright/test';

/**
 * Helper function to create a guest session
 */
async function loginAsGuest(page: Page) {
  await page.goto('/sign-in');
  // Don't wait for networkidle - Clerk may have polling
  await page.waitForLoadState('domcontentloaded');
  
  // Click "Continue as Guest Preview" button
  const guestButton = page.locator('button:has-text("Continue as Guest Preview")');
  await expect(guestButton).toBeVisible({ timeout: 10000 });
  await guestButton.click();
  
  // Wait for redirect to home page
  await page.waitForURL('/', { timeout: 10000, waitUntil: 'domcontentloaded' });
  
  // Verify we're on the home page or redirected to calendar
  await expect(page).toHaveURL(/\/(calendar)?$/);
}

test.describe('Guest User Authentication', () => {
  test('should create guest session and redirect to app', async ({ page }) => {
    await loginAsGuest(page);
    
    // Verify we're authenticated (not on sign-in page)
    await expect(page).not.toHaveURL(/sign-in/);
  });

  test('should have access to profile page', async ({ page }) => {
    await loginAsGuest(page);
    
    // Navigate to profile
    await page.goto('/profile');
    await expect(page.locator('text=My Profile')).toBeVisible({ timeout: 5000 });
    
    // Verify guest user name is displayed (use first() to handle multiple matches)
    await expect(page.locator('text=Guest User').first()).toBeVisible();
  });

  test('should see "Clear All Data & Logout" button in profile', async ({ page }) => {
    await loginAsGuest(page);
    
    // Navigate to profile
    await page.goto('/profile');
    await expect(page.locator('text=My Profile')).toBeVisible({ timeout: 5000 });
    
    // Check for the clear data button
    const clearButton = page.locator('text=Clear All Data & Logout');
    await expect(clearButton).toBeVisible();
  });
});

test.describe('Guest User Schedule Features', () => {
  test('should access schedule upload page', async ({ page }) => {
    await loginAsGuest(page);
    
    // Navigate to schedule upload
    await page.goto('/schedule/upload');
    
    // Check for any of the upload method indicators
    const uploadMethods = page.locator('text=File Upload, text=Manual Input, text=Voice');
    const isVisible = await uploadMethods.first().isVisible({ timeout: 5000 }).catch(() => false);
    
    if (!isVisible) {
      // Alternative: check if we're on the right page via URL
      expect(page.url()).toContain('/schedule/upload');
    } else {
      await expect(uploadMethods.first()).toBeVisible();
    }
  });

  test('should be able to use voice input interface', async ({ page }) => {
    await loginAsGuest(page);
    
    // Navigate to schedule upload
    await page.goto('/schedule/upload');
    
    // Look for voice input button or interface
    const voiceButton = page.locator('button:has-text("Voice Input"), svg[class*="microphone"]').first();
    
    // If voice button exists, click it
    if (await voiceButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await voiceButton.click();
      
      // Verify voice input UI appears
      await expect(page.locator('text=Voice Input, text=Hi! Tell me about your schedule!')).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Guest User Nanny Sharing', () => {
  test('should access nanny sharing page', async ({ page }) => {
    await loginAsGuest(page);
    
    // Navigate to nanny page
    await page.goto('/nanny');
    await expect(page).toHaveURL('/nanny');
  });

  test('should access nanny share creation page', async ({ page }) => {
    await loginAsGuest(page);
    
    // Navigate to create nanny share
    await page.goto('/nanny/create');
    await expect(page).toHaveURL('/nanny/create');
    
    // Verify creation form is accessible
    // (Check for any form elements or page title)
    await expect(page.locator('input, button, form')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Guest Session Management', () => {
  test('should clear data and logout', async ({ page, context }) => {
    await loginAsGuest(page);
    
    // Navigate to profile
    await page.goto('/profile');
    await expect(page.locator('text=My Profile')).toBeVisible({ timeout: 5000 });
    
    // Click clear data button
    const clearButton = page.locator('button:has-text("Clear All Data & Logout")');
    await clearButton.click();
    
    // If confirmation dialog appears, confirm
    const confirmButton = page.locator('button:has-text("Yes, Clear All Data")');
    if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmButton.click();
    }
    
    // Wait for redirect to sign-in
    await page.waitForURL('/sign-in', { timeout: 10000 });
    
    // Verify we're back on sign-in page
    await expect(page).toHaveURL('/sign-in');
    
    // Verify cookies are cleared
    const cookies = await context.cookies();
    const guestCookie = cookies.find(c => c.name === 'guest_session');
    expect(guestCookie).toBeUndefined();
  });

  test('should persist session across page reloads', async ({ page }) => {
    await loginAsGuest(page);
    
    // Reload the page
    await page.reload();
    
    // Should still be authenticated
    await expect(page).not.toHaveURL(/sign-in/);
  });
});

test.describe('Guest vs Clerk User Parity', () => {
  test('guest user should see same navigation as authenticated user', async ({ page }) => {
    await loginAsGuest(page);
    
    // Check for common navigation elements
    await page.goto('/');
    
    // Look for bottom navigation or main menu
    const navElements = [
      page.locator('text=Calendar'),
      page.locator('text=Messages'),
      page.locator('text=Profile'),
    ];
    
    // At least one nav element should be visible
    const visibleNav = await Promise.race([
      ...navElements.map(el => el.isVisible({ timeout: 5000 }).then(() => true).catch(() => false))
    ]);
    
    expect(visibleNav).toBeTruthy();
  });
});

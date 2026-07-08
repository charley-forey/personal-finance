import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('protected app route requires authentication', async ({ page }) => {
    await page.goto('/app');
    await expect(page).toHaveURL(/\/(login|sign-in)/);
  });

  test('login page offers path to the dashboard', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign in|continue to app/i })).toBeVisible();
  });
});

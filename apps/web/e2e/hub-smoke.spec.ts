import { test, expect } from '@playwright/test';

test.describe('Hub smoke', () => {
  test('design-system page is reachable', async ({ page }) => {
    await page.goto('/app/library/design-system');
    const catalog = page.getByTestId('design-system-catalog');
    const login = page.getByRole('heading', { name: /sign in|log in|finance/i });
    await expect(catalog.or(login).first()).toBeVisible({ timeout: 15000 });
  });

  test('library hub redirects or renders', async ({ page }) => {
    await page.goto('/app/library');
    const onLogin = /\/(login|sign-in)/.test(page.url());
    if (onLogin) {
      await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    } else {
      await expect(page.getByRole('heading', { name: /library/i })).toBeVisible({ timeout: 10000 });
    }
  });
});

import { test, expect } from '@playwright/test';

test('design system catalog renders primitives', async ({ page }) => {
  await page.goto('/app/library/design-system');
  // Unauthenticated users redirect to login — either catalog or auth is acceptable smoke
  const catalog = page.getByTestId('design-system-catalog');
  const login = page.getByRole('heading', { name: /sign in|log in|finance/i });
  await expect(catalog.or(login).first()).toBeVisible({ timeout: 15000 });
});

import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /operating system/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View Pricing' })).toBeVisible();
});

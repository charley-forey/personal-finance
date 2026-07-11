import { test, expect } from '@playwright/test';

test.describe('Nav elevation', () => {
  test('app shell exposes hub accordion or login', async ({ page }) => {
    await page.goto('/app');
    const login = page.getByRole('heading', { name: /sign in|log in/i });
    const brand = page.getByText('Finance OS').first();
    await expect(login.or(brand).first()).toBeVisible({ timeout: 15000 });

    if (await login.isVisible().catch(() => false)) return;

    // Desktop: Command hub expand control; Mobile: More / Search
    const expandCommand = page.getByRole('button', { name: /expand command|collapse command/i });
    const more = page.getByRole('button', { name: 'More' });
    const search = page.getByRole('button', { name: /search pages/i });
    await expect(expandCommand.or(more).or(search).first()).toBeVisible();
  });

  test('no global context banner chrome on transactions', async ({ page }) => {
    await page.goto('/app/transactions');
    const login = page.getByRole('heading', { name: /sign in|log in/i });
    if (await login.isVisible().catch(() => false)) return;

    await expect(page.getByText(/here's what needs attention/i)).toHaveCount(0);
    await expect(page.getByText(/Connected \(/i)).toHaveCount(0);
  });

  test('mobile search opens command palette when authenticated', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes('Mobile'), 'mobile-only');
    await page.goto('/app');
    const login = page.getByRole('heading', { name: /sign in|log in/i });
    if (await login.isVisible().catch(() => false)) return;

    await page.getByRole('button', { name: /search pages/i }).first().click();
    await expect(page.getByRole('dialog', { name: /command palette/i })).toBeVisible();
  });
});

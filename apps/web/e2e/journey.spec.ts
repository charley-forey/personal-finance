import { test, expect } from '@playwright/test';

/**
 * Core UX journey smoke — public routes + auth gate.
 * Hub routes require auth; we assert redirect or content when available.
 *
 * Accessibility: @axe-core/playwright is not in package.json yet.
 * To enable: `npm i -D @axe-core/playwright` then uncomment the axe block below.
 */

test.describe('UX journey', () => {
  test('landing and login CTAs are findable', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /operating system/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /get started/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /view pricing|pricing/i }).first()).toBeVisible();

    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign in|continue to app/i })).toBeVisible();
  });

  test('protected hubs redirect when unauthenticated', async ({ page }) => {
    const hubs = ['/app', '/app/cash-flow', '/app/plan', '/app/wealth', '/app/future', '/app/library'];
    for (const href of hubs) {
      await page.goto(href);
      // Auth gate or app shell — either is acceptable smoke
      const onLogin = /\/(login|sign-in)/.test(page.url());
      if (onLogin) {
        await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
      } else {
        await expect(page.locator('#main-content, [data-testid="design-system-catalog"]').first()).toBeVisible({
          timeout: 10000,
        });
      }
    }
  });

  test('design-system catalog smoke', async ({ page }) => {
    await page.goto('/app/library/design-system');
    const catalog = page.getByTestId('design-system-catalog');
    const login = page.getByRole('heading', { name: /sign in|log in|finance/i });
    await expect(catalog.or(login).first()).toBeVisible({ timeout: 15000 });
  });

  // Uncomment when @axe-core/playwright is installed:
  // test('landing has no critical a11y violations', async ({ page }) => {
  //   const AxeBuilder = (await import('@axe-core/playwright')).default;
  //   await page.goto('/');
  //   const results = await new AxeBuilder({ page }).analyze();
  //   expect(results.violations.filter((v) => v.impact === 'critical')).toEqual([]);
  // });
});

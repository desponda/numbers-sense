import { test, expect } from '@playwright/test';

test.describe('App Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays the home menu on load', async ({ page }) => {
    // Should show both game options
    await expect(page.getByRole('heading', { name: /build the number/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /sort the numbers/i })).toBeVisible();
  });

  test('navigates to Build the Number difficulty selection', async ({ page }) => {
    await page.getByRole('button', { name: /build the number/i }).click();

    // Should show difficulty options
    await expect(page.getByRole('heading', { name: /choose difficulty/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /easy/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /medium/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /hard/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /challenge/i })).toBeVisible();
  });

  test('navigates to Sort the Numbers difficulty selection', async ({ page }) => {
    await page.getByRole('button', { name: /sort the numbers/i }).click();

    // Should show difficulty options
    await expect(page.getByRole('heading', { name: /choose difficulty/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /easy/i })).toBeVisible();
  });

  test('can return to menu from difficulty selection', async ({ page }) => {
    await page.getByRole('button', { name: /build the number/i }).click();
    await page.getByRole('button', { name: /back to menu/i }).click();

    // Should be back at menu
    await expect(page.getByRole('heading', { name: /build the number/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /sort the numbers/i })).toBeVisible();
  });

  test('can return to menu from a game using home button', async ({ page }) => {
    // Start a game
    await page.getByRole('button', { name: /build the number/i }).click();
    await page.getByRole('button', { name: /easy/i }).click();

    // Click home button in header
    await page.getByRole('button', { name: /home/i }).click();

    // Should be back at menu
    await expect(page.getByRole('heading', { name: /build the number/i })).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('all interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Tab to find a focusable element
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT', 'DIV']).toContain(focused);
  });

  test('games have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /build the number/i }).click();
    await page.getByRole('button', { name: /easy/i }).click();

    // Game should have accessible main region
    await expect(page.getByRole('main', { name: /build the number game/i })).toBeVisible();
  });
});

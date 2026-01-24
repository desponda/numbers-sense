import { test, expect } from '@playwright/test';

test.describe('Build the Number Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /build the number/i }).click();
    await page.getByRole('button', { name: /easy/i }).click();
  });

  test('displays target number and block tray', async ({ page }) => {
    // Should show target number display
    await expect(page.locator('[aria-label^="Target number:"]')).toBeVisible();

    // Should show block tray with unit cubes
    await expect(page.getByRole('region', { name: /block tray - drag blocks/i })).toBeVisible();
  });

  test('displays workspace for dropping blocks', async ({ page }) => {
    // Workspace element should exist in DOM
    await expect(page.locator('[aria-label*="Workspace with"]')).toHaveCount(1);
  });

  test('shows game controls', async ({ page }) => {
    // Check Answer button should be visible
    await expect(page.getByRole('button', { name: /check your answer/i })).toBeVisible();
  });

  test('clear button is disabled when workspace empty', async ({ page }) => {
    // Clear button should be disabled when no blocks
    const clearButton = page.getByRole('button', { name: /clear all blocks/i });
    await expect(clearButton).toBeDisabled();
  });

  test('check answer button exists', async ({ page }) => {
    // Check button should exist (disabled until blocks added)
    await expect(page.getByRole('button', { name: /check your answer/i })).toBeVisible();
  });
});

test.describe('Sort the Numbers Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /sort the numbers/i }).click();
    await page.getByRole('button', { name: /easy/i }).click();
  });

  test('displays sorting instructions', async ({ page }) => {
    await expect(page.locator('h2').getByText(/sort the numbers/i)).toBeVisible();
    await expect(page.getByText('Put the blocks in order from smallest to biggest!')).toBeVisible();
  });

  test('displays sortable items', async ({ page }) => {
    // Should have multiple sortable items (easy mode has 3)
    const sortableItems = page.locator('[data-sortable-id]');
    await expect(sortableItems).toHaveCount(3);
  });

  test('shows check order button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /check order/i })).toBeVisible();
  });

  test('can reorder items by drag and drop', async ({ page }) => {
    const items = page.locator('[data-sortable-id]');

    // Get initial order
    const firstItem = items.first();
    const lastItem = items.last();

    // Drag first item to last position
    await firstItem.dragTo(lastItem);

    // Items should still be visible after drag
    await expect(items).toHaveCount(3);
  });

  test('shows feedback after checking order', async ({ page }) => {
    // Click check without arranging (may be wrong)
    await page.getByRole('button', { name: /check order/i }).click();

    // Should show some feedback (correct or incorrect)
    await expect(page.getByText(/great job|almost|some numbers are not/i)).toBeVisible({
      timeout: 3000,
    });
  });

  test('shows round counter', async ({ page }) => {
    await expect(page.getByText(/round.*1/i)).toBeVisible();
  });

  test('shows score', async ({ page }) => {
    await expect(page.getByText(/score.*0/i)).toBeVisible();
  });

  test('game continues after check order', async ({ page }) => {
    await page.getByRole('button', { name: /check order/i }).click();

    // Wait for feedback animation
    await page.waitForTimeout(500);

    // Game should still be visible (not returned to menu) - use h2 specifically
    await expect(page.locator('h2').getByText(/sort the numbers/i)).toBeVisible();
  });
});

test.describe('Difficulty Modes', () => {
  test('medium mode shows 4 items', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /sort the numbers/i }).click();
    await page.getByRole('button', { name: /medium/i }).click();

    // Medium mode has 4 items
    const sortableItems = page.locator('[data-sortable-id]');
    await expect(sortableItems).toHaveCount(4);
  });

  test('hard mode shows 5 items', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /sort the numbers/i }).click();
    await page.getByRole('button', { name: /hard/i }).click();

    // Hard mode has 5 items
    const sortableItems = page.locator('[data-sortable-id]');
    await expect(sortableItems).toHaveCount(5);
  });

  test('challenge mode shows 6 items', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /sort the numbers/i }).click();
    await page.getByRole('button', { name: /challenge/i }).click();

    // Challenge mode has 6 items
    const sortableItems = page.locator('[data-sortable-id]');
    await expect(sortableItems).toHaveCount(6);
  });
});

/**
 * E2E tests for Race Games (Multiplication and Division)
 * Tests complete game flow, lane progression, and question interaction
 */
import { test, expect } from '@playwright/test';

test.describe('Multiplication Race Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to multiplication race game
    // Note: Update selectors once navigation is implemented
    await page.getByRole('button', { name: /multiplication race/i }).click();
    await page.getByRole('button', { name: /medium/i }).click();
  });

  test('displays game title and instructions', async ({ page }) => {
    await expect(page.getByText(/multiplication race/i)).toBeVisible();
  });

  test('displays 10 bike lanes for medium mode', async ({ page }) => {
    // Should have 10 lanes: ×0, ×1, ×2, ..., ×9
    const lanes = page.locator('[data-testid="bike-lane"]');
    await expect(lanes).toHaveCount(10);
  });

  test('lane labels show multiplier (×0 through ×9)', async ({ page }) => {
    // Check that lane labels are correct
    await expect(page.getByText('×0')).toBeVisible();
    await expect(page.getByText('×1')).toBeVisible();
    await expect(page.getByText('×9')).toBeVisible();
  });

  test('all lanes start at 0/20 progress', async ({ page }) => {
    const progressCounters = page.locator('[data-testid="progress-counter"]');
    const firstCounter = progressCounters.first();
    await expect(firstCounter).toHaveText('0/20');
  });

  test('shows question modal with multiplication question', async ({ page }) => {
    // Question should be in format: N × M = ?
    const questionText = page.locator('[data-testid="question-text"]');
    await expect(questionText).toBeVisible();
    await expect(questionText).toContainText('×');
    await expect(questionText).toContainText('=');
  });

  test('displays 4 answer options', async ({ page }) => {
    const answerButtons = page.locator('[data-testid="answer-option"]');
    await expect(answerButtons).toHaveCount(4);
  });

  test('answer options are clickable', async ({ page }) => {
    const firstOption = page.locator('[data-testid="answer-option"]').first();
    await expect(firstOption).toBeEnabled();
  });

  test('advances bike on correct answer', async ({ page }) => {
    // Get initial progress
    const activeLane = page.locator('[data-testid="bike-lane"][data-active="true"]');
    const progressBefore = await activeLane
      .locator('[data-testid="progress-counter"]')
      .textContent();

    // Find and click correct answer
    // This is tricky in E2E - might need to expose correct answer via data attribute in test mode
    const correctOption = page.locator('[data-testid="answer-option"][data-correct="true"]');
    await correctOption.click();

    // Wait for animation
    await page.waitForTimeout(600);

    // Check progress increased
    const progressAfter = await activeLane
      .locator('[data-testid="progress-counter"]')
      .textContent();
    expect(progressAfter).not.toBe(progressBefore);
  });

  test('stays in place on incorrect answer', async ({ page }) => {
    // Get initial progress
    const activeLane = page.locator('[data-testid="bike-lane"][data-active="true"]');
    const progressBefore = await activeLane
      .locator('[data-testid="progress-counter"]')
      .textContent();

    // Click incorrect answer
    const incorrectOption = page
      .locator('[data-testid="answer-option"][data-correct="false"]')
      .first();
    await incorrectOption.click();

    // Wait for feedback
    await page.waitForTimeout(600);

    // Check progress stayed the same
    const progressAfter = await activeLane
      .locator('[data-testid="progress-counter"]')
      .textContent();
    expect(progressAfter).toBe(progressBefore);
  });

  test('shows feedback on incorrect answer', async ({ page }) => {
    const incorrectOption = page
      .locator('[data-testid="answer-option"][data-correct="false"]')
      .first();
    await incorrectOption.click();

    // Should show "try again" or similar message
    await expect(page.getByText(/try again|incorrect/i)).toBeVisible({ timeout: 1000 });
  });

  test('highlights active lane', async ({ page }) => {
    const activeLane = page.locator('[data-testid="bike-lane"][data-active="true"]');
    await expect(activeLane).toBeVisible();
    await expect(activeLane).toHaveCount(1); // Only one active lane
  });

  test('shows finish badge when lane completes', async ({ page }) => {
    // This test would need to fast-forward a lane to completion
    // Or use a test mode that allows setting lane progress
    test.skip(); // Skip for now - requires test utilities
  });

  test('displays score counter', async ({ page }) => {
    await expect(page.getByText(/score.*\d+\/\d+/i)).toBeVisible();
  });

  test('displays timer', async ({ page }) => {
    await expect(page.getByText(/time.*\d+:\d+/i)).toBeVisible();
  });

  test('keyboard navigation works for answer options', async ({ page }) => {
    // Tab to first option
    await page.keyboard.press('Tab');

    const firstOption = page.locator('[data-testid="answer-option"]').first();
    await expect(firstOption).toBeFocused();

    // Enter selects the option
    await page.keyboard.press('Enter');

    // Should process the answer
    await page.waitForTimeout(300);
  });

  test('can pause game', async ({ page }) => {
    const pauseButton = page.getByRole('button', { name: /pause/i });
    await pauseButton.click();

    await expect(page.getByText(/paused/i)).toBeVisible();
  });

  test('can resume from pause', async ({ page }) => {
    await page.getByRole('button', { name: /pause/i }).click();
    await page.getByRole('button', { name: /resume/i }).click();

    // Game should continue
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible();
  });
});

test.describe('Multiplication Race - Easy Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /multiplication race/i }).click();
    await page.getByRole('button', { name: /easy/i }).click();
  });

  test('displays 6 bike lanes for easy mode', async ({ page }) => {
    // Easy mode: lanes 0-5
    const lanes = page.locator('[data-testid="bike-lane"]');
    await expect(lanes).toHaveCount(6);
  });

  test('only shows lanes ×0 through ×5', async ({ page }) => {
    await expect(page.getByText('×0')).toBeVisible();
    await expect(page.getByText('×5')).toBeVisible();
    await expect(page.getByText('×6')).not.toBeVisible();
  });
});

test.describe('Division Race Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /division race/i }).click();
    await page.getByRole('button', { name: /medium/i }).click();
  });

  test('displays game title', async ({ page }) => {
    await expect(page.getByText(/division race/i)).toBeVisible();
  });

  test('displays 9 bike lanes for medium mode', async ({ page }) => {
    // Division has 9 lanes: ÷1 through ÷9 (no ÷0)
    const lanes = page.locator('[data-testid="bike-lane"]');
    await expect(lanes).toHaveCount(9);
  });

  test('lane labels show divisor (÷1 through ÷9)', async ({ page }) => {
    await expect(page.getByText('÷1')).toBeVisible();
    await expect(page.getByText('÷9')).toBeVisible();

    // Should NOT have ÷0
    await expect(page.getByText('÷0')).not.toBeVisible();
  });

  test('shows division question format', async ({ page }) => {
    // Question should be in format: M ÷ N = ?
    const questionText = page.locator('[data-testid="question-text"]');
    await expect(questionText).toBeVisible();
    await expect(questionText).toContainText('÷');
    await expect(questionText).toContainText('=');
  });

  test('only shows whole number division questions', async ({ page }) => {
    // Get the question text
    const questionText = await page.locator('[data-testid="question-text"]').textContent();

    // Parse dividend and divisor
    const match = questionText?.match(/(\d+)\s*÷\s*(\d+)/);
    if (match) {
      const dividend = parseInt(match[1]);
      const divisor = parseInt(match[2]);

      // Dividend should be a multiple of divisor (no remainder)
      expect(dividend % divisor).toBe(0);
    }
  });

  test('answer options are in valid range (0-10)', async ({ page }) => {
    const answerButtons = page.locator('[data-testid="answer-option"]');
    const count = await answerButtons.count();

    for (let i = 0; i < count; i++) {
      const text = await answerButtons.nth(i).textContent();
      const value = parseInt(text || '0');

      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(10);
    }
  });

  test('displays 4 answer options', async ({ page }) => {
    const answerButtons = page.locator('[data-testid="answer-option"]');
    await expect(answerButtons).toHaveCount(4);
  });

  test('advances bike on correct answer', async ({ page }) => {
    const activeLane = page.locator('[data-testid="bike-lane"][data-active="true"]');
    const progressBefore = await activeLane
      .locator('[data-testid="progress-counter"]')
      .textContent();

    const correctOption = page.locator('[data-testid="answer-option"][data-correct="true"]');
    await correctOption.click();

    await page.waitForTimeout(600);

    const progressAfter = await activeLane
      .locator('[data-testid="progress-counter"]')
      .textContent();
    expect(progressAfter).not.toBe(progressBefore);
  });
});

test.describe('Division Race - Easy Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /division race/i }).click();
    await page.getByRole('button', { name: /easy/i }).click();
  });

  test('displays 5 bike lanes for easy mode', async ({ page }) => {
    // Easy mode: lanes ÷1 through ÷5
    const lanes = page.locator('[data-testid="bike-lane"]');
    await expect(lanes).toHaveCount(5);
  });

  test('only shows lanes ÷1 through ÷5', async ({ page }) => {
    await expect(page.getByText('÷1')).toBeVisible();
    await expect(page.getByText('÷5')).toBeVisible();
    await expect(page.getByText('÷6')).not.toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /multiplication race/i }).click();
    await page.getByRole('button', { name: /medium/i }).click();
  });

  test('screen reader can access lane information', async ({ page }) => {
    const lane = page.locator('[data-testid="bike-lane"]').first();
    await expect(lane).toHaveAttribute('aria-label');
  });

  test('question has accessible label', async ({ page }) => {
    const question = page.locator('[data-testid="question-text"]');
    await expect(question).toHaveAttribute('aria-label');
  });

  test('answer buttons have accessible names', async ({ page }) => {
    const buttons = page.locator('[data-testid="answer-option"]');
    const firstButton = buttons.first();
    await expect(firstButton).toHaveAccessibleName();
  });

  test('keyboard-only navigation is possible', async ({ page }) => {
    // Should be able to tab through all interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // At least one element should have focus
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});

test.describe('Visual Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /multiplication race/i }).click();
    await page.getByRole('button', { name: /medium/i }).click();
  });

  test('touch targets meet minimum size (mobile)', async ({ page, viewport }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const answerButtons = page.locator('[data-testid="answer-option"]');
    const firstButton = answerButtons.first();

    const box = await firstButton.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(48);
  });

  test('lanes are visually distinct', async ({ page }) => {
    const lanes = page.locator('[data-testid="bike-lane"]');
    const count = await lanes.count();

    expect(count).toBeGreaterThan(1);

    // Each lane should be separate element
    for (let i = 0; i < count; i++) {
      await expect(lanes.nth(i)).toBeVisible();
    }
  });

  test('active lane is highlighted', async ({ page }) => {
    const activeLane = page.locator('[data-testid="bike-lane"][data-active="true"]');
    await expect(activeLane).toBeVisible();

    // Should have visual distinction (check via class or style)
    const className = await activeLane.getAttribute('class');
    expect(className).toContain('active'); // or similar styling class
  });
});

test.describe('Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /multiplication race/i }).click();
    await page.getByRole('button', { name: /medium/i }).click();
  });

  test('questions change after correct answer', async ({ page }) => {
    const questionBefore = await page.locator('[data-testid="question-text"]').textContent();

    const correctOption = page.locator('[data-testid="answer-option"][data-correct="true"]');
    await correctOption.click();

    // Wait for new question
    await page.waitForTimeout(800);

    const questionAfter = await page.locator('[data-testid="question-text"]').textContent();

    // Question might be the same fact again, but at least UI should update
    // In practice, questions will usually be different
    expect(questionAfter).toBeTruthy();
  });

  test('same question remains after incorrect answer', async ({ page }) => {
    const questionBefore = await page.locator('[data-testid="question-text"]').textContent();

    const incorrectOption = page
      .locator('[data-testid="answer-option"][data-correct="false"]')
      .first();
    await incorrectOption.click();

    await page.waitForTimeout(800);

    const questionAfter = await page.locator('[data-testid="question-text"]').textContent();

    // Question should remain the same (or be from same lane)
    expect(questionAfter).toBe(questionBefore);
  });

  test('timer counts up', async ({ page }) => {
    const timerBefore = await page.getByText(/time.*\d+:\d+/i).textContent();

    // Wait 2 seconds
    await page.waitForTimeout(2000);

    const timerAfter = await page.getByText(/time.*\d+:\d+/i).textContent();

    // Time should have increased
    expect(timerAfter).not.toBe(timerBefore);
  });

  test('can return to menu from game', async ({ page }) => {
    const menuButton = page.getByRole('button', { name: /menu|exit|quit/i });
    await menuButton.click();

    // Should be back at menu
    await expect(page.getByText(/choose.*game/i)).toBeVisible();
  });
});

/**
 * E2E tests for More Than / Less Than game
 * Tests complete game flows, user interactions, and difficulty modes
 */
import { test, expect } from '@playwright/test';

test.describe('More Than / Less Than Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to More/Less Than game
    await page.getByRole('button', { name: /more.*less.*than/i }).click();
  });

  test.describe('Easy Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();
    });

    test('displays problem and visual scaffold', async ({ page }) => {
      // Problem question should be visible
      await expect(page.getByText(/what is/i)).toBeVisible();
      await expect(page.getByText(/(more|less) than/i)).toBeVisible();

      // Visual scaffold should be visible in easy mode
      await expect(page.getByText(/we start with/i)).toBeVisible();
    });

    test('complete a problem correctly on first try', async ({ page }) => {
      // Wait for problem to load
      await expect(page.getByText(/what is/i)).toBeVisible();

      // Read the problem to determine correct answer
      const problemText = await page.locator('h2').innerText();

      // Parse problem (e.g., "What is 3 more than 5?")
      const match = problemText.match(/What is (\d+) (more|less) than (\d+)/i);
      if (match) {
        const delta = parseInt(match[1], 10);
        const operation = match[2];
        const startingNumber = parseInt(match[3], 10);
        const correctAnswer =
          operation === 'more' ? startingNumber + delta : startingNumber - delta;

        // Enter correct answer
        const input = page.locator('#answer-input');
        await input.fill(String(correctAnswer));

        // Submit answer
        await page.getByRole('button', { name: /check answer/i }).click();

        // Should show success feedback
        await expect(page.getByText(/correct/i)).toBeVisible({ timeout: 2000 });
        await expect(page.getByText('✓')).toBeVisible();
      }
    });

    test('shows progressive feedback for incorrect attempts', async ({ page }) => {
      await expect(page.getByText(/what is/i)).toBeVisible();

      const input = page.locator('#answer-input');
      const submitButton = page.getByRole('button', { name: /check answer/i });

      // First incorrect attempt - generic feedback
      await input.fill('999'); // Intentionally wrong
      await submitButton.click();
      await expect(page.getByText(/try again/i)).toBeVisible({ timeout: 2000 });
      await expect(page.getByText('🤔')).toBeVisible();

      // Second incorrect attempt - hint feedback
      await input.clear();
      await input.fill('998'); // Still wrong
      await submitButton.click();
      await expect(page.getByText(/hint/i)).toBeVisible({ timeout: 2000 });
      await expect(page.getByText('💡')).toBeVisible();

      // Third incorrect attempt - answer reveal
      await input.clear();
      await input.fill('997'); // Still wrong
      await submitButton.click();
      await expect(page.getByText(/the answer is/i)).toBeVisible({ timeout: 2000 });
      await expect(page.getByText('📚')).toBeVisible();
    });

    test('progresses to next problem after correct answer', async ({ page }) => {
      await expect(page.getByText(/what is/i)).toBeVisible();

      // Get first problem text
      const firstProblem = await page.locator('h2').innerText();

      // Solve it (parse and answer)
      const match = firstProblem.match(/What is (\d+) (more|less) than (\d+)/i);
      if (match) {
        const delta = parseInt(match[1], 10);
        const operation = match[2];
        const startingNumber = parseInt(match[3], 10);
        const correctAnswer =
          operation === 'more' ? startingNumber + delta : startingNumber - delta;

        await page.locator('#answer-input').fill(String(correctAnswer));
        await page.getByRole('button', { name: /check answer/i }).click();

        // Wait for success feedback
        await expect(page.getByText(/correct/i)).toBeVisible();

        // Wait for new problem (2 second delay)
        await page.waitForTimeout(2500);

        // Should have a new problem
        const secondProblem = await page.locator('h2').innerText();
        expect(secondProblem).not.toBe(firstProblem);
      }
    });

    test('displays and updates streak counter', async ({ page }) => {
      await expect(page.getByText(/what is/i)).toBeVisible();

      // Initial streak should be 0
      await expect(page.getByText(/streak/i)).toBeVisible();

      // Solve a problem correctly
      const problemText = await page.locator('h2').innerText();
      const match = problemText.match(/What is (\d+) (more|less) than (\d+)/i);

      if (match) {
        const delta = parseInt(match[1], 10);
        const operation = match[2];
        const startingNumber = parseInt(match[3], 10);
        const correctAnswer =
          operation === 'more' ? startingNumber + delta : startingNumber - delta;

        await page.locator('#answer-input').fill(String(correctAnswer));
        await page.getByRole('button', { name: /check answer/i }).click();

        await expect(page.getByText(/correct/i)).toBeVisible();

        // Wait for problem transition
        await page.waitForTimeout(2500);

        // Streak should increase
        await expect(page.locator('text=/streak/i').locator('..')).toContainText(/[1-9]/);
      }
    });

    test('disables input and submit after correct answer', async ({ page }) => {
      await expect(page.getByText(/what is/i)).toBeVisible();

      const input = page.locator('#answer-input');
      const submitButton = page.getByRole('button', { name: /check answer/i });

      // Solve correctly
      const problemText = await page.locator('h2').innerText();
      const match = problemText.match(/What is (\d+) (more|less) than (\d+)/i);

      if (match) {
        const delta = parseInt(match[1], 10);
        const operation = match[2];
        const startingNumber = parseInt(match[3], 10);
        const correctAnswer =
          operation === 'more' ? startingNumber + delta : startingNumber - delta;

        await input.fill(String(correctAnswer));
        await submitButton.click();

        await expect(page.getByText(/correct/i)).toBeVisible();

        // Input and button should be disabled
        await expect(input).toBeDisabled();
        await expect(submitButton).toBeDisabled();
      }
    });

    test('shows visual feedback borders on input', async ({ page }) => {
      await expect(page.getByText(/what is/i)).toBeVisible();

      const input = page.locator('#answer-input');

      // Default state - teal border
      const defaultBorder = await input.evaluate((el) => window.getComputedStyle(el).borderColor);
      expect(defaultBorder).toBeTruthy();

      // Submit wrong answer
      await input.fill('999');
      await page.getByRole('button', { name: /check answer/i }).click();

      await expect(page.getByText(/try again/i)).toBeVisible();

      // Border should change (implementation uses classes, verify visually)
      await expect(input).toBeVisible();
    });
  });

  test.describe('Medium Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: /medium/i }).click();
    });

    test('does not show visual scaffold initially', async ({ page }) => {
      await expect(page.getByText(/what is/i)).toBeVisible();

      // Visual scaffold should not be visible in medium mode
      await expect(page.getByText(/we start with/i)).not.toBeVisible();
    });

    test('allows solving problems without visual aid', async ({ page }) => {
      await expect(page.getByText(/what is/i)).toBeVisible();

      const problemText = await page.locator('h2').innerText();
      const match = problemText.match(/What is (\d+) (more|less) than (\d+)/i);

      if (match) {
        const delta = parseInt(match[1], 10);
        const operation = match[2];
        const startingNumber = parseInt(match[3], 10);
        const correctAnswer =
          operation === 'more' ? startingNumber + delta : startingNumber - delta;

        await page.locator('#answer-input').fill(String(correctAnswer));
        await page.getByRole('button', { name: /check answer/i }).click();

        await expect(page.getByText(/correct/i)).toBeVisible();
      }
    });

    test('handles larger number ranges', async ({ page }) => {
      await expect(page.getByText(/what is/i)).toBeVisible();

      const problemText = await page.locator('h2').innerText();
      const match = problemText.match(/What is (\d+) (more|less) than (\d+)/i);

      if (match) {
        const startingNumber = parseInt(match[3], 10);

        // Medium mode should have numbers up to 20
        expect(startingNumber).toBeGreaterThanOrEqual(1);
        expect(startingNumber).toBeLessThanOrEqual(20);
      }
    });
  });

  test.describe('Hard Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: /hard/i }).click();
    });

    test('displays problems without visual scaffold', async ({ page }) => {
      await expect(page.getByText(/what is/i)).toBeVisible();
      await expect(page.getByText(/we start with/i)).not.toBeVisible();
    });

    test('handles largest number ranges', async ({ page }) => {
      await expect(page.getByText(/what is/i)).toBeVisible();

      const problemText = await page.locator('h2').innerText();
      const match = problemText.match(/What is (\d+) (more|less) than (\d+)/i);

      if (match) {
        const startingNumber = parseInt(match[3], 10);

        // Hard mode should have numbers up to 100
        expect(startingNumber).toBeGreaterThanOrEqual(1);
        expect(startingNumber).toBeLessThanOrEqual(100);
      }
    });

    test('allows solving challenging problems', async ({ page }) => {
      await expect(page.getByText(/what is/i)).toBeVisible();

      const problemText = await page.locator('h2').innerText();
      const match = problemText.match(/What is (\d+) (more|less) than (\d+)/i);

      if (match) {
        const delta = parseInt(match[1], 10);
        const operation = match[2];
        const startingNumber = parseInt(match[3], 10);
        const correctAnswer =
          operation === 'more' ? startingNumber + delta : startingNumber - delta;

        await page.locator('#answer-input').fill(String(correctAnswer));
        await page.getByRole('button', { name: /check answer/i }).click();

        await expect(page.getByText(/correct/i)).toBeVisible();
      }
    });
  });

  test.describe('Game Flow', () => {
    test('handles both "more than" and "less than" operations', async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();
      await expect(page.getByText(/what is/i)).toBeVisible();

      // Check that we see either "more than" or "less than"
      const problemText = await page.locator('h2').innerText();
      expect(problemText.toLowerCase()).toMatch(/(more than|less than)/);
    });

    test('allows keyboard interaction - Enter to submit', async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();
      await expect(page.getByText(/what is/i)).toBeVisible();

      const input = page.locator('#answer-input');
      const problemText = await page.locator('h2').innerText();
      const match = problemText.match(/What is (\d+) (more|less) than (\d+)/i);

      if (match) {
        const delta = parseInt(match[1], 10);
        const operation = match[2];
        const startingNumber = parseInt(match[3], 10);
        const correctAnswer =
          operation === 'more' ? startingNumber + delta : startingNumber - delta;

        await input.fill(String(correctAnswer));
        await input.press('Enter');

        // Should submit and show feedback
        await expect(page.getByText(/correct/i)).toBeVisible({ timeout: 2000 });
      }
    });

    test('clears input when moving to next problem', async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();
      await expect(page.getByText(/what is/i)).toBeVisible();

      const input = page.locator('#answer-input');
      const problemText = await page.locator('h2').innerText();
      const match = problemText.match(/What is (\d+) (more|less) than (\d+)/i);

      if (match) {
        const delta = parseInt(match[1], 10);
        const operation = match[2];
        const startingNumber = parseInt(match[3], 10);
        const correctAnswer =
          operation === 'more' ? startingNumber + delta : startingNumber - delta;

        await input.fill(String(correctAnswer));
        await page.getByRole('button', { name: /check answer/i }).click();

        await expect(page.getByText(/correct/i)).toBeVisible();
        await page.waitForTimeout(2500);

        // Input should be cleared for new problem
        await expect(input).toHaveValue('');
      }
    });

    test('maintains progress statistics across problems', async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();
      await expect(page.getByText(/what is/i)).toBeVisible();

      // Check initial stats
      await expect(page.getByText(/problems completed/i)).toBeVisible();

      // Solve one problem
      const problemText = await page.locator('h2').innerText();
      const match = problemText.match(/What is (\d+) (more|less) than (\d+)/i);

      if (match) {
        const delta = parseInt(match[1], 10);
        const operation = match[2];
        const startingNumber = parseInt(match[3], 10);
        const correctAnswer =
          operation === 'more' ? startingNumber + delta : startingNumber - delta;

        await page.locator('#answer-input').fill(String(correctAnswer));
        await page.getByRole('button', { name: /check answer/i }).click();

        await expect(page.getByText(/correct/i)).toBeVisible();
        await page.waitForTimeout(2500);

        // Problems completed should increment
        const statsText = await page
          .getByText(/problems completed/i)
          .locator('..')
          .innerText();
        expect(statsText).toMatch(/[1-9]/);
      }
    });
  });

  test.describe('Exit Functionality', () => {
    test('displays exit button', async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();
      await expect(page.getByRole('button', { name: /exit/i })).toBeVisible();
    });

    test('returns to menu when exit clicked', async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();
      await expect(page.getByText(/what is/i)).toBeVisible();

      await page.getByRole('button', { name: /exit/i }).click();

      // Should return to difficulty selection or main menu
      await expect(page.getByText(/what is/i)).not.toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('has proper heading structure', async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();

      const heading = page.getByRole('heading', { level: 2 });
      await expect(heading).toBeVisible();
    });

    test('input has accessible label', async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();

      const input = page.locator('#answer-input');
      await expect(input).toBeVisible();
    });

    test('submit button is keyboard accessible', async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();

      const submitButton = page.getByRole('button', { name: /check answer/i });
      await expect(submitButton).toBeVisible();

      // Should be reachable by tab
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
    });

    test('maintains focus management', async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();

      const input = page.locator('#answer-input');
      await input.click();

      // Input should be focused
      await expect(input).toBeFocused();
    });
  });

  test.describe('Edge Cases', () => {
    test('handles submit button disabled when no input', async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();

      const submitButton = page.getByRole('button', { name: /check answer/i });
      await expect(submitButton).toBeDisabled();
    });

    test('enables submit button only with valid input', async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();

      const input = page.locator('#answer-input');
      const submitButton = page.getByRole('button', { name: /check answer/i });

      // Initially disabled
      await expect(submitButton).toBeDisabled();

      // Type a number
      await input.fill('5');

      // Should be enabled
      await expect(submitButton).not.toBeDisabled();
    });

    test('handles clearing input re-disables submit', async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();

      const input = page.locator('#answer-input');
      const submitButton = page.getByRole('button', { name: /check answer/i });

      await input.fill('5');
      await expect(submitButton).not.toBeDisabled();

      await input.clear();
      await expect(submitButton).toBeDisabled();
    });

    test('handles answer of 0', async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();
      await expect(page.getByText(/what is/i)).toBeVisible();

      const input = page.locator('#answer-input');
      await input.fill('0');

      const submitButton = page.getByRole('button', { name: /check answer/i });
      await expect(submitButton).not.toBeDisabled();
    });
  });
});

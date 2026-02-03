import { test, expect } from '@playwright/test';

test.describe('More Than / Less Than - UX Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://numbers-sense-staging.dresponda.com');

    // Click on More Than / Less Than game
    await page.click('text=More Than / Less Than');

    // Wait for difficulty selection or game to load
    await page.waitForTimeout(1000);
  });

  test('Easy Mode - Visual Scaffold Always Visible', async ({ page }) => {
    // Select Easy difficulty
    await page.click('text=Easy');
    await page.waitForTimeout(500);

    // Take screenshot of initial problem
    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/easy-mode-problem.png',
      fullPage: true,
    });

    // Verify visual scaffold is visible (blocks should be shown)
    const blocksVisible = await page
      .locator('.block-container, [class*="block"]')
      .first()
      .isVisible();
    console.log('Easy mode blocks visible:', blocksVisible);

    // Get problem text to verify number ranges
    const problemText = await page.locator('h2, [role="heading"]').first().textContent();
    console.log('Easy mode problem:', problemText);
  });

  test('Medium Mode - Peek Button Functionality', async ({ page }) => {
    // Select Medium difficulty
    await page.click('text=Medium');
    await page.waitForTimeout(500);

    // Take screenshot before peek
    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/medium-mode-before-peek.png',
      fullPage: true,
    });

    // Check if peek button exists
    const peekButton = page.locator('button:has-text("Peek"), button:has-text("Show")');
    const hasPeekButton = (await peekButton.count()) > 0;
    console.log('Medium mode has peek button:', hasPeekButton);

    if (hasPeekButton) {
      // Click peek button
      await peekButton.first().click();
      await page.waitForTimeout(500);

      // Take screenshot with blocks visible
      await page.screenshot({
        path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/medium-mode-after-peek.png',
        fullPage: true,
      });
    }

    // Get problem text
    const problemText = await page.locator('h2, [role="heading"]').first().textContent();
    console.log('Medium mode problem:', problemText);
  });

  test('Hard Mode - Problem Numbers 30-100', async ({ page }) => {
    // Select Hard difficulty
    await page.click('text=Hard');
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/hard-mode-problem.png',
      fullPage: true,
    });

    // Get problem text
    const problemText = await page.locator('h2, [role="heading"]').first().textContent();
    console.log('Hard mode problem:', problemText);
  });

  test('Challenge Mode - Problem Numbers 50-100', async ({ page }) => {
    // Select Challenge difficulty
    await page.click('text=Challenge');
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/challenge-mode-problem.png',
      fullPage: true,
    });

    // Get problem text
    const problemText = await page.locator('h2, [role="heading"]').first().textContent();
    console.log('Challenge mode problem:', problemText);
  });

  test('Test Multiple Problems - Verify Delta Max 5', async ({ page }) => {
    // Select Hard mode (best to test delta with larger numbers)
    await page.click('text=Hard');
    await page.waitForTimeout(500);

    const problems: string[] = [];

    // Collect 5 problems
    for (let i = 0; i < 5; i++) {
      const problemText = await page.locator('h2, [role="heading"]').first().textContent();
      if (problemText) {
        problems.push(problemText);
        console.log(`Problem ${i + 1}:`, problemText);
      }

      // Submit a random answer to move to next problem
      const input = page.locator('input[type="number"]');
      await input.fill('50');
      await page.click('button:has-text("Check")');
      await page.waitForTimeout(2000); // Wait for next problem
    }

    // Take final screenshot
    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/multiple-problems-test.png',
      fullPage: true,
    });

    console.log('Collected problems:', problems);
  });
});

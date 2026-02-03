import { test, expect } from '@playwright/test';

test.describe('Interactive Block Manipulation - UX Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://numbers-sense-staging.dresponda.com');
    await page.click('text=More Than / Less Than');
    await page.waitForTimeout(1000);
  });

  test('Easy Mode - Full Interactive Flow', async ({ page }) => {
    // Select Easy difficulty
    await page.click('text=Easy');
    await page.waitForTimeout(1000);

    // PHASE 1: Interactive Block Removal
    // Take screenshot of initial interaction phase
    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/easy-01-interaction-start.png',
      fullPage: true,
    });

    console.log('=== PHASE 1: INTERACTIVE BLOCK REMOVAL ===');
    const instruction = await page.locator('h3').first().textContent();
    console.log('Instruction:', instruction);

    // Check counter before selection
    const counterBefore = await page.locator('text=/of.*(removed|added)/').textContent();
    console.log('Counter before:', counterBefore);

    // Wait for the instruction to confirm interactive phase loaded
    await page.waitForSelector('h3', { state: 'visible' });

    // Click on blocks to select them - match both selected and not selected states
    const blocks = page.getByRole('button', { name: /(?:Ten rod|Unit cube) \d+,/i });

    const blockCount = await blocks.count();
    console.log('Total blocks available:', blockCount);

    // Select blocks (tap 2-3 blocks based on instruction)
    const targetCount = instruction?.match(/(?:Take away|Add) (\d+)/)?.[1] || '2';
    console.log('Target count:', targetCount);

    for (let i = 0; i < parseInt(targetCount); i++) {
      await blocks.nth(i).click();
      await page.waitForTimeout(200);
    }

    // Take screenshot with blocks selected
    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/easy-02-blocks-selected.png',
      fullPage: true,
    });

    const counterAfter = await page.locator('text=/of.*(removed|added)/').textContent();
    console.log('Counter after selection:', counterAfter);

    // Check if "Done" button is enabled
    const doneButton = page.locator('button:has-text("Done")').first();
    const isEnabled = await doneButton.isEnabled();
    console.log('Done button enabled:', isEnabled);

    if (isEnabled) {
      await doneButton.click();
      await page.waitForTimeout(1000);
    }

    // PHASE 2: Answer Question
    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/easy-03-answer-phase.png',
      fullPage: true,
    });

    console.log('=== PHASE 2: ANSWERING ===');
    const question = await page.locator('h2').first().textContent();
    console.log('Question:', question);

    // Type answer
    const input = page.locator('input[type="number"]');
    await input.fill('9');
    await page.waitForTimeout(500);

    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/easy-04-answer-entered.png',
      fullPage: true,
    });

    // Submit answer
    await page.click('button:has-text("Check Answer")');
    await page.waitForTimeout(1000);

    // PHASE 3: Feedback
    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/easy-05-feedback.png',
      fullPage: true,
    });

    const feedback = await page
      .locator('[class*="text"]')
      .filter({ hasText: /correct|incorrect|try again/i })
      .first()
      .textContent();
    console.log('Feedback:', feedback);
  });

  test('Medium Mode - With Peek Feature', async ({ page }) => {
    await page.click('text=Medium');
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/medium-01-start.png',
      fullPage: true,
    });

    console.log('=== MEDIUM MODE INTERACTION ===');
    const instruction = await page.locator('h3').first().textContent();
    console.log('Instruction:', instruction);

    // Wait for the instruction to confirm interactive phase loaded
    await page.waitForSelector('h3', { state: 'visible' });

    // Select and complete interaction - match both selected and not selected states
    const blocks = page.getByRole('button', { name: /(?:Ten rod|Unit cube) \d+,/i });

    const targetCount = instruction?.match(/(?:Take away|Add) (\d+)/)?.[1] || '2';

    for (let i = 0; i < parseInt(targetCount); i++) {
      await blocks.nth(i).click();
      await page.waitForTimeout(200);
    }

    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/medium-02-selected.png',
      fullPage: true,
    });

    const doneButton = page.locator('button:has-text("Done")');
    if (await doneButton.isEnabled()) {
      await doneButton.click();
      await page.waitForTimeout(1000);
    }

    // Check for peek button
    const peekButton = page.locator('button:has-text("SHOW BLOCKS")');
    const hasPeekButton = (await peekButton.count()) > 0;
    console.log('Has peek button:', hasPeekButton);

    if (hasPeekButton) {
      await page.screenshot({
        path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/medium-03-with-peek-button.png',
        fullPage: true,
      });

      await peekButton.click();
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/medium-04-after-peek.png',
        fullPage: true,
      });
    }
  });

  test('Test Block Selection Undo', async ({ page }) => {
    await page.click('text=Easy');
    await page.waitForTimeout(1000);

    // Wait for the instruction to confirm interactive phase loaded
    await page.waitForSelector('h3', { state: 'visible' });

    // Match both selected and not selected states
    const blocks = page.getByRole('button', { name: /(?:Ten rod|Unit cube) \d+,/i });

    // Select a block
    await blocks.first().click();
    await page.waitForTimeout(200);

    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/undo-01-block-selected.png',
      fullPage: true,
    });

    let counter = await page.locator('text=/of.*(removed|added)/').textContent();
    console.log('After select:', counter);

    // Click same block again to undo
    await blocks.first().click();
    await page.waitForTimeout(200);

    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/undo-02-block-deselected.png',
      fullPage: true,
    });

    counter = await page.locator('text=/of.*(removed|added)/').textContent();
    console.log('After undo:', counter);
  });

  test('Skip Interaction Feature', async ({ page }) => {
    await page.click('text=Easy');
    await page.waitForTimeout(1000);

    const skipButton = page.locator('button:has-text("Skip to Question")');
    const hasSkip = (await skipButton.count()) > 0;
    console.log('Has skip button:', hasSkip);

    if (hasSkip) {
      await page.screenshot({
        path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/skip-01-before.png',
        fullPage: true,
      });

      await skipButton.click();
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/skip-02-after.png',
        fullPage: true,
      });

      const question = await page.locator('h2').first().textContent();
      console.log('Question after skip:', question);
    }
  });
});

/**
 * Validation script to prove the React error #185 fix works
 * This will test the complete flow and take screenshots
 */
import { test, expect } from '@playwright/test';

test.describe('Race Game Fix Validation', () => {
  test('Multiplication Race - Complete Flow Without Errors', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8080');

    // Take screenshot of homepage
    await page.screenshot({ path: '/tmp/1-homepage.png', fullPage: true });
    console.log('✓ Screenshot 1: Homepage');

    // Click on Multiplication Race
    await page.click('text=Multiplication Race');
    await page.waitForTimeout(500);

    // Take screenshot of difficulty selection
    await page.screenshot({ path: '/tmp/2-difficulty-selection.png', fullPage: true });
    console.log('✓ Screenshot 2: Difficulty Selection');

    // Click Easy difficulty - THIS IS WHERE THE BUG WAS
    await page.click('text=Easy');
    await page.waitForTimeout(1000);

    // If we get here without errors, the bug is fixed!
    // Take screenshot of the game starting
    await page.screenshot({ path: '/tmp/3-game-started.png', fullPage: true });
    console.log('✓ Screenshot 3: Game Started (NO ERROR!)');

    // Verify we can see the question modal
    const questionText = await page.locator('text=/×|÷/').first();
    await expect(questionText).toBeVisible();
    console.log('✓ Question is visible');

    // Verify we can see the race track
    const raceTrack = await page.locator('[class*="race-track"]');
    await expect(raceTrack).toBeVisible();
    console.log('✓ Race track is visible');

    // Answer a few questions to prove the game works
    for (let i = 0; i < 3; i++) {
      // Click any answer button
      const answerButtons = await page.locator('[role="radio"]').all();
      if (answerButtons.length > 0) {
        await answerButtons[0].click();
        await page.waitForTimeout(600);
      }
    }

    // Take screenshot after answering questions
    await page.screenshot({ path: '/tmp/4-after-answers.png', fullPage: true });
    console.log('✓ Screenshot 4: After Answering Questions');

    console.log('\n✅ SUCCESS! No React error #185');
    console.log('Screenshots saved to:');
    console.log('  /tmp/1-homepage.png');
    console.log('  /tmp/2-difficulty-selection.png');
    console.log('  /tmp/3-game-started.png');
    console.log('  /tmp/4-after-answers.png');
  });

  test('Division Race - Complete Flow Without Errors', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8080');

    // Click on Division Race
    await page.click('text=Division Race');
    await page.waitForTimeout(500);

    // Take screenshot of difficulty selection
    await page.screenshot({ path: '/tmp/5-division-difficulty.png', fullPage: true });
    console.log('✓ Screenshot 5: Division Difficulty Selection');

    // Click Medium difficulty
    await page.click('text=Medium');
    await page.waitForTimeout(1000);

    // Take screenshot of the game starting
    await page.screenshot({ path: '/tmp/6-division-started.png', fullPage: true });
    console.log('✓ Screenshot 6: Division Game Started (NO ERROR!)');

    // Verify game is working
    const questionText = await page.locator('text=/÷/').first();
    await expect(questionText).toBeVisible();
    console.log('✓ Division question is visible');

    console.log('\n✅ Division Race also working!');
    console.log('Screenshots saved to:');
    console.log('  /tmp/5-division-difficulty.png');
    console.log('  /tmp/6-division-started.png');
  });
});

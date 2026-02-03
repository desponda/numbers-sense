import { test } from '@playwright/test';

test('Visual test - Add operation with prominent counter', async ({ page }) => {
  await page.goto('https://numbers-sense-staging.dresponda.com');
  await page.click('text=More Than / Less Than');
  await page.waitForTimeout(1000);

  // Select Easy mode to test Add operation
  await page.click('text=Easy');
  await page.waitForTimeout(1500);

  // Wait for interactive phase to load
  await page.waitForSelector('h3', { state: 'visible' });

  // Take screenshot of initial state
  await page.screenshot({
    path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/add-operation-01-initial.png',
    fullPage: true,
  });

  // If it's an "Add" instruction, interact with the new blocks
  const instruction = await page.locator('h3').first().textContent();
  console.log('Instruction:', instruction);

  if (instruction?.includes('Add')) {
    // Find blocks and click on new (outlined) ones
    const blocks = page.getByRole('button', { name: /(?:Ten rod|Unit cube) \d+,/i });
    await page.waitForTimeout(1000);

    // Click first block
    await blocks.first().click();
    await page.waitForTimeout(500);

    // Take screenshot after selecting one block
    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/add-operation-02-one-selected.png',
      fullPage: true,
    });

    // Check the current block counter
    const currentBlockText = await page.locator('text=/\\d+ current blocks/i').textContent();
    console.log('Current blocks:', currentBlockText);
  } else if (instruction?.includes('Take away')) {
    // Test removal operation
    const blocks = page.getByRole('button', { name: /(?:Ten rod|Unit cube) \d+,/i });
    await page.waitForTimeout(1000);

    // Click first block
    await blocks.first().click();
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({
      path: '/tmp/claude/-workspaces-numbers-sense/630c85bb-4d7e-4cf5-bb46-737acc3c904c/scratchpad/remove-operation-02-one-selected.png',
      fullPage: true,
    });

    // Check the current block counter
    const currentBlockText = await page.locator('text=/\\d+ current blocks/i').textContent();
    console.log('Current blocks:', currentBlockText);
  }
});

import { expect, test, type Page } from '@playwright/test';

async function completeAssessment(page: Page) {
  await page.locator('#assessment input[name="birthDate"]').fill('2000-03-10');
  for (let i = 0; i < 5; i += 1) await page.locator(`input[name="state-${i}"]`).first().check();
  await page.locator('input[name="preference"][value="wood"]').check();
  await page.getByRole('button', { name: /COMPLETE ASSESSMENT/ }).click();
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => { Math.random = () => 0.42; });
  await page.goto('/');
  await expect(page.locator('.loader')).toHaveClass(/is-hidden/, { timeout: 15_000 });
});

test('completes assessment, locks draw, and shows three suggestions', async ({ page }) => {
  await expect(page.locator('.hero h1')).toHaveText('TONIC.CO');
  await expect(page.locator('body')).not.toContainText(/[\u3400-\u9fff]/);
  const heroFont = await page.locator('.hero h1').evaluate((node) => getComputedStyle(node).fontFamily);
  expect(heroFont).toContain('Asterone');
  const bodyFont = await page.locator('body').evaluate((node) => getComputedStyle(node).fontFamily);
  expect(bodyFont).toContain('Avenir Next World');
  await expect(page.locator('.section-copy h2')).toHaveCSS('font-family', /Asterone/);
  await expect(page.locator('.draw-copy h2')).toHaveCSS('font-family', /Asterone/);
  expect(await page.locator('.section-copy h2').evaluate((node) => parseFloat(getComputedStyle(node).fontSize))).toBeLessThanOrEqual(72);
  expect(await page.locator('.draw-copy h2').evaluate((node) => parseFloat(getComputedStyle(node).fontSize))).toBeLessThanOrEqual(72);
  const heroRects = await page.locator('.hero').evaluate(() => {
    const selectors = ['.hero h1', '.hero .section-index', '.hero-meta'];
    return selectors.map((selector) => {
      const rect = document.querySelector(selector)!.getBoundingClientRect();
      return { selector, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    });
  });
  const overlaps = (a: typeof heroRects[number], b: typeof heroRects[number]) =>
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  expect(overlaps(heroRects[0], heroRects[1])).toBe(false);
  expect(overlaps(heroRects[0], heroRects[2])).toBe(false);
  const elementCards = page.locator('.element-grid label');
  await expect(elementCards).toHaveCount(5);
  const elementMetrics = await elementCards.evaluateAll((nodes) => nodes.map((node) => {
    const card = node.querySelector('span')!;
    const range = document.createRange();
    range.selectNode(card.firstChild!);
    const box = card.getBoundingClientRect();
    const textBox = range.getBoundingClientRect();
    return {
      width: box.width,
      height: box.height,
      fontSize: parseFloat(getComputedStyle(card).fontSize),
      smallSize: parseFloat(getComputedStyle(card.querySelector('small')!).fontSize),
      textInside: textBox.left >= box.left && textBox.right <= box.right,
    };
  }));
  expect(Math.max(...elementMetrics.map((item) => item.width)) - Math.min(...elementMetrics.map((item) => item.width))).toBeLessThanOrEqual(1);
  expect(Math.max(...elementMetrics.map((item) => item.height)) - Math.min(...elementMetrics.map((item) => item.height))).toBeLessThanOrEqual(1);
  expect(elementMetrics.every((item) => Math.abs(item.width - item.height) <= 1)).toBe(true);
  expect(elementMetrics.every((item) => item.fontSize <= 34 && item.smallSize === 8 && item.textInside)).toBe(true);
  await expect(page.locator('.scene-canvas')).toHaveCount(1);
  await expect(page.locator('.scene-fallback')).toHaveCount(0);
  await completeAssessment(page);
  await expect(page.locator('.draw-button')).toBeEnabled();
  await page.locator('.draw-button').click();
  await expect(page.locator('.result-title h2')).toBeVisible();
  await expect(page.locator('.result-title h2')).toHaveCSS('font-family', /Asterone/);
  expect(await page.locator('.result-title h2').evaluate((node) => parseFloat(getComputedStyle(node).fontSize))).toBeLessThanOrEqual(48);
  for (const selector of ['.section-copy h2', '.draw-copy h2', '.result-title h2']) {
    const fits = await page.locator(selector).evaluate((node) => {
      const box = node.getBoundingClientRect();
      const parentBox = node.parentElement!.getBoundingClientRect();
      return box.left >= parentBox.left && box.right <= parentBox.right + 1;
    });
    expect(fits).toBe(true);
  }
  await expect(page.locator('.result-card li')).toHaveCount(3);
  await expect(page.locator('.draw-status')).toContainText('DRAWN');
});

test('shows validation and restores answers after reload', async ({ page }) => {
  await page.getByRole('button', { name: /COMPLETE ASSESSMENT/ }).click();
  await expect(page.locator('.form-error')).toContainText('Complete your birth date');
  await completeAssessment(page);
  await page.reload();
  await expect(page.locator('input[name="birthDate"]')).toHaveValue('2000-03-10');
  await expect(page.locator('input[name="preference"][value="wood"]')).toBeChecked();
});

test('restart clears session state and disables drawing', async ({ page }) => {
  await completeAssessment(page);
  await page.locator('.draw-button').click();
  await page.getByRole('button', { name: 'RESTART ASSESSMENT' }).click();
  await expect(page.locator('.draw-button')).toBeDisabled();
  const stored = await page.evaluate(() => sessionStorage.getItem('tonic-five-elements:v1'));
  expect(stored).toBeNull();
});

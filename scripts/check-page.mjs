import { chromium } from '@playwright/test';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const messages = [];
page.on('console', (message) => messages.push(`console:${message.type()}:${message.text()}`));
page.on('pageerror', (error) => messages.push(`pageerror:${error.stack ?? error.message}`));
await page.goto('http://127.0.0.1:4173');
await page.waitForTimeout(5000);
await page.screenshot({ path: 'outputs/qa-hero.png' });
await page.locator('#assessment').scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
await page.screenshot({ path: 'outputs/qa-assessment.png' });
await page.locator('input[name="birthDate"]').fill('2000-03-10');
for (let index = 0; index < 5; index += 1) await page.locator(`input[name="state-${index}"]`).first().check();
await page.locator('input[name="preference"][value="wood"]').check();
await page.getByRole('button', { name: /COMPLETE ASSESSMENT/ }).click();
await page.locator('.draw-button').click();
await page.locator('.result-title').waitFor();
await page.screenshot({ path: 'outputs/qa-result.png' });
console.log(JSON.stringify({
  canvas: await page.locator('.scene-canvas').count(),
  fallback: await page.locator('.scene-fallback').count(),
  loaderClass: await page.locator('.loader').getAttribute('class'),
  messages,
}, null, 2));
await browser.close();

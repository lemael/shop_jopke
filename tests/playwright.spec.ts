import { test, expect } from '@playwright/test';

test.describe('DIN-C4-Mailing Konfiguration', () => {

  test('DIN-C4-Mailing - Formular untersuchen', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.locator('#kuvertiertes-mailing').scrollIntoViewIfNeeded();

  await page.getByText('DIN-C4-Mailing', { exact: true }).click();
  

  // Trouver la carte du produit DIN-C4-Mailing
  const product = page
    .locator('section, article, div')
    .filter({ has: page.getByRole('heading', { name: 'DIN-C4-Mailing', exact: true }) })
    .filter({ hasText: '324 × 229 mm' })
    .last();

  await expect(
    page.getByRole('heading', { name: 'DIN-C4-Mailing', exact: true })
  ).toBeVisible();

  // Afficher le bouton de configuration du produit
  await product.getByText('Konfigurieren', { exact: true }).click();

  // Attendre la navigation éventuelle
  await page.waitForTimeout(1000);

  console.log('\n===== URL =====');
  console.log(page.url());

  console.log('\n===== PAGE TEXT =====');
  console.log(await page.locator('body').innerText());

  console.log('\n===== BUTTONS =====');
  console.log(await page.getByRole('button').allTextContents());

  console.log('\n===== INPUTS =====');
  console.log(await page.locator('input, select, textarea').evaluateAll(
    elements => elements.map(el => ({
      tag: el.tagName,
      type: el.getAttribute('type'),
      name: el.getAttribute('name'),
      placeholder: el.getAttribute('placeholder'),
      value: (el as HTMLInputElement).value
    }))
  ));
});
 


});

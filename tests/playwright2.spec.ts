import { test, expect } from '@playwright/test';

test('DIN-C4-Mailing - Inspecter Hüllentyp', async ({ page }) => {
  await page.goto('http://localhost:3000/shop/c4_mailing');

 

  const bodyText = await page.locator('body').innerText();

  console.log('===== ÉTAPE ACTUELLE =====');
  console.log(bodyText);

  const options = [
    page.getByRole('button', { name: 'Fensterhülle', exact: true }),
    page.getByRole('button', { name: 'Hülle ohne Fenster', exact: true }),
  ];

  for (const option of options) {
    console.log(
      `Option "${await option.innerText()}" visible :`,
      await option.isVisible()
    );
  }

  await expect(options[0]).toBeVisible();
  await expect(options[1]).toBeVisible();
});

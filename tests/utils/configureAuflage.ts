import type { Page } from '@playwright/test';

export async function configurerAuflage(page: Page, quantite: number): Promise<void> {
  console.log('===== AUFLAGE =====');

  const amount = page.locator('#amount');

  await amount.fill(String(quantite));

  console.log(
    'Quantité saisie :',
    await amount.inputValue()
  );

  // Cliquer sur Weiter
  await page.locator('button.button.next').click();

  await page.waitForLoadState('domcontentloaded').catch(() => {});

  console.log(
    'URL après la quantité :',
    page.url()
  );
}
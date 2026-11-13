import type { Page } from '@playwright/test';

async function cliquerWeiter(
    page: Page
): Promise<void> {
  const boutonWeiter = page.locator('.button.next');

  await boutonWeiter.waitFor({ state: 'visible' });
  await boutonWeiter.click();

  await page
    .waitForLoadState('domcontentloaded')
    .catch(() => {});
  console.log('URL après Weiter :', page.url());
}
export { cliquerWeiter };
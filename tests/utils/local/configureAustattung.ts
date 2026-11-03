import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function configurerAustattung(page: Page, austattung: string) {

    const boutonAustattung = page.getByRole('button', {
    name: austattung,
    exact: true
    });
    await expect(boutonAustattung).toBeVisible();
    await expect(boutonAustattung.locator('span')).toHaveText(
      austattung
    );

    await boutonAustattung.click();
    console.log(`Austattung "${austattung}" configurée.`);
}
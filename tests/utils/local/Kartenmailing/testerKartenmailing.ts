import { expect, type Page } from '@playwright/test';

import { configurerAuflage } from '../configureAuflage';
import { configurePapier, configureVeredelung } from './configurerKartenmailing';
import type { Kartenmailing } from '../../../types/Kartenmailing';

/**
 * Parcourt le configurateur local Kartenmailing :
 * Auflage → Papier → Veredelung → Übersicht.
 */
async function testerKartenmailing(
  page: Page,
  quantite: number,
  kartenmailing: Kartenmailing
): Promise<void> {
  console.log('===== Auflage =====');
  await configurerAuflage(page, quantite);

  console.log('===== Papier =====');
  await configurePapier(page, kartenmailing);

  console.log('===== Veredelung =====');
  await configureVeredelung(page, kartenmailing);

  console.log('===== Preisübersicht =====');
  // On attend que l'Übersicht affiche les prix avant de les extraire.
  await expect(page.getByText(/Gesamt\s*\(netto\)/)).toBeVisible();
}

export { testerKartenmailing };

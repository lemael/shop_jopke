import type { Page } from '@playwright/test';

import { cliquerWeiter } from '../cliquerWeiter';
import { configurerAuflage } from '../configureAuflage';
import { configurePapier, configureVeredelung } from './configureKartenmailing';
import type { Kartenmailing } from '../../../types/Kartenmailing';

/**
 * Parcourt le configurateur online Kartenmailing :
 * "Produkt konfigurieren" → Auflage → Papier → Veredelung → order-overview.
 */
async function testerKartenmailingOnline(
  page: Page,
  quantite: number,
  kartenmailing: Kartenmailing
): Promise<void> {
  // Bouton "Produkt konfigurieren" de la page overview.
  await cliquerWeiter(page);

  console.log('===== Auflage =====');
  await configurerAuflage(page, quantite);

  console.log('===== Papier =====');
  await configurePapier(page, kartenmailing);

  console.log('===== Veredelung =====');
  await configureVeredelung(page, kartenmailing);

  console.log('===== Preisübersicht =====');
}

export { testerKartenmailingOnline };

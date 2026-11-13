import { expect, type Page } from '@playwright/test';
import type { Kartenmailing } from '../../../types/Kartenmailing';

async function configurePapier(
  page: Page,
  kartenmailing: Kartenmailing
): Promise<void> {
  console.log('===== PAPIER local =====');

  // Le bouton regroupe grammage, papier et surface
  // ("260 g/m² Chromokarton mit 1,4-fachem Volumen VS glänzend RS matt").
  const texte = kartenmailing.papier;

  const bouton = page.getByRole('button', {
    name: texte,
    exact: true,
  });

  await expect(bouton).toBeVisible();

  console.log('Sélection du Papier :', texte);
  await bouton.click();

  console.log('URL après le choix de Papier :', page.url());
  console.log('===== FIN DE L’ÉTAPE PAPIER =====');
}

async function configureVeredelung(
  page: Page,
  kartenmailing: Kartenmailing
): Promise<void> {
  console.log('===== VEREDELUNG local =====');

  const texte = kartenmailing.veredelung;

  const bouton = page.getByRole('button', {
    name: texte,
    exact: true,
  });

  await expect(bouton).toBeVisible();

  console.log('Sélection de la Veredelung :', texte);
  await bouton.click();

  console.log('URL après le choix de Veredelung :', page.url());
  console.log('===== FIN DE L’ÉTAPE VEREDELUNG =====');
}

export { configurePapier, configureVeredelung };

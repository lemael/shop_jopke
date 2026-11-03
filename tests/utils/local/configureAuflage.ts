import { expect, type Page } from '@playwright/test';

export async function configurerAuflage(
  page: Page,
  quantite: number
): Promise<void> {

  console.log('===== AUFLAGE en local=====');

  // Convertir 1000 en "1.000 Stück", par exemple.
  const quantiteFormatee = `${quantite.toLocaleString('de-DE')} Stück`;

  // Identifier le bouton à partir du texte de son span.
  const bouton = page.getByRole('button', {
    name: quantiteFormatee,
    exact: true
  });

  // Vérifier que le bouton existe et est visible.
  await expect(bouton).toBeVisible();

  // Vérifier le texte du span.
  await expect(bouton.locator('span')).toHaveText(quantiteFormatee);

  // Sélectionner la quantité.
  await bouton.click();



  console.log('Quantité sélectionnée :', quantiteFormatee);

  console.log('URL après la quantité :', page.url());
}
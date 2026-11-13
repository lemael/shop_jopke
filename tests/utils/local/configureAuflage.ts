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

  if (await bouton.isVisible().catch(() => false)) {
    // Vérifier le texte du span.
    await expect(bouton.locator('span')).toHaveText(quantiteFormatee);

    // Sélectionner la quantité.
    await bouton.click();
  } else {
    // Quantité sans bouton prédéfini (ex. 1234, 2500, 5001, ...) :
    // on passe par le champ "Eigene Menge eingeben".
    const champ = page.getByRole('spinbutton', { name: 'Eigene Menge eingeben' });
    await expect(champ).toBeVisible();
    await champ.fill(String(quantite));
    await page.getByRole('button', { name: 'Weiter →' }).click();
  }



  console.log('Quantité sélectionnée :', quantiteFormatee);

  console.log('URL après la quantité :', page.url());
}
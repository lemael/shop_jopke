import {  expect, type Page } from '@playwright/test';
import { Flyer } from '../../types/Flyer';


async function configureUmfangFlyer(
  page: Page,
  flyer: Flyer
): Promise<void> {
  console.log('===== UMFANG FLYER local =====');

  const texte = `${flyer.umfang} Seiten`;

  const bouton = page.getByRole('button', {
    name: texte,
    exact: true
  });

  // Vérifier la disponibilité du bouton.
  await expect(bouton).toBeVisible();

  // Sélectionner le format.
  console.log(`Sélection du Umfang : ${texte}`);
  await bouton.click();

  console.log('Umfang sélectionné :', texte);
  console.log('URL après le choix de Umfang Flyer :', page.url());

  console.log('===== FIN DE L’ÉTAPE UMFANG FLYER =====');
}
async function configureAnzahlFlyer(
  page: Page,
  flyer: Flyer
): Promise<void> {
  console.log('===== ANZAHL FLYER local =====');
 console.log('Objet Flyer reçu :', flyer);
 console.log('Valeur de flyer.anzahl :', flyer.anzahl);
  const texte = `${flyer.anzahl} Flyer`;

  const bouton = page.getByRole('button', {
    name: texte,
    exact: true
  });

  // Vérifier que le bouton est visible.
  await expect(bouton).toBeVisible();

  // Sélectionner le nombre de flyers.
  console.log(`Sélection du nombre de flyers : ${texte}`);
  await bouton.click();



  console.log('===== FIN DE L’ÉTAPE ANZAHL FLYER =====');
}
async function configureGrammaturFlyer(
  page: Page,
  flyer: Flyer
): Promise<void> {
  console.log('===== GRAMMATUR FLYER local =====');

  const texte = flyer.grammatur;

  const bouton = page.getByRole('button', {
    name: texte,
    exact: true
  });

  // Vérifier que le bouton est visible.
  await expect(bouton).toBeVisible();

  // Sélectionner la grammature.
  console.log('Sélection de la grammature :', texte);
  await bouton.click();

  console.log('Grammatur sélectionnée :', texte);
  console.log('URL après le choix de Grammatur :', page.url());

  console.log('===== FIN DE L’ÉTAPE GRAMMATUR FLYER =====');
}
async function configureOberflächeFlyer(
  page: Page,
  flyer: Flyer
): Promise<void> {
  console.log('===== OBERFLÄCHE FLYER local =====');

  const texte = flyer.oberflaeche;

  const bouton = page.getByRole('button', {
    name: texte,
    exact: true
  });

  // Vérifier que le bouton est visible.
  await expect(bouton).toBeVisible();

  // Sélectionner la surface.
  console.log('Sélection de la Oberfläche :', texte);
  await bouton.click();

  console.log('Oberfläche sélectionnée :', texte);
  console.log('URL après le choix de Oberfläche :', page.url());

  console.log('===== FIN DE L’ÉTAPE OBERFLÄCHE FLYER =====');
}
export {configureAnzahlFlyer, configureUmfangFlyer, configureGrammaturFlyer, configureOberflächeFlyer };
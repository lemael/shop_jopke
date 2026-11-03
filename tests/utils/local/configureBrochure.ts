import {  expect, type Page } from '@playwright/test';
import { Brochure } from '../../types/Brochure';


async function configureUmfangBrochure(
  page: Page,
  brochure: Brochure
): Promise<void> {
  console.log('===== UMFANG FLYER local =====');

  // Les libellés locaux ressemblent à "8 (4 + 4) Seiten" : on ignore les espaces.
  const texte = brochure.umfang;

  const bouton = page.getByRole('button', {
    name: new RegExp(
      '^' +
        texte
          .replace(/\s+/g, '')
          .split('')
          .map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('\\s*') +
        '$'
    ),
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

async function configureGrammaturBrochure(
  page: Page,
  brochure: Brochure
): Promise<void> {
  console.log('===== GRAMMATUR BROCHURE local =====');

  const texte = brochure.grammatur;

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

  console.log('===== FIN DE L’ÉTAPE GRAMMATUR BROCHURE =====');
}
async function configureOberflächeBrochure(
  page: Page,
  brochure: Brochure
): Promise<void> {
  console.log('===== OBERFLÄCHE BROCHURE local =====');

  const texte = brochure.oberflaeche;

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

  console.log('===== FIN DE L’ÉTAPE OBERFLÄCHE BROCHURE =====');
}
// Étapes locales supplémentaires : Oberfläche puis Grammatur de l'Umschlag.
async function configureUmschlagBrochure(
  page: Page,
  brochure: Brochure,
  grammaturUmschlag: string
): Promise<void> {
  console.log('===== UMSCHLAG BROCHURE local =====');

  const oberflaeche = page.getByRole('button', { name: brochure.oberflaeche, exact: true });
  await expect(oberflaeche).toBeVisible();
  await oberflaeche.click();

  const grammatur = page.getByRole('button', { name: grammaturUmschlag, exact: true });
  await expect(grammatur).toBeVisible();
  await grammatur.click();

  console.log('===== FIN DE L’ÉTAPE UMSCHLAG BROCHURE =====');
}

export {configureUmschlagBrochure, configureUmfangBrochure, configureGrammaturBrochure, configureOberflächeBrochure };
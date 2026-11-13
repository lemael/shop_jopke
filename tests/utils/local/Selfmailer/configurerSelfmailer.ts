import {  expect, type Page } from '@playwright/test';
import { Selfmailer } from '../../../types/Selfmailer';


async function configureUmfang(
  page: Page,
  selfmailer: Selfmailer
): Promise<void> {
  console.log('===== GRAMMATUR local =====');

  // Les libellés locaux ressemblent à "8 (4 + 4) Seiten" : on ignore les espaces.
  const texte = selfmailer.umfang;

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
  console.log('URL après le choix de Umfang :', page.url());

  console.log('===== FIN DE L’ÉTAPE UMFANG =====');
}

async function configureGrammatur(
  page: Page,
  selfmailer: Selfmailer
): Promise<void> {
  console.log('===== GRAMMATUR local =====');

  const texte = selfmailer.grammatur;

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

  console.log('===== FIN DE L’ÉTAPE GRAMMATUR =====');
}
async function configurePerforation(
  page: Page,
  selfmailer: Selfmailer
): Promise<void> {
  console.log('===== PERFORATION local =====');

  const texte = selfmailer.perforation;

  const bouton = page.getByRole('button', {
    name: texte,
    exact: true
  });

  // Certains produits (ex. LEVI) n'ont pas d'étape Perforation :
  // après la Grammatur, on arrive directement sur l'Übersicht.
  const recap = page.getByText('Ihre Auswahl');
  await bouton.or(recap).first().waitFor({ state: 'visible' });

  if (!(await bouton.isVisible())) {
    console.log('Aucune étape Perforation pour ce produit, déjà sur l’Übersicht.');
    return;
  }

  // Sélectionner la perforation.
  console.log('Sélection de la Perforation :', texte);
  await bouton.click();

  console.log('Perforation sélectionnée :', texte);
  console.log('URL après le choix de Perforation :', page.url());

  console.log('===== FIN DE L’ÉTAPE PERFORATION =====');
}


export { configureUmfang, configureGrammatur, configurePerforation };
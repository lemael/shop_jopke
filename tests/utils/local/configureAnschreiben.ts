import { expect, type Page } from '@playwright/test';
import { Anschreiben } from '../../types/Anschreiben';

async function configureGrammaturAnschreiben(
  page: Page,
  anschreiben: Anschreiben
): Promise<void> {
  console.log('===== GRAMMATUR ANSCHREIBEN local =====');

  const texte = anschreiben.grammatur;

  const bouton = page.getByRole('button', {
    name: texte,
    exact: true
  });

  // 1. Vérifier que le bouton est visible.
  await expect(bouton).toBeVisible();

  // 2. Sélectionner la grammature.
  console.log('Sélection de la grammature :', texte);
  await bouton.click();

  // 3. Afficher le résultat.
  console.log('Grammatur sélectionnée :', texte);
  console.log('URL après le choix de Grammatur :', page.url());

  console.log('===== FIN DE L’ÉTAPE GRAMMATUR ANSCHREIBEN =====');
}

async function configureFarbigkeitAnschreiben(
  page: Page,
  anschreiben: Anschreiben
): Promise<void> {
  console.log('===== FARBIGKEIT ANSCHREIBEN local =====');

  const texte = anschreiben.farbigkeit;

  const bouton = page.getByRole('button', {
    name: texte,
    exact: true
  });

  // 1. Vérifier que le bouton est visible.
  await expect(bouton).toBeVisible();

  // 2. Sélectionner la couleur.
  console.log('Sélection de la couleur :', texte);
  await bouton.click();

  // 3. Afficher le résultat.
  console.log('Farbigkeit sélectionnée :', texte);
  console.log('URL après le choix de Farbigkeit :', page.url());

  console.log('===== FIN DE L’ÉTAPE FARBIGKEIT ANSCHREIBEN =====');
}
export { configureGrammaturAnschreiben, configureFarbigkeitAnschreiben };
import {  type Page } from '@playwright/test';
import { Brochure } from '../../types/Brochure';
async function configureUmfangBrochure(
    page: Page,
  brochure: Brochure
): Promise<void> {
  console.log('===== UMFANG BROCHURE =====');

  // Libellé du type "8 (4 + 4) Seiten" : on ignore les espaces.
  const umfangFlyer = page.getByRole('button', {
    name: new RegExp(
      '^' +
        brochure.umfang
          .replace(/\s+/g, '')
          .split('')
          .map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('\\s*') +
        '$'
    ),
  });
  await umfangFlyer.waitFor({ state: 'visible' });
  await umfangFlyer.click();

  console.log(`${brochure.umfang} sélectionné pour Umfang Brochure`);
  console.log('URL après le choix de Umfang Brochure :', page.url());

  console.log('===== FIN DE L’ÉTAPE UMFANG BROCHURE =====');
}

async function configureGrammaturBrochure(
  page: Page,
  brochure: Brochure
): Promise<void> {
  console.log('===== GRAMMATUR BROCHURE =====');

  // Dès 12 Seiten, l'étape Grammatur est sautée en ligne.
  if (brochure.grammaturUmschlag) {
    console.log('Étape Grammatur absente en ligne pour cet Umfang.');
    return;
  }

  const boutonGrammatur = page.getByRole('button', {
    name: brochure.grammatur,
    exact: true,
  });

  await boutonGrammatur.waitFor({ state: 'visible' });
  await boutonGrammatur.click();

  console.log('Grammatur sélectionnée :', brochure.grammatur);
  console.log(
    'URL après le choix de Grammatur :',
    page.url()
  );

  console.log('===== FIN DE L’ÉTAPE GRAMMATUR BROCHURE =====');
}
async function configureOberflächeBrochure(
    page: Page,
    brochure: Brochure
  ): Promise<void> {
    console.log('===== OBERFLÄCHE BROCHURE =====');

    const boutonOberfläche = page.getByRole('button', {
      name: brochure.oberflaeche,
      exact: true,
    });

    await boutonOberfläche.waitFor({ state: 'visible' });
    await boutonOberfläche.click();

    console.log('Oberfläche sélectionnée :', brochure.oberflaeche);
    console.log(
      'URL après le choix de Oberfläche Brochure :',
      page.url()
    );

    console.log('===== FIN DE L’ÉTAPE OBERFLÄCHE BROCHURE =====');
  }
// Dès 12 Seiten : seule la Grammatur de l'Umschlag est demandée en ligne.
async function configureUmschlagBrochure(page: Page, brochure: Brochure): Promise<void> {
  if (!brochure.grammaturUmschlag) return;
  console.log('===== UMSCHLAG BROCHURE =====');

  const grammatur = page.getByRole('button', { name: brochure.grammaturUmschlag, exact: true });
  await grammatur.waitFor({ state: 'visible' });
  await grammatur.click();

  console.log('===== FIN DE L’ÉTAPE UMSCHLAG BROCHURE =====');
}

export {configureUmschlagBrochure, configureUmfangBrochure, configureGrammaturBrochure, configureOberflächeBrochure };
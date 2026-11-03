import {  type Page } from '@playwright/test';
import { Flyer } from '../../types/Flyer';
async function configureUmfangFlyer(
    page: Page,
  flyer: Flyer
): Promise<void> {
  console.log('===== UMFANG FLYER =====');

  const umfangFlyer = page.getByRole('button', {
    name: `${flyer.umfang} Seiten`,
    exact: true,
  });
  await umfangFlyer.waitFor({ state: 'visible' });
  await umfangFlyer.click();

  console.log(`${flyer.umfang} Seiten sélectionné pour Umfang Flyer`);
  console.log('URL après le choix de Umfang Flyer :', page.url());

  console.log('===== FIN DE L’ÉTAPE UMFANG FLYER =====');
}
async function configureAnzahlFlyer(
  page: Page,
  flyer: Flyer
): Promise<void> {
  console.log('===== ANZAHL FLYER =====');

  const anzahlFlyer = page.locator(`button[name="quantity"][value="${flyer.anzahl}"]`);
  await anzahlFlyer.waitFor({ state: 'visible' });
  await anzahlFlyer.click();

  console.log('Anzahl sélectionnée :', flyer.anzahl);
  console.log('URL après le choix de Anzahl Flyer :', page.url());

  console.log('===== FIN DE L’ÉTAPE ANZAHL FLYER =====');
}
async function configureGrammaturFlyer(
  page: Page,
  flyer: Flyer
): Promise<void> {
  console.log('===== GRAMMATUR FLYER =====');

  const boutonGrammatur = page.getByRole('button', {
    name: flyer.grammatur,
    exact: true,
  });

  await boutonGrammatur.waitFor({ state: 'visible' });
  await boutonGrammatur.click();

  console.log('Grammatur sélectionnée :', flyer.grammatur);
  console.log(
    'URL après le choix de Grammatur :',
    page.url()
  );

  console.log('===== FIN DE L’ÉTAPE GRAMMATUR FLYER =====');
}
async function configureOberflächeFlyer(
    page: Page,
    flyer: Flyer
  ): Promise<void> {
    console.log('===== OBERFLÄCHE FLYER =====');

    const boutonOberfläche = page.getByRole('button', {
      name: flyer.oberflaeche,
      exact: true,
    });

    await boutonOberfläche.waitFor({ state: 'visible' });
    await boutonOberfläche.click();

    console.log('Oberfläche sélectionnée :', flyer.oberflaeche);
    console.log(
      'URL après le choix de Oberfläche Flyer :',
      page.url()
    );

    console.log('===== FIN DE L’ÉTAPE OBERFLÄCHE FLYER =====');
  }
export {configureAnzahlFlyer, configureUmfangFlyer, configureGrammaturFlyer, configureOberflächeFlyer };
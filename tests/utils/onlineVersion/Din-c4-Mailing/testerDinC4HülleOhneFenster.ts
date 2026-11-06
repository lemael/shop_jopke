import type { Flyer, FlyerNummer } from '../../../types/Flyer';
import type { ChoixPiecesJointes } from '../../../pages/online/OnlineConfiguratorPageDin-c4-Mailing';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { configureUmfangFlyer, configureOberflächeFlyer, configureGrammaturFlyer } from '../configureFlyer';
import { extraireRecapitulation } from '../extraireRecap';
import { cliquerWeiter } from '../cliquerWeiter';
import { configurerAuflage } from '../configureAuflage';
import { Huelle } from '../../../types/Huelle';
import { Brochure } from '../../../types/Brochure';
import { configureUmfangBrochure, configureGrammaturBrochure, configureOberflächeBrochure } from '../configureBrochure';

import { configureFarbigkeitHuelle } from '../configureHuelle';

async function testerCombinaisonsPiecesJointesDinC4HülleOhneFenster(
  page: Page,
  numeroFlyer: FlyerNummer,
  choix: ChoixPiecesJointes,
  quantite1: number,
  huelle: Huelle,
  flyer: Flyer,
  brochure: Brochure
  
) {
  const combinaisons = {
    flyer: {
      nom: 'Flyer seul',
      flyer: true,
      brochure: false,
    },
    brochure: {
      nom: 'Brochure seule',
      flyer: false,
      brochure: true,
    },
  };

  const combinaison = combinaisons[choix];

  console.log(`Scénario : ${combinaison.nom}`);

  const checkboxFlyer = page.locator('#toggle-F1400');
  const checkboxBrochure = page.locator('#toggle-B1400');

 

  // 2. Configurer le Flyer
  if (combinaison.flyer) {
    if (!(await checkboxFlyer.isChecked())) {
      await page.locator('label[for="toggle-F1400"]').click();
    }
      // Construire le sélecteur selon le numéro choisi
   

    const flyerChoisi = page.locator(`#F1400x${numeroFlyer}`);
    const labelFlyer = page.locator(
      `label[for="${`F1400x${numeroFlyer}`}"]`
    );

    console.log(`Sélection du Flyer ${numeroFlyer}...`);



    await labelFlyer.waitFor({ state: 'visible' });
    await labelFlyer.click();

    await expect(flyerChoisi).toBeChecked();

    console.log(`Flyer ${numeroFlyer} sélectionné.`);
  } else if (await checkboxFlyer.isChecked()) {
    await page.locator('label[for="toggle-F1400"]').click();
  }

  // 3. Configurer la Broschüre
  if (combinaison.brochure) {
    if (!(await checkboxBrochure.isChecked())) {
      await page.locator('label[for="toggle-B1400"]').click();
    }

    console.log('Broschüre activée.');
  } else if (await checkboxBrochure.isChecked()) {
    await page.locator('label[for="toggle-B1400"]').click();
  }

  // 4. Vérifier les options sélectionnées
  const selectionFinale = {
    flyer: await checkboxFlyer.isChecked(),
    brochure: await checkboxBrochure.isChecked(),
  };

  console.log('Sélection finale :', selectionFinale);

  if (
    selectionFinale.flyer !== combinaison.flyer ||
    selectionFinale.brochure !== combinaison.brochure
  ) {
    throw new Error(
      `La sélection ne correspond pas au scénario "${combinaison.nom}".`
    );
  }

  // 5. Passer à la page récapitulative des pièces jointes
  console.log('Clic sur Weiter...');

  await page.locator('#configurator-form button.next').click();

  await page.waitForLoadState('domcontentloaded').catch(() => {});

  console.log('URL après Weiter :', page.url());
  console.log('===== PAGE RÉCAPITULATIVE =====');
 // console.log(await this.page.locator('body').innerText());

  // 6. Cliquer sur Produkt konfigurieren
  console.log('Clic sur Produkt konfigurieren...');

  const boutonKonfigurieren = page.locator(
    'a.button.next[href^="/konfigurator/"]'
  );

  await boutonKonfigurieren.waitFor({ state: 'visible' });
  await boutonKonfigurieren.click();

  await page.waitForURL('**/konfigurator/**');

  console.log('URL après Produkt konfigurieren :', page.url());
  console.log('===== Auflage =====');
  // 7. Saisir la quantité
  await configurerAuflage(page, quantite1);
  

  console.log('===== Farbigkeit Hülle =====');
  // 9. Choisir la couleur d'impression
  await configureFarbigkeitHuelle(page, huelle);
 console.log('===== FIN DE L’ÉTAPE COULEUR HÜLLE =====');
  // 10. Cliquer sur Weiter sur l'étape suivante
  await cliquerWeiter(page);
  console.log('===== Grammatur Hülle automatique ausgefüllt =====');

  if (choix === 'flyer') {
  console.log('===== Configuration du Flyer =====');
  await configureUmfangFlyer(page, flyer);
  await configureGrammaturFlyer(page, flyer);
  await configureOberflächeFlyer(page, flyer);
  console.log('===== Configuration du Flyer terminée =====');
  console.log('=====Preisübersicht =====');

console.log('===== EXTRACTION DES PRIX ET DES PRODUITS =====');

  const recapOnline = await extraireRecapitulation(page, flyer);

console.log('PRIX ONLINE RÉCUPÉRÉS :');
console.table(recapOnline.prix);
  }
  if (choix === 'brochure') {
    console.log('===== Configuration de la Brochure =====');
    await configureUmfangBrochure(page, brochure);
    await configureGrammaturBrochure(page, brochure);
    await configureOberflächeBrochure(page, brochure);
    console.log('===== Configuration de la Brochure terminée =====');
    console.log('=====Preisübersicht =====');

    console.log('===== EXTRACTION DES PRIX ET DES PRODUITS =====');

    const recapOnline = await extraireRecapitulation(page);

    console.log('PRIX ONLINE RÉCUPÉRÉS :');
    console.table(recapOnline.prix);
  }
  

}
export { testerCombinaisonsPiecesJointesDinC4HülleOhneFenster };
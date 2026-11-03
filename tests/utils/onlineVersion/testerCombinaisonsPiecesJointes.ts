import type { Flyer, FlyerNummer } from '../../types/Flyer';
import { writeFile } from 'node:fs/promises';
import type { ChoixPiecesJointes } from '../../pages/OnlineConfiguratorPage';
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { configureUmfangFlyer, configureOberflächeFlyer, configureGrammaturFlyer } from './configureFlyer';
import { extraireRecapitulation } from './extraireRecap';
import { cliquerWeiter } from './cliquerWeiter';
import { configureGrammaturAnschreiben, configureFarbigkeitAnschreiben } from './configureAnschreiben';
import { configurerAuflage } from './configureAuflage';
import { Huelle } from '../../types/Huelle';
import { Brochure } from '../../types/Brochure';

import { Anschreiben } from '../../types/Anschreiben';
import { configureFarbigkeitHuelle } from './configureHuelle';

async function testerCombinaisonsPiecesJointes(
  page: Page,
  numeroFlyer: FlyerNummer,
  choix: ChoixPiecesJointes,
  quantite1: number,
  huelle: Huelle,
  anschreiben: Anschreiben,
  flyer: Flyer,
 // brochure: Brochure
  
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
    'les-deux': {
      nom: 'Flyer et brochure',
      flyer: true,
      brochure: true,
    },
  };

  const combinaison = combinaisons[choix];

  console.log(`Scénario : ${combinaison.nom}`);

  const checkboxAnschreiben = page.locator('#toggle-A1400');
  const checkboxFlyer = page.locator('#toggle-F1400');
  const checkboxBrochure = page.locator('#toggle-B1400');

  // 1. Garantir la sélection de l'Anschreiben
  if (!(await checkboxAnschreiben.isChecked())) {
    if (await checkboxAnschreiben.isDisabled()) {
      throw new Error(
        'Anschreiben est désactivé et n’est pas sélectionné.'
      );
    }

    await page.locator('label[for="toggle-A1400"]').click();
  }

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
    anschreiben: await checkboxAnschreiben.isChecked(),
    flyer: await checkboxFlyer.isChecked(),
    brochure: await checkboxBrochure.isChecked(),
  };

  console.log('Sélection finale :', selectionFinale);

  if (
    !selectionFinale.anschreiben ||
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
    'a.button.next[href="/konfigurator/fensterhulle-1/anschreiben-bis-zu-3-flyer-2"]'
  );

  await boutonKonfigurieren.waitFor({ state: 'visible' });
  await boutonKonfigurieren.click();

  await page.waitForURL(
    '**/konfigurator/fensterhulle-1/anschreiben-bis-zu-3-flyer-2'
  );

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
  console.log('===== Grammatur Anschreiben =====');
  // 11. cliquer sur 80 g/m²
  await configureGrammaturAnschreiben(page, anschreiben);
  console.log('===== Farbigkeit Anschreiben=====');
  // 12. Choisir la Farbigkeit pour Anschreiben
  await configureFarbigkeitAnschreiben(page, anschreiben);
 
  console.log('===== Anschreiben DIN A4 abgeschlossen =====');
  await cliquerWeiter(page);

  console.log('===== Configuration du Flyer =====');
  await configureUmfangFlyer(page, flyer);
  await configureGrammaturFlyer(page, flyer);
  await configureOberflächeFlyer(page, flyer);
  console.log('===== Configuration du Flyer terminée =====');
  console.log('=====Preisübersicht =====');

console.log('===== EXTRACTION DES PRIX ET DES PRODUITS =====');
 /*
  await page.waitForURL('**/ /*order-overview');
  await page.getByText(/Gesamt\s*\(netto\)/).waitFor({ state: 'visible' });

  const html = await page.content();
  await writeFile('./debug-online.html', html, 'utf-8');

  console.log('[HTML] Page des prix sauvegardée dans tests/debug-online.html');
  console.log('[HTML] Taille :', html.length, 'caractères');
*/
  const recapOnline = await extraireRecapitulation(page, flyer);

console.log('PRIX ONLINE RÉCUPÉRÉS :');
console.table(recapOnline.prix);

}
export { testerCombinaisonsPiecesJointes };
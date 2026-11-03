import type { Flyer, FlyerNummer } from '../../types/Flyer';
import type { ChoixPiecesJointes } from '../../pages/OnlineConfiguratorPage';
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { configureAnzahlFlyer, configureUmfangFlyer, configureOberflächeFlyer, configureGrammaturFlyer } from '../local/configureFlyer';
import { configurerAustattung } from './configureAustattung';
import { extraireRecapitulation } from './extraireRecap';

import { configureGrammaturAnschreiben, configureFarbigkeitAnschreiben } from './configureAnschreiben';
import { configurerAuflage } from './configureAuflage';
import { Huelle } from '../../types/Huelle';
import { Brochure } from '../../types/Brochure';

import { Anschreiben } from '../../types/Anschreiben';
import { configureFarbigkeitHuelle } from './configureHuelle';

async function testerCombinaisonsPiecesJointes(
  page: Page,
  quantite1: number,
  austattung: string,
  huelle: Huelle,
  anschreiben: Anschreiben,
  flyer: Flyer,
 // brochure: Brochure
  
) {




  await configurerAustattung(page, austattung);

  console.log('===== Auflage =====');
  // 7. Saisir la quantité
  await configurerAuflage(page, quantite1);
  

  console.log('===== Farbigkeit Hülle =====');
  // 9. Choisir la couleur d'impression
  await configureFarbigkeitHuelle(page, huelle);
 console.log('===== FIN DE L’ÉTAPE  HÜLLE =====');
 
   console.log('===== Anzahl Flyer =====');
   await configureAnzahlFlyer(page, flyer);
   if (!flyer.anzahl) {
     throw new Error('Le nombre de Flyers doit être défini.');
   }
   for (let numeroFlyer = 1; numeroFlyer <= flyer.anzahl; numeroFlyer++) {
     console.log(`===== Configuration du Flyer ${numeroFlyer} =====`);
     await configureUmfangFlyer(page, flyer);
     await configureGrammaturFlyer(page, flyer);
     await configureOberflächeFlyer(page, flyer);
   }
   console.log('===== Configuration des Flyers terminée =====');
  console.log('===== Grammatur Hülle automatique ausgefüllt =====');
  console.log('===== Grammatur Anschreiben =====');
  // 11. cliquer sur 80 g/m²
  await configureGrammaturAnschreiben(page, anschreiben);
  console.log('===== Farbigkeit Anschreiben=====');
  // 12. Choisir la Farbigkeit pour Anschreiben
  await configureFarbigkeitAnschreiben(page, anschreiben);
 
  console.log('===== Anschreiben DIN A4 abgeschlossen =====');
  

  console.log('=====Preisübersicht =====');

console.log('===== EXTRACTION DES PRIX ET DES PRODUITS =====');

await extraireRecapitulation(page);

}
export { testerCombinaisonsPiecesJointes };
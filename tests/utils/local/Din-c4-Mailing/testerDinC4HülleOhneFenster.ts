import type { Flyer} from '../../../types/Flyer';

import type {  Page } from '@playwright/test';

import { configureAnzahlFlyer, configureUmfangFlyer, configureOberflächeFlyer, configureGrammaturFlyer } from '../configureFlyer';
import { configureUmfangBrochure, configureGrammaturBrochure, configureOberflächeBrochure, configureUmschlagBrochure } from '../configureBrochure';

import { configurerAustattung } from '../configureAustattung';
import { extraireRecapitulation } from '../extraireRecap';

import { configurerAuflage } from '../configureAuflage';
import { Huelle } from '../../../types/Huelle';
import { Brochure } from '../../../types/Brochure';

import { configureFarbigkeitHuelle } from '../configureHuelle';


async function testerCombinaisonsPiecesJointesDinC4HülleOhneFenster(
  page: Page,
  quantite1: number,
  austattung: string,
  huelle: Huelle,
  flyer: Flyer,
  brochure: Brochure
  
) {




  await configurerAustattung(page, austattung);

  console.log('===== Auflage =====');
  // 7. Saisir la quantité
  await configurerAuflage(page, quantite1);
  

  console.log('===== Farbigkeit Hülle =====');
  // 9. Choisir la couleur d'impression
  await configureFarbigkeitHuelle(page, huelle);
 console.log('===== FIN DE L’ÉTAPE  HÜLLE =====');
  if(austattung.toLowerCase().includes('flyer')) {
   console.log('===== Anzahl Flyer =====');
  const nombreFlyers = flyer.anzahl ?? 1;
  await configureAnzahlFlyer(page, { ...flyer, anzahl: nombreFlyers });
  for (let numeroFlyer = 1; numeroFlyer <= nombreFlyers; numeroFlyer++) {
    console.log(`===== Configuration du Flyer ${numeroFlyer} =====`);
    await configureUmfangFlyer(page, flyer);
    await configureGrammaturFlyer(page, flyer);
    await configureOberflächeFlyer(page, flyer);
  }
  console.log('===== Configuration des Flyers terminée =====');
 }
 console.log('===== Grammatur Hülle automatique ausgefüllt =====');

 if(austattung.toLowerCase().includes('broschüre')) {
    console.log('===== Configuration Brochure =====');
    // Ajouter ici la configuration spécifique pour la Brochure si nécessaire
    await configureUmfangBrochure(page, brochure);
    await configureGrammaturBrochure(page, brochure);
    await configureOberflächeBrochure(page, brochure);
    await configureUmschlagBrochure(page, brochure, brochure.grammatur);
    console.log('===== Configuration Brochure terminée =====');
  }
  console.log('=====Preisübersicht =====');

console.log('===== EXTRACTION DES PRIX ET DES PRODUITS =====');

await extraireRecapitulation(page);

}
export { testerCombinaisonsPiecesJointesDinC4HülleOhneFenster };
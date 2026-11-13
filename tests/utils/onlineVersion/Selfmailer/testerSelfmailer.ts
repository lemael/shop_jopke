import type { Selfmailer } from '../../../types/Selfmailer';

import type { Page } from '@playwright/test';


import { extraireRecapitulation } from './extraireRecap';
import { cliquerWeiter } from '../cliquerWeiter';

import { configurerAuflage } from '../configureAuflage';
import { configureUmfang, configureGrammatur, configurePerforation } from './configureSelfmailer';



async function testerCombinaisonsPiecesJointesSelfmailer(
  page: Page,
  quantite1: number,
  selfmailer: Selfmailer,
  
) {

  await cliquerWeiter(page);
  console.log('===== Auflage =====');
  // 7. Saisir la quantité
  await configurerAuflage(page, quantite1);
  

  console.log('===== Umfang =====');
  // 9. Choisir la couleur d'impression
  await configureUmfang(page, selfmailer);
 console.log('===== FIN DE umfang =====');
 
  console.log('===== Grammatur =====');
  
  // 11. cliquer sur 80 g/m²
  await configureGrammatur(page, selfmailer);
  console.log('===== Perforation =====');
  // 12. Choisir la Farbigkeit pour Anschreiben
  await configurePerforation(page, selfmailer);
 
 

  console.log('=====Preisübersicht =====');

console.log('===== EXTRACTION DES PRIX ET DES PRODUITS =====');

  const recapOnline = await extraireRecapitulation(page);


  

}
export { testerCombinaisonsPiecesJointesSelfmailer };
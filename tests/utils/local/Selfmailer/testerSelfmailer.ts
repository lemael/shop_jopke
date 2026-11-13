import type { Flyer} from '../../../types/Flyer';

import type {  Page } from '@playwright/test';

import { extraireRecapitulation } from '../extraireRecap';


import { configurerAuflage } from '../configureAuflage';
import { configureUmfang, configureGrammatur, configurePerforation } from './configurerSelfmailer'; 


import { Selfmailer } from '../../../types/Selfmailer';


async function testerCombinaisonsPiecesJointes(
  page: Page,
  quantite1: number,
  selfmailer: Selfmailer,

  
) {


  console.log('===== Auflage =====');
  // 7. Saisir la quantité
  await configurerAuflage(page, quantite1);
  

  console.log('===== Umfang =====');
  
  await configureUmfang(page, selfmailer);


 
  console.log('===== Grammatur=====');

    await configureGrammatur(page, selfmailer);
  console.log('===== Perforation =====');
    await configurePerforation(page, selfmailer);
  

  console.log('=====Preisübersicht =====');

console.log('===== EXTRACTION DES PRIX ET DES PRODUITS =====');

await extraireRecapitulation(page);

}
export { testerCombinaisonsPiecesJointes };
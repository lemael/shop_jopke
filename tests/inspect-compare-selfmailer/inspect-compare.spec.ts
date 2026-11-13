import { test } from '@playwright/test';
import type { Selfmailer } from '../types/Selfmailer';

import { LocalConfiguratorPageSelfmailer } from '../pages/local/selfmailer/LocalConfiguratorPageSelfmailer';
import { OnlineConfiguratorPageSelfmailer } from '../pages/online/selfmailer/OnlineConfiguratorPageSelfmailer';
import { scenarios } from '../data/test-scenariosSelfmailer';

import { extraireConfiguration } from '../utils/comparison/extraireConfiguration';
import { extraireInformationsPrix } from '../utils/comparison/extraireInformationsPrix';
import { comparerConfigurateurs } from '../utils/comparison/selfmailer/comparerConfigurateursSelfmailer';

import { extraireRecapitulation } from '../utils/onlineVersion/Selfmailer/extraireRecap';
import { PrixCompare, RecapitulationOnline,ConfigurationCompareeSelfmailer } from '../types/typeExtractionSelfmailer';

for (const scenario of scenarios) {
test(`Comparer les configurateurs : ${scenario.name}`, async ({ browser }) => {
  // Local + online enchaînés : 30 s par défaut ne suffisent pas.
  test.setTimeout(120_000);

  // ==========================================
  // 1. CONFIGURATION COMMUNE
  // ==========================================

  // Valeurs vides pour la pièce jointe non utilisée dans le scénario.
  const selfmailerVide: Selfmailer = {
    type: '',
    umfang: '',
    grammatur: '',
    perforation: '',
  };


  const urlLocal =
    'https://frontend-production-d09b.up.railway.app/shop';

  const urlOnline =
    'https://www.jopke.de/shop';
  const { type, typeOnline, quantite } =
    scenario;
  const selfmailer = scenario.selfmailer ?? selfmailerVide;
  

  const context = await browser.newContext();

  const pageLocal = await context.newPage();
  const pageOnline = await context.newPage();

  try {

    // ==========================================
    // 2. CONFIGURATEUR LOCAL
    // ==========================================

    console.log('\n========== CONFIGURATEUR LOCAL ==========');

    const configurateurLocal = new LocalConfiguratorPageSelfmailer(
      pageLocal,
      urlLocal,
      type,
      quantite,
      selfmailer
    );

    await configurateurLocal.öffnenPage(type);

    // Enchaîne Auflage → Umfang → Grammatur → Perforation → Übersicht.
    await configurateurLocal.testerCombinaisonsPiecesJointes();


    // Extraction de la configuration locale

    const configurationLocale =
      await extraireConfiguration(pageLocal);

    // Extraction des prix locaux

    const prixLocal =
      await extraireInformationsPrix(pageLocal);

    console.log('CONFIGURATION LOCALE :', configurationLocale);
    console.log('PRIX LOCAL :', prixLocal);


    // ==========================================
    // 3. NORMALISATION LOCALE
    // ==========================================

    const configurationLocaleComparee: ConfigurationCompareeSelfmailer = {

      // La récap locale n'affiche pas le type : on reprend celui du scénario.
      typ:
        type,


      auflage:
        configurationLocale['Auflage'],


      umfang:
        configurationLocale['Umfang'],


      grammatur:
        configurationLocale['Grammatur'],

      perforation:
        configurationLocale['Perforation'],


    };


    const prixLocalCompare: PrixCompare = {

      produit:
        prixLocal['Druck (netto)'],

      porto:
        prixLocal['Porto (max., netto)'],
      express:
        prixLocal['Express'],

      totalNet:
        prixLocal['Gesamt (netto)'],

      tva:
        prixLocal['zzgl. 19% MwSt.'],

      totalBrut:
        prixLocal['Gesamt (brutto)'],
      gewichtProSendung:
        prixLocal['Gewicht pro Sendung'],
      gesamtgewicht:
        prixLocal['Gesamtgewicht'],
    };


    // ==========================================
    // 4. CONFIGURATEUR ONLINE
    // ==========================================

    console.log('\n========== CONFIGURATEUR ONLINE ==========');

    const configurateurOnline = new OnlineConfiguratorPageSelfmailer(
      pageOnline,
      typeOnline,
      quantite,
      selfmailer
    );

    await configurateurOnline.öffnenPage(urlOnline);

    // Le bandeau cookies recouvre le bouton "Produkt konfigurieren".
    await configurateurOnline.accepterCookiesNecessaires();

    await configurateurOnline.testerCombinaisonsPiecesJointes();


    // ==========================================
    // 5. EXTRACTION ONLINE
    // ==========================================

    // On récupère directement les données détaillées
    // depuis la page après sa configuration.
    const recapOnline: RecapitulationOnline =
      await extraireRecapitulation(pageOnline);

    console.log('\nRÉCAPITULATION ONLINE :');
    console.log(JSON.stringify(recapOnline, null, 2));


    // ==========================================
    // 6. RECHERCHE DES PRODUITS ONLINE
    // ==========================================



    // ==========================================
    // 7. NORMALISATION CONFIGURATION ONLINE
    // ==========================================

    const configurationOnlineComparee: ConfigurationCompareeSelfmailer = {

      typ:
        type,

    

      auflage:
        `${recapOnline.quantite} Stück`,

      // Le Selfmailer est un produit unique : toutes ses caractéristiques
      // sont dans recapOnline.caracteristiques.
      umfang:
        recapOnline.caracteristiques['Umfang'] ?? '',

      grammatur:
        recapOnline.caracteristiques['Grammatur'] ?? '',

      perforation:
        recapOnline.caracteristiques['Perforation'] ?? '',

    };


    // ==========================================
    // 8. NORMALISATION PRIX ONLINE
    // ==========================================
   function normaliserPrix(prix: string): string {
      const valeur = Number(
        prix
          .replace(/\s/g, '')
          .replace(/\./g, '')
          .replace(',', '')
          .replace(/[^\d-]/g, '')
      );

      if (Number.isNaN(valeur)) {
        throw new Error(`Prix invalide : ${prix}`);
      }

      return `${(valeur / 100).toFixed(2).replace('.', ',')} €`;
    }
    const prixOnlineCompare: PrixCompare = {

        produit: normaliserPrix(recapOnline.prix.produit),

        porto: normaliserPrix(recapOnline.prix.porto),
        express: normaliserPrix(recapOnline.prix.express),

        totalNet: normaliserPrix(recapOnline.prix.totalNet),

        tva: normaliserPrix(recapOnline.prix.tva),

        totalBrut: normaliserPrix(recapOnline.prix.totalBrut),
        gewichtProSendung: `${recapOnline.prix.gewichtProSendung} g`,
        gesamtgewicht: `${recapOnline.prix.gesamtgewicht} kg`,

    };


    // ==========================================
    // 9. AFFICHAGE DES DONNÉES NORMALISÉES
    // ==========================================

    console.log('\n========== OBJETS NORMALISÉS ==========');

    console.log('\nCONFIGURATION LOCALE :');
    console.table(configurationLocaleComparee);

    console.log('\nCONFIGURATION ONLINE :');
    console.table(configurationOnlineComparee);

    console.log('\nPRIX LOCAL :');
    console.table(prixLocalCompare);

    console.log('\nPRIX ONLINE :');
    console.table(prixOnlineCompare);


    // ==========================================
    // 10. COMPARAISON
    // ==========================================

    console.log('\n========== COMPARAISON DES CONFIGURATEURS ==========');

    await comparerConfigurateurs(
      configurationLocaleComparee,
      configurationOnlineComparee,
      prixLocalCompare,
      prixOnlineCompare,
      scenario.name
    );

    console.log('\n========== FIN DE LA COMPARAISON ==========');

  } finally {

    await context.close();

  }
});
}
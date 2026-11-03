import { test } from '@playwright/test';
import type {
  ConfigurationComparee,
  PrixCompare,
  RecapitulationOnline,
} from './types/typeExtraction';

import { LocalConfiguratorPage } from './pages/LocalConfiguratorPage';
import { OnlineConfiguratorPage } from './pages/OnlineConfiguratorPage';
import { scenarios } from './data/test-scenarios';

import { extraireConfiguration } from './utils/comparison/extraireConfiguration';
import { extraireInformationsPrix } from './utils/comparison/extraireInformationsPrix';
import { comparerConfigurateurs } from './utils/comparison/comparerConfigurateurs';

import { extraireRecapitulation } from './utils/onlineVersion/extraireRecap';

for (const scenario of scenarios) {
test(`Comparer les configurateurs : ${scenario.name}`, async ({ browser }) => {

  // ==========================================
  // 1. CONFIGURATION COMMUNE
  // ==========================================

  const brochure = {
    umfang: '',
    farbigkeit: '',
    grammatur: '',
    oberflaeche: '',
    isChecked: false,
  };

  const urlLocal =
    'https://frontend-production-d09b.up.railway.app/shop/c4_mailing';

  const urlOnline =
    'https://www.jopke.de/shop/din-c4-mailing';
  const { type, choix, ausstattung, quantite, huelle, anschreiben, flyer } =
    scenario;

  const context = await browser.newContext();

  const pageLocal = await context.newPage();
  const pageOnline = await context.newPage();

  try {

    // ==========================================
    // 2. CONFIGURATEUR LOCAL
    // ==========================================

    console.log('\n========== CONFIGURATEUR LOCAL ==========');

    const configurateurLocal = new LocalConfiguratorPage(
      pageLocal,
      urlLocal,
      type,
      quantite,
      ausstattung,
      huelle,
      anschreiben,
      brochure,
      flyer
    );

    await configurateurLocal.öffnenPage();

    await configurateurLocal.wählenTypeHuelle();

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

    const configurationLocaleComparee: ConfigurationComparee = {

      huellentyp:
        configurationLocale['Hüllentyp'],

      ausstattung:
        configurationLocale['Ausstattung'],

      auflage:
        configurationLocale['Auflage'],

      farbigkeitHuelle:
        configurationLocale['Farbigkeit Hülle'],

      grammaturAnschreiben:
        configurationLocale['Grammatur Anschreiben'],

      farbigkeitAnschreiben:
        configurationLocale['Farbigkeit Anschreiben'],

      anzahlFlyer:
        configurationLocale['Anzahl Flyer'] ?? '',

      flyers:
        Object.entries(configurationLocale)
          .filter(([libelle]) => /^Flyer \d+$/.test(libelle))
          .sort(([a], [b]) => Number(a.slice(6)) - Number(b.slice(6)))
          .map(([, valeur]) => valeur)
          .join(' | '),
    };


    const prixLocalCompare: PrixCompare = {

      produit:
        prixLocal['Kuvertiertes Mailing DIN-C4'],

      porto:
        prixLocal['Porto'],
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

    const configurateurOnline = new OnlineConfiguratorPage(
      pageOnline,
      choix,
      quantite,
      huelle,
      anschreiben,
      flyer
    );

    await configurateurOnline.ouvrirPage(urlOnline);

    await configurateurOnline.accepterCookiesNecessaires();

    await configurateurOnline.choisirTypeHuelle(type);

    await configurateurOnline.testerCombinaisonsPiecesJointes(
      quantite,
      flyer.anzahl!,
      choix
    );


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

    const huelleOnline = recapOnline.produits.find(
      p => p.nom.includes('Fensterhülle')
    );

    const anschreibenOnline = recapOnline.produits.find(
      p => p.nom.includes('Anschreiben')
    );

    const flyersOnline = recapOnline.produits
      .filter(p => p.nom.includes('Flyer'))
      .sort((a, b) => a.nom.localeCompare(b.nom));


    // ==========================================
    // 7. NORMALISATION CONFIGURATION ONLINE
    // ==========================================

    const configurationOnlineComparee: ConfigurationComparee = {

      huellentyp:
        type,

      ausstattung:
        ausstattung,

      auflage:
        `${recapOnline.quantite} Stück`,

      farbigkeitHuelle:
        huelleOnline?.caracteristiques['Farbigkeit'] ?? '',

      grammaturAnschreiben:
        anschreibenOnline?.caracteristiques['Grammatur'] ?? '',

      farbigkeitAnschreiben:
        anschreibenOnline?.caracteristiques['Farbigkeit'] ?? '',

      anzahlFlyer:
        String(flyersOnline.length),

      flyers: flyersOnline.length
        ? flyersOnline
            .map(flyerOnline =>
              [
                flyerOnline.caracteristiques['Umfang'],
                flyerOnline.caracteristiques['Grammatur'],
                flyerOnline.caracteristiques['Oberfläche'],
              ]
            .filter(Boolean)
            .join(', ')
            )
            .join(' | ')
        : '',
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
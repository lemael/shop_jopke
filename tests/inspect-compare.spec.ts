import { test } from '@playwright/test';

import type {
  ConfigurationComparee,
  PrixCompare,
  RecapitulationOnline,
} from './types/typeExtraction';

import type { Flyer } from './types/Flyer';

import { LocalConfiguratorPage } from './pages/LocalConfiguratorPage';
import { OnlineConfiguratorPage } from './pages/OnlineConfiguratorPage';

import { extraireConfiguration } from './utils/comparison/extraireConfiguration';
import { extraireInformationsPrix } from './utils/comparison/extraireInformationsPrix';
import { comparerConfigurateurs } from './utils/comparison/comparerConfigurateurs';

// IMPORTANT : adapte ce chemin à l'emplacement réel de ton fichier.
import { extraireRecapitulation } from './utils/onlineVersion/extraireRecap';


test('Comparer le configurateur local et le configurateur en ligne', async ({ browser }) => {

  // ==========================================
  // 1. CONFIGURATION COMMUNE
  // ==========================================

  const type = 'Fensterhülle';
  const choix = 'flyer';
  const ausstattung = 'Anschreiben + bis zu 3 Flyer';
  const quantite = 500;

  const huelle = {
    farbigkeit: '1/1-farbig Schwarz',
  };

  const anschreiben = {
    farbigkeit: '4/0-farbig Euroskala',
    grammatur: '80 g/m²',
    isChecked: true,
  };

  const flyer: Flyer = {
    anzahl: 1,
    umfang: '2',
    farbigkeit: '4/4-farbig Euroskala',
    grammatur: '135 g/m²',
    oberflaeche: 'matt',
    isChecked: true,
  };

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
        configurationLocale['Anzahl Flyer'],

      flyer1:
        configurationLocale['Flyer 1'],
    };


    const prixLocalCompare: PrixCompare = {

      produit:
        prixLocal['Kuvertiertes Mailing DIN-C4'],

      porto:
        prixLocal['Porto'],

      totalNet:
        prixLocal['Gesamt (netto)'],

      tva:
        prixLocal['zzgl. 19% MwSt.'],

      totalBrut:
        prixLocal['Gesamt (brutto)'],
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

    const flyerOnline = recapOnline.produits.find(
      p => p.nom.includes('Flyer')
    );


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
        flyerOnline ? String(flyer.anzahl) : '0',

      flyer1: flyerOnline
        ? [
            flyerOnline.caracteristiques['Umfang'],
            flyerOnline.caracteristiques['Grammatur'],
            flyerOnline.caracteristiques['Oberfläche'],
          ]
            .filter(Boolean)
            .join(', ')
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

  totalNet: normaliserPrix(recapOnline.prix.totalNet),

  tva: normaliserPrix(recapOnline.prix.tva),

  totalBrut: normaliserPrix(recapOnline.prix.totalBrut),

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

    comparerConfigurateurs(
      configurationLocaleComparee,
      configurationOnlineComparee,
      prixLocalCompare,
      prixOnlineCompare
    );

    console.log('\n========== FIN DE LA COMPARAISON ==========');

  } finally {

    await context.close();

  }
});
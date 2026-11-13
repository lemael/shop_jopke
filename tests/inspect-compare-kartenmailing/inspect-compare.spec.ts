import { test } from '@playwright/test';

import { LocalConfiguratorPageKartenmailing } from '../pages/local/kartenmailing/LocalConfiguratorPageKartenmailing';
import { OnlineConfiguratorPageKartenmailing } from '../pages/online/kartenmailing/OnlineConfiguratorPageKartenmailing';
import { scenarios } from '../data/test-scenariosKartenmailing';

import { extraireConfiguration } from '../utils/comparison/extraireConfiguration';
import { extraireInformationsPrix } from '../utils/comparison/extraireInformationsPrix';
import { comparerConfigurateurs } from '../utils/comparison/kartenmailing/comparerConfigurateursKartenmailing';

import { extraireRecapitulation } from '../utils/onlineVersion/Kartenmailing/extraireRecap';
import type {
  ConfigurationCompareeKartenmailing,
  PrixCompare,
  RecapitulationOnline,
} from '../types/typeExtractionKartenmailing';

// Convertit "1.234,56" (format online, sans €) en "1234,56 €".
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

for (const scenario of scenarios) {
test(`Comparer les configurateurs : ${scenario.name}`, async ({ browser }) => {
  // Local + online enchaînés : 30 s par défaut ne suffisent pas.
  test.setTimeout(120_000);

  // ==========================================
  // 1. CONFIGURATION COMMUNE
  // ==========================================

  const urlLocal = 'https://frontend-production-d09b.up.railway.app/shop';
  const urlOnline = 'https://www.jopke.de/shop';

  const { type, typeOnline, quantite, kartenmailing } = scenario;

  const context = await browser.newContext();
  const pageLocal = await context.newPage();
  const pageOnline = await context.newPage();

  try {

    // ==========================================
    // 2. CONFIGURATEUR LOCAL
    // ==========================================

    console.log('\n========== CONFIGURATEUR LOCAL ==========');

    const configurateurLocal = new LocalConfiguratorPageKartenmailing(
      pageLocal,
      urlLocal,
      type,
      quantite,
      kartenmailing
    );

    await configurateurLocal.öffnenPage();

    // Enchaîne Auflage → Papier → Veredelung → Übersicht.
    await configurateurLocal.testerKartenmailing();

    const configurationLocale = await extraireConfiguration(pageLocal);
    const prixLocal = await extraireInformationsPrix(pageLocal);
    const endformatLocal = await configurateurLocal.lireEndformat();

    console.log('CONFIGURATION LOCALE :', configurationLocale);
    console.log('PRIX LOCAL :', prixLocal);


    // ==========================================
    // 3. NORMALISATION LOCALE
    // ==========================================

    const configurationLocaleComparee: ConfigurationCompareeKartenmailing = {
      auflage: configurationLocale['Auflage'],
      endformat: endformatLocal,
      papier: configurationLocale['Papier'],
      veredelung: configurationLocale['Veredelung'],
    };

    const prixLocalCompare: PrixCompare = {
      produit: prixLocal['Druck (netto)'],
      porto: prixLocal['Porto (max., netto)'],
      express: prixLocal['Express'],
      totalNet: prixLocal['Gesamt (netto)'],
      tva: prixLocal['zzgl. 19% MwSt.'],
      totalBrut: prixLocal['Gesamt (brutto)'],
      gewichtProSendung: prixLocal['Gewicht pro Sendung'],
      gesamtgewicht: prixLocal['Gesamtgewicht'],
    };


    // ==========================================
    // 4. CONFIGURATEUR ONLINE
    // ==========================================

    console.log('\n========== CONFIGURATEUR ONLINE ==========');

    const configurateurOnline = new OnlineConfiguratorPageKartenmailing(
      pageOnline,
      typeOnline,
      quantite,
      kartenmailing
    );

    await configurateurOnline.öffnenPage(urlOnline);
    await configurateurOnline.accepterCookiesNecessaires();

    // Enchaîne Produkt konfigurieren → Auflage → Papier → Veredelung → order-overview.
    await configurateurOnline.testerKartenmailing();


    // ==========================================
    // 5. EXTRACTION ONLINE
    // ==========================================

    const recapOnline: RecapitulationOnline = await extraireRecapitulation(pageOnline);

    console.log('\nRÉCAPITULATION ONLINE :');
    console.log(JSON.stringify(recapOnline, null, 2));


    // ==========================================
    // 6. NORMALISATION ONLINE
    // ==========================================

    const configurationOnlineComparee: ConfigurationCompareeKartenmailing = {
      auflage: `${recapOnline.quantite} Stück`,
      endformat: recapOnline.caracteristiques['Endformat'] ?? '',
      papier: recapOnline.caracteristiques['Papier'] ?? '',
      veredelung: recapOnline.caracteristiques['Veredelung'] ?? '',
    };

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
    // 7. AFFICHAGE DES DONNÉES NORMALISÉES
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
    // 8. COMPARAISON
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

import { expect } from '@playwright/test';

import type {
  ConfigurationComparee,
  PrixCompare,
} from '../../types/typeExtraction';

/**
 * Convertit un prix au format allemand (ex. 1.250,50 €)
 * en nombre (1250.50).
 */
function convertirPrixEnNombre(prix: string): number {
  const valeur = Number(
    prix
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.')
  );

  if (!Number.isFinite(valeur)) {
    throw new Error(`Format de prix invalide : ${prix}`);
  }

  return valeur;
}

export function comparerConfigurateurs(
  configurationLocale: ConfigurationComparee,
  configurationOnline: ConfigurationComparee,
  prixLocal: PrixCompare,
  prixOnline: PrixCompare
) {
  console.log('\n========== COMPARAISON DES CONFIGURATIONS ==========');

  const clesConfiguration: (keyof ConfigurationComparee)[] = [
    'huellentyp',
    'ausstattung',
    'auflage',
    'farbigkeitHuelle',
    'grammaturAnschreiben',
    'farbigkeitAnschreiben',
    'anzahlFlyer',
    'flyer1',
  ];

  let differences = 0;

  for (const cle of clesConfiguration) {
    const local = configurationLocale[cle];
    const online = configurationOnline[cle];

    console.log(`\n${cle}:`);
    console.log(`  Local  : ${local}`);
    console.log(`  Online : ${online}`);

    const identique = local === online;

    console.log(identique ? '✓ Identique' : '✗ Différent');

    if (!identique) differences++;
  }

  console.log('\n========== COMPARAISON DES PRIX ==========');

  const clesPrix: (keyof PrixCompare)[] = [
    'produit',
    'porto',
    'totalNet',
    'tva',
    'totalBrut',
  ];

  for (const cle of clesPrix) {
    const local = prixLocal[cle];
    const online = prixOnline[cle];

    const valeurLocale = convertirPrixEnNombre(local);
    const valeurOnline = convertirPrixEnNombre(online);

    const ecart = Math.round((valeurLocale - valeurOnline) * 100) / 100;
    const identique = ecart === 0;

    console.log(`\n${cle}:`);
    console.log(`  Local  : ${local}`);
    console.log(`  Online : ${online}`);
    console.log(`  Écart  : ${ecart > 0 ? '+' : ''}${ecart.toFixed(2).replace('.', ',')} €`);

    console.log(identique ? '✓ Identique' : '✗ Différent');

    if (!identique) differences++;
  }

  console.log('\n========== RÉSULTAT FINAL ==========');
  console.log(`Nombre de différences : ${differences}`);

  expect(
    differences,
    'Les configurations ou les prix des deux configurateurs sont différents.'
  ).toBe(0);
}